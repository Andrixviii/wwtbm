import { NextResponse } from 'next/server';
import { getCache, setCache } from '../../../lib/cache';
import { getQuestionsByDifficulty } from '../../../services/questionService';

export async function GET() {
  const cached = getCache('questions');
  if (cached) {
    return NextResponse.json(cached);
  }

  const easy = await getQuestionsByDifficulty('easy');
  const medium = await getQuestionsByDifficulty('medium');
  const hard = await getQuestionsByDifficulty('hard');

  const result = { easy, medium, hard };
  setCache('questions', result, 60 * 1000);
  return NextResponse.json(result);
}