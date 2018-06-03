var express = require('express');
var mongoose = require('mongoose');
// const MongoInMemory = require('mongo-in-memory');
 
// var port = 8000;
// var mongoServerInstance = new MongoInMemory(port); //DEFAULT PORT is 27017
 
// mongoServerInstance.start((error, config) => {
 
//     if (error) {
//         console.error(error);
//     } else {
 
//         //callback when server has started successfully
 
//         console.log("HOST " + config.host);
//         console.log("PORT " + config.port);
 
//         var mongouri = mongoServerInstance.getMongouri("myDatabaseName");
 
//     }
 
// });

// mongoServerInstance.stop((error) => {
 
//     if (error) {
//         console.error(error);
//     } else {
//         //callback when server has stopped successfully
//     }
 
// });


//open 2 tabs in terminal, in one type mongod, in the other type mongodb
//blogroll db will be created when server.js run
//use show dbs to list dbs, type quit() to quit.
//db folder is in MacHD/data/db
//type: use blogroll > show collections > db.blogs.find().pretty()
mongoose.connect('mongodb://localhost/blogroll');

var Schema = mongoose.Schema;

var BlogSchema = new Schema({
    author: String,
    title: String,
    url: String
});

mongoose.model('Blog', BlogSchema);


var Blog = mongoose.model('Blog');

var blog = new Blog({
    author: 'Michael',
    title: 'Michaels Blog',
    url: 'http://google.co.uk'
});

blog.save().then(function(x){
    console.log(x)
}).catch(function(e){
    console.log(e)
})

var app = express();

app.use(express.static(__dirname + '/public'));

var port = 3000;

app.listen(port);
console.log('server running on port: ' + port);