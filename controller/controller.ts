import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
const prisma = new PrismaClient();
import { NextFunction } from "express";

export async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
}

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Login successful" });
    });
  })(req, res, next);
};

export async function googleLogin(req: Request, res: Response) {
  try {
    const user = req.user as any;

    let existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          googleId: user.id,
        },
      });
    }

    req.logIn(existingUser, (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      res.redirect("/");
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function addItem(req: Request, res: Response) {
  const { name, price } = req.body;

  try {
    await prisma.item.create({
      data: {
        name,
        price: parseFloat(price),
      },
    });
    return res.status(201).json({ message: "Item added successfully" });
  } catch (err: any) {
    console.error("Error:", err.message);
    return res.status(500).json({ message: "Failed to add item" });
  }
}

export async function getItems(req: Request, res: Response) {
  try {
    const products = await prisma.item.findMany();
    return res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching items:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteItem(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.item.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSingleItem(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const product = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateItem(req: Request, res: Response) {
  const { id } = req.params;
  const { name, price, updatedAt } = req.body;

  try {
    await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        updatedAt: updatedAt.toString(),
      },
    });
    return res.status(200).json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("Error updating item:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSession(req: Request, res: Response) {
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: "Authenticated" });
  }
  return res.status(401).json({ message: "Unauthenticated" });
}

export function logOut(req: Request, res: Response, next: NextFunction) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}
