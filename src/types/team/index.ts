// Team Types
export interface TeamMember {
  id: number;
  name: string;
  favorite: string;
  wins: number;
  losses: number;
  winRate: string;
  role: 'Captain' | 'Player';
}

export interface MemberFormData {
  firstName: string;
  favoriteGame: string;
}
