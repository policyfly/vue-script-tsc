<template>
  <p v-text="message" />
</template>

<script lang="ts">
import Vue from 'vue'
import { message } from './messages'

export default Vue.extend({
  name: 'App',

  computed: {
    message (): number {
      return message
    }
  }
})
</script>
