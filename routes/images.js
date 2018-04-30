module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving image: ' + id);
        db.collection('gallery_images', function(err, collection) {
            collection.findOne({_id:ObjectID(id)}, function(err, item) {
                console.log(item);
                res.send(item);
            })
        });
    };

    module.findAllInModule = function(req, res) {
        var moduleLink = req.params.module;
        db.collection('gallery_images', function(err, collection) {
            collection.find({module:moduleLink}).toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    module.findAll = function(req, res) {
        db.collection('gallery_images', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    return module;
}
