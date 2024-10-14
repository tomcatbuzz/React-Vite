import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'

import 'altcha'
import PropTypes from 'prop-types'

const Altcha = forwardRef(({ onStateChange }, ref) => {
  const widgetRef = useRef(null)
  const [value, setValue] = useState(null)
  const [ready, setReady] = useState('idle')


  useImperativeHandle(ref, () => ({
    get value() {
      return value;
    },
    get ready() {
      return ready
    }
  }), [value, ready])

  useEffect(() => {
    const handleStateChange = (ev) => {
      if ('detail' in ev) {
        setValue(ev.detail.payload || null)
        setReady(ev.detail.state)
        onStateChange?.(ev)
      }
    }
    const current = widgetRef.current
    if (current) {
      current.addEventListener('statechange', handleStateChange)
      return () => current.removeEventListener('statechange', handleStateChange)
    }
  }, [onStateChange])

  return (
    <altcha-widget
      ref={widgetRef}
      style={{
        '--altcha-max-width': '100%',
      }}
      challengeurl="https://us-central1-react-vite-32a9c.cloudfunctions.net/handleAltchaV2"
      debug
      // test
    ></altcha-widget>
  )
})

Altcha.propTypes = {
  onStateChange: PropTypes.func
}

Altcha.displayName = 'Altcha'

export default Altcha