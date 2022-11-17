const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://advent:${password}@cluster0.j3mn3gt.mongodb.net/noteApp?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema);

mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')

        const note = new Note({
            content: 'Two lefts do not make a right.',
            date: new Date(),
            important: true,
        })

        return note.save();
    })
    .then((result) => {
        console.log('note saved!');
        console.log(result);
        return mongoose.connection.close();
    })
    .catch((err) => console.log(err))