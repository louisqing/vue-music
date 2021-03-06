/**
 * Created by kf021 on 2017/7/3.
 */
export default class Song {
  constructor({id, mid, singer, name, album, durtion, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.durtion = durtion
    this.image = image
    this.url = url
  }
}
//抽成工厂方法
export function createSong(musicData) {
  return new Song({
    id:musicData.songid,
    mid:musicData.songmid,
    singer:fileterSinger(musicData.singer),
    name:musicData.songname,
    album:musicData.albumname,
    durtion:musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}
function fileterSinger(singer) {
  let ret = []
  if(!singer){
    return ''
  }
  singer.forEach((s)=>{
    ret.push(s.name)
  })
  return ret.join('/')
}
