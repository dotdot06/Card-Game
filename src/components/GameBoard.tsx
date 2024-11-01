import React, { useState } from 'react';
import { Group, Card as CardType } from '../types';
import { Card } from './Card';
import { Users, Trophy } from 'lucide-react';

type Props = {
  groups: Group[];
  onGroupUpdate: (groups: Group[]) => void;
  currentPlayer: string;
  players: { id: string; name: string }[];
  winner: string | null;
};

export function GameBoard({ groups, onGroupUpdate, currentPlayer, players, winner }: Props) {
  const [draggedCard, setDraggedCard] = useState<CardType | null>(null);
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8 p-8 bg-green-800 rounded-xl shadow-xl min-h-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-white" />
          <span className="text-white font-medium">
            Current Turn: {players.find(p => p.id === currentPlayer)?.name}
          </span>
        </div>
        {winner && (
          <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full">
            <Trophy className="w-6 h-6" />
            <span className="font-bold">{players.find(p => p.id === winner)?.name} Wins!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex flex-wrap gap-2 p-4 bg-green-700 rounded-lg min-h-[140px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggedCard && draggedGroupId) {
                const newGroups = groups.map(g => {
                  if (g.id === group.id) {
                    return { ...g, cards: [...g.cards, draggedCard] };
                  }
                  if (g.id === draggedGroupId) {
                    return { ...g, cards: g.cards.filter(c => c.id !== draggedCard.id) };
                  }
                  return g;
                });
                onGroupUpdate(newGroups);
                setDraggedCard(null);
                setDraggedGroupId(null);
              }
            }}
          >
            {group.cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                draggable
                onDragStart={() => {
                  setDraggedCard(card);
                  setDraggedGroupId(group.id);
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}