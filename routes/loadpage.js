module.exports = function (db) {
    var module = {};

    module.loadData = function (req, res) {

        Promise.all([
            // each of these returns a promise
            db.collection('site_info').find().toArray(),
            db.collection('modules').find({ show: "true", show_nav: "true" }, { _id: 1, link: 1, parent: 1, text: 1 }).toArray()
        ]).then(function (results) {
            // results is [site_info, modules]
            data = {};
            data.info = results[0];
            data.modules = results[1];
            res.send(data);
        }).catch(function (err) {
            res.send(err);
        });

        /*let data = {};
        db.collection('site_info', function (err, collection) {
            collection.find().toArray(function (err, items) {
                //res.send(items[0]);
                data.info = items[0];
                console.log(items[0]);
            });
        });
        db.collection('modules', function (err, collection) {
            collection.find({ show: "true", show_nav: "true" }, { _id: 1, link: 1, parent: 1, text: 1 }).toArray(function (err, items) {
                //res.send(items);
                data.modules = items;
            });
        });
        res.send(data);*/
    };

    return module;
}
