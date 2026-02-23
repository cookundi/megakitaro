import { useState, useEffect } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';

// Define the shape of our data
interface Operative {
  rank: number;
  handle: string;
  wallet: string;
  refs: number;
  status: string;
}

export default function RegistryChecker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [registryData, setRegistryData] = useState<Operative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch real data on component mount
  useEffect(() => {
    const fetchRegistry = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-registry');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        
        // Map backend database rows to our frontend UI structure
        const formattedData = data.map((user: any, index: number) => ({
          rank: index + 1, // Auto-rank based on array position (since backend sorts by refs)
          handle: user.x_handle,
          // Condense the EVM wallet to look like '0x1234...abcd' to fit cleanly
          wallet: user.evm_wallet ? `${user.evm_wallet.slice(0, 6)}...${user.evm_wallet.slice(-4)}` : 'UNKNOWN',
          refs: user.referrals || 0,
          status: 'VERIFIED'
        }));
        
        setRegistryData(formattedData);
      } catch (err) {
        console.error("Mainframe query failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistry();
  }, []);

  const filteredData = registryData.filter(user => 
    user.handle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.wallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-30 sm:mt-20 px-2 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          {/* Mixed Red and Cyan Branding */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter  uppercase mb-2">
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
            className="w-full bg-cyber-black border border-cyber-gray p-3 sm:p-4 pl-12 text-cyber-white outline-none focus:border-cyber-cyan transition-colors"
          />
        </div>
      </div>

      {/* The Table Container - Mixed Borders */}
      <div className="border border-cyber-gray bg-cyber-dark relative">
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
              <tr className="border-b border-cyber-gray bg-cyber-black text-cyber-gray uppercase tracking-widest text-xs sm:text-sm">
                {/* <th className="p-4 w-20 text-center">RANK</th> */}
                <th className="p-4">OPERATIVE</th>
                <th className="p-4">HARDWARE (EVM)</th>
                <th className="p-4 text-center">NETWORK (REFS)</th>
                <th className="p-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {/* LOADING STATE */}
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-cyber-cyan">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin" size={40} />
                      <p className="tracking-widest text-sm font-bold animate-pulse">ACCESSING MAINFRAME...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                /* ERROR STATE */
                <tr>
                  <td colSpan={5} className="p-12 text-center text-cyber-red">
                    <div className="flex flex-col items-center gap-4">
                      <ShieldAlert size={40} />
                      <p className="tracking-widest text-sm font-bold">UPLINK FAILED. COULD NOT RETRIEVE REGISTRY.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                /* DATA LOADED STATE */
                filteredData.map((user) => (
                  <tr key={user.handle} className="border-b border-cyber-gray/30 hover:bg-cyber-black transition-colors group">
                    {/* <td className="p-4 text-center font-bold text-cyber-gray group-hover:text-cyber-white">
                      {user.rank <= 3 ? <Trophy size={18} className="mx-auto text-cyber-cyan" /> : `#${user.rank}`}
                    </td> */}
                    <td className="p-4 text-cyber-cyan">{user.handle}</td>
                    <td className="p-4 text-cyber-gray font-mono">{user.wallet}</td>
                    <td className="p-4 text-center sm:text-xl text-cyber-gray">{user.refs}</td>
                    <td className="p-4 text-right">
                      <span className="inline-block border border-cyber-cyan text-cyber-gray text-xs px-2 py-1 tracking-widest bg-cyber-cyan/10">
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                /* EMPTY OR NO SEARCH RESULTS STATE */
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