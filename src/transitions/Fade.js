import anime from 'animejs'

const enter = (el, cb) =>
  new Promise(resolve => {
    anime({
      targets: el,
      duration: 800,
      opacity: [0, 1],
      easing: 'cubicBezier(.25,.01,.25,1)',
      begin: () => {
        el.style.willChange = 'opacity'
      },
      complete: () => {
        el.style.willChange = ''
        if (cb) cb()
      },
      update: ({ progress }) => {
        if (progress >= 60) resolve()
      }
    })
  })

const leave = (el, cb) =>
  new Promise(resolve => {
    anime({
      targets: el,
      duration: 600,
      opacity: [1, 0],
      easing: 'cubicBezier(.25,.01,.25,1)',
      begin: () => {
        el.style.willChange = 'opacity'
      },
      complete: () => {
        el.style.willChange = ''
        if (cb) cb()
      },
      update: ({ progress }) => {
        if (progress >= 60) resolve()
      }
    })
  })

export default { enter, leave }
