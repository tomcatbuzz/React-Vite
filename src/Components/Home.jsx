// import React from "react";
import styles from "../styles/home.module.scss";
import transition from "../transition";

const Home = () => {
  return (
    <>
    <div className={styles.content}>
      <h1 className={styles.heroTag}>Page Transitions In React</h1>
    </div>
    </>
  );
};

const WrappedHome = transition(Home);
export default WrappedHome;
