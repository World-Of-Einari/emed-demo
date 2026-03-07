import "dotenv/config";
import OpenAI from "openai";
import { Client } from "@elastic/elasticsearch";

export const ES_INDEX = "emed-kb";

export type KbSearchResult = {
  chunkId: string;
  title: string;
  source: string;
  snippet: string;
  score: number;
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export function getEsClient(): Client {
  const node = process.env.ELASTICSEARCH_URL ?? "http://localhost:9200";
  const apiKey = process.env.ELASTICSEARCH_API_KEY;
  return new Client(apiKey ? { node, auth: { apiKey } } : { node });
}

export async function kbSearch(query: string, topK = 5): Promise<KbSearchResult[]> {
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const queryVector = emb.data[0].embedding;
  const es = getEsClient();

  const response = await es.search({
    index: ES_INDEX,
    size: topK,
    knn: {
      field: "embedding",
      query_vector: queryVector,
      k: topK,
      num_candidates: 50,
    },
    _source: ["chunkId", "title", "source", "content"],
  });

  return response.hits.hits.map((hit) => {
    const src = hit._source as {
      chunkId: string;
      title: string;
      source: string;
      content: string;
    };
    return {
      chunkId: src.chunkId,
      title: src.title,
      source: src.source,
      snippet: src.content.slice(0, 400),
      score: hit._score ?? 0,
    };
  });
}
