const express = require('express')
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid')
const Dwolla = require('dwolla-v2')
const app = express()

app.use(express.json())

const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[process.env.VITE_PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.VITE_PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.VITE_PLAID_SECRET,
    },
  },
})

const plaidClient = new PlaidApi(plaidConfig)

const dwollaClient = new Dwolla.Client({
  key: process.env.VITE_DWOLLA_KEY,
  secret: process.env.VITE_DWOLLA_SECRET,
  environment: process.env.VITE_DWOLLA_ENV,
})

app.post('/api/create-link-token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: req.body.userId },
      client_name: 'UT Bank',
      products: process.env.VITE_PLAID_PRODUCTS.split(','),
      country_codes: process.env.VITE_PLAID_COUNTRY_CODES.split(','),
      language: 'en',
    })
    res.json({ link_token: response.data.link_token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/exchange-public-token', async (req, res) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    })
    res.json({ access_token: response.data.access_token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/transfer', async (req, res) => {
  try {
    const { customerId, amount, sourceBankId, destinationBankId } = req.body
    const transfer = await dwollaClient.post('transfers', {
      _links: {
        source: { href: `${process.env.VITE_DWOLLA_BASE_URL}/funding-sources/${sourceBankId}` },
        destination: { href: `${process.env.VITE_DWOLLA_BASE_URL}/funding-sources/${destinationBankId}` },
      },
      amount: { currency: 'USD', value: amount },
    })
    res.json({ dwolla_transaction_id: transfer.headers.get('location') })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000, () => console.log('Server running on port 3000'))