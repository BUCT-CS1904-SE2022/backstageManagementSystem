<template>
  <a-layout hasSider>
    <a-layout-sider
      v-model="leftCollapsed"
      collapsible
      id="side"
      class="layout-sider"
    >
      <div class="logo"><span v-show="leftCollapsed == 0">BUCT</span></div>
      <a-menu
        theme="dark"
        mode="inline"
        selectable
        class="menu"
        :selectedKeys="selectKeys"
        @click="handelSelect"
      >
        <!--<a-menu-item key="index">
          <a-icon type="home" />
          <span>首页</span>
        </a-menu-item>-->
        <a-menu-item key="home">
          <a-icon type="user" />
          <span>个人中心</span>
        </a-menu-item>
        <a-menu-item key="backup">
          <a-icon type="taobao-circle" />
          <span>数据备份</span>
        </a-menu-item>
        <a-menu-item key="log">
          <a-icon type="form" />
          <span>操作日志</span>
        </a-menu-item>
        <a-sub-menu key="management">
          <span slot="title">
            <a-icon type="apartment" />
            <span>数据管理</span>
          </span>
          <a-menu-item key="comment">
            <a-icon type="solution" />
            <span>管理评论</span>
          </a-menu-item>
          <a-menu-item key="relic">
            <a-icon type="solution" />
            <span>管理文物</span>
          </a-menu-item>
          <a-menu-item key="user">
            <a-icon type="solution" />
            <span>管理用户</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout :style="rightDivStyle" class="rightDiv">
      <a-layout-header class="layout-header">
        <div class="title">
          海外博物馆后台管理子系统
        </div>
      </a-layout-header>
      <a-layout-content :style="{ paddingTop: '68px' }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  name: "basePage",
  components: {},
  data() {
    return {
      leftCollapsed: false,
      selectKeys: [],
      rightDivStyle: {
        paddingLeft: "200px",
      },
    };
  },
  computed: {
    url() {
      return this.$route.name;
    },
  },
  watch: {
    url() {
      this.selectKeys = [this.$route.name];
    },
    leftCollapsed() {
      this.leftCollapsed
        ? (this.rightDivStyle.paddingLeft = "80px")
        : (this.rightDivStyle.paddingLeft = "200px");
    },
  },
  beforeMount() {
    this.selectKeys = [this.$route.name];
  },
  methods: {
    handelSelect(item) {
      //console.log(item)
      if (item.key != this.selectKeys[0]) {
        this.$router.push("/" + item.key);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.layout-sider {
  overflow: auto;
  position: fixed;
  left: 0;
  height: 100%;
  z-index: 10;
  .menu {
    height: 100%;
  }
}
.layout-header {
  background-color: #001529;
  height: 68px;
  width: 100%;
  position: fixed;
  z-index: 1000;
}
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  color: white;
  font-size: 22px;
}
.title {
  color: white;
  font-size: 20px;
  margin-left: -200px;
}
/*滚动条隐藏样式*/
#side {
  overflow-y: auto;
  &::-webkit-scrollbar {
    /* WebKit */
    display: none;
  }
  -ms-overflow-style: none; /* Edge */
  scrollbar-width: none; /* Firefox */
}
section.rightDiv.ant-layout {
  transition: padding-left 0.2s;
  -moz-transition: padding-left 0.2s; /* Firefox 4 */
  -webkit-transition: padding-left 0.2s; /* Safari and Chrome */
  -o-transition: padding-left 0.2s; /* Opera */
}
</style>