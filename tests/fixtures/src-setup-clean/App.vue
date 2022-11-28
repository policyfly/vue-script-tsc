<template>
  <div>
    <p v-text="message" />
    <Other />
  </div>
</template>

<script setup lang="ts">
import Other from './Other.vue'
import { message as importedMessage } from './messages'
import { computed } from 'vue'

const message = computed<string>(() => importedMessage)
</script>
