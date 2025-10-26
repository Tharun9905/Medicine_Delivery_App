const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Medicine = require('./src/models/Medicine');

const sampleMedicines = [
  {
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    packSize: "10 Tablets",
    mrp: 30.00,
    price: 25.50,
    stock: 100,
    expiryDate: new Date('2025-12-31'),
    images: [{ url: "https://via.placeholder.com/300x300?text=Paracetamol", isPrimary: true }]
  },
  {
    name: "Crocin Advance 650mg",
    category: "Pain Relief", 
    packSize: "15 Tablets",
    mrp: 50.00,
    price: 42.00,
    stock: 75,
    expiryDate: new Date('2026-01-31'),
    images: [{ url: "https://via.placeholder.com/300x300?text=Crocin", isPrimary: true }]
  },
  {
    name: "Dolo 250mg Suspension",
    category: "Pediatric",
    packSize: "60ml Bottle",
    mrp: 40.00,
    price: 35.00,
    stock: 50,
    expiryDate: new Date('2025-11-30'),
    images: [{ url: "https://via.placeholder.com/300x300?text=Dolo", isPrimary: true }]
  },
  {
    name: "Cetirizine 10mg",
    category: "Allergy",
    packSize: "10 Tablets",
    mrp: 25.00,
    price: 18.75,
    stock: 120,
    expiryDate: new Date('2026-03-31'),
    images: [{ url: "https://via.placeholder.com/300x300?text=Cetirizine", isPrimary: true }]
  },
  {
    name: "Amoxicillin 250mg",
    category: "Antibiotics",
    packSize: "10 Capsules",
    mrp: 100.00,
    price: 85.00,
    stock: 80,
    expiryDate: new Date('2025-09-30'),
    images: [{ url: "https://via.placeholder.com/300x300?text=Amoxicillin", isPrimary: true }]
  },
  {
    name: "Vitamin D3 2000 IU",
    category: "Vitamins",
    packSize: "60 Capsules",
    mrp: 500.00,
    price: 450.00,
    stock: 200,
    expiryDate: new Date('2026-06-30'),
    images: [{ url: "https://via.placeholder.com/300x300?text=VitaminD3", isPrimary: true }]
  },
  {
    name: "Omeprazole 20mg",
    category: "Gastro",
    packSize: "14 Capsules",
    mrp: 75.00,
    price: 65.00,
    stock: 90,
    expiryDate: new Date('2025-08-31'),
    images: [{ url: "https://via.placeholder.com/300x300?text=Omeprazole", isPrimary: true }]
  },
  {
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    packSize: "10 Tablets",
    mrp: 40.00,
    price: 32.50,
    stock: 110,
    expiryDate: new Date('2026-02-28'),
    images: [{ url: "https://via.placeholder.com/300x300?text=Ibuprofen", isPrimary: true }]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing medicines
    await Medicine.deleteMany({});
    console.log('Cleared existing medicines');

    // Insert sample medicines one by one
    const createdMedicines = [];
    for (const medicine of sampleMedicines) {
      try {
        const created = await Medicine.create(medicine);
        createdMedicines.push(created);
      } catch (error) {
        console.warn(`Failed to create ${medicine.name}:`, error.message);
      }
    }
    console.log(`Inserted ${createdMedicines.length} medicines`);

    // Display created medicines
    createdMedicines.forEach(med => {
      console.log(`✅ ${med.name} - ₹${med.price} (${med.category})`);
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();