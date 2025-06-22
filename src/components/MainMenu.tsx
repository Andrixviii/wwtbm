'use client';

import React from 'react';
import { Trophy, Play, Info } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo/Title */}
        <div className="mb-8 mt-8">
          <Trophy className="w-20 h-20 mx-auto mb-4 text-millionaire-gold animate-bounce-slow" />
          <h1 className="text-4xl md:text-6xl font-bold text-millionaire-gold mb-2">
            Who Wants to Be a
          </h1>
          <h1 className="text-5xl md:text-7xl font-bold text-millionaire-gold mb-4">
            MILLIONAIRE?
          </h1>
          <p className="text-xl text-white opacity-90">
            Answer 15 questions correctly and win $1,000,000!
          </p>
        </div>

        {/* Main Menu Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={onStartGame}
            className="millionaire-button w-full max-w-md mx-auto flex items-center justify-center gap-3 text-xl py-4"
          >
            <Play className="w-6 h-6" />
            Start Game
          </button>
        </div>

        {/* Game Rules */}
        <div className="bg-gradient-to-r from-millionaire-blue to-millionaire-purple p-6 rounded-xl shadow-2xl max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-millionaire-gold" />
            <h3 className="text-lg font-bold text-millionaire-gold">How to Play</h3>
          </div>
          <div className="text-white text-left space-y-2">
            <p>• Answer 15 multiple choice questions</p>
            <p>• Each correct answer increases your prize money</p>
            <p>• Use lifelines to help you: 50:50, Ask the Audience, Phone a Friend</p>
            <p>• Safe levels at $1,000, $32,000, and $1,000,000</p>
            <p>• Walk away anytime to keep your winnings</p>
            <p>• One wrong answer and you lose everything (except safe levels)</p>
          </div>
        </div>

        {/* Prize Structure Preview */}
        <div className="mt-8 bg-gradient-to-r from-millionaire-gold to-millionaire-orange p-4 rounded-xl shadow-xl max-w-md mx-auto">
          <h3 className="text-lg font-bold text-black mb-3">Prize Structure</h3>
          <div className="grid grid-cols-2 gap-2 text-black text-sm">
            <div>1. $100</div>
            <div>9. $32,000 🛡️</div>
            <div>2. $200</div>
            <div>10. $64,000</div>
            <div>3. $300</div>
            <div>11. $125,000</div>
            <div>4. $500</div>
            <div>12. $250,000</div>
            <div>5. $1,000 🛡️</div>
            <div>13. $500,000</div>
            <div>6. $2,000</div>
            <div>14. $1,000,000 🛡️</div>
            <div>7. $4,000</div>
            <div></div>
            <div>8. $8,000</div>
            <div></div>
          </div>
          <p className="text-xs text-black mt-2 opacity-75">🛡️ = Safe levels</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;