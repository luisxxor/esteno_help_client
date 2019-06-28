<template>
  <Home />
</template>

<script>
  import Home from './components/Home'
  import store from './store'
  import './App.css'
  import { ipcRenderer } from 'electron'

export default {
    name: 'esteno_help_client',
    store: store,
    components: { Home },
    mounted () {
      ipcRenderer.on('readyReply', (event, arg) => {
        this.$store.dispatch('initLoad', JSON.parse(arg))
      })

      ipcRenderer.on('responseAuth', (event, arg) => {
        let { success } = JSON.parse(arg)
        this.$store.dispatch('responseAuth', {
          auth_dialog: !success,
          auth_error: !success
        })
      })

      ipcRenderer.on('changeConfig', (event, arg) => {
        this.$store.dispatch('updateConfigData', {
          ...JSON.parse(arg),
          config_dialog: false
        })

        this.$store.dispatch('displaySnackbarMessage', 'Configuración actualizada')
      })

      ipcRenderer.on('callStatusChanged', (event, arg) => {
        this.$store.dispatch('updateCallStatus', arg)
      })
    }
  }
</script>

<style>
  /* CSS */
</style>
