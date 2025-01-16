import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 'dab458d6-8352-42e6-88a1-88acc76b4e43';

  // Seed a user
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'example@example.com', // Replace with your desired email
      name: 'John Doe',            // Replace with your desired name
    },
  });

  console.log('Seeded user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });