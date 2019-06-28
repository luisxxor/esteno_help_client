<template>
  <v-app dark class="app">
    <div id="identifier">
      <span id="role">{{ role }}</span>
      <span id="machineName">{{ machineName }}</span>
    </div>
    <ButtonCall />
     
    <div class="baseMiniButton left" id="edit_button">
      <v-btn
        dark
        fab
        small
        @click="toggleEdit"
      >
        <v-icon>{{ editingButton ? 'done' : 'edit' }}</v-icon>
      </v-btn>
    </div>
    <div class="baseMiniButton center">
      <v-btn
        v-show="editingButton"
        small
        dark
        color="blue"
        @click="resetButtonSizePosition"
      >
        Resetear boton
      </v-btn>
    </div>
    <div class="baseMiniButton right" id="config_button">
      <v-btn
        v-show="!editingButton"
        dark
        fab
        small
        @click="openConfig"
        :disable="editingButton"
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
      :timeout="3000"
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
        'snackbarMessage',
        'editingButton'
      ])
    },
    methods: {
      openConfig () {
        if (!this.editingButton) {
          this.$store.dispatch('openConfig', true)
        }
      },
      toggleEdit () {
        this.editingButton = !this.editingButton
      },
      resetButtonSizePosition () {
        this.$store.dispatch('resetButtonSizePosition')
      }
    },
    mounted () {
    }
  }
</script>

<style>
</style>
