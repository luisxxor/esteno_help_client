<template>
      <v-btn
        v-if="calling"
        class="baseCallButton"
        id="isAlreadyCalling"
        @click="() => updateCall(false)"
        @mouseover="mouseover"
        @mouseleave="mouseleave"
        :loading="callStatusLoading"
      >
        <span>
          {{ call_text }}
        </span>
      </v-btn>

      <v-btn
        v-else
        id="readyToCall"
        class="baseCallButton"
        @click="() => updateCall(true)"
        color="green"
        :loading="callStatusLoading"
      >
        <span>

          Llamar a soporte
        </span>
      </v-btn>
</template>


<script>
  import { mapFields } from 'vuex-map-fields'
  import _ from 'lodash'
  
  export default {
    name: 'ButtonCall',
    data () {
      return {
        call_text: 'Llamando...'
      }
    },
    computed: {
      ...mapFields({
        'calling': 'calling',
        'callStatusLoading': 'callStatusLoading'
      })
    },
    methods: {
      mouseover () {
        this.call_text = 'Detener llamada'
      },
      mouseleave () {
        this.call_text = 'Llamando'
      },
      updateCall: _.throttle(function (call) {
        if (!this.callStatusLoading) {
          console.log(this.callStatusLoading)
          this.$store.dispatch('updateCall', call)
        }
      }, 1000)
    }
  }
</script>
