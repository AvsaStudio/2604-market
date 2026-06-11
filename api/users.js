import express from "express";
import bcrypt from "bcrypt";
import { createToken } from "#utils/jwt";
import { createUser, getUserByUsername } from "#db/queries/users";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(400);

  const user = await createUser(username, password);
  const token = createToken({ id: user.id });

  res.status(201).send(token);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(400);

  const user = await getUserByUsername(username);
  if (!user) return res.sendStatus(401);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.sendStatus(401);

  const token = createToken({ id: user.id });
  res.send(token);
});

export default router;
