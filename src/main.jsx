import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { firebaseApp, appCheck, analytics } from './lib/firebase'
// import './index.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

console.log("Main.jsx: Firebase app initialized:", !!firebaseApp);
console.log("Main.jsx: App Check initialized:", !!appCheck);
console.log("Main.jsx: Analytics initialized:", !!analytics);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
