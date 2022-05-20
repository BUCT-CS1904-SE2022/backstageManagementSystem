<template>
  <div>
    <a-card>首页</a-card>
  </div>
</template>

<script>
import buct from '../components/buct'
export default {
  name: "index",
  data() {
    return {
      data: [],
 
    };
  },
  components: {
    buct,
  },
  methods: {
        
    getBackendData() {
      this.$store.state
        .currentMemberDataGet()
        .then((response) => {
          
          console.log(response);
        });
    },
  },
  beforeMount() {
    //this.getBackendData();
  },
};
</script>

<style scoped>

</style>