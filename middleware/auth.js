const author = require("../model/authorModel")
const jwt = require("jsonwebtoken");


const authentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (token) {
      const decoded = jwt.verify(token, "book-api");
      if (decoded) {
        const matchAuthor = await author.findById(decoded._id);
        if (matchAuthor) {
          console.log(matchAuthor)
          req.author = matchAuthor;
          next();
        }else{
            res.send("author doesnt match with token id")
        }
      }else{
        res.send("token is not matched..")
      }
    } else {
      res.send("Requesting for token in not available");
    }
  } catch (error) {
    console.log(new Error());
    res.status(500).send("Author is not logged in..Please Login!", error);
  }
};

module.exports = authentication
