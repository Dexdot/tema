import anime from 'animejs'

const enter = (ctx, cb) =>
  new Promise(resolve => {
    ctx.$el.querySelector('#slider').classList.add('visible')

    setTimeout(() => {
      // Unlock scroll
      ctx.$emit('disable-scroll', false)

      if (cb) cb()
      resolve()
    }, 600)
  })

const leave = (ctx, cb) =>
  new Promise(resolve => {
    anime.set('#slider', { transition: 'unset' })

    // Show canvas
    anime({
      targets: '#slider',
      opacity: 0,
      duration: 300,
      easing: 'easeInCubic',
      complete: () => {
        // Destroy scene
        ctx.slider.destroy()

        if (cb) cb()
        resolve()
      }
    })
  })

export default { enter, leave }
