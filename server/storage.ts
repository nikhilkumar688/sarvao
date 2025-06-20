import { 
  donations, 
  contacts, 
  projects, 
  testimonials, 
  expenses,
  type Donation, 
  type InsertDonation,
  type Contact,
  type InsertContact,
  type Project,
  type InsertProject,
  type Testimonial,
  type InsertTestimonial,
  type Expense,
  type InsertExpense
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Donations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  getDonationByPaymentIntent(paymentIntentId: string): Promise<Donation | undefined>;
  updateDonationStatus(id: number, status: string): Promise<Donation>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Expenses
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  
  // Financial summary
  getFinancialSummary(): Promise<{
    totalRaised: number;
    totalAllocated: number;
    availableBalance: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const [donation] = await db
      .insert(donations)
      .values(insertDonation)
      .returning();
    return donation;
  }

  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations);
  }

  async getDonationByPaymentIntent(paymentIntentId: string): Promise<Donation | undefined> {
    const [donation] = await db
      .select()
      .from(donations)
      .where(eq(donations.stripePaymentIntentId, paymentIntentId));
    return donation || undefined;
  }

  async updateDonationStatus(id: number, status: string): Promise<Donation> {
    const [donation] = await db
      .update(donations)
      .set({ status })
      .where(eq(donations.id, id))
      .returning();
    return donation;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.isActive, true));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isActive, true));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const [expense] = await db
      .insert(expenses)
      .values(insertExpense)
      .returning();
    return expense;
  }

  async getFinancialSummary(): Promise<{
    totalRaised: number;
    totalAllocated: number;
    availableBalance: number;
  }> {
    const donationData = await this.getDonations();
    const expenseData = await this.getExpenses();
    
    const totalRaised = donationData
      .filter(d => d.status === "succeeded")
      .reduce((sum, d) => sum + parseFloat(d.amount), 0);
    
    const totalAllocated = expenseData
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    
    return {
      totalRaised,
      totalAllocated,
      availableBalance: totalRaised - totalAllocated,
    };
  }
}

export class MemStorage implements IStorage {
  private donations: Map<number, Donation>;
  private contacts: Map<number, Contact>;
  private projects: Map<number, Project>;
  private testimonials: Map<number, Testimonial>;
  private expenses: Map<number, Expense>;
  private currentIds: {
    donations: number;
    contacts: number;
    projects: number;
    testimonials: number;
    expenses: number;
  };

  constructor() {
    this.donations = new Map();
    this.contacts = new Map();
    this.projects = new Map();
    this.testimonials = new Map();
    this.expenses = new Map();
    this.currentIds = {
      donations: 1,
      contacts: 1,
      projects: 1,
      testimonials: 1,
      expenses: 1,
    };

    // Initialize with sample data
    this.initializeSampleData();
    
    // Add sample donations to showcase transparency
    this.initializeSampleDonations();
  }

  private initializeSampleData() {
    // Sample projects
    this.createProject({
      name: "Community Portal",
      description: "A modern web portal for community organizations to manage events, volunteers, and communications with full transparency and open-source flexibility.",
      language: "TypeScript",
      stars: 124,
      commits: 342,
      contributors: 18,
      openIssues: 7,
      giteaUrl: "https://git.sarvao.org/community-portal",
      isActive: true,
    });

    this.createProject({
      name: "Mobile Impact Tracker",
      description: "Cross-platform mobile app for real-time impact tracking and community engagement, built with React Native and featuring offline-first architecture.",
      language: "React Native",
      stars: 89,
      commits: 267,
      contributors: 12,
      openIssues: 3,
      giteaUrl: "https://git.sarvao.org/mobile-tracker",
      isActive: true,
    });

    this.createProject({
      name: "Transparency API",
      description: "RESTful API for financial transparency and impact tracking, providing real-time data access with comprehensive documentation and rate limiting.",
      language: "Node.js",
      stars: 156,
      commits: 445,
      contributors: 23,
      openIssues: 2,
      giteaUrl: "https://git.sarvao.org/transparency-api",
      isActive: true,
    });

    // Sample testimonials
    this.createTestimonial({
      name: "Sarah Chen",
      role: "Community Manager",
      organization: "Tech for Good Initiative",
      quote: "Sarvao's transparent approach to development has revolutionized how our community manages projects. The open-source tools they've provided have increased our efficiency by 300% while maintaining complete transparency.",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b9c3b96a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      isActive: true,
    });

    this.createTestimonial({
      name: "Marcus Rodriguez",
      role: "Software Developer",
      organization: "Open Source Collective",
      quote: "The financial transparency and impact tracking tools have completely changed how we report to stakeholders. Being able to show real-time data builds incredible trust with our funding partners.",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      isActive: true,
    });

    this.createTestimonial({
      name: "Dr. Priya Patel",
      role: "Non-profit Director",
      organization: "Global Health Alliance",
      quote: "Working with Sarvao has been transformative for our organization. Their commitment to open-source development and transparent operations aligns perfectly with our values of accountability and community empowerment.",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      isActive: true,
    });

    this.createTestimonial({
      name: "James Thompson",
      role: "Project Coordinator",
      organization: "Community Development Corp",
      quote: "The mobile impact tracker has revolutionized how we collect and report community feedback. Our stakeholders now have real-time access to impact data, which has increased funding by 150%.",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      isActive: true,
    });

    this.createTestimonial({
      name: "Lisa Wang",
      role: "Technical Lead",
      organization: "Digital Equity Initiative",
      quote: "Sarvao's API documentation and community support are exceptional. We've been able to integrate their transparency tools seamlessly into our existing infrastructure.",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      isActive: true,
    });

    this.createTestimonial({
      name: "Robert Kim",
      role: "Executive Director",
      organization: "Sustainable Communities Fund",
      quote: "The transparency and accountability that Sarvao provides has transformed our donor relations. We've seen a 200% increase in repeat donations since implementing their tracking system.",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      isActive: true,
    });

    // Sample expenses
    this.createExpense({
      name: "Development Infrastructure",
      description: "Server hosting, development tools, CI/CD",
      amount: "45200.00",
      category: "infrastructure",
      icon: "fas fa-code",
    });

    this.createExpense({
      name: "Community Programs",
      description: "Training, workshops, outreach",
      amount: "38150.00",
      category: "programs",
      icon: "fas fa-users",
    });

    this.createExpense({
      name: "Operations",
      description: "Legal, accounting, administrative",
      amount: "24880.00",
      category: "operations",
      icon: "fas fa-tools",
    });

    this.createExpense({
      name: "Marketing & Outreach",
      description: "Website, communications, events",
      amount: "10000.00",
      category: "marketing",
      icon: "fas fa-chart-line",
    });
  }

  private initializeSampleDonations() {
    // Add sample donations to demonstrate transparency tracking
    this.createDonation({
      amount: "250.00",
      donorEmail: "sarah.chen@example.com",
      donorName: "Sarah Chen",
      stripePaymentIntentId: "pi_sample_1",
      status: "succeeded",
    });

    this.createDonation({
      amount: "100.00",
      donorEmail: "marcus.rodriguez@example.com",
      donorName: "Marcus Rodriguez",
      stripePaymentIntentId: "pi_sample_2",
      status: "succeeded",
    });

    this.createDonation({
      amount: "500.00",
      donorEmail: "priya.patel@example.com",
      donorName: "Dr. Priya Patel",
      stripePaymentIntentId: "pi_sample_3",
      status: "succeeded",
    });

    this.createDonation({
      amount: "75.00",
      donorEmail: "james.thompson@example.com",
      donorName: "James Thompson",
      stripePaymentIntentId: "pi_sample_4",
      status: "succeeded",
    });

    this.createDonation({
      amount: "300.00",
      donorEmail: "lisa.wang@example.com",
      donorName: "Lisa Wang",
      stripePaymentIntentId: "pi_sample_5",
      status: "succeeded",
    });

    this.createDonation({
      amount: "150.00",
      donorEmail: "robert.kim@example.com",
      donorName: "Robert Kim",
      stripePaymentIntentId: "pi_sample_6",
      status: "succeeded",
    });
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.currentIds.donations++;
    const donation: Donation = {
      ...insertDonation,
      id,
      status: insertDonation.status || "pending",
      createdAt: new Date(),
    };
    this.donations.set(id, donation);
    return donation;
  }

  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }

  async getDonationByPaymentIntent(paymentIntentId: string): Promise<Donation | undefined> {
    return Array.from(this.donations.values()).find(
      (donation) => donation.stripePaymentIntentId === paymentIntentId,
    );
  }

  async updateDonationStatus(id: number, status: string): Promise<Donation> {
    const donation = this.donations.get(id);
    if (!donation) {
      throw new Error("Donation not found");
    }
    const updatedDonation = { ...donation, status };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentIds.contacts++;
    const contact: Contact = {
      ...insertContact,
      id,
      organization: insertContact.organization || null,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.isActive);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentIds.projects++;
    const project: Project = {
      ...insertProject,
      id,
      stars: insertProject.stars || 0,
      commits: insertProject.commits || 0,
      contributors: insertProject.contributors || 0,
      openIssues: insertProject.openIssues || 0,
      isActive: insertProject.isActive !== undefined ? insertProject.isActive : true,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(t => t.isActive);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentIds.testimonials++;
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id,
      rating: insertTestimonial.rating || 5,
      isActive: insertTestimonial.isActive !== undefined ? insertTestimonial.isActive : true,
      avatarUrl: insertTestimonial.avatarUrl || null,
      createdAt: new Date(),
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentIds.expenses++;
    const expense: Expense = {
      ...insertExpense,
      id,
      createdAt: new Date(),
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async getFinancialSummary(): Promise<{
    totalRaised: number;
    totalAllocated: number;
    availableBalance: number;
  }> {
    const donations = await this.getDonations();
    const expenses = await this.getExpenses();
    
    const totalRaised = donations
      .filter(d => d.status === "succeeded")
      .reduce((sum, d) => sum + parseFloat(d.amount), 0);
    
    const totalAllocated = expenses
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    
    return {
      totalRaised,
      totalAllocated,
      availableBalance: totalRaised - totalAllocated,
    };
  }
}

export const storage = new DatabaseStorage();
