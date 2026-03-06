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
import {
    AvailableUserRoles,
    TaskStatusEnum,
    UserRolesEnum,
} from "../utils/constants.js";
import {
    createSubtask,
    deleteSubtask,
    updateSubtask,
} from "../controllers/subtask.controller.js";

const router = Router();
router.use(verifyJWT);

router
    .route("/:projectId/t/:taskId/subtasks")
    .post(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
        ]),
        createSubtask(),
    );
router
    .route("/:projectId/st/:subTaskId")
    .put(updateSubtask())
    .delete(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN,
        ]),
        deleteSubtask()
    )

export default router;
