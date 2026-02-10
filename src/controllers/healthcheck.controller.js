import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";


// const healthCheckController = async (req, res, next) => {
//     // const user = await getUserFromDB()
//     try {
//         res.status(200).json(
//             new ApiResponse(200, { message: "Server is running" }),
//         );
//     } catch (error) {
//         next(err)
//     }
// };


const healthCheckController = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { message: "Server is running"}),
    );
});

export { healthCheckController };
