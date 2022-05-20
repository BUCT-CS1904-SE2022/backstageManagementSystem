<template>
  <div>
    <a-card>
      <h1>注册</h1>
      <a-form
        :form="form"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 10 }"
        @submit="handleSubmit"
      >
        <a-form-item label="用户名">
          <a-input v-decorator="['username', { rules: [{ required: true, message: '请输入用户名！' }] }]" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input type="password" v-decorator="['password', { rules: [{ required: true, message: '请输入密码！' }] }]" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入姓名！' }] }]" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select v-decorator="['sex', { initialValue: '' }]">
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number v-decorator="['age']" :min="1" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 10, offset: 7 }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
let sha1 = require("js-sha1");
export default {
  name: "register",
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  methods: {
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
            username: values['username'],
            password: sha1(values['password']),
            name: values['name'],
            sex: values['sex'],
            age: values['age'],
          };
          //console.log(obj)
          this.$store.state
            .registerMemberDataPost(obj)
            .then((response) => {
              console.log(response);
              if(response.data.code == 200){
                alert("注册成功！")
                this.$router.push("login")
              } else if(response.data.code == 403){
                this.$message.error("用户名已存在")
              } else {
                this.$message.error("服务器出错")
              }
            });
        } else {
          this.$message.error("提交失败！请检查是否有未填字段")
        }
      });
    },
  },
  beforeMount() {

  }
};
</script>

<style scoped>

</style>