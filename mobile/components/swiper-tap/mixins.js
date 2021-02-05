import Layout from '../eject-layout'

export default {
  components: {
    Layout
  },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    list: {
      type: Array,
      require: false,
      default() {
        return this.CONDITION_INFO.sortBy.default
      }
    },
    chooseLine: {
      type: Number,
      require: false,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      lang: this.LANGUAGE.components.swiperTap,
      active: false,
      top: 0,
      activeLine: 0,
      nowIndex: 0,
      startIndex: -1
    }
  },
  watch: {
    list: function() {
      this.activeLine =
        this.chooseLine > this.list.length - 1
          ? this.list.length - 1
          : this.chooseLine
      this.top =
        this.activeLine > 0 ? -this.activeLine * (100 / this.list.length) : 0
    },
    chooseLine: function() {
      this.activeLine =
        this.chooseLine > this.list.length - 1
          ? this.list.length - 1
          : this.chooseLine
      this.top =
        this.activeLine > 0 ? -this.activeLine * (100 / this.list.length) : 0
    }
  },
  mounted() {
    this.activeLine =
      this.chooseLine > this.list.length - 1
        ? this.list.length - 1
        : this.chooseLine
    this.top =
      this.activeLine > 0 ? -this.activeLine * (100 / this.list.length) : 0
  },
  methods: {
    //  show box
    show() {
      this.active = true
    },
    //  hide box
    hide() {
      this.$emit('close')
      this.active = false
    },
    clear() {
      this.$emit('clear', {
        index: this.nowIndex,
        item: this.list[this.nowIndex]
      })
      this.hide()
    },
    //  event
    touchStart(e,k) {
      e.preventDefault()
      let startY = e.targetTouches[0].clientY
      let endY = null
      const touchMove = e => {
        endY = e.targetTouches[0].clientY
        if (startY - endY >= 0 && startY - endY >= 35) {
          goUp()
          this.activeLine += 1
          if (this.activeLine > this.list.length - 4) {
            this.activeLine = this.list.length - 4
          } else {
            this.top -= 100 / this.list.length
          }
        } else if (startY - endY <= 0 && startY - endY <= -35) {
          goDown()
          this.activeLine -= 1
          if (this.activeLine < 0) {
            this.activeLine = 0
          } else {
            this.top += 100 / this.list.length
          }
        }
      }
      const goUp = () => {
        // console.log(`up`)
        startY = endY
      }
      const goDown = () => {
        // console.log(`down`)
        startY = endY
      }
      const deleteListener = () => {
        document.removeEventListener('touchmove', touchMove)
        document.removeEventListener('touchend', deleteListener)
      }
      document.addEventListener('touchmove', touchMove)
      document.addEventListener('touchend', deleteListener)
      this.nowIndex = k;
    }
  }
}
