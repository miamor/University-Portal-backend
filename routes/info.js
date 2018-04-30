module.exports = function(db) {
    var module = {};

    module.getSiteInfo = function(req, res) {
        db.collection('site_info', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items[0]);
            });
        });
    };

    return module;
}
