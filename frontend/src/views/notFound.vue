<template>
  <div class="overall-container">
    <h1 class="style-404">404</h1>
    <h2 class="not-found">Not Found</h2>
    <p>The resource requested could not be found on this server!</p>
    <div class="button">
      <h2>
        <div class="return" @click="returnIndex">返回首页</div>
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "notFound",
  methods: {
    returnIndex() {
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.overall-container {
  height: auto;
  min-height: 100%;
  text-align: center;
  width: 800px;
  margin-left: -400px;
  position: absolute;
  top: 30%;
  left: 50%;
}
.style-404 {
  margin: 0;
  font-size: 150px;
  line-height: 150px;
  font-weight: bold;
}
.not-found {
  margin-top: 20px;
  font-size: 30px;
}
.return {
  color: blue;
  text-decoration: underline;
}
.return:hover {
  cursor: pointer;
}
</style>