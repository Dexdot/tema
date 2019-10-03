const set = () => {
  // Viewport height
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('DOMContentLoaded', set)
window.addEventListener('resize', set)
