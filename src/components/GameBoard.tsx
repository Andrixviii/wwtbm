'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Question, GameState, PRIZE_LEVELS, SAFE_LEVELS } from '../types/game';
import FuzzyText from '../components/ui/fuzzyText';
import Loader from '../components/ui/Loader';
import {
  Phone, Users, Scissors, Trophy, Home, BookOpen, Scroll, Crown,
  Castle, Clock, Award, History, Globe, Flame, Target, PhoneCall,
  AlertCircle, CheckCircle, XCircle, Eye, EyeOff, Coins
} from 'lucide-react';

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
  const [showMobileLifelines, setShowMobileLifelines] = useState(false);
  const [showMobilePrizes, setShowMobilePrizes] = useState(false);
  const [pulseAnswer, setPulseAnswer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (gameState.selectedAnswer !== null) {
      setPulseAnswer(true);
      setTimeout(() => setPulseAnswer(false), 1000);
    }
  }, [gameState.selectedAnswer]);

  useEffect(() => {
    audioRef.current = new Audio('/sfx/game-board.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;

    audioRef.current.play().catch(() => {
    });

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  if (!showContent || loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
       <Loader />
      </div>
    );
  }

  if (!questions.length) {
    return <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>404</FuzzyText>
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

  // WIN SCREEN
  if (gameState.gameStatus === 'won') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border-2 border-amber-400 relative">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center animate-bounce">
            <Crown className="w-6 h-6 text-amber-900" />
          </div>
          <Trophy className="w-20 h-20 mx-auto mb-6 text-amber-900 animate-pulse" />
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            {gameState.score === questions.length - 1 ? 'JAGOAN SEJARAH' : 'Congratulations!'}
          </h1>
          <p className="text-2xl text-amber-900 mb-6 font-semibold">
            Kamu Mendapatkan: ${PRIZE_LEVELS[gameState.score]?.toLocaleString() || '0'}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Award className="w-6 h-6 text-amber-900" />
            <span className="text-amber-900 font-medium">Kamu adalah Jagoan Sejarah, Semoga ilmu yang kamu dapatkan bermanfaat!</span>
          </div>
          <button
            onClick={onGameEnd}
            className="w-full bg-amber-800 hover:bg-amber-700 text-amber-100 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <History className="w-5 h-5" />
              <span>Main Lagi</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // LOSS SCREEN
  if (gameState.gameStatus === 'lost') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-900 via-orange-900 to-amber-900">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border-2 border-red-400 relative">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-red-400 rounded-full flex items-center justify-center animate-pulse">
            <XCircle className="w-6 h-6 text-red-900" />
          </div>
          <AlertCircle className="w-20 h-20 mx-auto mb-6 text-red-100 animate-pulse" />
          <h1 className="text-4xl font-bold text-red-100 mb-4">Game Over!</h1>
          <p className="text-2xl text-red-100 mb-6 font-semibold">
            Kamu Mendapatkan: ${PRIZE_LEVELS[gameState.score]?.toLocaleString() || '0'}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Scroll className="w-6 h-6 text-red-100" />
            <span className="text-red-100 font-medium">Coba lagi lain kali ya!</span>
          </div>
          <button
            onClick={onGameEnd}
            className="w-full bg-red-800 hover:bg-red-700 text-red-100 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <History className="w-5 h-5" />
              <span>Main Lagi</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // MAIN GAME UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 p-2 md:p-4">
      {/* Floating historical elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <Scroll className="absolute top-10 left-10 w-8 h-8 text-amber-400 animate-pulse" />
        <Crown className="absolute top-20 right-20 w-6 h-6 text-orange-400 animate-bounce" style={{animationDelay: '1s'}} />
        <Castle className="absolute bottom-20 left-20 w-10 h-10 text-red-400 animate-pulse" style={{animationDelay: '2s'}} />
        <Globe className="absolute bottom-10 right-10 w-7 h-7 text-amber-400 animate-spin" style={{animationDuration: '10s'}} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6 bg-gradient-to-r from-amber-800/50 to-orange-800/50 backdrop-blur-sm rounded-xl p-4 border border-amber-600/30">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
            <h1 className="font-millionaire text-lg md:text-2xl font-bold text-amber-100">
              Jagoan Sejarah
            </h1>
          </div>
          <button
            onClick={onGameEnd}
            className="flex items-center gap-2 bg-red-700/80 hover:bg-red-600 text-amber-100 px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Menu</span>
          </button>
        </div>

        {/* Mobile Lifelines Toggle */}
        <div className="md:hidden mb-4 flex gap-2">
          <button
            onClick={() => setShowMobileLifelines(!showMobileLifelines)}
            className="flex-1 bg-gradient-to-r from-purple-700 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Flame className="w-5 h-5" />
            Bantuan
            {showMobileLifelines ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowMobilePrizes(!showMobilePrizes)}
            className="flex-1 bg-gradient-to-r from-orange-700 to-red-700 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Coins className="w-5 h-5" />
            Hadiah Utama
            {showMobilePrizes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Question Area */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-gradient-to-r from-amber-800/60 to-orange-800/60 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-2xl mb-4 md:mb-6 border-2 border-amber-600/30 relative">
              <div className="absolute top-3 left-3 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-3 w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Scroll className="w-6 h-6 text-amber-400" />
                  <h2 className="text-lg md:text-xl font-bold text-amber-100">
                    Pertanyaan {gameState.currentQuestion + 1} dari {questions.length}
                  </h2>
                </div>
                {/* Timer (dummy, bisa diisi logic timer jika mau) */}
                {/* <div className="flex items-center gap-2 bg-amber-700/50 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span className="text-amber-300 text-sm font-medium">{timeLeft}s</span>
                </div> */}
              </div>
              
              <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 p-4 md:p-6 rounded-xl border border-amber-600/20 mb-6">
                <p className="text-base md:text-lg text-amber-100 leading-relaxed font-medium">
                  {currentQuestion.question}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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
                      className={`
                        relative p-4 md:p-6 rounded-xl font-medium text-left transition-all duration-300 transform hover:scale-105 border-2
                        ${isSelected && !gameState.showAnswer ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 text-white shadow-lg shadow-blue-500/50' : ''}
                        ${isCorrect ? 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-400 text-white shadow-lg shadow-green-500/50' : ''}
                        ${isIncorrect ? 'bg-gradient-to-r from-red-600 to-rose-600 border-red-400 text-white shadow-lg shadow-red-500/50' : ''}
                        ${!isSelected && !gameState.showAnswer && !isEliminated ? 'bg-gradient-to-r from-amber-700/60 to-orange-700/60 border-amber-600/30 text-amber-100 hover:border-amber-400/50 hover:shadow-lg' : ''}
                        ${isEliminated ? 'opacity-30 cursor-not-allowed bg-gray-800/50 border-gray-600' : ''}
                        ${pulseAnswer && isSelected ? 'animate-pulse' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base
                          ${isCorrect ? 'bg-green-500' : isIncorrect ? 'bg-red-500' : isSelected ? 'bg-blue-500' : 'bg-amber-600'}
                        `}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm md:text-base flex-1">{option}</span>
                      </div>
                      {isCorrect && (
                        <CheckCircle className="absolute top-2 right-2 w-6 h-6 text-green-300" />
                      )}
                      {isIncorrect && (
                        <XCircle className="absolute top-2 right-2 w-6 h-6 text-red-300" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
              <button
                onClick={handleFinalAnswer}
                disabled={gameState.selectedAnswer === null || gameState.showAnswer}
                className="flex-1 md:flex-none bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Jawaban Akhir</span>
              </button>
              <button
                onClick={handleWalkAway}
                disabled={gameState.showAnswer}
                className="flex-1 md:flex-none bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                <span>Mundur</span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className={`space-y-4 order-1 lg:order-2 ${showMobileLifelines || showMobilePrizes ? 'block' : 'hidden'} md:block`}>
            {/* Lifelines */}
            <div className={`bg-gradient-to-br from-purple-800/60 to-blue-800/60 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl border-2 border-purple-600/30 relative ${!showMobileLifelines ? 'hidden md:block' : ''}`}>
              <div className="absolute top-3 left-3 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                <h3 className="text-base md:text-lg font-bold text-purple-100">Bantuan</h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={useFiftyFifty}
                  disabled={gameState.usedLifelines.fiftyFifty || gameState.showAnswer}
                  className={`w-full p-3 md:p-4 rounded-xl font-medium text-sm md:text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 border-2 ${
                    gameState.usedLifelines.fiftyFifty 
                      ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-red-600 to-pink-600 border-red-500 text-white hover:shadow-lg shadow-red-500/50'
                  }`}
                >
                  <Target className="w-4 h-4 md:w-5 md:h-5" />
                  <span>50:50</span>
                </button>
                
                <button
                  onClick={useAskAudience}
                  disabled={gameState.usedLifelines.askAudience || gameState.showAnswer}
                  className={`w-full p-3 md:p-4 rounded-xl font-medium text-sm md:text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 border-2 ${
                    gameState.usedLifelines.askAudience 
                      ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-500 text-white hover:shadow-lg shadow-green-500/50'
                  }`}
                >
                  <Users className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Bertanya pada Ahli</span>
                </button>
                
                <button
                  onClick={usePhoneAFriend}
                  disabled={gameState.usedLifelines.phoneAFriend || gameState.showAnswer}
                  className={`w-full p-3 md:p-4 rounded-xl font-medium text-sm md:text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 border-2 ${
                    gameState.usedLifelines.phoneAFriend 
                      ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-500 text-white hover:shadow-lg shadow-blue-500/50'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Memanggil Teman</span>
                </button>
              </div>
            </div>

            {/* Audience Loading */}
            {audienceLoading && (
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl shadow-xl text-center text-white animate-pulse border-2 border-green-400">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Consulting audience...</p>
              </div>
            )}

            {/* Audience Votes */}
            {gameState.audienceVotes && (
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl shadow-xl border-2 border-green-400">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Audience Says:</h3>
                </div>
                <div className="space-y-2">
                  {gameState.audienceVotes.map((votes, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-white font-bold w-6 text-center">
                        {String.fromCharCode(65 + index)}:
                      </span>
                      <div className="flex-1 bg-white/20 rounded-full h-3">
                        <div
                          className="bg-white h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${votes}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-medium w-12 text-right">{votes}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/80 mt-3 italic">
                  Audience can be wrong - trust your knowledge!
                </p>
              </div>
            )}

            {/* Friend Loading */}
            {friendLoading && (
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-2xl shadow-xl text-center text-white animate-pulse border-2 border-blue-400">
                <PhoneCall className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Contacting friend...</p>
              </div>
            )}

            {/* Friend Suggestion */}
            {gameState.friendSuggestion !== undefined && (
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-2xl shadow-xl border-2 border-blue-400">
                <div className="flex items-center gap-2 mb-3">
                  <PhoneCall className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Friend Says:</h3>
                </div>
                <div className="bg-blue-800/50 p-3 rounded-lg mb-3">
                  <p className="text-white italic">
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
                </div>
                <p className="text-xs text-white/80 italic">
                  Your friend might be wrong - use your judgment!
                </p>
              </div>
            )}

            {/* Prize Ladder */}
            <div className={`bg-gradient-to-br from-orange-800/60 to-red-800/60 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl border-2 border-orange-600/30 relative ${!showMobilePrizes ? 'hidden md:block' : ''}`}>
              <div className="absolute top-3 left-3 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                <h3 className="text-base md:text-lg font-bold text-orange-100">Hadiah Utama</h3>
              </div>
              
              <div className="space-y-1 max-h-48 md:max-h-64 overflow-y-auto">
                {PRIZE_LEVELS.slice().reverse().map((prize, index) => {
                  const actualIndex = PRIZE_LEVELS.length - 1 - index;
                  const isCurrent = actualIndex === gameState.currentQuestion;
                  const isPassed = actualIndex < gameState.currentQuestion;
                  const isSafe = SAFE_LEVELS.includes(actualIndex);
                  
                  return (
                    <div
                      key={actualIndex}
                      className={`
                        p-2 md:p-3 rounded-lg text-xs md:text-sm transition-all duration-300 border
                        ${isCurrent ? 'bg-gradient-to-r from-amber-600 to-orange-600 border-amber-400 text-white shadow-lg transform scale-105' : ''}
                        ${isPassed ? 'bg-gradient-to-r from-green-700 to-emerald-700 border-green-500 text-green-100' : ''}
                        ${!isCurrent && !isPassed ? 'bg-amber-900/30 border-amber-600/20 text-amber-200' : ''}
                        ${isSafe ? 'border-l-4 border-l-yellow-400' : ''}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{actualIndex + 1}.</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold">
                            ${prize.toLocaleString()}
                          </span>
                          {isSafe && <Castle className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />}
                        </div>
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