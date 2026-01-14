
import React, { useState, useEffect, useCallback } from 'react';
import { fetchPuneUpdates } from './services/geminiService';
import { PuneEvent, GroundingSource, AppState } from './types';
import EventCard from './components/EventCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    events: [],
    loading: true,
    error: null,
    sources: [],
  });
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  
  // Categorization must match exactly what Gemini is told to produce
  const categories = ['All', 'Expo', 'Webinar', 'Fest', 'Workshop', 'Seminar', 'Innovation Show'];

  const loadUpdates = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { events, sources } = await fetchPuneUpdates();
      setState({
        events,
        sources,
        loading: false,
        error: events.length === 0 ? "No upcoming events detected. Try refreshing in a moment as we scan more local sources." : null,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Connectivity issue with our live Pune sensors. Please check your connection and retry." 
      }));
    }
  }, []);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  const filteredEvents = state.events.filter(event => {
    if (filter === 'All') return true;
    
    // Normalize both for comparison to ensure tabs work even if AI capitalization varies
    const eventType = (event.type || '').trim().toLowerCase();
    const currentFilter = filter.trim().toLowerCase();
    
    return eventType === currentFilter;
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <header className="relative py-24 px-6 overflow-hidden border-b border-slate-800 bg-slate-900/60">
        <div className="absolute top-0 left-0 w-full h-full tech-gradient opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-pulse shadow-glow">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
            <span>Real-Time City Scan Active</span>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-4 mb-8">
            <div className="w-20 h-20 rounded-[2rem] tech-gradient flex items-center justify-center shadow-2xl shadow-blue-500/40 transform -rotate-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
              PUNE <span className="text-transparent bg-clip-text tech-gradient drop-shadow-sm">TECHPULSE</span>
            </h1>
          </div>
          
          <p className="text-slate-400 text-2xl max-w-3xl mx-auto font-extralight leading-relaxed italic">
            "Your 24/7 radar for innovation, science, and the technology landscape in Pune."
          </p>
          
          {lastUpdated && (
            <div className="mt-8 flex items-center justify-center space-x-3">
              <span className="h-px w-8 bg-slate-800"></span>
              <p className="text-blue-500/60 text-xs font-mono uppercase tracking-widest">
                Latest Feed Sync: {lastUpdated}
              </p>
              <span className="h-px w-8 bg-slate-800"></span>
            </div>
          )}
        </div>
      </header>

      {/* Navigation & Controls */}
      <div className="sticky top-0 z-50 py-6 px-6 glass-effect border-b border-slate-700/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex space-x-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar snap-x">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-7 py-3.5 rounded-2xl text-sm font-black transition-all flex-shrink-0 border uppercase tracking-wider snap-start ${
                  filter === cat 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_10px_20px_rgba(37,99,235,0.4)] scale-110 z-10' 
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:bg-slate-700 hover:text-white hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button 
            onClick={loadUpdates}
            disabled={state.loading}
            className="group flex items-center space-x-3 text-white px-10 py-4 rounded-2xl tech-gradient hover:brightness-125 transition-all font-black disabled:opacity-50 shadow-2xl shadow-purple-500/20 active:scale-90 whitespace-nowrap"
          >
            <svg className={`w-6 h-6 ${state.loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span className="tracking-widest">{state.loading ? 'FETCHING LIVE...' : 'RE-SYNC NETWORK'}</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-16">
        {state.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-effect p-12 rounded-[3rem] h-[30rem] animate-pulse border-slate-800 shadow-inner">
                <div className="h-7 w-32 bg-slate-700/40 rounded-full mb-10"></div>
                <div className="h-14 w-full bg-slate-700/40 rounded-2xl mb-8"></div>
                <div className="h-36 w-full bg-slate-700/40 rounded-3xl mb-10"></div>
                <div className="space-y-5">
                  <div className="h-5 w-4/5 bg-slate-700/40 rounded-lg"></div>
                  <div className="h-5 w-3/5 bg-slate-700/40 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : state.error ? (
          <div className="flex flex-col items-center justify-center py-40 text-center glass-effect rounded-[4rem] border-red-500/10 shadow-[inset_0_0_100px_rgba(239,68,68,0.05)]">
            <div className="w-32 h-32 bg-red-500/5 text-red-500 rounded-full flex items-center justify-center mb-10 border border-red-500/20 shadow-2xl">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="text-4xl font-black text-white mb-6 tracking-tight uppercase">Data Link Severed</h2>
            <p className="text-slate-400 mb-12 max-w-lg text-xl font-light leading-relaxed">{state.error}</p>
            <button onClick={loadUpdates} className="px-16 py-6 tech-gradient text-white rounded-3xl font-black hover:scale-105 transition-all shadow-3xl active:scale-95 text-lg tracking-widest uppercase">
              Establish New Connection
            </button>
          </div>
        ) : (
          <>
            <div className="mb-16 flex flex-col md:flex-row items-baseline justify-between gap-4">
              <h2 className="text-4xl font-black text-white flex items-center tracking-tighter">
                <span className="w-3 h-12 tech-gradient mr-5 rounded-full shadow-2xl shadow-blue-500/50"></span>
                {filter === 'All' ? 'LIVE PUNE STREAM' : `${filter.toUpperCase()} FEED`}
                <span className="ml-6 text-sm font-mono text-blue-400 bg-blue-500/5 px-4 py-1.5 rounded-xl border border-blue-500/20 uppercase tracking-widest">
                  {filteredEvents.length} Active
                </span>
              </h2>
              <p className="text-slate-500 text-sm font-light italic">Showing strictly today's and future events in the city.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            {filteredEvents.length === 0 && (
              <div className="py-52 text-center glass-effect rounded-[4rem] border-2 border-dashed border-slate-800/50">
                <p className="text-slate-500 text-3xl font-extralight tracking-tight mb-8">No current scan results for "{filter}" category.</p>
                <button onClick={() => setFilter('All')} className="px-10 py-4 rounded-2xl border-2 border-blue-500/20 text-blue-400 font-black hover:bg-blue-500/5 transition-all uppercase tracking-widest">
                  View Full City Stream
                </button>
              </div>
            )}

            {state.sources.length > 0 && (
              <div className="mt-40 p-16 glass-effect rounded-[4rem] border-blue-500/5 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] tech-gradient opacity-[0.02] blur-[120px] -mr-64 -mt-64 transition-all duration-1000 group-hover:opacity-[0.05]"></div>
                <h3 className="text-4xl font-black text-white mb-12 uppercase tracking-tighter flex items-center">
                  <svg className="w-10 h-10 mr-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path></svg>
                  Validated Event Feeds
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {state.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group p-8 rounded-[2.5rem] bg-slate-800/10 hover:bg-slate-800/50 transition-all border border-slate-700/20 flex items-start space-x-5 hover:border-blue-500/20 hover:translate-y-[-8px] shadow-sm hover:shadow-2xl"
                    >
                      <div className="mt-1 p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xl font-black text-slate-100 group-hover:text-blue-400 line-clamp-1 transition-colors tracking-tight italic">{source.title}</span>
                        <span className="text-xs text-slate-500 font-mono truncate block mt-2 uppercase tracking-widest opacity-60 group-hover:opacity-100">{new URL(source.uri).hostname}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-40 py-32 border-t border-slate-800/40 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-12 mb-12 text-slate-600 font-black text-xs uppercase tracking-[0.6em]">
             <span>Pune Hub</span>
             <span>Network Scan</span>
             <span>AI Grounding</span>
             <span>Live 2024</span>
          </div>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed font-extralight italic">
            "Scanning thousands of data points daily to ensure Pune's tech community stays connected. 
            Verification of specific timings with event organizers is always encouraged."
          </p>
          <div className="mt-16 pt-12 border-t border-slate-800/30">
            <p className="text-slate-700 text-[10px] font-mono tracking-[0.8em] uppercase">Built for the Pune Innovation Ecosystem</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
