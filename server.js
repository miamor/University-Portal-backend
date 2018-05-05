const port = 3003;
const SECRET_KEY = 'asimplekey';
const DB_HOST = 'localhost';
MAIN_URL = 'http://localhost/MTA';

express = require('express')
  , jwt = require('jsonwebtoken')
  , expressJWT = require('express-jwt')
  , ObjectID = require("bson-objectid")
  , dateTime = require('node-datetime');
var cors = require('cors');
var mongo = require('mongodb');
var bodyParser  = require('body-parser');

app = express();
app.set('superSecret', SECRET_KEY);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/* Config server & token */
JWT_CONFIG = expressJWT({
  secret: app.get('superSecret'), // Use the same token that we used to sign the JWT above
  // Let's allow our clients to provide the token in a variety of ways
  getToken: function (req) {
    if (req.headers.authorization) { // Authorization: g1jipjgi1ifjioj
      var token = req.headers.authorization;
      return req.headers.authorization;
    } else {
      //res.sendStatus(401);
    }
    // If we return null, we couldn't find a token.
    // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
    return null; 
  }
}).unless({
  path: [
    /^(?!(\/admin).*$).*/,
    '/admin/login'
  ] 
});

// authorization check (role-based check)
function checkRole (roles) {
  return function (req, res, next) {
    //console.log(req.headers);
    if (roles.indexOf(req.user.type) > -1) {
      next();
    } else {
      return res.status(403).send({
        status: 'error',
        success: false,
        message: 'Insufficient permissions'
      });
    }
  }
}


app.use(JWT_CONFIG);

// setup permission middleware
app.use("/admin/users", checkRole(["admin"]));
app.use(/\/admin\/(?!login)/, checkRole(["admin", "smod", "mod"]));


// handling errors
app.use(function (err, req, res, next) {
  //console.log(req.headers);
  if (err.status === 403 || err.code === 'permission_denied') {
    return res.status(403).send({
      status: 'error',
      success: false,
      message: 'Insufficient permissions'
    });
  } else if (err.status === 401) {
    return res.status(401).send({
      status: 'error',
      success: false,
      message: err.message
    });
  } else if (err.status === 404) {
    return res.status(404).send({
      status: 'error',
      success: false,
      message: 'No method.'
    });
  }
});


/* Config server to connect to database */
var Server = mongo.Server
  , Db = mongo.Db
  , BSON = mongo.BSONPure
  , server = new Server(DB_HOST, 27017, {auto_reconnect: true})
  , db = new Db('MTA', server, {safe: true});

// Open DB to see if we need to populate with data
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'MTA' database");

        app.disable('etag');

        var ADMIN_LOGIN = require('./routes/admin/login')
        , admin_login = new ADMIN_LOGIN(db);
        app.post('/admin/login', admin_login.login);

        var ADMIN_ME_INFO = require('./routes/admin/me')
          , admin_me_info = new ADMIN_ME_INFO(db);
        app.get('/admin/me', admin_me_info.getMyInfo);
        app.put('/admin/me/update', admin_me_info.update);
        app.put('/admin/me/changepassword', admin_me_info.change_password);

        var ADMIN_SITE_INFO = require('./routes/admin/info')
          , admin_site_info = new ADMIN_SITE_INFO(db);
        app.get('/admin/info', admin_site_info.getSiteInfo);
        app.put('/admin/info/update', admin_site_info.update);

        var ADMIN_MODULES = require('./routes/admin/modules')
          , admin_modules = new ADMIN_MODULES(db);
        app.get('/admin/modules', admin_modules.findAll);
        app.get('/admin/modules/full', admin_modules.findAllFull);
        app.get('/admin/modules/:link', admin_modules.findByLink);
        app.post('/admin/modules', admin_modules.add);
        app.put('/admin/modules/:link', admin_modules.update);
        app.delete('/admin/modules/:link', admin_modules.delete);

        var ADMIN_GAL_IMAGES = require('./routes/admin/images')
          , admin_gal_images = new ADMIN_GAL_IMAGES(db);
        app.get('/admin/images', admin_gal_images.findAll);
        app.get('/admin/images/module/:module', admin_gal_images.findAllInModule);
        app.get('/admin/images/:id', admin_gal_images.findById);
        app.post('/admin/images', admin_gal_images.add);
        app.put('/admin/images/:id', admin_gal_images.update);
        app.delete('/admin/images/:id', admin_gal_images.delete);

        var ADMIN_POSTS = require('./routes/admin/posts')
          , admin_posts = new ADMIN_POSTS(db);
        app.get('/admin/posts', admin_posts.findAll);
        app.get('/admin/posts/:id', admin_posts.findById);
        app.post('/admin/posts', admin_posts.add);
        app.put('/admin/posts/:id', admin_posts.update);
        app.delete('/admin/posts/:id', admin_posts.delete);

        var ADMIN_USERS = require('./routes/admin/users')
          , admin_users = new ADMIN_USERS(db);
        app.get('/admin/users', admin_users.findAll);
        app.get('/admin/users/:id', admin_users.findById);
        app.post('/admin/users', admin_users.add);
        app.put('/admin/users/:id', admin_users.update);
        app.delete('/admin/users/:id', admin_users.delete);

        var ADMIN_GROUPS = require('./routes/admin/groups')
          , admin_groups = new ADMIN_GROUPS(db);
        app.get('/admin/groups', admin_groups.findAll);
        app.get('/admin/groups_getallusers', admin_groups.getAllUsers);
        app.get('/admin/groups/:link', admin_groups.findByLink);
        app.get('/admin/groups/:link/members', admin_groups.findGrMem);
        app.post('/admin/groups/:link/members/add', admin_groups.addGrMem);
        app.post('/admin/groups/:link/members/remove', admin_groups.removeGrMem);
        app.post('/admin/groups', admin_groups.add);
        app.put('/admin/groups/:link', admin_groups.update);
        app.delete('/admin/groups/:link', admin_groups.delete);

        var ADMIN_CATS = require('./routes/admin/categories')
          , admin_categories = new ADMIN_CATS(db);
        app.get('/admin/categories', admin_categories.findAll);
        app.get('/admin/categories/:link', admin_categories.findByLink);
        app.post('/admin/categories', admin_categories.add);
        app.put('/admin/categories/:link', admin_categories.update);
        app.delete('/admin/categories/:link', admin_categories.delete);

        var ADMIN_JS = require('./routes/admin/js')
          , admin_js = new ADMIN_JS(db);
        app.get('/admin/js', admin_js.findAll);
        app.get('/admin/js/:filename', admin_js.findByFilename);
        app.post('/admin/js', admin_js.add);
        app.put('/admin/js/:filename', admin_js.update);
        app.delete('/admin/js/:filename', admin_js.delete);


        var INFO = require('./routes/admin/info')
          , info = new INFO(db);
        app.get('/info', info.getSiteInfo);

        var MODULES = require('./routes/modules')
          , modules = new MODULES(db);
        app.get('/modules', modules.findAll);
        app.get('/modules/full', modules.findAllFull);
        app.get('/modules/m/:m', modules.loadMultiple);
        app.get('/modules/:link', modules.findByLink);

        var GAL_IMAGES = require('./routes/admin/images')
        , gal_images = new GAL_IMAGES(db);
        app.get('/images', gal_images.findAll);
        app.get('/images/module/:module', gal_images.findAllInModule);
        app.get('/images/:id', gal_images.findById);

        var POSTS = require('./routes/posts')
          , posts = new POSTS(db);
        app.get('/posts', posts.findAll);
        app.get('/posts/cats/:cats', posts.findAllInCats);
        app.get('/posts/find_by_link/:link', posts.findByLink);
        app.get('/posts/:id', posts.findById);

        var CATS = require('./routes/categories')
          , categories = new CATS(db);
        app.get('/categories', categories.findAll);
        app.get('/categories/:link', categories.findByLink);

        var JS = require('./routes/js')
          , js = new JS(db);
        app.get('/js', js.findAllActive);

        var LP = require('./routes/loadpage')
        , loadpage = new LP(db);
        app.get('/loadpage', loadpage.loadData);

        // Fire up the server
        app.listen(port);
        console.log('Listening on port '+port+'...');
    }
});