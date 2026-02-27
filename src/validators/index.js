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
};

const userLoginValidator = () => {
    return [
        body("username")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("username is required"),
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

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required"),
        body("newPassword").notEmpty().withMessage("New password is required"),
    ];
};

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("email is required")
            .isEmail()
            .withMessage("email is invalid"),
    ];
};

const userResetForgotPasswordValidator = () => {
    return [body("newPassword").notEmpty().withMessage("password is required")];
};

const createProjectValidator = () => {
    return [
        body("projectName").notEmpty().withMessage("projectName is required"),
        body("description").optional(),
    ];
};

const updateProjectValidator = () => {
    return [
        body("updatedName").optional().isString().notEmpty(),
        body("updatedDescription").optional().isString().notEmpty(),        
    ]
}

const addMemberProjectValidator = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("role").notEmpty().withMessage("Role is required"),
    ];
};

export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    updateProjectValidator,
    addMemberProjectValidator,
};
