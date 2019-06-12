import defaultForm from '@/default/form'
import AWS from 'aws-sdk'
import { bucketName, region, appVersion, IdentityPoolId } from '@/default/aws'
import { submit } from '@/api/form'
const state = {
  form: defaultForm,
  s3: null
}

const mutations = {
  assignAWS: (state, awsClass) => {
    state.s3 = awsClass
  },
  UPDATE_FORM: (state, updatedForm) => {
    state.form = updatedForm
  },
  updateFileList: (state, fileList) => {
    state.form.fileList = fileList
  },
  updateFile: (state, payload) => {
    state.form.fileList.push({ name: payload.filename, url: payload.fileURL })
  }

}

const actions = {
  updateForm({ commit }, data) {
    commit('UPDATE_FORM', data)
  },
  initAWS({ commit }) {
    AWS.config.region = region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId
    })
    commit('assignAWS', new AWS.S3({
      apiVersion: appVersion,
      params: { Bucket: bucketName }}))
  },
  handleUpload({ commit }, fileInfo) {
    commit('updateFile', { filename: fileInfo.filename, fileURL: 'https://s3-ap-southeast-1.amazonaws.com/helpmybugaws/' + fileInfo.fileURL })
  },
  // TODO: security issue
  upload2s3({ state, commit, dispatch, rootGetters }, { body, filename }) {
    var uploadParams = {
      Body: body,
      Bucket: 'helpmybugaws',
      Key: rootGetters.name.replace(' ', '_').toLowerCase() + '/' + filename
    }
    return new Promise((resolve, reject) =>
      state.s3.putObject(uploadParams, function(err, data) {
        if (err) {
          console.log(err, err.stack) // an error occurred
          reject('ERROR OCCURED:' + err)
        } else {
          dispatch('handleUpload', { filename: filename, fileURL: uploadParams.Key })
          resolve('上传成功')
        }
      })
    )
  },
  submitForm({ state, rootGetters }) {
    state.form.author = rootGetters.name
    return submit(state.form)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

