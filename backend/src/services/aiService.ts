import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
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

Example output:

[
  {
    "name": "John Doe",
    "email": "john@gmail.com",
    "country_code": "+91",
    "mobile_without_country_code": "9876543210",
    "company": "ABC Pvt Ltd",
    "city": "Hyderabad"
  }
]
`;

  console.log("Using model:", "gemini-2.5-pro");
  console.log("Customers received:", customers.length);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
    });

    const text = response.text ?? "";

    console.log("Gemini Response:", text);

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
