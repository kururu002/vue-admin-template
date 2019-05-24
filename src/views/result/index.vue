<template>
  <div>
    <el-button type="success" :loading="loading" icon="el-icon-check" circle @click.native.prevent="sonarLink" />Sonar Scan Result
  </div>
</template>
<script>
import { getResult } from '@/api/table.js'
export default {
  data() {
    return { loading: true }
  },
  mounted() {
    getResult(this.$route.params.reportId).then((response) => {
      if (response.data.scanCompleted) { this.loading = false }
    })
  },
  methods: {
    sonarLink() {
      window.open('https://sonarcloud.io/dashboard?id=kururu002_HelpMyBug', '_blank')
    }
  }
}
</script>
