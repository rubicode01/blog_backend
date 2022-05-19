import { Router } from "express";
import { getAllAuthors } from "../controllers/authorsController";

const postsRouter = Router();

postsRouter.route("/").get(getAllAuthors);

export default authorsRouter;