const Doctor = require('../models/Doctor');

const sampleDoctors = [
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@mediquick.com",
    phone: "+919876543210",
    specialization: "General Medicine",
    experience: 8,
    qualification: "MBBS, MD",
    consultationFee: 500,
    bio: "Experienced general physician with expertise in preventive healthcare and chronic disease management.",
    isAvailable: true,
    availability: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "17:00", available: true },
      saturday: { start: "09:00", end: "14:00", available: true },
      sunday: { start: "10:00", end: "13:00", available: false }
    },
    rating: 4.5,
    totalConsultations: 145
  },
  {
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@mediquick.com",
    phone: "+919876543211",
    specialization: "Cardiology",
    experience: 12,
    qualification: "MBBS, DM Cardiology",
    consultationFee: 800,
    bio: "Specialist in interventional cardiology and heart disease prevention with over 12 years of experience.",
    isAvailable: true,
    availability: {
      monday: { start: "10:00", end: "18:00", available: true },
      tuesday: { start: "10:00", end: "18:00", available: true },
      wednesday: { start: "10:00", end: "18:00", available: true },
      thursday: { start: "10:00", end: "18:00", available: true },
      friday: { start: "10:00", end: "18:00", available: true },
      saturday: { start: "09:00", end: "15:00", available: true },
      sunday: { start: "10:00", end: "13:00", available: false }
    },
    rating: 4.8,
    totalConsultations: 89
  },
  {
    name: "Dr. Anita Singh",
    email: "anita.singh@mediquick.com",
    phone: "+919876543212",
    specialization: "Dermatology",
    experience: 6,
    qualification: "MBBS, MD Dermatology",
    consultationFee: 600,
    bio: "Dermatologist specializing in skin care, acne treatment, and cosmetic dermatology procedures.",
    isAvailable: true,
    availability: {
      monday: { start: "11:00", end: "19:00", available: true },
      tuesday: { start: "11:00", end: "19:00", available: true },
      wednesday: { start: "11:00", end: "19:00", available: true },
      thursday: { start: "11:00", end: "19:00", available: true },
      friday: { start: "11:00", end: "19:00", available: true },
      saturday: { start: "10:00", end: "16:00", available: true },
      sunday: { start: "10:00", end: "13:00", available: false }
    },
    rating: 4.6,
    totalConsultations: 67
  },
  {
    name: "Dr. Suresh Patel",
    email: "suresh.patel@mediquick.com",
    phone: "+919876543213",
    specialization: "Pediatrics",
    experience: 10,
    qualification: "MBBS, MD Pediatrics",
    consultationFee: 550,
    bio: "Pediatric specialist with focus on child development, vaccinations, and childhood diseases.",
    isAvailable: true,
    availability: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "17:00", available: true },
      saturday: { start: "09:00", end: "14:00", available: true },
      sunday: { start: "10:00", end: "13:00", available: false }
    },
    rating: 4.7,
    totalConsultations: 123
  },
  {
    name: "Dr. Meera Reddy",
    email: "meera.reddy@mediquick.com",
    phone: "+919876543214",
    specialization: "Gynecology",
    experience: 9,
    qualification: "MBBS, MS Gynecology",
    consultationFee: 650,
    bio: "Gynecologist and obstetrician with expertise in women's health and pregnancy care.",
    isAvailable: true,
    availability: {
      monday: { start: "10:00", end: "18:00", available: true },
      tuesday: { start: "10:00", end: "18:00", available: true },
      wednesday: { start: "10:00", end: "18:00", available: true },
      thursday: { start: "10:00", end: "18:00", available: true },
      friday: { start: "10:00", end: "18:00", available: true },
      saturday: { start: "10:00", end: "15:00", available: true },
      sunday: { start: "10:00", end: "13:00", available: false }
    },
    rating: 4.9,
    totalConsultations: 98
  },
  {
    name: "Dr. Amit Gupta",
    email: "amit.gupta@mediquick.com",
    phone: "+919876543215",
    specialization: "Orthopedics",
    experience: 11,
    qualification: "MBBS, MS Orthopedics",
    consultationFee: 700,
    bio: "Orthopedic surgeon specializing in joint replacements, sports injuries, and bone disorders.",
    isAvailable: true,
    availability: {
      monday: { start: "08:00", end: "16:00", available: true },
      tuesday: { start: "08:00", end: "16:00", available: true },
      wednesday: { start: "08:00", end: "16:00", available: true },
      thursday: { start: "08:00", end: "16:00", available: true },
      friday: { start: "08:00", end: "16:00", available: true },
      saturday: { start: "09:00", end: "14:00", available: true },
      sunday: { start: "10:00", end: "13:00", available: false }
    },
    rating: 4.4,
    totalConsultations: 76
  },
  {
    name: "Dr. Kavya Nair",
    email: "kavya.nair@mediquick.com",
    phone: "+919876543216",
    specialization: "Psychiatry",
    experience: 7,
    qualification: "MBBS, MD Psychiatry",
    consultationFee: 750,
    bio: "Mental health specialist providing counseling, therapy, and treatment for psychiatric disorders.",
    isAvailable: true,
    availability: {
      monday: { start: "12:00", end: "20:00", available: true },
      tuesday: { start: "12:00", end: "20:00", available: true },
      wednesday: { start: "12:00", end: "20:00", available: true },
      thursday: { start: "12:00", end: "20:00", available: true },
      friday: { start: "12:00", end: "20:00", available: true },
      saturday: { start: "10:00", end: "16:00", available: true },
      sunday: { start: "10:00", end: "13:00", available: false }
    },
    rating: 4.3,
    totalConsultations: 54
  },
  {
    name: "Dr. Ravi Menon",
    email: "ravi.menon@mediquick.com",
    phone: "+919876543217",
    specialization: "ENT",
    experience: 8,
    qualification: "MBBS, MS ENT",
    consultationFee: 600,
    bio: "ENT specialist treating disorders of ear, nose, throat, and related structures of head and neck.",
    isAvailable: true,
    availability: {
      monday: { start: "09:30", end: "17:30", available: true },
      tuesday: { start: "09:30", end: "17:30", available: true },
      wednesday: { start: "09:30", end: "17:30", available: true },
      thursday: { start: "09:30", end: "17:30", available: true },
      friday: { start: "09:30", end: "17:30", available: true },
      saturday: { start: "09:00", end: "14:00", available: true },
      sunday: { start: "10:00", end: "13:00", available: false }
    },
    rating: 4.2,
    totalConsultations: 82
  }
];

const seedDoctors = async () => {
  try {
    console.log('🏥 Seeding doctors...');
    
    // Check if doctors already exist
    const existingCount = await Doctor.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} doctors already exist. Skipping seeding.`);
      return;
    }
    
    // Create doctors
    const createdDoctors = await Doctor.insertMany(sampleDoctors);
    console.log(`✅ Successfully created ${createdDoctors.length} doctors`);
    
    return createdDoctors;
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    throw error;
  }
};

module.exports = { seedDoctors, sampleDoctors };