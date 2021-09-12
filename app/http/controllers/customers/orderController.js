const Order = require('../../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
function orderController() {
    return {
        // after post order we get data form here:-
        store(req, res) {
            // console.log(req.body)
            //return;
            //Validate request:-
            const { phone, address, stripeToken, paymentType } = req.body
            if (!phone || !address) {
                return res.status(422).json({ message: 'All fields are required' }); //for ajax call
                // req.flash('error', 'All fields are required!')
                //     return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    // req.flash('success', 'Order placed successfully!')
                    //this flash msg no needed if use ajax call so comment out 


                    // Stripe payment
                    if (paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.paymentType = paymentType
                            placedOrder.save().then((ord) => {
                                // console.log(ord)
                                // Emit
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message: 'Payment successful, Order placed successfully' });//for ajax call
                                // return res.redirect('/customer/orders')
                            }).catch((err) => {
                                // console.log(err)
                            })

                        }).catch((err) => {
                            delete req.session.cart
                            return res.json({ message: 'OrderPlaced but payment failed, You can pay at delivery time' });//for ajax call
                            // console.log(err)
                        })
                    } else {
                        delete req.session.cart
                        return res.json({ message: 'Order placed succesfully' });//for ajax call
                    }
                })
            }).catch(err => {
                return res.status(500).json({ message: 'Something went wrong' });//for ajax call
                // req.flash('error', 'Something went wrong')
                // return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } })
            // console.log(orders)
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        // fetching order status on singleOrder Page:-
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            //Authorize user checked:-
            if (req.user._id.toString() === order.customerId.toString()) {
                //req.user._id and order.customerId both are object but in javascript comparing of object not allowed directly so added .toString()
                return res.render('customers/singleOrder', { order })
            }
            return res.redirect('/')
        }
    }
}

module.exports = orderController