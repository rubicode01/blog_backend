import pool from "../db/pg.js";

export const getAllPosts = (req, res) => {
  pool
    .query(
      "SELECT b.id, b.title, b.date, b.content, i.url, i.description, a.first_name, a.last_name  FROM blog_posts b JOIN images i ON b.image_id = i.id JOIN authors a on b.author_id = a.id"
    )
    .then((data) => res.status(200).json({ posts: data.rows }))
    .catch((err) => console.log(err));
};

//In Arbeit
export const createPost = (req, res) => {
  const { first_name, last_name, title, content, url, description } = req.body;

  pool.query("INSERT INTO blog_posts (first_name, last_name, title, content)");
};

export const getSinglePost = (req, res) => {
  const { id } = req.params;

  pool
    .query(
      `SELECT b.id, b.title, b.date, b.content, 
              i.url, i.description, 
              a.first_name, a.last_name 
       FROM blog_posts b 
       JOIN images i 
       ON b.image_id = i.id 
       JOIN authors a 
       ON b.author_id = a.id
       WHERE b.id = $1`,
      [id]
    )
    .then((data) => {
      if (data.rowCount == 0) {
        res.status(404).send("There is no post matching this id");
      } else {
        pool
          .query("SELECT * FROM comments WHERE $1 = comments.post_id", [id])
          .then((comments_response) =>
            res
              .status(200)
              .json({ post: data.rows[0], comments: comments_response.rows })
          )
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
};
