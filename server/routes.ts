import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertDonationSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, donorEmail, donorName } = req.body;
      
      if (!amount || !donorEmail || !donorName) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          donorEmail,
          donorName,
        },
      });

      // Store the donation in our database
      await storage.createDonation({
        amount: amount.toString(),
        donorEmail,
        donorName,
        stripePaymentIntentId: paymentIntent.id,
        status: "pending",
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({ success: true, contact });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Error submitting contact form: " + error.message });
    }
  });

  // Get projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching projects: " + error.message });
    }
  });

  // Get testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching testimonials: " + error.message });
    }
  });

  // Get expenses
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching expenses: " + error.message });
    }
  });

  // Get financial summary
  app.get("/api/financial-summary", async (req, res) => {
    try {
      const summary = await storage.getFinancialSummary();
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching financial summary: " + error.message });
    }
  });

  // Get donations
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching donations: " + error.message });
    }
  });

  // Webhook for Stripe events
  app.post("/api/webhook", async (req, res) => {
    try {
      const event = req.body;

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const donation = await storage.getDonationByPaymentIntent(paymentIntent.id);
        
        if (donation) {
          await storage.updateDonationStatus(donation.id, "succeeded");
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(500).json({ message: "Webhook error: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
