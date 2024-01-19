const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const author = require("../model/authorModel");

// registerAuthor
exports.registerAuthor = async (req, res) => {
  try {
    const authData = req.body;
    const alreadyAuthor = await author.findOne({
      email: authData.email,
    });
    if (alreadyAuthor) {
      return res.send(`Author with ${authData.email} already exist!`);
    }
    // hash password
    const hashedPassword = await bcrypt.hash(authData.password, 12);
    authData.password = hashedPassword;
    console.log(authData.password);
    // store in DB author data
    const createdAuthor = await author.create(authData);
    // console.log(createdAuthor);

    res.send(createdAuthor);
  } catch (error) {
    // console.log(new Error());
    res.send("Error while creating author", error);
  }
};

// login
exports.loginAuthor = async (req, res) => {
  try {
    const authData = req.body;

    const findAuthor = await author.findOne({
      email: authData.email,
    });
    if (findAuthor) {
      // verify password
      const checkPassword = await bcrypt.compare(
        authData.password,
        findAuthor.password
      );
      if (checkPassword) {
        const token = jwt.sign(
          { _id: findAuthor._id, email: findAuthor.email },
          "book-api"
        );
        return res
          .status(200)
          .cookie("token", token, {
            httpOnly: true,
          })
          .send({
            token: token,
            message: `Successfully Logged in ${findAuthor.name}`,
          });
      } else {
        res.send(`Author password is wrong...Please try again!`);
      }
    } else {
      res
        .status(500)
        .send(
          `Author is not registered with ${authData.email}...Please register!`
        );
    }
  } catch (error) {
    console.log(new Error());
    res.status(500).send("Error while Login author", error);
  }
};

// logout
exports.logoutAuthor = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (token) {
      return res
        .status(200)
        .cookie("token", "", {
          httpOnly: true,
          expires: new Date(0),
        })
        .send(`Successfully looged out...Please login again!`);
    } else {
      return res.send("Error in finding the access token");
    }
  } catch (error) {
    console.log(new Error());
    res.status(500).send("Error while Logout author", error);
  }
};

// author/me route
exports.authorDetails = async (req, res) => {
  //authenticated success
  res.send(req.author);
};

// all authors details
exports.authors = async (req, res) => {
  try {
    const fetchAuthors = await author.find();
    res.send(fetchAuthors);
  } catch (error) {
    console.log(new Error());
    res.status(500).send("Error while fetching authors", error);
  }
};

// author/:id
exports.getAuthorBooks = async (req, res) => {
  try {
    const param = req.params.id;
    if (!param || typeof param !== "string") {
      throw new Error("Invalid author ID parameter");
    }
    var fetchAuthor = await author.findById(param);
    fetchAuthor = { ...fetchAuthor, totalBooks: fetchAuthor.Publishment.length };

    res.send(fetchAuthor);
  } catch (error) {
    console.log(new Error());
    res.status(500).send("Error while fetching authors", error);
  }
};
