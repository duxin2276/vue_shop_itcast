<template>
    <div>
        欢迎来到首页
        <el-button type="info" @click="loginOut">退出</el-button>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {
      loginOut() {
          // 清空token
          window.sessionStorage.clear()
          // 跳转到登录页面
          this.$router.push('/login')
      }
  }
}
</script>

<style lang="less" scoped>

</style>
