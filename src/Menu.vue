<template>
  <transition name="menu">
    <section class="menu" v-show="active">
      <div class="menu__overlay"></div>

      <nav class="menu__nav" @click="$emit('click')">
        <ul>
          <li>
            <router-link class="menu__link" to="/">Cases</router-link>
          </li>
        </ul>
      </nav>
    </section>
  </transition>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~@/sass/utils"

/* ENTER */
.menu-enter
  pointer-events: none

  nav li
    opacity: 0
    transform: translateY(16px)

  .menu__overlay
    transform: translateY(101%)


.menu-enter-to
  pointer-events: auto

  .menu__overlay,
  nav li
    opacity: 1
    transform: translateY(0%)


.menu-enter-active
  transition: 1s ease-in-out

  .menu__overlay
    transition: 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)

@for $i from 1 through 4
  .menu-enter-active .menu__nav li:nth-child(#{$i})
    transition: 0.4s ease (#{$i*0.05s + 0.4s})


/* LEAVE */
.menu-leave
  pointer-events: auto

  nav li
    opacity: 1

  .menu__overlay,
  nav li
    transform: translateY(0%)

.menu-leave-to
  pointer-events: none

  nav li
    opacity: 0

  .menu__overlay
    transform: translateY(101%)

.menu-leave-active
  transition: 1s ease-in-out

  .menu__overlay
    transition: 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)

@for $i from 1 through 4
  .menu-leave-active .menu__nav li:nth-child(#{$i})
    transition: 0.4s ease (#{$i*0.05s})

.menu
  z-index: 2
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0

  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)

  @media (min-width: 501px)
    display: none



// Overlay
.menu__overlay
  background: #000
  position: absolute
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)

.menu__nav
  z-index: 1
  position: absolute
  top: 50%
  right: 0
  transform: translateY(-50%)

  text-align: right

  @media (max-width: 500px)
    right: var(--unit-h)

  li:not(:last-child)
    margin-bottom: 4px

.menu__link
  line-height: 1
  font-size: 48px
  color: #fff !important
  transition: 0.25s ease

.menu__nav:hover
  .menu__link:not(.router-link-exact-active),
  .menu__link.router-link-exact-active
    opacity: 0.3

.menu__nav
  .menu__link:not(.router-link-exact-active):hover,
  .menu__link.router-link-exact-active:hover
    opacity: 1
</style>
