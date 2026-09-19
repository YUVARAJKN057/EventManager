import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit, orderBy, documentId } from 'firebase/firestore';
import EventCard, { Event } from '../components/events/EventCard';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent } from '../components/ui/card';
import { Sparkles, TrendingUp, Calendar as CalendarIcon, Bookmark, Plus, Bell, Megaphone, Zap, Users as UsersIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import Featured3DStage from '../components/3d/Featured3DStage';
import Event3DVisual from '../components/3d/Event3DVisual';
import { getTopicImageUrl } from '../lib/eventImages';

export default function Dashboard() {
  const { profile } = useAuth();
  const [recommended, setRecommended] = useState<Event[]>([]);
  const [trending, setTrending] = useState<Event[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getTodayAbbrew = () => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
    const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return map[dayIndex];
  };

  const getWeekDates = () => {
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const distanceToMonday = currentDayIndex === 0 ? -6 : 1 - currentDayIndex;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);
    
    return weekDays.map((day, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      
      const isToday = d.getDate() === today.getDate() && 
                      d.getMonth() === today.getMonth() && 
                      d.getFullYear() === today.getFullYear();
                      
      return {
        name: day,
        date: d.getDate(),
        month: d.toLocaleString('en-US', { month: 'short' }),
        isToday
      };
    });
  };

  const weekDates = getWeekDates();
  const [selectedDay, setSelectedDay] = useState(getTodayAbbrew());

  const outlookEvents = {
    'Mon': [
      { id: 'm1', title: 'React Coding Lab', time: '10:00 AM', category: 'Tech', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop' },
      { id: 'm2', title: 'Data Science Chat', time: '01:30 PM', category: 'Tech', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop' },
      { id: 'm3', title: 'Campus Green Walk', time: '04:00 PM', category: 'Nature', imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=400&fit=crop' },
      { id: 'm4', title: 'Late Night Hacking', time: '09:00 PM', category: 'Tech', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop' }
    ],
    'Tue': [
      { id: 't1', title: 'Public Speech Basics', time: '11:00 AM', category: 'Workshop', imageUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=400&h=400&fit=crop' },
      { id: 't2', title: 'Music Theory Basics', time: '02:00 PM', category: 'Music', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop' },
      { id: 't3', title: 'Startup Idea Prep', time: '05:30 PM', category: 'Career', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop' },
      { id: 't4', title: 'Board Game Night', time: '07:00 PM', category: 'Social', imageUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc54ee481b?w=400&h=400&fit=crop' }
    ],
    'Wed': [
      { id: 'w1', title: 'Abstract Paint Lab', time: '10:30 AM', category: 'Art', imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=400&fit=crop' },
      { id: 'w2', title: 'Jazz Band Jam', time: '01:00 PM', category: 'Music', imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop' },
      { id: 'w3', title: 'AI History Lecture', time: '04:00 PM', category: 'Tech', imageUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400&h=400&fit=crop' },
      { id: 'w4', title: 'Poetry Jam Night', time: '08:00 PM', category: 'Art', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=400&h=400&fit=crop' }
    ],
    'Thu': [
      { id: 'th1', title: 'Resume Review Day', time: '09:00 AM', category: 'Career', imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop' },
      { id: 'th2', title: 'Web Career Mixer', time: '12:00 PM', category: 'Career', imageUrl: 'https://images.unsplash.com/photo-1515378717309-4ffc375fe17a?w=400&h=400&fit=crop' },
      { id: 'th3', title: 'Web Security Talk', time: '03:30 PM', category: 'Tech', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop' },
      { id: 'th4', title: 'Standup Comedy Hub', time: '09:00 PM', category: 'Social', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=400&h=400&fit=crop' }
    ],
    'Fri': [
      { id: 'f1', title: 'Campus Soccer Game', time: '03:00 PM', category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=400&fit=crop' },
      { id: 'f2', title: 'Street Ball Tournament', time: '05:00 PM', category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop' },
      { id: 'f3', title: 'Swimming Relay Race', time: '06:30 PM', category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=400&h=400&fit=crop' },
      { id: 'f4', title: 'Warm Friday Bonfire', time: '08:00 PM', category: 'Social', imageUrl: 'https://images.unsplash.com/photo-1533421821268-87e42c1d70b0?w=400&h=400&fit=crop' }
    ],
    'Sat': [
      { id: 's1', title: 'Morning Five K Run', time: '08:00 AM', category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=400&fit=crop' },
      { id: 's2', title: 'Fresh Farmers Market', time: '11:00 AM', category: 'Social', imageUrl: 'https://images.unsplash.com/photo-1488459711615-228239797306?w=400&h=400&fit=crop' },
      { id: 's3', title: 'Camera Photo Walk', time: '03:00 PM', category: 'Art', imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop' },
      { id: 's4', title: 'Outdoor Movie Night', time: '08:30 PM', category: 'Social', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop' }
    ],
    'Sun': [
      { id: 'sn1', title: 'Sunday Pancake Bar', time: '10:00 AM', category: 'Social', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop' },
      { id: 'sn2', title: 'Silent Co-working', time: '01:00 PM', category: 'Workshop', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop' },
      { id: 'sn3', title: 'Local Helping Day', time: '03:00 PM', category: 'Social', imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=400&fit=crop' },
      { id: 'sn4', title: 'Zen Breathing Group', time: '07:00 PM', category: 'Social', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop' }
    ]
  };

  const getFallbackCategoryImg = (category: string) => {
    return getTopicImageUrl('', category);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const eventsRef = collection(db, 'events');
        
        // Recommended
        const qRec = query(eventsRef, where('status', '==', 'approved'), limit(8));
        const snapRecResult = await getDocs(qRec).catch(() => null);

        let allEvents: Event[] = [];
        if (snapRecResult && !snapRecResult.empty) {
          allEvents = snapRecResult.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        }

        setRecommended(allEvents.slice(0, 4));

        // Sort by attendee count for trending without crashing if composite index is missing
        const sortedTrending = [...allEvents].sort((a, b) => (b.attendeeCount || 0) - (a.attendeeCount || 0));
        setTrending(sortedTrending.slice(0, 4));

        // Bookmarks
        if (profile?.bookmarks?.length) {
          const qBook = query(eventsRef, where(documentId(), 'in', profile.bookmarks.slice(0, 3)));
          const snapBook = await getDocs(qBook).catch(() => null);
          if (snapBook) {
            setBookmarkedEvents(snapBook.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
          }
        } else {
          setBookmarkedEvents([]);
        }

      } catch (error) {
        console.error("Dashboard data load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [profile?.bookmarks]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hello Section */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl tracking-tight">
            Welcome back, {profile?.displayName?.split(' ')[0] || 'Student'} ⚡️
          </h1>
          <p className="mt-2 text-zinc-400 sm:text-lg">Here's what's happening in your campus community today.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/explore" className="flex-1 sm:flex-none">
            <Button variant="outline" className="h-12 w-full rounded-xl border-zinc-900 bg-zinc-950 border px-6 transition-all hover:bg-zinc-900">
              <CalendarIcon className="mr-2 h-4 w-4 text-indigo-400" /> Calendar
            </Button>
          </Link>
          <Link to="/portal" className="flex-1 sm:flex-none">
            <Button className="h-12 w-full rounded-xl shadow-lg shadow-indigo-600/20 font-bold px-6 bg-indigo-600 hover:bg-indigo-700 transition-all">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Announcements Scroller */}
      <div className="mb-12 overflow-hidden rounded-2xl bg-zinc-900/30 border border-zinc-800/50 relative h-12 flex items-center">
        <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center gap-2 px-6 bg-zinc-950/80 backdrop-blur-md border-r border-zinc-800/50 shadow-[10px_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
            <Bell className="h-3.5 w-3.5" />
            Live Updates
          </div>
        </div>
        <div className="flex gap-12 animate-marquee whitespace-nowrap pl-[140px]">
          {[
            "Campus sports meet registration ends tomorrow!",
            "New Workshop: AI & Robotics in Main Auditorium at 2PM",
            "Lost & Found: Student ID found near library",
            "Hackathon 2026: Prize pool updated to ₹4,00,000",
            "Cafeteria closed on Friday for maintenance",
            "New Library hours: Open until midnight starting next week"
          ].map((text, i) => (
            <span key={i} className="text-xs font-bold text-zinc-400 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-indigo-500" /> {text}
            </span>
          ))}
        </div>
      </div>

      {/* Weekly Outlook */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
            Weekly Outlook
          </h2>
          <span className="text-xs text-zinc-500 font-bold font-mono tracking-wide">
            {weekDates[0]?.month} {weekDates[0]?.date} - {weekDates[6]?.month} {weekDates[6]?.date}
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
          {weekDates.map((dayInfo) => {
            const day = dayInfo.name;
            const isToday = dayInfo.isToday;
            return (
              <button 
                key={day} 
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 w-24 p-4 rounded-2xl border transition-all text-center cursor-pointer ${
                  selectedDay === day 
                    ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-600/20 text-white scale-105' 
                    : isToday
                      ? 'bg-zinc-900 border-indigo-500 text-indigo-400 hover:bg-zinc-850 hover:border-indigo-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                  {day} {isToday && <span className="text-indigo-400 opacity-90 font-extrabold">(Today)</span>}
                </p>
                <p className="text-xl font-black">{dayInfo.date}</p>
                <div className={`mx-auto mt-2 h-1.5 w-1.5 rounded-full ${selectedDay === day ? 'bg-white' : isToday ? 'bg-indigo-400' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>

        {/* Selected Day Events */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2"
          >
            {outlookEvents[selectedDay as keyof typeof outlookEvents].map((event) => (
              <div key={event.id} className="group p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 transition-all flex gap-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 group-hover:border-indigo-500/30 transition-all relative">
                  <Event3DVisual
                    category={event.category}
                    title={event.title}
                    imageUrl={event.imageUrl}
                    interactive={false}
                    showControls={false}
                    defaultView="photo"
                    className="h-full w-full"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link 
                        to={`/explore?category=${encodeURIComponent(event.category)}`}
                        className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        {event.category}
                      </Link>
                      <span className="text-[9px] font-bold text-zinc-500">{event.time}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex -space-x-1.5">
                      {[1, 2].map((j) => (
                        <div key={j} className="h-5 w-5 rounded-full border-2 border-zinc-900 bg-zinc-800 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${event.id}${j}`} alt="attendee" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                    <Link to={event.id.startsWith('seeded') ? '/explore' : `/event/${event.id}`}>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-indigo-400 hover:bg-indigo-500/10">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Interactive 3D Spotlight Stage */}
      <section className="mb-12">
        <Featured3DStage />
      </section>

      {/* Recommended Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600/10 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Recommended for You</h2>
          </div>
          <Link to="/explore" className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">View all →</Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-[16/9] w-full rounded-xl bg-zinc-900" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
            {recommended.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
                Update your interests to get personalized recommendations!
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Trending Section */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-600/10 text-orange-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Trending on Campus</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl bg-zinc-900" />
              ))
            ) : (
              trending.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/event/${event.id}`}>
                    <Card className="group border-zinc-900 bg-zinc-900 transition-all hover:bg-zinc-800/50 hover:border-indigo-500/20">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                          <img 
                            src={event.imageUrl || `https://picsum.photos/seed/${event.id}/200/200`} 
                            className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                            alt={event.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${event.id}/200/200`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white group-hover:text-indigo-400 truncate text-sm">{event.title}</h3>
                          <div className="mt-1 flex items-center gap-3 text-[10px] text-zinc-500 font-medium">
                            <span className="truncate">{event.organizerName}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-700 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Clubs & Activity */}
        <div className="space-y-8">
          <div>
            <h2 className="mb-6 flex items-center text-xl font-bold text-white tracking-tight">
              <Bookmark className="mr-2 h-5 w-5 text-indigo-500" />
              My Saved
            </h2>
            <Card className="border-zinc-900 bg-zinc-900/50 backdrop-blur-xl">
              <CardContent className="p-4">
                {(profile?.bookmarks?.length || 0) > 0 ? (
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Recently Bookmarked</p>
                    <div className="space-y-3">
                      {bookmarkedEvents.map((event) => (
                        <Link key={event.id} to={`/event/${event.id}`} className="flex items-center gap-3 group">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                            <img 
                              src={event.imageUrl || `https://picsum.photos/seed/${event.id}/100/100`} 
                              className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                              alt={event.title}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${event.id}/100/100`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white group-hover:text-indigo-400 truncate transition-colors">{event.title}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{event.location}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link to="/profile" className="block pt-2 text-center text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                      View all {profile?.bookmarks?.length} bookmarks →
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-zinc-500 italic">No events saved yet.</p>
                    <Link to="/explore">
                      <Button variant="link" className="mt-2 text-xs text-indigo-400">Start exploring</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-6 flex items-center text-xl font-bold text-white tracking-tight">
              <Megaphone className="mr-2 h-5 w-5 text-indigo-500" />
              Community Feed
            </h2>
            <Card className="border-zinc-900 bg-zinc-900/50 backdrop-blur-xl">
              <CardContent className="p-4 space-y-4">
                {[
                  { user: "Alex J.", action: "bookmarked", event: "Art Expo 2026", time: "2m ago" },
                  { user: "Sarah L.", action: "registered for", event: "Tech Talk", time: "15m ago" },
                  { user: "Club Alpha", action: "announced", event: "New Meetup", time: "1h ago" }
                ].map((act, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-zinc-800 last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 shrink-0 flex items-center justify-center">
                      <UsersIcon className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-200">
                        <span className="font-black text-indigo-400">{act.user}</span> {act.action} <span className="font-bold text-white">{act.event}</span>
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-6 text-xl font-bold text-white">Top Clubs</h2>
            <div className="space-y-4">
              {[
                { id: 'club_1', name: 'Developer Guild', members: '1.2k', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop' },
                { id: 'club_2', name: 'Creative Arts', members: '800', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=100&h=100&fit=crop' },
                { id: 'club_3', name: 'Eco Warriors', members: '500', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop' }
              ].map((club, i) => (
                <div key={club.id} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-zinc-900 group">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                    <img 
                      src={club.img} 
                      className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                      alt={club.name} 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${club.id}/100/100`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{club.name}</p>
                    <p className="text-[10px] text-zinc-500">{club.members} students</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10">Follow</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
