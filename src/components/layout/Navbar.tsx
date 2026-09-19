import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, buttonVariants } from '../ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { auth, db } from '../../lib/firebase';
import { Calendar, Compass, Bell, LayoutDashboard, User, LogOut, Menu, X, Circle, ArrowLeft, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { cn } from '../../lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
}

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== '/' && location.pathname !== '/auth';

  const markAllNotificationsAsRead = async () => {
    if (!user || notifications.length === 0) return;
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;
    try {
      await Promise.all(
        unread.map((n) => 
          updateDoc(doc(db, 'users', user.uid, 'notifications', n.id), {
            read: true
          })
        )
      );
    } catch (e) {
      console.error("Error marking all as read:", e);
    }
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'notifications', id), {
        read: true
      });
    } catch (e) {
      console.error("Error marking as read:", e);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Calendar },
    { name: 'Explore', href: '/explore', icon: Compass },
    ...(user ? [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Back Button */}
        <div className="flex items-center space-x-3.5">
          {showBackButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-full border border-zinc-800 bg-zinc-900/95 text-white hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md shadow-zinc-950/40 select-none group focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              title="Go back"
              id="global-back-button"
            >
              <ArrowLeft className="h-4.5 w-4.5 text-white group-hover:scale-110 transition-transform duration-200" />
            </Button>
          )}

          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold text-lg tracking-tight sm:block text-white">EventManager</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="group flex items-center space-x-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              <link.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>{link.name}</span>
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center space-x-4">
              <DropdownMenu onOpenChange={(open) => {
                if (open) {
                  markAllNotificationsAsRead();
                }
              }}>
                <DropdownMenuTrigger className="relative h-9 w-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 transition-all hover:bg-zinc-800 hover:border-indigo-500/50 cursor-pointer outline-none group">
                  <Bell className="h-4 w-4 text-zinc-400 group-hover:text-white group-hover:rotate-12 transition-all" />
                  {unreadCount > 0 ? (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-zinc-950">
                      {unreadCount}
                    </span>
                  ) : (profile?.reminders && profile.reminders.length > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-zinc-950 animate-pulse" title={`${profile.reminders.length} active event reminders`} />
                  ) : null)}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-zinc-900 border-zinc-800 text-zinc-100 p-0 overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <span className="font-bold text-sm">Activity</span>
                    {unreadCount > 0 && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{unreadCount} New</span>}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-4 border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer group ${!n.read ? 'bg-indigo-500/5' : ''}`}
                          onClick={() => !n.read && markAsRead(n.id)}
                        >
                          <div className="flex gap-3">
                            <div className="mt-1">
                              {!n.read ? (
                                <Circle className="h-2 w-2 fill-indigo-500 text-indigo-500" />
                              ) : (
                                <Circle className="h-2 w-2 text-zinc-700" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs font-bold leading-tight mb-1 ${!n.read ? 'text-white' : 'text-zinc-400'}`}>{n.title}</p>
                              <p className="text-[11px] text-zinc-500 leading-normal line-clamp-2">{n.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <div className="h-12 w-12 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bell className="h-6 w-6 text-zinc-700 mx-auto" />
                        </div>
                        <p className="text-xs text-zinc-500 font-medium">No recent notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-zinc-950/20 backdrop-blur-sm">
                    <Link 
                      to="/profile" 
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full h-8 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-indigo-400"
                      )}
                    >
                      View Profile All Activity
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-9 w-9 rounded-full overflow-hidden transition-all hover:ring-2 hover:ring-indigo-500/50 hover:ring-offset-2 hover:ring-offset-zinc-950 cursor-pointer outline-none">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.photoURL} alt={profile?.displayName} />
                    <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-100">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.displayName}</p>
                      <p className="text-xs leading-none text-zinc-400">{profile?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center justify-between w-full cursor-pointer">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </div>
                      {profile?.reminders && profile.reminders.length > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {profile.reminders.length} 🔔
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === 'club_owner' && (
                    <DropdownMenuItem>
                      <Link to="/portal" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Club Portal
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem>
                      <Link to="/admin" className="flex items-center cursor-pointer text-primary">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-400 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/auth">
                <Button variant="ghost" className="text-zinc-400 hover:text-white">Log in</Button>
              </Link>
              <Link to="/onboarding">
                <Button className="rounded-full px-6">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-zinc-800 bg-zinc-950 md:hidden"
          >
            <div className="space-y-1 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 rounded-xl p-3 text-base font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white"
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
              {!user && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl">Log in</Button>
                  </Link>
                  <Link to="/onboarding" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full rounded-xl">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
