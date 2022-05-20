<template>
  <div>
    <div class="buct-container">
      <svg viewBox="0 0 1100 150">
        <symbol id="line-text">
          <text text-anchor="middle" x="50%" y="50%" dy=".4em">BUCT</text>
        </symbol>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
      </svg>
    </div>
    <a-card>
      <h1>个人信息维护</h1>
      <a-form
        :form="form"
        :label-col="{ span: 10 }"
        :wrapper-col="{ span: 4 }"
        @submit="handleSubmit"
      >
        <a-form-item label="用户名">
          <a-mentions :placeholder=username readonly></a-mentions>
        </a-form-item>
        <!--<a-form-item label="手机号">
          <a-mentions :placeholder=phone readonly></a-mentions>
        </a-form-item>-->
        <a-form-item label="新密码">
          <a-input type="password" placeholder="不填即不更改密码" v-decorator="['password']" />
        </a-form-item>
        <a-form-item label="个性签名">
          <a-input v-decorator="['signature', { initialValue: signature }]" />
        </a-form-item>
        <!--<a-form-item label="性别">
          <a-select v-decorator="['sex', { initialValue: sex }]">
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number v-decorator="['age', { initialValue: age }]" :min="1" />
        </a-form-item>-->
        <a-form-item :wrapper-col="{ span: 10, offset: 7 }">
          <a-button type="primary" html-type="submit">更新信息</a-button>
        </a-form-item>
      </a-form>
      <a-popconfirm
        title="你确定要退出登录吗？"
        ok-text="是"
        cancel-text="否"
        @confirm="logout"
      >
        <a-button type="danger">退出登录</a-button>
      </a-popconfirm>
    </a-card>
  </div>
</template>

<script>
let sha1 = require("js-sha1");
import buct from '../components/buct'
export default {
  name: "home",
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
      data: [],
      username: "",
      signature: "",
      sex: "",
      phone: "",
      age: 0,
    };
  },
  components: {
    buct,
  },
  methods: {
    getBackendData() {
      this.$store.state
        .adminUserDataGet()
        .then((response) => {
          console.log(response);
          this.username = response.data.data.userName
          this.signature = response.data.data.signature
          this.sex = response.data.data.sex
          this.phone = response.data.data.phone
          this.age = response.data.data.age
        });
    },
    logout() {
      this.$store.state
        .logoutDataGet()
        .then((response) => {
          console.log(response);
          if(response.data.code == "A00000") {
            localStorage.removeItem("token")
            this.$message.success("注销成功，正在返回登录页")
            this.$router.push("login")
          } else {
            alert("注销失败，请稍后再试！")
          }
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          for(let key in values) {
            if(values[key] == undefined) {
              values[key] = ""
            } 
          }
          let obj = {  
            userName: values['username'],
            signature: values['signature'],
            //sex: values['sex'],
            //age: values['age'],
          }
          if(values["password"] != "") {
              obj["password"] = values['password'];  // TODO: 改成MD5加密
          }
          //console.log(obj)
          this.$store.state
            .adminUserDataPatch(obj)
            .then((response) => {
              console.log(response);
              if(response.data.code == "A00000"){
                this.$message.success("更新个人信息成功！")
              } else {
                this.$message.error("服务端出错")
              }
            });
        } else {
          this.$message.error("提交失败！请稍后再试")
        }
      });
    },
  },
  beforeMount() {
    this.getBackendData();
  },
};
</script>

<style scoped>
.buct-container {
  position: absolute;
  width:400px;
  height:100px;
  top: 15%;
  left:80%;
  font-size: 140px;
  font-weight: bolder;
  text-transform: uppercase;
  z-index: 5;

}
.buct-container svg {
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0%;
  top:0%;
  z-index: 80;
}

.buct-container .text {
  fill: none;
  stroke-width: 5;
  stroke-dasharray: 0 240;
  stroke-dashoffset: 0;
}

.buct-container .text:nth-child(4n + 1) {
  stroke: rgb(179,157,250);
  animation: text1 4s 1s ease-in-out forwards;
}
.buct-container .text:nth-child(4n + 2) {
  stroke: rgb(198,209,79);
  animation: text2 4s 1s ease-in-out forwards;
}
.buct-container .text:nth-child(4n + 3) {
  stroke: rgb(94,167,254);
  animation: text3 4s 1s ease-in-out forwards;
}
.buct-container .text:nth-child(4n + 4) {
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