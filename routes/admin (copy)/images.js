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
                    console.log('Retrieving image: ' + id);
                    db.collection('gallery_images', function(err, collection) {
                        collection.findOne({_id:ObjectID(id)}, function(err, item) {
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

    module.findAllInModule = function(req, res) {
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
                    var moduleLink = req.params.module;
                    db.collection('gallery_images', function(err, collection) {
                        collection.find({module:moduleLink}).toArray(function(err, items) {
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
                    db.collection('gallery_images', function(err, collection) {
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
                    var images = req.body;

                    var dt = dateTime.create();
                    images.created_time = dt.format('Y-m-d H:M:S');
                    console.log('Adding image: ' + JSON.stringify(images));

                    db.collection('gallery_images', function(err, collection) {
                        collection.insert(images, {safe:true}, function(err, result) {
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
                    var id = req.params.id;
                    var images = req.body;
                    //delete images['_id'];

                    var dt = dateTime.create();
                    images.updated_time = dt.format('Y-m-d H:M:S');
                    console.log('Updating images: ' + id);
                    console.log(JSON.stringify(images));

                    db.collection('gallery_images', function(err, collection) {
                        collection.update({_id:ObjectID(id)}, images, {safe:true}, function(err, result) {
                            if (err) {
                                console.log('Error updating images: ' + err);
                                res.send({'error':'An error has occurred'});
                            } else {
                                console.log('' + result + ' document(s) updated');
                                res.send(images);
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
                    var id = req.params.id;
                    console.log('Deleting images: ' + id);
                    db.collection('gallery_images', function(err, collection) {
                        collection.remove({_id:ObjectID(id)}, {safe:true}, function(err, result) {
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
