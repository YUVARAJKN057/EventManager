import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Check, X, ShieldAlert, Trash2, Calendar, User, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getTopicImageUrl } from '../lib/eventImages';

export default function AdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'events'), where('status', '==', 'pending'));
        const snap = await getDocs(q);
        setPendingEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Admin fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'events', id), { status });
      setPendingEvents(prev => prev.filter(e => e.id !== id));
      toast.success(`Event ${status} successfully!`);
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This is irreversible.")) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      setPendingEvents(prev => prev.filter(e => e.id !== id));
      toast.success("Event deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-red-500 flex items-center">
          <ShieldAlert className="mr-3 h-8 w-8" />
          Admin Control Center
        </h1>
        <p className="text-zinc-500 mt-1">Review event submissions and manage platform content.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
        {/* Left: Pending List */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center justify-between">
            Pending Approval
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">{pendingEvents.length}</Badge>
          </h2>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center p-12 text-zinc-500 italic">Accessing database...</div>
            ) : pendingEvents.length === 0 ? (
              <Card className="bg-zinc-900/50 border-zinc-800 border-dashed">
                <CardContent className="p-12 text-center text-zinc-500">
                  All caught up! No pending submissions.
                </CardContent>
              </Card>
            ) : (
              pendingEvents.map(event => (
                <Card key={event.id} className="bg-zinc-900 border-zinc-800 overflow-hidden transition-all hover:border-zinc-700">
                  <div className="flex flex-col sm:flex-row">
                    <img 
                      src={getTopicImageUrl(event.title, event.categories?.[0], event.imageUrl)} 
                      className="h-32 w-full sm:w-48 object-cover" 
                      alt={event.title} 
                      referrerPolicy="no-referrer"
                    />
                    <CardContent className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">{event.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                            <span className="flex items-center"><Calendar className="mr-1 h-3.5 w-3.5" /> {format(event.date?.toDate ? event.date.toDate() : new Date(event.date), 'PP')}</span>
                            <span className="flex items-center"><User className="mr-1 h-3.5 w-3.5" /> {event.organizerName}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white"
                            onClick={() => handleStatus(event.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white"
                           onClick={() => handleStatus(event.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2">{event.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {event.categories?.map((cat: string) => (
                          <Badge key={cat} variant="outline" className="text-[10px] px-2 py-0">{cat}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Admin Stats */}
        <div className="space-y-6">
          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-red-400 uppercase tracking-widest">Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">Uptime</span>
                    <span className="text-green-500">99.9%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[99.9%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">API Latency</span>
                    <span className="text-zinc-300">42ms</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[30%]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Database Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full border-zinc-800 hover:border-indigo-500 hover:text-indigo-400 mb-2.5"
                onClick={async () => {
                  try {
                    toast.loading("Seeding 50+ events with topic photography...");
                    const { seedEvents } = await import('../lib/seedEvents');
                    const results = await seedEvents();
                    toast.success(`Successfully seeded ${results.length} events!`);
                  } catch (e) {
                    toast.error("Seeding failed. Check console.");
                    console.error(e);
                  }
                }}
              >
                Bulk Seed 7-Day Events
              </Button>
              <Button 
                variant="secondary" 
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2"
                onClick={async () => {
                  try {
                    toast.loading("Upgrading event images to high-res topic photography...");
                    const { updateExistingEventsWithTopicImages } = await import('../lib/seedEvents');
                    const count = await updateExistingEventsWithTopicImages();
                    toast.success(`Updated ${count} events with topic-matched photography!`);
                  } catch (e) {
                    toast.error("Image update failed. Check console.");
                    console.error(e);
                  }
                }}
              >
                <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
                Sync Topic Images
              </Button>
              <p className="text-[10px] text-zinc-600 mt-2 text-center">Auto-maps all events to high-res imagery matching their titles & topics.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
