const homeController = require('../app/http/controller/homeController')
const authController = require('../app/http/controller/authController')
const cartController = require('../app/http/controller/customers/cartController')

function initRoutes(app) {
    app.get('/', homeController().index)
    app.get('/login', authController().login)
    app.get('/register', authController().register)

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)
    // app.post('/update-cart', function(req, res){
    //     cartController().update
    //     // console.log(res)
    //   });
}

module.exports = initRoutes