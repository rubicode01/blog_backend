import pool from "../db/pg.js";

export const getAllPosts = (req, res) => {
    pool
        .query("SELECT * FROM blog_posts LEFT JOIN images ON blog_posts.image_id = images.id")
        .then((data) => res.status(200).json({ posts: data.rows }))
        .catch((err) => console.log(err));
}