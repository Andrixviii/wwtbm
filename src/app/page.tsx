'use client';

import React, { useState } from 'react';
import MainMenu from '../components/MainMenu';
import GameBoard from '../components/GameBoard';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleGameEnd = () => {
    setGameStarted(false);
  };

  return (
    <main>
      {gameStarted ? (
        <GameBoard onGameEnd={handleGameEnd} />
      ) : (
        <MainMenu onStartGame={handleStartGame} />
      )}
    </main>
  );
}