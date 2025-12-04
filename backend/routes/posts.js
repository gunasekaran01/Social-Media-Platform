import express from "express";
import multer from "multer";
import Post from "./models/Post.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Create Post
router.post("/create", upload.single("image"), async (req, res) => {
  const post = new Post({
    user: req.body.user,
    text: req.body.text,
    image: req.file ? req.file.path : null,
  });

  await post.save();
  res.json({ message: "Post created" });
});

// Get All Posts
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Like Post
router.post("/like/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes += 1;
  await post.save();
  res.json({ message: "Liked" });
});

// Comment
router.post("/comment/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ user: req.body.user, text: req.body.text });
  await post.save();
  res.json({ message: "Comment Added" });
});

export default router;
