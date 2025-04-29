import type { APIRoute } from 'astro';

// Mark this route as server-side only
export const prerender = false;

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

export const GET: APIRoute = async ({ url }) => {
  const count = parseInt(url.searchParams.get('count') || '10', 10);
  
  try {
    const hsk1Words = await readCSV('https://raw.githubusercontent.com/plaktos/hsk_csv/refs/heads/master/hsk1.csv');
    const hsk2Words = await readCSV('https://raw.githubusercontent.com/plaktos/hsk_csv/refs/heads/master/hsk2.csv');
    const allWords = [...hsk1Words, ...hsk2Words];
    
    // Use Fisher-Yates shuffle for better randomization
    const shuffled = shuffleArray(allWords);
    const selectedWords = shuffled.slice(0, count);
    
    return new Response(
      JSON.stringify(selectedWords),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Prevent caching to ensure we get fresh random results each time
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching random words:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch random words' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        } 
      }
    );
  }
}; 