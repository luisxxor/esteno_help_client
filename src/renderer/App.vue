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

      ipcRenderer.on('needAuth', (event, arg) => {
        this.$store.dispatch('openAuth', true)
      })

      ipcRenderer.on('authFailed', (event, arg) => {
        this.$store.dispatch('authFailed')
      })
    }
  }
</script>

<style>
  /* CSS */
</style>
