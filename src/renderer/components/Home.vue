<template>
  <v-app dark class="app">
    <div id="identifier">
      <span id="role">{{ role }}</span>
      <span id="machineName">{{ machineName }}</span>
    </div>
    <ButtonCall />

    <div class="baseMiniButton right" id="config_button">
      <v-btn
        dark
        fab
        small
        @click="openConfig"
      >
        <v-icon>settings</v-icon>
      </v-btn>
    </div>

    <AuthDialog/>
    <ConfigDialog/>

    <v-snackbar
      v-model="snackbarShow"
      :left="true"
      :top="true"
      :timeout="30000"
      id="snackbar"
    >
      {{ snackbarMessage }}
      <v-btn
        color="white"
        flat
        @click="snackbarShow = false"
      >
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>

  </v-app>
</template>

<script>
  import { mapFields } from 'vuex-map-fields'
  import AuthDialog from './AuthDialog'
  import ButtonCall from './ButtonCall'
  import ConfigDialog from './ConfigDialog'

  export default {
    name: 'home',
    components: {
      AuthDialog,
      ButtonCall,
      ConfigDialog
    },
    computed: {
      ...mapFields([
        'machineName',
        'role',
        'snackbarShow',
        'snackbarMessage'
      ])
    },
    methods: {
      openConfig () {
        this.$store.dispatch('openConfig', true)
      }
    },
    mounted () {
    }
  }
</script>

<style>
#snackbar {
  height: 30px!important;
}

.v-snack__content {
  height: 30px!important;
}
</style>
