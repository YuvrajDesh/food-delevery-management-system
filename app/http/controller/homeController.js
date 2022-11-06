const Menu = require('../../models/menu')
function homeController() {
    return {
         index(req, res) {
            // const pizzas = await Menu.find()
            // console.log(pizzas)
            Menu.find().then(function(foods){
                // console.log(foods)
                return res.render('home', { foods: foods })
            })
            
        }
    }
}

module.exports = homeController
