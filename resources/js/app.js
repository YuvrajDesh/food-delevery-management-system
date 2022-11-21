import axios from 'axios'
import Noty from 'noty'
let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
import { initAdmin } from './admin'
function updateCart(food) {
    axios.post('/update-cart', food).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false,
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    // cartCounter.innerText = res.data.totalQty
    // console.log(res)
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let food = JSON.parse(btn.dataset.food)
        updateCart(food)
        // console.log(food)
    })
})

// Remove alert message after X seconds 
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}
initAdmin()