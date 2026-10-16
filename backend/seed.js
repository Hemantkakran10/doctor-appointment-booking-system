import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Appointment from './models/Appointment.js';

dotenv.config();

export const DELHI_DOCTORS = [
  {
    name: 'Dr. Rakesh Sharma',
    email: 'rakesh.sharma@system.com',
    password: 'password123',
    specialization: 'Cardiologist',
    degree: 'MBBS, MD, DM (Cardiology)',
    experience: 16,
    fees: 1200,
    hospital: 'Fortis Escorts Heart Institute, Okhla, Delhi',
    rating: 4.9,
    reviewsCount: 342,
    image: '/doctors/senior_male_cardiologist.jpg',
    isActive: true,
    slots_booked: { '2026-10-16': ['09:00 AM', '11:00 AM'] }
  },
  {
    name: 'Dr. Ananya Patel',
    email: 'ananya.patel@system.com',
    password: 'password123',
    specialization: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology), FAAD',
    experience: 11,
    fees: 900,
    hospital: 'Max Super Speciality Hospital, Saket, Delhi',
    rating: 4.9,
    reviewsCount: 412,
    image: '/doctors/female_dermatologist.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Vikram Mehta',
    email: 'vikram.mehta@system.com',
    password: 'password123',
    specialization: 'Pediatrician',
    degree: 'MBBS, MD (Pediatrics), DCH',
    experience: 14,
    fees: 750,
    hospital: 'Aakash Healthcare Super Speciality Hospital, Sector 3, Dwarka, Delhi',
    rating: 4.8,
    reviewsCount: 295,
    image: '/doctors/indian_male_doctor.jpg',
    isActive: true,
    slots_booked: { '2026-10-16': ['02:00 PM'] }
  },
  {
    name: 'Dr. Neha Gupta',
    email: 'neha.gupta@system.com',
    password: 'password123',
    specialization: 'Neurologist',
    degree: 'MBBS, MD (Medicine), DM (Neurology)',
    experience: 15,
    fees: 1000,
    hospital: 'AIIMS, Ansari Nagar, Hauz Khas, Delhi',
    rating: 4.9,
    reviewsCount: 380,
    image: '/doctors/indian_female_doctor.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Shalini Kapoor',
    email: 'shalini.kapoor@system.com',
    password: 'password123',
    specialization: 'Cardiologist',
    degree: 'MD - Cardiology, FACC (USA)',
    experience: 13,
    fees: 1100,
    hospital: 'Indraprastha Apollo Hospitals, Sarita Vihar, Jasola, Delhi',
    rating: 4.9,
    reviewsCount: 320,
    image: 'https://images.unsplash.com/photo-1594824813560-4b0811b514d7?w=400&auto=format&fit=crop&q=80',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Anand Patel',
    email: 'anand.patel@system.com',
    password: 'password123',
    specialization: 'Neurologist',
    degree: 'MBBS, DM - Neurology, MRCP (UK)',
    experience: 12,
    fees: 950,
    hospital: 'BLK-Max Super Speciality Hospital, Pusa Road, Karol Bagh, Delhi',
    rating: 4.8,
    reviewsCount: 245,
    image: '/doctors/male_neurologist.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Mayank Verma',
    email: 'mayank.verma@system.com',
    password: 'password123',
    specialization: 'Dermatologist',
    degree: 'MD - Dermatology & Venereology',
    experience: 9,
    fees: 850,
    hospital: 'Fortis Flt. Lt. Rajan Dhall Hospital, Vasant Kunj, Delhi',
    rating: 4.8,
    reviewsCount: 260,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Priya Sen',
    email: 'priya.sen@system.com',
    password: 'password123',
    specialization: 'Gynecologist',
    degree: 'MBBS, MS (OB-GYN), FICOG',
    experience: 17,
    fees: 1000,
    hospital: 'Sir Ganga Ram Hospital, Rajinder Nagar, Delhi',
    rating: 4.9,
    reviewsCount: 410,
    image: '/doctors/female_gynecologist.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Rajesh Verma',
    email: 'rajesh.verma@system.com',
    password: 'password123',
    specialization: 'General Physician',
    degree: 'MBBS, MD (General Medicine)',
    experience: 12,
    fees: 500,
    hospital: 'Ayushman Hospital, Najafgarh, Delhi',
    rating: 4.8,
    reviewsCount: 215,
    image: '/doctors/male_general_physician.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Sunita Ahlawat',
    email: 'sunita.ahlawat@system.com',
    password: 'password123',
    specialization: 'Gynecologist',
    degree: 'MBBS, DGO, DNB (Obstetrics & Gynecology)',
    experience: 14,
    fees: 600,
    hospital: 'Vikas Hospital, Thana Road, Najafgarh, Delhi',
    rating: 4.9,
    reviewsCount: 320,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Amit Kadian',
    email: 'amit.kadian@system.com',
    password: 'password123',
    specialization: 'Orthopedic',
    degree: 'MBBS, MS (Orthopedics), Joint Replacement Specialist',
    experience: 13,
    fees: 700,
    hospital: 'Bhagat Chandra Hospital, Najafgarh Road, Delhi',
    rating: 4.7,
    reviewsCount: 190,
    image: '/doctors/male_orthopedic.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Pooja Yadav',
    email: 'pooja.yadav@system.com',
    password: 'password123',
    specialization: 'Pediatrician',
    degree: 'MBBS, DNB (Pediatrics), Fellowship in Neonatology',
    experience: 8,
    fees: 700,
    hospital: 'Manipal Hospital, Sector 6, Dwarka, Delhi',
    rating: 4.9,
    reviewsCount: 275,
    image: '/doctors/female_pediatrician.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Nitin Aggarwal',
    email: 'nitin.aggarwal@system.com',
    password: 'password123',
    specialization: 'Cardiologist',
    degree: 'MBBS, MD, DM (Cardiology)',
    experience: 15,
    fees: 900,
    hospital: 'Venkateshwar Hospital, Sector 18, Dwarka, Delhi',
    rating: 4.8,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Kavita Bansal',
    email: 'kavita.bansal@system.com',
    password: 'password123',
    specialization: 'Dermatologist',
    degree: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    experience: 9,
    fees: 650,
    hospital: 'Maharaja Agrasen Hospital, Sector 1, Dwarka, Delhi',
    rating: 4.8,
    reviewsCount: 185,
    image: 'https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Sanjeev Khurana',
    email: 'sanjeev.khurana@system.com',
    password: 'password123',
    specialization: 'Orthopedic',
    degree: 'MBBS, MS (Ortho), M.Ch (Ortho, UK)',
    experience: 20,
    fees: 1200,
    hospital: 'Max Super Speciality Hospital, Saket, Delhi',
    rating: 4.9,
    reviewsCount: 490,
    image: 'https://images.pexels.com/photos/5888168/pexels-photo-5888168.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Shalini Rastogi',
    email: 'shalini.rastogi@system.com',
    password: 'password123',
    specialization: 'ENT Specialist',
    degree: 'MBBS, MS (ENT), DNB (Otorhinolaryngology)',
    experience: 11,
    fees: 800,
    hospital: 'Smart Hospital, Press Enclave Marg, Saket, Delhi',
    rating: 4.7,
    reviewsCount: 210,
    image: 'https://images.pexels.com/photos/19438563/pexels-photo-19438563.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Harish Singhania',
    email: 'harish.singhania@system.com',
    password: 'password123',
    specialization: 'Gastroenterologist',
    degree: 'MBBS, MD, DM (Hepatology & Gastroenterology)',
    experience: 18,
    fees: 1300,
    hospital: 'Institute of Liver and Biliary Sciences (ILBS), Vasant Kunj, Delhi',
    rating: 4.9,
    reviewsCount: 420,
    image: '/doctors/male_gastroenterologist.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Vandana Chopra',
    email: 'vandana.chopra@system.com',
    password: 'password123',
    specialization: 'Gynecologist',
    degree: 'MBBS, MS (Obstetrics & Gynaecology)',
    experience: 16,
    fees: 1100,
    hospital: 'Fortis Flt. Lt. Rajan Dhall Hospital, Vasant Kunj, Delhi',
    rating: 4.8,
    reviewsCount: 350,
    image: 'https://images.pexels.com/photos/5888160/pexels-photo-5888160.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Arvind Mathur',
    email: 'arvind.mathur@system.com',
    password: 'password123',
    specialization: 'Neurologist',
    degree: 'MBBS, MD, DM (Neurology)',
    experience: 22,
    fees: 600,
    hospital: 'Dr. Ram Manohar Lohia Hospital, Connaught Place, Delhi',
    rating: 4.8,
    reviewsCount: 310,
    image: 'https://images.pexels.com/photos/6762869/pexels-photo-6762869.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Radhika Menon',
    email: 'radhika.menon@system.com',
    password: 'password123',
    specialization: 'General Physician',
    degree: 'MBBS, MD (Internal Medicine)',
    experience: 13,
    fees: 650,
    hospital: 'Lady Hardinge Medical College, Connaught Place, Delhi',
    rating: 4.9,
    reviewsCount: 280,
    image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Pradeep Narang',
    email: 'pradeep.narang@system.com',
    password: 'password123',
    specialization: 'Ophthalmologist',
    degree: 'MBBS, MS (Ophthalmology), Fellow Retina',
    experience: 15,
    fees: 700,
    hospital: 'Northern Railway Central Hospital, Connaught Place, Delhi',
    rating: 4.7,
    reviewsCount: 195,
    image: 'https://images.pexels.com/photos/7578811/pexels-photo-7578811.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Suresh Kulkarni',
    email: 'suresh.kulkarni@system.com',
    password: 'password123',
    specialization: 'Cardiologist',
    degree: 'MBBS, MD, DM (Cardiology), FSCAI',
    experience: 19,
    fees: 900,
    hospital: 'Saroj Super Speciality Hospital, Sector 14, Rohini, Delhi',
    rating: 4.9,
    reviewsCount: 380,
    image: 'https://images.pexels.com/photos/19963167/pexels-photo-19963167.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Deepa Mittal',
    email: 'deepa.mittal@system.com',
    password: 'password123',
    specialization: 'Pediatrician',
    degree: 'MBBS, MD (Pediatrics), DCH',
    experience: 10,
    fees: 600,
    hospital: 'Bhagwan Mahavir Hospital, Sector 14, Rohini, Delhi',
    rating: 4.8,
    reviewsCount: 240,
    image: 'https://images.pexels.com/photos/5998442/pexels-photo-5998442.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Ramanujam Tiwari',
    email: 'ramanujam.tiwari@system.com',
    password: 'password123',
    specialization: 'General Physician',
    degree: 'MBBS, MD (General Medicine)',
    experience: 16,
    fees: 750,
    hospital: 'Rajiv Gandhi Cancer Institute & Research Centre, Sector 5, Rohini, Delhi',
    rating: 4.9,
    reviewsCount: 325,
    image: 'https://images.pexels.com/photos/7904406/pexels-photo-7904406.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Manisha Goel',
    email: 'manisha.goel@system.com',
    password: 'password123',
    specialization: 'Dermatologist',
    degree: 'MBBS, DDVL, MD (Dermatology)',
    experience: 8,
    fees: 750,
    hospital: 'Fortis Hospital, Sector 10, Rohini, Delhi',
    rating: 4.7,
    reviewsCount: 210,
    image: 'https://images.pexels.com/photos/36665076/pexels-photo-36665076.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Alok Srivastava',
    email: 'alok.srivastava@system.com',
    password: 'password123',
    specialization: 'Neurologist',
    degree: 'MBBS, MD, DM (Neurology)',
    experience: 14,
    fees: 800,
    hospital: 'Janakpuri Super Speciality Hospital, C-2B, Janakpuri, Delhi',
    rating: 4.8,
    reviewsCount: 290,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&auto=format&fit=crop&q=80',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Sunita Wadhwa',
    email: 'sunita.wadhwa@system.com',
    password: 'password123',
    specialization: 'Gynecologist',
    degree: 'MBBS, MS (OBG), High-Risk Pregnancy Specialist',
    experience: 21,
    fees: 850,
    hospital: 'Mata Chanan Devi Hospital, C-1, Janakpuri, Delhi',
    rating: 4.9,
    reviewsCount: 460,
    image: 'https://images.pexels.com/photos/7578810/pexels-photo-7578810.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Manoj Juneja',
    email: 'manoj.juneja@system.com',
    password: 'password123',
    specialization: 'Orthopedic',
    degree: 'MBBS, MS (Orthopedics), Arthroscopy Fellow',
    experience: 11,
    fees: 700,
    hospital: 'Janakpuri Super Speciality Hospital, Janakpuri, Delhi',
    rating: 4.7,
    reviewsCount: 205,
    image: 'https://images.pexels.com/photos/32115905/pexels-photo-32115905.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Ashok Sethi',
    email: 'ashok.sethi@system.com',
    password: 'password123',
    specialization: 'Cardiologist',
    degree: 'MBBS, MD, DM (Cardiology), FACC',
    experience: 24,
    fees: 1400,
    hospital: 'National Heart Institute, East of Kailash, Lajpat Nagar, Delhi',
    rating: 5.0,
    reviewsCount: 512,
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Ashok_Seth.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Ritu Malhotra',
    email: 'ritu.malhotra@system.com',
    password: 'password123',
    specialization: 'Pediatrician',
    degree: 'MBBS, MD (Pediatrics), DNB',
    experience: 15,
    fees: 900,
    hospital: 'Moolchand Medcity, Lajpat Nagar, Delhi',
    rating: 4.9,
    reviewsCount: 330,
    image: 'https://images.pexels.com/photos/32251892/pexels-photo-32251892.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Vidya Bhasin',
    email: 'vidya.bhasin@system.com',
    password: 'password123',
    specialization: 'Psychiatrist',
    degree: 'MBBS, MD (Psychiatry), Cognitive Behavioral Therapist',
    experience: 12,
    fees: 1000,
    hospital: 'Medanta Mediclinic, Defence Colony, Lajpat Nagar, Delhi',
    rating: 4.8,
    reviewsCount: 240,
    image: '/doctors/female_psychiatrist.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Tarun Batra',
    email: 'tarun.batra@system.com',
    password: 'password123',
    specialization: 'Cardiologist',
    degree: 'MBBS, MD, DM (Interventional Cardiology)',
    experience: 18,
    fees: 1200,
    hospital: 'Indraprastha Apollo Hospitals, Sarita Vihar, Jasola, Delhi',
    rating: 4.9,
    reviewsCount: 410,
    image: 'https://images.pexels.com/photos/32251893/pexels-photo-32251893.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Mary Thomas',
    email: 'mary.thomas@system.com',
    password: 'password123',
    specialization: 'General Physician',
    degree: 'MBBS, MD (General Medicine)',
    experience: 20,
    fees: 600,
    hospital: 'Holy Family Hospital, Okhla Road, Delhi',
    rating: 4.9,
    reviewsCount: 390,
    image: 'https://images.pexels.com/photos/8780314/pexels-photo-8780314.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Gaurav Bhardwaj',
    email: 'gaurav.bhardwaj@system.com',
    password: 'password123',
    specialization: 'ENT Specialist',
    degree: 'MBBS, MS (ENT), Head & Neck Surgery',
    experience: 10,
    fees: 800,
    hospital: 'Max Multi Speciality Centre, Pitampura, Delhi',
    rating: 4.8,
    reviewsCount: 220,
    image: '/doctors/male_ent_specialist.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Sangeeta Jain',
    email: 'sangeeta.jain@system.com',
    password: 'password123',
    specialization: 'Dermatologist',
    degree: 'MBBS, DVD, MD (Dermatology)',
    experience: 13,
    fees: 700,
    hospital: 'Sunder Lal Jain Hospital, Ashok Vihar, Pitampura, Delhi',
    rating: 4.7,
    reviewsCount: 260,
    image: 'https://images.pexels.com/photos/7578804/pexels-photo-7578804.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Pankaj Chhabra',
    email: 'pankaj.chhabra@system.com',
    password: 'password123',
    specialization: 'Orthopedic',
    degree: 'MBBS, MS (Orthopedics), Spine Surgeon',
    experience: 16,
    fees: 900,
    hospital: 'Maharaja Agrasen Hospital, West Punjabi Bagh, Delhi',
    rating: 4.9,
    reviewsCount: 340,
    image: 'https://images.pexels.com/photos/10695742/pexels-photo-10695742.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Rashmi Grover',
    email: 'rashmi.grover@system.com',
    password: 'password123',
    specialization: 'Gynecologist',
    degree: 'MBBS, MS (OB-GYN), Infertility Specialist',
    experience: 14,
    fees: 850,
    hospital: 'Balaji Action Medical Institute, Paschim Vihar, Delhi',
    rating: 4.8,
    reviewsCount: 315,
    image: 'https://images.pexels.com/photos/6129444/pexels-photo-6129444.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Devendra Sahni',
    email: 'devendra.sahni@system.com',
    password: 'password123',
    specialization: 'Neurologist',
    degree: 'MBBS, MD, DM (Neurology)',
    experience: 15,
    fees: 950,
    hospital: 'Balaji Action Medical Institute, Paschim Vihar, Delhi',
    rating: 4.8,
    reviewsCount: 275,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Jagdish Kukreja',
    email: 'jagdish.kukreja@system.com',
    password: 'password123',
    specialization: 'General Physician',
    degree: 'MBBS, MD (Medicine), Diabetologist',
    experience: 23,
    fees: 650,
    hospital: 'Kukreja Hospital and Heart Centre, Rajouri Garden, Delhi',
    rating: 4.9,
    reviewsCount: 420,
    image: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Meenakshi Trehan',
    email: 'meenakshi.trehan@system.com',
    password: 'password123',
    specialization: 'Ophthalmologist',
    degree: 'MBBS, MS (Ophthalmology), Phaco & Lasik Surgeon',
    experience: 12,
    fees: 750,
    hospital: 'Metro Hospital, Ring Road, Rajouri Garden, Delhi',
    rating: 4.8,
    reviewsCount: 230,
    image: '/doctors/female_ophthalmologist.jpg',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Sameer Kaul',
    email: 'sameer.kaul@system.com',
    password: 'password123',
    specialization: 'Cardiologist',
    degree: 'MBBS, MD, DM (Cardiology), Interventional Cardiologist',
    experience: 17,
    fees: 1100,
    hospital: 'Max Super Speciality Hospital, Patparganj, Delhi',
    rating: 4.9,
    reviewsCount: 390,
    image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Nidhi Singhal',
    email: 'nidhi.singhal@system.com',
    password: 'password123',
    specialization: 'Pediatrician',
    degree: 'MBBS, DNB (Pediatrics), MNAMS',
    experience: 9,
    fees: 650,
    hospital: 'Metro Multispeciality Hospital, Preet Vihar, Delhi',
    rating: 4.8,
    reviewsCount: 195,
    image: 'https://images.pexels.com/photos/5407218/pexels-photo-5407218.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Rajiv Chhabra',
    email: 'rajiv.chhabra@system.com',
    password: 'password123',
    specialization: 'ENT Specialist',
    degree: 'MBBS, MS (ENT), Cochlear Implant Specialist',
    experience: 16,
    fees: 850,
    hospital: 'Dharamshila Narayana Superspeciality Hospital, Mayur Vihar, Delhi',
    rating: 4.8,
    reviewsCount: 280,
    image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Rekha Maheshwari',
    email: 'rekha.maheshwari@system.com',
    password: 'password123',
    specialization: 'Gynecologist',
    degree: 'MBBS, DGO, DNB (Obstetrics & Gynecology)',
    experience: 18,
    fees: 700,
    hospital: 'Jeevan Anmol Hospital, Mayur Vihar Phase 1, Delhi',
    rating: 4.9,
    reviewsCount: 340,
    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Manish Mahajan',
    email: 'manish.mahajan@system.com',
    password: 'password123',
    specialization: 'Neurologist',
    degree: 'MBBS, MD, DM (Neurology), Stroke Specialist',
    experience: 14,
    fees: 1000,
    hospital: 'Max Super Speciality Hospital, Shalimar Bagh, Delhi',
    rating: 4.9,
    reviewsCount: 310,
    image: 'https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Hemant Bhardwaj',
    email: 'hemant.bhardwaj@system.com',
    password: 'password123',
    specialization: 'Orthopedic',
    degree: 'MBBS, MS (Orthopedics), Joint Replacement',
    experience: 13,
    fees: 900,
    hospital: 'Fortis Hospital, A-Block, Shalimar Bagh, Delhi',
    rating: 4.8,
    reviewsCount: 260,
    image: 'https://images.pexels.com/photos/3845649/pexels-photo-3845649.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Aparna Mukherjee',
    email: 'aparna.mukherjee@system.com',
    password: 'password123',
    specialization: 'Pediatrician',
    degree: 'MBBS, MD (Pediatrics), Fellow Neonatal Intensive Care',
    experience: 11,
    fees: 950,
    hospital: 'Apollo Cradle & Children Hospital, Greater Kailash 2, Delhi',
    rating: 4.9,
    reviewsCount: 295,
    image: 'https://images.pexels.com/photos/4269695/pexels-photo-4269695.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Sanjay Sachdeva',
    email: 'sanjay.sachdeva@system.com',
    password: 'password123',
    specialization: 'ENT Specialist',
    degree: 'MBBS, MS (ENT), DLO, Senior Consultant',
    experience: 25,
    fees: 1000,
    hospital: 'Sant Parmanand Hospital, Civil Lines, Delhi',
    rating: 5.0,
    reviewsCount: 480,
    image: 'https://images.pexels.com/photos/4269698/pexels-photo-4269698.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Ankur Rastogi',
    email: 'ankur.rastogi@system.com',
    password: 'password123',
    specialization: 'Psychiatrist',
    degree: 'MBBS, MD (Psychiatry), Addiction Medicine',
    experience: 10,
    fees: 850,
    hospital: 'Vinayak Hospital, Derawal Nagar, Model Town, Delhi',
    rating: 4.8,
    reviewsCount: 190,
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  },
  {
    name: 'Dr. Meenakshi Sundaram',
    email: 'meenakshi.sundaram@system.com',
    password: 'password123',
    specialization: 'General Physician',
    degree: 'MBBS, MD (Internal Medicine)',
    experience: 16,
    fees: 1100,
    hospital: 'Primus Super Speciality Hospital, Chanakyapuri, Delhi',
    rating: 4.9,
    reviewsCount: 345,
    image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    slots_booked: {}
  }
];

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/doctor-booking';
    await mongoose.connect(connStr);
    console.log('MongoDB Connected for Seeding...');

    // Ensure Admin & Patient exist without wiping them
    let admin = await User.findOne({ email: 'admin@system.com' });
    if (!admin) {
      admin = await User.create({
        name: 'System Administrator',
        email: 'admin@system.com',
        password: 'password123',
        role: 'Admin',
        phone: '1234567890'
      });
      console.log('Created Admin account.');
    } else {
      console.log('Admin account already exists.');
    }

    let patient = await User.findOne({ email: 'patient@system.com' });
    if (!patient) {
      patient = await User.create({
        name: 'Hemant Kakran',
        email: 'patient@system.com',
        password: 'password123',
        role: 'Patient',
        phone: '9876543210'
      });
      console.log('Created Patient account.');
    } else {
      console.log('Patient account already exists.');
    }

    // Replace all doctors with full 50 Delhi doctors
    await Doctor.deleteMany({});
    console.log('Cleared old doctor records.');

    const seededDocs = await Doctor.create(DELHI_DOCTORS);
    console.log(`Successfully seeded ${seededDocs.length} Doctors across Delhi localities!`);

    // Ensure at least one mock appointment exists
    const existingAppt = await Appointment.findOne();
    if (!existingAppt && seededDocs.length > 0) {
      await Appointment.create({
        userId: patient._id,
        docId: seededDocs[0]._id,
        slotDate: '2026-10-18',
        slotTime: '10:00 AM',
        amount: seededDocs[0].fees,
        isCompleted: false,
        cancelled: false
      });
      console.log('Created initial appointment.');
    }

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

// Only execute seedData if run directly from the command line (e.g. node seed.js)
if (process.argv[1] && (process.argv[1].endsWith('seed.js') || process.argv[1].includes('seed.js'))) {
  seedData();
}

export { seedData };


