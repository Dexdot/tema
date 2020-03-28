import anime from 'animejs';

const enter = (ctx, cb) =>
  new Promise(async resolve => {
    // Show canvas
    ctx.$el.querySelector('#inside').classList.add('visible');

    // Animate enter scene
    await ctx.scene.enter();

    // Show content
    anime({
      targets: '.case__container',
      opacity: 1,
      duration: 300,
      easing: 'easeOutCubic',
      complete: () => {
        if (cb) cb();
        resolve();
      }
    });
  });

const leave = (ctx, cb) =>
  new Promise(resolve => {
    anime.set('#slider', { transition: 'unset' });

    // Hide content
    anime({
      targets: '.case__container, .case__title span',
      opacity: 0,
      duration: 600,
      easing: 'easeInCubic',
      complete: async () => {
        // Animate back scene
        await ctx.scene.back();

        // Hide & destroy
        anime({
          targets: '#inside',
          opacity: 0,
          duration: 600,
          easing: 'easeInCubic',
          complete: () => {
            ctx.scene.destroy();

            if (cb) cb();
            resolve();
          }
        });
      }
    });
  });

export default { enter, leave };
