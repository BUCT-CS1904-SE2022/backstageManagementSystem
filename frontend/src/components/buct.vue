<template>
  <div style="">
    <div class="team-container">
      <svg viewBox="0 0 500 150">
        <symbol id="line-text">
          <text text-anchor="middle" x="50%" y="50%" dy=".4em">BUCT</text>
        </symbol>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "buct",
  data() {
    return {
      data: [],
    };
  },
  methods: {},
};
</script>

<style scoped>
.team-container {
  position: absolute;
  width:200px;
  height:90px;
  top: 0%;
  right:0%;
  font-size: 140px;
  font-weight: bolder;
  text-transform: uppercase;
  z-index: 5000;

}
.team-container svg {
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0%;
  top:0%;
}

.team-container .text {
  fill: none;
  stroke-width: 5;
  stroke-dasharray: 0 240;
  stroke-dashoffset: 0;
}

.team-container .text:nth-child(4n + 1) {
  stroke: rgb(179,157,250);
  animation: text1 4s 1s ease-in-out forwards;
}
.team-container .text:nth-child(4n + 2) {
  stroke: rgb(198,209,79);
  animation: text2 4s 1s ease-in-out forwards;
}
.team-container .text:nth-child(4n + 3) {
  stroke: rgb(94,167,254);
  animation: text3 4s 1s ease-in-out forwards;
}
.team-container .text:nth-child(4n + 4) {
  stroke: rgb(107,235,203);
  animation: text4 4s 1s ease-in-out forwards;
}

@keyframes text1 {
  100% {
    stroke-dashoffset: 1000;
    stroke-dasharray: 60 180;
  }
}

@keyframes text2 {
  100% {
    stroke-dashoffset: 1060;
    stroke-dasharray: 60 180;
  }
}

@keyframes text3 {
  100% {
    stroke-dashoffset: 1120;
    stroke-dasharray: 60 180;
  }
}

@keyframes text4 {
  100% {
    stroke-dashoffset: 1180;
    stroke-dasharray: 60 180;
  }
}
</style>