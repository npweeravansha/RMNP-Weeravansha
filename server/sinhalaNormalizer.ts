/**
 * Normalizes Sinhala text for Text-to-Speech synthesis
 * - Converts English loanwords and acronyms to smooth Sinhala phonetics
 * - Converts numbers and symbols into spoken Sinhala words
 * - Adjusts punctuation and inserts natural human <breath> pauses for lifelike cadence
 * - Eliminates stiff bookish suffixes that cause robotic pronunciation
 */

const ENGLISH_LOANWORDS: Record<string, string> = {
  ai: 'ඒ අයි',
  'a.i': 'ඒ අයි',
  'a.i.': 'ඒ අයි',
  youtube: 'යූ ටියුබ්',
  video: 'වීඩියෝ',
  videos: 'වීඩියෝ',
  like: 'ලයික්',
  subscribe: 'සබ්ස්ක්‍රයිබ්',
  share: 'ශෙයාර්',
  comment: 'කොමෙන්ට්',
  facebook: 'ෆේස්බුක්',
  tiktok: 'ටික්ටොක්',
  whatsapp: 'වට්ස්ඇප්',
  google: 'ගූගල්',
  internet: 'ඉන්ටර්නෙට්',
  online: 'ඔන්ලයින්',
  channel: 'චැනල්',
  link: 'ලින්ක්',
  app: 'ඇප්',
  apps: 'ඇප්ස්',
  website: 'වෙබ්සයිට්',
  phone: 'ෆෝන්',
  mobile: 'මොබයිල්',
  computer: 'පරිගණක',
  laptop: 'ලැප්ටොප්',
  podcast: 'පොඩ්කාස්ට්',
  post: 'පෝස්ට්',
  notification: 'නොටිෆිකේෂන්',
  bell: 'බෙල්',
  click: 'ක්ලික්',
};

const SINHALA_NUMBERS: Record<string, string> = {
  '0': 'බිංදුව',
  '1': 'එක',
  '2': 'දෙක',
  '3': 'තුන',
  '4': 'හතර',
  '5': 'පහ',
  '6': 'හය',
  '7': 'හත',
  '8': 'අට',
  '9': 'නවය',
  '10': 'දහය',
  '11': 'එකොළහ',
  '12': 'දොළහ',
  '13': 'දහතුන',
  '14': 'දාහතර',
  '15': 'පහළොව',
  '16': 'දහසය',
  '17': 'දාහත',
  '18': 'දහඅට',
  '19': 'දහනවය',
  '20': 'විස්ස',
  '25': 'විසිපහ',
  '50': 'පනහ',
  '100': 'සීය',
  '500': 'පන්සීය',
  '1000': 'දාහ',
  '2024': 'දෙදහස් විසි හතර',
  '2025': 'දෙදහස් විසි පහ',
  '2026': 'දෙදහස් විසි හය',
  '2027': 'දෙදහස් විසි හත',
};

// Formal written phrases that sound awkward when read by TTS, with natural spoken equivalents
const SPOKEN_PHONETIC_SMOOTHERS: [RegExp, string][] = [
  [/පිළිබඳවයි\b/g, 'ගැන තමයි'],
  [/පිළිබඳව\b/g, 'ගැන'],
  [/පිළිබඳ\b/g, 'ගැන'],
  [/වෙත ගෙන එනු ලබන\b/g, 'ගෙනෙන'],
  [/කරනු ලබන්නේය\b/g, 'කරන්නේ'],
  [/කරනු ලැබේ\b/g, 'කරනවා'],
  [/නොවේ\b/g, 'නෙවෙයි'],
  [/නැත\b/g, 'නෑ'],
  [/පැමිණියේය\b/g, 'ආවා'],
  [/යන්නේය\b/g, 'යනවා'],
  [/සඳහා වන\b/g, 'සඳහා'],
  [/මෙසේය\b/g, 'මෙහෙමයි'],
  [/කෙසේද යත්\b/g, 'කොහොමද කිව්වොත්'],
];

export function normalizeSinhalaForTTS(
  text: string,
  customReplacements?: Record<string, string>,
  addHumanBreaths: boolean = true
): string {
  if (!text) return '';

  let normalized = text;

  // 1. Custom user replacements first
  if (customReplacements) {
    for (const [key, replacement] of Object.entries(customReplacements)) {
      if (key && replacement) {
        const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        normalized = normalized.replace(new RegExp(escaped, 'gi'), replacement);
      }
    }
  }

  // 2. English loanwords / acronyms
  for (const [eng, sinhala] of Object.entries(ENGLISH_LOANWORDS)) {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    normalized = normalized.replace(regex, sinhala);
  }

  // 3. Known spoken phonetic smoothers
  for (const [pattern, replacement] of SPOKEN_PHONETIC_SMOOTHERS) {
    normalized = normalized.replace(pattern, replacement);
  }

  // 4. Standalone numbers
  for (const [num, word] of Object.entries(SINHALA_NUMBERS)) {
    const regex = new RegExp(`\\b${num}\\b`, 'g');
    normalized = normalized.replace(regex, word);
  }

  // 5. Replace percentage symbol % with spoken Sinhala
  normalized = normalized.replace(/(\d+)\s*%/g, '$1%').replace(/%/g, ' සියයට ');

  // 6. Ensure commas have clean breathing pauses and no double punctuation
  normalized = normalized
    .replace(/,{2,}/g, ',')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\.{3,}/g, '... ')
    .replace(/\s+/g, ' ')
    .trim();

  // 7. Insert natural human breath pauses `<breath>` between major sentences if not already present
  if (addHumanBreaths && !normalized.includes('<breath>')) {
    // Add breath after sentence terminators (periods/exclamations) followed by space, but not at the very end
    normalized = normalized.replace(/([.!?])\s+(?=[^\s])/g, '$1 <breath> ');
  }

  return normalized;
}
