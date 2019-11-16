// Viewport height
window.addEventListener('DOMContentLoaded', () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--initial-vh', `${vh}px`)
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})
window.addEventListener('resize', () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
})
