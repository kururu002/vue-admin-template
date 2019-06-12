<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-button type="primary" @click.native.prevent="goForm()">提交个Bug</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    goForm() {
      this.$router.push('form/index')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
