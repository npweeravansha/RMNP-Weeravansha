import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { normalizeSinhalaForTTS } from './sinhalaNormalizer.ts';

dotenv.config();

// Ensure User-Agent header is set to 'aistudio-build' as required
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface TTSRequest {
  text: string;
  voiceName?: string;
  style?: string;
  speed?: number;
  model?: 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts';
  customReplacements?: Record<string, string>;
  voiceCharm?: string;
  addBreaths?: boolean;
}

export async function generateSinhalaTTS(params: TTSRequest) {
  const {
    text,
    voiceName = 'Zephyr',
    style = 'Sweet and melodious Sinhala voice',
    model = 'gemini-3.8-flash-tts',
    customReplacements,
    voiceCharm = 'Sweet, beautiful, and melodious Sri Lankan voice with warm smile',
    addBreaths = true,
  } = params;

  if (!text || text.trim().length === 0) {
    throw new Error('Script text is required');
  }

  // Normalize tricky words, English words, numbers, and insert natural human breathing pauses
  const normalizedText = normalizeSinhalaForTTS(text, customReplacements, addBreaths);

  // Highly refined director prompt for authentic, sweet, and natural Sri Lankan speech
  const speechStyle = `You are a beloved, talented Sri Lankan professional voice actor delivering authentic spoken Sinhala.
Voice quality: ${voiceCharm}. ${style}.
Guidelines for natural and beautiful delivery:
- Speak with a charming, melodious, and very pleasant tone (ඉතා ලස්සන, මිහිරි සහ පැහැදිලි කටහඬක්).
- Keep pronunciation 100% natural to everyday Sri Lankan spoken cadence (ස්වාභාවික කථා බහ).
- Honor breath markers <breath> with soft, natural human breathing.
- Clear short and long vowels (අ, ආ, ඇ, ඈ, ඉ, ඊ, එ, ඒ, ඔ, ඕ).
- No robotic monotony or foreign accent. Warm, engaging, and captivating.`;

  const targetModel = model || 'gemini-3.8-flash-tts';

  const response = await ai.models.generateContent({
    model: targetModel,
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: normalizedText,
            speechMetadata: {
              style: speechStyle,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voiceName || 'Zephyr',
          },
        },
      },
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  const audioData = part?.inlineData?.data;

  if (!audioData) {
    throw new Error('No audio returned from Gemini TTS engine');
  }

  return {
    audioBase64: audioData,
    mimeType: part.inlineData?.mimeType || 'audio/wav',
    voiceName,
    textLength: text.length,
    normalizedText,
    modelUsed: targetModel,
  };
}

export async function enhanceSinhalaScript(params: {
  action: 'improve' | 'generate' | 'add_pauses' | 'singlish' | 'make_spoken' | 'fix_pronunciation' | 'make_melodious';
  text?: string;
  prompt?: string;
  style?: string;
}) {
  const { action, text = '', prompt = '', style = 'narration' } = params;

  let systemInstruction = `You are an award-winning Sri Lankan voice director and Sinhala dialogue writer.
Your job is to transform scripts into irresistibly beautiful, natural, and melodious spoken Sinhala (ඉතා ලස්සන, ස්වාභාවික කථා බහ කරන සිංහල).
Rules:
- Eliminate stiff bookish formal Sinhala (e.g. change "පිළිබඳවයි" -> "ගැන තමයි", "කරනු ලැබේ" -> "කරනවා", "නොවේ" -> "නෙවෙයි", "පැමිණියේය" -> "ආවා").
- Use words that roll off the tongue effortlessly and sound melodic when spoken by a voice actor.
- Respell English words in Sinhala phonetics (e.g. YouTube -> යූ ටියුබ්, AI -> ඒ අයි, Video -> වීඩියෝ).
- Spell out numbers in Sinhala words (e.g. 5 -> පහ).
- Add natural comma pauses and <breath> tags where the speaker naturally takes a breath.
- Return ONLY the clean, ready-to-speak Sinhala text without markdown formatting or code blocks.`;

  let userPrompt = '';

  if (action === 'make_melodious' || action === 'make_spoken') {
    userPrompt = `Rewrite this script to sound extremely beautiful, sweet, and naturally spoken (ඉතා මිහිරි, ලස්සන සහ ස්වාභාවික සිංහල කථනය).
Make the sentences flow with gentle rhythm and melody. Insert <breath> tags for natural pauses.
Original text:
${text}`;
  } else if (action === 'fix_pronunciation') {
    userPrompt = `Review this Sinhala text and ensure all words, English terms, and numbers are phonetically written in pure, smooth spoken Sinhala so the voice actor pronounces every word flawlessly:
${text}`;
  } else if (action === 'singlish') {
    systemInstruction = `You are a specialist in converting Singlish into beautiful spoken Sinhala unicode. Return ONLY the converted Sinhala text.`;
    userPrompt = `Convert this Singlish text to natural Sinhala:\n\n${text || prompt}`;
  } else if (action === 'add_pauses') {
    userPrompt = `Add natural comma pauses and <breath> tags to this Sinhala script so the voice speaks at a relaxed, beautiful human pace without rushing:\n\n${text}`;
  } else if (action === 'improve') {
    userPrompt = `Enhance the flow, emotion, and elegance of this Sinhala script for a ${style} voiceover:\n\n${text}`;
  } else {
    userPrompt = `Write a charming, beautiful, and captivating spoken Sinhala voiceover script (${style}) on this topic:
"${prompt || text}"
Length: 70-120 words. Use natural spoken Sinhala words.`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: userPrompt,
    config: {
      systemInstruction,
      temperature: 0.65,
    },
  });

  return {
    result: response.text?.trim() || '',
  };
}
