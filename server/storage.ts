import { db } from "./db";
import {
  categories,
  entries,
  type Category,
  type InsertCategory,
  type DistributionItem,
  type Entry,
  type InsertEntry
} from "@shared/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Entries
  addEntries(categoryId: number, rawText: string): Promise<number>;
  getDistribution(categoryId: number): Promise<DistributionItem[]>;
  mergeTerms(categoryId: number, originalTerms: string[], mergedTerm: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(desc(categories.createdAt));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(entries).where(eq(entries.categoryId, id));
    await db.delete(categories).where(eq(categories.id, id));
  }

  async addEntries(categoryId: number, rawText: string): Promise<number> {
    // Simple split by newline or comma
    const terms = rawText.split(/[\n,]+/).map(t => t.trim()).filter(t => t.length > 0);

    if (terms.length === 0) return 0;

    const values = terms.map(term => ({
      categoryId,
      term,
    }));

    await db.insert(entries).values(values);
    return terms.length;
  }

  async getDistribution(categoryId: number): Promise<DistributionItem[]> {
    // Count occurrences of each term
    const result = await db
      .select({
        term: entries.term,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(entries)
      .where(eq(entries.categoryId, categoryId))
      .groupBy(entries.term)
      .orderBy(desc(sql`count(*)`));

    return result;
  }

  async mergeTerms(categoryId: number, originalTerms: string[], mergedTerm: string): Promise<number> {
    if (originalTerms.length === 0) return 0;

    const result = await db
      .update(entries)
      .set({ term: mergedTerm })
      .where(
        sql`${entries.categoryId} = ${categoryId} AND ${inArray(entries.term, originalTerms)}`
      )
      .returning();

    return result.length;
  }
}

export const storage = new DatabaseStorage();
