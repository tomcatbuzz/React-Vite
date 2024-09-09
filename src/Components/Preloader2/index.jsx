import styles from './style.module.scss'
import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PropTypes from 'prop-types';

const PreLoader = ({ onComplete }) => {
  
  const preLoaderRef = useRef(null);
  const digit1Ref = useRef(null);
  const digit2Ref = useRef(null);
  const digit3Ref = useRef(null);
  const progressBarRef = useRef(null);
  const numRefs = useRef([]);

  useGSAP(() => {
    const animate = (digit, duration, delay = 1) => {
      const nums = Array.from(digit.children)
      if (nums.length === 0) return;
      const numHeight = nums[0].clientHeight;
      const totalDistance = (nums.length - 1) * numHeight;
      gsap.to(digit, {
        y: -totalDistance,
        duration: duration,
        delay: delay,
        ease: "power2.inOut",
      });
    };

    animate(digit3Ref.current, 5);
    animate(digit2Ref.current, 6);
    animate(digit1Ref.current, 2, 5);

    gsap.to(progressBarRef.current, {
      width: "30%",
      duration: 2,
      ease: "power4.inOut",
      delay: 7,
    });

    gsap.to(progressBarRef.current, {
      width: "100%",
      opacity: 0,
      duration: 2,
      delay: 8.5,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(preLoaderRef.current, {
          display: "none",
        });
        onComplete()
      },
    });
  }, []);

  useEffect(() => {
    const digit3 = digit3Ref.current;
    if (digit3) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 10; j++) {
          const div = document.createElement("div");
          // div.className = styles.num;
          // div.className = 'nums';
          div.textContent = j;
          digit3.appendChild(div);
          // console.log(div.className, "what is here")
        }
        console.log(digit3, "digit3.current?")
      }
      const finalDigit = document.createElement("div");
      // finalDigit.className = styles.num;
      // finalDigit.className = 'nums';
      finalDigit.textContent = "0";
      digit3.appendChild(finalDigit);
      // console.log(finalDigit, "Final digit?")
      // console.log(finalDigit.className, 'Styles.num')
    }
  }, []);

  // useEffect(() => {
  //   const digit3 = digit3Ref.current;
  //   if (digit3) {
  //     for (let i = 0; i < 21; i++) {  // Changed from 2 to 21
  //       const div = document.createElement("div");
  //       div.className = styles.num;
  //       div.textContent = i % 10;  // This will cycle 0-9 twice, ending with 0
  //       digit3.appendChild(div);
  //       numRefs.current.push(div);
  //     }
  //   }
  // }, []);

  return (
    <div className={styles.preLoader} ref={preLoaderRef}>
      <p>Loading</p>
      <div className={styles.counter}>
        <div className={styles.digit1} ref={digit1Ref}>
          <div ref={el => numRefs.current[0] = el}>0</div>
          <div ref={el => numRefs.current[1] = el} className={styles.offset}>1</div>
        </div>
        <div className={styles.digit2} ref={digit2Ref}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, index) => (
            <div 
              key={index} 
              // ref={el => numRefs.current[index + 2] = el}
              className={`${index === 1 ? styles.offset : ''}`}>{num}</div>
          ))}
        </div>
        <div className={styles.digit3} ref={digit3Ref}></div>
        <div className={styles.digit4}>%</div>
      </div>
      <div className={styles.progressBar} ref={progressBarRef}></div>
    </div>
  );
};

PreLoader.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default PreLoader;
