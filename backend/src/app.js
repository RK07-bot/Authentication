import express from "express"
import morgan from "morgan"
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import config from "./config/env.js";
import errorHandler from "./middlewares/error.middleware.js";


const app=express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:config.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT","DELETE","OPTIONS"]
}))



app.use("/api/auth",authRouter);
app.use(errorHandler)



export default app;