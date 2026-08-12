import dotenv from "dotenv"
dotenv.config()
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter"
import { HuggingFaceInference } from "@langchain/community/llms/hf"

// Hugging Face Open-Source Model integration
const huggingface = new HuggingFaceInference({
    model: process.env.HUGGINGFACE_MODEL || "meta-llama/Llama-3.3-70B-Instruct",
    apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
    temperature: 0.2,
    maxTokens: 2500
})

const groq = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY
})

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY
})

const openrouter = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    temperature: 0,
    maxTokens: 2500,
    apiKey: process.env.OPENROUTER_API_KEY
})

export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return process.env.HUGGINGFACEHUB_API_TOKEN ? huggingface : groq;
        case "search":
            return groq;
        case "coding":
            return openrouter;
        case "imageAnalyzer":
            return gemini;
        case "huggingface":
            return huggingface;
        default:
            return process.env.HUGGINGFACEHUB_API_TOKEN ? huggingface : groq;
    }
}

