export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "txt" || extension === "md" || extension === "json" || extension === "rtf") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read text file"));
      reader.readAsText(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const buffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(buffer);
        let binaryStr = "";
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binaryStr += String.fromCharCode(bytes[i]);
        }

        const textMatches: string[] = [];
        const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
        let match;
        
        while ((match = streamRegex.exec(binaryStr)) !== null) {
          const rawStream = match[1];
          const tjMatches = rawStream.match(/\((.*?)\)\s*Tj/g);
          if (tjMatches) {
            tjMatches.forEach((m) => {
              const text = m.replace(/^\(/, "").replace(/\)\s*Tj$/, "");
              if (text.trim().length > 0) textMatches.push(text);
            });
          }
        }

        if (textMatches.length === 0) {
          const generalWords = binaryStr.match(/[A-Za-z0-9@.,:/\-+#]{2,}/g);
          if (generalWords && generalWords.length > 20) {
            resolve(generalWords.join(" "));
            return;
          }
        }

        const extracted = textMatches.join(" ").trim();
        if (extracted.length > 50) {
          resolve(extracted);
        } else {
          const fallback = binaryStr.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ");
          resolve(fallback.slice(0, 15000));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read document"));
    reader.readAsArrayBuffer(file);
  });
}
