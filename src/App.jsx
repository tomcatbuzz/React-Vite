// import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
// import Preloader from './Components/Preloader2/index';
import Preloader from './Components/Preloader3/index';
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import { useEffect, useState } from 'react';
// import { entCheck, initializeAnalytics } from './lib/firebase';
import { initializeAnalytics } from './lib/firebase';
// import transition from "./transition";

function App() {
  useEffect(() => {
    
    const analytics = initializeAnalytics();
      if (analytics) {
        console.log('Analytics initialized successfully in App component');
      } else {
        console.log('Analytics not initialized in App component');
      }

    // const appCheck = entCheck();
    // if (appCheck) {
    //   console.log('App Check initalialized successfully')
    // } else {
    //   console.error('Failed to initialize')
    // }
  }, []);

  const location = useLocation();
  const [isInitialLoad, setisInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true)
  // useEffect(() => {
  //   (
  //     async () => {
  //       // add locomotive//???????????????
  //         // const LocomotiveScroll = (await import('locomotive-scroll')).default
  //         // const locomotiveScroll = new LocomotiveScroll();

  //         setTimeout( () => {
  //           setIsLoading(false);
  //           setisInitalLoad(false);
  //           document.body.style.cursor = 'default'
  //           window.scrollTo(0,0);
  //         }, 2000)
  //     }
  //   )()
  // }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    setisInitialLoad(false);
    document.body.style.cursor = 'default'
    window.scrollTo(0,0);
  };
  
  

  // if (isLoading) {
  //   return <Preloader />
  // }


  return (
    <>
      <NavBar />
      <AnimatePresence>{isLoading && <Preloader onComplete={handlePreloaderComplete}/>}</AnimatePresence>
      <AnimatePresence mode="wait" initial={!isInitialLoad}>
        <Routes location={location} key={location.pathname}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
