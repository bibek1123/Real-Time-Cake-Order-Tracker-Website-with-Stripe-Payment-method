const Menu = require('../../models/menu')

// Create Controller:- Controller return object.
function homeController() {
    return {
        async index(req, res) {
            // This is the second way to fetch data from database which called async await method .i.e best way to fecth data from database.:
            const pizzas = await Menu.find()
            // console.log(pizzas)
            return res.render('home', { pizzas: pizzas })  // pizzas receive on fronend

            // This is the one way to fetch data from database:-
            // Menu.find().then(function (pizzas) {
            //     console.log(pizzas)
            //     return res.render('home', { pizzas: pizzas })
            // })
        }
    }

}

module.exports = homeController