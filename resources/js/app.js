import axios from 'axios'// axios to send ajax request
import Noty from 'noty'// noty is notification librry
import { bulkWrite } from '../../app/models/menu'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza) {
        axios.post('/update-cart', pizza).then(res => {
            // console.log(res)
            cartCounter.innerText = res.data.totalQty
            new Noty({
                type: 'success',
                timeout: 1000,
                text: "Item added to Cart!",
              }).show();
        }).catch(err=>{
            new Noty({
                type: 'error',
                timeout: 1000,
                text: "Something went wrong",
              }).show();
        })
    }


addToCart.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            let pizza = JSON.parse(btn.dataset.pizza)   // to get value of data-pizza(available on home.ejs) attribute.
            // console.log(pizza)
            updateCart(pizza)
        })
    });