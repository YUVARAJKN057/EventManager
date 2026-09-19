import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import EventCard, { Event } from '../components/events/EventCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(categoryParam);

  useEffect(() => {
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsRef = collection(db, 'events');
        // Fetch up to 200 approved events to cover all categories completely
        let q = query(eventsRef, where('status', '==', 'approved'), limit(200));
        
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        
        // Sort events chronologically so upcoming events are listed first
        const sortedData = data.sort((a, b) => {
          const timeA = a.date?.toDate ? a.date.toDate().getTime() : 0;
          const timeB = b.date?.toDate ? b.date.toDate().getTime() : 0;
          return timeA - timeB;
        });
        
        setEvents(sortedData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = ['All', 'Tech', 'Music', 'Sports', 'Art', 'Workshop', 'Conference', 'Social', 'Career'];

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || e.categories?.some(c => c.toLowerCase() === category.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white">Explore Events</h1>
        <p className="mt-2 text-zinc-400">Discover workshops, parties, and seminars happening around you.</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525b]" />
          <Input 
            placeholder="Search Reva University Events..." 
            className="h-11 pl-11 border-none bg-zinc-900 text-xs rounded-full focus:ring-1 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-xs font-bold text-zinc-400 transition-all hover:bg-zinc-900 hover:text-white hover:border-indigo-500/30 cursor-pointer">
              Category: <span className="text-white ml-1">{category}</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-950 border-zinc-900 text-white">
              {categories.map(cat => (
                <DropdownMenuItem 
                  key={cat} 
                  onClick={() => {
                    setCategory(cat);
                    setSearchParams({ category: cat });
                  }} 
                  className="cursor-pointer text-xs"
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-11 w-11 border-zinc-900 bg-zinc-950 rounded-xl p-0">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
          </Button>
        </div>
      </div>

      {/* Category Pills/Chips for quick selection */}
      <div className="mb-10 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        {categories.map((cat) => {
          const isSelected = category.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setSearchParams({ category: cat });
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 scale-105'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[16/9] w-full rounded-xl bg-zinc-900" />
              <Skeleton className="h-4 w-3/4 bg-zinc-900" />
              <Skeleton className="h-4 w-1/2 bg-zinc-900" />
            </div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-zinc-900 p-6 text-zinc-500">
            <Search className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-bold text-white">No events found</h3>
          <p className="text-zinc-500">Try adjusting your filters or search terms.</p>
          <Button variant="link" onClick={() => { setSearchTerm(''); setCategory('All'); setSearchParams({ category: 'All' }); }} className="mt-2 text-primary">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
