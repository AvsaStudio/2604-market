import db from "#db/client";

import { createOrder } from "#db/queries/orders";
import { createOrderProduct } from "#db/queries/orders_products";
import { createProduct } from "#db/queries/products";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 10; i++) {
    await createProduct("Product " + i, "Description " + i, i * 10);
  }

  const user = await createUser("user", "password");

  const order = await createOrder("2026-06-10", "order", user.id);

  for (let i = 1; i <= 5; i++) {
    await createOrderProduct(order.id, i, i);
  }
}
