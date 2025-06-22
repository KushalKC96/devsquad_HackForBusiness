exports.up = function(knex) {
  return knex.schema.createTable('long_term_contracts', function(table) {
    table.increments('contract_id').primary();
    table.integer('customer_id').unsigned().notNullable();
    table.integer('property_id').unsigned().notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.decimal('monthly_rent', 10, 2).notNullable();
    table.decimal('fine_amount', 10, 2).defaultTo(0);
    table.enum('status', ['active', 'completed', 'terminated_early', 'pending']).defaultTo('pending');
    table.text('terms_and_conditions');
    table.decimal('security_deposit', 10, 2).defaultTo(0);
    table.boolean('is_renewable').defaultTo(false);
    table.text('termination_reason');
    table.timestamp('terminated_at');
    table.decimal('total_fine_applied', 10, 2).defaultTo(0);
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('customer_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('property_id').references('id').inTable('properties').onDelete('CASCADE');
    
    // Indexes
    table.index('customer_id');
    table.index('property_id');
    table.index('status');
    table.index(['start_date', 'end_date']);
    
    // Constraints
    table.check('end_date > start_date', [], 'chk_end_date_after_start');
    table.check('monthly_rent > 0', [], 'chk_positive_rent');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('long_term_contracts');
};
