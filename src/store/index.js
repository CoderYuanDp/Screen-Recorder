import { ref, computed, watch } from "vue";

const videoInfo = ref({})
const videoDuration = ref(0)
const ffmpegCoreLoaded = ref(false)
const videoPoint = ref(0.001);
const startPos = ref(0)
const endPos = ref(1)
const startPoint = ref(0)
const endPoint = ref(0.001)
const videoPointTime = computed(() => {
  return Number(videoDuration.value*videoPoint.value).toFixed(6)
})

const startTime = computed(() => {
  return Number(videoDuration.value*startPoint.value).toFixed(6)
})

const endTime = computed(() => {
  return Number(videoDuration.value*endPoint.value).toFixed(6)
})

export {
  videoInfo,
  videoDuration,
  ffmpegCoreLoaded,
  videoPoint,
  videoPointTime,
  startPoint,
  endPoint,
  startTime,
  endTime,
  startPos,
  endPos

}

