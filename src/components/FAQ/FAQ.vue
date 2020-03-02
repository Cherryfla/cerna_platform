<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      action="http://121.41.85.40/api/feature/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
      :show-file-list="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
  export default {
    name: 'FAQ.vue',
    created () {

    },
    data() {
      return {
        fileList: [],
        autoUpload: true
      };
    },
    methods: {
      async submitUpload() {
        console.log(this.fileList)
        const res = await this.$refs.upload.submit();
        console.log(res)
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      handlePreview(file) {
        // console.log(file);
      },
      handleSuccess(response, file, fileList){
        console.log(response, file, fileList)
      },
      handleChange(file){
        if(file.status == 'ready'){
          //console.log(file)
          if(file.size >= 10*1024*1024){
            this.$message.error('file too large')
            this.$refs.upload.clearFiles()
          }
          this.$refs.upload.submit()
        }
      }
    }
  }
</script>

<style scoped>

</style>
