import { supabase } from './supabaseClient';

/**
 * שליפת טקסט מלא של פרק לפי chapter_number
 */
export async function fetchChapterText(chapterNumber) {
  const { data, error } = await supabase
    .from('chaptersa') // 👈 חשוב: זו הטבלה שלך לפי התמונה
    .select('full_text')
    .eq('chapter_number', chapterNumber)
    .single();

  if (error || !data) return '';
  return data.full_text || '';
}

/**
 * שליפת מילות מפתח רשמיות מהטבלה (לא חובה – לשלב 2)
 */
export async function fetchKeywords() {
  const { data, error } = await supabase.from('keywords').select('*');
  if (error || !data) return [];
  return data.map(k => k.keyword.toLowerCase());
}

/**
 * חיפוש פסקה מהספר לפי מילות מפתח מתוך תשובה/שאלה
 */
export function matchKeyword(text, chapterText) {
  if (!text || !chapterText) return null;

  const paragraphs = chapterText
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);

  for (const word of words) {
    const found = paragraphs.find(p => p.toLowerCase().includes(word));
    if (found) return `📘 From the book:\n${found}`;
  }

  return null; // לא נמצאה התאמה
}
