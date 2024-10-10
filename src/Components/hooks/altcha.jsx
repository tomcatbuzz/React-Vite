import { useEffect, useRef, useState } from 'react';
import 'altcha';

const useAltcha = (onStateChange) => {
  const widgetRef = useRef(null);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const handleStateChange = (ev) => {
      if ('detail' in ev) {
        setValue(ev.detail.payload || null);
        if (onStateChange) onStateChange(ev);
      }
    };

    const current = widgetRef.current;
    if (current) {
      current.addEventListener('statechange', handleStateChange);
      return () => current.removeEventListener('statechange', handleStateChange);
    }
  }, [onStateChange]);

  const AltchaWidget = () => (
    <altcha-widget
      ref={widgetRef}
      style={{
        '--altcha-max-width': '100%',
      }}
      // challengeurl="https://us-central1-react-vite-32a9c.cloudfunctions.net/verifyAltcha"
      challengeurl="https://us-central1-react-vite-32a9c.cloudfunctions.net/handleAltchaV2"
    ></altcha-widget>
  );

  return {
    value,
    AltchaWidget
  };
}

export default useAltcha;