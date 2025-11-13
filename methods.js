// methods.js
const axios = require("axios");

// Base URL of your local server
const BASE_URL = "http://localhost:3000";

// ✅ Task 10: Get all books – using async/await with callback
async function getAllBooks(callback) {
  try {
    const res = await axios.get(`${BASE_URL}/books`);
    callback(null, res.data);
  } catch (err) {
    callback(err);
  }
}

// ✅ Task 11: Search by ISBN – using Promises
function searchByISBN(isbn) {
  return axios
    .get(`${BASE_URL}/books/isbn/${isbn}`)
    .then((res) => res.data)
    .catch((err) => console.error(err.message));
}

// ✅ Task 12: Search by Author – using async/await
async function searchByAuthor(author) {
  try {
    const res = await axios.get(`${BASE_URL}/books/author/${author}`);
    return res.data;
  } catch (err) {
    console.error(err.message);
  }
}

// ✅ Task 13: Search by Title – using async/await
async function searchByTitle(title) {
  try {
    const res = await axios.get(`${BASE_URL}/books/title/${title}`);
    return res.data;
  } catch (err) {
    console.error(err.message);
  }
}

// Run the functions (demo)
getAllBooks((err, data) => {
  if (err) console.error("Error fetching books:", err);
  else console.log("All Books:", data);
});

searchByISBN("102").then((data) => console.log("Search by ISBN:", data));
searchByAuthor("Author A").then((data) =>
  console.log("Search by Author:", data)
);
searchByTitle("Book One").then((data) => console.log("Search by Title:", data));
