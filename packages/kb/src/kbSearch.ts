import "dotenv/config";
import OpenAI from "openai";
import { eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@emed/db-client";
import { kbChunk, kbDocument } from "@emed/db";

export type KbSearchResult = {
  chunkId: string;
  title: string;
  source: string;
  snippet: string;
  cosineDistance: number;
};

// NOTE:
// Drizzle parameterizes arrays as records, which Postgres does not accept
// for pgvector operators (<=>). We therefore inline a pgvector literal
// ('[1,2,3]'::vector) to ensure the RHS is typed as vector.
function toPgVectorLiteral(v: number[]) {
  // Only numbers/commas/dots/minus – safe to inline as SQL literal
  return `[${v.join(",")}]`;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function kbSearch(query: string, topK = 5): Promise<KbSearchResult[]> {
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const q = emb.data[0].embedding; // number[]
  const qLiteral = toPgVectorLiteral(q);

  const qVecSql = sql.raw(`'${qLiteral}'::vector`);

  const rows = await db
    .select({
      chunkId: kbChunk.id,
      title: kbDocument.title,
      source: kbDocument.source,
      content: kbChunk.content,
      cosineDistance: sql`${kbChunk.embedding} <=> ${qVecSql}`.as("cosineDistance"),
    })
    .from(kbChunk)
    .innerJoin(kbDocument, eq(kbDocument.id, kbChunk.documentId))
    .where(isNotNull(kbChunk.embedding))
    .orderBy(sql`${kbChunk.embedding} <=> ${qVecSql}`)
    .limit(topK);

  return rows.map((r) => ({
    chunkId: String(r.chunkId),
    title: String(r.title),
    source: String(r.source),
    snippet: String(r.content).slice(0, 400),
    cosineDistance: Number(r.cosineDistance),
  }));
}
