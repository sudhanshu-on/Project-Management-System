import { Router } from "express";
import {
    getProjectById,
    getProjects,
    getProjectMembers,
    addProjectMember,
    updateProjectById,
    updateProjectMemberRole,
    deleteProjectById,
    removeProjectMember,
    createProject,
} from "../controllers/project.controller.js";
import {
    validateProjectPermission,
    verifyJWT,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
    createProjectValidator,
    addMemberProjectValidator,
    updateProjectValidator,
} from "../validators/index.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

//secured routes
router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createProject);
router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRoles), getProjectById)
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        updateProjectValidator(),
        validate,
        updateProjectById,
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteProjectById,
    );
router
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        addMemberProjectValidator(),
        validate,
        addProjectMember,
    );
router
    .route("/:projectId/members/:userId")
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        updateProjectMemberRole,
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        removeProjectMember,
    );

export default router;
