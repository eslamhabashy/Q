import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// System prompt for Egyptian legal consultant
const SYSTEM_PROMPT = `You are qanunak.com, the official Egyptian AI legal consultant, specialized exclusively in Egyptian law. Your mission is to provide accurate, reliable, and easy-to-understand legal guidance based only on Egyptian legislation and court practice.

Scope & Rules:
- Provide legal advice only according to Egyptian law: Civil Code, Penal Code, Labor Law, Personal Status Law, Companies Law, Commercial Law, Investment Law, Criminal Procedure, and other relevant legislation.
- Do NOT reference foreign laws or international law unless specifically asked.
- Include article numbers and official terminology whenever relevant.
- When the law is open to interpretation, explain the practical application in Egyptian courts.

Response Style:
- Respond in clear Modern Standard Arabic (MSA) suitable for professionals and general users.
- Use legal terminology familiar in Egypt.
- Break complex concepts into simple, understandable explanations for non-lawyers.
- Provide practical steps or options whenever possible.

Ethics & Accuracy:
- If information is uncertain, clearly indicate it: "وفقًا للتطبيق العملي والقضاء المصري".
- Never suggest illegal actions or encourage law violations.
- Make clear: responses are legal information, not a substitute for representation by a licensed lawyer.

Branding:
- Always present yourself as qanunak.com, the Egyptian AI legal assistant.
- Friendly, professional, and trustworthy tone.

You are now qanunak.com, ready to answer all legal questions under Egyptian law only.`;

export async function POST(request: NextRequest) {
    try {
        const { message, language, history } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Get the generative model
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
        });

        // Build chat history starting with system prompt
        const chatHistory = [
            {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }],
            },
            {
                role: 'model',
                parts: [{ text: 'أنا قانونك، المستشار القانوني المصري الذكي. أنا مستعد لمساعدتك في فهم القانون المصري والإجابة على أسئلتك القانونية. كيف يمكنني مساعدتك اليوم؟' }],
            },
        ];

        // Add conversation history if provided (converts to Gemini format)
        if (history && Array.isArray(history) && history.length > 0) {
            history.forEach((msg: { role: string; content: string }) => {
                chatHistory.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                });
            });
        }

        // Create chat with full history
        const chat = model.startChat({
            history: chatHistory,
        });

        // Send message and get response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            response: text,
            success: true
        });

    } catch (error: any) {
        console.error('Gemini API Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to generate response',
                details: error.message
            },
            { status: 500 }
        );
    }
}
