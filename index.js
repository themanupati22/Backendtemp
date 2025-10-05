const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config({ path: path.join(__dirname, 'env', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Simple posts storage (file)
const POSTS_FILE = path.join(__dirname, 'posts.json');
function readPosts(){
  try {
    const raw = fs.readFileSync(POSTS_FILE);
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
function writePosts(posts){
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Routes
app.get('/', (req, res) => {
  res.json({ ok: true, message: ' backend running' });
});

app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

app.post('/api/posts', upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const file = req.file;
  const posts = readPosts();
  const newPost = {
    id: Date.now(),
    title: title || 'Untitled',
    content: content || '',
    imageUrl: file ? ('/' + path.join(UPLOAD_DIR, path.basename(file.path)).replace(/\\/g,'/')) : null,
    createdAt: new Date().toISOString()
  };
  posts.unshift(newPost);
  writePosts(posts);
  res.json(newPost);
});

// serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, UPLOAD_DIR)));
app.use('/' + UPLOAD_DIR, express.static(path.join(__dirname, UPLOAD_DIR)));

// Start
app.listen(PORT, () => {
  console.log(` backend listening on port ${PORT}`);
});
