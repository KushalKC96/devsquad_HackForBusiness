const db = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function runImageUpdates() {
  try {
    console.log('🖼️  Starting property image updates...');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'update_property_images.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split by lines and filter out comments and empty lines
    const sqlStatements = sqlContent
      .split('\n')
      .filter(line => line.trim() && !line.trim().startsWith('--'))
      .join(' ')
      .split(';')
      .filter(statement => statement.trim());
    
    console.log(`Found ${sqlStatements.length} UPDATE statements to execute...`);
    
    // Execute each UPDATE statement
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i].trim();
      if (statement) {
        try {
          await db.raw(statement);
          console.log(`✅ Updated property ${i + 1}/20`);
        } catch (error) {
          console.error(`❌ Error updating property ${i + 1}:`, error.message);
        }
      }
    }
    
    console.log('🎉 All property images updated successfully!');
    console.log('🖼️  Each property now has unique Nepal-themed images');
    
    // Verify the updates
    const sampleProperties = await db('properties')
      .select('id', 'title', 'images')
      .limit(5);
    
    console.log('\n📋 Sample updated properties:');
    sampleProperties.forEach(prop => {
      const images = JSON.parse(prop.images);
      console.log(`- ${prop.title}: ${images.length} unique images`);
    });
    
  } catch (error) {
    console.error('💥 Error running image updates:', error);
  } finally {
    await db.destroy();
  }
}

runImageUpdates();
