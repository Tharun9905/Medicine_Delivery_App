const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Consultation = require('../../src/models/Consultation');
const Doctor = require('../../src/models/Doctor');
const User = require('../../src/models/User');

describe('Consultation Model', () => {
  let mongoServer;
  let testUser;
  let testDoctor;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    await Consultation.deleteMany({});
    await Doctor.deleteMany({});
    await User.deleteMany({});

    // Create test user
    testUser = await User.create({
      name: 'Test Patient',
      email: 'patient@example.com',
      phone: '+919999999999',
      password: 'password123',
      isVerified: true
    });

    // Create test doctor
    testDoctor = await Doctor.create({
      name: 'Dr. Test Doctor',
      email: 'doctor@example.com',
      phone: '+919876543210',
      specialization: 'General Medicine',
      experience: 5,
      qualification: 'MBBS, MD',
      consultationFee: 500
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Consultation Creation', () => {
    test('should create consultation successfully with valid data', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const consultationData = {
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        consultationType: 'video',
        symptoms: 'Feeling unwell with fever and headache for 2 days',
        medicalHistory: 'No significant medical history',
        currentMedications: 'Paracetamol as needed',
        consultationFee: 500
      };

      const consultation = new Consultation(consultationData);
      const savedConsultation = await consultation.save();

      expect(savedConsultation._id).toBeDefined();
      expect(savedConsultation.patient).toEqual(testUser._id);
      expect(savedConsultation.doctor).toEqual(testDoctor._id);
      expect(savedConsultation.appointmentDate).toEqual(tomorrow);
      expect(savedConsultation.appointmentTime).toBe('10:00');
      expect(savedConsultation.consultationType).toBe('video');
      expect(savedConsultation.symptoms).toBe('Feeling unwell with fever and headache for 2 days');
      expect(savedConsultation.medicalHistory).toBe('No significant medical history');
      expect(savedConsultation.currentMedications).toBe('Paracetamol as needed');
      expect(savedConsultation.consultationFee).toBe(500);
      expect(savedConsultation.status).toBe('scheduled'); // default value
      expect(savedConsultation.paymentStatus).toBe('pending'); // default value
      expect(savedConsultation.duration).toBe(30); // default value
    });

    test('should set default values correctly', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const minimalData = {
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: 500
      };

      const consultation = new Consultation(minimalData);
      const savedConsultation = await consultation.save();

      expect(savedConsultation.consultationType).toBe('video');
      expect(savedConsultation.status).toBe('scheduled');
      expect(savedConsultation.paymentStatus).toBe('pending');
      expect(savedConsultation.duration).toBe(30);
    });

    test('should fail without required fields', async () => {
      const incompleteData = {
        patient: testUser._id,
        doctor: testDoctor._id
        // missing appointmentDate, appointmentTime, symptoms, consultationFee
      };

      const consultation = new Consultation(incompleteData);
      await expect(consultation.save()).rejects.toThrow();
    });

    test('should fail with past appointment date', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const consultationData = {
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: yesterday,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: 500
      };

      const consultation = new Consultation(consultationData);
      await expect(consultation.save()).rejects.toThrow();
    });

    test('should fail with invalid appointment time format', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const consultationData = {
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '25:00', // Invalid time
        symptoms: 'Test symptoms',
        consultationFee: 500
      };

      const consultation = new Consultation(consultationData);
      await expect(consultation.save()).rejects.toThrow();
    });

    test('should fail with invalid consultation type', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const consultationData = {
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        consultationType: 'invalid-type',
        symptoms: 'Test symptoms',
        consultationFee: 500
      };

      const consultation = new Consultation(consultationData);
      await expect(consultation.save()).rejects.toThrow();
    });

    test('should fail with symptoms exceeding character limit', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const consultationData = {
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        symptoms: 'a'.repeat(1001), // Exceeds 1000 character limit
        consultationFee: 500
      };

      const consultation = new Consultation(consultationData);
      await expect(consultation.save()).rejects.toThrow();
    });

    test('should fail with medical history exceeding character limit', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const consultationData = {
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        medicalHistory: 'a'.repeat(2001), // Exceeds 2000 character limit
        consultationFee: 500
      };

      const consultation = new Consultation(consultationData);
      await expect(consultation.save()).rejects.toThrow();
    });

    test('should fail with negative consultation fee', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const consultationData = {
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: -100
      };

      const consultation = new Consultation(consultationData);
      await expect(consultation.save()).rejects.toThrow();
    });
  });

  describe('Consultation Status Updates', () => {
    let testConsultation;

    beforeEach(async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      testConsultation = await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: 500
      });
    });

    test('should update consultation status successfully', async () => {
      testConsultation.status = 'in-progress';
      testConsultation.startTime = new Date();
      const updatedConsultation = await testConsultation.save();

      expect(updatedConsultation.status).toBe('in-progress');
      expect(updatedConsultation.startTime).toBeDefined();
    });

    test('should update payment status successfully', async () => {
      testConsultation.paymentStatus = 'paid';
      testConsultation.paymentId = 'payment_123';
      const updatedConsultation = await testConsultation.save();

      expect(updatedConsultation.paymentStatus).toBe('paid');
      expect(updatedConsultation.paymentId).toBe('payment_123');
    });

    test('should fail with invalid status', async () => {
      testConsultation.status = 'invalid-status';
      await expect(testConsultation.save()).rejects.toThrow();
    });

    test('should fail with invalid payment status', async () => {
      testConsultation.paymentStatus = 'invalid-payment-status';
      await expect(testConsultation.save()).rejects.toThrow();
    });
  });

  describe('Consultation Prescription', () => {
    let testConsultation;

    beforeEach(async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      testConsultation = await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: 500,
        status: 'completed'
      });
    });

    test('should add prescription successfully', async () => {
      const prescription = {
        medications: [
          {
            medicine: 'Paracetamol 500mg',
            dosage: '1 tablet',
            frequency: 'Twice daily',
            duration: '3 days',
            instructions: 'Take after meals'
          }
        ],
        diagnosis: 'Viral fever',
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        additionalNotes: 'Rest and drink plenty of fluids'
      };

      testConsultation.prescription = prescription;
      const updatedConsultation = await testConsultation.save();

      expect(updatedConsultation.prescription.medications).toHaveLength(1);
      expect(updatedConsultation.prescription.medications[0].medicine).toBe('Paracetamol 500mg');
      expect(updatedConsultation.prescription.diagnosis).toBe('Viral fever');
      expect(updatedConsultation.prescription.additionalNotes).toBe('Rest and drink plenty of fluids');
    });

    test('should fail with prescription notes exceeding character limit', async () => {
      testConsultation.prescription = {
        additionalNotes: 'a'.repeat(1001) // Exceeds 1000 character limit
      };

      await expect(testConsultation.save()).rejects.toThrow();
    });
  });

  describe('Consultation Rating', () => {
    let testConsultation;

    beforeEach(async () => {
      testConsultation = await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: new Date(),
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: 500,
        status: 'completed'
      });
    });

    test('should add patient rating successfully', async () => {
      testConsultation.rating = {
        patientRating: 5,
        patientReview: 'Excellent consultation, very helpful doctor'
      };

      const updatedConsultation = await testConsultation.save();

      expect(updatedConsultation.rating.patientRating).toBe(5);
      expect(updatedConsultation.rating.patientReview).toBe('Excellent consultation, very helpful doctor');
    });

    test('should fail with invalid patient rating', async () => {
      testConsultation.rating = {
        patientRating: 6 // Exceeds maximum of 5
      };

      await expect(testConsultation.save()).rejects.toThrow();
    });

    test('should fail with patient review exceeding character limit', async () => {
      testConsultation.rating = {
        patientRating: 5,
        patientReview: 'a'.repeat(501) // Exceeds 500 character limit
      };

      await expect(testConsultation.save()).rejects.toThrow();
    });

    test('should fail with doctor notes exceeding character limit', async () => {
      testConsultation.rating = {
        doctorNotes: 'a'.repeat(1001) // Exceeds 1000 character limit
      };

      await expect(testConsultation.save()).rejects.toThrow();
    });
  });

  describe('Consultation Cancellation', () => {
    let testConsultation;

    beforeEach(async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      testConsultation = await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: 500
      });
    });

    test('should cancel consultation successfully', async () => {
      testConsultation.status = 'cancelled';
      testConsultation.cancelReason = 'Personal emergency';
      testConsultation.cancelledBy = 'patient';

      const updatedConsultation = await testConsultation.save();

      expect(updatedConsultation.status).toBe('cancelled');
      expect(updatedConsultation.cancelReason).toBe('Personal emergency');
      expect(updatedConsultation.cancelledBy).toBe('patient');
    });

    test('should fail with invalid cancelledBy value', async () => {
      testConsultation.cancelledBy = 'invalid-user';
      await expect(testConsultation.save()).rejects.toThrow();
    });

    test('should fail with cancel reason exceeding character limit', async () => {
      testConsultation.cancelReason = 'a'.repeat(201); // Exceeds 200 character limit
      await expect(testConsultation.save()).rejects.toThrow();
    });
  });

  describe('Consultation Virtual Properties', () => {
    test('should calculate actual duration correctly', async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 45 * 60 * 1000); // 45 minutes later

      const consultation = await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: new Date(),
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: 500,
        startTime,
        endTime
      });

      expect(consultation.actualDuration).toBe(45);
    });

    test('should return null for actual duration when times are missing', async () => {
      const consultation = await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: 500
      });

      expect(consultation.actualDuration).toBeNull();
    });
  });

  describe('Consultation Queries', () => {
    beforeEach(async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await Consultation.create([
        {
          patient: testUser._id,
          doctor: testDoctor._id,
          appointmentDate: tomorrow,
          appointmentTime: '10:00',
          symptoms: 'Scheduled consultation',
          consultationFee: 500,
          status: 'scheduled'
        },
        {
          patient: testUser._id,
          doctor: testDoctor._id,
          appointmentDate: new Date(),
          appointmentTime: '14:00',
          symptoms: 'Completed consultation',
          consultationFee: 500,
          status: 'completed'
        },
        {
          patient: testUser._id,
          doctor: testDoctor._id,
          appointmentDate: tomorrow,
          appointmentTime: '16:00',
          symptoms: 'Cancelled consultation',
          consultationFee: 500,
          status: 'cancelled'
        }
      ]);
    });

    test('should find consultations by patient', async () => {
      const consultations = await Consultation.find({ patient: testUser._id });
      expect(consultations).toHaveLength(3);
    });

    test('should find consultations by doctor', async () => {
      const consultations = await Consultation.find({ doctor: testDoctor._id });
      expect(consultations).toHaveLength(3);
    });

    test('should find consultations by status', async () => {
      const scheduledConsultations = await Consultation.find({ status: 'scheduled' });
      const completedConsultations = await Consultation.find({ status: 'completed' });
      const cancelledConsultations = await Consultation.find({ status: 'cancelled' });

      expect(scheduledConsultations).toHaveLength(1);
      expect(completedConsultations).toHaveLength(1);
      expect(cancelledConsultations).toHaveLength(1);
    });

    test('should find consultations by date range', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayConsultations = await Consultation.find({
        appointmentDate: {
          $gte: today,
          $lt: tomorrow
        }
      });

      expect(todayConsultations).toHaveLength(1);
      expect(todayConsultations[0].symptoms).toBe('Completed consultation');
    });

    test('should sort consultations by appointment date', async () => {
      const consultations = await Consultation.find()
        .sort({ appointmentDate: -1, appointmentTime: -1 });

      // Should be sorted by date descending, then time descending
      expect(consultations[0].appointmentTime).toBe('16:00'); // Tomorrow, latest time
      expect(consultations[1].appointmentTime).toBe('10:00'); // Tomorrow, earlier time
      expect(consultations[2].appointmentTime).toBe('14:00'); // Today
    });
  });

  describe('Consultation Population', () => {
    test('should populate patient and doctor details', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const consultation = await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: 500
      });

      const populatedConsultation = await Consultation.findById(consultation._id)
        .populate('patient', 'name email phone')
        .populate('doctor', 'name specialization consultationFee');

      expect(populatedConsultation.patient.name).toBe('Test Patient');
      expect(populatedConsultation.patient.email).toBe('patient@example.com');
      expect(populatedConsultation.doctor.name).toBe('Dr. Test Doctor');
      expect(populatedConsultation.doctor.specialization).toBe('General Medicine');
    });
  });
});