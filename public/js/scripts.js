//Get backbone to use the _id (as saved in mongo) rather than its default id
Backbone.Model.prototype.idAttribute = '_id';

// Backbone Model
var Blog = Backbone.Model.extend({
    defaults: {
        author: '',
        title: '',
        url: ''
    },
    url: 'http://localhost:3000/api/blogs'
});

var blog1 = new Blog({
    author: 'Michael',
    title: 'Michael\'s Blog',
    url: 'http://michaelsblog.com'
});

var blog2 = new Blog({
    author: 'John',
    title: 'John\'s Blog',
    url: 'http://johnsblog.com'
});

// Backbone Collection
var Blogs = Backbone.Collection.extend({
    url: 'http://localhost:3000/api/blogs'
});

// Add Models to Collection
var blogs = new Blogs(/*[blog1, blog2]*/);

// Backbone view for one blog
var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    template: _.template($('.blogs-list-template').html()),

    initialize: function(){},

    events: {
        'click .edit-blog' : 'edit',
        'click .update-blog' : 'update',
        'click .cancel' : 'cancel',
        'click .delete-blog': 'delete'
    },

    edit: function(){
        $('.edit-blog').hide();
        $('.delete-blog').hide();
        this.$('.update-blog').show();
        this.$('.cancel').show();

        var author = this.$('.author').html();
        var title = this.$('.title').html();
        var url = this.$('.url').html();

        this.$('.author').html('<input type="text" class="form-control author-update" value="' + author + '">');
        this.$('.title').html('<input type="text" class="form-control title-update" value="' + title + '">');
        this.$('.url').html('<input type="text" class="form-control url-update" value="' + url + '">');
    },

    update: function(){
        this.model.set({
            'author': $('.author-update').val(),
            'title': $('.title-update').val(),
            'url': $('.url-update').val()
        });

        this.model.save(null, {
            success:function(response){
                console.log('successfully UPDATE blog with _id; ' + response.toJSON()._id);
            },
            error: function(e){
                console.log('Failed to UPDATE blog: ' + e.toJSON());
            }
        })
    },

    cancel: function(){
        //just refresh page
        blogsView.render()
    },

    delete: function(){
        this.model.destroy({
            success: function(response){
                console.log('successfully DELETE blog with _id; ' + response.toJSON()._id);
            },
            error: function(){
                console.log('Failed to DELETE blog!');
            }
        });
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

// Backbone view for all blogs
var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),

    initialize: function(){
        //if this not passed, the render methods context will be the model everytime on add 
        //called and render will not know what this.$el is...
        this.model.on('add', this.render, this);
        this.model.on('change', this.render, this);
        this.model.on('remove', this.render, this);

        //GET request - fetch from url to our api 'http://localhost:3000/api/blogs'
        this.model.fetch({
            success: function(response){
                if(response){
                    _.each(response._byId, function(item){
                        console.log('got blog with _id: ' + item.id);
                    });
                }
            },
            error: function(){
                console.log('oops failed to get blogs!');
            }
        });
    },

    render: function(){
        var self = this;

        this.$el.html('');

        _.each(this.model.toArray(), function(blog){
            //render the 'tr' element from the BlogView
            self.$el.append((new BlogView({model: blog})).render().$el);
        });
    }
});

var blogsView = new BlogsView();

$(document).ready(function(){
    $('.add-blog').on('click', function(){
        var blog = new Blog({
            author: $('.author-input').val(),
            title: $('.title-input').val(),
            url: $('.url-input').val(),
        });

        $('.author-input').val('');
        $('.title-input').val('');
        $('.url-input').val('');



        blogs.add(blog);

        // Make a POST request to 'http://localhost:3000/api/blogs'
        blog.save(null, {
            success: function(response){
                console.log('successfully saved with _id: ' + response.toJSON()._id);
            },
            error: function(){
                console.log('failed to save blog!');
            }
        })
    })
});
