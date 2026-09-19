// Curated, high-resolution topic-specific images for campus events
// Each image is carefully selected to accurately represent the specific activity.

export interface TopicPreset {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  imageUrl: string;
}

export const TOPIC_PRESETS: TopicPreset[] = [
  // --- TECH & AI ---
  {
    id: 'ai-robotics',
    label: 'Artificial Intelligence & Robotics',
    category: 'Tech',
    keywords: ['ai', 'artificial intelligence', 'robot', 'machine learning', 'deep learning', 'neural', 'autonomous'],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'hackathon',
    label: 'Hackathon & Dev Sprint',
    category: 'Tech',
    keywords: ['hackathon', 'hacking', 'sprint', 'dev sprint', 'late night'],
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'web-coding',
    label: 'Web Dev & Software Engineering',
    category: 'Tech',
    keywords: ['web', 'react', 'coding', 'code', 'software', 'programming', 'javascript', 'python', 'frontend', 'backend', 'fullstack'],
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'cyber-security',
    label: 'Cybersecurity & Networks',
    category: 'Tech',
    keywords: ['security', 'cyber', 'network', 'firewall', 'crypto', 'blockchain'],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'data-analytics',
    label: 'Data Science & Cloud',
    category: 'Tech',
    keywords: ['data', 'analytics', 'cloud', 'aws', 'database', 'docker', 'kubernetes'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
  },

  // --- MUSIC & CULTURAL ---
  {
    id: 'live-concert',
    label: 'Live Concert & Festival',
    category: 'Music',
    keywords: ['concert', 'festival', 'fest', 'band', 'neon', 'stage', 'live music'],
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'acoustic-guitar',
    label: 'Acoustic Jam & Guitar',
    category: 'Music',
    keywords: ['acoustic', 'guitar', 'unplugged', 'jam', 'folk', 'strings'],
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'dj-night',
    label: 'DJ Night & Electronic Beats',
    category: 'Music',
    keywords: ['dj', 'electronic', 'edm', 'club night', 'party', 'beats', 'dance'],
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'jazz-band',
    label: 'Jazz & Brass Ensemble',
    category: 'Music',
    keywords: ['jazz', 'brass', 'sax', 'trumpet', 'blues', 'orchestra'],
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'open-mic',
    label: 'Open Mic & Vocals',
    category: 'Music',
    keywords: ['open mic', 'sing', 'singer', 'voice', 'karaoke', 'vocals', 'choir'],
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=1200'
  },

  // --- SPORTS & ATHLETICS ---
  {
    id: 'basketball',
    label: 'Basketball Championship',
    category: 'Sports',
    keywords: ['basketball', 'hoop', 'nba', 'dunk', 'court'],
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'football-soccer',
    label: 'Soccer & Football Tournament',
    category: 'Sports',
    keywords: ['soccer', 'football', 'pitch', 'penalty', 'fifa'],
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'cricket',
    label: 'Cricket Cup & Derby',
    category: 'Sports',
    keywords: ['cricket', 'bat', 'bowl', 'wicket', 'ipl'],
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'running-marathon',
    label: 'Marathon & Fun Run',
    category: 'Sports',
    keywords: ['run', 'running', 'marathon', '5k', '10k', 'sprint', 'track', 'athletics'],
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'tennis',
    label: 'Tennis Match',
    category: 'Sports',
    keywords: ['tennis', 'racket', 'serve', 'wimbledon'],
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'swimming',
    label: 'Swimming & Water Sports',
    category: 'Sports',
    keywords: ['swim', 'swimming', 'pool', 'relay', 'freestyle', 'dive'],
    imageUrl: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'badminton',
    label: 'Badminton Championship',
    category: 'Sports',
    keywords: ['badminton', 'shuttlecock', 'smash', 'rally'],
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'esports',
    label: 'Esports & Gaming Classic',
    category: 'Sports',
    keywords: ['esports', 'gaming', 'gamer', 'lan party', 'tournament', 'valorant', 'fifa'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'
  },

  // --- ART & DESIGN ---
  {
    id: 'painting-art',
    label: 'Painting & Fine Arts',
    category: 'Art',
    keywords: ['paint', 'painting', 'watercolor', 'canvas', 'acrylic', 'oil', 'brush', 'sketch', 'draw'],
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'photography',
    label: 'Photography & Photo Walk',
    category: 'Art',
    keywords: ['photo', 'photography', 'camera', 'walk', 'shutter', 'lens', 'portrait'],
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'art-gallery',
    label: 'Art Gallery & Exhibitions',
    category: 'Art',
    keywords: ['gallery', 'exhibit', 'exhibition', 'museum', 'sculpture', 'installation'],
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'theatre-drama',
    label: 'Theatre, Drama & Acting',
    category: 'Art',
    keywords: ['theatre', 'theater', 'drama', 'acting', 'play', 'stage', 'actor', 'film'],
    imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'poetry-literature',
    label: 'Poetry & Literature Salon',
    category: 'Art',
    keywords: ['poetry', 'poem', 'literature', 'book', 'writing', 'reading', 'author', 'verse'],
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200'
  },

  // --- WORKSHOP & INNOVATION ---
  {
    id: 'workshop-general',
    label: 'Collaborative Lab & Workshop',
    category: 'Workshop',
    keywords: ['workshop', 'bootcamp', 'hands-on', 'lab', 'training', 'masterclass'],
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'ui-design-thinking',
    label: 'UI/UX & Design Thinking',
    category: 'Workshop',
    keywords: ['design thinking', 'ui', 'ux', 'wireframe', 'figma', 'prototype', 'product design'],
    imageUrl: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'green-planet',
    label: 'Sustainability & Green Science',
    category: 'Workshop',
    keywords: ['green', 'planet', 'sustainability', 'environment', 'eco', 'earth', 'nature'],
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200'
  },

  // --- CAREER & CONFERENCE ---
  {
    id: 'job-fair',
    label: 'Job Fair & Career Expo',
    category: 'Career',
    keywords: ['job', 'career', 'fair', 'expo', 'hire', 'internship', 'recruitment'],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'startup-pitch',
    label: 'Startup Pitch & Founders Club',
    category: 'Career',
    keywords: ['startup', 'pitch', 'founder', 'venture', 'entrepreneur', 'investor', 'demo day'],
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'resume-review',
    label: 'Resume Review & Mentorship',
    category: 'Career',
    keywords: ['resume', 'cv', 'interview', 'mentor', 'consultation', 'portfolio'],
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'conference-keynote',
    label: 'Keynote & Tech Summit',
    category: 'Conference',
    keywords: ['conference', 'summit', 'keynote', 'seminar', 'symposium', 'forum'],
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200'
  },

  // --- SOCIAL & COMMUNITY ---
  {
    id: 'campus-fest',
    label: 'Campus Fest & Mixer',
    category: 'Social',
    keywords: ['fest', 'mixer', 'social', 'freshers', 'orientation', 'meetup', 'carnival'],
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'bonfire-social',
    label: 'Bonfire & Stargazing Night',
    category: 'Social',
    keywords: ['bonfire', 'fire', 'campfire', 'stargazing', 'night'],
    imageUrl: 'https://images.unsplash.com/photo-1533421821268-87e42c1d70b0?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'yoga-mindfulness',
    label: 'Yoga, Meditation & Wellness',
    category: 'Social',
    keywords: ['yoga', 'meditation', 'wellness', 'mindfulness', 'breathing', 'zen', 'morning yoga'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'board-games-chess',
    label: 'Board Games & Chess Club',
    category: 'Social',
    keywords: ['chess', 'board game', 'tabletop', 'catan', 'monopoly'],
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'movie-night',
    label: 'Outdoor Movie & Cinema',
    category: 'Social',
    keywords: ['movie', 'cinema', 'screening', 'film night', 'popcorn'],
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200'
  }
];

// Fallback pool by general category
export const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  Tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
  Music: 'https://images.unsplash.com/photo-1514525253361-bee243870eb2?auto=format&fit=crop&q=80&w=1200',
  Sports: 'https://images.unsplash.com/photo-1461896756961-9c60e33ef72f?auto=format&fit=crop&q=80&w=1200',
  Art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1200',
  Workshop: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200',
  Career: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
  Conference: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200',
  Social: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200',
  Nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200'
};

/**
 * Intelligent topic image resolver:
 * Matches event title and category against curated high-resolution topic presets.
 * Validates and falls back safely if a provided URL is generic (e.g. picsum placeholder) or missing.
 */
export function getTopicImageUrl(title: string = '', category: string = '', providedUrl?: string): string {
  // If a valid custom, non-placeholder URL was supplied and isn't a picsum fallback, keep it
  if (providedUrl && 
      !providedUrl.includes('picsum.photos') && 
      !providedUrl.includes('via.placeholder') &&
      providedUrl.startsWith('http')) {
    return providedUrl;
  }

  const cleanTitle = title.toLowerCase().trim();
  const cleanCat = category.toLowerCase().trim();

  // 1. Check for specific topic keyword matches in title
  for (const preset of TOPIC_PRESETS) {
    for (const kw of preset.keywords) {
      if (cleanTitle.includes(kw)) {
        return preset.imageUrl;
      }
    }
  }

  // 2. Check for category match in presets
  const catMatches = TOPIC_PRESETS.filter(p => p.category.toLowerCase() === cleanCat);
  if (catMatches.length > 0) {
    // Pick first matching preset or hash based on title
    let hash = 0;
    for (let i = 0; i < cleanTitle.length; i++) {
      hash = (hash << 5) - hash + cleanTitle.charCodeAt(i);
    }
    const index = Math.abs(hash) % catMatches.length;
    return catMatches[index].imageUrl;
  }

  // 3. Fallback to standard category image
  for (const [key, url] of Object.entries(CATEGORY_DEFAULT_IMAGES)) {
    if (key.toLowerCase() === cleanCat) {
      return url;
    }
  }

  // 4. Ultimate general fallback
  return CATEGORY_DEFAULT_IMAGES['Tech'];
}
