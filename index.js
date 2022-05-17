import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Finally API</h1>")
})

app.listen(port, () => 
    console.log(`Server listen on port ${port}`)
);