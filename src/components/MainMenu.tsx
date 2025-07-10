'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Info, Scroll, Flame, Crown, MapPin, Users, Phone, Target, Shield, Zap, ChevronRight, Award, Gem, History, Globe, Sword, Castle, Clock, Star } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [showRules, setShowRules] = useState(false);
  const [showPrizes, setShowPrizes] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{x: number, y: number, delay: number, icon: string}>>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    
    const icons = ['scroll', 'crown', 'sword', 'castle', 'globe'];
    const elements = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      icon: icons[Math.floor(Math.random() * icons.length)]
    }));
    setFloatingElements(elements);
  }, []);

  const prizes = [
    { level: 15, amount: '$1,000,000', safe: true, color: 'text-amber-400' },
    { level: 14, amount: '$500,000', safe: false, color: 'text-amber-300' },
    { level: 13, amount: '$250,000', safe: false, color: 'text-yellow-400' },
    { level: 12, amount: '$125,000', safe: false, color: 'text-yellow-300' },
    { level: 11, amount: '$64,000', safe: false, color: 'text-orange-400' },
    { level: 10, amount: '$32,000', safe: true, color: 'text-orange-300' },
    { level: 9, amount: '$16,000', safe: false, color: 'text-red-400' },
    { level: 8, amount: '$8,000', safe: false, color: 'text-red-300' },
    { level: 7, amount: '$4,000', safe: false, color: 'text-pink-400' },
    { level: 6, amount: '$2,000', safe: false, color: 'text-pink-300' },
    { level: 5, amount: '$1,000', safe: true, color: 'text-purple-400' },
    { level: 4, amount: '$500', safe: false, color: 'text-purple-300' },
    { level: 3, amount: '$300', safe: false, color: 'text-blue-400' },
    { level: 2, amount: '$200', safe: false, color: 'text-blue-300' },
    { level: 1, amount: '$100', safe: false, color: 'text-cyan-400' }
  ];

  const lifelines = [
    { icon: Target, name: '50:50', description: 'Eliminate 2 wrong answers' },
    { icon: Users, name: 'Ask Historian', description: 'Consult historical expert' },
    { icon: Phone, name: 'Call Scholar', description: 'Contact academic friend' }
  ];

  const renderFloatingIcon = (iconName: string) => {
    const iconProps = "w-6 h-6 text-amber-600/30";
    switch(iconName) {
      case 'scroll': return <Scroll className={iconProps} />;
      case 'crown': return <Crown className={iconProps} />;
      case 'sword': return <Sword className={iconProps} />;
      case 'castle': return <Castle className={iconProps} />;
      case 'globe': return <Globe className={iconProps} />;
      default: return <Scroll className={iconProps} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-yellow-200 to-amber-200 mix-blend-overlay"></div>
      
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 bg-gradient-radial from-amber-400/30 to-transparent rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-gradient-radial from-orange-500/30 to-transparent rounded-full blur-3xl top-1/2 -right-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-64 h-64 bg-gradient-radial from-red-500/30 to-transparent rounded-full blur-3xl bottom-0 left-1/2 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating Historical Elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className="absolute animate-float opacity-40"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: '6s'
          }}
        >
          {renderFloatingIcon(element.icon)}
        </div>
      ))}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center">
          {/* Logo/Title Section */}
          <div className="mb-12 relative">
            <div className="relative inline-block">
              <BookOpen className="w-24 h-24 mx-auto mb-6 text-amber-400 animate-pulse" style={{animationDuration: '3s'}} />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400 rounded-full animate-ping opacity-75" style={{animationDelay: '0.5s'}}></div>
            </div>
            
            <div className="space-y-2 mb-6">
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Who Wants to Be a
              </h1>
              <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent relative">
                HISTORY MASTER?
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full opacity-20 animate-ping"></div>
              </h1>
            </div>
            
            <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-amber-600/30 shadow-2xl max-w-2xl mx-auto relative">
              <div className="absolute top-2 left-2 w-3 h-3 bg-amber-400 rounded-full opacity-60"></div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-orange-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-red-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-amber-400 rounded-full opacity-60"></div>
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <History className="w-8 h-8 text-amber-400 animate-spin" style={{animationDuration: '8s'}} />
                <p className="text-xl md:text-2xl text-amber-100 font-semibold">
                  Test your knowledge of world history and win $1,000,000!
                </p>
                <Clock className="w-8 h-8 text-orange-400 animate-pulse" />
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-amber-200/80">
                <div className="flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-amber-400" />
                  <span>15 Historical Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span>3 Safe Checkpoints</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-400" />
                  <span>3 Scholar Helps</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Action Button */}
          <div className="mb-8">
            <button
              onClick={onStartGame}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xl md:text-2xl py-6 px-12 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-amber-600/50 active:scale-95 border-2 border-amber-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-4">
                <Play className={`w-8 h-8 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
                <span className="tracking-wide">BEGIN HISTORICAL JOURNEY</span>
                <ChevronRight className={`w-8 h-8 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-300 rounded-full animate-ping opacity-75"></div>
            </button>
          </div>

          {/* Menu Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* How to Play */}
            <div className="bg-gradient-to-br from-amber-800/40 to-orange-800/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-amber-600/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative">
              <div className="absolute top-3 left-3 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              
              <button 
                onClick={() => setShowRules(!showRules)}
                className="w-full flex items-center justify-between mb-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <Scroll className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl font-bold text-amber-100">Rules of the Quest</h3>
                </div>
                <ChevronRight className={`w-5 h-5 text-amber-100 transition-transform duration-300 ${showRules ? 'rotate-90' : ''}`} />
              </button>
              
              {showRules && (
                <div className="space-y-3 text-amber-200/90 text-left animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <p>Answer 15 historical questions correctly to claim victory</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <p>Each correct answer advances you through time periods</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <p>Use 3 scholarly lifelines when knowledge fails you</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <p>Safe checkpoints protect your historical treasures</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                    <p>Withdraw anytime to preserve your accumulated knowledge</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                    <p>One wrong answer erases progress (except at safe levels)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Prize Structure */}
            <div className="bg-gradient-to-br from-orange-800/40 to-red-800/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-600/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative">
              <div className="absolute top-3 left-3 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              
              <button 
                onClick={() => setShowPrizes(!showPrizes)}
                className="w-full flex items-center justify-between mb-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-amber-100">Treasure Rewards</h3>
                </div>
                <ChevronRight className={`w-5 h-5 text-amber-100 transition-transform duration-300 ${showPrizes ? 'rotate-90' : ''}`} />
              </button>
              
              {showPrizes && (
                <div className="space-y-2 max-h-64 overflow-y-auto animate-in slide-in-from-top duration-300">
                  {prizes.map((prize, index) => (
                    <div key={prize.level} className={`flex items-center justify-between p-3 rounded-lg bg-amber-900/30 border border-amber-600/20 hover:bg-amber-900/50 transition-all duration-200 ${prize.safe ? 'bg-orange-600/30 border-orange-500/40' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-200/60 text-sm w-6">{prize.level}.</span>
                        <span className={`font-bold ${prize.color}`}>{prize.amount}</span>
                      </div>
                      {prize.safe && (
                        <div className="flex items-center gap-1">
                          <Castle className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-400 text-xs">SAFE</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Lifelines Preview */}
          <div className="bg-gradient-to-r from-red-800/40 to-amber-800/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-600/30 shadow-xl relative">
            <div className="absolute top-3 left-3 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <div className="absolute top-3 right-3 w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-amber-100">Scholar's Assistance</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {lifelines.map((lifeline, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-red-600/30 to-amber-600/30 rounded-xl p-4 mb-2 border-2 border-red-500/30 group-hover:border-red-400/50 transition-all duration-300">
                    <lifeline.icon className="w-8 h-8 mx-auto text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                  </div>
                  <h4 className="text-amber-100 font-semibold text-sm">{lifeline.name}</h4>
                  <p className="text-amber-200/60 text-xs mt-1">{lifeline.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MainMenu;