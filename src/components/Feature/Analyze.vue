<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Feature</el-breadcrumb-item>
      <el-breadcrumb-item>Analyze</el-breadcrumb-item>
    </el-breadcrumb>

    <!--表单区域-->
    <el-form>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Analyze'
  }
</script>

<style lang="less" scoped>

</style>
