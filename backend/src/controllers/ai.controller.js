import { openai } from "../config/openai.js";

export const generateLayout = async (req, res) => {
  const { prompt, bundle, currentConfig } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  if (!bundle || !Array.isArray(bundle)) {
    return res.status(400).json({ message: "Bundle is required and must be an array" });
  }

  try {
    const systemPrompt = `
      You are an expert React UI Architect. 
      The user is building a landing page using a set of UI components.
      
      Components in the bundle:
      ${bundle.map(c => `- ${c.name} (${c.library}, category: ${c.category}, previewHtml exists: ${!!c.previewHtml})`).join("\n")}

      Current Layout Config:
      ${JSON.stringify(currentConfig || {}, null, 2)}

      Your task:
      1. Analyze the user's prompt: "${prompt}"
      2. Update the layout configuration.
      3. Generate the FULL React code for a component named "UIComposer" that imports and uses these components.
      4. Generate a corresponding HTML preview using Tailwind CSS (CDN) that visually represents the layout.

      The React code should:
      - Use Tailwind classes for layout.
      - Import components from their respective libraries (assume the imports provided in the bundle data).
      - Be clean and professional.

      Return ONLY a JSON object with this exact structure:
      {
        "config": {
          "theme": "light|dark",
          "background": "...",
          "layoutType": "flex-col|grid",
          "align": "...",
          "padding": "..."
        },
        "reactCode": "Full React component string...",
        "htmlPreview": "Full HTML string for preview...",
        "explanation": "Brief explanation"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
    });

    let aiResponse = response.choices[0].message.content.trim();
    
    // Clean JSON if the model returns markdown triple backticks
    if (aiResponse.includes("```json")) {
      aiResponse = aiResponse.split("```json")[1].split("```")[0];
    } else if (aiResponse.includes("```")) {
      aiResponse = aiResponse.split("```")[1].split("```")[0];
    }

    const parsedResponse = JSON.parse(aiResponse.trim());
    res.json(parsedResponse);
  } catch (error) {
    console.error("AI Generation Error Details:", error);
    
    // Check for specific OpenAI error types
    const status = error.status || 500;
    const details = error.error?.message || error.message || "Failed to generate layout with AI";
    
    res.status(status).json({ 
      message: "AI Generation Failed", 
      error: error.message,
      details: details
    });
  }
};
