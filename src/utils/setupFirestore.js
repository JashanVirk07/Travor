import { db } from '../firebase.js';
import { 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { guideService, tourService } from '../services/firestoreService.js';

export const setupFirestoreData = async () => {
  try {
    console.log('🚀 Starting Firestore setup...');

    // 1. Create Guide Users
    const guide1Id = 'guide123';
    const guide2Id = 'guide456';
    const guide3Id = 'guide789';

    // Create guide user documents
    await setDoc(doc(db, 'users', guide1Id), {
      uid: guide1Id,
      email: 'jane.guide@example.com',
      name: 'Jane Smith',
      role: 'guide',
      phone: '+1234567891',
      bio: 'Passionate local guide with 5 years of experience',
      languages: ['English', 'Spanish', 'Japanese'],
      location: 'Tokyo, Japan',
      emailVerified: true,
      verificationStatus: 'verified',
      membershipStatus: 'active',
      membershipType: 'basic',
      isFirstYearFree: true,
      rating: 4.8,
      reviewCount: 12,
      toursCompleted: 25,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'users', guide2Id), {
      uid: guide2Id,
      email: 'carlos@example.com',
      name: 'Carlos Rodriguez',
      role: 'guide',
      phone: '+34123456789',
      bio: 'Expert in cultural heritage tours',
      languages: ['Spanish', 'English', 'Catalan'],
      location: 'Barcelona, Spain',
      emailVerified: true,
      verificationStatus: 'verified',
      membershipStatus: 'active',
      membershipType: 'basic',
      isFirstYearFree: true,
      rating: 4.9,
      reviewCount: 28,
      toursCompleted: 48,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'users', guide3Id), {
      uid: guide3Id,
      email: 'maria@example.com',
      name: 'Maria Santos',
      role: 'guide',
      phone: '+62123456789',
      bio: 'Beach and island specialist',
      languages: ['English', 'Indonesian', 'Dutch'],
      location: 'Bali, Indonesia',
      emailVerified: true,
      verificationStatus: 'verified',
      membershipStatus: 'active',
      membershipType: 'basic',
      isFirstYearFree: true,
      rating: 4.7,
      reviewCount: 15,
      toursCompleted: 32,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ Guide users created');

    // 2. Create Guide Profiles
    await setDoc(doc(db, 'guides', guide1Id), {
      userId: guide1Id,
      fullName: 'Jane Smith',
      email: 'jane.guide@example.com',
      bio: 'Passionate local guide with 5 years of experience showing travelers the authentic side of Tokyo',
      location: 'Tokyo, Japan',
      languages: ['English', 'Spanish', 'Japanese'],
      phone: '+1234567891',
      rating: 4.8,
      reviewCount: 12,
      tourCount: 3,
      toursCompleted: 25,
      isVerified: true,
      certifications: ['Licensed Tour Guide', 'First Aid Certified'],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'guides', guide2Id), {
      userId: guide2Id,
      fullName: 'Carlos Rodriguez',
      email: 'carlos@example.com',
      bio: 'Expert in cultural heritage tours across Barcelona and surrounding areas',
      location: 'Barcelona, Spain',
      languages: ['Spanish', 'English', 'Catalan'],
      phone: '+34123456789',
      rating: 4.9,
      reviewCount: 28,
      tourCount: 5,
      toursCompleted: 48,
      isVerified: true,
      certifications: ['UNESCO Heritage Guide'],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'guides', guide3Id), {
      userId: guide3Id,
      fullName: 'Maria Santos',
      email: 'maria@example.com',
      bio: 'Beach and island specialist offering unforgettable experiences in Bali',
      location: 'Bali, Indonesia',
      languages: ['English', 'Indonesian', 'Dutch'],
      phone: '+62123456789',
      rating: 4.7,
      reviewCount: 15,
      tourCount: 4,
      toursCompleted: 32,
      isVerified: true,
      certifications: ['Water Safety Instructor'],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ Guide profiles created');

    // 3. Create Tours
    const tours = [
      {
        title: 'Tokyo City Tour: Hidden Gems & Local Culture',
        description: "Explore Tokyo's hidden neighborhoods, local markets, and authentic restaurants away from tourist crowds. Experience the real Tokyo with a passionate local guide.",
        location: 'Tokyo, Japan',
        price: 95,
        duration: '4 hours',
        category: 'city',
        guideId: guide1Id,
        images: [
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800'
        ],
        highlights: [
          'Visit traditional markets',
          'Taste authentic street food',
          'Explore hidden temples',
          'Local neighborhood tour'
        ],
        included: ['Professional guide', 'Food tastings', 'Transportation', 'Photos'],
        maxParticipants: 8,
        meetingPoint: 'Shibuya Station, Hachiko Exit',
        difficulty: 'easy',
        languages: ['English', 'Japanese'],
      },
      {
        title: 'Paris Walking Tour: Montmartre & Hidden Streets',
        description: "Discover the artistic heart of Paris through charming cobblestone streets, historic cafés, and breathtaking views from Sacré-Cœur.",
        location: 'Paris, France',
        price: 120,
        duration: '3 hours',
        category: 'city',
        guideId: guide2Id,
        images: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800'
        ],
        highlights: [
          'Sacré-Cœur Basilica',
          'Artist studios',
          'Historic windmills',
          'Panoramic city views'
        ],
        included: ['Expert guide', 'Walking tour', 'Historical insights', 'Photo opportunities'],
        maxParticipants: 10,
        meetingPoint: 'Abbesses Metro Station',
        difficulty: 'moderate',
        languages: ['English', 'French'],
      },
      {
        title: 'Barcelona Tapas & Wine Experience',
        description: "Indulge in Barcelona's culinary delights with visits to authentic tapas bars and wine cellars in the Gothic Quarter.",
        location: 'Barcelona, Spain',
        price: 85,
        duration: '3.5 hours',
        category: 'cultural',
        guideId: guide2Id,
        images: [
          'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
          'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800'
        ],
        highlights: ['5 tapas stops', 'Local wines', 'Gothic Quarter', 'Food history'],
        included: ['Food & drinks', 'Local guide', 'Walking tour', 'Recipe cards'],
        maxParticipants: 12,
        meetingPoint: 'Plaça Reial',
        difficulty: 'easy',
        languages: ['English', 'Spanish', 'Catalan'],
      },
      {
        title: 'Bali Beach Hopping & Snorkeling Adventure',
        description: "Explore Bali's most beautiful beaches, crystal-clear waters, and vibrant coral reefs on this full-day adventure.",
        location: 'Bali, Indonesia',
        price: 110,
        duration: '8 hours',
        category: 'beach',
        guideId: guide3Id,
        images: [
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
        ],
        highlights: ['3 pristine beaches', 'Snorkeling', 'Lunch on beach', 'Sunset views'],
        included: ['Transportation', 'Snorkeling gear', 'Lunch', 'Guide', 'Photos'],
        maxParticipants: 6,
        meetingPoint: 'Seminyak Beach Hotel Lobby',
        difficulty: 'easy',
        languages: ['English', 'Indonesian'],
      },
      {
        title: 'Mount Fuji Hiking Experience with Local Guide',
        description: "Hike the iconic Mount Fuji with an experienced guide. Enjoy breathtaking views and learn about the mountain's cultural significance.",
        location: 'Mount Fuji, Japan',
        price: 180,
        duration: '10 hours',
        category: 'mountain',
        guideId: guide1Id,
        images: [
          'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800',
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800'
        ],
        highlights: ['Summit climb', 'Sunrise views', 'Cultural insights', 'Photography spots'],
        included: ['Professional guide', 'Transportation', 'Hiking equipment', 'Lunch', 'First aid kit'],
        maxParticipants: 6,
        meetingPoint: 'Kawaguchiko Station',
        difficulty: 'challenging',
        languages: ['English', 'Japanese'],
      },
      {
        title: 'Ancient Rome: Colosseum & Forum Deep Dive',
        description: 'Step back in time to Ancient Rome with skip-the-line access to the Colosseum and Roman Forum.',
        location: 'Rome, Italy',
        price: 145,
        duration: '4 hours',
        category: 'cultural',
        guideId: guide3Id,
        images: [
          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
          'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800'
        ],
        highlights: ['Skip-the-line access', 'Colosseum arena floor', 'Roman Forum', 'Palatine Hill'],
        included: ['Expert guide', 'Entrance tickets', 'Headsets', 'Bottled water'],
        maxParticipants: 15,
        meetingPoint: 'Colosseum Metro Station',
        difficulty: 'moderate',
        languages: ['English', 'Italian'],
      }
    ];

    for (const tour of tours) {
      await tourService.createTour(tour.guideId, tour);
    }

    console.log('✅ Tours created');

    // 4. Create Memberships
    await setDoc(doc(db, 'memberships', guide1Id), {
      userId: guide1Id,
      type: 'basic',
      status: 'active',
      startDate: '2025-01-01T00:00:00.000Z',
      endDate: '2026-01-01T00:00:00.000Z',
      isFirstYearFree: true,
      privileges: {
        featuredListing: false,
        prioritySupport: false,
        advancedAnalytics: false,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'memberships', guide2Id), {
      userId: guide2Id,
      type: 'basic',
      status: 'active',
      startDate: '2024-06-01T00:00:00.000Z',
      endDate: '2025-06-01T00:00:00.000Z',
      isFirstYearFree: true,
      privileges: {
        featuredListing: false,
        prioritySupport: false,
        advancedAnalytics: false,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, 'memberships', guide3Id), {
      userId: guide3Id,
      type: 'basic',
      status: 'active',
      startDate: '2024-08-01T00:00:00.000Z',
      endDate: '2025-08-01T00:00:00.000Z',
      isFirstYearFree: true,
      privileges: {
        featuredListing: false,
        prioritySupport: false,
        advancedAnalytics: false,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ Memberships created');

    console.log('🎉 Firestore setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up Firestore:', error);
    throw error;
  }
};