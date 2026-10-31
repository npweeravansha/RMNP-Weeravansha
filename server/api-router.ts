import type { IncomingMessage, ServerResponse } from 'http';
import { generateSinhalaTTS, enhanceSinhalaScript } from './gemini.ts';

function readJsonBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): Promise<void> {
  const url = req.url || '';

  if (!url.startsWith('/api/')) {
    return next();
  }

  try {
    if (req.method === 'POST' && url.startsWith('/api/tts')) {
      const body = await readJsonBody<{
        text: string;
        voiceName?: string;
        style?: string;
        model?: 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts';
        customReplacements?: Record<string, string>;
        voiceCharm?: string;
        addBreaths?: boolean;
      }>(req);

      if (!body.text || !body.text.trim()) {
        sendJson(res, 400, { error: 'සිංහල script එකක් ඇතුළත් කරන්න (Script text required)' });
        return;
      }

      const result = await generateSinhalaTTS({
        text: body.text,
        voiceName: body.voiceName || 'Zephyr',
        style: body.style || 'Sweet and melodious Sinhala voice',
        model: body.model || 'gemini-3.8-flash-tts',
        customReplacements: body.customReplacements,
        voiceCharm: body.voiceCharm,
        addBreaths: body.addBreaths ?? true,
      });

      sendJson(res, 200, result);
      return;
    }

    if (req.method === 'POST' && url.startsWith('/api/enhance-script')) {
      const body = await readJsonBody<{
        action: 'improve' | 'generate' | 'add_pauses' | 'singlish' | 'make_spoken' | 'fix_pronunciation';
        text?: string;
        prompt?: string;
        style?: string;
      }>(req);

      const result = await enhanceSinhalaScript(body);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === 'GET' && url.startsWith('/api/health')) {
      sendJson(res, 200, {
        status: 'ok',
        time: new Date().toISOString(),
        geminiConfigured: !!process.env.GEMINI_API_KEY,
      });
      return;
    }

    // Unhandled API route
    sendJson(res, 404, { error: 'API endpoint not found' });
  } catch (error: any) {
    console.error('API Error:', error);
    sendJson(res, 500, {
      error: error?.message || 'Server error occurred while processing request',
    });
  }
}
