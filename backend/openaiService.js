const https = require('https');

const GOOGLE_GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_GEMINI_API_HOST = "generativelanguage.googleapis.com";

function generateCode(prompt) {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_GEMINI_API_KEY) {
      reject(new Error('GEMINI_API_KEY is not configured'));
      return;
    }

    const path = "/v1beta/models/gemini-2.0-flash:generateContent?key=" + encodeURIComponent(GOOGLE_GEMINI_API_KEY);
    const data = JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    });

    const options = {
      hostname: GOOGLE_GEMINI_API_HOST,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(body);
            // Extract the generated text from the Gemini API response
            const generated = parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts && parsed.candidates[0].content.parts[0].text;
            resolve(generated || '');
          } catch (e) {
            reject(new Error('Failed to parse response JSON'));
          }
        } else {
          reject(new Error(`Google Gemini API error: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

module.exports = { generateCode };
