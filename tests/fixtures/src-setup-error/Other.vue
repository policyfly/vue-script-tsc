<template>
  <div>
    <p v-text="message" />
  </div>
</template>

<script lang="ts">
export default {
  computed: {
    message: (): number => 'Hello From Other'
  }
}
</script>
