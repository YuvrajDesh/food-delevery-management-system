import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
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

// Change order status 
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')
function updateStatus(order){
let stepCompleted = true

statuses.forEach((status) => {
    let dataProp = status.dataset.status
    if(stepCompleted) {
         status.classList.add('step-completed')
    } 
    if(dataProp === order.status) {
         stepCompleted = false
         time.innerText = moment(order.updatedAt).format('hh:mm A')
         status.appendChild(time)
        if(status.nextElementSibling) {
         status.nextElementSibling.classList.add('current')
        }
    }   
 })
}

updateStatus(order)

// Socket 
let socket = io()
initAdmin(socket)
// Join 
if(order) {
    socket.emit('join', `order_${order._id}`)
}
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    // updateStatus(updatedOrder)
    // new Noty({
    //     type: 'success',
    //     timeout: 1000,
    //     text: 'Order updated',
    //     progressBar: false,
    // }).show();
    console.log(data)
})