module.exports = function(db) {
    var module = {};

    module.findById = function(req, res) {
        var token = req.headers['Authorization'] || req.headers['authorization'];

        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.send({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    console.log(decoded);

                    /*** begin handle request ***/
                    var id = req.params.id;
                    console.log('Retrieving cat: ' + id);
                    db.collection('categories', function(err, collection) {
                        collection.findOne({'_id':ObjectID(id)}, function(err, item) {
                            console.log(item);
                            res.send(item);
                        })
                    });
                    /*** end handle request ***/
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    };

    module.findByLink = function(req, res) {
        var token = req.headers['Authorization'] || req.headers['authorization'];

        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.send({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    console.log(decoded);

                    /*** begin handle request ***/
                    var link = req.params.link;
                    console.log('Retrieving cat: ' + link);
                    db.collection('categories', function(err, collection) {
                        collection.findOne({link:link}, function(err, item) {
                            console.log(item);
                            res.send(item);
                        })
                    });
                    /*** end handle request ***/
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    };

    module.findAll = function(req, res) {
        var token = req.headers['Authorization'] || req.headers['authorization'];

        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.send({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    console.log(decoded);

                    /*** begin handle request ***/
                    db.collection('categories', function(err, collection) {
                        collection.find().toArray(function(err, items) {
                            res.send(items);
                        });
                    });
                    /*** end handle request ***/
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    };

    module.add = function(req, res) {
        var token = req.headers['Authorization'] || req.headers['authorization'];

        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.send({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    console.log(decoded);

                    /*** begin handle request ***/
                    var categories = req.body;

                    var dt = dateTime.create();
                    categories.created_time = dt.format('Y-m-d H:M:S');
                    console.log('Adding cat: ' + JSON.stringify(categories));

                    db.collection('categories', function(err, collection) {
                        collection.insert(categories, {safe:true}, function(err, result) {
                            if (err) {
                                res.send({'error':'An error has occurred'});
                            } else {
                                console.log('Success: ' + JSON.stringify(result));
                                console.log(result.ops);
                                res.send(result.ops[0]);
                            }
                        });
                    });
                    /*** end handle request ***/
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    }

    module.update = function(req, res) {
        var token = req.headers['Authorization'] || req.headers['authorization'];

        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.send({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    console.log(decoded);

                    /*** begin handle request ***/
                    var link = req.params.link;
                    var categories = req.body;
                    //delete categories['_id'];

                    var dt = dateTime.create();
                    categories.updated_time = dt.format('Y-m-d H:M:S');
                    console.log('Updating categories: ' + link);
                    console.log(JSON.stringify(categories));

                    db.collection('categories', function(err, collection) {
                        collection.update({link: link}, categories, {safe:true}, function(err, result) {
                            if (err) {
                                console.log('Error updating categories: ' + err);
                                res.send({'error':'An error has occurred'});
                            } else {
                                console.log('' + result + ' document(s) updated');
                                res.send(categories);
                            }
                        });
                    });
                    /*** end handle request ***/
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    }

    module.delete = function(req, res) {
        var token = req.headers['Authorization'] || req.headers['authorization'];

        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.send({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    console.log(decoded);

                    /*** begin handle request ***/
                    var link = req.params.link;
                    console.log('Deleting categories: ' + link);
                    db.collection('categories', function(err, collection) {
                        collection.remove({link: link}, {safe:true}, function(err, result) {
                            if (err) {
                                res.send({'error':'An error has occurred - ' + err});
                            } else {
                                console.log('' + result + ' document(s) deleted');
                                res.send(req.body);
                            }
                        });
                    });
                    /*** end handle request ***/
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    }

    return module;
}
