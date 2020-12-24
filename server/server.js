let express = require('express')
let app = express();

// This bypasses security sandbox for working on mulitple local servers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* This will help get the params sent with a POST request. It will create req.body. Also, parse application/x-www-form-urlencoded */
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); // parse application/json

////////////////////////////////////////////////////////

// Passport code dealing with authenticaltion
require('./auth')(app);

// Set up mongoose to connect to mongodb "product_builder" database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/product_builder', { useMongoClient: true });
mongoose.Promise = global.Promise;


// Creates routes with associated files
app.use('/pages', require('./routes/pages'))
app.use('/choices', require('./routes/choices'))
app.use('/playlists', require('./routes/playlists'))
app.use('/users', require('./routes/users'))
app.use('/courses', require('./routes/courses'))
app.use('/images', require('./routes/images'))
app.use('/themes', require('./routes/themes'))
app.use('/user-answers', require('./routes/user_answers'))

////////////////////////////////////////////////////////


// Servers public folder
app.use(express.static('public')); // public/css/style.css -> http://localhost/css/style.css
app.use('/files', express.static('uploads')); // file uploads/eac.jpg -> localhost/files/eac.jpg


// Get the database collection names
app.get('/collectionNames', (req,res)=> {

	mongoose.connection.db.collections(function(error, collections) {
		if (error) {
			throw new Error(error);
		} 
		else {

			let collectionNames = collections.map(function(collection) {
				return collection.s.name;
			})

			res.send(collectionNames);	
		}
	});
})

////////////////////////////////////////////////////////

const port = 2000;
app.listen(port, ()=> {console.log(`server started on port ${port}`)})