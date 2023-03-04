const express = require('express')
const app = express();
const methodOverride = require('method-override')
require('dotenv').config();
const Fruit = require('./models/fruit.js');

const mongoose = require('mongoose');

// Database Connection
mongoose.connect(process.env.DATABASE_URL);

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
//Body parser: Add JSON data from request to the request object
app.use(express.json())
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
// method override 
// This will allow us to make DELETE and PUT requests
app.use(methodOverride('_method'))

//ROUTES 

// INDEX ROUTE
app.get('/fruits', (req, res) => {
	Fruit.find({}, (err, foundFruit) => {
		if(err){console.log(err.message)}
		// console.log(foundFruit[0])
		res.render('index.ejs', {
			fruits: foundFruit
		})
	})
})



// POST FRUIT DATA TO DB
app.post('/fruits', (req, res) => {
	if (req.body.readyToEat === 'on') {
		//if checked, req.body.readyToEat is set to 'on'
		req.body.readyToEat = true;
	} else {
		//if not checked, req.body.readyToEat is undefined
		req.body.readyToEat = false;
	}
    // console.log(req.body, 'THIS IS FRUIT ')
	Fruit.create(req.body, (error, createdFruit) => {
        // console.log(error, "THIS IS THE ERROR")
        console.log(createdFruit, 'CREATED FRUIT')
		res.redirect('/fruits') //<--- redirect to index.ejs
		// res.redirect('/fruits/' + createdFruit.id); <-- redirect to a single show page
	});
});

// RENDER NEW FRUIT PAGE
app.get('/fruits/new', (req,res) => {
    res.render('new.ejs')
})

app.get('/fruits/seed', (req, res) =>{
	Fruit.create([
		{
            name:'grapefruit',
            color:'pink',
            readyToEat:true
        },
        {
            name:'grape',
            color:'purple',
            readyToEat:false
        },
        {
            name:'avocado',
            color:'green',
            readyToEat:true
        }
	], (err, data) => {
		res.redirect('/fruits')
	})
})

app.get('/fruits/:id', (req, res) => {
	Fruit.findById(req.params.id, (err, foundFruit) => {
		if(err){console.log(err.message)}
		res.render('show.ejs', {
			fruit: foundFruit
		})
	})
})

// setup our DELETE route 
app.delete('/fruits/:id', (req, res) => {
	Fruit.findByIdAndDelete(req.params.id, (err, 
	deletedFruit) =>{
		if(err) {
			console.log(err)
			res.send(err)
		} else {
			console.log(deletedFruit)
			res.redirect('/fruits')
		}
	})
})



// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listning on port: ${PORT}`));