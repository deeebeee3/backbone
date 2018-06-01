// Backbone Model
var Blog = Backbone.Model.extend({
    defaults: {
        author: '',
        title: '',
        url: ''
    }
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
var Blogs = Backbone.Collection.extend({});

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
    },

    cancel: function(){
        //just refresh page
        blogsView.render()
    },

    delete: function(){
        this.model.destroy();
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

        console.log(blog.toJSON());
        blogs.add(blog);
    })
});
