import pool from "../db/pg.js";

export const getAllAuthors = (req, res) => {

    pool.query("SELECT * FROM authors")
    .then((data) => res.status(200).json(data.rows))
    .catch((err) => res.status(500).json(err))
}