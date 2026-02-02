import { useEffect, useRef, useState, Suspense, useLayoutEffect } from "react";
import gsap from "gsap";
import "../style/Home.css";
import laser from "../assets/laser.mp4";
import bg from "../assets/bg.mp4";
import chatsImg from "../assets/chats.png";
import Decrypt from "../components/dcrypet";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import MagicBento from "../components/bento";

export default function Home() {
  const navigate = useNavigate();
  /* ---------------- REFS ---------------- */
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const laserContainerRef = useRef(null);
  const revealImgRef = useRef(null);

  /* ---------------- STATE ---------------- */
  const [laserMounted, setLaserMounted] = useState(false);
  const [laserKey, setLaserKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);


  /* ---------------- GSAP HERO ANIMATIONS ---------------- */
  useEffect(() => {


    const ctx = gsap.context(() => {
      gsap.from(".hero-anim", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      if (statsRef.current) {
        gsap.from(statsRef.current, {
          y: 30,
          opacity: 0,
          delay: 0.6,
          duration: 1,
          ease: "power3.out",
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [loading]);




  /* ---------------- MAIN UI ---------------- */
  return (
    <div className=" overflow-scroll">
      <Navbar />

      {/* ---------------- HERO ---------------- */}
      <section className="hero" ref={heroRef}>
        <video src={bg} autoPlay loop muted className="bg" />
        <div className="hero-content">
          <h1 className="hero-anim">
            Messaging With <br /> <span>Unbreakable</span> Security
          </h1>
          <p className="hero-anim">
            Experience true privacy with Connect. Every message is protected by
            advanced encryption and hash-based storage.
          </p>
          <div className="hero-buttons hero-anim">
            <button className="primary-btn" onClick={()=>(navigate('dashboard'))}>Start Secure Messaging</button>
            
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <div className="stats" ref={statsRef}>
        <div className="stat">
          <h3>256-bit</h3>
          <p>Encryption</p>
        </div>
        <div className="divider" />
        <div className="stat">
          <h3>0</h3>
          <p>Data Collected</p>
        </div>
        <div className="divider" />
        <div className="stat">
          <h3>100%</h3>
          <p>Private</p>
        </div>
      </div>

      {/* ---------------- PROTECTION SECTION ---------------- */}
      <section className="section ">
        <div className="header-a">
          <Decrypt
            text="multiple layers of protection."
            parentClassName="subtitle text-center text-white my-5"
          />
          {/* <div className="subtitle">Multiple Layers of Protection</div> */}
        </div>
        <div className="grid">
          {[
            ["01", "Your Message", "You type and send a message"],
            ["02", "Encryption Layer", "Encrypted before leaving device"],
            ["03", "Hash Storage", "Stored using cryptographic hashing"],
            ["04", "Secure Delivery", "Only recipient can decrypt"],
          ].map(([num, title, desc]) => (
            <div className="card" key={num}>
              <span className="number">{num}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- LASER SECTION ---------------- */}
      <div
        className="
          laser-section my-1 relative overflow-hidden bg-[#1111]
          h-[fit-content] sm:h-[fit-content] md:h-[fit-content] lg:h-[fit-content]
        "
        ref={laserContainerRef}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();

          // cursor position relative to the element
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", `${x}px`);
            el.style.setProperty("--my", `${y}px`);
          }
        }}
        onMouseLeave={() => {
          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", "-9999px");
            el.style.setProperty("--my", "-9999px");
          }
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          const rect = e.currentTarget.getBoundingClientRect();

          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;

          const el = revealImgRef.current;
          if (el) {
            el.style.setProperty("--mx", `${x}px`);
            el.style.setProperty("--my", `${y}px`);
          }
        }}


      >
        {/* ---------------- LASER CANVAS ---------------- */}
        <video src={laser} autoPlay loop muted className="laser relative " ></video>

        {/* ---------------- MAGIC BENTO ---------------- */}
        <div
          className="
            bentoo   "
        >
          <MagicBento />
        </div>

        {/* ---------------- REVEAL IMAGE ---------------- */}
        <img
          ref={revealImgRef}
          src={chatsImg}
          alt="Chats"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "40%",
            objectFit: "cover",
            zIndex: 0,
            pointerEvents: "none",

            /* start hidden */
            "--mx": "-999px",
            "--my": "-999px",

            /* make image grey */
            filter: "grayscale(100%)",

            /* smaller circle */
            WebkitMaskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.8) 50px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0) 200px)",
            maskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.8) 50px, rgba(255,255,255,0.3) 60px, rgba(255,255,255,0) 200px)",

            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            transition: "mask-image 0.3s ease",
          }}
        />

      </div>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="footer bg-black  text-white sm:footer-horizontal p-20">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 ..."></path>
              </svg>
            </a>
            
          </div>
        </nav>
      </footer>
    </div>
  );
}
