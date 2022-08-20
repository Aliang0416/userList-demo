<template>
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>用户信息</span>
    <el-button @click="$router.back()" style="float: right; padding: 3px 0" type="text">后退</el-button>
  </div>
  <p>姓名:{{userinfo.name}}</p>
  <p>年龄:{{userinfo.age}}</p>
  <p>职位:{{userinfo.position}}</p>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      userinfo: {}
    }
  },
  props: ['id'],
  methods: {
    async initGetUserInfo () {
      const { data: res } = await this.$http.get('/api/users/' + this.id)
      if (res.status !== 0) {
        this.$message.error('信息获取失败')
      } else {
        this.userinfo = res.data
        console.log(this.userinfo)
      }
    }
  },
  created () {
    this.initGetUserInfo()
  }
}
</script>

<style>

</style>
