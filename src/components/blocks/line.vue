<template>
  <svg data="lineblock" :class="data.class || ''" class="pointer-events-none" :id="blockindex + '-line'"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
    <defs>
      <linearGradient :id="blockindex + '-line-gradient'" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" :style="'stop-color:' + linecolor + ';stop-opacity:0.8'" />
        <stop offset="20%" :style="'stop-color:' + linecolor + ';stop-opacity:1'" />
        <stop offset="80%" :style="'stop-color:' + linecolor + ';stop-opacity:1'" />
        <stop offset="100%" :style="'stop-color:' + linecolor + ';stop-opacity:0.8'" />
      </linearGradient>
    </defs>
    <path ref="line" id="line" :stroke="linecolor" stroke-width="4" stroke-linecap="round" fill="none" />
  </svg>
</template>

<script setup>

// Props
const props = defineProps({
  data: Object,
  blockindex: String,
});

// Variables
const line = ref();
const linecolor = ref();
const selectorFrom = ref();
const selectorTo = ref();
const gradientStops = ref([]);

// Watch props
watch(
  () => props,
  (nv) => {
    init();
  },
  { deep: true }
);

// Initialize component
const init = () => {
  selectorFrom.value = '[name="' + props.data.from + '"]';
  selectorTo.value = '[name="' + props.data.to + '"]';
  linecolor.value = props.data.color || '#ffdd00';
  updateLine();
};

// Update line function
function updateLine() {
  const elementFrom = document.querySelector(selectorFrom.value);
  const elementTo = document.querySelector(selectorTo.value);


  if (!elementFrom || !elementTo) return;

  const rectFrom = elementFrom.getBoundingClientRect();
  const rectTo = elementTo.getBoundingClientRect();
  const posFrom = getPosition(
    rectFrom,
    props.data.posFrom,
    props.data.postFromPLeft,
    props.data.postFromPTop
  );
  const posTo = getPosition(rectTo, props.data.posTo, props.data.postToPLeft, props.data.postToPTop);

  const pathData = `M ${posFrom} L ${posTo}`;
  if (line.value) {
    line.value.setAttribute('d', pathData);
    requestAnimationFrame(updateLine);
  }
}

// Get position function
function getPosition(rect, pos, pLeft, pTop) {
  let position = `${rect.left + rect.width / 2} ${rect.top + rect.height / 2}`;
  if (!props.data.posPercentage) {
    position = getFromToPosition(rect, pos);
  } else {
    position = `${rect.left + (rect.width * pLeft) / 100} ${rect.top + (rect.height * pTop) / 100}`;
  }
  return position;
}

// Get from to position function
function getFromToPosition(rect, pos) {
  const offset = 2; // Adjust this value as needed
  switch (pos) {
    case 'b':
      return `${rect.left + rect.width / 2} ${rect.top + rect.height + offset}`;
    case 't':
      return `${rect.left + rect.width / 2} ${rect.top - offset}`;
    case 'l':
      return `${rect.left - offset} ${rect.top + rect.height / 2}`;
    case 'r':
      return `${rect.left + rect.width + offset} ${rect.top + rect.height / 2}`;
    default:
      return `${rect.left + rect.width / 2} ${rect.top + rect.height / 2}`;
  }
}

// Lifecycle hook
onMounted(() => {
  init();
});
</script>