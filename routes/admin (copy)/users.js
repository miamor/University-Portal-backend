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
                    console.log('Retrieving user: ' + id);
                    db.collection('users', function(err, collection) {
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
                    db.collection('users', function(err, collection) {
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
                    var users = req.body;

                    var dt = dateTime.create();
                    users.created_time = dt.format('Y-m-d H:M:S');
                    console.log('Adding user: ' + JSON.stringify(users));

                    db.collection('users', function(err, collection) {
                        collection.insert(users, {safe:true}, function(err, result) {
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
                    var users = req.body;
                    //delete users['_id'];

                    db.collection('users', function(err, collection) {
                        collection.findOne({_id:ObjectID(id)}, function(err, oldUserData) {

                            //var oldUserData = module.findById(req, res);
                            //console.log(oldUserData);
                            users['username'] = oldUserData['username']; // keep old username
                            users['password'] = oldUserData['password']; // keep old password

                            var dt = dateTime.create();
                            users.updated_time = dt.format('Y-m-d H:M:S');
                            console.log('Updating users: ' + id);
                            console.log(JSON.stringify(users));

                            //db.collection('users', function(err, collection) {
                                collection.update({_id:ObjectID(id)}, users, {safe:true}, function(err, result) {
                                    if (err) {
                                        console.log('Error updating users: ' + err);
                                        res.send({'error':'An error has occurred'});
                                    } else {
                                        console.log('' + result + ' document(s) updated');
                                        res.send(users);
                                    }
                                });
                            //});
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
                    console.log('Deleting users: ' + id);
                    db.collection('users', function(err, collection) {
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
