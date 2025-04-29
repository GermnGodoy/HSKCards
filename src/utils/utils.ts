import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

interface Word {
  chinese: string;
  pinyin: string;
  english: string;
}

// Allow us to determine if we're in development or production
const isDevelopment = process.env.NODE_ENV === 'development';

async function readCSV(filePath: string): Promise<Word[]> {
  const response = await fetch(filePath);
  const text = await response.text();
  
  return text
    .trim()
    .split('\n')
    .map(line => {
      const [chinese, pinyin, english] = line.split(',');
      return { chinese, pinyin, english: english.replace(/"/g, '') };
    });
}

export async function getRandomWords(count: number): Promise<Word[]> {
  // In development mode, we might want to avoid extra network requests
  // by using the direct approach
  if (isDevelopment) {
    const hsk1Words = await readCSV('https://raw.githubusercontent.com/plaktos/hsk_csv/refs/heads/master/hsk1.csv');
    const hsk2Words = await readCSV('https://raw.githubusercontent.com/plaktos/hsk_csv/refs/heads/master/hsk2.csv');
    const allWords = [...hsk1Words, ...hsk2Words];
    
    // Use a better randomization method
    return shuffleArray(allWords).slice(0, count);
  }
  
  // In production, use the API endpoint for better randomization
  try {
    // Use relative URL in production to avoid CORS issues
    const apiUrl = `/api/random-words?count=${count}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching random words from API:', error);
    // Fallback to local method if API call fails
    const hsk1Words = await readCSV('https://raw.githubusercontent.com/plaktos/hsk_csv/refs/heads/master/hsk1.csv');
    const hsk2Words = await readCSV('https://raw.githubusercontent.com/plaktos/hsk_csv/refs/heads/master/hsk2.csv');
    const allWords = [...hsk1Words, ...hsk2Words];
    
    return shuffleArray(allWords).slice(0, count);
  }
}

// Fisher-Yates (aka Knuth) shuffle algorithm - much better randomization than Math.random() sort
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
} 