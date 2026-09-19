import { db, auth } from './firebase';
import { collection, addDoc, Timestamp, doc, setDoc, writeBatch, getDocs } from 'firebase/firestore';
import { addDays, setHours, setMinutes } from 'date-fns';
import { getTopicImageUrl } from './eventImages';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

export async function promoteToAdmin(uid: string) {
  try {
    const batch = writeBatch(db);
    
    // 1. Update user profile to admin
    const profileRef = doc(db, 'users', uid);
    batch.update(profileRef, { role: 'admin' });
    
    // 2. Add to admins collection
    const adminRef = doc(db, 'admins', uid);
    batch.set(adminRef, { uid, createdAt: Timestamp.now() });
    
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid} + admins/${uid}`);
  }
}

export async function seedEvents() {
  const events = [];
  const now = new Date();
  
  const organizers = [
    { id: 'admin_seed', name: 'Campus Admin' },
    { id: 'sports_club', name: 'Spartans Sports Club' },
    { id: 'tech_club', name: 'Binary Wolves' },
    { id: 'arts_club', name: 'Fine Arts Society' },
    { id: 'music_club', name: 'Melody Makers' }
  ];

  const categories = ['Tech', 'Music', 'Sports', 'Art', 'Workshop', 'Conference', 'Social', 'Career'];

  const categoryImages: Record<string, string[]> = {
    'Tech': [
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
      'https://images.unsplash.com/photo-1525547718571-03b0fce7a338',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1'
    ],
    'Music': [
      'https://images.unsplash.com/photo-1514525253361-bee243870eb2',
      'https://images.unsplash.com/photo-1459749411177-04218006d44d',
      'https://images.unsplash.com/photo-1501612780327-45045538702b',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
      'https://images.unsplash.com/photo-1493225255756-d9584f8606e9'
    ],
    'Sports': [
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a',
      'https://images.unsplash.com/photo-1461896756961-9c60e33ef72f',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b',
      'https://images.unsplash.com/photo-1493711662062-fa558ad9d0be',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf'
    ],
    'Art': [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19',
      'https://images.unsplash.com/photo-1549490349-8643362247b5',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11',
      'https://images.unsplash.com/photo-1521120466152-d7b445a03b6b'
    ],
    'Workshop': [
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998',
      'https://images.unsplash.com/photo-1552664730-d307ca884978',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45'
    ],
    'Social': [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
      'https://images.unsplash.com/photo-1519671482749-fd09be4ccebf',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      'https://images.unsplash.com/photo-1543269601-125996395b44',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952'
    ],
    'Career': [
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902',
      'https://images.unsplash.com/photo-1454165833267-0339391427b7',
      'https://images.unsplash.com/photo-1542744173-8e0ee26df199',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      'https://images.unsplash.com/photo-1521791136064-7986c2959d93',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf'
    ]
  };

  // Generate 8 per day for the next 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const targetDate = addDays(now, dayOffset);
    const isFriday = targetDate.getDay() === 5; 

    for (let i = 0; i < 8; i++) {
      let eventTitle = '';
      let eventDesc = '';
      let eventCategory = '';
      
      const hour = 10 + (i * 1.5);
      const eventTime = setHours(setMinutes(targetDate, 0), hour);

      if (isFriday && i < 6) { 
        const sports = [
          'Varsity Basketball Cup', 'Campus Cricket Cup', 'Campus Fun Run',
          'Pool Swim Contest', 'Campus Tennis Match', 'Badminton Rally Game'
        ];
        eventTitle = sports[i % sports.length];
        eventDesc = `Join us for the thrilling ${eventTitle}. Support your favorite team and enjoy the spirit of sportsmanship!`;
        eventCategory = 'Sports';
      } else {
        const general = [
          { title: 'Intro to Web Design', cat: 'Workshop' },
          { title: 'Modern Web Basics', cat: 'Tech' },
          { title: 'Outdoor Photo Walk', cat: 'Art' },
          { title: 'Acoustic Guitar Club', cat: 'Music' },
          { title: 'Industry Job Fair', cat: 'Career' },
          { title: 'Green Planet Forum', cat: 'Workshop' },
          { title: 'Watercolor Painting Class', cat: 'Art' },
          { title: 'Student Career Mixer', cat: 'Social' },
          { title: 'AI Ethics Chat', cat: 'Tech' },
          { title: 'Singers Open Mic', cat: 'Music' },
          { title: 'Creative Poem Reading', cat: 'Art' },
          { title: 'Beginner Code Camp', cat: 'Tech' },
          { title: 'Startup Pitch Help', cat: 'Career' },
          { title: 'Morning Yoga Group', cat: 'Social' },
          { title: 'Casual Chess Club', cat: 'Social' }
        ];
        const g = general[(dayOffset + i) % general.length];
        eventTitle = g.title;
        eventDesc = `A great opportunity to learn about ${eventTitle}. Open to all students and staff. Refreshments provided.`;
        eventCategory = g.cat;
      }

      // Assign accurate, high-resolution topic image matching the exact activity
      const imageUrl = getTopicImageUrl(eventTitle, eventCategory);

      const organizer = organizers[Math.floor(Math.random() * organizers.length)];

      events.push({
        title: eventTitle,
        description: eventDesc,
        shortSummary: eventDesc.slice(0, 100),
        date: Timestamp.fromDate(eventTime),
        location: i % 2 === 0 ? 'Main Auditorium' : 'Student Union Lawn',
        venue: i % 2 === 0 ? 'Block A' : 'South Campus',
        organizerId: organizer.id,
        organizerName: organizer.name,
        categories: [eventCategory],
        imageUrl,
        status: 'approved',
        isFree: i % 3 !== 0,
        price: i % 3 === 0 ? 10 : 0,
        attendeeCount: Math.floor(Math.random() * 50),
        createdAt: Timestamp.now()
      });
    }
  }

  try {
    const batch = writeBatch(db);
    const eventsCollection = collection(db, 'events');

    for (const event of events) {
      const newDocRef = doc(eventsCollection);
      batch.set(newDocRef, {
        ...event,
        updatedAt: Timestamp.now()
      });
    }

    await batch.commit();
    return events.map((_, i) => `seeded-${i}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'events/batch');
    return [];
  }
}

/**
 * Updates any pre-existing events in Firestore to have high-resolution topic-specific images.
 */
export async function updateExistingEventsWithTopicImages() {
  try {
    const eventsCollection = collection(db, 'events');
    const snap = await getDocs(eventsCollection);
    const batch = writeBatch(db);
    let count = 0;

    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const currentUrl = data.imageUrl || '';
      // If image is missing or a placeholder, update to curated topic image
      if (!currentUrl || currentUrl.includes('picsum.photos') || currentUrl.includes('placeholder')) {
        const topicUrl = getTopicImageUrl(data.title || '', data.categories?.[0] || 'Tech');
        batch.update(docSnap.ref, {
          imageUrl: topicUrl,
          updatedAt: Timestamp.now()
        });
        count++;
      }
    }

    if (count > 0) {
      await batch.commit();
    }
    return count;
  } catch (error) {
    console.error("Error updating existing events with topic images:", error);
    return 0;
  }
}
