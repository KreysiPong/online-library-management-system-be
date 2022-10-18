var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const schema = new mongoose.Schema({
    number: "string", // 0001;
    date_received: "date",
    class: "string",
    author: "string",
    title: "string",
    edition: "string",
    volume: "string",
    pages: "number",
    source_of_fund: "string",
    publisher: "string",
    year: "number",
    remarks: "string",
    locator: "string",
    isbn: "string"
});
const Book = mongoose.model('Book', schema);

router.get('/', async function (req, res, next) {
    const data = await Book.find({});
    res.send(data);
});

router.post('/', function (req, res) {
    Book.create(req.body, function (err) {
        if (err) {
            console.log(err);

            res.send({ message: 'Error Creating a book' });
        } else {
            res.send({ message: 'Successfully Created Book' });
        }
    });
})

router.delete('/:id', async (req, res) => {
    const data = await Book.deleteOne({ _id: req.params.id });
    res.send(data);
})

module.exports = router;
