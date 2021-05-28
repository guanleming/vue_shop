<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/user.jpg" class="avatar_box_img" />
      </div>

      <!-- 登录表单区 -->
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="formLogin">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-unlock"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetLoginfrom" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //这是登录表单的数据绑定对象 
      loginForm:{
        username:'admin',
        password:'123456',
      },
      //这是表单的验证
      loginFormRules: {
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
        },
      

    };
  },
  methods: {
    //点击 重置按钮 重置登录表单
    resetLoginfrom(){
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async(valid,)=>{
        // console.log(valid);
        if(!valid) return;
        const {data: res} = await this.$http.post('login',this.loginForm);
        // console.log(res);
        if(res.meta.status !== 200) return this.$message.error("登录失败！")
        this.$message.success("登录成功！")
        //1。将登录成功之后的token值 保存到客户端的sessionStorage中
        //  1.1 因为项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //  1.2 token只存在当前网站打开期间生效 所以将token保存在sessionStorage中
        console.log(res);
        window.sessionStorage.setItem('token',res.data.token);
        //2. 通过编程式导航跳转到后台主页， 路由地址是 /home
        this.$router.push("/home")
      })
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      overflow: hidden;
      padding: 8px;
      border: 1px solid #eee;
      position: absolute;
      left: 50%;
      background-color: #fff;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #ddd;
      .avatar_box_img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.formLogin {
  width: 90%;
  margin: 100px auto 0 auto;
}
</style>
