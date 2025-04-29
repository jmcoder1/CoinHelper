import { prisma } from "./prisma";

export const initDatabase = async () => {
  try {
    console.log("Initializing Prisma client...");
    await prisma.$connect();
    console.log("Prisma client initialized.");
  } catch (error) {
    console.error("Error initializing Prisma client:", error);
  }
};
