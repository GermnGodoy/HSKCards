import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

interface Word {
  chinese: string;
  pinyin: string;
  english: string;
}

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
  const hsk1Words = await readCSV('https://raw.githubusercontent.com/plaktos/hsk_csv/refs/heads/master/hsk1.csv');
  const hsk2Words = await readCSV('https://raw.githubusercontent.com/plaktos/hsk_csv/refs/heads/master/hsk2.csv');
  const allWords = [...hsk1Words, ...hsk2Words];
  
  // Shuffle the array and take the first 'count' elements
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 