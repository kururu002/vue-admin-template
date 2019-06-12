<template>
  <div>
    <el-row>
      <el-button type="success" :loading="sonar_loading" icon="el-icon-check" circle @click.native.prevent="sonarLink" />Sonar Scan Result
    </el-row>
    <el-row>
      <el-button type="success" :loading="image_loading" icon="el-icon-check" circle @click="open" />容器部署（上传的代码文件将存放至容器 /home/code）
    </el-row>
    <el-row>
      <img :src="qrcode" fit="fill"></el-row>
  </div>
</template>
<script>
import { getResult } from '@/api/table.js'
import QRCode from 'qrcode'
export default {
  data() {
    return { qrcode: null, sonar_loading: true, image_loading: true }
  },
  mounted() {
    console.log(window.location.href)
    QRCode.toDataURL(window.location.href)
      .then(url => {
        this.qrcode = url
      })
      .catch(err => {
        console.error(err)
      })
    getResult(this.$route.params.reportId).then((response) => {
      if (response.data.scanCompleted) { this.sonar_loading = false }
      if (response.data.imageBuilt) { this.image_loading = false }
    })
  },
  methods: {
    sonarLink() {
      window.open('https://sonarcloud.io/dashboard?id=kururu002_HelpMyBug', '_blank')
    },
    open() {
      this.$alert('ssh -p 222 -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" root@ec2-54-251-170-8.ap-southeast-1.compute.amazonaws.com', '容器创建成功', {
        confirmButtonText: '确定'
      })
    }
  }
}
</script>
