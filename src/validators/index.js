import { body } from "express-validator";

const userRegisterValidator = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("username must not be empty")
        .isLowercase()
        .withMessage("username must be in lowercase"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email must not be empty")
        .isEmail()
        .withMessage("email is invalid"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password must not be empty"),
    body("role")
        .trim()
        .notEmpty()
        .withMessage("role must not be empty")
]

export {userRegisterValidator};