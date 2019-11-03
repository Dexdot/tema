import anime from 'animejs'

const enter = (ctx, cb) =>
  new Promise(async resolve => {
    console.log('case enter start')

    // Show canvas
    ctx.$el.querySelector('#inside').classList.add('visible')

    // Animate enter scene
    await ctx.scene.enter()

    // Show title
    anime.set('.case__title span', { translateY: '0%' })

    // Show content
    anime({
      targets: '.case__container',
      opacity: 1,
      duration: 300,
      easing: 'easeOutCubic',
      complete: () => {
        console.log('case enter end')
        if (cb) cb()
        resolve()
      }
    })
  })

const leave = (ctx, cb) =>
  new Promise(resolve => {
    console.log('case leave start')

    anime.set('#slider', { transition: 'unset' })

    // Hide content
    anime({
      targets: '.case__container, .case__title span',
      opacity: 0,
      duration: 600,
      easing: 'easeInCubic',
      complete: async () => {
        // Animate back scene
        await ctx.scene.back()

        // Hide & destroy
        anime({
          targets: '#inside',
          opacity: 0,
          duration: 600,
          easing: 'easeInCubic',
          complete: () => {
            ctx.scene.destroy()

            console.log('case leave end')
            if (cb) cb()
            resolve()
          }
        })
      }
    })
  })

export default { enter, leave }
