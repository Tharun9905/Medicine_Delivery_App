const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Doctor = require('../../src/models/Doctor');

describe('Doctor Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    await Doctor.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Doctor Creation', () => {
    test('should create a doctor successfully with valid data', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500,
        bio: 'Test doctor biography'
      };

      const doctor = new Doctor(doctorData);
      const savedDoctor = await doctor.save();

      expect(savedDoctor._id).toBeDefined();
      expect(savedDoctor.name).toBe(doctorData.name);
      expect(savedDoctor.email).toBe(doctorData.email);
      expect(savedDoctor.phone).toBe(doctorData.phone);
      expect(savedDoctor.specialization).toBe(doctorData.specialization);
      expect(savedDoctor.experience).toBe(doctorData.experience);
      expect(savedDoctor.qualification).toBe(doctorData.qualification);
      expect(savedDoctor.consultationFee).toBe(doctorData.consultationFee);
      expect(savedDoctor.bio).toBe(doctorData.bio);
      expect(savedDoctor.isAvailable).toBe(true); // default value
      expect(savedDoctor.isActive).toBe(true); // default value
      expect(savedDoctor.rating).toBe(0); // default value
      expect(savedDoctor.totalConsultations).toBe(0); // default value
    });

    test('should set default availability schedule', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500
      };

      const doctor = new Doctor(doctorData);
      const savedDoctor = await doctor.save();

      expect(savedDoctor.availability.monday.available).toBe(true);
      expect(savedDoctor.availability.tuesday.available).toBe(true);
      expect(savedDoctor.availability.wednesday.available).toBe(true);
      expect(savedDoctor.availability.thursday.available).toBe(true);
      expect(savedDoctor.availability.friday.available).toBe(true);
      expect(savedDoctor.availability.saturday.available).toBe(false);
      expect(savedDoctor.availability.sunday.available).toBe(false);
    });

    test('should fail to create doctor without required fields', async () => {
      const incompleteData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com'
        // missing phone, specialization, experience, qualification, consultationFee
      };

      const doctor = new Doctor(incompleteData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with invalid email format', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'invalid-email',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with invalid phone format', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: 'invalid-phone',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with invalid specialization', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'Invalid Specialization',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with negative experience', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: -1,
        qualification: 'MBBS, MD',
        consultationFee: 500
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with excessive experience', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 51,
        qualification: 'MBBS, MD',
        consultationFee: 500
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with negative consultation fee', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: -100
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with bio exceeding character limit', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500,
        bio: 'a'.repeat(501) // 501 characters, exceeding 500 limit
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with rating below minimum', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500,
        rating: -1
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with rating above maximum', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500,
        rating: 6
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });

    test('should fail with negative total consultations', async () => {
      const doctorData = {
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500,
        totalConsultations: -1
      };

      const doctor = new Doctor(doctorData);
      
      await expect(doctor.save()).rejects.toThrow();
    });
  });

  describe('Doctor Updates', () => {
    let testDoctor;

    beforeEach(async () => {
      testDoctor = await Doctor.create({
        name: 'Dr. Test Doctor',
        email: 'test@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500
      });
    });

    test('should update doctor information successfully', async () => {
      const updatedData = {
        consultationFee: 600,
        bio: 'Updated biography',
        experience: 6
      };

      const updatedDoctor = await Doctor.findByIdAndUpdate(
        testDoctor._id,
        updatedData,
        { new: true, runValidators: true }
      );

      expect(updatedDoctor.consultationFee).toBe(600);
      expect(updatedDoctor.bio).toBe('Updated biography');
      expect(updatedDoctor.experience).toBe(6);
    });

    test('should update availability schedule successfully', async () => {
      const updatedAvailability = {
        'availability.saturday.available': true,
        'availability.saturday.start': '09:00',
        'availability.saturday.end': '13:00'
      };

      const updatedDoctor = await Doctor.findByIdAndUpdate(
        testDoctor._id,
        updatedAvailability,
        { new: true, runValidators: true }
      );

      expect(updatedDoctor.availability.saturday.available).toBe(true);
      expect(updatedDoctor.availability.saturday.start).toBe('09:00');
      expect(updatedDoctor.availability.saturday.end).toBe('13:00');
    });

    test('should fail to update with invalid data', async () => {
      const invalidData = {
        experience: -1,
        consultationFee: -100
      };

      await expect(
        Doctor.findByIdAndUpdate(
          testDoctor._id,
          invalidData,
          { new: true, runValidators: true }
        )
      ).rejects.toThrow();
    });
  });

  describe('Doctor Queries', () => {
    beforeEach(async () => {
      await Doctor.create([
        {
          name: 'Dr. General Practitioner',
          email: 'gp@example.com',
          phone: '+919876543210',
          specialization: 'General Medicine',
          experience: 5,
          qualification: 'MBBS, MD',
          consultationFee: 500,
          rating: 4.5,
          isAvailable: true,
          isActive: true
        },
        {
          name: 'Dr. Heart Specialist',
          email: 'cardio@example.com',
          phone: '+919876543211',
          specialization: 'Cardiology',
          experience: 10,
          qualification: 'MBBS, DM',
          consultationFee: 800,
          rating: 4.8,
          isAvailable: true,
          isActive: true
        },
        {
          name: 'Dr. Inactive Doctor',
          email: 'inactive@example.com',
          phone: '+919876543212',
          specialization: 'General Medicine',
          experience: 3,
          qualification: 'MBBS',
          consultationFee: 400,
          rating: 4.0,
          isAvailable: false,
          isActive: false
        }
      ]);
    });

    test('should find doctors by specialization', async () => {
      const cardiologists = await Doctor.find({ specialization: 'Cardiology' });
      
      expect(cardiologists).toHaveLength(1);
      expect(cardiologists[0].name).toBe('Dr. Heart Specialist');
    });

    test('should find active and available doctors', async () => {
      const availableDoctors = await Doctor.find({ 
        isActive: true, 
        isAvailable: true 
      });
      
      expect(availableDoctors).toHaveLength(2);
    });

    test('should find doctors with rating above threshold', async () => {
      const highRatedDoctors = await Doctor.find({ 
        rating: { $gte: 4.7 } 
      });
      
      expect(highRatedDoctors).toHaveLength(1);
      expect(highRatedDoctors[0].name).toBe('Dr. Heart Specialist');
    });

    test('should find doctors with fee below threshold', async () => {
      const affordableDoctors = await Doctor.find({ 
        consultationFee: { $lte: 600 } 
      });
      
      expect(affordableDoctors).toHaveLength(2);
    });

    test('should sort doctors by rating descending', async () => {
      const sortedDoctors = await Doctor.find({ isActive: true })
        .sort({ rating: -1 });
      
      expect(sortedDoctors[0].rating).toBe(4.8);
      expect(sortedDoctors[1].rating).toBe(4.5);
    });

    test('should sort doctors by consultation fee ascending', async () => {
      const sortedDoctors = await Doctor.find({ isActive: true })
        .sort({ consultationFee: 1 });
      
      expect(sortedDoctors[0].consultationFee).toBe(500);
      expect(sortedDoctors[1].consultationFee).toBe(800);
    });
  });

  describe('Doctor Indexes', () => {
    test('should have compound index for specialization, availability, and active status', async () => {
      const indexes = await Doctor.collection.getIndexes();
      
      const expectedIndex = Object.keys(indexes).find(indexName => 
        indexes[indexName].some(field => 
          field[0] === 'specialization' && 
          field[1] === 1
        )
      );
      
      expect(expectedIndex).toBeDefined();
    });

    test('should have index for rating', async () => {
      const indexes = await Doctor.collection.getIndexes();
      
      const ratingIndex = Object.keys(indexes).find(indexName => 
        indexes[indexName].some(field => 
          field[0] === 'rating' && 
          field[1] === -1
        )
      );
      
      expect(ratingIndex).toBeDefined();
    });

    test('should have index for consultation fee', async () => {
      const indexes = await Doctor.collection.getIndexes();
      
      const feeIndex = Object.keys(indexes).find(indexName => 
        indexes[indexName].some(field => 
          field[0] === 'consultationFee' && 
          field[1] === 1
        )
      );
      
      expect(feeIndex).toBeDefined();
    });
  });

  describe('Doctor Unique Constraints', () => {
    test('should prevent duplicate email addresses', async () => {
      const firstDoctor = {
        name: 'Dr. First',
        email: 'duplicate@example.com',
        phone: '+919876543210',
        specialization: 'General Medicine',
        experience: 5,
        qualification: 'MBBS, MD',
        consultationFee: 500
      };

      const secondDoctor = {
        name: 'Dr. Second',
        email: 'duplicate@example.com', // Same email
        phone: '+919876543211',
        specialization: 'Cardiology',
        experience: 8,
        qualification: 'MBBS, DM',
        consultationFee: 700
      };

      await Doctor.create(firstDoctor);
      
      await expect(Doctor.create(secondDoctor)).rejects.toThrow();
    });
  });
});