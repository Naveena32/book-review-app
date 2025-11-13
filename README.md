📚 Book Review App

A simple Node.js + Express app for browsing books and managing reviews.
Users can register, log in, and add, edit, or delete book reviews.

⚙️ Tech Stack

🟢 Node.js · 🚀 Express.js · 💾 JSON Storage · 🔐 JWT Auth

🧠 Features

📘 View all books

🔍 Search by ISBN, author, or title

✍️ Add or edit reviews (registered users)

❌ Delete your review

🔗 API Routes
Method	Endpoint	Description
GET	/books	All books
POST	/register	Register user
POST	/login	Login
POST	/auth/review/:isbn	Add/Edit review
DELETE	/auth/review/:isbn	Delete review
▶️ Run Locally
npm install
node app.js


Server runs on http://localhost:4000
