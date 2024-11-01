export type Card = {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: number;
  id: string;
};

export type Player = {
  id: string;
  name: string;
  cards: Card[];
  isCurrentTurn: boolean;
};

export type Group = {
  id: string;
  cards: Card[];
};

export type GameState = {
  players: Player[];
  board: Group[];
  deck: Card[];
  currentPlayerIndex: number;
  gameStarted: boolean;
  winner: string | null;
};