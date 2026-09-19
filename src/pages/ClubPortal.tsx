import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, doc, setDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { 
  Plus, LayoutDashboard, Calendar, Users, BarChart3, Clock, MapPin, Sparkles, Image as ImageIcon, CheckCircle2 
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { categorizeEvent } from '../lib/geminiService';
import { getTopicImageUrl, TOPIC_PRESETS } from '../lib/eventImages';

const FORM_CATEGORIES = ['Tech', 'Music', 'Sports', 'Art', 'Workshop', 'Conference', 'Social', 'Career'];

export default function ClubPortal() {
  const { profile, user } = useAuth();
  const [view, setView] = useState<'dashboard' | 'create'>('dashboard');
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [location, setLocation] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFormCategories, setSelectedFormCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'events'), where('organizerId', '==', user.uid));
        const snap = await getDocs(q);
        setMyEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Fetch my events error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, [user, view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const selectedDate = new Date(date);
    if (!date) {
      setDateError('Please select a date and time.');
      toast.error('Please select a valid date and time.');
      return;
    }
    if (isNaN(selectedDate.getTime())) {
      setDateError('Invalid date or time format.');
      toast.error('The selected date and time format is invalid.');
      return;
    }
    if (selectedDate <= new Date()) {
      setDateError('Event date and time must be in the future.');
      toast.error('The event must be scheduled for a future date and time.');
      return;
    }
    setDateError('');

    if (selectedFormCategories.length === 0) {
      toast.error('Please select at least one category from the list.');
      return;
    }

    setIsSubmitting(true);

    try {
      // AI categorization for summary only (we use user selected categories for category mapping)
      const aiData = await categorizeEvent(title, description);

      // Automatically resolve best high-resolution topic image matching the title/category if not explicitly provided
      const finalImageUrl = getTopicImageUrl(title, selectedFormCategories[0] || 'Workshop', imageUrl);

      const eventData = {
        title,
        description,
        date: Timestamp.fromDate(new Date(date)),
        location,
        registrationUrl,
        imageUrl: finalImageUrl,
        organizerId: user.uid,
        organizerName: profile.displayName,
        status: 'pending', // Requires admin approval
        categories: selectedFormCategories,
        shortSummary: aiData.summary || description.slice(0, 100),
        attendeeCount: 0,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'events'), eventData);
      toast.success("Event submitted for approval!");
      setView('dashboard');
      // Reset form
      setTitle(''); 
      setDescription(''); 
      setDate(''); 
      setLocation(''); 
      setRegistrationUrl(''); 
      setImageUrl('');
      setSelectedFormCategories([]);
    } catch (error) {
      toast.error("Failed to submit event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Portal Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Club Portal</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your events and organization presence.</p>
        </div>
        <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-900">
          <Button 
            variant={view === 'dashboard' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setView('dashboard')}
            className="rounded-md font-bold text-xs"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button 
            variant={view === 'create' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setView('create')}
            className="rounded-md font-bold text-xs"
          >
            <Plus className="mr-2 h-4 w-4" /> New Event
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card className="bg-zinc-900 border-zinc-900 shadow-xl">
                <CardContent className="pt-6">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total Events</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-black text-white">{myEvents.length}</span>
                    <Calendar className="h-6 w-6 text-indigo-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-900 shadow-xl">
                <CardContent className="pt-6">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Active RSVP</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-black text-white">
                      {myEvents.reduce((acc, curr) => acc + (curr.attendeeCount || 0), 0)}
                    </span>
                    <BarChart3 className="h-6 w-6 text-green-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-900 shadow-xl">
                <CardContent className="pt-6">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Org Reach</p>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-black text-white">2.4k</span>
                    <Users className="h-6 w-6 text-blue-500 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event List */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">My Event Submissions</h2>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-zinc-500">Loading your events...</div>
                ) : myEvents.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
                    <Calendar className="h-12 w-12 mb-4 opacity-20" />
                    <p>You haven't created any events yet.</p>
                    <Button variant="link" onClick={() => setView('create')} className="mt-2">Create your first event</Button>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800">
                    {myEvents.map(event => (
                      <div key={event.id} className="flex items-center gap-4 p-4 hover:bg-zinc-900 transition-colors">
                        <img 
                          src={getTopicImageUrl(event.title, event.categories?.[0], event.imageUrl)} 
                          className="h-16 w-16 rounded-xl object-cover" 
                          alt={event.title} 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white truncate">{event.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500 font-medium whitespace-nowrap">
                            <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {format(event.date?.toDate ? event.date.toDate() : new Date(event.date), 'PP')}</span>
                            <span className="flex items-center"><MapPin className="mr-1 h-3 w-3" /> {event.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 pr-2">
                          <Badge 
                            variant={event.status === 'approved' ? 'default' : event.status === 'rejected' ? 'destructive' : 'secondary'}
                            className="text-[10px] uppercase font-bold"
                          >
                            {event.status}
                          </Badge>
                          <span className="text-xs text-zinc-500">{event.attendeeCount || 0} registered</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="create"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-black">Create New Event</CardTitle>
                <CardDescription>Fill in the details. Our AI will automatically tag and summarize your event.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-400">Event Title</label>
                    <Input 
                      placeholder="e.g. Annual Tech Symposium" 
                      className="bg-zinc-800 border-zinc-700 h-12" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400">Date & Time</label>
                      <Input 
                        type="datetime-local" 
                        className={`bg-zinc-800 h-12 transition-all ${dateError ? 'border-red-500 focus-visible:ring-red-500 bg-red-950/10' : 'border-zinc-700'}`} 
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setDateError('');
                        }}
                        required
                      />
                      {dateError && (
                        <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1">
                          ● {dateError}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400">Location / Venue</label>
                      <Input 
                        placeholder="e.g. Main Auditorium" 
                        className="bg-zinc-800 border-zinc-700 h-12" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-400">Description</label>
                    <Textarea 
                      placeholder="Describe what's happening..." 
                      className="bg-zinc-800 border-zinc-700 min-h-[150px]" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-400">Registration URL (Optional)</label>
                      <Input 
                        placeholder="Link to external form or tickets" 
                        className="bg-zinc-800 border-zinc-700 h-12" 
                        value={registrationUrl}
                        onChange={(e) => setRegistrationUrl(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-zinc-400">Poster Image (Auto-Topic Matched)</label>
                        <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" /> Topic-Aware Photography
                        </span>
                      </div>
                      <Input 
                        placeholder="Paste custom image URL or leave blank for auto topic match" 
                        className="bg-zinc-800 border-zinc-700 h-12" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Topic Image Live Preview & Quick Presets */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs font-bold text-zinc-300">Image Assigned to Your Event:</span>
                      </div>
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="text-[10px] text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
                        >
                          Reset to auto-match
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900 shadow-md">
                        <img 
                          src={getTopicImageUrl(title, selectedFormCategories[0] || 'Workshop', imageUrl)} 
                          alt="Event topic preview"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5 pointer-events-none">
                          <span className="text-[9px] font-bold text-white tracking-wider uppercase truncate">
                            {title || selectedFormCategories[0] || 'Auto Match'}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {imageUrl ? (
                            <span className="text-emerald-400 font-medium">Using your custom image URL.</span>
                          ) : (
                            <span>
                              Automatically dynamically resolved to a high-resolution photo matching <strong className="text-white">"{title || 'your topic'}"</strong> under the <strong className="text-white">"{selectedFormCategories[0] || 'selected'}"</strong> category.
                            </span>
                          )}
                        </p>

                        {/* Quick Presets for Common Campus Events */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[10px] text-zinc-500 mr-1 self-center">Presets:</span>
                          {TOPIC_PRESETS.slice(0, 5).map(preset => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setImageUrl(preset.imageUrl)}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
                                imageUrl === preset.imageUrl 
                                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                                  : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-400">Select Event Categories</label>
                    <p className="text-xs text-zinc-500">Pick one or more categories from the official list below to help students find your event easily in search and recommendations:</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {FORM_CATEGORIES.map((cat) => {
                        const isSelected = selectedFormCategories.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => {
                              setSelectedFormCategories(prev => 
                                prev.includes(cat) 
                                  ? prev.filter(c => c !== cat) 
                                  : [...prev, cat]
                              );
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10 scale-105' 
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                            }`}
                          >
                            {isSelected ? '✓ ' : ''}{cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl bg-primary/5 p-4 border border-primary/20 flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-primary">AI Optimization Enabled</p>
                      <p className="text-xs text-zinc-400">Gemini will process your inputs to generate scannable tags and summaries for better discovery.</p>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 border-t border-zinc-800 mt-6 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setView('dashboard')}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="h-12 px-8 rounded-xl font-bold">
                    {isSubmitting ? 'Processing...' : 'Submit for Approval'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
