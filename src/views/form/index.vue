<template>
  <div class="app-container" @paste.passive="onPaste">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Bug Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="分享限制">
        <el-select v-model="form.permission" placeholder="限制">
          <el-option label="可查阅" value="watch" />
          <el-option label="可编辑" value="edit" />
        </el-select>
      </el-form-item>
      <el-form-item label="Image Name">
        <el-input v-model="form.docker" placeholder="可选" />
      </el-form-item>
      <el-form-item label="上传截图或档案">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          :http-request="uploadFile"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :file-list="form.fileList"
          multiple
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <!--
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      -->
      <el-form-item label="错误描述">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AWS from 'aws-sdk'
import { bucketName, region, appVersion, IdentityPoolId } from '@/default/aws'
export default {
  data() {
    return {
      s3: null
    }
  },
  computed: {
    form: {
      get: function() {
        return this.$store.state.form.form
      }
    }
  },
  watch: {
    form: {
      handler(val) {
        this.$store.dispatch('form/updateForm', val)
      }, deep: true }
  },
  mounted() {
    this.initAWS()
  },

  methods: {
    initAWS() {
      AWS.config.region = region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })

      this.s3 = new AWS.S3({
        apiVersion: appVersion,
        params: { Bucket: bucketName }
      })
    },
    filePath(filename) {
      return this.$store.getters.name + '/' + filename
    },
    handleUpload(filename, fileURL) {
      this.$store.commit('form/updateFile', { filename: filename, fileURL: 'https://s3-ap-southeast-1.amazonaws.com/helpmybugaws/' + fileURL })
    },
    // TODO: security issue
    upload2s3(body, filename) {
      var _this = this
      var uploadParams = {
        Body: body,
        Bucket: 'helpmybugaws',
        Key: this.filePath(filename)
      }
      this.s3.putObject(uploadParams, function(err, data) {
        if (err) {
          _this.$message(err)
          console.log(err, err.stack) // an error occurred
        } else {
          _this.handleUpload(filename, _this.filePath(filename))
          _this.$message('上传成功')
        }
      })
    },
    uploadFile(params) {
      this.upload2s3(params.body, params.file.name)
    },
    onSubmit() {
      this.$message('submit!')
    },
    onPaste(clipboard) {
      if (clipboard.clipboardData) {
        var items = clipboard.clipboardData.items
        if (items) {
          for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              this.upload2s3(items[i].getAsFile(), 'screenshot_' + new Date() + '.' + items[i].type.substring(6))
              // image
              // var blob = items[i].getAsFile()
              // var URLObj = window.URL || window.webkitURL
              // var source = URLObj.createObjectURL(blob)
              // var fd = new FormData()
              // fd.append('data', blob)
              // import request and post blob
            }
          }
        }
      }
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    // TODO:Remove from S3
    handleRemove(file, fileList) {
      this.$store.commit('form/updateFileList', fileList)
    },
    handlePreview(file) {
      window.open(file.url, '_blank')
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

