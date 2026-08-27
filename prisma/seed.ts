import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: { name: "Student", email: "student@example.com" }
  });

  const names = ["Food","Shopping","Studies","Transport","Entertainment","Personal Care","Bills/Subscriptions","Other"];
  const categories = [];
  for (const name of names) {
    categories.push(await prisma.category.upsert({
      where: { userId_name: { userId: user.id, name } },
      update: {},
      create: { userId: user.id, name }
    }));
  }

  const month = new Date().toISOString().slice(0, 7);
  await prisma.budgetMonth.upsert({
    where: { userId_month: { userId: user.id, month } },
    update: {},
    create: { userId: user.id, month, pocketMoney: 10000 }
  });

  const limits: Record<string, number> = {
    Food: 3000, Shopping: 2000, Entertainment: 1000, Studies: 1000,
    Transport: 1200, "Personal Care": 700, "Bills/Subscriptions": 800, Other: 500
  };

  for (const c of categories) {
    await prisma.categoryBudget.upsert({
      where: { userId_categoryId_month: { userId: user.id, categoryId: c.id, month } },
      update: { limit: limits[c.name] ?? 500 },
      create: { userId: user.id, categoryId: c.id, month, limit: limits[c.name] ?? 500 }
    });
  }

  const food = categories.find(c => c.name === "Food")!;
  const transport = categories.find(c => c.name === "Transport")!;

  if ((await prisma.expense.count({ where: { userId: user.id } })) === 0) {
    await prisma.expense.createMany({
      data: [
        { userId: user.id, categoryId: food.id, amount: 650, date: new Date(), paymentMethod: "UPI", note: "College canteen" },
        { userId: user.id, categoryId: transport.id, amount: 300, date: new Date(Date.now() - 86400000), paymentMethod: "UPI", note: "Auto" }
      ]
    });
  }

  if ((await prisma.futurePayment.count({ where: { userId: user.id } })) === 0) {
    await prisma.futurePayment.createMany({
      data: [
        { userId: user.id, name: "Trip", amount: 1500, dueDate: new Date(Date.now() + 864000000), category: "Travel" },
        { userId: user.id, name: "Friend's birthday", amount: 800, dueDate: new Date(Date.now() + 1296000000), category: "Personal" },
        { userId: user.id, name: "Subscription", amount: 500, dueDate: new Date(Date.now() + 1728000000), category: "Bills" }
      ]
    });
  }

  console.log("Seeded demo user:", user.email);
}

main().finally(() => prisma.$disconnect());
