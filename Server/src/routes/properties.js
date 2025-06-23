const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { auth, hostAuth } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const propertySchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(10).max(1000).required(), // Reduced min length
  type: Joi.string().valid('apartment', 'house', 'villa', 'cabin', 'hotel').required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  zipCode: Joi.string().allow('').optional().default('00000'), // Allow empty, provide default
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  price: Joi.number().positive().required(),
  currency: Joi.string().default('NPR'),
  bedrooms: Joi.number().integer().min(0).required(),
  bathrooms: Joi.number().integer().min(0).required(),
  maxGuests: Joi.number().integer().min(1).required(),
  amenities: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  availability: Joi.boolean().default(true)
});

// @route GET /api/properties
// @desc Get all properties with filters
// @access Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      maxGuests,
      amenities,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;
    let query = db('properties')
      .join('users', 'properties.host_id', 'users.id')
      .select(
        'properties.*',
        'users.first_name as host_first_name',
        'users.last_name as host_last_name',
        'users.avatar as host_avatar'
      )
      .where('properties.is_active', true)
      .where('properties.availability', true);

    // Apply filters
    if (city) query = query.where('properties.city', 'ilike', `%${city}%`);
    if (type) query = query.where('properties.type', type);
    if (minPrice) query = query.where('properties.price', '>=', minPrice);
    if (maxPrice) query = query.where('properties.price', '<=', maxPrice);
    if (bedrooms) query = query.where('properties.bedrooms', '>=', bedrooms);
    if (maxGuests) query = query.where('properties.max_guests', '>=', maxGuests);
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query = query.whereRaw('properties.amenities @> ?', [JSON.stringify(amenitiesArray)]);
    }

    // Get total count for pagination
    const totalQuery = query.clone().count('* as total');
    const [{ total }] = await totalQuery;

    // Apply sorting and pagination
    const properties = await query
      .orderBy(`properties.${sortBy}`, sortOrder)
      .limit(limit)
      .offset(offset);

    // Get average ratings for each property
    const propertyIds = properties.map(p => p.id);
    const ratings = await db('reviews')
      .select('property_id')
      .avg('rating as avg_rating')
      .count('* as review_count')
      .whereIn('property_id', propertyIds)
      .groupBy('property_id');    // Merge ratings with properties
    const propertiesWithRatings = properties.map(property => {
      const rating = ratings.find(r => r.property_id === property.id);
      return {
        ...property,
        amenities: typeof property.amenities === 'string' ? JSON.parse(property.amenities) : property.amenities,
        images: typeof property.images === 'string' ? JSON.parse(property.images) : property.images,
        avgRating: rating ? parseFloat(rating.avg_rating).toFixed(1) : null,
        reviewCount: rating ? parseInt(rating.review_count) : 0
      };
    });

    res.json({
      success: true,
      data: {
        properties: propertiesWithRatings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: parseInt(total),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting properties'
    });
  }
});

// @route GET /api/properties/:id
// @desc Get single property
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const property = await db('properties')
      .join('users', 'properties.host_id', 'users.id')
      .select(
        'properties.*',
        'users.first_name as host_first_name',
        'users.last_name as host_last_name',
        'users.avatar as host_avatar',
        'users.email as host_email',
        'users.phone as host_phone'
      )
      .where('properties.id', id)
      .where('properties.is_active', true)
      .first();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Get property reviews
    const reviews = await db('reviews')
      .join('users', 'reviews.user_id', 'users.id')
      .select(
        'reviews.*',
        'users.first_name',
        'users.last_name',
        'users.avatar'
      )
      .where('reviews.property_id', id)
      .orderBy('reviews.created_at', 'desc');

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : null;    res.json({
      success: true,
      data: {
        property: {
          ...property,
          amenities: typeof property.amenities === 'string' ? JSON.parse(property.amenities) : property.amenities,
          images: typeof property.images === 'string' ? JSON.parse(property.images) : property.images,
          avgRating,
          reviewCount: reviews.length
        },
        reviews
      }
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting property'
    });
  }
});

// @route POST /api/properties
// @desc Create new property
// @access Private (Host) - but auto-promotes users to hosts
router.post('/', auth, async (req, res) => {
  try {
    // Auto-promote user to host if they're creating a property
    if (req.user.role === 'guest') {
      await db('users')
        .where({ id: req.user.id })
        .update({ role: 'host', updated_at: new Date() });
      
      req.user.role = 'host'; // Update the user object for this request
      console.log(`User ${req.user.email} promoted to host`);
    }    // Check if user is now a host or admin
    if (req.user.role !== 'host' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Host rights required.'
      });
    }

    console.log('Received property data:', req.body);
    
    const { error, value } = propertySchema.validate(req.body);
    if (error) {
      console.error('Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    console.log('Validated data:', value);

    const propertyData = {
      ...value,
      host_id: req.user.id,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };    // Handle field name mapping between frontend and database
    if ('zipCode' in propertyData) {
      propertyData.zip_code = propertyData.zipCode || '00000'; // Ensure non-empty
      delete propertyData.zipCode;
    }
    if ('maxGuests' in propertyData) {
      propertyData.max_guests = propertyData.maxGuests;
      delete propertyData.maxGuests;
    }

    // Convert amenities array to JSON if provided
    if (propertyData.amenities) {
      propertyData.amenities = JSON.stringify(propertyData.amenities);
    }

    // Convert images array to JSON if provided
    if (propertyData.images) {
      propertyData.images = JSON.stringify(propertyData.images);
    }

    console.log('Final property data for database:', propertyData);

    const [property] = await db('properties')
      .insert(propertyData)
      .returning('*');

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: { property }
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating property'
    });
  }
});

// @route PUT /api/properties/:id
// @desc Update property
// @access Private (Host - own properties only)
router.put('/:id', hostAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = propertySchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Check if property exists and belongs to the user
    const existingProperty = await db('properties')
      .where({ id, host_id: req.user.id })
      .first();

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or access denied'
      });
    }

    const updateData = {
      ...value,
      updated_at: new Date()
    };

    // Convert arrays to JSON if provided
    if (updateData.amenities) {
      updateData.amenities = JSON.stringify(updateData.amenities);
    }
    if (updateData.images) {
      updateData.images = JSON.stringify(updateData.images);
    }

    const [property] = await db('properties')
      .where({ id })
      .update(updateData)
      .returning('*');

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: { property }
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating property'
    });
  }
});

// @route DELETE /api/properties/:id
// @desc Delete property (soft delete)
// @access Private (Host - own properties only)
router.delete('/:id', hostAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if property exists and belongs to the user
    const existingProperty = await db('properties')
      .where({ id, host_id: req.user.id })
      .first();

    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or access denied'
      });
    }

    // Soft delete - set is_active to false
    await db('properties')
      .where({ id })
      .update({ 
        is_active: false,
        updated_at: new Date()
      });

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting property'
    });
  }
});

module.exports = router;
