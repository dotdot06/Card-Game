import React, { useState } from 'react';
import { Card as CardType } from '../types';
import { Card } from './Card';

type Props = {
  cards: CardType[];
  onPlay: (cards: CardType[]) => void;
  isCurrentPlayer: boolean;
  playerName: string;
};

export function PlayerHand({ cards, onPlay, isCurrentPlayer, playerName }: Props) {
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);

  return (
    <div className={`p-6 rounded-xl ${isCurrentPlayer ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{playerName}'s Hand</h3>
        {isCurrentPlayer && selectedCards.length > 0 && (
          <button
            onClick={() => {
              onPlay(selectedCards);
              setSelectedCards([]);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Play Selected Cards
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            selected={selectedCards.some(c => c.id === card.id)}
            onClick={() => {
              if (!isCurrentPlayer) return;
              setSelectedCards(prev =>
                prev.some(c => c.id === card.id)
                  ? prev.filter(c => c.id !== card.id)
                  : [...prev, card]
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}