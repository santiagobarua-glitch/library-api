import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import { sequelize } from "../db/connection.js";

// Tabla: users
// ───────────
// id            INTEGER PK AUTOINCREMENT
// email         VARCHAR(255) NOT NULL UNIQUE
// passwordHash  VARCHAR(255) NOT NULL
// role          VARCHAR(50)  NOT NULL DEFAULT 'user'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare passwordHash: string;
    declare role: CreationOptional<string>; 
}

User.init(
    {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: {type: DataTypes.STRING(255), allowNull: false, unique: true,validate: { isEmail: true }},
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "user" },
    },
    {sequelize,tableName: "users",timestamps: false}
);