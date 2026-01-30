import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post(api.categories.create.path, async (req, res) => {
    try {
      const input = api.categories.create.input.parse(req.body);
      const category = await storage.createCategory(input);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
        return;
      }
      throw err;
    }
  });

  app.get(api.categories.get.path, async (req, res) => {
    const category = await storage.getCategory(Number(req.params.id));
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.json(category);
  });

  app.delete(api.categories.delete.path, async (req, res) => {
    const category = await storage.getCategory(Number(req.params.id));
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    await storage.deleteCategory(Number(req.params.id));
    res.status(204).end();
  });

  // Entries
  app.post(api.entries.add.path, async (req, res) => {
    const categoryId = Number(req.params.id);
    const category = await storage.getCategory(categoryId);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    try {
      const input = api.entries.add.input.parse(req.body);
      const count = await storage.addEntries(categoryId, input.rawText);
      res.status(201).json({ count });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
        return;
      }
      throw err;
    }
  });

  app.get(api.entries.distribution.path, async (req, res) => {
    const categoryId = Number(req.params.id);
    const category = await storage.getCategory(categoryId);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    const distribution = await storage.getDistribution(categoryId);
    res.json(distribution);
  });

  app.post(api.entries.merge.path, async (req, res) => {
    const categoryId = Number(req.params.id);
    const category = await storage.getCategory(categoryId);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    try {
      const input = api.entries.merge.input.parse(req.body);
      const updatedCount = await storage.mergeTerms(categoryId, input.originalTerms, input.mergedTerm);
      res.json({ updatedCount });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
        return;
      }
      throw err;
    }
  });

  // Seed data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const categories = await storage.getCategories();
  if (categories.length === 0) {
    const demo = await storage.createCategory({
      name: "Fruit Preferences",
      description: "Demo data showing fruit distribution"
    });
    
    await storage.addEntries(demo.id, "Apple, Banana, Orange, Apple, apple, Apple , Banana, Grape, Kiwi, Orange");
  }
}
