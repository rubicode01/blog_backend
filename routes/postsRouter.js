import { Router } from "express";
import { getAllPosts } from "../controllers/postsController.js";

const postsRouter = Router();

postsRouter.route("/").get(getAllPosts);

export default postsRouter;