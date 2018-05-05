module.exports = function (db) {
    var module = {};

    module.findById = function (req, res) {
        var id = req.params.id;
        console.log('Retrieving post: ' + id);
        db.collection('groups', function (err, collection) {
            collection.findOne({
                _id: ObjectID(id)
            }, function (err, item) {
                if (err) {
                    res.send({
                        status: 'error',
                        message: 'An error has occurred'
                    });
                } else {
                    console.log(item);
                    res.send({
                        status: 'success',
                        data: item
                    });
                }
            })
        });
    };

    module.findByLink = function (req, res) {
        var link = req.params.link;
        console.log('Retrieving group: ' + link);
        db.collection('groups', function (err, collection) {
            collection.findOne({
                link: link
            }, function (err, item) {
                if (err) {
                    res.send({
                        status: 'error',
                        message: 'An error has occurred'
                    });
                } else {
                    console.log(item);
                    res.send({
                        status: 'success',
                        data: item
                    });
                }
            })
        });
    };

    /* not return status */
    module.findGrMem = function (req, res) {
        var link = req.params.link;
        console.log('Find members in group ' + link);
        db.collection('users', function (err, collection) {
            collection.find({
                group: link
            }, {
                _id: 1,
                username: 1,
                name: 1,
                department: 1
            }).toArray(function (err, items) {
                res.send(items);
            });
        });
    }

    module.getAllUsers = function (req, res) {
        db.collection('users', function (err, collection) {
            collection.find({}, {
                _id: 1,
                username: 1,
                name: 1
            }).sort({
                name: 1
            }).toArray(function (err, items) {
                res.send({
                    status: 'success',
                    data: items
                });
            });
        });
    }

    module.addGrMem = function (req, res) {
        var link = req.params.link;
        var users_to_add = req.body.users;
        if (typeof users_to_add == 'string') users_to_add = [users_to_add];
        console.log(users_to_add);
        db.collection('users', function (err, collection) {
            collection.updateMany({
                username: {
                    $in: users_to_add
                }
            }, {
                $set: {
                    group: link
                }
            }, function (err, result) {
                if (err) {
                    console.log('Error updating group members: ' + err);
                    res.send({
                        status: 'error',
                        message: 'An error has occurred'
                    });
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send({
                        status: 'success',
                        data: result
                    });
                }
            });
        });
    }

    module.removeGrMem = function (req, res) {
        var link = req.params.link;
        var user_to_remove = req.body.users;
        console.log(user_to_remove);
        db.collection('users', function (err, collection) {
            collection.update({
                username: user_to_remove
            }, {
                $set: {
                    group: ''
                }
            }, function (err, result) {
                if (err) {
                    console.log('Error updating group members: ' + err);
                    res.send({
                        status: 'error',
                        message: 'An error has occurred'
                    });
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send({
                        status: 'success',
                        data: result
                    });
                }
            });
        });
    }

    /* not return status */
    module.findAll = function (req, res) {
        console.log(req.user);
        db.collection('groups', function (err, collection) {
            collection.find().toArray(function (err, items) {
                res.send(items);
            });
        });
    };

    module.add = function (req, res) {
        var groups = req.body;

        var dt = dateTime.create();
        groups.created_time = groups.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Adding group: ' + JSON.stringify(groups));

        db.collection('groups', function (err, collection) {
            collection.count({
                link: groups.link
            }, function (err, num) {
                if (err) {
                    res.send({
                        status: 'error',
                        message: 'An error has occurred while checking link availability'
                    });
                } else {
                    console.log(num);

                    if (num > 0) {
                        res.send({
                            status: 'error',
                            message: "This 'link' is not available. You might want to change the name of the group."
                        });
                    } else {

                        collection.insert(groups, {
                            safe: true
                        }, function (err, result) {
                            if (err) {
                                res.send({
                                    'error': 'An error has occurred'
                                });
                            } else {
                                console.log('Success: ' + JSON.stringify(result));
                                console.log(result.ops);
                                res.send({
                                    status: 'success',
                                    data: result.ops[0]
                                });
                            }
                        });

                    }
                }
            })
        });
    }

    module.update = function (req, res) {
        var link = req.params.link;
        var groups = req.body;
        //delete groups['_id'];
        // don't change link
        groups.link = link;

        var dt = dateTime.create();
        groups.updated_time = dt.format('Y-m-d H:M:S');
        console.log('Updating groups: ' + link);
        console.log(JSON.stringify(groups));

        db.collection('groups', function (err, collection) {
            collection.update({
                link: link
            }, groups, {
                safe: true
            }, function (err, result) {
                if (err) {
                    console.log('Error updating groups: ' + err);
                    res.send({
                        'error': 'An error has occurred'
                    });
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send({
                        status: 'success',
                        data: groups
                    });
                }
            });
        });
    }

    module.delete = function (req, res) {
        var link = req.params.link;
        console.log('Deleting groups: ' + link);
        db.collection('groups', function (err, collection) {
            collection.remove({
                link: link
            }, {
                safe: true
            }, function (err, result) {
                if (err) {
                    res.send({
                        'error': 'An error has occurred - ' + err
                    });
                } else {
                    console.log('' + result + ' document(s) deleted');
                    //res.send(req.body);
                    res.send({
                        status: 'success'
                    })
                }
            });
        });
    }

    return module;
}