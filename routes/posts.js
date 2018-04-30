module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var id = req.params.id;
        console.log('Retrieving post: ' + id);
        db.collection('posts', function(err, collection) {
            collection.findOne({_id:ObjectID(id)}, function(err, item) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    console.log(item);
                    item.link = '{{MAIN_URL}}/article/'+item.link;
                    res.send(item);
                }
            })
        });
    };

    module.findByLink = function(req, res) {
        var link = req.params.link;
        console.log('Retrieving post: ' + link);
        db.collection('posts', function(err, collection) {
            collection.findOne({link:link}, function(err, item) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    console.log(item);
                    item.link = '{{MAIN_URL}}/article/'+item.link;
                    res.send(item);
                }
            })
        });
    };

    module.findAll = function(req, res) {
        var page = Number(req.query.page);
        var lim = Number(req.query.limit);
        var skipNum = (page-1)*lim;
        db.collection('posts', function(err, collection) {
            collection.find().limit(lim).skip(skipNum).toArray(function(err, items) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    for (i = 0; i < items.length; i++) items[i].link = '{{MAIN_URL}}/article/'+items[i].link;
                    res.send(items);
                }
            });
        });
    };

    module.findAllInCats = function(req, res) {
        var page = Number(req.query.page);
        var lim = Number(req.query.limit);
        var skipNum = (page-1)*lim;
        
        var cats = req.params.cats.split(',');
        console.log('Retrieving posts from cats: ' + cats);
        db.collection('posts', function(err, collection) {
            collection.find({ cat : { $in: cats } }).limit(lim).skip(skipNum).toArray(function(err, items) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    for (i = 0; i < items.length; i++) items[i].link = '{{MAIN_URL}}/article/'+items[i].link;
                    res.send(items);
                }
            });
        });
    };

    return module;
}
