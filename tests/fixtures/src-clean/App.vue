<template>
  <div>
    <p v-text="message" />
    <Other />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Other from './Other.vue'
import { message } from './messages'

export default Vue.extend({
  name: 'App',

  components: {
    Other
  },

  computed: {
    message (): string {
      return message
    }
  }
})
</script>
