import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json(user);

  } catch (error) {
  console.log(error);

  res.status(500).json({
    message: "Server Error"
  });
}
};


export const login = async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};