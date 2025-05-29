import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15'
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { patientId } = req.body
  if (!patientId) return res.status(400).json({ error: 'Missing patient ID' })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Medication Report – Brown Bag Med',
            description: `Report for ${patientId}`
          },
          unit_amount: 12900 // €129.00
        },
        quantity: 1
      }
    ],
    metadata: {
      patientId
    },
    success_url: `${process.env.DOMAIN}/report/${patientId}?status=paid`,
    cancel_url: `${process.env.DOMAIN}/report/${patientId}?status=cancelled`
  })

  res.status(200).json({ url: session.url })
}
