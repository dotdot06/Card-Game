import React, { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { PlayerHand } from './components/PlayerHand';
import { Card, GameState, Player, Group } from './types';
import { Users, PlayCircle } from 'lucide-react';

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
  
  for (let i = 1; i <= 13; i++) {
    for (const suit of suits) {
      deck.push({ suit, value: i, id: `${suit}-${i}` });
      deck.push({ suit, value: i, id: `${suit}-${i}-2` }); // Two sets
    }
  }
  
  return deck.sort(() => Math.random() - 0.5);
};

const initialState: GameState = {
  players: [],
  board: [],
  deck: createDeck(),
  currentPlayerIndex: 0,
  gameStarted: false,
  winner: null,
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [playerName, setPlayerName] = useState('');
  const [playerCount, setPlayerCount] = useState(2);

  const startGame = () => {
    const deck = createDeck();
    const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: `player-${i}`,
      name: i === 0 ? playerName : `Player ${i + 1}`,
      cards: deck.splice(0, 14),
      isCurrentTurn: i === 0,
    }));

    setGameState({
      ...initialState,
      players,
      deck,
      gameStarted: true,
    });
  };

  const handlePlayCards = (playerId: string, cards: Card[]) => {
    setGameState(prev => {
      const playerIndex = prev.players.findIndex(p => p.id === playerId);
      if (playerIndex !== prev.currentPlayerIndex) return prev;

      const newBoard = [...prev.board, { id: `group-${Date.now()}`, cards }];
      const newPlayers = prev.players.map(p => 
        p.id === playerId
          ? { ...p, cards: p.cards.filter(c => !cards.some(pc => pc.id === c.id)) }
          : p
      );

      // Check for winner
      const winner = newPlayers.find(p => p.cards.length === 0)?.id || null;

      return {
        ...prev,
        board: newBoard,
        players: newPlayers.map((p, i) => ({
          ...p,
          isCurrentTurn: (playerIndex + 1) % playerCount === i,
        })),
        currentPlayerIndex: (playerIndex + 1) % playerCount,
        winner,
      };
    });
  };

  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Rummikub Cards</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Players
              </label>
              <div className="flex gap-2">
                {[2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => setPlayerCount(num)}
                    className={`flex-1 py-2 rounded-lg ${
                      playerCount === num
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Users className="w-4 h-4 mx-auto mb-1" />
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              disabled={!playerName}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
                flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayCircle className="w-5 h-5" />
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <GameBoard
          groups={gameState.board}
          onGroupUpdate={(groups) => setGameState(prev => ({ ...prev, board: groups }))}
          currentPlayer={gameState.players[gameState.currentPlayerIndex].id}
          players={gameState.players}
          winner={gameState.winner}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gameState.players.map((player) => (
            <PlayerHand
              key={player.id}
              cards={player.cards}
              onPlay={(cards) => handlePlayCards(player.id, cards)}
              isCurrentPlayer={player.id === gameState.players[gameState.currentPlayerIndex].id}
              playerName={player.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;