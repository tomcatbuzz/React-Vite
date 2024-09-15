import styles from './style.module.scss';
import { useRef, useLayoutEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PropTypes from 'prop-types';

const PreLoader = ({ onComplete }) => {
  const preLoaderRef = useRef(null);
  const digit1Ref = useRef(null);
  const digit2Ref = useRef(null);
  const digit3Ref = useRef(null);
  const progressBarRef = useRef(null);

  // useEffect(() => {
    useLayoutEffect(() => {
    const createDigits = (digitRef, count, offset = false) => {
      if (digitRef.current) {
        digitRef.current.innerHTML = ''; // Clear existing content
        for (let i = 0; i <= count; i++) {
          const div = document.createElement("div");
          div.className = `${offset && i === 1 ? styles.offset : ''}`;
          div.textContent = i % 10;
          // console.log(digitRef.current, 'Digit ref')
          digitRef.current.appendChild(div);
        }
      }
    };

    createDigits(digit1Ref, 1);
    createDigits(digit2Ref, 10, true);
    createDigits(digit3Ref, 90);
  }, []);

  useGSAP(() => {
    const animate = (digit, duration, distance, delay = 0) => {
      if (digit.current && digit.current.children.length > 0) {
        // console.log(digit.current.children, 'Digit current')
        gsap.to(digit.current, {
          y: -distance,
          duration: duration,
          delay: delay,
          ease: "power2.inOut",
        });
      }
    };

    const getDigitHeight = (ref) => {
      return ref.current && ref.current.children.length > 0
        ? ref.current.children[0].clientHeight
        : 100; // Fallback height
    };

    const digit1Height = getDigitHeight(digit1Ref);
    const digit2Height = getDigitHeight(digit2Ref);
    const digit3Height = getDigitHeight(digit3Ref);

    // animate(digit3Ref, 5, 89 * digit3Height);
    animate(digit3Ref, 5, 90 * digit3Height, 0.5);
    animate(digit2Ref, 6, 10 * digit2Height);
    // animate(digit1Ref, 2, digit1Height, 5);
    animate(digit1Ref, 5, digit1Height);

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
        if (preLoaderRef.current) {
          gsap.set(preLoaderRef.current, {
            display: "none",
          });
        }
        onComplete();
      },
    });
  }, [onComplete]);

  return (
    <div className={styles.preLoader} ref={preLoaderRef}>
      <p>Loading</p>
      <div className={styles.counter}>
        <div className={styles.digit1} ref={digit1Ref}></div>
        <div className={styles.digit2} ref={digit2Ref}></div>
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