module.exports = function(db) {
    var module = {};

    module.findAllActive = function(req, res) {
        db.collection('js', function(err, collection) {
            collection.find({active:"true"}).toArray(function(err, items) {
                res.send(items);
            });
        });
    };

    return module;
}
