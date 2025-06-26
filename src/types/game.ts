export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  currentQuestion: number;
  score: number;
  gameStatus: 'playing' | 'won' | 'lost' | 'menu';
  selectedAnswer: number | null;
  showAnswer: boolean;
  usedLifelines: {
    fiftyFifty: boolean;
    askAudience: boolean;
    phoneAFriend: boolean;
  };
  eliminatedOptions: number[];
  audienceVotes?: number[];
  friendSuggestion?: number;
  friendConfidence?: 'confident' | 'pretty sure' | 'think' | 'not sure';
}

export const PRIZE_LEVELS = [
  100,
  200,
  300,
  500,
  1000,
  2000,
  4000,
  8000,
  16000,
  32000,
  64000,
  125000,
  250000,
  500000,
  1000000
];

export const SAFE_LEVELS = [4, 9, 14];