import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function Intro() {
  const textRef = useRef(null)
  const container = useRef(null)
  const cursorRef = useRef(null)
  const lettersRef = useRef([])

  const word = 'CONNECT'.split('')

  useGSAP(() => {
    const tl = gsap.timeline()

    // heading
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5 }
    )

    // letters + cursor movement
    lettersRef.current.forEach((letter, i) => {
      tl.to(cursorRef.current, {
        x: letter.offsetLeft + letter.offsetWidth,
        duration: 0.2,
        opacity: 100,
        ease: 'none'
      }, '-=0.2')
      .from(letter, {
        opacity: 0,
        duration: 0.3,
        ease: 'power3.out'
      })
      
    })
    tl.to(cursorRef.current, {
        x:"100vw"
      }, '-=0.2')

  }, { scope: container })

  return (
    <div ref={container} style={{ color: 'black', padding: '20px',overflow: 'hidden' }}>
      <h1 ref={textRef}>Welcome to the Chat Room</h1>

      <div
        className="logo"
        style={{
          fontFamily: 'fantasy',
          fontSize: 200,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <span
          ref={cursorRef}
          style={{
            position: 'absolute',
            top: 10,
            left: 0,
            fontSize: 180,
            opacity: 0
          }}
        >
          |
        </span>
        {word.map((letter, index) => (
          <span
            key={index}
            ref={el => lettersRef.current[index] = el}
            style={{ display: 'inline-block' }}
          >
            {letter}
          </span>
        ))}

        
      </div>
    </div>
  )
}

export { Intro }
