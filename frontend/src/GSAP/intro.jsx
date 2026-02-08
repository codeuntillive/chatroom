import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)
function Intro() {
  const container = useRef(null)
  const tlRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline({ paused: true })
    gsap.to(".bc",{
      x:500,
      duration:3,
      rotate:360,
    })
    tl.from(".logo", {
      y: 400,
      opacity: 0,
      scale: 0.1,
      duration: 1
    })
    .from(".tag", {
      opacity: 0,
      x: -200,
      ease: "elastic.out(1,0.3)",
      duration: 1
    })
    gsap.to(".box",{
      scrollTrigger:{
        trigger:".box",
        start:"top 80%",
        end:"top 30%",
        scrub:true,
        markers:true,
        onUpdate: (self) => console.log("progress:", self.progress),
      },
      x:500,
      duration:3,
      rotateX:360,
      backgroundColor:"red",
    })

    tlRef.current = tl
  }, { scope: container })

  return (
    <div
      ref={container}
      style={{
       
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#121212',
        overflow: 'hidden'
      }}
    >
      <div className="name text-white" style={{ width: '100vw',
        height: '100vh',display:"flex",justifyContent:"center",flexDirection:'column',alignItems:"center"}}>
        <div className="tag" style={{ fontSize: "clamp(1.5rem,2vh,3vh)" }}>
          most secure chats
        </div>

        <div
          className="logo"
          style={{
            fontSize: "200px",
            fontWeight: 'bold',
            backgroundImage: 'linear-gradient(90deg, #ff8a00, #e52e71)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          CONNECT
        </div>

        <div className="btn" onClick={() => tlRef.current.play()} style={{width:"80%",margin:"0.25rem"}}>Play</div>
        <div className="btn" onClick={() => tlRef.current.pause()} style={{width:"80%",margin:"0.25rem"}}>Pause</div>
        <div className="btn" onClick={() => tlRef.current.pause(0)} style={{width:"80%",margin:"0.25rem"}}>Stop</div>
        <div className="btn" onClick={() => tlRef.current.restart()} style={{width:"80%",margin:"0.25rem"}}>Restart</div>
      </div>
      <div style={{width:'100vw',height:'100vh',backgroundColor:'yellowgreen'}}>
            <div className="box" style={{width:"400px",height:'400px',backgroundColor:'blue',borderRadius:'50%'}}>

            </div>
      </div>
      <div className="bc" style={{width:'400px',height:'400px',backgroundColor:'red'}}></div>
    </div>
  )
}

export { Intro }
