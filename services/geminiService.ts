import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SearchResult, ExamQuestion, UniversityExam, ExamEvaluation } from '../types';

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- General Chatbot ---
export const createChatSession = (): Chat => {
  const ai = getAiClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are a helpful, encouraging, and knowledgeable AI tutor on StudyHub. Help students understand concepts, brainstorm project ideas, and debug code. Keep answers concise but informative.',
      thinkingConfig: { thinkingBudget: 1024 }
    },
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I encountered an error while thinking.";
  }
};

// --- AI Notebook (RAG-like) Features ---

// Creates a chat session strictly grounded in the provided document content
export const createNotebookSession = (documentContent: string, documentTitle: string): Chat => {
    const ai = getAiClient();
    const systemInstruction = `You are the AI Notebook assistant for the document: "${documentTitle}".
    
    Here is the full content of the document:
    """
    ${documentContent}
    """

    Rules:
    1. Answer questions based MAINLY on the content provided above.
    2. If the answer is found in the text, try to cite the section or context.
    3. If the user asks for a summary, summarize the provided text.
    4. If the answer is not in the text, you can use your general knowledge but mention that it's not in the document.
    5. Be concise and educational.`;

    return ai.chats.create({
        model: 'gemini-2.5-flash', // Fast model for notebook interactions
        config: {
            systemInstruction: systemInstruction,
        }
    });
};

// Generates an Exam Paper based on content (Text-based for Notebook)
export const generateExamPrep = async (content: string, type: 'UT' | 'EndSem' | 'Viva'): Promise<string> => {
    const ai = getAiClient();
    let prompt = "";
    
    if (type === 'Viva') {
         prompt = `Based on the following content, generate 10 viva (oral exam) questions. Include 5 basic questions and 5 tricky/advanced questions. \n\nContent:\n${content}`;
    } else {
        prompt = `Create a ${type === 'UT' ? 'Unit Test (20 Marks)' : 'End Semester Exam (50 Marks)'} based on the following content.
        
        Structure:
        - Section A: Short Answer (2 marks each)
        - Section B: Descriptive / Long Answer (5-10 marks each)
        - Section C: Application/Problem Solving
        
        Content:\n${content}`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Use Pro for high-quality exam generation
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 2048 } // Think deeply about question quality
            }
        });
        return response.text || "Could not generate exam.";
    } catch (e) {
        console.error(e);
        return "Error generating exam prep.";
    }
}

// Generates Structured Interactive Exam (JSON for Exam Mode)
export const generateInteractiveExam = async (topic: string, difficulty: string): Promise<ExamQuestion[]> => {
    const ai = getAiClient();
    const prompt = `Generate a structured exam for the topic: "${topic}" at "${difficulty}" difficulty.
    Create exactly 5 Multiple Choice Questions (MCQ).
    
    Return the response as a JSON ARRAY of objects. 
    Format:
    [
        { "id": 1, "question": "...", "type": "MCQ", "options": ["A", "B", "C", "D"], "correctAnswer": "The full string of the correct option" }
    ]
    
    Do not use Markdown code blocks. Just return the raw JSON array.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (e) {
        console.error("Exam Gen Error", e);
        // Fallback data
        return [
            { id: 1, question: "Failed to generate AI questions. Is the API Key valid?", type: "MCQ", options: ["Yes", "No"], correctAnswer: "Yes" }
        ];
    }
}

// --- University Style Exam Generation ---
export const generateUniversityExam = async (content: string, config: { short: number, medium: number, long: number }): Promise<UniversityExam | null> => {
    const ai = getAiClient();
    const prompt = `Generate a University Style Exam Paper based on the content below.
    
    Structure Required:
    1. Section A: ${config.short} questions of 2 marks each (Definitions/Short Concepts).
    2. Section B: ${config.medium} questions of 5 marks each (Explanations/Comparisons).
    3. Section C: ${config.long} questions of 10 marks each (Deep Theory/Derivations).

    Content:
    """
    ${content.substring(0, 15000)} 
    """

    Return strict JSON format:
    {
        "title": "Exam Paper",
        "sections": [
            {
                "title": "Section A (2 Marks)",
                "questions": [ { "id": 1, "question": "...", "marks": 2, "type": "Definition" }, ... ]
            },
             {
                "title": "Section B (5 Marks)",
                "questions": [ ... ]
            },
             {
                "title": "Section C (10 Marks)",
                "questions": [ ... ]
            }
        ]
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        return JSON.parse(response.text || "null");
    } catch (e) {
        console.error("University Exam Gen Error", e);
        return null;
    }
}

export const evaluateExamAnswers = async (questions: any[], userAnswers: {[key: number]: string}, content: string): Promise<ExamEvaluation[]> => {
    const ai = getAiClient();
    
    // Prepare data for AI
    const qaPairs = questions.map(q => ({
        id: q.id,
        question: q.question,
        marks: q.marks,
        userAnswer: userAnswers[q.id] || "Not Answered"
    }));

    const prompt = `Evaluate the following student exam answers based on the provided content.
    
    Content Context:
    """
    ${content.substring(0, 5000)}...
    """

    Student Answers:
    ${JSON.stringify(qaPairs)}

    For each question, provide:
    1. A concise "modelAnswer" (what was expected).
    2. "feedback" (what was missing or good).
    3. "score" (estimated marks out of total).

    Return JSON array:
    [
        { "questionId": 1, "modelAnswer": "...", "feedback": "...", "score": 1.5 }
    ]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        return JSON.parse(response.text || "[]");
    } catch (e) {
        console.error("Eval Error", e);
        return [];
    }
}


// --- Search Grounding ---
export const searchExternalResources = async (query: string): Promise<{ text: string; links: SearchResult[] }> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find high-quality educational resources, tutorials, or documentation for: ${query}. Summarize the best findings.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No results found.";
    const links: SearchResult[] = [];

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          links.push({
            title: chunk.web.title || "External Resource",
            url: chunk.web.uri,
          });
        }
      });
    }

    return { text, links };
  } catch (error) {
    console.error("Search Error:", error);
    return { text: "Failed to search external resources.", links: [] };
  }
};

// --- Content Analysis ---
export const generateAutoTags = async (title: string, description: string): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const prompt = `Generate 5 relevant comma-separated tags for a student project titled "${title}" with description: "${description}". Return ONLY the comma-separated string, nothing else.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        const text = response.text || "";
        return text.split(',').map(t => t.trim()).filter(t => t.length > 0);
    } catch (e) {
        console.error(e);
        return ['Education', 'Student Project'];
    }
}

export const generateVivaQuestions = async (title: string, description: string, techStack: string[] = []): Promise<string[]> => {
    const ai = getAiClient();
    try {
        const stackStr = techStack.join(', ');
        const prompt = `Generate 5 challenging viva (interview) questions for a student project titled "${title}". 
        Description: ${description}
        Tech Stack: ${stackStr}
        Return ONLY the questions as a JSON array of strings. Do not use Markdown code blocks.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                 responseMimeType: "application/json"
            }
        });
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (e) {
        console.error(e);
        return [
            "Explain the core architecture of your project.",
            "What were the major challenges you faced during development?",
            "Why did you choose this specific tech stack?",
            "How would you scale this application for 10,000 users?",
            "Explain the data flow in your application."
        ];
    }
}
