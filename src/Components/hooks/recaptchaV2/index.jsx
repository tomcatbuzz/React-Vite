import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
const ReCaptcha = ({ siteKey, callback }) => {
    const recaptchaRef = useRef(null);
    const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
    const isRendered = useRef(false);

    // Define the component function to be called when reCAPTCHA loads
    const onRecaptchaLoad = () => {
        setIsRecaptchaLoaded(true);
    };

    useEffect(() => {
        // Assign the component function to the window callback
        window.onRecaptchaLoad = onRecaptchaLoad;

        if (!window.grecaptcha) {
            // Load the script only if it's not already available
            const script = document.createElement('script');
            script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        } else if (window.grecaptcha && window.grecaptcha.render) {
            // If reCAPTCHA is already loaded, call the function directly
            onRecaptchaLoad();
        }

        // Clean up the global callback on component unmount
        return () => {
            window.onRecaptchaLoad = null;
            if (isRendered.current) {
                window.grecaptcha.reset(); // Reset the reCAPTCHA widget
            }
        };
    }, []);

    useEffect(() => {
        if (isRecaptchaLoaded && !isRendered.current && recaptchaRef.current) {
            try {
                window.grecaptcha.render(recaptchaRef.current, {
                    'sitekey': siteKey,
                    'callback': callback // Callback function to handle the token
                }); 
                console.log(window.grecaptcha.render(recaptchaRef.current), 'is this loaded')
                isRendered.current = true;
            } catch (error) {
                console.error('Error rendering reCAPTCHA:', error);
            }
            
            
        }
    
    }, [callback, isRecaptchaLoaded,  siteKey]);

    return (
        <div ref={recaptchaRef}></div>
    );
};

ReCaptcha.propTypes = {
    siteKey: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
};
export default ReCaptcha;