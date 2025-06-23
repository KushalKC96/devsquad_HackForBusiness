const db = require('./src/config/database');
const fs = require('fs');

async function updatePropertyImages() {
  try {
    console.log('Starting property image updates...');    // Property images with Nepal-themed variety
    const propertyImages = [
      {
        id: 1,
        images: [
          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop', // Himalayan mountain view
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', // Modern apartment
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'  // Mountain landscape
        ]
      },
      {
        id: 2,
        images: [
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop', // Cozy interior
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', // Apartment building
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'     // Urban setting
        ]
      },
      {
        id: 3,
        images: [
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', // Lakeside view
          'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop', // Villa exterior
          'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop'  // Lake scenery
        ]
      },
      {
        id: 4,
        images: [
          'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop', // Traditional architecture
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', // Heritage building
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'     // Cultural setting
        ]
      },
      {
        id: 5,
        images: [
          'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?w=800&h=600&fit=crop', // Mountain lodge
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Sunrise view
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'  // Lodge interior
        ]      },
      {
        id: 6,
        images: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', // Safari/jungle lodge
          'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop', // Nature lodge
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop'  // Wildlife setting
        ]
      },
      {
        id: 7,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', // Modern apartment
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', // Business district
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'     // Urban view
        ]
      },
      {
        id: 8,
        images: [
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', // Riverside cottage
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain view
          'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop'  // Scenic location
        ]
      },
      {
        id: 9,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', // Luxury penthouse
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', // Premium interior
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'  // City view
        ]
      },
      {
        id: 10,
        images: [
          'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop', // Heritage family house
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', // Traditional setting
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'     // Cultural area
        ]      },
      {
        id: 11,
        images: [
          'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?w=800&h=600&fit=crop', // Adventure base camp
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain adventure
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'  // Base camp facilities
        ]
      },
      {
        id: 12,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', // Modern apartment
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', // Boudha area
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'     // Spiritual setting
        ]
      },
      {
        id: 13,
        images: [
          'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop', // Garden villa
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', // Godavari gardens
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'  // Nature setting
        ]
      },
      {
        id: 14,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', // Airport hotel suite
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', // Business hotel
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'  // Modern amenities
        ]
      },
      {
        id: 15,
        images: [
          'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?w=800&h=600&fit=crop', // Himalayan view lodge
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain panorama
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'  // Dhulikhel setting
        ]      },
      {
        id: 16,
        images: [
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', // Riverside resort
          'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop', // River adventure
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop'  // Trishuli setting
        ]
      },
      {
        id: 17,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', // City center apartment
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', // Urban location
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'     // City view
        ]
      },
      {
        id: 18,
        images: [
          'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop', // Monastery guesthouse
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', // Spiritual retreat
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'     // Peaceful setting
        ]
      },
      {
        id: 19,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop', // Executive suite
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', // Premium accommodation
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'  // Executive facilities
        ]
      },
      {
        id: 20,
        images: [
          'https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?w=800&h=600&fit=crop', // Adventure hostel
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Mountain adventure
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'  // Gorkha heritage
        ]
      }
    ];

    // Update each property with new images
    for (const property of propertyImages) {
      await db('properties')
        .where('id', property.id)
        .update({
          images: JSON.stringify(property.images)
        });
      
      console.log(`Updated property ${property.id} with new images`);
    }

    console.log('✅ All property images updated successfully!');
    console.log(`Updated ${propertyImages.length} properties with beautiful images`);
    
  } catch (error) {
    console.error('❌ Error updating property images:', error);
  }
}

updatePropertyImages();
