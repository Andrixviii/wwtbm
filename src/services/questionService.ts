import { sql } from '../lib/db';

export async function getQuestionsByDifficulty(difficulty: string) {
  const rows = await sql`
    SELECT * FROM questions
    WHERE difficulty = ${difficulty}
    ORDER BY random()
    LIMIT 5
  `;
  return rows;
}