<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- 黑马logo -->
        <img src="../assets/heima.png" alt="" />
        <!-- 顶部标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button></el-header
    >
    <!-- 主体区域 -->
    <el-container>
      <!-- 左侧菜单栏区域 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="togglebutton" @click="changeCollapse">|||</div>
        <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse = "isCollapse"
      :collapse-transition = "false">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menuLsit"
      :key="item.id">
        <template slot="title">
          <!-- 字体图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 菜单项名称 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
          <el-menu-item :index="subItem.id+''" v-for="subItem in item.children"
          :key="subItem.id">
            <template slot="title">
              <!-- 字体图标 -->
          <i class="el-icon-menu"></i>
          <!-- 菜单项名称 -->
          <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 数据
      menuLsit: [],
      // 左侧导航栏字体图标
      iconsObj: {
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      // 改变侧边栏状态的值
      isCollapse: false
    }
  },
  mounted () {
    this.getMenuList()
  },
  methods: {
      loginOut() {
          // 清空token
          window.sessionStorage.clear()
          // 跳转到登录页面
          this.$router.push('/login')
      },
      // 发送请求  获取数据
     async getMenuList() {
        const { data: res } = await this.$http.get('menus')
        // console.log(res);
        this.menuLsit = res.data
        // console.log(this.menuLsit);
      },
      // 改变侧边栏的状态
      changeCollapse() {
        this.isCollapse = !this.isCollapse
      }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
  
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.togglebutton {
  background-color: gray;
  width: 100%;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>
