const book = require("../model/booksModel");
const author = require("../model/authorModel");

// adding book
exports.addBook = async (req, res) => {
  try {
    // add book details title,likes,author details
    const { title } = req.body;
    const authorId = req.author._id;
    //   console.log(authorId);
    //   console.log(bookDetails);
    const createdBook = await book.create({ title, author: authorId });
    const publishArray = await author.findByIdAndUpdate(authorId, {
      $push: { Publishment: createdBook._id },
    });
    // console.log(createdBook);
    console.log(publishArray);
    res.status(200).send(createdBook);
  } catch (error) {
    console.log(new Error());
    res.status(500).send("Error in creating book in database", error);
  }
};

// list of books
exports.listBooks = async (req, res) => {
  try {
    // list all , likes (increase - decrease),
    const fetchBooks = await book.find();
    res.send(fetchBooks);
  } catch (error) {
    console.log(new Error());
    res.status(500).send("Error in creating book in database", error);
  }
};

//like books
exports.likeBooks = async (req, res) => {
  try {
    const author = req.author._id;
    const param = req.params.id;

    const existingBook = await book.findById(param);
    if (!existingBook) {
      return res.status(404).send("The book you are liking is not available");
    }

    // Check if the author has already liked the book
    if (existingBook.likeBy.includes(author)) {
      return res.send(`The book ${existingBook.title} is already liked`);
    }

    const likedBook = await book.findByIdAndUpdate(
      param,
      {
        $addToSet: { likeBy: author },
        $inc: { likes: 1 },
      },
      { new: true }
    );

    if (!likedBook) {
      return res.status(404).send("The book you are liking is not available");
    }

    res.send(likedBook);

    //old code
    // const fetchBook = await book.findById(param);

    // if (fetchBook) {
    //   if (!fetchBook.likeBy.includes(author)) {
    //     fetchBook.likes += 1;
    //     fetchBook.likeBy.push(author);
    //     const likedBook = await book.findByIdAndUpdate(param, fetchBook, {
    //       new: true,
    //     });
    //     res.send(likedBook);
    //   } else {
    //     res.send(`The book ${fetchBook.title} is already liked`);
    //   }
    // } else {
    //   res.send("The book you are liking not not available");
    // }
  } catch (error) {
    console.log(new Error());
    res.status(500).send("Error in liking book in database", error);
  }
};

// unlike books
exports.unlikeBooks = async (req, res) => {
  try {
    const author = req.author._id;
    const param = req.params.id;
    const existingBook = await book.findById(param);
    if (!existingBook) {
      return res.status(404).send("The book you are unliking is not available");
    }
    // Check if the author has liked the book
    if (!existingBook.likeBy.includes(author)) {
      return res.send(
        `The book ${existingBook.title} is not liked by the user`
      );
    }
    const unlikedBook = await book.findByIdAndUpdate(
      param,
      {
        $pull: { likeBy: author },
        $inc: { likes: -1 },
      },
      { new: true }
    );
    res.send(unlikedBook);
  } catch (error) {
    console.log(new Error());
    res.status(500).send("Error in liking book in database", error);
  }
};
