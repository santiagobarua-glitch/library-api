import { Router } from 'express';
import Joi from 'joi';
import { register, login } from '../controllers/userController.js';
import { validate } from "../middleware/validate.js";

const router = Router();
const credentialsSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

router.post('/register', validate(credentialsSchema), register);
router.post('/login', validate(credentialsSchema), login);

export default router;