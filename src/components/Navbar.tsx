import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="border-b fixed w-full z-50 border-cyber-gray/80 bg-cyber-black p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <Link to="/" className="text-xl sm:text-2xl font-black tracking-tighter flex items-center gap-3 text-cyber-white hover:text-cyber-red transition-colors">

                [ MEGAKITARO ]
        </Link>
        
        <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-bold tracking-widest">
          <Link 
            to="/" 
            className={`hover:text-cyber-red transition-colors py-1 ${location.pathname === '/' ? 'text-cyber-red border-b-2 border-cyber-red' : 'text-cyber-gray'}`}
          >
            [ INITIATE ]
          </Link>
          <Link 
            to="/checker" 
            className={`hover:text-cyber-cyan transition-colors py-1 ${location.pathname === '/checker' ? 'text-cyber-cyan border-b-2 border-cyber-cyan' : 'text-cyber-gray'}`}
          >
            [ REGISTRY ]
          </Link>
        </div>
      </div>
    </nav>
  );
}