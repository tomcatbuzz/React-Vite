import {onRequest} from 'firebase-functions/v2/https';
import * as cors from 'cors';
import {createChallenge, verifySolution} from 'altcha-lib';

const corsHandler = cors({origin: true});

const allowedOrigins = ['http://localhost:5173', 'https://react-vite-32a9c.web.app'];
const hmacKey = process.env.ALTCHA_HMAC_KEY;

export const handleAltcha = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const origin = req.headers.origin || '';
    if (origin && allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
    } else {
      res.set('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Content-Type', 'application/json');

    if (!hmacKey) {
      console.error('ALTCHA_HMAC_KEY is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'});
    }

    if (req.method === 'GET') {
      // Create a new challenge
      try {
        const challenge = await createChallenge({hmacKey, maxNumber: 100000});
        return res.status(200).json(challenge);
      } catch (error) {
        console.error('Error creating challenge:', error);
        return res.status(500).json({
          success: false,
          message: 'Error creating challenge'});
      }
    } else if (req.method === 'POST') {
      // Verify the solution
      const payload = req.body.payload;
      if (!payload) {
        return res.status(400).json({
          success: false,
          message: 'Missing payload'});
      }

      try {
        const isValid = await verifySolution(payload, hmacKey);
        if (isValid) {
          return res.status(200).json({
            success: true,
            message: 'Verification successful'});
        } else {
          return res.status(403).json({
            success: false,
            message: 'Verification failed'});
        }
      } catch (error) {
        console.error('Error verifying solution:', error);
        return res.status(500).json({
          success: false,
          message: 'Error verifying solution'});
      }
    } else {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed'});
    }
  });
});
