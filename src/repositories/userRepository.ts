import { User as UserModel } from "../models/index.js"

export async function getUserByEmail(email:string) {
    const row = await UserModel.findOne({ where: { email } });
    return row ? row.toJSON() : null;
}

export async function insertUser(email:string, passwordHash: string, role: string) {
    const row = await UserModel.create({email, passwordHash, role});
    return row.toJSON();    
}