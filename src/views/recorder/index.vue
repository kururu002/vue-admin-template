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
  </div></template>
<script>
import RecordRTC from 'recordrtc'
export default {
  data() {
    return { startLoading: false, video: { src: null, srcObject: null }, recorder: null }
  },
  computed: {
    stopLoading() {
      return !this.startLoading
    }
  },
  methods: {
    log() {
      console.log(navigator.mediaDevices.getDisplayMedia)
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
      this.video.src = URL.createObjectURL(this.recorder.getBlob())
      this.recorder.screen.stop()
      this.recorder.destroy()
    },
    stopRecord() {
      this.startLoading = false
      this.recorder.stopRecording(this.stopRecordingCallback)
    }

  }
}
</script>
<style>
video {
        width: 80%;
        border-radius: 5px;
        border: 1px solid black;
    }
</style>
