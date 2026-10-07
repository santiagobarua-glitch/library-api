import { Request, Response } from "express";
import { registerService, loginService } from "../services/users.service.js";

export async function register(req: Request, res: Response) {
    const result = await registerService(req.body.email, req.body.password);
    if (result === "EMAIL_TAKEN") return res.status(409).json({ error: "Email already registered" });
    res.status(201).json({ message: "Usuario creado" });    
}

export async function login(req: Request, res: Response) {
    const result = await loginService(req.body.email, req.body.password);
    if (result === "INVALID_CREDENTIALS") return res.status(400).json({ message: "Crenciales invalidas"});
    res.json({token: result});    
}