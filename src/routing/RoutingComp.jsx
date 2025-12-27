import React from 'react';
import {  Routes, Route } from 'react-router-dom';
// Link, useLocation
// --- IMPORT ALL COMPONENTS ---
import Hero from '../mainpages/Hero';
import About from '../mainpages/About';
import WhyESV from '../mainpages/WhyESV';
import VMV from '../mainpages/VMV';
import KnowledgeService from '../mainpages/KnowledgeService';
import AllServices from '../mainpages/AllServices';
import ManagementStandard from '../mainpages/ManagementStandard';
import SmallMarqueeBanner from '../mainpages/SmallMarqueeBanner';
import WheelImage from '../mainpages/WheelImage';
import Work from '../mainpages/Work';
import HorizontalScrollLogo from '../mainpages/HorizontalScrollLogo';
import Testimonials from '../mainpages/Testimonials';
import Contact from '../mainpages/Contact';
import Footer from '../mainpages/Footer';

// --- MAIN ROUTING COMPONENT ---
export default function RoutingComp() {
  return (
   
     
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/why" element={<WhyESV />} />
            <Route path="/vmv" element={<VMV />} />
            <Route path="/knowledge" element={<KnowledgeService />} />
            <Route path="/services" element={<AllServices />} />
            <Route path="/management" element={<ManagementStandard />} />
            <Route path="/marquee" element={<SmallMarqueeBanner />} />
            <Route path="/wheel" element={<WheelImage />} />
            <Route path="/work" element={<Work />} />
            <Route path="/logos" element={<HorizontalScrollLogo />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/footer" element={<Footer />} />
          </Routes>
    
  );
}