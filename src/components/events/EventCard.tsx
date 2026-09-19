import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { toast } from 'sonner';
import Event3DVisual from '../3d/Event3DVisual';

export interface Event {
  id: string;
  title: string;
  description: string;
  shortSummary?: string;
  date: any; // Firestore Timestamp
  location: string;
  venue?: string;
  organizerName: string;
  categories: string[];
  imageUrl: string;
  isFree?: boolean;
  price?: number;
  attendeeCount?: number;
  registrationUrl?: string;
}

export default function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const { user, profile } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.bookmarks) {
      setIsBookmarked(profile.bookmarks.includes(event.id));
    }
  }, [profile, event.id]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to save events");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      if (isBookmarked) {
        await updateDoc(userRef, {
          bookmarks: arrayRemove(event.id)
        });
        setIsBookmarked(false);
        toast.success("Removed from bookmarks");
      } else {
        await updateDoc(userRef, {
          bookmarks: arrayUnion(event.id)
        });
        setIsBookmarked(true);
        toast.success("Saved to bookmarks!");
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
  const isToday = format(eventDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <Card className="group overflow-hidden border-zinc-900 bg-zinc-900/50 transition-all hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
          {isToday && (
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <Badge className="bg-red-600/90 text-white border-none text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 animate-pulse flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-white" /> Live Now
              </Badge>
            </div>
          )}

          <Event3DVisual
            category={event.categories?.[0] || 'Tech'}
            title={event.title}
            imageUrl={event.imageUrl}
            interactive={true}
            showControls={true}
            defaultView="photo"
            controlsPosition="bottom-right"
            className="h-full w-full"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
          
          <Button
            variant="ghost"
            size="icon"
            disabled={loading}
            className={`absolute top-3 right-3 rounded-xl backdrop-blur-xl transition-all z-20 ${isBookmarked ? 'bg-indigo-600 text-white' : 'bg-black/40 text-white/70 hover:bg-indigo-600 hover:text-white'}`}
            onClick={toggleBookmark}
          >
            <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>

          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 z-20">
            {event.categories?.slice(0, 2).map((cat) => (
              <Link 
                key={cat} 
                to={`/explore?category=${encodeURIComponent(cat)}`}
                onClick={(e) => e.stopPropagation()}
                className="transition-transform hover:scale-105 active:scale-95"
              >
                <Badge variant="secondary" className="bg-white/10 text-[9px] font-black uppercase tracking-widest border border-white/5 px-2.5 py-1 text-white backdrop-blur-md cursor-pointer hover:bg-indigo-600 hover:text-white hover:border-indigo-500 hover:shadow-lg transition-all duration-200">
                  {cat}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        <Link to={`/event/${event.id}`}>
          <CardContent className="p-5">
            <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
              <Calendar className="mr-1.5 h-3 w-3" />
              {format(eventDate, 'MMM d, yyyy')}
            </div>
            <h3 className="line-clamp-1 text-lg font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">
              {event.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-xs text-zinc-500 leading-relaxed">
              {event.description}
            </p>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-zinc-900/50 bg-zinc-900/20 p-5 backdrop-blur-sm">
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center text-[10px] font-semibold text-zinc-500">
                <MapPin className="mr-1.5 h-3 w-3 text-indigo-500" />
                {event.location}
              </div>
              <div className="flex items-center text-[10px] font-semibold text-zinc-500">
                <Users className="mr-1.5 h-3 w-3 text-indigo-500" />
                {event.organizerName}
              </div>
            </div>
            <div className="text-right">
              {event.isFree ? (
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 uppercase">FREE</span>
              ) : (
                <span className="text-xs font-black text-white">₹{event.price}</span>
              )}
            </div>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  );
}
