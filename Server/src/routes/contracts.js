const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { auth, hostAuth } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const contractSchema = Joi.object({
  property_id: Joi.number().integer().positive().required(),
  start_date: Joi.date().min('now').required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),
  monthly_rent: Joi.number().positive().required(),
  security_deposit: Joi.number().min(0).optional(),
  fine_amount: Joi.number().min(0).optional(),
  terms_and_conditions: Joi.string().max(5000).optional(),
  is_renewable: Joi.boolean().optional()
});

const terminationSchema = Joi.object({
  termination_reason: Joi.string().min(10).max(500).required()
});

// Helper function to calculate fine amount
const calculateFineAmount = (monthlyRent, startDate, endDate, terminationDate) => {
  const contractLengthMonths = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 30));
  const elapsedMonths = Math.ceil((new Date(terminationDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 30));
  
  // Fine calculation: 1 month rent if terminated in first 6 months, 0.5 month rent after
  if (elapsedMonths < 6) {
    return monthlyRent; // Full month rent as fine
  } else if (elapsedMonths < contractLengthMonths) {
    return monthlyRent * 0.5; // Half month rent as fine
  }
  return 0; // No fine if contract is near completion
};

// @route POST /api/contracts
// @desc Create new long-term contract
// @access Private (Customer)
router.post('/', auth, async (req, res) => {
  try {
    const { error, value } = contractSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { property_id, start_date, end_date, monthly_rent, security_deposit, fine_amount, terms_and_conditions, is_renewable } = value;

    // Check if property exists and is available
    const property = await db('properties')
      .where({ id: property_id, is_active: true })
      .first();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or not available'
      });
    }

    // Check if customer is trying to rent their own property
    if (property.host_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rent your own property'
      });
    }

    // Check for overlapping contracts
    const overlappingContract = await db('long_term_contracts')
      .where('property_id', property_id)
      .whereIn('status', ['active', 'pending'])
      .where(function() {
        this.whereBetween('start_date', [start_date, end_date])
          .orWhereBetween('end_date', [start_date, end_date])
          .orWhere(function() {
            this.where('start_date', '<=', start_date)
              .andWhere('end_date', '>=', end_date);
          });
      })
      .first();

    if (overlappingContract) {
      return res.status(400).json({
        success: false,
        message: 'Property is already booked for the selected dates'
      });
    }

    // Calculate default fine amount if not provided
    const defaultFineAmount = fine_amount || monthly_rent;

    // Create contract
    const contractData = {
      customer_id: req.user.id,
      property_id,
      start_date,
      end_date,
      monthly_rent,
      security_deposit: security_deposit || 0,
      fine_amount: defaultFineAmount,
      terms_and_conditions: terms_and_conditions || 'Standard long-term rental agreement',
      is_renewable: is_renewable || false,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    };

    const [contract] = await db('long_term_contracts')
      .insert(contractData)
      .returning('*');

    // Get contract with related data
    const contractWithDetails = await db('long_term_contracts')
      .join('properties', 'long_term_contracts.property_id', 'properties.id')
      .join('users as customer', 'long_term_contracts.customer_id', 'customer.id')
      .join('users as host', 'properties.host_id', 'host.id')
      .select(
        'long_term_contracts.*',
        'properties.title as property_title',
        'properties.address as property_address',
        'properties.city as property_city',
        'customer.first_name as customer_first_name',
        'customer.last_name as customer_last_name',
        'customer.email as customer_email',
        'host.first_name as host_first_name',
        'host.last_name as host_last_name',
        'host.email as host_email'
      )
      .where('long_term_contracts.contract_id', contract.contract_id)
      .first();

    res.status(201).json({
      success: true,
      message: 'Long-term contract created successfully',
      data: { contract: contractWithDetails }
    });
  } catch (error) {
    console.error('Create contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating contract'
    });
  }
});

// @route GET /api/contracts/:id
// @desc Get specific contract
// @access Private (Customer or Property Owner)
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await db('long_term_contracts')
      .join('properties', 'long_term_contracts.property_id', 'properties.id')
      .join('users as customer', 'long_term_contracts.customer_id', 'customer.id')
      .join('users as host', 'properties.host_id', 'host.id')
      .select(
        'long_term_contracts.*',
        'properties.title as property_title',
        'properties.address as property_address',
        'properties.city as property_city',
        'properties.images as property_images',
        'customer.first_name as customer_first_name',
        'customer.last_name as customer_last_name',
        'customer.email as customer_email',
        'host.first_name as host_first_name',
        'host.last_name as host_last_name',
        'host.email as host_email'
      )
      .where('long_term_contracts.contract_id', id)
      .first();

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    // Check authorization - only customer, host, or admin can view
    const isAuthorized = contract.customer_id === req.user.id || 
                        contract.host_id === req.user.id || 
                        req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this contract'
      });
    }

    res.json({
      success: true,
      data: { contract }
    });
  } catch (error) {
    console.error('Get contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting contract'
    });
  }
});

// @route GET /api/contracts
// @desc List user's contracts (customer or host)
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const { userId, status, role } = req.query;
    const requestingUserId = req.user.id;

    let query = db('long_term_contracts')
      .join('properties', 'long_term_contracts.property_id', 'properties.id')
      .join('users as customer', 'long_term_contracts.customer_id', 'customer.id')
      .join('users as host', 'properties.host_id', 'host.id')
      .select(
        'long_term_contracts.*',
        'properties.title as property_title',
        'properties.address as property_address',
        'properties.city as property_city',
        'properties.images as property_images',
        'customer.first_name as customer_first_name',
        'customer.last_name as customer_last_name',
        'host.first_name as host_first_name',
        'host.last_name as host_last_name'
      );

    // Filter based on user role and permissions
    if (req.user.role === 'admin') {
      // Admin can see all contracts
      if (userId) {
        query = query.where(function() {
          this.where('long_term_contracts.customer_id', userId)
            .orWhere('properties.host_id', userId);
        });
      }
    } else {
      // Regular users can only see their own contracts
      query = query.where(function() {
        this.where('long_term_contracts.customer_id', requestingUserId)
          .orWhere('properties.host_id', requestingUserId);
      });
    }

    // Filter by status if provided
    if (status) {
      query = query.where('long_term_contracts.status', status);
    }

    // Filter by role (as customer or as host)
    if (role === 'customer') {
      query = query.where('long_term_contracts.customer_id', requestingUserId);
    } else if (role === 'host') {
      query = query.where('properties.host_id', requestingUserId);
    }

    const contracts = await query.orderBy('long_term_contracts.created_at', 'desc');

    res.json({
      success: true,
      data: { contracts }
    });
  } catch (error) {
    console.error('List contracts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error listing contracts'
    });
  }
});

// @route PATCH /api/contracts/:id/terminate
// @desc Early terminate contract with fine calculation
// @access Private (Customer only)
router.patch('/:id/terminate', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = terminationSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { termination_reason } = value;

    // Get contract details
    const contract = await db('long_term_contracts')
      .where('contract_id', id)
      .first();

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    // Check if user is the customer
    if (contract.customer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the customer can terminate their contract'
      });
    }

    // Check if contract is active
    if (contract.status !== 'active' && contract.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Contract is not active and cannot be terminated'
      });
    }

    const currentDate = new Date();
    const endDate = new Date(contract.end_date);

    // Check if contract has already ended naturally
    if (currentDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'Contract has already ended'
      });
    }

    // Calculate fine amount
    const fineAmount = calculateFineAmount(
      contract.monthly_rent,
      contract.start_date,
      contract.end_date,
      currentDate
    );

    // Update contract
    const updatedContract = await db('long_term_contracts')
      .where('contract_id', id)
      .update({
        status: 'terminated_early',
        termination_reason,
        terminated_at: currentDate,
        total_fine_applied: fineAmount,
        updated_at: currentDate
      })
      .returning('*');

    // Get updated contract with details
    const contractWithDetails = await db('long_term_contracts')
      .join('properties', 'long_term_contracts.property_id', 'properties.id')
      .join('users as customer', 'long_term_contracts.customer_id', 'customer.id')
      .select(
        'long_term_contracts.*',
        'properties.title as property_title',
        'customer.first_name as customer_first_name',
        'customer.last_name as customer_last_name'
      )
      .where('long_term_contracts.contract_id', id)
      .first();

    res.json({
      success: true,
      message: 'Contract terminated successfully',
      data: { 
        contract: contractWithDetails,
        fine_applied: fineAmount
      }
    });
  } catch (error) {
    console.error('Terminate contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error terminating contract'
    });
  }
});

// @route PATCH /api/contracts/:id/approve
// @desc Approve pending contract (Host only)
// @access Private (Host)
router.patch('/:id/approve', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get contract with property details
    const contract = await db('long_term_contracts')
      .join('properties', 'long_term_contracts.property_id', 'properties.id')
      .select('long_term_contracts.*', 'properties.host_id')
      .where('long_term_contracts.contract_id', id)
      .first();

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    // Check if user is the property host
    if (contract.host_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the property owner can approve contracts'
      });
    }

    // Check if contract is pending
    if (contract.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Contract is not pending approval'
      });
    }

    // Update contract status to active
    await db('long_term_contracts')
      .where('contract_id', id)
      .update({
        status: 'active',
        updated_at: new Date()
      });

    // Get updated contract with details
    const updatedContract = await db('long_term_contracts')
      .join('properties', 'long_term_contracts.property_id', 'properties.id')
      .join('users as customer', 'long_term_contracts.customer_id', 'customer.id')
      .select(
        'long_term_contracts.*',
        'properties.title as property_title',
        'customer.first_name as customer_first_name',
        'customer.last_name as customer_last_name'
      )
      .where('long_term_contracts.contract_id', id)
      .first();

    res.json({
      success: true,
      message: 'Contract approved successfully',
      data: { contract: updatedContract }
    });
  } catch (error) {
    console.error('Approve contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving contract'
    });
  }
});

// @route PATCH /api/contracts/:id
// @desc Update contract (limited fields, no price changes)
// @access Private (Customer or Host)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const allowedUpdates = ['terms_and_conditions', 'is_renewable'];
    const updates = {};

    // Filter allowed updates
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid updates provided'
      });
    }

    // Get contract to check authorization
    const contract = await db('long_term_contracts')
      .join('properties', 'long_term_contracts.property_id', 'properties.id')
      .select('long_term_contracts.*', 'properties.host_id')
      .where('long_term_contracts.contract_id', id)
      .first();

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    // Check authorization
    const isAuthorized = contract.customer_id === req.user.id || 
                        contract.host_id === req.user.id || 
                        req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this contract'
      });
    }

    // Update contract
    updates.updated_at = new Date();
    await db('long_term_contracts')
      .where('contract_id', id)
      .update(updates);

    // Get updated contract
    const updatedContract = await db('long_term_contracts')
      .where('contract_id', id)
      .first();

    res.json({
      success: true,
      message: 'Contract updated successfully',
      data: { contract: updatedContract }
    });
  } catch (error) {
    console.error('Update contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating contract'
    });
  }
});

module.exports = router;
