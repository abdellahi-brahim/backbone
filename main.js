var SmartPhone = Backbone.Model.extend({
});

var SmartPhones = Backbone.Collection.extend({
    model: SmartPhone,
    url: "https://api.restful-api.dev/objects"
});

smartPhones = new SmartPhones();

smartPhones.fetch({
    success: function() {
        console.log(smartPhones.at(0));
    }
});

var Song = Backbone.Model.extend({
    defaults: {
        genre: "Default Name"
    },
    initialize: function(){
        console.log("New song has been created!");
    },
    validate: function(attrs) {
        if(!attrs.title)
            return "Title is required!"
    }
});


var Songs = Backbone.Collection.extend({
    model: Song
});

var songs = new Songs([
    new Song({ id: 1, title: "Song 1" }),
    new Song({ id: 2, title: "Song 2" }),
    new Song({ id: 3, title: "Song 3" })
]);

songs.add(new Song({ id: 4, title: "Song 4" }));

var SongView = Backbone.View.extend({
    events: {
        "click": "onClick",
        "click .favorite": "onClickFavorite"
    },
    initialize: function() {
        this.model.on("change", this.onModelChange, this);
    },
    onClickFavorite: function(e) {
        e.stopPropagation();
        console.log("On click favorite");
    },
    onClick: function() {
        console.log("clicked");
    },
    onModelChange: function() {
        this.render();
    },
    render: function() {
        var template = _.template($("#songTemplate").html());
        var html = template(this.model.toJSON());
        this.$el.html(html);

        return this;
    }
});

var SongsView = Backbone.View.extend({
    className: "list-group",
    initialize: function() {
        this.model.on("add", this.onSongAdded, this);
        this.model.on("remove", this.onSongRemoved, this);
    },
    onSongAdded: function(song) {
        var songView = new SongView({model: song});
        this.$el.append(songView.render().$el);
    },
    onSongRemoved: function(song) {
        this.$("li#"+song.id).remove();
    },
    render: function() {
        var self = this;
        this.model.each(function(song) {
            var songView = new SongView({ model: song });
            self.$el.append(songView.render().$el);
        });
        return this;
    }
});

var songsView = new SongsView({ el: "#songs", model: songs });
songsView.render();
