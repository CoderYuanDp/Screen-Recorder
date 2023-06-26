# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplas?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## 原生写法
```javascript
const record = async () => {
  let stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
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

  mediaRecorder.addEventListener("stop", function () {
    let blob = new Blob(chunks, {
      type: chunks[0].type,
    });
    // 播放
    let video = document.querySelector(".video");
    const url = URL.createObjectURL(blob);
    video.src = url;
    // 下载
    let a = document.createElement("a");
    const mp4File = new File(
        [url],
        "vedio.mp4",
        { type: 'video/mp4' }
    );
    const mp4Url = URL.createObjectURL(mp4File); 
    console.log(mp4Url);
    a.href = mp4Url;
    a.download = 'vedio/mp4';
    a.click();
  });

  // 必须手动启动
  mediaRecorder.start();
};
```

## 录制指定canvas画面
```javascript
import html2canvas from 'html2canvas';
import RecordRTC from 'recordrtc';
window.html2canvas = html2canvas;

const cvs = document.getElementById('cvs');

// 初始化开始录制
const recorder = new RecordRTC(cvs, {
  type: 'canvas',
  mimeType: 'video/webm;codecs=h264',
  recorderType: RecordRTC.CanvasRecorder,
  disableLogs: true,
});

// 结束录制
recorder.stopRecording(() => {
  const blob = recorder.getBlob();
  // 导出视频，遗憾的是这里windows自带播放器无法播放，chrome浏览器和手机上都可以播放，后面会讲到如何转码
  RecordRTC.invokeSaveAsDialog(blob, 'test.mp4');
});
```

## OpRec库（navigator.mediaDevices.getDisplayMedia api）

## 


