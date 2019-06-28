<template>
  <v-dialog
    v-model="dialog"
    max-width="400"
    :persistent="loading"
  >
    <v-card>
      <v-card-text>
        <v-text-field :error="error.length > 0" disabled :value="role" label="Tipo de Captioner"></v-text-field>
        <v-text-field :error-messages="error" :disabled="calling" v-model="machineName" label="Nombre del equipo"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="red darken-1"
          flat="flat"
          @click="dialog = false"
          :loading="loading"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="blue darken-1"
          flat="flat"
          @click="saveData"
          :loading="loading"
          :disabled="error.length > 0 || calling"
        >
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  
  import { mapFields } from 'vuex-map-fields'
  import getRole from '../../helpers'

  export default {
    name: 'ConfigDialog',
    data () {
      return {
        machineName: ''
      }
    },
    computed: {
      ...mapFields({
        _machineName: 'machineName',
        _role: 'role',
        dialog: 'configDialog',
        loading: 'configLoading',
        calling: 'calling'
      }),
      role () {
        return getRole(this.machineName)
      },
      error () {
        return this.role === '' ? 'El nombre de equipo es inválido' : ''
      }
    },
    watch: {
      dialog (val) {
        return val ? this.loadData() : this.clearData()
      }
    },
    methods: {
      loadData () {
        this.machineName = this._machineName
      },
      clearData () {
        this.machineName = ''
      },
      saveData () {
        this.$store.dispatch('saveConfig', {
          machineName: this.machineName,
          role: getRole(this.machineName)
        })
      }
    }
  }
</script>