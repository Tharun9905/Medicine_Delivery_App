import React from 'react';
import Layout from '../components/common/Layout';

export default function ConsultDoctor() {
  return (
    <Layout title="Doctor Consultation - MediQuick">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-yellow-800 mb-2">Doctor Consultation Coming Soon</h1>
              <p className="text-yellow-700">
                We're working to connect you with qualified doctors for online consultations. This feature will be available soon.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">What's Coming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-900">Video Consultations</h3>
                    <p className="text-sm text-blue-700">Face-to-face consultation with doctors</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-900">Specialist Doctors</h3>
                    <p className="text-sm text-blue-700">Access to various medical specialists</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-900">Digital Prescriptions</h3>
                    <p className="text-sm text-blue-700">Get prescriptions sent directly to you</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Medical Help Now?</h2>
              <p className="text-gray-600 mb-4">
                You can upload your prescriptions and order medicines for immediate delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/upload-prescription"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Upload Prescription
                </a>
                <a
                  href="/medicines"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Medicines
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
//   const { user } = useAuth();
//   const [selectedSpecialty, setSelectedSpecialty] = useState('');
//   const [consultationType, setConsultationType] = useState('video'); // video, audio, chat
//   const [appointmentDate, setAppointmentDate] = useState('');
//   const [appointmentTime, setAppointmentTime] = useState('');
//   const [symptoms, setSymptoms] = useState('');
//   const [loading, setLoading] = useState(false);

//   const specialties = [
//     { id: 'general', name: 'General Physician', price: 299, duration: '15 mins' },
//     { id: 'dermatology', name: 'Dermatologist', price: 499, duration: '15 mins' },
//     { id: 'pediatrics', name: 'Pediatrician', price: 399, duration: '15 mins' },
//     { id: 'gynecology', name: 'Gynecologist', price: 449, duration: '15 mins' },
//     { id: 'cardiology', name: 'Cardiologist', price: 599, duration: '20 mins' },
//     { id: 'orthopedics', name: 'Orthopedist', price: 549, duration: '15 mins' },
//     { id: 'neurology', name: 'Neurologist', price: 649, duration: '20 mins' },
//     { id: 'psychiatry', name: 'Psychiatrist', price: 699, duration: '30 mins' }
//   ];

//   const timeSlots = [
//     '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
//     '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
//     '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
//   ];

//   const consultationTypes = [
//     { id: 'video', name: 'Video Call', icon: '📹', price: 0 },
//     { id: 'audio', name: 'Audio Call', icon: '📞', price: -50 },
//     { id: 'chat', name: 'Text Chat', icon: '💬', price: -100 }
//   ];

//   // Get minimum date (today)
//   const getMinDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Get maximum date (30 days from today)
//   const getMaxDate = () => {
//     const maxDate = new Date();
//     maxDate.setDate(maxDate.getDate() + 30);
//     return maxDate.toISOString().split('T')[0];
//   };

//   const getSelectedSpecialty = () => {
//     return specialties.find(s => s.id === selectedSpecialty);
//   };

//   const getSelectedConsultationType = () => {
//     return consultationTypes.find(c => c.id === consultationType);
//   };

//   const calculateTotalPrice = () => {
//     const specialty = getSelectedSpecialty();
//     const consultation = getSelectedConsultationType();
//     if (!specialty || !consultation) return 0;
//     return Math.max(specialty.price + consultation.price, 99); // Minimum ₹99
//   };

//   const handleBookConsultation = async () => {
//     if (!user) {
//       toast.error('Please login to book consultation');
//       return;
//     }

//     if (!selectedSpecialty || !appointmentDate || !appointmentTime || !symptoms.trim()) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const consultationData = {
//         specialty: selectedSpecialty,
//         type: consultationType,
//         date: appointmentDate,
//         time: appointmentTime,
//         symptoms: symptoms.trim(),
//         price: calculateTotalPrice()
//       };

//       // Mock booking - In real implementation, this would make API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       toast.success('Consultation booked successfully!');
//       console.log('Consultation Data:', consultationData);
      
//       // Reset form
//       setSelectedSpecialty('');
//       setAppointmentDate('');
//       setAppointmentTime('');
//       setSymptoms('');
      
//     } catch (error) {
//       toast.error('Failed to book consultation');
//       console.error('Booking error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Consult a Doctor</h1>
//           <p className="text-lg text-gray-600">Get expert medical advice from qualified doctors</p>
//           <div className="flex justify-center items-center space-x-8 mt-6 text-sm text-gray-500">
//             <div className="flex items-center">
//               <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//               Available 24/7
//             </div>
//             <div className="flex items-center">
//               <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//               Verified Doctors
//             </div>
//             <div className="flex items-center">
//               <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
//               Secure & Private
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Booking Form */}
//           <div className="lg:col-span-2">
//             {/* Select Specialty */}
//             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Specialty</h2>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {specialties.map((specialty) => (
//                   <div
//                     key={specialty.id}
//                     onClick={() => setSelectedSpecialty(specialty.id)}
//                     className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                       selectedSpecialty === specialty.id
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h3 className="font-medium text-gray-900">{specialty.name}</h3>
//                         <p className="text-sm text-gray-500">{specialty.duration}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold text-gray-900">₹{specialty.price}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Consultation Type */}
//             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Consultation Type</h2>
//               <div className="grid md:grid-cols-3 gap-4">
//                 {consultationTypes.map((type) => (
//                   <div
//                     key={type.id}
//                     onClick={() => setConsultationType(type.id)}
//                     className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                       consultationType === type.id
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="text-center">
//                       <div className="text-2xl mb-2">{type.icon}</div>
//                       <h3 className="font-medium text-gray-900">{type.name}</h3>
//                       {type.price !== 0 && (
//                         <p className="text-sm text-green-600">
//                           {type.price < 0 ? `₹${Math.abs(type.price)} off` : `+₹${type.price}`}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Date & Time Selection */}
//             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Date & Time</h2>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Appointment Date
//                   </label>
//                   <input
//                     type="date"
//                     value={appointmentDate}
//                     onChange={(e) => setAppointmentDate(e.target.value)}
//                     min={getMinDate()}
//                     max={getMaxDate()}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Preferred Time
//                   </label>
//                   <select
//                     value={appointmentTime}
//                     onChange={(e) => setAppointmentTime(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select time</option>
//                     {timeSlots.map((time) => (
//                       <option key={time} value={time}>{time}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Symptoms Description */}
//             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">Describe Your Symptoms</h2>
//               <textarea
//                 value={symptoms}
//                 onChange={(e) => setSymptoms(e.target.value)}
//                 placeholder="Please describe your symptoms, concerns, or questions for the doctor..."
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <p className="text-sm text-gray-500 mt-2">
//                 Minimum 20 characters required ({symptoms.length}/20)
//               </p>
//             </div>
//           </div>

//           {/* Booking Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Consultation Summary</h3>
              
//               {selectedSpecialty && (
//                 <div className="space-y-3 mb-6">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Specialty</span>
//                     <span className="font-medium">{getSelectedSpecialty()?.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Type</span>
//                     <span className="font-medium">
//                       {getSelectedConsultationType()?.name}
//                     </span>
//                   </div>
//                   {appointmentDate && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Date</span>
//                       <span className="font-medium">
//                         {new Date(appointmentDate).toLocaleDateString('en-US', {
//                           weekday: 'short',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </span>
//                     </div>
//                   )}
//                   {appointmentTime && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Time</span>
//                       <span className="font-medium">{appointmentTime}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Duration</span>
//                     <span className="font-medium">{getSelectedSpecialty()?.duration}</span>
//                   </div>
//                 </div>
//               )}

//               <div className="border-t pt-4 mb-6">
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-semibold">Total</span>
//                   <span className="text-2xl font-bold text-blue-600">
//                     ₹{calculateTotalPrice()}
//                   </span>
//                 </div>
//               </div>

//               <button
//                 onClick={handleBookConsultation}
//                 disabled={loading || !selectedSpecialty || !appointmentDate || !appointmentTime || symptoms.length < 20}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {loading ? 'Booking...' : 'Book Consultation'}
//               </button>

//               <div className="mt-4 text-xs text-gray-500 text-center">
//                 <p>✓ 100% secure payment</p>
//                 <p>✓ Reschedule up to 2 hours before</p>
//                 <p>✓ Get prescription digitally</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Why Choose Online Consultation */}
//         <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
//           <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
//             Why Choose Online Consultation?
//           </h2>
//           <div className="grid md:grid-cols-4 gap-6">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl">⏰</span>
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">Save Time</h3>
//               <p className="text-sm text-gray-600">No travel, no waiting. Consult from home.</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl">💰</span>
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">Cost Effective</h3>
//               <p className="text-sm text-gray-600">Lower consultation fees than clinic visits.</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl">🔒</span>
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">Private & Secure</h3>
//               <p className="text-sm text-gray-600">Your health data is completely secure.</p>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-2xl">📋</span>
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">Digital Records</h3>
//               <p className="text-sm text-gray-600">Get digital prescriptions and reports.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }