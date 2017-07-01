/**
 * Created by kf021 on 2017/6/29.
 */
//dom操作的对象
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split('')
  newClass.push(className)
  el.className = newClass.join('')
}

/*歌手页面的点击右边跳转到左边对应的标题分组dom操作*/
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix +name
  if (val) {
    return el.setAttribute(prefix + name, val)
  }else{
    return el.getAttribute(name)
  }
}
