import { Router } from "express";
import { logOutUser, registerUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator, userLoginValidator } from "../validators/index.js";
import { login } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/register")
    .post(userRegisterValidator(), validate, registerUser);

router
    .route("/login")
    .post(userLoginValidator(), validate, login);

router
    .route("/logout")
    .post(verifyJWT, logOutUser)

export default router;
