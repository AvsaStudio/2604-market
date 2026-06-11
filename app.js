import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";

import usersRouter from "#api/users";
import productsRouter from "#api/products";
import ordersRouter from "#api/orders";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

export default app;
