module.exports = function (db) {
    var module = {};

    module.findById = function (req, res) {
        var id = req.params.id;
        console.log('Retrieving module: ' + id);
        db.collection('modules', function (err, collection) {
            collection.findOne({ '_id': ObjectID(id) }, function (err, item) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    console.log(item);
                    res.send({status: 'success', data: item});
                }
            })
        });
    };

    module.findByLink = function (req, res) {
        var link = req.params.link;
        console.log('Retrieving module: ' + link);
        db.collection('modules', function (err, collection) {
            collection.findOne({ 'link': link }, function (err, item) {
                if (err) {
                    res.send({status: 'error', message: 'An error has occurred'});
                } else {
                    console.log(item);
                    res.send({status: 'success', data: item});
                }
            })
        });
    };

    /* not return status */
    module.findAll = function (req, res) {
        db.collection('modules', function (err, collection) {
            var data = collection.find({}, { _id: 1, link: 1, parent: 1, text: 1, show: 1, show_nav: 1, type: 1 }).sort({ updated_time: -1 }).toArray(function (err, items) {
                res.send(items);
            });
        });
    };

    /* not return status */
    module.findAllFull = function (req, res) {
        db.collection('modules', function (err, collection) {
            /*collection.find().sort({create_time: -1}).toArray(function(err, items) {
                var Ar = {};
                for (i = 0; i < items.length; i++) {
                    if (!items[i].parent) items[i].parent = '';
                    if (!items[i].content) items[i].content = '';
                }
                Ar.data = items;
                res.send(items);
            });*/
            var data = collection.find().sort({ updated_time: -1 }).toArray(function (err, items) {
                res.send(items);
            });
        });
    };

    module.add = function (req, res) {
        var modules = req.body;

        var dt = dateTime.create();
        modules.created_time = modules.updated_time = dt.format('Y-m-d H:M:S');
        modules.fix = '';
        console.log('Adding module: ' + JSON.stringify(modules));

        db.collection('modules', function (err, collection) {
            collection.count({ link: modules.link }, function (err, num) {
                if (err) {
                    res.send({ status: 'error', message: 'An error has occurred while checking link availability' });
                } else {
                    console.log(num);

                    if (num > 0) {
                        res.send({ status: 'error', message: "This 'link' is not available. You might want to change the title." });
                    } else {

                        collection.insert(modules, { safe: true }, function (err, result) {
                            if (err) {
                                res.send({ status: 'error', message: 'An error has occurred' });
                            } else {
                                console.log('Success: ' + JSON.stringify(result));
                                console.log(result.ops);
                                res.send({ status: 'success', data: result.ops[0] });
                            }
                        });

                    }

                }
            });
        });
    }

    module.update = function (req, res) {
        var link = req.params.link;
        var modules = req.body;
        //delete modules['_id'];

        // don't change link
        modules.link = link;

        var dt = dateTime.create();
        modules.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Updating modules: ' + link);
        console.log(JSON.stringify(modules));

        db.collection('modules', function (err, collection) {
            data = collection.findOne({ 'link': link }, function (err, item) {
                modules.fix = item.fix;

                collection.update({ link: link }, modules, { safe: true }, function (err, result) {
                    if (err) {
                        console.log('Error updating modules: ' + err);
                        res.send({ status: 'error', message: 'An error has occurred' });
                    } else {
                        console.log('' + result + ' document(s) updated');
                        //res.send(modules);
                        res.send({ status: 'success', data: modules });
                    }
                });
            });
        });
    }

    module.delete = function (req, res) {
        var link = req.params.link;
        console.log('Deleting modules: ' + link);
        db.collection('modules', function (err, collection) {
            collection.remove({ link: link, fix: { $ne: 'true' } }, { safe: true }, function (err, result) {
                if (err) {
                    res.send({ status: 'error', message: 'An error has occurred - ' + err });
                } else {
                    console.log('' + result + ' document(s) deleted');
                    //res.send(req.body);
                    res.send({ status: 'success' })
                }
            });
        });
    }

    return module;
}
