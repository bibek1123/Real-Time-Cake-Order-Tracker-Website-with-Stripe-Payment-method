import { loadStripe } from '@stripe/stripe-js'
import { placeOrder } from './apiService'
import { CardWidget } from './CardWidget'

export async function initStripe() {
    const stripe = await loadStripe('pk_test_51JXKyHSDTG3uDTNATqoJtKLCBe45pUBizPZEXF5px1jh8TcrOmY7ojixIv1T05FROz6w23Qu28VzqmWaIDCcfv7U00dDvjpz70');

    let card = null;
    // function mountWidget() {

    //     const elements = stripe.elements()

    //     let style = {
    //         base: {
    //             color: '#32325d',
    //             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //             fontSmoothing: 'antialiased',
    //             fontSize: '16px',
    //             '::placeholder': {
    //                 color: '#aab7c4'
    //             }
    //         },
    //         invalid: {
    //             color: '#fa755a',
    //             iconColor: '#fa755a'
    //         }
    //     };

    //     card = elements.create('card', { style, hidePostalCode: true })
    //     card.mount('#card-element')

    // }

    const paymentType = document.querySelector('#paymentType');
    if (!paymentType) {
        return;
    }
    paymentType.addEventListener('change', (e) => {
        if (e.target.value === 'card') {
            // Display Widget
            card = new CardWidget(stripe)
            card.mount()
            // mountWidget()
            // card = new CardWidget(stripe)
            // card.mount()
        } else {
            card.destroy()
        }

    })


    //Ajax Call:-
    const paymentForm = document.querySelector('#payment-form')
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            let formData = new FormData(paymentForm)//FormData() is javascript inbuild-class
            let formObject = {}

            // form data structure;-
            for (let [key, value] of formData.entries()) {
                formObject[key] = value
            }

            if (!card) {
                //Do Ajax call:-
                placeOrder(formObject);
                // console.log(formObject)  // to check payment methods include or not
                return;
            }

            const token = await card.createToken()
            formObject.stripeToken = token.id;
            placeOrder(formObject);


            // // // Verify card
            // stripe.createToken(card).then((result) => {
            //     console.log(result)
            //     formObject.stripeToken = result.token.id; //to send token to backend
            //     placeOrder(formObject);
            // }).catch((err) => {
            //     console.log(err)
            // })

        })

    }
}