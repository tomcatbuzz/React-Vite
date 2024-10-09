import {onRequest} from 'firebase-functions/v2/https';
import axios from 'axios';
import * as crypto from 'crypto';
import * as cors from 'cors';
const corsHandler = cors({origin: true});
const USER_ERROR_CODES = ['missing-input-response', 'invalid-input-response'];
// const SECRET_KEY = process.env.SECRET_KEY;

const allowedOrigins = ['http://localhost:5173, https://react-vite-32a9c.web.app'];

export const verifyAltcha = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // code block was used before, seems broken
    // const origin = req.headers.origin;
    const origin: string = req.headers.origin || '';
    if (origin && allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
    } else {
      res.set('Access-Control-Allow-Origin', '*');
    }
    // original url deployed
    // res.set('Access-Control-Allow-Origin', 'https://react-vite-32a9c.web.app');
    res.setHeader('Content-Type', 'application/json');

    // const token = req.body.token;
    // console.log(token, 'what is here');

    // if (!token) {
    //   return res.status(400).send('Missing token');
    // }

    try {
      const response = await axios.get('https://api.altcha.org/challenge');

      const {challenge, salt} = response.data;
      console.log('response data: ', response.data);

      const verificationResult = verifyPow(challenge, salt);
      if (!verificationResult) {
        res.status(403).send('Verification faile');
        return;
      }
      res.status(200).send({success: true, message: 'Verification Successful'});

      const errorCodes = response.data['error-codes'];
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

/**
 * Verifies the Proof of Work for ALTCHA.
 *
 * @param {string} challenge - The challenge string from the ALTCHA server.
 * @param {string} salt - The salt string from the ALTCHA server.
 * @param {string} token - The token provided by the client.
 * @return {boolean} True if the PoW is valid, false otherwise.
 */
function verifyPow(challenge: string, salt: string): boolean {
  const hash = crypto.createHash('sha256');
  hash.update(challenge + salt);
  const result = hash.digest('hex');
  return result.startsWith('0000');
}
