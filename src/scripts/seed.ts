import { sql } from '../../src/lib/db'

async function seed() {
  const questions = [
  {
    question: "What is the capital of France?",
    option_a: "London",
    option_b: "Berlin",
    option_c: "Paris",
    option_d: "Madrid",
    correct_answer: "c", 
    difficulty: 'easy'
  },
  {
    question: "How many legs does a spider have?",
    option_a: "6",
    option_b: "8",
    option_c: "10",
    option_d: "12",
    correct_answer: "b",
    difficulty: 'easy'
  },
  {
    question: "What is 2 + 2?",
    option_a: "3",
    option_b: "4",
    option_c: "5",
    option_d: "6",
    correct_answer: "b",
    difficulty: 'easy'
  },
  {
    question: "Which planet is known as the Red Planet?",
    option_a: "Venus",
    option_b: "Mars",
    option_c: "Jupiter",
    option_d: "Saturn",
    correct_answer: "b",
    difficulty: 'easy'
  },
  {
    question: "What is the largest mammal in the world?",
    option_a: "Elephant",
    option_b: "Blue Whale",
    option_c: "Giraffe",
    option_d: "Hippopotamus",
    correct_answer: "b",
    difficulty: 'easy'
  },

  {
    question: "Who painted the Mona Lisa?",
    option_a: "Vincent van Gogh",
    option_b: "Pablo Picasso",
    option_c: "Leonardo da Vinci",
    option_d: "Michelangelo",
    correct_answer: "c",
    difficulty: 'medium'
  },
  {
    question: "What is the chemical symbol for gold?",
    option_a: "Go",
    option_b: "Gd",
    option_c: "Au",
    option_d: "Ag",
    correct_answer: "c", 
    difficulty: 'medium'
  },
  {
    question: "In which year did World War II end?",
    option_a: "1944",
    option_b: "1945",
    option_c: "1946",
    option_d: "1947",
    correct_answer: "b",
    difficulty: 'medium'
  },
  {
    question: "What is the smallest country in the world?",
    option_a: "Monaco",
    option_b: "Nauru",
    option_c: "Vatican City",
    option_d: "San Marino",
    correct_answer: "c",
    difficulty: 'medium'
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    option_a: "Charles Dickens",
    option_b: "William Shakespeare",
    option_c: "Jane Austen",
    option_d: "Mark Twain",
    correct_answer: "b",
    difficulty: 'medium'
  },

  {
    question: "What is the longest river in the world?",
    option_a: "Amazon River",
    option_b: "Nile River",
    option_c: "Yangtze River",
    option_d: "Mississippi River",
    correct_answer: "b",
    difficulty: 'hard'
  },
  {
    question: "Which element has the atomic number 1?",
    option_a: "Helium",
    option_b: "Hydrogen",
    option_c: "Lithium",
    option_d: "Carbon",
    correct_answer: "b",
    difficulty: 'hard'
  },
  {
    question: "In Greek mythology, who is the king of the gods?",
    option_a: "Apollo",
    option_b: "Poseidon",
    option_c: "Hades",
    option_d: "Zeus",
    correct_answer: "d", 
    difficulty: 'hard'
  },
  {
    question: "What is the speed of light in a vacuum?",
    option_a: "299,792,458 m/s",
    option_b: "300,000,000 m/s",
    option_c: "299,000,000 m/s",
    option_d: "301,000,000 m/s",
    correct_answer: "a",
    difficulty: 'hard'
  },
  {
    question: "Who developed the theory of relativity?",
    option_a: "Isaac Newton",
    option_b: "Galileo Galilei",
    option_c: "Albert Einstein",
    option_d: "Stephen Hawking",
    correct_answer: "c", 
    difficulty: 'hard'
  }

  ]

  for (const q of questions) {
    await sql`
      INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer, difficulty)
      VALUES (${q.question}, ${q.option_a}, ${q.option_b}, ${q.option_c}, ${q.option_d}, ${q.correct_answer}, ${q.difficulty})
    `
  }

}

seed().catch(console.error)
