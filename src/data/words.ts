export const hskWords = [
  { chinese: "爱", pinyin: "ài", english: "to love" },
  { chinese: "八", pinyin: "bā", english: "eight" },
  { chinese: "爸爸", pinyin: "bà ba", english: "father" },
  { chinese: "杯子", pinyin: "bēi zi", english: "cup" },
  { chinese: "北京", pinyin: "Běi jīng", english: "Beijing" },
  // Add more words here from your CSV files
  { chinese: "不", pinyin: "bù", english: "no" },
  { chinese: "不客气", pinyin: "bú kè qi", english: "you're welcome" },
  { chinese: "菜", pinyin: "cài", english: "dish" },
  { chinese: "茶", pinyin: "chá", english: "tea" },
  { chinese: "吃", pinyin: "chī", english: "to eat" },
  // ... add more words as needed
];

export function getRandomWords(count: number) {
  const shuffled = [...hskWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
} 