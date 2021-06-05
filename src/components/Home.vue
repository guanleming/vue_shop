<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img src="../assets/heima.png" alt=""> -->
        <span>XX电商管理系统</span>
      </div>
      <el-button tpe="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 主题侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <!-- active-text-color控制二级菜单选中的高亮颜色 -->
        <el-menu
          unique-opened
          background-color="#292F37"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist " :key="item.id"> 
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- i是图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- span是文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item 
            :index="'/' + subItem.path + ''" 
            v-for="subItem in item.children" 
            :key="subItem.id" 
            @click="saveNavState('/' + subItem.path + '')">
              <!-- icon图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </el-menu-item>
            
          </el-submenu>
          
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist:[],
      iconsObj:{
        '125':'el-icon-s-custom',
        '103':'el-icon-coin',
        '101':'el-icon-s-shop',
        '102':'el-icon-s-order',
        '145':'el-icon-s-marketing',
      },
      //是否折叠
      isCollapse : false,
      //被激活的地址链接
      activePath:''
    };
  },
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  props: {},
  methods: {
    exit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
      this.$message.warning("已退出");
    },
    //获取所有的菜单
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status != 200)return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res);
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    //保存连接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #32383c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 25px;
  span {
    font-size: 20px;
    color: #fff;
  }
}
.el-aside {
  background-color: #323744;
}
.el-main {
  background-color: #e7ecef;
}
.el-menu{
  border-right: none;
}
.toggle-button{
  height: 24px;
  background-color: #4A5064;
  text-align: center;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: .2em;
  cursor: pointer;
}

</style>
