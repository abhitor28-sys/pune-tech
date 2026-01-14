
import React from 'react';
import { PuneEvent } from '../types';

interface EventCardProps {
  event: PuneEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'expo': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'webinar': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'fest': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'workshop': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="glass-effect p-6 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 group">
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(event.type)}`}>
          {event.type}
        </span>
        <div className="flex space-x-2 text-slate-400 group-hover:text-blue-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span className="text-sm">{event.time}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-300 transition-colors">
        {event.name}
      </h3>

      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {event.description}
      </p>

      <div className="space-y-3 pt-4 border-t border-slate-700/50">
        <div className="flex items-center text-slate-300 text-sm">
          <svg className="w-4 h-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {event.date}
        </div>
        <div className="flex items-start text-slate-300 text-sm">
          <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div>
            <p className="font-medium text-white">{event.venue}</p>
            <p className="text-xs text-slate-400">{event.address}</p>
          </div>
        </div>
      </div>

      {event.sourceUrl && (
        <a 
          href={event.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 w-full py-2 flex items-center justify-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors text-sm"
        >
          <span>Get More Details</span>
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      )}
    </div>
  );
};

export default EventCard;
