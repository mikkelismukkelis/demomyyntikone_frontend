import React, { useState } from 'react'
import '../App.css'
import { FaArrowCircleUp } from 'react-icons/fa'

const ScrollTopArrow = () => {
  const [showScroll, setShowScroll] = useState(false)

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 100) {
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 100) {
      setShowScroll(false)
    }
  }

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  window.addEventListener('scroll', checkScrollTop)

  return (
    <FaArrowCircleUp
      className="scrollTop"
      onClick={scrollTop}
      style={{ height: 40, display: showScroll ? 'flex' : 'none' }}
    />
  )
}

export default ScrollTopArrow
