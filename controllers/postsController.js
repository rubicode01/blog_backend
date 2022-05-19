import pool from "../db/pg.js";

export const getAllPosts = (req, res) => {
  pool
    .query(
      "SELECT b.id, b.title, b.date, b.content, i.url, i.description, a.first_name, a.last_name  FROM blog_posts b JOIN images i ON b.image_id = i.id JOIN authors a on b.author_id = a.id"
    )
    .then((data) => res.status(200).json({ posts: data.rows }))
    .catch((err) => console.log(err));
};

//POST
export const createPost = (req, res) => {
  const { first_name, last_name, title, content, url, description } = req.body;
  let auth_id;
  let img_id;

  //Überprüfen ob es den Autor schon gibt, wenn nicht einen erstellen. Die ID speichern
  pool
    .query("SELECT * FROM authors WHERE first_name = $1 AND last_name = $2", [
      first_name,
      last_name,
    ])
    .then((auth) => {
      if (auth.rowCount == 0) {
        pool
          .query(
            "INSERT INTO authors (first_name, last_name) VALUES ($1, $2) RETURNING *",
            [first_name, last_name]
          )
          .then((new_auth) => (auth_id = new_auth.rows[0].id))
          .catch((err) => res.json(err))
      } else {
        auth_id = auth.rows[0].id;
        console.log("hi");
      }
      
      //Überprüfen ob es das Bild schon gibt, wenn nicht eins erstellen. Die ID speichern
      pool.query("SELECT * FROM images WHERE url = $1", [url]).then((img) => {
        if (img.rowCount == 0) {
          pool
            .query(
              "INSERT INTO images (url, description) VALUES ($1, $2) RETURNING *",
              [url, description]
            )
            .then((new_img) => (img_id = new_img.rows[0].id))
            .catch((err) => res.json(err))
        } else {
          img_id = img.rows[0].id;
        }
        
        //Blogpost erstellen. Dazu werden die gespeicherten IDs verwendet
        pool
          .query(
              "INSERT INTO blog_posts (title, content, image_id, author_id, date) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
              [title, content, img_id, auth_id]
            )
            .then((data) => res.status(200).json(data.rows[0]))
            .catch((err) => res.json(err))
        });
    });
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

//POST
export const createComment = (req, res) => {
  const { name, comment } = req.body;
  const { id } = req.params;

  pool.query("INSERT INTO comments (name, comment, post_id, date) VALUES($1, $2, $3, NOW()) RETURNING *", [name, comment, id])
  .then((data) => res.status(201).json(data.rows[0]))
  .catch((err) => res.status(500).json(err))

}

//UPDATE
export const likePost = (req, res) => {
  const { id } = req.params;

  pool.query("UPDATE blog_posts SET likes = likes + 1 WHERE id = $1 RETURNING *", [id])
  .then((data) => res.status(200).json(data.rows[0]))
  .catch((err) => res.status(500).json(err))
}
