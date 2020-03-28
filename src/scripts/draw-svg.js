const { TweenMax } = window

export default ({ el, duration = 1, options }) => {
  if (!el) return false

  const obj = { length: 0, pathLength: el.getTotalLength() }

  TweenMax.to(obj, duration, {
    length: obj.pathLength,
    onUpdate: () => {
      // eslint-disable-next-line
      el.style.strokeDasharray = [obj.length, obj.pathLength].join(' ');
    },
    ...options
  })

  return () => {
    TweenMax.killTweensOf(el)
  }
}
