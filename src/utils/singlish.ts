/**
 * Sinhala Singlish to Unicode transliterator
 * Fast client-side mapping for common Singlish patterns
 */

const vowels: Record<string, string> = {
  a: 'අ',
  aa: 'ආ',
  A: 'ආ',
  ae: 'ඇ',
  aae: 'ඈ',
  i: 'ඉ',
  ii: 'ඊ',
  ee: 'ඊ',
  I: 'ඊ',
  u: 'උ',
  uu: 'ඌ',
  oo: 'ඌ',
  U: 'ඌ',
  e: 'එ',
  ea: 'ඒ',
  ei: 'ඒ',
  E: 'ඒ',
  ai: 'ඓ',
  o: 'ඔ',
  oe: 'ඕ',
  O: 'ඕ',
  au: 'ඖ',
  ou: 'ඖ',
};

const vowelSigns: Record<string, string> = {
  aa: 'ා',
  A: 'ා',
  aae: 'ෑ',
  ae: 'ැ',
  ii: 'ී',
  ee: 'ී',
  I: 'ී',
  i: 'ි',
  uu: 'ූ',
  oo: 'ූ',
  U: 'ූ',
  u: 'ු',
  ei: 'ේ',
  ea: 'ේ',
  E: 'ේ',
  e: 'ෙ',
  ai: 'ෛ',
  oe: 'ෝ',
  O: 'ෝ',
  o: 'ො',
  au: 'ෞ',
  ou: 'ෞ',
};

const consonants: Record<string, string> = {
  k: 'ක',
  kh: 'ඛ',
  g: 'ග',
  gh: 'ඝ',
  ng: 'ඞ',
  ch: 'ච',
  chh: 'ඡ',
  j: 'ජ',
  jh: 'ඣ',
  ny: 'ඤ',
  t: 'ට',
  th: 'ත',
  T: 'ත',
  d: 'ඩ',
  dh: 'ධ',
  D: 'ද',
  N: 'ණ',
  n: 'න',
  p: 'ප',
  ph: 'ඵ',
  b: 'බ',
  bh: 'භ',
  m: 'ම',
  y: 'ය',
  r: 'ර',
  l: 'ල',
  w: 'ව',
  v: 'ව',
  sh: 'ශ',
  Sh: 'ෂ',
  s: 'ස',
  h: 'හ',
  L: 'ළ',
  f: 'ෆ',
};

export function transliterateSinglishToSinhala(input: string): string {
  if (!input) return '';

  let output = '';
  let i = 0;
  const len = input.length;

  while (i < len) {
    const c1 = input[i];
    const c2 = i + 1 < len ? input.slice(i, i + 2) : '';
    const c3 = i + 2 < len ? input.slice(i, i + 3) : '';

    // Check consonant combinations (3 chars, 2 chars, 1 char)
    let cons = '';
    let consLen = 0;

    if (c3 in consonants) {
      cons = consonants[c3];
      consLen = 3;
    } else if (c2 in consonants) {
      cons = consonants[c2];
      consLen = 2;
    } else if (c1 in consonants) {
      cons = consonants[c1];
      consLen = 1;
    }

    if (cons) {
      i += consLen;
      // Now check following vowel signs
      const v3 = i + 2 < len ? input.slice(i, i + 3) : '';
      const v2 = i + 1 < len ? input.slice(i, i + 2) : '';
      const v1 = i < len ? input[i] : '';

      if (v3 in vowelSigns) {
        output += cons + vowelSigns[v3];
        i += 3;
      } else if (v2 in vowelSigns) {
        output += cons + vowelSigns[v2];
        i += 2;
      } else if (v1 in vowelSigns) {
        output += cons + vowelSigns[v1];
        i += 1;
      } else if (v1 === 'a') {
        // inherently 'a' vowel attached
        output += cons;
        i += 1;
      } else {
        // Hal sign (virama)
        output += cons + '්';
      }
      continue;
    }

    // Check independent vowels
    if (c3 in vowels) {
      output += vowels[c3];
      i += 3;
    } else if (c2 in vowels) {
      output += vowels[c2];
      i += 2;
    } else if (c1 in vowels) {
      output += vowels[c1];
      i += 1;
    } else {
      // Punctuation, space, or other characters
      output += c1;
      i += 1;
    }
  }

  return output;
}
