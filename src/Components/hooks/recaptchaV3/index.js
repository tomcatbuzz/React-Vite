import { useState, useEffect, useCallback } from 'react';

const useRecaptchaV3 = (siteKey) => {
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

  useEffect(() => {
    const scriptId = 'recaptcha-v3-script';
    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => {
        setIsRecaptchaReady(true);
      });
    } else {
      // Create a unique ID for the script
      // const scriptId = 'recaptcha-v3-script';
      
      // Check if the script already exists
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          window.grecaptcha.ready(() => {
            setIsRecaptchaReady(true);
          });
        };

        // Add error handling
        script.onerror = () => {
          console.error('Error loading reCAPTCHA script');
        };

        document.head.appendChild(script);
      }
    }

    // Cleanup function
    return () => {
      const script = document.getElementById(scriptId);
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [siteKey]);

  const executeRecaptcha = useCallback(async (action) => {
    if (isRecaptchaReady && window.grecaptcha) {
      try {
        return await window.grecaptcha.execute(siteKey, { action });
      } catch (error) {
        console.error('Error executing reCAPTCHA:', error);
        throw error;
      }
    } else {
      console.warn('reCAPTCHA is not ready yet');
      return null;
    }
  }, [isRecaptchaReady, siteKey]);

  return executeRecaptcha;
};

export default useRecaptchaV3;