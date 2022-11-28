<template>
  <div>
    <p v-text="message" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const message = computed<string>(() => 'Hello From Other')
</script>
