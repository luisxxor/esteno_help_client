<template>
  <div>
    <v-btn
      className="baseCallButton"
      id="isAlreadyCalling"
      :click="clearCall"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
    >
      <span>
        {{ call_text }}
      </span>
    </v-btn>

    <v-btn
      className="baseCallButton"
      id="readyToCall"
      @click="callSupport"
    >
      Llamar a soporte
    </v-btn>
  </div>
</template>


<script>
  export default {
    name: 'ButtonCall',
    data () {
      return {
        call_text: ''
      }
    },
    methods: {
      mouseover () {
        console.log('mouseover')
      },
      mouseleave () {
        console.log('mouseleave')
      },
      callSupport () {
        console.log('calling support')
      }
    }
  }
</script>
