import express from "express";
import bcrypt from "bcrypt";
import { createToken } from "#utils/jwt";
import { createUser, getUserByUsername } from "#db/queries/users";
import requireBody from "#middleware/requireBody";

const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await createUser(username, password);
      const token = createToken({ id: user.id });

      res.status(201).send(token);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await getUserByUsername(username);
      if (!user) return res.sendStatus(401);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.sendStatus(401);

      const token = createToken({ id: user.id });
      res.send(token);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
