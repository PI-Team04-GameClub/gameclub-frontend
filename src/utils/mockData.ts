import { Tournament } from '../types/tournaments';
import { NewsItem } from '../types/news';
import { TeamMember } from '../types/team';
import { Match } from '../types/matches';

// Mock Tournaments Data
export const mockTournaments: Tournament[] = [
  {
    id: 1,
    name: 'Spring Catan Championship',
    game: 'Catan',
    players: 32,
    prizePool: '$1500',
    startDate: '2025-03-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Weekly Ludo Challenge',
    game: 'Covjece ne ljuti se',
    players: 16,
    prizePool: '$400',
    startDate: '2025-03-20',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Monopoly Masters',
    game: 'Monopoly',
    players: 24,
    prizePool: '$1000',
    startDate: '2025-04-01',
    status: 'Upcoming',
  },
  {
    id: 4,
    name: 'Catan World Cup',
    game: 'Catan',
    players: 64,
    prizePool: '$2500',
    startDate: '2025-04-10',
    status: 'Upcoming',
  },
];

// Mock News Data
export const mockNewsItems: NewsItem[] = [
  {
    id: 1,
    title: 'Spring Tournament Season Begins!',
    description: 'Get ready for the most exciting board game tournaments of the year. Registration is now open for multiple competitions.',
    author: 'Pero Peric',
    date: '2025-03-10',
  },
  {
    id: 2,
    title: 'New Prize Pool Records',
    description: 'This season features the largest prize pools in GameClub history, with over $10,000 in total rewards.',
    author: 'Zdravko Mamic',
    date: '2025-03-08',
  },
  {
    id: 3,
    title: 'Player Spotlight: Championship Winners',
    description: 'Meet the champions from last season and learn about their winning strategies and favorite games.',
    author: 'Milica Krmpotich',
    date: '2025-03-05',
  },
];

// Mock Team Members Data
export const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Milica Krmpotich',
    favorite: 'Catan',
    wins: 24,
    losses: 8,
    winRate: '75%',
    role: 'Captain',
  },
  {
    id: 2,
    name: 'Luka Modric',
    favorite: 'Monopoly',
    wins: 18,
    losses: 12,
    winRate: '60%',
    role: 'Player',
  },
  {
    id: 3,
    name: 'Matija Javor',
    favorite: 'Catan',
    wins: 15,
    losses: 9,
    winRate: '63%',
    role: 'Player',
  },
  {
    id: 4,
    name: 'Ana Markic',
    favorite: 'Ludo',
    wins: 21,
    losses: 7,
    winRate: '75%',
    role: 'Player',
  },
];

// Mock Matches Data
export const mockMatches: Match[] = [
  {
    id: 1,
    player1: 'Alex Johnson',
    player2: 'Sarah Chen',
    tournament: 'Spring Catan Championship',
    game: 'Catan',
    date: '2024-03-16',
    time: '14:00',
    status: 'Scheduled',
  },
  {
    id: 2,
    player1: 'Mike Rodriguez',
    player2: 'Emma Wilson',
    tournament: 'Spring Catan Championship',
    game: 'Catan',
    date: '2024-03-16',
    time: '15:30',
    status: 'Scheduled',
  },
  {
    id: 3,
    player1: 'David Kim',
    player2: 'Lisa Brown',
    tournament: 'Weekly Ludo Challenge',
    game: 'Covjece ne ljuti se',
    date: '2024-03-21',
    time: '16:00',
    status: 'Scheduled',
  },
];
