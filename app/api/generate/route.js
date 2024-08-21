import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Each flashcard should have a clear question on one side and a concise answer on the other. Follow these guidelines:

1. Create clear and specific questions that target key concepts.
2. Provide brief, accurate answers that capture the essential information.
3. Use simple language to ensure clarity and ease of understanding.
4. Avoid overly complex or lengthy explanations in the answers.
5. Cover a range of difficulty levels, from basic recall to more advanced application of concepts.
6. Ensure that the flashcards are self-contained and don't require additional context to understand.
7. Use a variety of question types when appropriate (e.g., definitions, examples, comparisons).
8. Avoid creating flashcards with multiple correct answers unless specifically instructed.
9. Focus on the most important and relevant information related to the given topic.
10. Maintain consistency in formatting and style across all flashcards.
11. Only generate 10 flashcards.

Return the flashcards in JSON format.
{
  "flashcards": [
    {
      "front": "str",
      "back": "str"
    }
  ]
}

`

export async function POST(req) {
    const openai = new OpenAI();
    const data = await req.json(); // Parse the JSON body of the incoming request and store it in the 'data' variable
   

    const completion = await openai.chat.completions.create({
        model: "gpt-4o",  // Specifies the OpenAI model to use (note: "gpt-4o" might be a typo, should be "gpt-4")
        response_format: {type: "json_object"},  // Requests the response in JSON format
        messages: [
            {role: "system", content: systemPrompt},  // Sends the system prompt to set the AI's behavior
            {role: "user", content: data}  // Sends the user's input (parsed from the request body)
        ]
    })
    // This creates a chat completion request to the OpenAI API
    // The response will contain AI-generated flashcards based on the user's input
    
    const flashcards = JSON.parse(completion.choices[0].message.content);
   
    return NextResponse.json(flashcards.flashcards);
}