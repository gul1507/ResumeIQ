export function extractTextFromPdfBuffer(buffer: Buffer): string {
  try {
    const raw = buffer.toString('latin1');
    const textPieces: string[] = [];

    // Extract text inside Tj operators: (text) Tj
    const tjRegex = /\(([^()]*)\)\s*T[jJ]/g;
    let match;
    while ((match = tjRegex.exec(raw)) !== null) {
      const str = match[1].replace(/\\([()\\])/g, '$1').trim();
      if (str.length > 0 && !/^[\x00-\x1F]+$/.test(str) && !/^\d+\s+\d+$/.test(str)) {
        textPieces.push(str);
      }
    }

    // Extract text inside TJ array operators: [(text) 10 (text)] TJ
    const arrayTjRegex = /\[\s*(((?:\([^()]*\)|-?\d+)\s*)+)\]\s*TJ/gi;
    while ((match = arrayTjRegex.exec(raw)) !== null) {
      const inner = match[1];
      const strMatches = inner.match(/\(([^()]*)\)/g);
      if (strMatches) {
        const line = strMatches
          .map(s => s.slice(1, -1).replace(/\\([()\\])/g, '$1'))
          .join('')
          .trim();
        if (line.length > 0 && !/^\d+\s+\d+$/.test(line)) {
          textPieces.push(line);
        }
      }
    }

    let extractedText = textPieces.join('\n').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/[ \t]+/g, ' ').trim();

    if (extractedText.length > 40) {
      return extractedText;
    }
  } catch (e) {
    console.warn('PDF stream decoder warning:', e);
  }

  // Fallback string extraction for plain text streams
  const bufferText = buffer.toString('utf8', 0, buffer.length);
  const words = bufferText.match(/[A-Z][a-zA-Z0-9.\-\+\/]{2,}(\s+[A-Za-z0-9.\-\+\/]{2,})*/g) || [];
  return words.join(' ').trim();
}
