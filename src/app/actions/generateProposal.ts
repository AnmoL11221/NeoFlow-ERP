"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProposalScope(projectDescription: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const prompt = `You are a project management expert specializing in freelance project scoping. 
    
    Please analyze the following project description and create a structured proposal scope with the following sections:
    
    1. **Key Deliverables**: List the main outputs and milestones
    2. **Timeline**: Provide a realistic timeline with phases
    3. **Potential Ambiguities**: Identify areas that need clarification
    
    Project Description: ${projectDescription}
    
    Please format your response in a clear, professional manner that a client would understand.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional project management consultant with expertise in freelance project scoping and proposal writing.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const generatedProposal = completion.choices[0]?.message?.content;

    if (!generatedProposal) {
      throw new Error("Failed to generate proposal");
    }

    return generatedProposal;
  } catch (error) {
    console.error("Error generating proposal:", error);
    throw new Error("Failed to generate proposal. Please try again.");
  }
} 