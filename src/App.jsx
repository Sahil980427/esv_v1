import React from "react";
import "./App.css";
import AppMain from "./AppMain";
import IntroCompHero from "./integrate/IntroComphero";
import Navbar from "./integrate/Navbar";
import RoutingMain from "./routing/RoutingMain";



export default function App() {
  return (
    <>
    {/* <RoutingMain/> */}
    <Navbar isDarkMode={true} />
    {/* <IntroCompHero/> */}
    <AppMain/>

    </>
  );
}
