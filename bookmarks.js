const fs = require('fs');

const getBookmarks = async () => {
  const result = await new Promise((resolve, reject) => {
    fs.readFile('./data.json', 'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
  return JSON.parse(result).bookmarks;
};

const setBookmarks = async (bookmarks) => {
  await new Promise((resolve, reject) => {
    fs.writeFile('./data.json', JSON.stringify({ bookmarks }, null, 2), (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  getBookmarks,
  setBookmarks,
};
