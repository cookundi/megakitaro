import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, CheckSquare, Square, Copy } from 'lucide-react';

type TaskState = 'idle' | 'loading' | 'input' | 'completed';

export default function WhitelistTerminal() {
    const [searchParams] = useSearchParams();
    const [referrer, setReferrer] = useState<string | null>(null);

    const [activeTask, setActiveTask] = useState<number>(1);
    const [taskState, setTaskState] = useState<TaskState>('idle');
    const [formData, setFormData] = useState({
        xHandle: '',
        commentLink: '',
        quoteLink: '',
        evmWallet: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setReferrer(ref);
            toast.success(`UPLINK ESTABLISHED: Referred by @${ref}`);
        }
    }, [searchParams]);

    const handleTaskAction = (url: string, requiresInput: boolean) => {
        window.open(url, '_blank');
        setTaskState('loading');

        setTimeout(() => {
            if (requiresInput) {
                setTaskState('input');
            } else {
                setTaskState('completed');
                setTimeout(() => {
                    setActiveTask(prev => prev + 1);
                    setTaskState('idle');
                }, 1000);
            }
        }, 4000);
    };

    // Updated to handle specific validations per task
    const handleInputSubmit = (e: React.FormEvent, taskNum: number) => {
        e.preventDefault();

        // VALIDATION: Task 1 (X Handle)
        if (taskNum === 1) {
            const handleRegex = /^@[A-Za-z0-9_]{1,15}$/;
            if (!handleRegex.test(formData.xHandle)) {
                toast.error("INVALID FORMAT: Handle must be 1-15 characters.");
                return;
            }
        }

        // VALIDATION: Task 3 & 4 (X Status Links)
        if (taskNum === 3 || taskNum === 4) {
            const linkRegex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/[0-9]+/;
            const targetLink = taskNum === 3 ? formData.commentLink : formData.quoteLink;
            
            if (!linkRegex.test(targetLink)) {
                toast.error("INVALID LINK: Must be a direct URL to an X post/reply.");
                return;
            }
        }

        // If validation passes, proceed
        setTaskState('completed');
        setTimeout(() => {
            setActiveTask(prev => prev + 1);
            setTaskState('idle');
        }, 500);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION: Task 5 (EVM Wallet)
        const evmRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!evmRegex.test(formData.evmWallet)) {
            toast.error("INVALID HARDWARE: Must be a valid 42-character EVM address.");
            return;
        }

        const loadingToast = toast.loading("INJECTING DATA INTO MAINFRAME...");

        try {
            const response = await fetch('/.netlify/functions/submit-operative', {
                method: 'POST',
                body: JSON.stringify({ ...formData, referrer }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("SIGNATURE ACCEPTED.", { id: loadingToast });
                setIsSubmitted(true);
            } else {
                toast.error(`ERROR: ${result.error}`, { id: loadingToast });
            }
        } catch (error) {
            toast.error("CONNECTION FAILED. TRY AGAIN.", { id: loadingToast });
        }
    };

    const copyReferral = () => {
        const link = `${window.location.origin}/?ref=${formData.xHandle.replace('@', '')}`;
        navigator.clipboard.writeText(link);
        toast("REFERRAL LINK COPIED TO CLIPBOARD");
    };

    const getWrapperClass = (taskNum: number, isCyan = false) => {
        const isActive = activeTask === taskNum;
        const isCompleted = activeTask > taskNum;

        if (isActive) {
            return isCyan ? 'animated-border-cyan' : 'animated-border-red';
        }
        if (isCompleted) {
            return 'border-2 border-cyber-gray/50 bg-cyber-black opacity-70';
        }
        return 'border-2 border-cyber-gray/20 bg-cyber-black opacity-80';
    };

    const getInnerClass = (taskNum: number) => {
        if (activeTask === taskNum) {
            return 'relative z-10 bg-cyber-dark m-[2px] p-5 sm:p-6 h-[calc(100%-4px)]';
        }
        return 'relative z-10 p-5 sm:p-6 h-full';
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto mt-12 sm:mt-20 px-4">
                <div className="animated-border-cyan text-center">
                    <div className="relative z-10 bg-cyber-dark m-[2px] p-6 sm:p-8 h-[calc(100%-4px)]">
                        <h2 className="text-2xl sm:text-3xl font-black mb-4 text-cyber-white uppercase">PROTOCOL COMPLETE</h2>
                        <p className="text-cyber-white text-sm sm:text-base mb-8">Your signature has been permanently etched into the registry.</p>

                        <div className="bg-cyber-black border-2 border-cyber-gray/50 p-4 sm:p-6 text-left">
                            <p className="text-xs text-cyber-white mb-2 uppercase tracking-widest font-bold">Your Operative Link</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    readOnly
                                    value={`${window.location.origin}/?ref=${formData.xHandle.replace('@', '')}`}
                                    className="w-full bg-cyber-dark border-2 border-cyber-gray p-3 text-cyber-white outline-none text-sm"
                                />
                                <button
                                    onClick={copyReferral}
                                    className="bg-cyber-white cursor-pointer text-cyber-black px-6 py-3 font-bold hover:bg-cyber-cyan transition-colors flex items-center justify-center gap-2"
                                >
                                    <Copy size={18} /> COPY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-30 sm:mt-20 px-2 pb-20">
            <div className="mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-2 text-cyber-white">
                    Whitelist Terminal
                </h1>
                <p className="text-cyber-white border-l-4 border-cyber-red pl-4 py-1 text-sm sm:text-base">
                    Complete the sequence to secure your sector allocation. Strict validation enabled.
                </p>
            </div>

            <div className="space-y-6">
                {/* TASK 1: FOLLOW */}
                <div className={getWrapperClass(1)}>
                    <div className={getInnerClass(1)}>
                        <div className="flex items-center gap-3 sm:gap-4 mb-4">
                            {activeTask > 1 ? <CheckSquare className="text-cyber-white shrink-0" /> : <Square className={activeTask === 1 ? "text-cyber-white shrink-0" : "text-cyber-gray shrink-0"} />}
                            <h3 className="text-lg sm:text-xl font-bold uppercase text-cyber-white">01 // Establish Comm Link</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-cyber-white mb-6">Follow @megakitaro on X network.</p>

                        {activeTask === 1 && taskState === 'idle' && (
                            <button onClick={() => handleTaskAction('https://x.com/megakitaro', true)} className="w-full cursor-pointer sm:w-auto bg-cyber-white text-cyber-black font-bold px-6 py-3 hover:bg-cyber-red hover:text-white transition-colors">
                                EXECUTE_FOLLOW
                            </button>
                        )}
                        {activeTask === 1 && taskState === 'loading' && (
                            <div className="flex items-center gap-3 text-cyber-white font-bold tracking-widest text-sm">
                                <Loader2 className="animate-spin text-cyber-red" /> AWAITING HANDSHAKE...
                            </div>
                        )}
                        {activeTask === 1 && taskState === 'input' && (
                            <form onSubmit={(e) => handleInputSubmit(e, 1)} className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="@megakitaro" 
                                    value={formData.xHandle}
                                    onChange={(e) => {
                                        // Auto-inject @ if user forgets it
                                        let val = e.target.value;
                                        if (val && !val.startsWith('@')) val = '@' + val;
                                        setFormData({ ...formData, xHandle: val.trim() });
                                    }} 
                                    className="bg-cyber-black border-2 border-cyber-gray p-3 text-cyber-white outline-none focus:border-cyber-red w-full" 
                                />
                                <button type="submit" className="cursor-pointer w-full sm:w-auto bg-cyber-red text-cyber-white font-bold px-8 py-3 hover:bg-cyber-white hover:text-cyber-black transition-colors">VERIFY</button>
                            </form>
                        )}
                    </div>
                </div>

                {/* TASK 2: LIKE & RT */}
                <div className={getWrapperClass(2)}>
                    <div className={getInnerClass(2)}>
                        <div className="flex items-center gap-3 sm:gap-4 mb-4">
                            {activeTask > 2 ? <CheckSquare className="text-cyber-white shrink-0" /> : <Square className={activeTask === 2 ? "text-cyber-white shrink-0" : "text-cyber-gray shrink-0"} />}
                            <h3 className="text-lg sm:text-xl font-bold uppercase text-cyber-white">02 // Amplify Signal</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-cyber-white mb-6">Like and Repost the primary broadcast.</p>

                        {activeTask === 2 && taskState === 'idle' && (
                            <button onClick={() => handleTaskAction('https://x.com/megakitaro/status/2023794261649752549?s=46', false)} className="w-full cursor-pointer sm:w-auto bg-cyber-white text-cyber-black font-bold px-6 py-3 hover:bg-cyber-red hover:text-white transition-colors">
                                EXECUTE_AMPLIFY
                            </button>
                        )}
                        {activeTask === 2 && taskState === 'loading' && (
                            <div className="flex items-center gap-3 text-cyber-white font-bold tracking-widest text-sm">
                                <Loader2 className="animate-spin text-cyber-red" /> SCANNING NETWORK...
                            </div>
                        )}
                    </div>
                </div>

                {/* TASK 3: TAG FRIENDS */}
                <div className={getWrapperClass(3)}>
                    <div className={getInnerClass(3)}>
                        <div className="flex items-center gap-3 sm:gap-4 mb-4">
                            {activeTask > 3 ? <CheckSquare className="text-cyber-white shrink-0" /> : <Square className={activeTask === 3 ? "text-cyber-white shrink-0" : "text-cyber-gray shrink-0"} />}
                            <h3 className="text-lg sm:text-xl font-bold uppercase text-cyber-white">03 // Recruit Operatives</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-cyber-white mb-6">Tag 2 allies in the broadcast comments.</p>

                        {activeTask === 3 && taskState === 'idle' && (
                            <button onClick={() => handleTaskAction('https://x.com/megakitaro/status/2023794261649752549?s=46', true)} className="w-full cursor-pointer sm:w-auto bg-cyber-white text-cyber-black font-bold px-6 py-3 hover:bg-cyber-red hover:text-white transition-colors">
                                EXECUTE_COMMENT
                            </button>
                        )}
                        {activeTask === 3 && taskState === 'loading' && (
                            <div className="flex items-center gap-3 text-cyber-white font-bold tracking-widest text-sm">
                                <Loader2 className="animate-spin text-cyber-red" /> VERIFYING TARGETS...
                            </div>
                        )}
                        {activeTask === 3 && taskState === 'input' && (
                            <form onSubmit={(e) => handleInputSubmit(e, 3)} className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    required 
                                    type="url" 
                                    placeholder="Paste comment URL" 
                                    value={formData.commentLink}
                                    onChange={(e) => setFormData({ ...formData, commentLink: e.target.value.trim() })} 
                                    className="bg-cyber-black border-2 border-cyber-gray p-3 text-cyber-white outline-none focus:border-cyber-red w-full" 
                                />
                                <button type="submit" className="cursor-pointer w-full sm:w-auto bg-cyber-red text-cyber-white font-bold px-8 py-3 hover:bg-cyber-white hover:text-cyber-black transition-colors">VERIFY</button>
                            </form>
                        )}
                    </div>
                </div>

                {/* TASK 4: QUOTE POST */}
                <div className={getWrapperClass(4)}>
                    <div className={getInnerClass(4)}>
                        <div className="flex items-center gap-3 sm:gap-4 mb-4">
                            {activeTask > 4 ? <CheckSquare className="text-cyber-white shrink-0" /> : <Square className={activeTask === 4 ? "text-cyber-white shrink-0" : "text-cyber-gray shrink-0"} />}
                            <h3 className="text-lg sm:text-xl font-bold uppercase text-cyber-white">04 // Declare Allegiance</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-cyber-white mb-6">Quote the broadcast with: "MegaKitaro On Top".</p>

                        {activeTask === 4 && taskState === 'idle' && (
                            <button onClick={() => handleTaskAction('https://x.com/megakitaro/status/2023794261649752549?s=46', true)} className="w-full cursor-pointer sm:w-auto bg-cyber-white text-cyber-black font-bold px-6 py-3 hover:bg-cyber-red hover:text-white transition-colors">
                                EXECUTE_QUOTE
                            </button>
                        )}
                        {activeTask === 4 && taskState === 'loading' && (
                            <div className="flex items-center gap-3 text-cyber-white font-bold tracking-widest text-sm">
                                <Loader2 className="animate-spin text-cyber-red" /> ANALYZING QUOTE...
                            </div>
                        )}
                        {activeTask === 4 && taskState === 'input' && (
                            <form onSubmit={(e) => handleInputSubmit(e, 4)} className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    required 
                                    type="url" 
                                    placeholder="Paste quote URL" 
                                    value={formData.quoteLink}
                                    onChange={(e) => setFormData({ ...formData, quoteLink: e.target.value.trim() })} 
                                    className="bg-cyber-black border-2 border-cyber-gray p-3 text-cyber-white outline-none focus:border-cyber-red w-full" 
                                />
                                <button type="submit" className="cursor-pointer w-full sm:w-auto bg-cyber-red text-cyber-white font-bold px-8 py-3 hover:bg-cyber-white hover:text-cyber-black transition-colors">VERIFY</button>
                            </form>
                        )}
                    </div>
                </div>

                {/* TASK 5: EVM WALLET */}
                <div className={getWrapperClass(5, true)}>
                    <div className={getInnerClass(5)}>
                        <div className="flex items-center gap-3 sm:gap-4 mb-6">
                            <h3 className="text-lg sm:text-xl font-bold uppercase text-cyber-white">05 // Secure Hardware</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-cyber-white mb-6">Provide EVM compatible address for payload delivery.</p>

                        {activeTask === 5 && (
                            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4">
                                <input 
                                    required 
                                    type="text" 
                                    placeholder="0x..." 
                                    value={formData.evmWallet}
                                    onChange={(e) => setFormData({ ...formData, evmWallet: e.target.value.trim() })} 
                                    className="bg-cyber-black border-2 border-cyber-gray p-4 text-cyber-white outline-none focus:border-cyber-cyan w-full font-mono text-base sm:text-lg" 
                                />
                                <button type="submit" className="cursor-pointer bg-cyber-white text-cyber-black font-black text-lg sm:text-xl px-8 py-4 uppercase tracking-widest hover:bg-cyber-cyan transition-colors">
                                    [ SUBMIT ]
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}