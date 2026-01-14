
export interface PuneEvent {
  id: string;
  name: string;
  type: 'Expo' | 'Webinar' | 'Fest' | 'Workshop' | 'Seminar' | 'Innovation Show' | 'Other';
  date: string;
  time: string;
  venue: string;
  address: string;
  description: string;
  sourceUrl?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AppState {
  events: PuneEvent[];
  loading: boolean;
  error: string | null;
  sources: GroundingSource[];
}
