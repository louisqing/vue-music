/**
 * Created by kf021 on 2017/6/30.
 */
export default class Singer {
  constructor({id, name}) {
    this.id = id
    this.name = name
    this.ayatar= `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
  }
}
