import {onRequest} from 'firebase-functions/v2/https';
import axios from 'axios';
import * as cors from 'cors';
const corsHandler = cors({origin: true});
const USER_ERROR_CODES = ['missing-input-response', 'invalid-input-response'];
const SECRET_KEY = process.env.SECRET_KEY;

const allowedOrigins = ['http://localhost:5173, https://react-vite-32a9c.web.app'];

export const checkRecaptcha = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // const origin = req.headers.origin;
    const origin: string = req.headers.origin || '';
    if (origin && allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
    } else {
      res.set('Access-Control-Allow-Origin', '*');
    }
    // original url deployed
    // res.set('Access-Control-Allow-Origin', 'https://reactweb-b9752.web.app');
    // res.setHeader('Content-Type', 'application/json');
    // suggested Claude
    // res.set('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    // res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    // res.set('Access-Control-Allow-Headers', 'Content-type');
    // if (req.method === 'OPTIONS') {
    //   return res.status(204).send('');
    // }

    const token = req.body.token;
    console.log(token, 'what is here');

    if (!token) {
      return res.status(400).send('Missing token');
    }

    try {
      const response = await axios.get(`https://recaptcha.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`);

      const data = response.data;
      console.log('response data: ', data);
      if (data.success) {
        return res.status(200).send({score: data.score});
      }

      const errorCodes = data['error-codes'];
      if (errorCodes.length == 1 && USER_ERROR_CODES.includes(errorCodes[0])) {
        return res.status(400).send('Invalid Input');
      }
      return res.status(500).send('Internal Error');
    } catch (error) {
      console.error('error: ', error);
      return res.status(500).send('Internal Error');
    }
  });
});
