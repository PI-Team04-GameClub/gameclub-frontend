// Tournament Types
export interface Tournament {
  id: number;
  name: string;
  game: string;
  players: number;
  prizePool: string;
  startDate: string;
  status: 'Active' | 'Upcoming' | 'Completed';
}

export interface TournamentFormData {
  name: string;
  game: string;
  players: number;
  prizePool: string;
  startDate: string;
}
