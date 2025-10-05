FixForge Backend Mock
---------------------

Structure:
Backend/
  node_modules/       (not included)
  uploads/            (uploaded files will be saved here)
  env/
    .env
  index.js
  package.json
  package-lock.json
  posts.json

Run:
  npm install
  npm start

API:
  GET /api/posts       -> list posts
  POST /api/posts      -> create post (multipart/form-data: title, content, image file)
  GET /uploads/<file>  -> serve uploaded images
