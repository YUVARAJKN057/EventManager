export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold tracking-tight">EventManager</span>
            <p className="mt-4 text-sm text-zinc-400 transition-colors">
              The ultimate destination for student event discovery and campus life integration.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Platform</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li><a href="/explore" className="hover:text-primary">Explore</a></li>
              <li><a href="/dashboard" className="hover:text-primary">Dashboard</a></li>
              <li><a href="#" className="hover:text-primary">Clubs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
              <li><a href="#" className="hover:text-primary">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-primary">Privacy</a></li>
              <li><a href="#" className="hover:text-primary">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-900 pt-8 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} EventManager. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
