import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">NTDFilm</h3>
              <p className="text-gray-400 text-sm">
                Your premier destination for booking performance tickets online.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white">Browse Shows</a></li>
                <li><a href="/my-tickets" className="hover:text-white">My Tickets</a></li>
                <li><a href="#" className="hover:text-white">Help & Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                Email: support@ntdflim.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            &copy; 2026 NTDFilm. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
