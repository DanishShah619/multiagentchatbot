import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.js";
import dotenv from "dotenv"
dotenv.config()

export const vectorStore = async (docs, collectionName = "cortexai_pdf_collection") => {
    const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333"
    const qdrantApiKey = process.env.QDRANT_API_KEY || undefined

    return await QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: qdrantUrl,
        apiKey: qdrantApiKey,
        collectionName: collectionName
    });
}