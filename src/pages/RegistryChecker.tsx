import { useState } from 'react';
import {  Trophy, ShieldAlert } from 'lucide-react';

// Mock data for development
const MOCK_DATA = [
  { rank: 1, handle: '@0xKitaro', wallet: '0x12...9fa', refs: 142, status: 'VERIFIED' },
  { rank: 2, handle: '@CyberPunk99', wallet: '0x88...3b1', refs: 89, status: 'VERIFIED' },
  { rank: 3, handle: '@NeonGlitch', wallet: '0x44...7c2', refs: 45, status: 'VERIFIED' },
];

export default function RegistryChecker() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = MOCK_DATA.filter(user => 
    user.handle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.wallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-20 sm:mt-20 px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          {/* Mixed Red and Cyan Branding */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter  uppercase mb-2">
           Registry Logs
          </h1>
          <p className="text-cyber-white border-l-4 border-cyber-cyan pl-4 py-1 text-sm sm:text-base">
            Global ranking of active operatives and referral network reach.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search handle or 0x..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cyber-black border-2 border-cyber-gray p-3 sm:p-4 pl-12 text-cyber-white outline-none focus:border-cyber-cyan transition-colors"
          />
        </div>
      </div>

      {/* The Table Container - Mixed Borders */}
      <div className="border-2 border-cyber-gray bg-cyber-dark relative">
        {/* Mixed Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-red"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-red"></div>
        
        {/* Responsive Horizontal Scroll Wrapper */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              {/* Mixed Header Line */}
              <tr className="border-b-2 border-cyber-red bg-cyber-black text-cyber-cyan uppercase tracking-widest text-xs sm:text-sm">
                <th className="p-4 w-20 text-center">RANK</th>
                <th className="p-4">OPERATIVE</th>
                <th className="p-4">HARDWARE (EVM)</th>
                <th className="p-4 text-center">NETWORK (REFS)</th>
                <th className="p-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <tr key={user.handle} className="border-b border-cyber-gray/30 hover:bg-cyber-black transition-colors group">
                    <td className="p-4 text-center font-bold text-cyber-gray group-hover:text-cyber-white">
                      {user.rank <= 3 ? <Trophy size={18} className="mx-auto text-cyber-cyan" /> : `#${user.rank}`}
                    </td>
                    <td className="p-4 font-bold text-cyber-white">{user.handle}</td>
                    <td className="p-4 text-cyber-gray font-mono text-xs sm:text-sm">{user.wallet}</td>
                    <td className="p-4 text-center font-black text-lg sm:text-xl text-cyber-cyan">{user.refs}</td>
                    <td className="p-4 text-right">
                      <span className="inline-block border border-cyber-cyan text-cyber-cyan text-xs px-2 py-1 tracking-widest bg-cyber-cyan/10">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-cyber-gray">
                    <div className="flex flex-col items-center gap-4">
                      <ShieldAlert size={40} className="text-cyber-red" />
                      <p className="tracking-widest text-sm">NO OPERATIVE FOUND IN REGISTRY</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}