import { Router } from "express";
import { getAllPosts, createPost, getSinglePost, createComment } from "../controllers/postsController.js";

const postsRouter = Router();

postsRouter.route("/")
    .get(getAllPosts)
    .post(createPost);

postsRouter.route("/:id")
    .get(getSinglePost) //Einzelner Post + dazugehörige Kommentare
    // .put(updateSinglePost); OPTIONAL

postsRouter.route("/:id/comments")
    .post(createComment);

postsRouter.route("/:id/likes")
    // .post(likePost); //Karims Part

export default postsRouter;