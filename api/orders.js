import express from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from "#db/queries/orders";
import { getProductById } from "#db/queries/products";
import {
  createOrderProduct,
  getProductsByOrderId,
} from "#db/queries/orders_products";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.use(requireUser);

router.post("/", async (req, res) => {
  const { date, note } = req.body;
  if (!date) return res.sendStatus(400);

  const order = await createOrder(date, note, req.user.id);
  res.status(201).send(order);
});

router.get("/", async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});

router.get("/:id", async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.sendStatus(404);
  if (order.user_id !== req.user.id) return res.sendStatus(403);

  res.send(order);
});

router.post("/:id/products", async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.sendStatus(404);
  if (order.user_id !== req.user.id) return res.sendStatus(403);

  const { productId, quantity } = req.body;
  if (!productId || quantity === undefined) return res.sendStatus(400);

  const product = await getProductById(productId);
  if (!product) return res.sendStatus(400);

  const orderProduct = await createOrderProduct(order.id, productId, quantity);
  res.status(201).send(orderProduct);
});

router.get("/:id/products", async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) return res.sendStatus(404);
  if (order.user_id !== req.user.id) return res.sendStatus(403);

  const products = await getProductsByOrderId(order.id);
  res.send(products);
});

export default router;
