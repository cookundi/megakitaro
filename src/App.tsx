import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import WhitelistTerminal from './pages/WhitelistTerminal';
import RegistryChecker from './pages/RegistryChecker';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      {/* 1. The Glitching Art Collage */}
      <div className="bg-collage-layer"></div>
      
      {/* 2. The Darkening Overlay (Keeps text readable) */}
      <div className="bg-overlay"></div>

      {/* 3. The Main App Container */}
      <div className="min-h-screen flex flex-col selection:bg-cyber-red selection:text-white relative z-10">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<WhitelistTerminal />} />
            <Route path="/checker" element={<RegistryChecker />} />
          </Routes>
        </main>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: '0',
              background: '#151515',
              color: '#eeeeee',
              border: '2px solid #eb0505',
              fontFamily: 'monospace'
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;