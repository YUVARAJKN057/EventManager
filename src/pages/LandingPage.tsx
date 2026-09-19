import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import Featured3DStage from '../components/3d/Featured3DStage';
import { 
  ArrowRight, 
  Calendar, 
  Users, 
  Zap, 
  Sparkles, 
  Compass, 
  LayoutDashboard, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  Bell,
  Layers,
  Code,
  Music,
  Trophy,
  Palette,
  BookOpen,
  HeartHandshake
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'tech',
    name: 'Tech & AI',
    tagline: 'Hackathons, Robotics & AI Labs',
    colorCss: '#06b6d4',
    bgGradient: 'from-cyan-500/10 via-indigo-500/5 to-transparent',
    borderCss: 'border-cyan-500/20 hover:border-cyan-500/50',
    icon: Code,
    iconColor: 'text-cyan-400 bg-cyan-500/10',
    eventsCount: '18 Events',
    description: 'Autonomous agents hackathons, cloud computing masterclasses, and open-source sprints.'
  },
  {
    id: 'music',
    name: 'Music & Cultural',
    tagline: 'Concerts, DJ Sets & Band Battles',
    colorCss: '#ec4899',
    bgGradient: 'from-pink-500/10 via-purple-500/5 to-transparent',
    borderCss: 'border-pink-500/20 hover:border-pink-500/50',
    icon: Music,
    iconColor: 'text-pink-400 bg-pink-500/10',
    eventsCount: '12 Events',
    description: 'Outdoor sunset concerts, acoustic jam sessions, and electronic dance festival stages.'
  },
  {
    id: 'sports',
    name: 'Sports & Athletics',
    tagline: 'Varsity Leagues & Tournaments',
    colorCss: '#f97316',
    bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
    borderCss: 'border-orange-500/20 hover:border-orange-500/50',
    icon: Trophy,
    iconColor: 'text-orange-400 bg-orange-500/10',
    eventsCount: '15 Events',
    description: 'Inter-department leagues, marathon races, basketball tournaments, and esports qualifiers.'
  },
  {
    id: 'art',
    name: 'Art & Design',
    tagline: 'Galleries, Photo Walks & Media',
    colorCss: '#8b5cf6',
    bgGradient: 'from-violet-500/10 via-indigo-500/5 to-transparent',
    borderCss: 'border-violet-500/20 hover:border-violet-500/50',
    icon: Palette,
    iconColor: 'text-violet-400 bg-violet-500/10',
    eventsCount: '9 Events',
    description: 'Kinetic light installations, indie film showcases, drama galas, and design critique workshops.'
  },
  {
    id: 'workshop',
    name: 'Workshops & Labs',
    tagline: 'Bootcamps, Founder Talks & Certs',
    colorCss: '#10b981',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    borderCss: 'border-emerald-500/20 hover:border-emerald-500/50',
    icon: BookOpen,
    iconColor: 'text-emerald-400 bg-emerald-500/10',
    eventsCount: '14 Events',
    description: 'Practical deployment bootcamps, startup pitch clinics, and career mentorship circles.'
  },
  {
    id: 'social',
    name: 'Campus Community',
    tagline: 'Mixers, Club Fairs & Socials',
    colorCss: '#f59e0b',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    borderCss: 'border-amber-500/20 hover:border-amber-500/50',
    icon: HeartHandshake,
    iconColor: 'text-amber-400 bg-amber-500/10',
    eventsCount: '21 Events',
    description: 'Freshers orientation mixers, recruitment carnivals, volunteer drives, and student meetups.'
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-72 right-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Hero Header Section */}
      <section className="relative px-4 pt-16 pb-12 sm:px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Announcement Badge */}
            <div className="mx-auto inline-flex items-center space-x-2 rounded-full border border-indigo-500/25 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-300 backdrop-blur-xl">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Reva University Campus Event Hub</span>
            </div>

            <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              Experience Campus Life <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              Discover hackathons, live concerts, athletics, and skill workshops across all faculties. RSVP in one click, sync your personal calendar, and stay connected with campus clubs.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="h-12 px-7 rounded-2xl text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95">
                      <LayoutDashboard className="mr-2 h-4.5 w-4.5" />
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/explore">
                    <Button size="lg" variant="outline" className="h-12 px-7 rounded-2xl text-base font-medium border-zinc-800 bg-zinc-900/80 backdrop-blur-xl hover:bg-zinc-800 hover:text-white">
                      <Compass className="mr-2 h-4.5 w-4.5 text-cyan-400" />
                      Browse Calendar
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="h-12 px-7 rounded-2xl text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95">
                      Get Started / Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/explore">
                    <Button size="lg" variant="outline" className="h-12 px-7 rounded-2xl text-base font-medium border-zinc-800 bg-zinc-900/80 backdrop-blur-xl hover:bg-zinc-800 hover:text-white">
                      <Compass className="mr-2 h-4.5 w-4.5 text-cyan-400" />
                      Explore Events
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Quick meta stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Live Event Visualizer
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                Real-time RSVPs
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-pink-400" />
                Verified Student Organizations
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured 3D Interactive Stage Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <Featured3DStage onSelectCategory={(cat) => navigate(`/explore?category=${cat}`)} />
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Explore By Interest</span>
              </div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">
                Find What Moves You
              </h2>
            </div>
            <Link to="/explore" className="mt-4 md:mt-0">
              <Button variant="ghost" className="text-sm font-bold text-zinc-400 hover:text-white group">
                Browse All Campus Activities
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Card 
                  key={cat.id}
                  onClick={() => navigate(`/explore?category=${cat.name}`)}
                  className={`group relative border ${cat.borderCss} bg-gradient-to-br ${cat.bgGradient} bg-zinc-900/60 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer backdrop-blur-md`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-2xl ${cat.iconColor} font-black text-sm`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="border-zinc-700 bg-zinc-900/80 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                      {cat.eventsCount}
                    </Badge>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {cat.name}
                    </h3>
                    <div className="text-xs font-medium text-zinc-400 mt-0.5">
                      {cat.tagline}
                    </div>
                    <p className="mt-3 text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-zinc-300 group-hover:text-white">
                    <span>Explore {cat.name}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-cyan-400" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8 border-t border-zinc-900 bg-zinc-900/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-white">Built Specifically for Students</h2>
            <p className="mt-3 text-sm text-zinc-400">Everything needed to organize, discover, and participate in campus life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant RSVP & Reminders</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Save events with a single click, download passes, and receive automated reminders so you never miss a session.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80">
              <div className="h-12 w-12 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Club & Faculty Portal</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Student coordinators and faculty heads can publish events, manage attendee rosters, and broadcast announcements effortlessly.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80">
              <div className="h-12 w-12 rounded-2xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-5">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Notification Feeds</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Receive instant alerts about venue changes, rescheduled sessions, waitlist clearances, and newly announced fests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Stats Counter */}
      <section className="px-4 py-16 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: 'Event Categories', value: '6 Fields', color: 'text-cyan-400' },
              { label: 'Clubs & Societies', value: '150+', color: 'text-indigo-400' },
              { label: 'Student Community', value: '12K+', color: 'text-pink-400' },
              { label: 'Events Hosted', value: '40+ Weekly', color: 'text-amber-400' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-zinc-900/30 border border-zinc-900">
                <div className={`text-3xl sm:text-4xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-zinc-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-to-br from-indigo-900/30 via-zinc-900/60 to-cyan-950/30 border border-indigo-500/20 p-8 sm:p-14 text-center backdrop-blur-xl shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Ready to Connect?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-300">
            Join your campus peers and start exploring upcoming hackathons, fests, and workshops today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="rounded-2xl px-10 h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/25">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="rounded-2xl px-10 h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/25">
                  Sign In / Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link to="/explore">
              <Button size="lg" variant="outline" className="rounded-2xl px-10 h-12 text-base font-medium border-zinc-800 bg-zinc-900/80 text-zinc-200 hover:text-white">
                Explore Event Calendar
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
