import express from "express";
import { getProductById, getProducts } from "#db/queries/products";
import { getOrdersByProductId } from "#db/queries/orders_products";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.sendStatus(404);

  res.send(product);
});

router.get("/:id/orders", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) return res.sendStatus(404);
  if (!req.user) return res.sendStatus(401);

  const orders = await getOrdersByProductId(req.params.id, req.user.id);
  res.send(orders);
});
export default router;
