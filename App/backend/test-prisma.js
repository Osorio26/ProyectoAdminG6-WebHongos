import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

try {
    console.log("Attempting to instantiate PrismaClient...");
    const prisma = new PrismaClient();
    console.log("PrismaClient instantiated successfully");
} catch (e) {
    console.error("Error instantiating PrismaClient:", e);
}
