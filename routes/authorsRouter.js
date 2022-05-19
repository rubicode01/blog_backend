import { Router } from "express";
import { getAllAuthors } from "../controllers/authorsController.js";

const authorsRouter = Router();

authorsRouter.route("/").get(getAllAuthors);

export default authorsRouter;