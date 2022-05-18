import "dotenv/config";
import express from "express";
import postsRouter from "./routes/postsRouter.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/posts", postsRouter);

app.listen(port, () => 
    console.log(`Server listen on port ${port}`)
);