import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

interface Word {
  chinese: string;
  pinyin: string;
  english: string;
}

function readCSV(filePath: string): Word[] {
  const fileContent = readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: ['chinese', 'pinyin', 'english'],
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true
  });
  return records;
}

export async function getRandomWords(count: number): Promise<Word[]> {
  const hsk1Words = readCSV('public/hsk1.csv');
  const hsk2Words = readCSV('public/hsk2.csv');
  const allWords = [...hsk1Words, ...hsk2Words];
  
  // Shuffle the array and take the first 'count' elements
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 