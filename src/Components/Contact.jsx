import transition from "../transition";
import styles from "../styles/contact.module.scss";

import { useState, useCallback } from "react";
import { getDatabase, ref, set, push } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';
// import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
// import axios from "axios";
// import useRecaptchaV3 from './hooks/recaptchaV3';
// import Recaptcha from './hooks/recaptchaV2/index';
import useAltcha from './hooks/altcha'


const ContactFormContent = () => {
  // const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  // console.log(siteKey, "key")
  // const { scriptLoaded, scriptError } = useLoadReCaptcha(siteKey)

  // const RECAPTCHA_VERIFY_URL = 'https://us-central1-react-vite-32a9c.cloudfunctions.net/checkRecaptchaV3';
  // const RECAPTCHA_VERIFY_URL = 'https://us-central1-react-vite-32a9c.cloudfunctions.net/recaptchaCheckbox'
  // const executeRecaptcha = useRecaptchaV3('6LdREEQqAAAAALl4GpPbtiJkuFoRoLyWV3RCCAzr', 'submit')
  
  // const { executeRecaptcha } = useGoogleReCaptcha();
  // eslint-disable-next-line no-unused-vars
  // const [recaptchaVerified, setRecaptchaVerified] = useState(false)

  // ALTCHA
  const { value: altchaValue, AltchaWidget } = useAltcha();

    
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [recaptchaToken, setRecaptchaToken] = useState(''); 

  const validateForm = useCallback(() => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const phoneRegex = /^\+?[\d\s-]{10,14}$/;

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!emailRegex.test(formData.email)) errors.email = 'Invalid email address';
    // if (!phoneRegex.test(formData.phone)) errors.phone = 'Invalid phone number';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    // if (validateForm() && recaptchaToken) {
      if (validateForm()) {
        if (!altchaValue) {
          toast.error('Please complete the challenge');
          console.log(altchaValue, "altchaValue???/")
          return;
        }
      try {
        setIsSubmitting(true);
        // const token = await executeRecaptcha('submit') 
        
        // const response = await axios({
        //   method: 'POST',
        //   url: RECAPTCHA_VERIFY_URL,
        //   data:  { token },
        //   headers: {
        //     'Content-Type': 'application/json',
        //     // 'Access-Control-Allow-Origin': '*',
        //   }
        // });
        // const response = await axios.post(RECAPTCHA_VERIFY_URL, {token: recaptchaToken})
        // const { success } = response.data;
        // console.log('Response data:', response.data);
        // const score = response.data.score;
        // console.log(score, 'score')
        // if (score >= 0.5) {
          // console.log('Response data:', response);

          // Verify ALTCHA solution
        const verificationResponse = await fetch('https://us-central1-react-vite-32a9c.cloudfunctions.net/handleAltchaV2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payload: altchaValue }),
        });
        const verificationResult = await verificationResponse.json();
          
          if (verificationResult.success) {
          // setRecaptchaVerified(true);
          console.log(verificationResult, "VERIFIED???");
          // try {
            const db = getDatabase();
            const contactRef = ref(db, '/messages');
            const newContactRef = push(contactRef)
            await set(newContactRef, {
              ...formData,
              timestamp: new Date(),
            });
            
            setFormData({ name: '', email: '', subject: '', message: '' });
            console.log('form submitted successfully')
            toast.success('Your message was sent')
          // } catch (error) {
          //   console.error('Error submitting form', error)
          //   toast.error('Error submitting form, please try again')
          // }
        } else {
        //   setRecaptchaVerified(false);
          console.log('Altcha verification failed');
          toast.error('Altcha verification failed, please try again')
        }
        } catch {
          console.error('Error submitting form')
        toast.error('Error submitting form, please try again')
        } finally {
          setIsSubmitting(false);
        }
      }
    // } else if (!recaptchaToken) {
    //   toast.error('Please verify reCAPTCHA')
    // }
  }, [validateForm, altchaValue, formData]);

  // const handleToken = (token) => {
  //   setRecaptchaToken(token); // Capture reCAPTCHA v2 token
  // };

  // if (scriptError) {
  //   return <div className={styles.error}>{scriptError}</div>
  // }

  // if (!scriptLoaded) {
  //   return <div className={styles.loading}>Loading reCAPTCHA...</div>
  // }

  return (
    <div className={styles.content}>
      <h1>Contact Us</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* <form className={styles.form}> */}
        {/* Form fields remain the same */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.inputError : ""}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles.inputError : ""}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={errors.subject ? styles.inputError : ""}
          />
          {errors.subject && (
            <span className={styles.error}>{errors.subject}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? styles.inputError : ""}
          ></textarea>
          {errors.message && (
            <span className={styles.error}>{errors.message}</span>
          )}
        </div>
        {/* <Recaptcha siteKey="6LfsT1cqAAAAAInbefxEMYDGbSSNgLmYxJOLIsyj" callback={handleToken} /> */}
        <AltchaWidget />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting  || !altchaValue}
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>
      <Toaster
        position="top-center"
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </div>
  );
};

const Contact = () => {
  
  return (
    <>
    {/* <div className="container">
      <h1>Contact</h1>
    </div> */}
    {/* <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} */}
    {/* <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined,
      }}> */}
      <ContactFormContent />
      
    {/* </GoogleReCaptchaProvider> */}
    </>
    
  );
  
};

const WrappedContact = transition(Contact);
export default WrappedContact
