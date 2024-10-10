// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import {initializeApp} from 'firebase-admin/app';
initializeApp();

export {sendContactMessage} from './sendgrid';
export {checkRecaptchaV3} from './recaptcha';
export {recaptchaCheckbox} from './recaptchaV2';
export {verifyAltcha} from './altcha';
export {handleAltchaV2} from './challenge';
