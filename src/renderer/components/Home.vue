<template>
  <v-app>
    <div id="identifier">
      <span id="role">{{role}}</span>
      <span id="machine_name">{{machine_name}}</span>
    </div>
    <ButtonCall />
    <div id="config_button">
      <v-icon @click="openConfig">settings</v-icon>
    </div>

    <AuthDialog/>
    <ConfigDialog/>

    <v-snackbar
      v-model="snackbar_show"
      :left="true"
      :top="true"
      :timeout="3000"
    >
      {{ snackbar_message }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-snackbar>

  </v-app>
</template>

<script>
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
    data () {
      return {
        snackbar_show: false,
        snackbar_message: ''
      }
    },
    methods: {
    }
  }
</script>

<style>
</style>
