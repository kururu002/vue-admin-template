<template>
  <div class="appcontainer">
    <el-row>
      <el-button
        type="primary"
        :loading="startLoading"
        :disabled="startLoading"
        @click.native.prevent="startRecord()"
      >Start Record</el-button>
      <el-button
        type="primary"
        :disabled="stopLoading"
        @click.native.prevent="stopRecord()"
      >Stop Record</el-button>
    </el-row>
    <hr>
    <video controls autoplay playsinline :srcObject.prop="video.srcObject" :src="video.src" />
    <hr>
    <el-button type="primary" plain :disabled="missVideo" @click.native.prevent="uploadVideo()">上传至错误报告</el-button>
  </div></template>
<script>
import RecordRTC from 'recordrtc'
export default {
  data() {
    return { startLoading: false, video: { src: null, srcObject: null }, recorder: null, tempBlob: null }
  },
  computed: {
    missVideo() {
      return this.tempBlob == null
    },
    stopLoading() {
      return !this.startLoading
    }
  },
  mounted() {
    if (!this.$store.getters.s3) {
      this.$store.dispatch('form/initAWS')
    }
  },
  methods: {
    log() {
      console.log(this.tempBlob)
    },
    invokeGetDisplayMedia(success, error) {
      var displaymediastreamconstraints = {
        video: {
          displaySurface: 'monitor', // monitor, window, application, browser
          logicalSurface: true,
          cursor: 'always' // never, always, motion
        }
      }
      // above constraints are NOT supported YET
      // that's why overridnig them
      displaymediastreamconstraints = {
        video: true
      }
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      } else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error)
      }
    },
    addStreamStopListener(stream, callback) {
      stream.addEventListener('ended', function() {
        callback()
        callback = function() {}
      }, false)
      stream.addEventListener('inactive', function() {
        callback()
        callback = function() {}
      }, false)
      stream.getTracks().forEach(function(track) {
        track.addEventListener('ended', function() {
          callback()
          callback = function() {}
        }, false)
        track.addEventListener('inactive', function() {
          callback()
          callback = function() {}
        }, false)
      })
    },
    captureScreen(callback) {
      var _this = this
      this.invokeGetDisplayMedia(function(screen) {
        _this.addStreamStopListener(screen, function() {
          _this.stopRecord()
        })
        callback(screen)
      }, function(error) {
        console.error(error)
        alert('Unable to capture your screen. Please check console logs.\n' + error)
      })
    },
    startRecord() {
      this.startLoading = true
      var _this = this
      this.captureScreen(function(screen) {
        _this.video.srcObject = screen
        _this.recorder = RecordRTC(screen, {
          type: 'video'
        })
        _this.recorder.startRecording()
        // release screen on stopRecording
        _this.recorder.screen = screen
        // document.getElementById('btn-stop-recording').disabled = false
      })
    },
    stopRecordingCallback() {
      this.video.srcObject = this.video.src = null
      this.tempBlob = this.recorder.getBlob()
      this.video.src = URL.createObjectURL(this.tempBlob)
      this.recorder.screen.stop()
      this.recorder.destroy()
    },
    stopRecord() {
      this.startLoading = false
      this.recorder.stopRecording(this.stopRecordingCallback)
    },
    uploadVideo() {
      if (this.missVideo) {
        this.alert("Doesn't contain blob file")
      } else {
        var _this = this
        this.$store.dispatch('form/upload2s3', { body: this.tempBlob, filename: 'screenCapture_' + new Date() + '.webm' }).then(
        // Log the fulfillment value
          (val) => {
            _this.$message(val)
          }).catch(
        // Log the rejection reason
          (reason) => {
            console.log('Error:' + reason)
          })
      }
    }
  }
}
</script>
<style>
video {
        width: 50%;
        border-radius: 5px;
        border: 1px solid black;
    }
</style>
