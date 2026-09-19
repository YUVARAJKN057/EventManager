import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Contact, Building, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: RegistrationData) => Promise<void>;
  eventTitle: string;
  loading: boolean;
}

export interface RegistrationData {
  studentId: string;
  department: string;
  year: string;
  specialRequirements?: string;
}

export default function RegistrationModal({ isOpen, onClose, onConfirm, eventTitle, loading }: RegistrationModalProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    studentId: '',
    department: '',
    year: '',
    specialRequirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Event Registration</h3>
                <p className="text-sm text-zinc-500 mt-1">{eventTitle}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 block">Student ID</label>
                  <div className="relative">
                    <Contact className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input 
                      required
                      placeholder="e.g. STU12345"
                      className="pl-10 bg-zinc-800/50 border-zinc-800"
                      value={formData.studentId}
                      onChange={e => setFormData(s => ({ ...s, studentId: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 block">Department</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input 
                        required
                        placeholder="e.g. CS"
                        className="pl-10 bg-zinc-800/50 border-zinc-800"
                        value={formData.department}
                        onChange={e => setFormData(s => ({ ...s, department: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 block">Year of Study</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input 
                        required
                        placeholder="e.g. 3rd Year"
                        className="pl-10 bg-zinc-800/50 border-zinc-800"
                        value={formData.year}
                        onChange={e => setFormData(s => ({ ...s, year: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 block">Special Requirements (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Textarea 
                      placeholder="Dietary needs, accessibility requests, etc."
                      className="pl-10 min-h-[100px] bg-zinc-800/50 border-zinc-800"
                      value={formData.specialRequirements}
                      onChange={e => setFormData(s => ({ ...s, specialRequirements: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : 'Confirm Registration'}
                </Button>
                <p className="text-[10px] text-zinc-600 text-center mt-4 uppercase tracking-widest font-black">
                  By confirming, you agree to the campus event policies.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
