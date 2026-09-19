import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { Event } from '../components/events/EventCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { 
  Calendar, MapPin, Users, Share2, Heart, ArrowLeft, 
  Clock, CheckCircle2, ExternalLink, Info, Loader2,
  Coffee, Laptop, Award, Music, ShieldCheck, Map as MapIcon,
  Search, MessageSquare, Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import RegistrationModal, { RegistrationData } from '../components/events/RegistrationModal';
import Event3DVisual from '../components/3d/Event3DVisual';

export default function EventDetails() {
  const { id } = useParams();
  const { user, profile, toggleReminder } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isReminded = Boolean(id && profile?.reminders?.includes(id));

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
        } else {
          toast.error("Event not found");
          navigate('/explore');
        }
      } catch (error) {
        console.error("Fetch event error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  useEffect(() => {
    if (profile && id) {
      setIsRegistered(profile.rsvps?.includes(id) || false);
      setIsBookmarked(profile.bookmarks?.includes(id) || false);
    }
  }, [profile, id]);

  const handleRegister = async () => {
    if (!user || !id) {
      toast.error("Please log in to register");
      return;
    }

    if (isRegistered) {
      // Direct unregistration
      setActionLoading(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const eventRef = doc(db, 'events', id);
        await updateDoc(userRef, { rsvps: arrayRemove(id) });
        await updateDoc(eventRef, { attendeeCount: increment(-1) });
        setIsRegistered(false);
        toast.success("Successfully unregistered");
      } catch (error) {
        toast.error("Failed to unregister");
      } finally {
        setActionLoading(false);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const confirmRegistration = async (registrationData: RegistrationData) => {
    if (!user || !id || !event) return;

    setActionLoading(true);
    try {
      // Check if this email is already registered for this event
      if (user.email) {
        const registrationsRef = collection(db, 'events', id, 'registrations');
        const q = query(registrationsRef, where('userEmail', '==', user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          toast.error("Under this email, you have already registered for this event.");
          setIsModalOpen(false);
          setActionLoading(false);
          return;
        }
      }

      const userRef = doc(db, 'users', user.uid);
      const eventRef = doc(db, 'events', id);
      const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);

      // 1. Update user profile and event attendee count
      await updateDoc(userRef, { rsvps: arrayUnion(id) });
      await updateDoc(eventRef, { attendeeCount: increment(1) });
      
      // 2. Add App Notification
      try {
        await addDoc(collection(db, 'users', user.uid, 'notifications'), {
          title: 'Registration Confirmed!',
          message: `You're all set for ${event.title}. Don't forget your Student ID: ${registrationData.studentId}`,
          read: false,
          createdAt: serverTimestamp()
        });
      } catch (notifErr) {
        console.error("Failed to save notification:", notifErr);
      }

      // 3. Save Registration Details (optional, but good for completeness)
      await addDoc(collection(db, 'events', id, 'registrations'), {
        userId: user.uid,
        userName: user.displayName || profile?.displayName,
        userEmail: user.email,
        ...registrationData,
        registeredAt: serverTimestamp()
      });

      // 4. Send confirmation email via backend
      if (user.email) {
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: user.email,
              subject: `Registration Confirmed: ${event.title}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                  <h2 style="color: #6366f1;">You're going to ${event.title}!</h2>
                  <p>Hi ${user.displayName || profile?.displayName || 'Student'},</p>
                  <p>Your registration for <strong>${event.title}</strong> has been confirmed.</p>
                  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${format(eventDate, 'PPPP')}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${format(eventDate, 'p')}</p>
                    <p style="margin: 5px 0;"><strong>Location:</strong> ${event.location}</p>
                    <p style="margin: 5px 0;"><strong>Student ID:</strong> ${registrationData.studentId}</p>
                  </div>
                  <p>We'll see you there!</p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                  <p style="font-size: 12px; color: #888;">CampusHub - Your University Life, Aggregated.</p>
                </div>
              `
            })
          });
        } catch (emailErr) {
          console.error("Failed to trigger registration email:", emailErr);
        }
      }

      setIsRegistered(true);
      setIsModalOpen(false);
      toast.success("Registration confirmed! Details saved.");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to complete registration");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!user || !id) {
      toast.error("Please log in to bookmark");
      return;
    }

    setActionLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      if (isBookmarked) {
        await updateDoc(userRef, { bookmarks: arrayRemove(id) });
        setIsBookmarked(false);
        toast.success("Removed from bookmarks");
      } else {
        await updateDoc(userRef, { bookmarks: arrayUnion(id) });
        setIsBookmarked(true);
        toast.success("Saved to bookmarks!");
      }
    } catch (error) {
      toast.error("Failed to update bookmark");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleReminder = async () => {
    if (!user || !id) {
      toast.error("Please sign in to toggle reminders");
      navigate('/auth');
      return;
    }

    setActionLoading(true);
    try {
      const added = await toggleReminder(id);
      if (added) {
        toast.success(`Reminder scheduled for "${event?.title || 'this event'}"! Visual indicator added to your profile.`, {
          icon: '🔔'
        });
      } else {
        toast.info(`Reminder removed for "${event?.title || 'this event'}".`);
      }
    } catch (error) {
      console.error("Reminder error:", error);
      toast.error("Failed to update reminder");
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title || 'Event',
        text: `Check out this campus event: ${event?.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center bg-zinc-950">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
    </div>
  );

  if (!event) return null;

  const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Hero Section */}
      <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden bg-zinc-950">
        <Event3DVisual
          category={event.categories?.[0] || 'Tech'}
          title={event.title}
          imageUrl={event.imageUrl}
          interactive={true}
          showControls={true}
          defaultView="photo"
          controlsPosition="top-right"
          className="h-full w-full opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 pointer-events-none">
          <div className="mx-auto max-w-5xl pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  className="text-zinc-400 hover:text-white"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to explore
                </Button>
                
                {/* Simple Bell Icon to Toggle 'Remind Me' Notifications */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleReminder}
                  disabled={actionLoading}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition-all shadow-xl backdrop-blur-md ${
                    isReminded
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                      : 'bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white'
                  }`}
                  title={isReminded ? "Turn off reminder" : "Set event reminder notification"}
                >
                  <Bell className={`mr-2 h-4 w-4 ${isReminded ? 'fill-amber-400 text-amber-400 animate-pulse' : 'text-zinc-400'}`} />
                  <span>{isReminded ? 'Reminder Set' : 'Remind Me'}</span>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {event.categories.map(cat => (
                  <Badge 
                    key={cat} 
                    onClick={() => navigate(`/explore?category=${encodeURIComponent(cat)}`)}
                    className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest px-3 py-1 cursor-pointer hover:bg-primary/40 active:scale-95 transition-all duration-150"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-4xl font-black text-white sm:text-6xl">{event.title}</h1>
              
              <div className="mt-6 flex flex-wrap gap-6 text-zinc-300">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  {format(eventDate, 'PPPP')}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  {format(eventDate, 'p')}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  {event.location}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto mt-12 max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                About this event
              </h2>
              <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                {event.description}
              </div>
            </section>

            {/* Agenda section */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Event Agenda
              </h2>
              <div className="space-y-4">
                {[
                  { time: "09:00 AM", title: "Registrations & Welcome Drinks", desc: "Check-in and collect your badge at the entrance." },
                  { time: "10:30 AM", title: "Keynote Session", desc: "Opening remarks by student leaders and guest speakers." },
                  { time: "12:30 PM", title: "Networking Lunch", desc: "Complimentary lunch provided for all registered participants." },
                  { time: "02:00 PM", title: "Workshop / Main Event", desc: "The core activity of the event takes place." },
                  { time: "04:30 PM", title: "Closing Ceremony", desc: "Awards, certificates, and final photos." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full border-2 border-primary bg-zinc-950 z-10" />
                      {idx !== 4 && <div className="w-0.5 flex-1 bg-zinc-800" />}
                    </div>
                    <div className="pb-8">
                      <p className="text-sm font-bold text-indigo-400 mb-1">{item.time}</p>
                      <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                      <p className="text-sm text-zinc-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Features/What to expect */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">What to expect</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: Coffee, label: "Refreshments" },
                  { icon: Laptop, label: "Bring Laptop" },
                  { icon: Award, label: "Certificates" },
                  { icon: ShieldCheck, label: "Safe Space" },
                  { icon: Users, label: "Networking" },
                  { icon: MessageSquare, label: "Q&A Session" }
                ].map((feature, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/30 transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-indigo-400 mb-3" />
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{feature.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location Map Placeholder */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  Venue Location
                </h2>
                <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                  <MapIcon className="mr-2 h-4 w-4" /> Open in Maps
                </Button>
              </div>
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-zinc-800 group">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
                  alt="Map Placeholder"
                  className="h-full w-full object-cover opacity-50 grayscale transition-all group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-zinc-950/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl flex flex-col items-center">
                    <MapPin className="h-8 w-8 text-red-500 mb-2 animate-bounce" />
                    <p className="text-sm font-bold text-white">{event.location}</p>
                    <p className="text-xs text-zinc-500">{event.venue || 'Campus Main Hall'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-zinc-900/50 p-6 border border-zinc-800">
              <h3 className="text-lg font-bold text-white mb-4">Organizer Details</h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-zinc-100">{event.organizerName}</p>
                  <p className="text-sm text-zinc-500">Official Campus Organization</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto rounded-full border-zinc-700">Follow</Button>
              </div>
            </section>
          </div>

          {/* Sidebar / Registration */}
          <div className="space-y-6">
            <div className="sticky top-28 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm text-zinc-500 uppercase font-bold tracking-widest">Entry</span>
                <span className="text-2xl font-black text-white">
                  {event.isFree ? 'FREE' : `₹${event.price}`}
                </span>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className={`w-full h-14 rounded-xl text-lg font-black transition-all ${isRegistered ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20'}`}
                >
                  {actionLoading ? <Loader2 className="animate-spin" /> : (isRegistered ? 'Registered!' : 'Register Now')}
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    disabled={actionLoading}
                    onClick={toggleBookmark}
                    className={`h-12 rounded-xl border-zinc-800 bg-zinc-800/50 ${isBookmarked ? 'text-indigo-400 bg-indigo-500/5 border-indigo-500/30' : ''}`}
                    title={isBookmarked ? "Saved" : "Save"}
                  >
                    <Heart className={`mr-1.5 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} /> 
                    <span className="text-xs">{isBookmarked ? 'Saved' : 'Save'}</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    disabled={actionLoading}
                    onClick={handleToggleReminder}
                    className={`h-12 rounded-xl border-zinc-800 bg-zinc-800/50 transition-all ${
                      isReminded ? 'text-amber-400 bg-amber-500/10 border-amber-500/40' : 'text-zinc-300 hover:text-amber-400'
                    }`}
                    title={isReminded ? "Reminder is set" : "Remind me before event"}
                  >
                    <Bell className={`mr-1.5 h-4 w-4 ${isReminded ? 'fill-amber-400 text-amber-400 animate-pulse' : ''}`} /> 
                    <span className="text-xs">{isReminded ? 'Reminded' : 'Remind'}</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={handleShare}
                    className="h-12 rounded-xl border-zinc-800 bg-zinc-800/50"
                    title="Share event"
                  >
                    <Share2 className="mr-1.5 h-4 w-4" /> 
                    <span className="text-xs">Share</span>
                  </Button>
                </div>

                {isReminded && (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 text-xs text-amber-300 animate-fadeIn">
                    <Bell className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                    <span>Active reminder set! Visual indicator added to your profile.</span>
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-zinc-800 pt-6">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Verified Event
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                  <Users className="h-4 w-4 text-primary" />
                  {event.attendeeCount || 0} students attending
                </div>
              </div>

              {/* Attending section */}
              <div className="mt-8">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Top Attendees</h4>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden ring-2 ring-transparent hover:ring-indigo-500 transition-all cursor-pointer">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="Attendee" />
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                    +{Math.max(0, (event.attendeeCount || 0) - 5)}
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-500 italic">Join {event.attendeeCount || 0} others at this event!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmRegistration}
        eventTitle={event.title}
        loading={actionLoading}
      />
    </div>
  );
}
