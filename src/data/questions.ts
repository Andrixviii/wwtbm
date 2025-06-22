import { Question } from '../types/game';

export const QUESTIONS: Question[] = [
  // Easy Questions (1-5)
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "How many legs does a spider have?",
    options: ["6", "8", "10", "12"],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 4,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 5,
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  
  // Medium Questions (6-10)
  {
    id: 6,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 7,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 8,
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 9,
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Nauru", "Vatican City", "San Marino"],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 10,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  
  // Hard Questions (11-15)
  {
    id: 11,
    question: "What is the longest river in the world?",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 12,
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 13,
    question: "In Greek mythology, who is the king of the gods?",
    options: ["Apollo", "Poseidon", "Hades", "Zeus"],
    correctAnswer: 3,
    difficulty: 'hard'
  },
  {
    id: 14,
    question: "What is the speed of light in a vacuum?",
    options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"],
    correctAnswer: 0,
    difficulty: 'hard'
  },
  {
    id: 15,
    question: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Stephen Hawking"],
    correctAnswer: 2,
    difficulty: 'hard'
  }
];