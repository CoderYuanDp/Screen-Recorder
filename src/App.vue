<template>
  <div>
    <div class="video-con">
      <div class="no-video" v-show="videoIsShow">请录制视频</div>
      <video class="video" ref="player" width="600px" muted controls></video>
    </div>

    <div class="btn-con">
      <button class="record-btn" @click="record">录制</button>
      <button @click="play">播放</button>
      <button @click="interceptVideo">裁切</button>
      <button @click="sliceFrame">截取帧</button>
      <button @click="downloadVideo">下载</button>
    </div>
  </div>
  <time-track></time-track>
</template>

<script setup>
import { ref, watch } from "vue";
import timeTrack from "./components/timeTrack.vue";
import { videoDuration, videoPoint, videoPointTime, startTime, endTime } from "./store";
import { initVideo, getFrame, videoConverter, ffmpegInterceptVideo } from "./utils/useFfmpeg";
import { downloadFile } from "./utils/tools";

const player = ref(null);
const videoIsShow = ref(true);
const videoUrl = ref("");
const record = async () => {
  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
  // 需要更好的浏览器支持
  const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm";
  let mediaRecorder = new MediaRecorder(stream, {
    mimeType: mime,
  });
  let chunks = [];
  mediaRecorder.addEventListener("dataavailable", function (e) {
    chunks.push(e.data);
  });

  mediaRecorder.addEventListener("stop", async function () {
    let blob = new Blob(chunks, {
      type: chunks[0].type,
    });
    console.log(blob);
    const url = URL.createObjectURL(blob);
    try {
      await initVideo(blob);
      // 获取mp4文件
      const mp4Url = await videoConverter(blob);
      videoUrl.value = mp4Url;
      console.log("mp4Url", mp4Url);
      // 播放
      videoIsShow.value = false;
      // let video = document.querySelector(".video");
      player.value.src = mp4Url;
      player.value.play();
      player.value.addEventListener("loadedmetadata", () => {
        console.log("时长2", player.value.duration);
        videoDuration.value = player.value.duration;
      });
    } catch (err) {
      console.log("此视频：", err);
      alert("录制的视频无法进行编辑，仅能进行观看体验");
    }
  });

  // 必须手动启动
  mediaRecorder.start();
};

const downloadVideo = () => {
  downloadFile(videoUrl.value, "video/mp4");
};

const play = () => {
  if (player.value.paused) {
    player.value.play();
  } else player.value.pause();
};

const sliceFrame = async () => {
  const frameUrl = await getFrame(
    videoUrl.value,
    "video-frame",
    "00:00:" + videoPointTime.value
  );
  downloadFile(frameUrl, "image/jpeg");
};

watch(videoPointTime, (newVal) => {
  console.log(newVal);
  player.value.currentTime = newVal;
  player.value.play();
});

const interceptVideo = async () => {
  const durt = endTime.value - startTime.value;
  console.log('00:00:'+startTime.value, '00:00:'+durt)
  const irptUrl = await ffmpegInterceptVideo(videoUrl.value, '00:00:'+startTime.value, '00:00:'+durt)
  downloadFile(irptUrl, "video/mp4");
} 


</script>

<style scoped>
.video {
  width: 600px;
  height: 400px;
  display: block;
  margin: 0 auto;
}
.video-con {
  width: 600px;
  height: 400px;
  margin: 0 auto;
  position: relative;
}
.no-video {
  width: 600px;
  height: 400px;
  position: absolute;
  background-color: #ebebeb;
  text-align: center;
  line-height: 400px;
  top: 0;
  left: 0;
  z-index: 1;
}
.btn-con {
  text-align: center;
  padding: 20px 0;
}
</style>
