<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :data-index="index"
            :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <!--推动标题-->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  // 锚点的高度
  const ANXHOR_HEIGHI = 18
  const TITLE_HEIGHT = 30
  export default{
    created(){
      this.touch = {},
        this.listenScroll = true,
        this.listHeight = [],
        this.probeType = 3
    },
    data(){
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList(){
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle(){
        if (this.screenY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ""
      }
    },
    methods: {
      selectItem(item){
        this.$emit('select',item)
      },
      onShortcutTouchStart(e){
        let anchorIndex = getData(e.target, 'index')
        //touch当前的位置 e.touches  当前手指的第一个
        let firstTouch = e.touches[0]
        // 为什么移动的数据不保持到data中或者props中而是放在created  data和props的数据改变都会被vue检测和更新以上数据  而我们只是做js中的数据通信
        this.touch.y1 = firstTouch.pageY
        //当前index的索值
        this.touch.anchorIndex = anchorIndex
        this._ScrollTop(anchorIndex)
      },
      onShortcutTouchMove(e){
        let firstToch = e.touches[0]
        this.touch.y2 = firstToch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANXHOR_HEIGHI | 0
        let anchorIndex = parseInt(this.touch.anchorIndex + delta)
        this._ScrollTop(anchorIndex)
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      //公共的方法
      _ScrollTop(index){
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight - 2) {
          index = this.listHeight - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data(){
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY){
        const listHeight = this.listHeight
        //当滚动到顶部
        if (newY > 0) {
          this.currentIndex = 0
        }
        //滚动到中间
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        //滚动到底部且是-newy大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal){
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`
      }
      /*currentIndex(cc){
        //在data中的数据  可以在watch中通过传值的方式进行改变
        console.log(cc)
      }*/
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
