<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入分析类型" v-model="queryInfo.search"
                  clearable @clear="getAnalyzeList">
          <el-button slot="append" icon="el-icon-search" @click="getAnalyzeList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addAnalyzeVisible = true">添加分析类型</el-button>
      </el-col>
    </el-row>
    <el-table :data="analyzeList" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row :class="['bdbottom', i === 0 ? 'bdtop' : '', 'vcenter']"
                  v-for="(option, i) in scope.row.options" :key="i">
            <el-col :span="10">
              选项名:
              <el-tag>{{option.optionName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="14">
              选项值:
              <el-tag type="success" v-for="(value, i1) in option.optionValue" :key="i1">
                {{value}}
              </el-tag>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="分析类型" prop="fields.name"></el-table-column>
      <el-table-column label="描述" prop="fields.description"></el-table-column>
      <el-table-column width="150px" label="结果格式">
        <template slot-scope="scope">
          <el-tag size="small">
            {{scope.row.fields.resultFormat?scope.row.fields.resultFormat:'other'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
                     @click="showEditDialog(scope.$index)"></el-button>
          <el-button type="success" icon="el-icon-upload" size="mini"
                     @click="showUploadDialog(scope.row.pk)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"
                     @click="deleteAnalyze(scope.row.pk)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="analyzeTotal">
    </el-pagination>
    <!--修改分析功能的对话框-->
    <el-dialog title="编辑分析功能" :visible.sync="editAnalyzeVisible" width="70%"
               @close="editDialogClose">
      <el-form :model="editAnalyzeForm" :rules="editAnalyzeRules" ref="editAnalyzeFormRef" label-width="100px">
        <!--分析模块基本信息-->
        <el-form-item label="分析类型" prop="name">
          <el-input v-model="editAnalyzeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input rows="3" type="textarea" v-model="editAnalyzeForm.description"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="结果格式" prop="resultFormat">
              <el-select v-model="editAnalyzeForm.resultFormat">
                <el-option v-for="(item, i) in resultChoices" :key="i" :value="item[0]" :label="item[1]"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--是否允许自定义数据或代码-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="自定义数据" prop="customData">
              <el-switch v-model="editAnalyzeForm.customData"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义代码" prop="customCode">
              <el-switch disabled v-model="editAnalyzeForm.customCode"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <!--分析模块选项区域-->
        <el-row v-for="(option, i) in editAnalyzeForm.options" :key="i">
          <!--选项名-->
          <el-col :span="6">
            <el-form-item label="选项名" :prop="'options.'+i+'.optionName'"
                          :rules="{required: true, message: '域名不能为空', trigger: 'blur'}">
              <el-input v-model="option.optionName"></el-input>
            </el-form-item>
          </el-col>
          <!--选项值-->
          <el-col :span="16">
            <el-form-item label="选项值">
              <el-tag closable v-for="(value, i1) in option.optionValue" :key="i1"
                      @close="handleCloseTag(i, i1)">
                {{value}}
              </el-tag>
              <el-input
                v-focus
                class="input-new-tag"
                v-if="option.inputVisible"
                v-model="option.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(option)"
                @blur="handleInputConfirm(option)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showTagInput(option)">
                + Add
              </el-button>
            </el-form-item>
          </el-col>
          <!--删除选项-->
          <el-col :span="2">
            <el-button type="danger" @click.prevent="removeOption(option)">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addOption">新增选项</el-button>
        <el-button type="info" @click="editAnalyzeVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAnalyzeInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加分析类型的对话框-->
    <el-dialog title="添加分析类型" :visible.sync="addAnalyzeVisible" width="50%"
               @close="() => {this.$refs.addAnalyzeFormRef.resetFields()}">
      <el-form :model="addAnalyzeForm" ref="addAnalyzeFormRef" :rules="editAnalyzeRules"
               label-position="top">
        <el-form-item label="分析类型" prop="name">
          <el-input v-model="addAnalyzeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="addAnalyzeForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAnalyzeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAnalyze">确 定</el-button>
      </span>
    </el-dialog>
    <!--上传文件的对话框-->
    <el-dialog title="上传" :visible.sync="uploadDialogVisible" width="60%"
               @close="()=>{this.$refs.uploadFormRef.resetFields()}">
      <el-form :model="uploadForm" ref="uploadFormRef" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分析id">
              {{uploadForm.pk}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :rules="{required: true,message: 'domain is required'}"
                          prop="uploadType" label="上传类型">
              <el-select v-model="uploadForm.uploadType">
                <el-option label="data" value="data"></el-option>
                <el-option label="code" value="code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
      <!--上传模块-->
      <el-upload ref="formUpload" drag
                 :action="uploadAction"
                 :headers="myHead"
                 :multiple="false"
                 :on-success="handleUploadResponse"
                 :on-error="handleUploadResponse"
                 :on-change="handleChange"
                 :before-remove="beforeRemove"
                 :on-remove="handleRemove"
                 :auto-upload="false"
                 :show-file-list="true">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">文件大小不超过20M;</div>
        <div class="el-upload__tip" slot="tip">Code命名: 直接以对应 分析的Id命名;</div>
<!--        <div class="el-upload__tip" slot="tip">Data命名: 由选项值组成，并用'_'分隔;</div>-->
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'AdminAnalyze',
    directives: {
      // 注册一个局部的自定义指令 v-focus
      focus: {
        // 指令的定义
        inserted: function (el) {
          // 聚焦元素
          el.querySelector('input').focus()
        }
      }
    },
    created () {
      this.getAnalyzeList()
    },
    data (){
      return{
        queryInfo:{
          search: '',
          pageNum: 1,
          pageSize: 5
        },
        analyzeList: [],
        analyzeTotal: 0,
        resultChoices: [],
        editAnalyzeVisible: false,
        editAnalyzeForm: {},
        editAnalyzeRules: {
          name: [
            {
              required: true,
              message: 'name is required',
              trigger: 'blur'
            },
            {
              max: 50,
              message: 'length between 0 and 50',
              trigger: 'blur'
            }
          ],
          description: [
            {
              required: true,
              message: 'question is required',
              trigger: 'blur'
            },
            {
              max: 200,
              message: 'length between 0 and 100',
              trigger: 'blur'
            }
          ],
          resultFormat: [
            {
              min: 0,
              max: 5,
              message: 'invalid result format',
              trigger: 'blur'
            }
          ]
        },
        addAnalyzeVisible: false,
        addAnalyzeForm: {
          name: '',
          description: ''
        },
        uploadDialogVisible: false,
        uploadForm: {
          pk: 0,
          uploadType: ''
        },

      }
    },
    methods: {
      async getAnalyzeList() {
        const res = await this.$http.get('admin/analyzemanage', {
            params: this.queryInfo
          }
        ).catch(error => {
          if (error.response) {
            this.$message.error(error.response.data)
          }
          else {
            this.$message.error(error.message)
          }
        })
        if(res.status !== 200)
          this.$message.error('Get Analyze List failed')
        if(res.data.msg != 'success')
          this.$message.error(this.data.msg)
        res.data.list.forEach(item => {
          if(!item.fields.options){
            item = []
            return
          }
          let options = item.fields.options.split(';')
          item.options = []
          for(let i=0;i<options.length;i++){
            let temp = options[i].split(':')
            let tempObject ={
              optionName: temp[0],
              optionValue: temp[1].split(',')
            }
            item.options.push(tempObject)
          }
        })
        this.analyzeList = res.data.list
        this.analyzeTotal = res.data.total
        this.resultChoices = res.data.resultChoices
        console.log(res.data)
      },
      handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize
        this.getAnalyzeList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pageNum = newPage
        this.getAnalyzeList()
      },
      showEditDialog(index){
        let analyze = JSON.parse(JSON.stringify(this.analyzeList[index]));
        if(analyze.options) {
          analyze.options.forEach(option => {
            option.inputVisible = false
            option.inputValue = ''
          })
        }
        else{
          analyze.options = []
        }
        let tempForm = analyze.fields
        tempForm.pk = analyze.pk
        tempForm.options = analyze.options
        this.editAnalyzeForm = tempForm
        this.editAnalyzeVisible = true
      },
      editDialogClose(){
        this.editAnalyzeForm = {}
        this.$refs.editAnalyzeFormRef.resetFields()
      },
      removeOption(option){
        let index = this.editAnalyzeForm.options.indexOf(option)
        if (index !== -1) {
          this.editAnalyzeForm.options.splice(index, 1)
        }
      },
      addOption(){
        this.editAnalyzeForm.options.push({
          optionName: '',
          optionValue: [],
          inputVisible: false,
          inputValue:''
        })
      },
      handleCloseTag(optionIndex, nameIndex){
        this.editAnalyzeForm.options[optionIndex].optionValue.splice(nameIndex, 1)
      },
      handleInputConfirm(option){
        let inputValue = option.inputValue
        if (inputValue) {
          option.optionValue.push(inputValue)
        }
        option.inputVisible = false
        option.inputValue = ''
      },
      showTagInput(option){
        option.inputVisible = true
        // this.$nextTick(() => {
        //   console.log(this.$refs.saveTagInput, this.$refs)
        //   this.$refs.saveTagInput.$el.querySelector('input').focus();
        // })
      },
      addAnalyze(){
        this.$refs.addAnalyzeFormRef.validate(async valid =>{
          if(!valid)
            return
          const res = await this.$http.post('admin/analyzemanage', this.addAnalyzeForm).catch(error => {
            if (error.response) {
              this.$message.error(error.response.data);
            } else {
              this.$message.error(error.message);
            }
          })
          if(res.status !== 200)
            return this.$message.error('add analyze failed')
          if(res.data.msg != 'success')
            return this.$message.error(res.data.msg)
          this.getAnalyzeList()
          this.addAnalyzeVisible = false
          return this.$message.success('success')
        })
      },
      editAnalyzeInfo(){
        this.$refs.editAnalyzeFormRef.validate(async valid => {
          if(!valid)
            return
          let optionStr = []
          for(let i=0;i<this.editAnalyzeForm.options.length;i++){
            let optionValue = this.editAnalyzeForm.options[i].optionValue
            let optionName = this.editAnalyzeForm.options[i].optionName
            let optionValueStr = optionValue.join(',')
            optionStr.push(`${optionName}:${optionValueStr}`)
          }
          if(optionStr)
            optionStr = optionStr.join(';')
          else
            optionStr = ''
          if(optionStr.length>200)
            return this.$message.error('options length limit exceed')
          this.editAnalyzeForm.optionStr = optionStr
          const res = await this.$http.put('admin/analyzemanage',this.editAnalyzeForm).catch(error => {
            if (error.response) {
              this.$message.error(error.response.data);
            }
            else {
              this.$message.error(error.message);
            }
          })
          if(res.status !== 200)
            return this.$message.error('Edit analyze failed')
          if(res.data.msg != 'success')
            return this.$message.error(res.data.msg)
          this.getAnalyzeList()
          this.editAnalyzeVisible = false
          return this.$message.success('success')
        })
      },
      showUploadDialog(pk){
        this.uploadForm.pk = pk
        this.uploadDialogVisible = true
      },
      async deleteAnalyze(pk){
        const confirmResult = await this.$confirm('此操作将永久删除该对象, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if(confirmResult !== 'confirm'){
          this.$message.info('取消删除')
        }
        else{
          const res = await this.$http.delete('admin/analyzemanage',{
            params: {
              id: pk
            }
          })
          if(res.status !== 200)
            return this.$message.error('Delete analyze failed')
          if(res.data.msg != 'success')
            return this.$message.error(res.data.msg)
          this.getAnalyzeList()
          return this.$message.success('delete success')
        }
      },
      handleUploadResponse(response, file, fileList){
        this.summaryLoading = false
        if(file.status !== 'success')
          return this.$message.error(""+response)
        if(response.msg !== 'success')
          return this.$message.error(response.msg)
        return this.$message.success("Upload file success")
      },
      handleChange(file, fileList){
        if(file.status == 'ready'){
          //console.log(file)
          if(file.size >= 20*1024*1024){
            this.$message.error('file too large')
            this.$refs.formUpload.clearFiles()
          }
          this.$refs.uploadFormRef.validate(valid => {
            if(!valid) {
              let index = fileList.indexOf(file)
              if(index !== -1)
                fileList.splice(index, 1)
              return
            }
            this.$refs.formUpload.submit()
          })
        }
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      async handleRemove(file,fileList){
        const res = await this.$http.delete(this.uploadActionUrl, {
          params: {
            'fileName': file.name
          }
        })
        if(res.status !== 200){
          return this.$message.error('Delete file failed')
        }
        if (res.data.msg !== 'success')
          return this.$message.error(res.data.msg)
      },
    },
    computed: {
      myHead(){
        const token =  window.sessionStorage.getItem('token')
        return {
          'authorization': token
        }
      },
      uploadActionUrl(){
        return 'admin/analyzeupload/'+this.uploadForm.uploadType+'/'+this.uploadForm.pk
      },
      uploadAction(){
        return this.$http.defaults.baseURL+this.uploadActionUrl
      },
      uploadType(){
        return this.uploadForm.uploadType
      }
    },
    watch: {
      uploadType(value, oldValue){
        this.$refs.formUpload.clearFiles()
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
