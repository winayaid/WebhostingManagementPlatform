import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if the admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (existingAdmin) {
    console.log("Admin account already exists");
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash("123123123", 10);

  // Create the admin user
  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      username: "admin",
      email: "admin@example.com", // Replace with the desired admin email
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin account created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
