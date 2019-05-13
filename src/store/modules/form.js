import defaultForm from '@/default/form'

const state = {
  form: defaultForm
}

const mutations = {
  UPDATE_FORM: (state, Updatedform) => {
    state.form = Updatedform
  },
  removeFile: (state, fileList) => {
    state.form.fileList = fileList
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

