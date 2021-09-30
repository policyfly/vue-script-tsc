<template>
  <p v-text="message" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Other',

  computed: {
    message (): string {
      return 'Hello from Other'
    }
  }
})
</script>
