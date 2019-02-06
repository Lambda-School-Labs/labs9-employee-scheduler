const express = require('express')
const router = express.Router()
const stripeSKey = process.env.STRIPE_SKEY
const stripe = require('stripe')(stripeSKey)
const authorize = require('../config/customMiddleware/authorize')
const { updateOrg } = require('../../database/helpers')

router.post('/', authorize(['owner']), (req, res, next) => {
  const { token, email, org_id } = req.body
  console.log('shallowest level')
  stripe.customers.create(
    {
      email: email,
      source: token.id
    },
    (err, customer) => {
      console.log('after created')
      if (err) {
        console.log(error)
        res.status(500).json({ message: 'Failed to create customer', err })
      } else {
        stripe.subscriptions.create(
          {
            customer: customer.id,
            items: [
              {
                plan: 'plan_ELLat7E29umz5Y'
              }
            ]
          },
          (err, subscription) => {
            if (err) {
              res.status(500).json({ message: 'Failed to subscribe', err })
            } else {
              updateOrg(org_id, {
                subscription_id: subscription.id,
                customer_id: customer.id,
                paid: true
              })
                .then(res => {
                  res.status(201).send('Success')
                })
                .catch(err => res.status(500).send(err))
            }
          }
        )
      }
    }
  )
})

router.put('/', authorize(['owner']), (req, res) => {
  const { subscription_id, org_id } = req.body
  stripe.subscriptions.del(subscription_id)
  updateOrg(org_id, {
    subscription_id: null,
    customer_id: null,
    paid: false
  })
    .then(res => {
      return res.send('Cancelled')
    })
    .catch(err => res.send(err))
})

module.exports = router
