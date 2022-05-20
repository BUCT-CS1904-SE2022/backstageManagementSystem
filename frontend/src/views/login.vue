<template>
  <div>
    <a-layout class="layout">
      <a-form
        :form="form"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 10 }"
        @submit="handleSubmit"
        class="login-form"
      >
        <div style="margin-left: 0 auto;font-size: 20px;margin-bottom:20px;">海外博物馆后台管理子系统</div>
        <a-form-item label="userName">
          <a-input
            v-decorator="[
              'userName',
              {initialValue: 'test'},
              { rules: [{ required: true, message: '请输入管理员用户名！' }]},
            ]"
          />
        </a-form-item>
        <a-form-item label="password">
          <a-input
            v-decorator="[
              'password',
              {initialValue: 'test'},
              { rules: [{ required: true, message: '请输入管理员密码！' }]},
              
            ]"
            type="password"
          />
        </a-form-item>
        <a-form-item label="verification">
          <div class="form-group" style="display: flex">
            <div>
              <a-input
                id="code"
                class="code"
                v-decorator="[
                  'verification',
                  { rules: [{ required: true, message: '请输入验证码！' }] },
                ]"
              />
            </div>
            <div class="login-code" @click="refreshCode">
              <!--验证码组件-->
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 10, offset: 7 }">
          <a-button type="primary" html-type="submit">登录</a-button>
          <!--<a-button type="dashed" @click="toRegister()">注册</a-button>-->
        </a-form-item>
      </a-form>
    </a-layout>
  </div>
</template>

<script>
import SIdentify from "../components/sidentify";
let sha1 = require("js-sha1");

export default {
  name: "login",
  components: { SIdentify },
  data() {
    return {
      data: [],
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      identifyCodes: "0123456789",
      identifyCode: "",
      pass: 0,
    };
  },
  methods: {
    toRegister() {
      this.$router.push('register')
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.verification == this.identifyCode) {
            let postObject = {
              userName:values.userName,
              password:values.password,          // TODO: 改成md5加密
            }
            this.$store.state.loginDataPost(postObject).then((response) => {
              console.log(response)
              if (response.data.code == "A00000") {
                //localStorage.setItem("tokenTimeout",new Date().getTime() + response.data.data.tokenTimeout * 1000)  // 修改登录状态
                localStorage.setItem(response.data.data.tokenName, response.data.data.tokenValue)
                alert("登录成功！点击确定跳转到首页");
                this.$router.push("home");
              } else {
                alert("登录失败！请检查用户名、密码是否正确或是否有管理员权限");
                this.refreshCode();
              }
            });
          }
          else{
            alert("验证码输入错误！");
            this.refreshCode();
          }
        } else {
          this.refreshCode();
        }
      });
    },
  },
  created() {
    this.refreshCode();
  },
  beforeMount() {

  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
};
</script>

<style scoped>
.layout {

  background-size: 100% 100%;
  height: 100vh;
}
.login-form {
  background: #fff;
  border: 1px solid #fff;
  border-radius: 5px;
  width: 600px;
  position: relative;
  margin: 0 auto;
  padding: 80px 0 80px 80px;
  top: 50%;
  transform: translateY(-50%);
}
/*验证码样式*/
.code {
  width: 124px;
  height: 31px;
  border: 1px solid rgba(186, 186, 186, 1);
}
.login-code {
  cursor: pointer;
}
</style>