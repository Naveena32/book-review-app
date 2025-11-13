// client/axiosClient.js
const axios = require('axios');
const BASE = 'http://localhost:3000';

// Task 10: Get all books – Using async callback function (async function that uses a callback)
async function getAllBooksCallback(callback) {
  try {
    const resp = await axios.get(`${BASE}/books`);
    callback(null, resp.data);
  } catch (err) {
    callback(err);
  }
}

// Task 11: Search by ISBN – Using Promises (.then / .catch)
function searchByISBN(isbn) {
  return axios.get(`${BASE}/books/isbn/${isbn}`)
    .then(resp => resp.data)
    .catch(err => { throw err; });
}

// Task 12: Search by Author – Use async/await (returns data)
async function searchByAuthor(author) {
  const resp = await axios.get(`${BASE}/books/author/${encodeURIComponent(author)}`);
  return resp.data;
}

// Task 13: Search by Title – Using Promises
function searchByTitle(title) {
  return axios.get(`${BASE}/books/title/${encodeURIComponent(title)}`)
    .then(resp => resp.data);
}

// Example usage:
if (require.main === module) {
  // Task 10 call
  getAllBooksCallback((err, data) => {
    if (err) return console.error('Task10 error', err.message);
    console.log('Task10 - All books:', data);
  });

  // Task 11
  searchByISBN('9780143126560')
    .then(b => console.log('Task11 - Book by ISBN:', b))
    .catch(e => console.error('Task11 error', e.response ? e.response.data : e.message));

  // Task 12
  (async () => {
    try {
      const byAuthor = await searchByAuthor('Andy Weir');
      console.log('Task12 - By author:', byAuthor);
    } catch (e) { console.error('Task12 error', e.message); }
  })();

  // Task 13
  searchByTitle('Martian')
    .then(list => console.log('Task13 - By title:', list))
    .catch(e => console.error('Task13 error', e.message));
}

module.exports = {
  getAllBooksCallback,
  searchByISBN,
  searchByAuthor,
  searchByTitle
};
