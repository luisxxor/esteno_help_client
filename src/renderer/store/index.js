import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import { getField, updateField } from 'vuex-map-fields'
import { ipcRenderer } from 'electron'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    machineName: '',
    role: '',
    api: {
      host: '',
      port: '',
      extra: ''
    },
    calling: false,
    authDialog: false,
    authFailed: false,
    configDialog: false,
    configLoading: false,
    snackbarShow: false,
    snackbarMessage: '',
    callStatusLoading: false
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    OPEN_CONFIG_DIALOG (state, payload) {
      state.configDialog = payload
    },
    OPEN_AUTH_DIALOG (state, payload) {
      state.authDialog = payload
    },
    UPDATE_CONFIG_DATA (state, { machineName, role, api = null, configDialog = null }) {
      state.machineName = machineName
      state.role = role
      if (configDialog !== null) { state.configDialog = configDialog }
      state.configDialog = false
    },
    LOADING_CONFIG (state, payload) {
      state.configLoading = payload
    },
    DISPLAY_SNACKBAR_MESSAGE (state, payload) {
      state.snackbarMessage = payload
      state.snackbarShow = false
      state.snackbarShow = true
    },
    CALL_STATUS_LOADING (state, payload) {
      state.callStatusLoading = payload
    },
    UPDATE_CALL_STATUS (state, payload) {
      state.calling = payload
    },
    FAILED_AUTH (state, payload) {
      state.authFailed = payload
    }
  },
  actions: {
    openConfig ({ commit }, payload) {
      commit('OPEN_CONFIG_DIALOG', payload)
    },
    openAuth ({ dispatch, commit }, payload) {
      dispatch('openConfig', false)
      commit('OPEN_AUTH_DIALOG', payload)
    },
    initLoad ({ commit }, payload) {
      commit('UPDATE_CONFIG_DATA', payload)
    },
    saveConfig ({ commit }, payload) {
      commit('LOADING_CONFIG', true)
      ipcRenderer.send(
        'sendConfig',
        JSON.stringify(payload)
      )
    },
    updateConfigData ({ commit }, payload) {
      commit('UPDATE_CONFIG_DATA', payload)
      commit('LOADING_CONFIG', false)
    },
    displaySnackbarMessage ({ commit }, payload) {
      commit('DISPLAY_SNACKBAR_MESSAGE', payload)
    },
    updateCall ({ dispatch, commit, state }, payload) {
      commit('CALL_STATUS_LOADING', true)
      dispatch('displaySnackbarMessage', 'Conectando...')
      ipcRenderer.send(
        'toggleCall', JSON.stringify({
          role: state.role,
          machineName: state.machineName,
          calling: payload
        })
      )
    },
    updateCallStatus ({ dispatch, commit }, payload) {
      commit('CALL_STATUS_LOADING', false)
      commit('UPDATE_CALL_STATUS', payload)
      let message = payload ? 'Realizando llamada' : 'Llamada finalizada'

      dispatch('displaySnackbarMessage', message)
    },
    authFailed ({ dispatch, commit }) {
      dispatch('displaySnackbarMessage', 'Autenticación fallida')
      commit('FAILED_AUTH', true)
    },
    sendAuth ({ commit }, payload) {
      commit('FAILED_AUTH', false)
      ipcRenderer.send('sendAuth', JSON.stringify(payload))
    }
  },
  plugins: [
    createPersistedState,
    createSharedMutations
  ],
  strict: process.env.NODE_ENV !== 'production'
})
