// lib/ai/openrouter.ts
export async function callOpenRouter(prompt: string, isJson: boolean = false): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not defined");
  }

  const url = "https://openrouter.ai/api/v1/chat/completions";
  const model = "meta-llama/llama-3-8b-instruct:free";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://github.com/shibin/resume-ai-builder",
      "X-Title": "Resume AI Builder",
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
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("OpenRouter returned an empty completions candidate");
  }

  return text;
}
