import { useState } from 'react';
import { motion } from 'motion/react';
import Event3DVisual from './Event3DVisual';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sparkles, Calendar, MapPin, ArrowRight, Layers, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Featured3DStageProps {
  categories?: string[];
  onSelectCategory?: (category: string) => void;
}

const CATEGORY_SHOWCASE = [
  {
    name: 'Tech',
    title: 'Autonomous Systems & AI Hackathon',
    description: 'Build cutting-edge generative AI models and robotic agents alongside industry engineers.',
    location: 'Silicon Quad Tech Center',
    date: 'This Weekend',
    attendees: '240 attending',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Music',
    title: 'Neon Nights Campus Music Fest',
    description: 'Immerse yourself in dynamic electronic live beats and acoustic acoustic ensembles under the stars.',
    location: 'Amphitheater Plaza',
    date: 'Friday, 8:00 PM',
    attendees: '410 attending',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Sports',
    title: 'Varsity Night Invitational',
    description: 'Cheer on our campus basketball and track athletes in the annual tournament clash.',
    location: 'Spartan Arena',
    date: 'Saturday, 6:00 PM',
    attendees: '320 attending',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Art',
    title: 'Digital Horizons Creative Gallery',
    description: 'Discover generative digital art, interactive kinetic installations, and virtual realities.',
    location: 'Design & Media Pavilion',
    date: 'Next Tuesday',
    attendees: '180 attending',
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1200'
  },
  {
    name: 'Workshop',
    title: 'Full-Stack Cloud Architecture Workshop',
    description: 'Hands-on live deployment lab covering containerization, microservices, and distributed state.',
    location: 'Engineering Lab 4',
    date: 'Thursday, 3:00 PM',
    attendees: '95 attending',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200'
  }
];

export default function Featured3DStage({ onSelectCategory }: Featured3DStageProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeItem = CATEGORY_SHOWCASE[activeIdx];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950 shadow-2xl p-6 lg:p-8">
      {/* Dynamic Background Glow matching active theme */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Interactive 3D Stage</h2>
              <Badge className="bg-indigo-600/30 text-indigo-300 border-indigo-500/30 text-[10px] font-mono uppercase">
                Real-time WebGL
              </Badge>
            </div>
            <p className="text-xs text-zinc-400">Explore events through generative 3D kinetic geometry instead of flat images</p>
          </div>
        </div>

        {/* Category switcher pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          {CATEGORY_SHOWCASE.map((item, idx) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                onSelectCategory?.(item.name);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Holographic Canvas Stage */}
        <div className="lg:col-span-7 aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-inner relative group">
          <Event3DVisual
            category={activeItem.name}
            title={activeItem.title}
            imageUrl={activeItem.imageUrl}
            interactive={true}
            showControls={true}
            defaultView="photo"
            controlsPosition="top-right"
            className="w-full h-full"
          />

          {/* Hologram Stage Pedestal Graphic Line */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent pointer-events-none" />
        </div>

        {/* Right: Event Information & Creative Details */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-950 border-indigo-700/50 text-indigo-300 font-semibold text-xs">
                {activeItem.name} Spotlight
              </Badge>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> {activeItem.attendees}
              </span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {activeItem.title}
            </h3>
            
            <p className="text-sm text-zinc-400 leading-relaxed">
              {activeItem.description}
            </p>
          </div>

          <div className="space-y-2.5 py-2 border-y border-zinc-800/60 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span>{activeItem.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <span>{activeItem.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to={`/explore?category=${encodeURIComponent(activeItem.name)}`} className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20 group">
                <span>Explore {activeItem.name} Events</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/explore">
              <Button variant="outline" className="h-11 px-4 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300">
                <Compass className="mr-2 h-4 w-4 text-zinc-400" /> All Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
