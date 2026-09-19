import { Event } from './EventCard';
import { Card, CardContent } from '../ui/card';
import { QrCode, Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface TicketProps {
  event: Event;
  ticketId: string;
}

export default function Ticket({ event, ticketId }: TicketProps) {
  const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-sm mx-auto overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800 shadow-2xl"
    >
      {/* Top Section */}
      <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-900">
        <h3 className="text-xl font-black text-white italic truncate">{event.title}</h3>
        <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">{event.organizerName}</p>
      </div>

      {/* Perforation Effect */}
      <div className="relative h-4 flex items-center justify-between px-[-10px]">
        <div className="absolute left-0 -ml-2 h-4 w-4 rounded-full bg-zinc-950" />
        <div className="flex-1 border-t-2 border-dashed border-zinc-800 mx-4" />
        <div className="absolute right-0 -mr-2 h-4 w-4 rounded-full bg-zinc-950" />
      </div>

      {/* Ticket Details */}
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Date</p>
            <p className="text-xs font-bold text-white flex items-center">
              <Calendar className="mr-1 h-3 w-3 text-indigo-400" />
              {format(eventDate, 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Time</p>
            <p className="text-xs font-bold text-white flex items-center">
              <Clock className="mr-1 h-3 w-3 text-indigo-400" />
              {format(eventDate, 'p')}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Location</p>
          <p className="text-xs font-bold text-white flex items-center">
            <MapPin className="mr-1 h-3 w-3 text-indigo-400" />
            {event.location}
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex flex-col items-center">
          <div className="bg-white p-2 rounded-xl mb-3">
             <QrCode className="h-24 w-24 text-zinc-950" />
          </div>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Ticket ID: {ticketId.substring(0, 8)}</p>
        </div>
      </CardContent>

      <div className="absolute -bottom-1 -right-1 h-12 w-12 bg-indigo-500/10 blur-2xl rounded-full" />
    </motion.div>
  );
}
