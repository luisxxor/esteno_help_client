<template>

  <div class="buttonContainer">
    <vue-draggable-resizable
      class="baseCallButton"
      :parent="true"
      :active="editingButton"
      :prevent-deactivation="true"
      :minWidth="157"
      :minHeight="22"
      :draggable="editingButton"
      :resizable="editingButton"
      :w="w"
      :h="h"
      :x="x"
      :y="y"
      @resizing="onResize"
      @dragging="onDrag"
    >
      <v-btn
        :class="editingButton ? 'disable' : ''"
        v-if="calling"
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
        :class="editingButton ? 'disable' : ''"
        v-else
        id="readyToCall"
        @click="() => updateCall(true)"
        color="green"
        :loading="callStatusLoading"
      >
        <span>

          Llamar a soporte
        </span>
      </v-btn>
    </vue-draggable-resizable>
  </div>
</template>


<script>
  import { mapFields } from 'vuex-map-fields'
  import _ from 'lodash'
  import VueDraggableResizable from 'vue-draggable-resizable'
  import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
  
  export default {
    name: 'ButtonCall',
    components: {
      'vue-draggable-resizable': VueDraggableResizable
    },
    data () {
      return {
        call_text: 'Llamando...'
      }
    },
    computed: {
      ...mapFields({
        'calling': 'calling',
        'callStatusLoading': 'callStatusLoading',
        'editingButton': 'editingButton',
        'x': 'buttonData.x',
        'y': 'buttonData.y',
        'h': 'buttonData.h',
        'w': 'buttonData.w'
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
        if (!this.callStatusLoading && !this.editingButton) {
          console.log(this.callStatusLoading)
          this.$store.dispatch('updateCall', call)
        }
      }, 1000),
      onResize (x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
      },
      onDrag (x, y) {
        this.x = x
        this.y = y
      }
    }
  }
</script>
