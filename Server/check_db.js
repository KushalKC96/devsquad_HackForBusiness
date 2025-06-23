const db = require('./src/config/database');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Check if properties table exists
    const tableExists = await db.schema.hasTable('properties');
    console.log(`Properties table exists: ${tableExists}`);
    
    if (tableExists) {
      // Get total count of properties
      const count = await db('properties').count('* as count').first();
      console.log(`Total properties in database: ${count.count}`);
      
      // Get sample properties
      const sampleProperties = await db('properties')
        .select('id', 'title', 'city', 'price', 'type', 'images', 'availability')
        .limit(5);
      
      console.log('\n📋 Sample properties:');
      sampleProperties.forEach(prop => {
        console.log(`ID: ${prop.id}`);
        console.log(`Title: ${prop.title}`);
        console.log(`City: ${prop.city}`);
        console.log(`Price: NPR ${prop.price}`);
        console.log(`Type: ${prop.type}`);
        console.log(`Available: ${prop.availability}`);
        
        // Check images
        let images = [];
        try {
          images = typeof prop.images === 'string' ? JSON.parse(prop.images) : prop.images;
        } catch (e) {
          console.log(`Images: Invalid JSON - ${prop.images}`);
        }
        console.log(`Images: ${images.length} images`);
        console.log('---');
      });
      
      // Check availability status
      const availableCount = await db('properties')
        .where('availability', true)
        .count('* as count')
        .first();
      
      console.log(`\n✅ Available properties: ${availableCount.count}`);
      
      // Check recent properties
      const recentProperties = await db('properties')
        .select('id', 'title', 'created_at')
        .orderBy('created_at', 'desc')
        .limit(3);
      
      console.log('\n🆕 Most recent properties:');
      recentProperties.forEach(prop => {
        console.log(`- ${prop.title} (ID: ${prop.id}) - ${prop.created_at}`);
      });
      
    } else {
      console.log('❌ Properties table does not exist!');
    }
    
  } catch (error) {
    console.error('💥 Database error:', error);
  } finally {
    await db.destroy();
  }
}

checkDatabase();
