import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPersonSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Person CRUD routes
  
  // Create person
  app.post("/api/persons", async (req, res) => {
    try {
      const validatedData = insertPersonSchema.parse(req.body);
      const person = await storage.createPerson(validatedData);
      res.json(person);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Get persons with pagination
  app.get("/api/persons", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const persons = await storage.getPersons(limit, offset);
      const total = await storage.getPersonsCount();
      
      res.json({
        data: persons,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Search persons
  app.get("/api/persons/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const persons = await storage.searchPersons(query, limit, offset);
      const total = await storage.searchPersonsCount(query);
      
      res.json({
        data: persons,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get single person
  app.get("/api/persons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const person = await storage.getPerson(id);
      
      if (!person) {
        res.status(404).json({ message: "Person not found" });
        return;
      }
      
      res.json(person);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update person
  app.put("/api/persons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPersonSchema.partial().parse(req.body);
      
      const person = await storage.updatePerson(id, validatedData);
      
      if (!person) {
        res.status(404).json({ message: "Person not found" });
        return;
      }
      
      res.json(person);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Delete person
  app.delete("/api/persons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePerson(id);
      
      if (!deleted) {
        res.status(404).json({ message: "Person not found" });
        return;
      }
      
      res.json({ message: "Person deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
