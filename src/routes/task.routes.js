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
import {
    createTask,
    deleteTask,
    getTaskDetail,
    getTasks,
    updateTask,
} from "../controllers/task.controllers.js";

const router = Router();
router.use(verifyJWT);

router
    .route("/:projectId")
    .get(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
            UserRolesEnum.MEMBER,
        ]),
        getTasks(),
    )
    .post(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
        ]),
        createTask(),
    );

router
    .route("/:projectId/t/:taskId")
    .get(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
            UserRolesEnum.MEMBER,
        ]),
        getTaskDetail(),
    )
    .put(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
        ]),
        updateTask(),
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
        deleteTask()
    )

export default router;
