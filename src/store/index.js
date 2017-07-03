/**
 * Created by kf021 on 2017/7/3.  主入口文件
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 辅助工具 引入这个logger.js可以在控制台打印修改的值方便我们调试
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

//调试工具vuex  开发的时候用调试工具
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
