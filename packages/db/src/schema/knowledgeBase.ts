import { pgTable, uniqueIndex, index } from "drizzle-orm/pg-core";

import { vector } from "../types/vector";

export const kbDocument = pgTable(
  "kb_document",
  (t) => ({
    id: t.uuid("id").defaultRandom().primaryKey(),
    title: t.text("title").notNull(),
    source: t.text("source").notNull(),
    createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  }),
  (t) => [uniqueIndex("kb_document_source_uq").on(t.source)],
);

export const kbChunk = pgTable(
  "kb_chunk",
  (t) => ({
    id: t.uuid("id").defaultRandom().primaryKey(),
    documentId: t
      .uuid("document_id")
      .notNull()
      .references(() => kbDocument.id, { onDelete: "cascade", onUpdate: "cascade" }),
    chunkIndex: t.integer("chunk_index").notNull(),
    content: t.text("content").notNull(),
    contentHash: t.text("content_hash").notNull(),

    embedding: vector("embedding"), // custom vector type

    createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  }),
  (t) => [
    index("kb_chunk_document_id_idx").on(t.documentId),
    uniqueIndex("kb_chunk_content_hash_uq").on(t.contentHash),
  ],
);
