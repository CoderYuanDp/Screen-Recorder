import { ffmpegCoreLoaded } from '../store'
import { fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({
  corePath: '/public/plugin/ffmpeg-core.js',
  log: true
})
ffmpeg.load()
// 监听执行进度
ffmpeg.setProgress(progress => {
  // processData.value = progress.ratio
  console.log('🚀 ~ file: useFfmpeg.ts:16 ~ progress.ratio:', progress.ratio)
})

ffmpeg.setLogger(logs => {
  if (logs.type === 'info' && logs.message.includes('ffmpeg-core loaded')) {
    ffmpegCoreLoaded.value = true
  }
})

let videoName = 'initVideo'
/**ffmpeg导入视频 */
// @param {Blob}
export const initVideo = async (video) => {
  ffmpeg.FS('writeFile', videoName, await fetchFile(video))
  await ffmpeg.run('-i', videoName)
}

/** 将视频转换为mp4 */
export const videoConverter = async (videoBlob) => {
  await ffmpeg.FS('writeFile', 'video.webm', await fetchFile(videoBlob))
  await ffmpeg.run('-i', 'video.webm', 'output.mp4')
  const data = ffmpeg.FS('readFile', 'output.mp4')
  return URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}

/** 截取视频帧 */
export const getFrame = async (
  fileUrl,
  fileName,
  initTime = '00:00:00.001'
) => {
  ffmpeg.FS('writeFile', fileName, await fetchFile(fileUrl))
  await ffmpeg.run(
    '-hwaccel', 'auto', '-i', fileName, '-ss', initTime, '-vframes', '1', '-s', '1920x1080', '-an', '-threads', '4', '-preset', 'fast', 'output.jpg'
  )
  const data = ffmpeg.FS('readFile', 'output.jpg')
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: 'image/jpeg' })
  )
  return url
}

/** 截取视频 */
export const ffmpegInterceptVideo = async (
  fileUrl,
  start,
  duration
) => {
  ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(fileUrl))

  await ffmpeg.run('-i', 'video.mp4', '-ss', start, '-t', duration, '-codec', 'copy', 'sliceOutput.mp4')

  const data = ffmpeg.FS('readFile', 'sliceOutput.mp4')
  const sliceVideoUrl = URL.createObjectURL(
    new Blob([data.buffer], { type: 'video/mp4' })
  )

  return sliceVideoUrl
}

/** 获取视频的每一秒帧 */
export const gVideoFrame = async (
  fileUrl,
  timeArr,  //number[]
  videoName = 'initVideo'
) => {
  const frameDir = videoName
  ffmpeg.FS('writeFile', videoName, await fetchFile(fileUrl))
  ffmpeg.FS('mkdir', frameDir + 'Frame')

  const second = tickCounts.value / timeArr[timeArr.length - 1]
  let cmd = `-i ${videoName} -vf fps=${second} -q:v 5 -s 320x240 -an -preset fast /${frameDir}Frame/%3d.jpeg -hide_banner`
  let args = cmd.split(' ')
  await ffmpeg.run(...args)
  const fileList = ffmpeg.FS('readdir', '/' + frameDir + 'Frame')
  //  @param { url: string }[]
  let urls = []
  fileList.forEach(v => {
    if (v !== '.' && v !== '..') {
      const path = frameDir + 'Frame' + '/' + v
      const img = ffmpeg.FS('readFile', path)
      let url = URL.createObjectURL(
        new Blob([img.buffer], { type: 'image/jpeg' })
      )
      urls.push({
        url
      })
    }
  })
  return urls
}

/**导出视频，降帧 */
export const videoLower = async (fileUrl, fileName) => {
  ffmpeg.FS('writeFile', fileName, await fetchFile(fileUrl))
  const cmd = `-i ${fileName} -b:v 2000k -q:v 2 -r 24 -s 1240x960 output.mp4`
  let args = cmd.split(' ')
  await ffmpeg.run(...args)
  const data = ffmpeg.FS('readFile', 'output.mp4')
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: 'video/mp4' })
  )
  return url
}


