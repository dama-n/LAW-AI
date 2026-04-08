import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function lawAiGroqProxyPlugin() {
  return {
    name: 'law-ai-groq-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/legal-ai', async (req: any, res: any, next: any) => {
        try {
          if (req.method !== 'POST') return next();

          const chunks: Buffer[] = [];
          req.on('data', (c: Buffer) => chunks.push(c));
          await new Promise<void>((resolve, reject) => {
            req.on('end', resolve);
            req.on('error', reject);
          });

          const raw = Buffer.concat(chunks).toString('utf8');
          const { message, conversation_id } = raw ? JSON.parse(raw) : {};

          if (!message || !conversation_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required fields' }));
            return;
          }

          const groqApiKey = process.env.GROQ_API_KEY;
          const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

          const legalKnowledgeBase: Record<string, string> = {
            'consumer complaint':
              'To file a consumer complaint in India:\n1. Approach the District Consumer Forum for claims up to ₹1 crore\n2. State Consumer Commission for claims between ₹1-10 crores\n3. National Consumer Commission for claims above ₹10 crores\n\nRequired documents:\n- Copy of bill/receipt\n- Written complaint\n- Supporting evidence\n\nTime limit: Within 2 years from the date of cause of action.',
            'ipc crpc':
              'Key differences between IPC and CrPC:\n\nIPC (Indian Penal Code, 1860):\n- Defines criminal offenses\n- Prescribes punishments\n- Substantive law\n\nCrPC (Criminal Procedure Code, 1973):\n- Defines procedure for criminal cases\n- How investigation is conducted\n- Procedural law\n\nIn simple terms: IPC defines what is a crime, CrPC defines how to deal with it.',
            contract:
              'Essential elements of a valid contract under Indian Contract Act, 1872:\n\n1. Offer and Acceptance\n2. Lawful Consideration\n3. Capacity to Contract\n4. Free Consent\n5. Lawful Object\n6. Certainty of terms\n7. Possibility of performance\n\nA contract must have these elements to be legally enforceable in India.',
          };

          const findRelevantAnswer = (query: string): string => {
            const lowerQuery = query.toLowerCase();
            for (const [key, answer] of Object.entries(legalKnowledgeBase)) {
              if (lowerQuery.includes(key)) return answer;
            }
            return (
              'I understand you have a legal question. As an AI legal assistant for India, I can help with:\n\n' +
              '• Legal procedures and processes\n' +
              '• Understanding Indian laws (IPC, CrPC, Constitution)\n' +
              '• Document drafting guidance\n' +
              '• Contract basics\n' +
              '• Legal research\n\n' +
              'Please note: This is general legal information, not legal advice. For specific legal matters, consult a licensed attorney.\n\n' +
              "Could you please be more specific about what you'd like to know?"
            );
          };

          let response: string;

          if (groqApiKey) {
            const messages = [
              {
                role: 'system',
                content:
                  'You are LAW AI, a helpful assistant. Provide general legal information for India. ' +
                  'Do not claim to be a lawyer. Be clear and structured. Recommend consulting a licensed attorney for legal advice.',
              },
              { role: 'user', content: message },
            ];

            const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${groqApiKey}`,
              },
              body: JSON.stringify({
                model: groqModel,
                messages,
                temperature: 0.3,
                max_tokens: 700,
              }),
            });

            if (!groqResp.ok) {
              const text = await groqResp.text();
              throw new Error(`Groq error (${groqResp.status}): ${text}`);
            }

            const data = await groqResp.json();
            response = data?.choices?.[0]?.message?.content;
            if (!response || typeof response !== 'string') {
              response = findRelevantAnswer(message);
            }

            response = `${response.trim()}\n\n---\nTip: Reply generated using Groq (dev mode).`;
          } else {
            response = `${findRelevantAnswer(message)}\n\n---\nTip: Set env var 'GROQ_API_KEY' to enable Groq replies (dev mode).`;
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ response, conversation_id }));
        } catch (e: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'api failed', details: e?.message || String(e) }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), lawAiGroqProxyPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
