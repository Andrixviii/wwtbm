import { NextResponse } from 'next/server';
import { getQuestionsByDifficulty } from '../../../services/questionService';

export const runtime = 'nodejs'; 

export async function GET() {
  const easy = await getQuestionsByDifficulty('easy');
  const medium = await getQuestionsByDifficulty('medium');
  const hard = await getQuestionsByDifficulty('hard');

  const result = { easy, medium, hard };
  const response = NextResponse.json(result);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}