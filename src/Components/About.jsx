// import React from "react";
import transition from "../transition";

const About = () => {
  return (
    <>
    <div className="container">
      <h1>About</h1>
    </div>
    </>
  );
};

const WrappedAbout = transition(About)
export default WrappedAbout;
