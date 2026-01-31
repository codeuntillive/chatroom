import React, { useRef, useState } from "react";
import "../style/navbar.css";
import { LiquidGlass } from "@creativoma/liquid-glass";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import plusIcon from "../assets/icons8-plus-24.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function Navbar() {
    const menuRef = useRef(null);
    const cardsRef = useRef([]);
    const btnRef = useRef(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useGSAP(() => {
        gsap.set(menuRef.current, { y: 80, opacity: 0, pointerEvents: "none" });
    });

    const toggleMenu = () => {
  const nav = document.querySelector(".nav");
  const menu = menuRef.current;

  if (!open) {
    
    gsap.set(nav, { height: "auto" });
    const fullHeight = nav.offsetHeight;

    gsap.set(nav, { height: 70 });

  
    gsap.to(nav, {
      height: fullHeight,
      duration: 0.45,
      ease: "power1.out",
    });

    gsap.to(menu, {
      y: 0,
      opacity: 1,
      duration: 0.45,
      ease: "power1.out",
      onStart: () => {
        menu.style.pointerEvents = "auto";
      },
    });

    gsap.fromTo(
      cardsRef.current,
      { y: '100%', opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.1,
        ease: "power1.out",
        delay: 0.1,
      }
    );

    
    gsap.to(btnRef.current, {
      rotate: 45,
      duration: 0.3,
      ease: "power2.out",
    });
  } else {
    // Close animation
    gsap.to(menu, {
      y: 80,
      opacity: 0,
      duration: 0.35,
      ease: "power3.in",
      onComplete: () => {
        menu.style.pointerEvents = "none";
      },
    });

    gsap.to(nav, {
      height: 70,
      duration: 0.4,
      ease: "power3.inOut",
    });

    gsap.to(btnRef.current, {
      rotate: 0,
      duration: 0.25,
    });
  }

  setOpen(!open);
};


    return (
        <>
            {/* NAVBAR */}
            <LiquidGlass
                backdropBlur={10}
                tintColor=""
                className="nav "
                
            >
                <nav>
                    <div className="logo-name">
                        <div className="logo">◎</div>
                        <div className="nav-name">CONNECT</div>
                    </div>

                    <div className="nav-detail">
                        <Link to="/signup">
                            <button className="start-btn">Get Started</button>
                        </Link>

                        <button className="menu-btn" onClick={toggleMenu}>
                            <img ref={btnRef} src={plusIcon} alt="menu" />
                        </button>
                    </div>
                </nav>
                <div className="menu-panel" ref={menuRef}>
                    <div
                        className="menu-card flex justify-center items-center"
                        ref={(el) => (cardsRef.current[0] = el)}
                        onClick={()=>(navigate("/"))}
                    >
                        <h3 className=" ">HOME</h3>
                        
                    </div>

                    <div
                        className="menu-card flex justify-center items-center "
                        ref={(el) => (cardsRef.current[1] = el)}
                        onClick={()=>(navigate("/dashboard"))}
                    >
                        <h3 className=" ">DASHBOARD</h3>
                        
                    </div>

                    <div
                        className="menu-card flex justify-center items-center"
                        ref={(el) => (cardsRef.current[2] = el)}
                        onClick={()=>(navigate("/login"))}
                    >
                        <h3 className=" ">LOGIN</h3>
                        
                    </div>
                </div>
            </LiquidGlass>

            {/* SLIDE MENU */}

        </>
    );
}
