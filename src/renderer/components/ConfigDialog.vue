<template>
  <v-dialog
    v-model="dialog"
    max-width="400"
  >
    <v-card>
      <v-card-title class="headline">Configuración</v-card-title>

      <v-card-text>
        <v-text-field disabled v-model="type" label="Tipo de Captioner"></v-text-field>
        <v-text-field v-model="machineName" label="Nombre del equipo"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="dialog = false"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="green darken-1"
          flat="flat"
          @click="dialog = false"
        >
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    name: 'ConfigDialog',
    data () {
      return {
        type: '',
        machineName: '',
        dialog: false
      }
    },
    methods: {
    }
  }
</script>