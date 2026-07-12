import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function mapCustomers(customers: any[]) {
  const prompt = `
You are a CRM data mapping assistant.

Convert the following customer records into GrowEasy CRM format.

Customer Records:

${JSON.stringify(customers, null, 2)}

Rules:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Return an array.
- Map customer name to "name".
- Map email to "email".
- Split phone into:
  - country_code
  - mobile_without_country_code
- Map company to "company".
- Map city to "city".
- If any value is missing, return null.
`;

  console.log(
    "Using OpenRouter Key:",
    process.env.OPENROUTER_API_KEY?.substring(0, 15),
  );

  console.log("Calling OpenRouter...");
  let response;

  try {
    response = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
  } catch (err: any) {
    console.error("OpenRouter Error:");
    console.error(err);

    if (err.response?.data) {
      console.error(err.response.data);
    }

    throw err;
  }

  const text = response.choices[0].message.content ?? "";

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}
