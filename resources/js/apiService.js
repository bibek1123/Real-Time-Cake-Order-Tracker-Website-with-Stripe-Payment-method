import axios from 'axios'
import Noty from 'noty'

export function placeOrder(formObject) {
    axios.post('/orders', formObject).then((res) => {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: res.data.message
        }).show();
        setTimeout(() => {
            window.location.href = '/customer/orders';
        }, 800);
    }).catch((err) => {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: err.res.data.message
        }).show();
    })
}