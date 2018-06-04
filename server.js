var express = require('express');
var bodyParser = require('body-parser');
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

// var blog = new Blog({
//     author: 'Michael',
//     title: 'Michaels Blog',
//     url: 'http://google.co.uk'
// });

// blog.save().then(function(x){
//     console.log(x)
// }).catch(function(e){
//     console.log(e)
// })

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//ROUTES
app.get('/api/blogs', function(req, res){
    Blog.find(function(err, docs){
        docs.forEach(function(item){
            console.log('Recieved a GET request for _id: ' + item._id);
        });
        res.send(docs);
    });
});

app.post('/api/blogs', function(req, res){
    // need to install bodyparser middleware

    console.log('Recieved POST request');

    for(var key in req.body){
        console.log(key + ': ' + req.body[key]);
    }

    var blog = new Blog(req.body);
    blog.save(function(err, doc){
        res.send(doc);
    });
});

app.delete('/api/blogs/:id', function(req, res){
    console.log('Recieved DELETE req for _id: ' + req.params.id);
    Blog.remove({
        _id: req.params.id
    }, function(err){
        res.send({_id: req.params.id})
    });
});

app.put('/api/blogs/:id', function(req, res){
    console.log('Recieved UPDATE req for _id: ' + req.params.id);
    Blog.update({
        _id: req.params.id
    }, 
    req.body, 
    function(err){
        res.send({_id: req.params.id})
    });
});

var port = 3000;

app.listen(port);
console.log('server running on port: ' + port);