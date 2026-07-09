// lib/ai/groq.ts
export async function callGroq(prompt: string, isJson: boolean = false): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not defined");
  }

  const url = "https://api.groq.com/openai/v1/chat/completions";
  const model = "llama-3.3-70b-versatile";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: isJson ? { type: "json_object" } : undefined,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Groq returned an empty choice content");
  }

  return text;
}
