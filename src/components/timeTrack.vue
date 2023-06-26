时间轨道
<template>
  <div class="track">
    <div class="line left" ref="leftHandle" :style="{ left: `${minLimit}px` }"></div>
    <div class="scroll-line" ref="handle" :style="{ left: `5px` }"></div>
    <div class="line right" ref="rightHandle" :style="{ left: `${maxLimit}px` }"></div>
    <span
      class="tick"
      v-for="(time, index) of timeArr"
      :key="index"
      :style="{ left: `${index * 50}px` }"
      ><span class="t-text">{{ time }}s</span></span
    >
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { videoDuration, videoPoint, startPoint, endPoint,startPos, endPos } from "../store";
// 光标限度
const minLimit = ref(10);
const maxLimit = ref(0);

const timeArr = computed(() => {
  const count = Math.round(window.innerWidth / 50);
  maxLimit.value = (count - 1) * 50 + 10;
  endPoint.value = maxLimit.value
  startPos.value = 10
  endPos.value = maxLimit.value
  const timeLen = Number((videoDuration.value / count).toFixed(1));
  let tArr = [];
  for (let i = 0; i < count; i++) {
    if (i === count - 1) tArr.push(Number(videoDuration.value.toFixed(1)));
    else tArr.push(Number((i * timeLen).toFixed(1)));
  }
  return tArr;
});

const handle = ref(null);
const leftHandle = ref(null)
const rightHandle = ref(null)

onMounted(() => {
  handle.value.addEventListener("mousedown", startDrag);
  leftHandle.value.addEventListener("mousedown", leftStartDrag);
  rightHandle.value.addEventListener("mousedown", rightStartDrag);
})
function startDrag(event) {
  event.preventDefault();
  window.addEventListener("mousemove", drag);
  window.addEventListener("mouseup", stopDrag);
}
function drag(event) {
  event.preventDefault();
  let x = event.clientX;
  // console.log(x)
  if(x-10 >= minLimit.value && x-10 <= maxLimit.value) {
    handle.value.style.left = `${x-15}px`;
    if(Number(x/maxLimit.value).toFixed(2) <=1) {
      videoPoint.value = Number(x/maxLimit.value).toFixed(2)
    }
  }
}
function stopDrag(event) {
  event.preventDefault();
  window.removeEventListener("mousemove", drag);
  window.removeEventListener("mouseup", stopDrag);
}

function leftStartDrag(event) {
  event.preventDefault();
  window.addEventListener("mousemove", leftDrag);
  window.addEventListener("mouseup", leftStopDrag);
}
function leftDrag(event) {
  event.preventDefault();
  let x = event.clientX-24;
  console.log(x,endPoint.value)
  if(x >= 0 && x <= endPos.value) {
    leftHandle.value.style.left = `${x+10}px`;
    startPos.value = x
    startPoint.value = Number(x/maxLimit.value).toFixed(2)
  }
}
function leftStopDrag(event) {
  event.preventDefault();
  window.removeEventListener("mousemove", leftDrag);
  window.removeEventListener("mouseup", leftStopDrag);
}

function rightStartDrag(event) {
  event.preventDefault();
  window.addEventListener("mousemove", rightDrag);
  window.addEventListener("mouseup", rightStopDrag);
}
function rightDrag(event) {
  event.preventDefault();
  let x = event.clientX-24;
  console.log(x, startPoint.value, maxLimit.value);
  if(x >= startPos.value && x+10 <= maxLimit.value) {
    rightHandle.value.style.left = `${x+10}px`;
    endPos.value = x
    endPoint.value = Number(x/maxLimit.value).toFixed(2)
  }
}
function rightStopDrag(event) {
  event.preventDefault();
  window.removeEventListener("mousemove", rightDrag);
  window.removeEventListener("mouseup", rightStopDrag);
}

</script>

<style scoped>
.track {
  /* width: 100%; */
  height: 40px;
  /* border-top: 1px solid black; */
  border: 1px solid black;
  /* margin-top: 40px; */
  border-radius: 3px;
  margin: 20px 15px 0 15px;
  position: relative;
}
.tick {
  display: inline-block;
  width: 1px;
  height: 10px;
  background-color: #000;
  position: absolute;
  margin-left: 10px;
}
.t-text {
  display: inline-block;
  user-select: none;
  font-size: 12px;
  transform: translate(-50%, 30%);
}
.line {
  width: 2px;
  height: 40px;
  position: absolute;
  background-color: #5aafff;
  cursor: grab;
}
.left::before {
  content: '';
  display: block;
  width: 10px;
  height: 4px;
  margin-top: -2px;
  background-color: #5aafff;
}
.left::after {
  content: '';
  display: block;
  width: 10px;
  height: 4px;
  margin-top: 34px;
  background-color: #5aafff;
}
.right::before {
  content: '';
  display: block;
  width: 10px;
  height: 4px;
  margin-top: -2px;
  transform: translateX(-8px);
  background-color: #5aafff;
}
.right::after {
  content: '';
  display: block;
  width: 10px;
  height: 4px;
  margin-top: 34px;
  transform: translateX(-8px);
  background-color: #5aafff;
}
.scroll-line {
  width: 12px;
  height: 12px;
  position: absolute;
  top: 13px;
  border-radius: 50%;
  z-index: 1;
  background-color: #c3a3ff;
  cursor: grab;
}
</style>