const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server');
const Doctor = require('../../src/models/Doctor');
const Consultation = require('../../src/models/Consultation');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

describe('Consultation Controller', () => {
  let mongoServer;
  let authToken;
  let testUser;
  let testDoctor;

  beforeAll(async () => {
    // Setup in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    // Clear database and create test data
    await Doctor.deleteMany({});
    await Consultation.deleteMany({});
    await User.deleteMany({});

    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
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
      consultationFee: 500,
      bio: 'Test doctor bio',
      availability: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '14:00', available: false },
        sunday: { start: '10:00', end: '13:00', available: false }
      }
    });

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/consultations/doctors', () => {
    test('should get all available doctors successfully', async () => {
      const response = await request(app)
        .get('/api/consultations/doctors')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Doctors retrieved successfully');
      expect(response.body.data.docs).toHaveLength(1);
      expect(response.body.data.docs[0].name).toBe('Dr. Test Doctor');
    });

    test('should filter doctors by specialization', async () => {
      await Doctor.create({
        name: 'Dr. Cardiologist',
        email: 'cardio@example.com',
        phone: '+919876543211',
        specialization: 'Cardiology',
        experience: 10,
        qualification: 'MBBS, DM',
        consultationFee: 800
      });

      const response = await request(app)
        .get('/api/consultations/doctors?specialization=Cardiology')
        .expect(200);

      expect(response.body.data.docs).toHaveLength(1);
      expect(response.body.data.docs[0].specialization).toBe('Cardiology');
    });

    test('should filter doctors by maximum fee', async () => {
      const response = await request(app)
        .get('/api/consultations/doctors?maxFee=400')
        .expect(200);

      expect(response.body.data.docs).toHaveLength(0);
    });

    test('should sort doctors by rating', async () => {
      await Doctor.create({
        name: 'Dr. High Rating',
        email: 'high@example.com',
        phone: '+919876543212',
        specialization: 'General Medicine',
        experience: 8,
        qualification: 'MBBS, MD',
        consultationFee: 600,
        rating: 4.8
      });

      const response = await request(app)
        .get('/api/consultations/doctors?sortBy=rating')
        .expect(200);

      expect(response.body.data.docs[0].rating).toBe(4.8);
    });
  });

  describe('GET /api/consultations/doctors/:id', () => {
    test('should get doctor by ID successfully', async () => {
      const response = await request(app)
        .get(`/api/consultations/doctors/${testDoctor._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testDoctor._id.toString());
      expect(response.body.data.name).toBe('Dr. Test Doctor');
    });

    test('should return 404 for non-existent doctor', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/consultations/doctors/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Doctor not found');
    });

    test('should return 400 for invalid doctor ID', async () => {
      const response = await request(app)
        .get('/api/consultations/doctors/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/consultations/book', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    test('should book consultation successfully', async () => {
      const consultationData = {
        doctorId: testDoctor._id,
        appointmentDate: tomorrowDate,
        appointmentTime: '10:00',
        consultationType: 'video',
        symptoms: 'Feeling unwell with fever and headache',
        medicalHistory: 'No significant medical history',
        currentMedications: 'None'
      };

      const response = await request(app)
        .post('/api/consultations/book')
        .set('Authorization', `Bearer ${authToken}`)
        .send(consultationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Consultation booked successfully');
      expect(response.body.data.symptoms).toBe(consultationData.symptoms);
      expect(response.body.data.consultationFee).toBe(testDoctor.consultationFee);
    });

    test('should fail without authentication', async () => {
      const consultationData = {
        doctorId: testDoctor._id,
        appointmentDate: tomorrowDate,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms'
      };

      const response = await request(app)
        .post('/api/consultations/book')
        .send(consultationData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should fail with invalid doctor ID', async () => {
      const consultationData = {
        doctorId: 'invalid-id',
        appointmentDate: tomorrowDate,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms'
      };

      const response = await request(app)
        .post('/api/consultations/book')
        .set('Authorization', `Bearer ${authToken}`)
        .send(consultationData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail with past appointment date', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toISOString().split('T')[0];

      const consultationData = {
        doctorId: testDoctor._id,
        appointmentDate: yesterdayDate,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms'
      };

      const response = await request(app)
        .post('/api/consultations/book')
        .set('Authorization', `Bearer ${authToken}`)
        .send(consultationData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail with duplicate time slot booking', async () => {
      // First booking
      await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: new Date(tomorrowDate),
        appointmentTime: '10:00',
        symptoms: 'First symptoms',
        consultationFee: testDoctor.consultationFee
      });

      const consultationData = {
        doctorId: testDoctor._id,
        appointmentDate: tomorrowDate,
        appointmentTime: '10:00',
        symptoms: 'Duplicate booking attempt'
      };

      const response = await request(app)
        .post('/api/consultations/book')
        .set('Authorization', `Bearer ${authToken}`)
        .send(consultationData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Time slot is already booked');
    });

    test('should fail with missing required fields', async () => {
      const consultationData = {
        doctorId: testDoctor._id,
        appointmentDate: tomorrowDate
        // Missing appointmentTime and symptoms
      };

      const response = await request(app)
        .post('/api/consultations/book')
        .set('Authorization', `Bearer ${authToken}`)
        .send(consultationData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/consultations/my-consultations', () => {
    beforeEach(async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: tomorrow,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: testDoctor.consultationFee,
        status: 'scheduled'
      });
    });

    test('should get user consultations successfully', async () => {
      const response = await request(app)
        .get('/api/consultations/my-consultations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.docs).toHaveLength(1);
      expect(response.body.data.docs[0].symptoms).toBe('Test symptoms');
    });

    test('should filter consultations by status', async () => {
      const response = await request(app)
        .get('/api/consultations/my-consultations?status=completed')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.docs).toHaveLength(0);
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/consultations/my-consultations')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/consultations/:id', () => {
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
        consultationFee: testDoctor.consultationFee
      });
    });

    test('should get consultation by ID successfully', async () => {
      const response = await request(app)
        .get(`/api/consultations/${testConsultation._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testConsultation._id.toString());
    });

    test('should fail for non-existent consultation', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/consultations/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('should fail for unauthorized access', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        phone: '+919999999998',
        password: 'password123',
        isVerified: true
      });

      const otherUserToken = jwt.sign(
        { userId: otherUser._id },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get(`/api/consultations/${testConsultation._id}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied');
    });
  });

  describe('PUT /api/consultations/:id/cancel', () => {
    let testConsultation;

    beforeEach(async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      
      testConsultation = await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: futureDate,
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: testDoctor.consultationFee,
        status: 'scheduled'
      });
    });

    test('should cancel consultation successfully', async () => {
      const response = await request(app)
        .put(`/api/consultations/${testConsultation._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reason: 'Personal emergency' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('cancelled');
      expect(response.body.data.cancelReason).toBe('Personal emergency');
    });

    test('should fail to cancel non-scheduled consultation', async () => {
      testConsultation.status = 'completed';
      await testConsultation.save();

      const response = await request(app)
        .put(`/api/consultations/${testConsultation._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reason: 'Test reason' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail to cancel consultation close to appointment time', async () => {
      const nearFuture = new Date();
      nearFuture.setHours(nearFuture.getHours() + 1);
      
      testConsultation.appointmentDate = nearFuture;
      await testConsultation.save();

      const response = await request(app)
        .put(`/api/consultations/${testConsultation._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reason: 'Test reason' })
        .expect(400);

      expect(response.body.message).toContain('2 hours in advance');
    });
  });

  describe('PUT /api/consultations/:id/rate', () => {
    let testConsultation;

    beforeEach(async () => {
      testConsultation = await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: new Date(),
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: testDoctor.consultationFee,
        status: 'completed'
      });
    });

    test('should rate consultation successfully', async () => {
      const response = await request(app)
        .put(`/api/consultations/${testConsultation._id}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          rating: 5,
          review: 'Excellent consultation, very helpful doctor'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.rating.patientRating).toBe(5);
      expect(response.body.data.rating.patientReview).toBe('Excellent consultation, very helpful doctor');
    });

    test('should fail to rate non-completed consultation', async () => {
      testConsultation.status = 'scheduled';
      await testConsultation.save();

      const response = await request(app)
        .put(`/api/consultations/${testConsultation._id}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ rating: 5 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should fail to rate already rated consultation', async () => {
      testConsultation.rating = { patientRating: 4 };
      await testConsultation.save();

      const response = await request(app)
        .put(`/api/consultations/${testConsultation._id}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ rating: 5 })
        .expect(400);

      expect(response.body.message).toBe('Consultation already rated');
    });

    test('should fail with invalid rating', async () => {
      const response = await request(app)
        .put(`/api/consultations/${testConsultation._id}/rate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ rating: 6 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/consultations/available-slots', () => {
    test('should get available slots successfully', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];

      const response = await request(app)
        .get(`/api/consultations/available-slots?doctorId=${testDoctor._id}&date=${tomorrowDate}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.availableSlots).toEqual(
        expect.arrayContaining(['09:00', '09:30', '10:00', '10:30'])
      );
    });

    test('should return empty slots for unavailable day', async () => {
      const nextSaturday = new Date();
      nextSaturday.setDate(nextSaturday.getDate() + (6 - nextSaturday.getDay()) % 7);
      const saturdayDate = nextSaturday.toISOString().split('T')[0];

      const response = await request(app)
        .get(`/api/consultations/available-slots?doctorId=${testDoctor._id}&date=${saturdayDate}`)
        .expect(200);

      expect(response.body.data.availableSlots).toHaveLength(0);
    });

    test('should exclude booked slots', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];

      // Book a slot
      await Consultation.create({
        patient: testUser._id,
        doctor: testDoctor._id,
        appointmentDate: new Date(tomorrowDate),
        appointmentTime: '10:00',
        symptoms: 'Test symptoms',
        consultationFee: testDoctor.consultationFee,
        status: 'scheduled'
      });

      const response = await request(app)
        .get(`/api/consultations/available-slots?doctorId=${testDoctor._id}&date=${tomorrowDate}`)
        .expect(200);

      expect(response.body.data.availableSlots).not.toContain('10:00');
      expect(response.body.data.bookedSlots).toBe(1);
    });

    test('should fail without required parameters', async () => {
      const response = await request(app)
        .get('/api/consultations/available-slots')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});