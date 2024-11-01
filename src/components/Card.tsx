import React from 'react';
import { Card as CardType } from '../types';

type Props = {
  card: CardType;
  onClick?: () => void;
  selected?: boolean;
  draggable?: boolean;
};

const suitColors = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-gray-800',
  spades: 'text-gray-800',
};

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export function Card({ card, onClick, selected, draggable = true }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-16 h-24 bg-white rounded-lg shadow-md cursor-pointer
        transition-transform hover:scale-105
        ${selected ? 'ring-2 ring-blue-500 transform translate-y-[-8px]' : ''}
        ${draggable ? 'cursor-move' : 'cursor-pointer'}
      `}
      draggable={draggable}
    >
      <div className={`absolute top-2 left-2 ${suitColors[card.suit]}`}>
        <div className="text-lg font-bold">{card.value}</div>
        <div className="text-xl">{suitSymbols[card.suit]}</div>
      </div>
      <div className={`absolute bottom-2 right-2 ${suitColors[card.suit]} rotate-180`}>
        <div className="text-lg font-bold">{card.value}</div>
        <div className="text-xl">{suitSymbols[card.suit]}</div>
      </div>
    </div>
  );
}