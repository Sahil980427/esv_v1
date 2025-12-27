import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppMain from "../AppMain"; // Import your main sequence file
import RoutingComp from "./RoutingComp";

export default function RoutingMain() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Render AppMain for the home path */}
        <Route path="/" element={<AppMain />} />
        
        {/* Render AppMain for ANY other path too (e.g., /about, /contact) */}
        <Route path="/:section" element={<RoutingComp />} />
      </Routes>
    </BrowserRouter>
  );
}