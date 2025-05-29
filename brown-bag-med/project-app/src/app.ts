import express from 'express';
import bodyParser from 'body-parser';
import { BitcoinPayment } from './payments/bitcoin';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const bitcoinPayment = new BitcoinPayment();

app.post('/api/payments/bitcoin', async (req, res) => {
    try {
        const { amount, address } = req.body;
        const transaction = await bitcoinPayment.processPayment(amount, address);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});