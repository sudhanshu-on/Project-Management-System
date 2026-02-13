import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
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
        body("role").trim().notEmpty().withMessage("role must not be empty"),
    ];
}
const userLoginValidator = () => {
    return [
        body("username").optional().trim().notEmpty().withMessage("username is required"),
        body("email")
            .optional()
            .trim()
            .isEmail()
            .withMessage("email is invalid")
            .notEmpty()
            .withMessage("email is required"),
        body("password").trim().notEmpty().withMessage("password is required"),
    ];
};
export { userRegisterValidator, userLoginValidator };
