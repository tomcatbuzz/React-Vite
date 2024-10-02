import transition from "../transition";
import styles from "../styles/contact.module.scss";

import { useState, useCallback } from "react";
import { getDatabase, ref, set, push } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';
// import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import axios from "axios";
import useRecaptchaV3 from './hooks/recaptchaV3';


const ContactFormContent = () => {
  // const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  // console.log(siteKey, "key")
  // const { scriptLoaded, scriptError } = useLoadReCaptcha(siteKey)

  const RECAPTCHA_VERIFY_URL = 'https://us-central1-react-vite-32a9c.cloudfunctions.net/checkRecaptchaV3';
  const executeRecaptcha = useRecaptchaV3('6LdREEQqAAAAALl4GpPbtiJkuFoRoLyWV3RCCAzr', 'submit')
  
  // const { executeRecaptcha } = useGoogleReCaptcha();
  // eslint-disable-next-line no-unused-vars
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)

    
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        // const token = await executeRecaptcha()
        // console.log('received token', token)
        // if (!window.grecaptcha) {
        //   throw new Error('recaptcha not loaded')
        // }

        // const token = await new Promise((resolve, reject) => {
        //   window.grecaptcha.ready(() => {
        //     window.grecaptcha.execute(siteKey, { action: 'submit' })
        //     .then(resolve)
        //     .catch(reject)
        //   });
        // });
        // console.log('Token Generated', token);
        // window.grecaptcha.ready(() => {
        //   window.grecaptcha.execute(siteKey, { action: 'submit' }).then((token) => {
        //     setToken(token);
        //     console.log('Token Generated', token)

        //   })
        // })
        const token = await executeRecaptcha('submit') 
        console.log
        const response = await axios({
          method: 'POST',
          url: RECAPTCHA_VERIFY_URL,
          data:  { token },
          headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
          }
        });
        console.log('Response data:', response.data);
        const score = response.data.score;
        console.log(score, 'score')
        if (score >= 0.5) {
          setRecaptchaVerified(true);
          console.log('recaptcha verified');
          try {
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
          } catch (error) {
            console.error('Error submitting form', error)
          }
        } else {
          setRecaptchaVerified(false);
          console.log('recaptcha score to low');
        }
          
          
        } catch {
          console.error('Error submitting form')
        //   // alert('An error occured')
        } finally {
          setIsSubmitting(false);
        }
    }
  }, [validateForm, executeRecaptcha, formData]);

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
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
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
