import { useAuth } from '../hooks/useAuth';
import { db, auth } from '../lib/firebase';
import { doc, updateDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { User, Mail, Shield, Check, Plus, Trash2, Bookmark, Calendar, QrCode, LogOut, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EventCard, { Event } from '../components/events/EventCard';
import Ticket from '../components/events/Ticket';

export default function ProfilePage() {
  const { profile, user, toggleReminder } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Event[]>([]);
  const [rsvpEvents, setRsvpEvents] = useState<Event[]>([]);
  const [reminderEvents, setReminderEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'interests' | 'bookmarks' | 'rsvps' | 'tickets' | 'reminders'>('interests');

  const categories = ['Tech', 'Music', 'Sports', 'Art', 'Workshop', 'Conference', 'Social', 'Career', 'Environment'];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!profile) return;
      try {
        const eventsRef = collection(db, 'events');
        
        // Fetch bookmarks
        if (profile.bookmarks?.length) {
          const qBook = query(eventsRef, where(documentId(), 'in', profile.bookmarks));
          const snapBook = await getDocs(qBook);
          setBookmarkedEvents(snapBook.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
        } else {
          setBookmarkedEvents([]);
        }

        // Fetch RSVPs
        if (profile.rsvps?.length) {
          const qRsvp = query(eventsRef, where(documentId(), 'in', profile.rsvps));
          const snapRsvp = await getDocs(qRsvp);
          setRsvpEvents(snapRsvp.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
        } else {
          setRsvpEvents([]);
        }

        // Fetch Reminders
        if (profile.reminders?.length) {
          try {
            const qReminders = query(eventsRef, where(documentId(), 'in', profile.reminders.slice(0, 30)));
            const snapReminders = await getDocs(qReminders);
            setReminderEvents(snapReminders.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
          } catch (remErr) {
            console.warn("Could not query reminder events:", remErr);
          }
        } else {
          setReminderEvents([]);
        }
      } catch (error) {
        console.error("Profile data load error:", error);
      }
    };
    fetchUserData();
  }, [profile?.bookmarks, profile?.rsvps, profile?.reminders]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        onboarded: true
      });
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = async (interest: string) => {
    if (!user || !profile) return;
    const lowerInterest = interest.toLowerCase();
    const updatedInterests = profile.interests.includes(lowerInterest)
      ? profile.interests.filter(i => i !== lowerInterest)
      : [...profile.interests, lowerInterest];

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        interests: updatedInterests
      });
    } catch (error) {
      toast.error("Failed to update interests");
    }
  };

  const becomeClubOwner = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: 'club_owner'
      });
      toast.success("You are now a Club Owner! Access the Club Portal in the menu.");
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Col: Info */}
        <div className="space-y-6">
          <Card className="border-zinc-900 bg-zinc-900 border overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-indigo-600 to-indigo-900" />
            <CardContent className="relative pt-0 px-6 pb-6 text-center">
              <div className="mx-auto -mt-12 mb-4 h-24 w-24 rounded-xl border-4 border-zinc-950 bg-zinc-800 overflow-hidden shadow-xl">
                <img src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt={profile?.displayName} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{profile?.displayName}</h3>
              <p className="text-xs text-zinc-500">{profile?.email}</p>
              
              <div className="mt-4 flex flex-col items-center gap-2">
                <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/5 border capitalize text-[10px] font-bold">
                  {profile?.role}
                </Badge>

                {/* Visual Indicator for 'Remind Me' Notifications */}
                {profile?.reminders && profile.reminders.length > 0 ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold shadow-md shadow-amber-500/10">
                    <Bell className="h-3.5 w-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                    <span>{profile.reminders.length} Active {profile.reminders.length === 1 ? 'Reminder' : 'Reminders'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/40 border border-zinc-800/60 text-zinc-500 text-xs">
                    <Bell className="h-3.5 w-3.5 text-zinc-600" />
                    <span>No active reminders</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {profile?.role === 'student' && (
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base">Organize Events?</CardTitle>
                <CardDescription className="text-xs">
                  Request to become a club owner to manage events and your organization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full text-xs" onClick={becomeClubOwner}>
                  Become Club Owner
                </Button>
              </CardContent>
            </Card>
          )}

          <Button variant="ghost" onClick={() => auth.signOut()} className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/5">
            Log Out Account
          </Button>
        </div>

        {/* Right Col: Preferences */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-indigo-500/30 bg-indigo-500/5 border p-4 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Developer Mode</p>
              <p className="text-xs text-zinc-400">Quickly set up your environment and test features.</p>
            </div>
            <div className="flex gap-2">
              {profile?.role !== 'admin' ? (
                <Button 
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 font-bold px-4"
                  onClick={async () => {
                    if (!user) return;
                    try {
                      const { promoteToAdmin } = await import('../lib/seedEvents');
                      toast.promise(promoteToAdmin(user.uid), {
                        loading: 'Granting admin powers...',
                        success: 'You are now an Admin! Please refresh.',
                        error: 'Failed to promote.'
                      });
                    } catch (e) {
                      toast.error("Promotion failed.");
                    }
                  }}
                >
                  Become Admin
                </Button>
              ) : (
                <Badge className="bg-indigo-600 text-white border-none px-4 py-1.5 h-auto font-black italic">
                  ADMIN STATUS ACTIVE
                </Badge>
              )}
              <Button 
                size="sm"
                variant="outline"
                className="border-zinc-700 font-bold hover:border-indigo-500"
                onClick={async () => {
                  try {
                    toast.loading("Seeding 50+ campus events...");
                    const { seedEvents } = await import('../lib/seedEvents');
                    const results = await seedEvents();
                    toast.success(`Seeded ${results.length} events (8/day)! Check Friday for sports.`);
                  } catch (e) {
                    toast.error("Seeding failed.");
                  }
                }}
              >
                Seed Data
              </Button>
            </div>
          </Card>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
            <Card className="border-zinc-800 bg-zinc-900 border transition-all">
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Display Name</label>
                  <div className="flex gap-2">
                    <Input 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!isEditing}
                      className="bg-zinc-800 border-zinc-700 h-10 transition-all focus:ring-1 focus:ring-indigo-500" 
                    />
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="h-10 px-6 border-zinc-700">Edit</Button>
                    ) : (
                      <Button onClick={handleUpdateProfile} disabled={loading} className="h-10 px-6 font-bold shadow-lg shadow-indigo-600/20">
                        {loading ? '...' : 'Save Changes'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
              <button 
                onClick={() => setActiveTab('interests')}
                className={`flex-1 min-w-[80px] flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'interests' ? 'bg-indigo-600 text-white shadow-xl translate-z-10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Interests
              </button>
              <button 
                onClick={() => setActiveTab('bookmarks')}
                className={`flex-1 min-w-[105px] flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'bookmarks' ? 'bg-indigo-600 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Bookmark className="mr-1.5 h-3.5 w-3.5" /> Bookmarks ({profile?.bookmarks?.length || 0})
              </button>
              <button 
                onClick={() => setActiveTab('rsvps')}
                className={`flex-1 min-w-[105px] flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'rsvps' ? 'bg-indigo-600 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Calendar className="mr-1.5 h-3.5 w-3.5" /> Attending ({profile?.rsvps?.length || 0})
              </button>
              <button 
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 min-w-[90px] flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <QrCode className="mr-1.5 h-3.5 w-3.5" /> Tickets
              </button>
              <button 
                onClick={() => setActiveTab('reminders')}
                className={`flex-1 min-w-[110px] flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'reminders' 
                    ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/20' 
                    : 'text-zinc-500 hover:text-amber-400'
                }`}
              >
                <Bell className={`mr-1.5 h-3.5 w-3.5 ${activeTab === 'reminders' ? 'fill-black text-black' : 'text-amber-400'}`} /> 
                Reminders ({profile?.reminders?.length || 0})
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'interests' && (
                <motion.div
                  key="interests"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => {
                      const isActive = profile?.interests.includes(cat.toLowerCase());
                      return (
                        <Button
                          key={cat}
                          variant={isActive ? 'default' : 'outline'}
                          className={`rounded-lg px-6 transition-all h-10 ${isActive ? 'shadow-lg shadow-indigo-600/20 scale-105 font-bold border-indigo-500' : 'border-zinc-900 bg-zinc-950 text-zinc-500 text-sm hover:border-zinc-700 hover:text-zinc-300'}`}
                          onClick={() => toggleInterest(cat)}
                        >
                          {isActive && <Check className="mr-2 h-4 w-4" />}
                          {cat}
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-zinc-500 italic">
                    These interests help us curate your dashboard and personalized recommendations.
                  </p>
                </motion.div>
              )}

              {activeTab === 'bookmarks' && (
                <motion.div
                  key="bookmarks"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {bookmarkedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {bookmarkedEvents.map((event, i) => (
                        <EventCard key={event.id} event={event} index={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                      <Bookmark className="mx-auto h-12 w-12 text-zinc-700 mb-4" />
                      <p className="text-zinc-500 font-medium">No bookmarked events yet.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'rsvps' && (
                <motion.div
                  key="rsvps"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {rsvpEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {rsvpEvents.map((event, i) => (
                        <EventCard key={event.id} event={event} index={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                      <Calendar className="mx-auto h-12 w-12 text-zinc-700 mb-4" />
                      <p className="text-zinc-500 font-medium">You haven't registered for any events yet.</p>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === 'tickets' && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {rsvpEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {rsvpEvents.map((event) => (
                        <Ticket key={event.id} event={event} ticketId={`${profile?.uid}-${event.id}`} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                      <QrCode className="mx-auto h-12 w-12 text-zinc-700 mb-4" />
                      <p className="text-zinc-500 font-medium">No tickets available. Register for an event first!</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reminders' && (
                <motion.div
                  key="reminders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Bell className="h-5 w-5 text-amber-400 fill-amber-400/20" />
                        Active Event Reminders
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        You'll be alerted before these campus events begin.
                      </p>
                    </div>
                    {profile?.reminders && profile.reminders.length > 0 && (
                      <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {profile.reminders.length} Scheduled
                      </Badge>
                    )}
                  </div>

                  {reminderEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {reminderEvents.map((event, i) => (
                        <div key={event.id} className="relative group flex flex-col">
                          <EventCard event={event} index={i} />
                          <div className="mt-2 flex items-center justify-between px-2 pt-1 border-t border-zinc-800/80">
                            <span className="flex items-center text-[11px] font-semibold text-amber-400">
                              <Bell className="mr-1 h-3 w-3 fill-amber-400 animate-pulse" />
                              Notification reminder set
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await toggleReminder(event.id);
                                toast.info(`Removed reminder for ${event.title}`);
                              }}
                              className="h-7 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 px-2 rounded-lg"
                            >
                              Remove Reminder
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
                      <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
                        <Bell className="h-6 w-6 text-amber-400" />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-200 mb-1">No Event Reminders Active</h4>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-5">
                        Click the "Remind Me" bell icon on any event details page to schedule a reminder notification and see it tracked here.
                      </p>
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-500 font-bold"
                        onClick={() => window.location.href = '/explore'}
                      >
                        Explore Events
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  );
}
