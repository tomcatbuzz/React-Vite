import { useState, useEffect, useCallback } from 'react';

const useRecaptchaV3 = (siteKey) => {
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

  useEffect(() => {
    if (window.grecaptcha) {
      setIsRecaptchaReady(true)
    } else {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        // script.src = `https://www.recaptcha.net/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => {
          setIsRecaptchaReady(true)
        };
        console.log('script', script)
    }
  }, [siteKey]);

  const executeRecaptcha = useCallback(async (action) => {
    if (isRecaptchaReady && window.grecaptcha) {
      return await window.grecaptcha.execute(siteKey, { action });
    }
  }, [isRecaptchaReady, siteKey]);

  return executeRecaptcha;
};

export default useRecaptchaV3;