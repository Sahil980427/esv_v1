import React, { useEffect } from "react";
import gsap from "gsap";
import { CustomEase, CustomBounce } from "gsap/all";
import styles from "./BounceBall.module.css";

const BounceBall = () => {
  useEffect(() => {
    gsap.registerPlugin(CustomEase, CustomBounce);

    CustomBounce.create("myBounce", { strength: 0.7, squash: 3 });

    const tl = gsap
      .timeline()
      .to("#bounce-circle", {
        y: 250,
        duration: 3,
        ease: "myBounce"
      })
      .to(
        "#bounce-circle",
        {
          scaleY: 0.5,
          duration: 3,
          scaleX: 1.3,
          ease: "myBounce-squash",
          transformOrigin: "bottom"
        },
        0
      );

    const wrapper = document.querySelector(`.${styles.wrapper}`);
    wrapper.addEventListener("click", () => tl.restart());

    return () => wrapper.removeEventListener("click", () => tl.restart());
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <svg
          width="100%"
          height="100%"
          className={styles.demoSvgFlair}
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="pattern-image"
              x="170"
              y="32"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
            >
              <image
                href="https://assets.codepen.io/16327/flair-21.png"
                x="0"
                y="0"
                width="60"
                height="60"
              />
            </pattern>
          </defs>
          <circle
            id="bounce-circle"
            cx="200"
            cy="62"
            r="30"
            fill="url(#pattern-image)"
          />
        </svg>
        <h4>Click anywhere to restart!</h4>
      </div>
    </div>
  );
};

export default BounceBall;
