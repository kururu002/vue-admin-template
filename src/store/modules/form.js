import defaultForm from '@/default/form'

const state = {
  form: defaultForm
}

const mutations = {
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

