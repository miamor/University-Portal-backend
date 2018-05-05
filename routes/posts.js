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
                    //console.log(item);
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
                    //console.log(item);
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
        let data = {};
        db.collection('posts', function(err, collection) {
            collection.find().limit(lim).skip(skipNum).toArray(function(err, items) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    //for (i = 0; i < items.length; i++) items[i].link = '{{MAIN_URL}}/article/'+items[i].link;
                    for (i = 0; i < items.length; i++) {
                        items[i].link = '{{MAIN_URL}}/article/'+items[i].link;
                        if (data[items[i].cat] == null || data[items[i].cat] == undefined) {
                            data[items[i].cat] = [];
                        }
                        data[items[i].cat].push(items[i]);
                    }
                    res.send(data);
                }
            });
        });
    };

    module.findAllInCats = function(req, res) {
        var page = Number(req.query.page);
        var lim = Number(req.query.limit);
        var skipNum = (page-1)*lim;
        
        var cats = req.params.cats.split(',');
        let data = {};
        for (var j = 0; j < cats.length; j++) {
            cv = cats[j];
            data[cv] = [];
        }
        console.log('Retrieving posts from cats: ' + cats);
        db.collection('posts', function(err, collection) {
            collection.find({ cat : { $in: cats } }).limit(lim).skip(skipNum).toArray(function(err, items) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    for (i = 0; i < items.length; i++) {
                        items[i].link = '{{MAIN_URL}}/article/'+items[i].link;
                        data[items[i].cat].push(items[i]);
                    }
                    //console.log(data);
                    res.send(data);
                }
            });
        });
    };

    return module;
}
