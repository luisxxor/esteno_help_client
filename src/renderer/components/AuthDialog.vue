
<template>
  <v-dialog
    v-model="dialog"
    max-width="400"
  >
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="password"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'visibility_off' : 'visibility'"
          @click:append="togglePasswordVisibility"
          :error-messages="errorMessage"
          :error="failed"
          @input="failed = false"
          @keyup.enter.native="sendAuth"
        >
        </v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="red"
          flat="flat"
          @click="dialog = false"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="blue"
          flat="flat"
          @click="sendAuth"
        >
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import store from '../store'
  import { mapFields } from 'vuex-map-fields'

  export default {
    name: 'AuthDialog',
    store: store,
    data () {
      return {
        password: '',
        showPassword: false
      }
    },
    computed: {
      ...mapFields({
        dialog: 'authDialog',
        failed: 'authFailed'
      }),
      errorMessage () {
        return this.failed ? 'Contraseña inválida' : ''
      }
    },
    methods: {
      togglePasswordVisibility () {
        this.showPassword = !this.showPassword
      },
      sendAuth () {
        this.$store.dispatch('sendAuth', this.password)
      }
    }
  }
</script>