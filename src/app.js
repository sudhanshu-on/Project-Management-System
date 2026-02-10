import express from "express"
import cors from "cors"

const app = express();

//basic configurations
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:"true",limit:"16kb"}))
app.use(express.static("public"));

//cors configurations
app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","PATCH","DELETE","UPDATE","HEAD","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"]
}))

//import routes
import healthCheckRouter from '../src/routes/healthecheck.route.js'
import registerRouter from "./routes/auth.routes.js";

app.use("/api/v1/auth", registerRouter);

app.use("/api/v1/healthCheckRouter",healthCheckRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to the Home Page of PMS");
})

export default app;