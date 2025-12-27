import React, { useState, useCallback, useEffect } from "react";
import IntroComp from "../mainpages/IntroComp";
import Hero from "../mainpages/Hero";

export default function IntroComphero() {
  const [introFinished, setIntroFinished] = useState(false);

  // 1. Handle Global Scroll (Body)
  useEffect(() => {
    if (introFinished) {
      // Restore scrolling when animation ends
      document.body.style.overflow = "auto";
    } else {
      // Lock scrolling while animation is running
      document.body.style.overflow = "hidden";
    }

    // Cleanup: Ensure scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [introFinished]);

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        // 2. Handle Local Scroll (Container)
        // If finished, allow auto scroll. If not, hide overflow.
        overflow: introFinished ? "auto" : "hidden", 
      }}
    >
      <Hero startAnim={introFinished} />
      {!introFinished && <IntroComp onComplete={handleIntroComplete} />}
    </div>
  );
}