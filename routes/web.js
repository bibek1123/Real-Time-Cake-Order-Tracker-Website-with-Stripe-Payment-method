const homeController = require('../app/http/controllers/homeController') // import homeController
const authController = require('../app/http/controllers/authController') // import homeController
const cartController = require('../app/http/controllers/customers/cartController') // import homeController

// pass routes to the routes file i.e. receiving (app)instance:- 
function initRoutes(app){
    app.get('/', homeController().index);

    app.get('/login', authController().login);
    
    app.get('/register',authController().register);
    
    app.get('/cart', cartController().index);

    app.post('/update-cart',cartController().update)
}

module.exports = initRoutes;

// Note:- If you pass any object in function then get same instance in javascript.