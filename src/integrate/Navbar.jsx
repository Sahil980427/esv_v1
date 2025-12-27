import React from "react";
import Navbar_Desktop from "../mainpages/Navbar_Desktop";
import Navbar_Phone from "../mainpages/Navbar_Phone";

const Navbar = (props) => {
  return (
    <>
      {/* LOGIC:
        We use CSS 'display' to toggle content. This is faster and smoother 
        than React State for responsiveness because it happens instantly 
        before JavaScript even loads.
      */}

      {/* 1. MOBILE CONTAINER 
        - 'block': Visible by default
        - 'md:hidden': Hides instantly when screen is wider than 768px (Tablet/Desktop)
      */}
      <div className="block md:hidden">
        <Navbar_Phone {...props} />
      </div>

      {/* 2. DESKTOP CONTAINER 
        - 'hidden': Hidden by default
        - 'md:block': Becomes visible when screen is wider than 768px
      */}
      <div className="hidden md:block">
        <Navbar_Desktop {...props} />
      </div>
    </>
  );
};

export default Navbar;