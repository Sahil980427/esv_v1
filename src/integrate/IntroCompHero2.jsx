import React, { useState, useCallback } from "react";
import IntroComp from "../mainpages/IntroComp";
import Hero from "../mainpages/Hero";

export default function IntroComphero() {
  const [introFinished, setIntroFinished] = useState(false);
  
  // Use callback to ensure stability
  const handleIntroComplete = useCallback(() => { 
    setIntroFinished(true); 
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Hero startAnim={introFinished} />
      {!introFinished && <IntroComp onComplete={handleIntroComplete} />}
    </div>
  );
}