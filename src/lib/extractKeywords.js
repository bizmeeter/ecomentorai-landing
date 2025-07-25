// lib/extractKeywords.js

const stopwords = [
  "what", "how", "is", "the", "a", "an", "to", "in", "on", "and", "of", "do", "i",
  "can", "should", "for", "with", "about", "my", "you", "your", "me", "we", "it"
];

export const extractKeywords = (text) => {
  if (!text) return [];

  return text
    .toLowerCase()
    .split(/\W+/) // מפריד לפי רווחים, פסיקים, נקודות
    .filter(word => word && !stopwords.includes(word))
    .slice(0, 5); // מחזיר עד 5 מילות מפתח ראשונות
};
