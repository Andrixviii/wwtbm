'use client';

import React, { useState, useEffect } from 'react';
import { Question, GameState, PRIZE_LEVELS, SAFE_LEVELS } from '../types/game';
import { Phone, Users, Scissors, Trophy, Home } from 'lucide-react';

interface GameBoardProps {
  onGameEnd: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onGameEnd }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    gameStatus: 'playing',
    selectedAnswer: null,
    showAnswer: false,
    usedLifelines: {
      fiftyFifty: false,
      askAudience: false,
      phoneAFriend: false,
    },
    eliminatedOptions: [],
  });

  const [audienceLoading, setAudienceLoading] = useState(false);
  const [friendLoading, setFriendLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const res = await fetch('/api/questions');
      const data = await res.json();

      const merged = [...(data.easy || []), ...(data.medium || []), ...(data.hard || [])];

      const mapped: Question[] = merged.map((q: any) => ({
        id: q.id,
        question: q.question,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correctAnswer: 'ABCD'.indexOf(q.correct_answer.toUpperCase()),
        difficulty: q.difficulty,
      }));

      setQuestions(mapped);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  if (!showContent || loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <img src="/assets/img/Search.svg" alt="Loading..." className="w-60 h-60" />
        <p className='text-lg font-bold text-orange-400'>Searching....</p>
      </div>
    );
  }

  if (!questions.length) {
    return <div className="text-center text-red-500 mt-10">No questions available.</div>;
  }

  const currentQuestion = questions[gameState.currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    if (gameState.showAnswer || gameState.eliminatedOptions.includes(answerIndex)) return;
    setGameState(prev => ({ ...prev, selectedAnswer: answerIndex }));
  };

  const handleFinalAnswer = () => {
    if (gameState.selectedAnswer === null) return;
    setGameState(prev => ({ ...prev, showAnswer: true }));

    setTimeout(() => {
      const isCorrect = gameState.selectedAnswer === currentQuestion.correctAnswer;

      if (isCorrect) {
        const audio = new Audio('/sfx/correct.mp3');
        audio.play();
        const newScore = gameState.currentQuestion;

        if (gameState.currentQuestion === questions.length - 1) {
          setGameState(prev => ({
            ...prev,
            gameStatus: 'won',
            score: newScore,
          }));
        } else {
          setGameState(prev => ({
            ...prev,
            currentQuestion: prev.currentQuestion + 1,
            selectedAnswer: null,
            showAnswer: false,
            eliminatedOptions: [],
            audienceVotes: undefined,
            friendSuggestion: undefined,
          }));
        }
      } else {
        const audio = new Audio('/sfx/wrong.mp3');
        audio.play();
        const safeLevel = SAFE_LEVELS.filter(level => level <= gameState.currentQuestion).pop();
        const finalScore = safeLevel !== undefined ? safeLevel : 0;
        setGameState(prev => ({ ...prev, gameStatus: 'lost', score: finalScore }));
      }
    }, 3000);
  };

  const handleWalkAway = () => {
    const safeLevel = SAFE_LEVELS.filter(level => level < gameState.currentQuestion).pop();
    const finalScore = safeLevel !== undefined ? safeLevel : gameState.currentQuestion - 1;
    setGameState(prev => ({ ...prev, gameStatus: 'won', score: Math.max(0, finalScore) }));
  };

  const useFiftyFifty = () => {
    if (gameState.usedLifelines.fiftyFifty) return;
    const correctAnswer = currentQuestion.correctAnswer;
    const wrongAnswers = [0, 1, 2, 3].filter(i => i !== correctAnswer);
    const toEliminate = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
    setGameState(prev => ({
      ...prev,
      usedLifelines: { ...prev.usedLifelines, fiftyFifty: true },
      eliminatedOptions: toEliminate,
    }));
  };

  const useAskAudience = () => {
    if (gameState.usedLifelines.askAudience || audienceLoading) return;
    setAudienceLoading(true);

    setTimeout(() => {
      const correctAnswer = currentQuestion.correctAnswer;
      const questionNumber = gameState.currentQuestion + 1;
      let audienceAccuracy;
      if (questionNumber <= 5) {
        audienceAccuracy = 0.7 + Math.random() * 0.15;
      } else if (questionNumber <= 10) {
        audienceAccuracy = 0.5 + Math.random() * 0.2;
      } else {
        audienceAccuracy = 0.3 + Math.random() * 0.2;
      }

      const votes = [0, 0, 0, 0];
      if (Math.random() < audienceAccuracy) {
        const correctVotes = Math.floor(Math.random() * 30) + 35;
        votes[correctAnswer] = correctVotes;
        let remaining = 100 - correctVotes;
        const wrongAnswers = [0, 1, 2, 3].filter(i => i !== correctAnswer);
        wrongAnswers.forEach((i, idx) => {
          const v = idx === wrongAnswers.length - 1 ? remaining : Math.floor(Math.random() * (remaining / (wrongAnswers.length - idx)));
          votes[i] = v;
          remaining -= v;
        });
      } else {
        const wrongAnswers = [0, 1, 2, 3].filter(i => i !== correctAnswer);
        const mainWrong = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        votes[mainWrong] = Math.floor(Math.random() * 25) + 30;
        let remaining = 100 - votes[mainWrong];
        const others = [0, 1, 2, 3].filter(i => i !== mainWrong);
        others.forEach((i, idx) => {
          const v = idx === others.length - 1 ? remaining : Math.floor(Math.random() * (remaining / (others.length - idx)));
          votes[i] = v;
          remaining -= v;
        });
      }

      const total = votes.reduce((a, b) => a + b, 0);
      if (total !== 100) votes[correctAnswer] += 100 - total;

      setGameState(prev => ({
        ...prev,
        usedLifelines: { ...prev.usedLifelines, askAudience: true },
        audienceVotes: votes,
      }));
      setAudienceLoading(false);
    }, 2000);
  };

  const usePhoneAFriend = () => {
    if (gameState.usedLifelines.phoneAFriend || friendLoading) return;
    setFriendLoading(true);

    setTimeout(() => {
      const correct = currentQuestion.correctAnswer;
      const num = gameState.currentQuestion + 1;
      let accuracy;
      if (num <= 5) accuracy = 0.8 + Math.random() * 0.1;
      else if (num <= 10) accuracy = 0.6 + Math.random() * 0.15;
      else accuracy = 0.4 + Math.random() * 0.2;

      let suggestion;
      let confidence;
      if (Math.random() < accuracy) {
        suggestion = correct;
        confidence = Math.random() < 0.7 ? 'confident' : 'pretty sure';
      } else {
        const wrongs = [0, 1, 2, 3].filter(i => i !== correct);
        suggestion = wrongs[Math.floor(Math.random() * wrongs.length)];
        confidence = Math.random() < 0.5 ? 'not sure' : 'think';
      }

      setGameState(prev => ({
        ...prev,
        usedLifelines: { ...prev.usedLifelines, phoneAFriend: true },
        friendSuggestion: suggestion,
        friendConfidence: confidence,
      }));
      setFriendLoading(false);
    }, 2000);
  };

   if (gameState.gameStatus === 'won') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gradient-to-r from-millionaire-gold to-millionaire-orange p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-millionaire-purple" />
          <h1 className="text-3xl font-bold text-millionaire-purple mb-4">
            {gameState.score === questions.length - 1 ? 'MILLIONAIRE!' : 'Congratulations!'}
          </h1>
          <p className="text-xl text-millionaire-purple mb-6">
            You won: ${PRIZE_LEVELS[gameState.score]?.toLocaleString() || '0'}
          </p>
          <button
            onClick={onGameEnd}
            className="millionaire-button w-full"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gameState.gameStatus === 'lost') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-4">Game Over!</h1>
          <p className="text-xl text-white mb-6">
            You won: ${PRIZE_LEVELS[gameState.score]?.toLocaleString() || '0'}
          </p>
          <button
            onClick={onGameEnd}
            className="millionaire-button w-full"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-millionaire-gold">
            Who Wants to Be a Millionaire?
          </h1>
          <button
            onClick={onGameEnd}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Menu
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-millionaire-blue to-millionaire-purple p-6 rounded-xl shadow-2xl mb-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Question {gameState.currentQuestion + 1} of {questions.length}
              </h2>
              <p className="text-lg text-white mb-6">{currentQuestion.question}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isEliminated = gameState.eliminatedOptions.includes(index);
                  const isSelected = gameState.selectedAnswer === index;
                  const isCorrect = gameState.showAnswer && index === currentQuestion.correctAnswer;
                  const isIncorrect = gameState.showAnswer && isSelected && index !== currentQuestion.correctAnswer;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isEliminated || gameState.showAnswer}
                      className={`answer-button ${
                        isSelected ? 'selected' : ''
                      } ${isCorrect ? 'correct' : ''} ${
                        isIncorrect ? 'incorrect' : ''
                      } ${isEliminated ? 'opacity-30' : ''}`}
                    >
                      <span className="font-bold mr-2">
                        {String.fromCharCode(65 + index)}:
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleFinalAnswer}
                disabled={gameState.selectedAnswer === null || gameState.showAnswer}
                className="millionaire-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Final Answer
              </button>
              <button
                onClick={handleWalkAway}
                disabled={gameState.showAnswer}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Walk Away
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lifelines */}
            <div className="bg-gradient-to-r from-millionaire-purple to-millionaire-blue p-4 rounded-xl shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Lifelines</h3>
              <div className="space-y-3">
                <button
                  onClick={useFiftyFifty}
                  disabled={gameState.usedLifelines.fiftyFifty || gameState.showAnswer}
                  className="lifeline-button w-full flex items-center justify-center gap-2"
                >
                  <Scissors className="w-5 h-5" />
                  50:50
                </button>
                <button
                  onClick={useAskAudience}
                  disabled={gameState.usedLifelines.askAudience || gameState.showAnswer}
                  className="lifeline-button w-full flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Ask Audience
                </button>
                <button
                  onClick={usePhoneAFriend}
                  disabled={gameState.usedLifelines.phoneAFriend || gameState.showAnswer}
                  className="lifeline-button w-full flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Phone a Friend
                </button>
              </div>
            </div>
            {audienceLoading && (
              <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-xl shadow-xl text-center text-white animate-pulse">
                Meminta pendapat audiens...
              </div>
            )}
            {gameState.audienceVotes && (
              <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Audience Says:</h3>
                <div className="space-y-2">
                  {gameState.audienceVotes.map((votes, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-white font-bold w-6">
                        {String.fromCharCode(65 + index)}:
                      </span>
                      <div className="flex-1 bg-white bg-opacity-20 rounded-full h-4">
                        <div
                          className="bg-white h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${votes}%` }}
                        />
                      </div>
                      <span className="text-white text-sm w-8">{votes}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white mt-2 opacity-75">
                  Remember: The audience can be wrong too!
                </p>
              </div>
            )}

            {/* Friend Suggestion */}
            {friendLoading && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-xl shadow-xl text-center text-white animate-pulse">
                Menghubungi teman...
              </div>
            )}
            {gameState.friendSuggestion !== undefined && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-2">Friend Says:</h3>
                <p className="text-white mb-2">
                  {gameState.friendConfidence === 'confident' && 
                    `"I'm confident it's ${String.fromCharCode(65 + gameState.friendSuggestion)}!"`
                  }
                  {gameState.friendConfidence === 'pretty sure' && 
                    `"I'm pretty sure it's ${String.fromCharCode(65 + gameState.friendSuggestion)}."`
                  }
                  {gameState.friendConfidence === 'think' && 
                    `"I think it might be ${String.fromCharCode(65 + gameState.friendSuggestion)}, but I'm not certain."`
                  }
                  {gameState.friendConfidence === 'not sure' && 
                    `"I'm really not sure, but maybe ${String.fromCharCode(65 + gameState.friendSuggestion)}?"`
                  }
                </p>
                <p className="text-xs text-white opacity-75">
                  Your friend might be wrong - use your judgment!
                </p>
              </div>
            )}

            {/* Prize Ladder */}
            <div className="bg-gradient-to-r from-millionaire-gold to-millionaire-orange p-4 rounded-xl shadow-xl">
              <h3 className="text-lg font-bold text-black mb-4">Prize Ladder</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {PRIZE_LEVELS.slice().reverse().map((prize, index) => {
                  const actualIndex = PRIZE_LEVELS.length - 1 - index;
                  const isCurrent = actualIndex === gameState.currentQuestion;
                  const isPassed = actualIndex < gameState.currentQuestion;
                  const isSafe = SAFE_LEVELS.includes(actualIndex);
                  
                  return (
                    <div
                      key={actualIndex}
                      className={`prize-level text-sm ${
                        isCurrent ? 'current' : isPassed ? 'safe' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{actualIndex + 1}.</span>
                        <span className="font-bold">
                          ${prize.toLocaleString()}
                          {isSafe && <span className="ml-1">🛡️</span>}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
