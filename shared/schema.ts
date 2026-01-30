import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  term: text("term").notNull(), // The raw term, e.g., "Apple", "apple ", "Apple."
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const categoriesRelations = relations(categories, ({ many }) => ({
  entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  category: one(categories, {
    fields: [entries.categoryId],
    references: [categories.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, createdAt: true });
export const insertEntrySchema = createInsertSchema(entries).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Entry = typeof entries.$inferSelect;
export type InsertEntry = z.infer<typeof insertEntrySchema>;

// Request types
export type CreateCategoryRequest = InsertCategory;
export type AddEntriesRequest = {
  categoryId: number;
  rawText: string; // User pastes a block of text, we split it
};

export type MergeTermsRequest = {
  categoryId: number;
  originalTerms: string[]; // ["apple", "apples"]
  mergedTerm: string;      // "Apple"
};

// Response types
export type CategoryResponse = Category;
export type DistributionItem = {
  term: string;
  count: number;
};
export type DistributionResponse = DistributionItem[];
