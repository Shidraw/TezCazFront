<template>
  <b-container class="py-3" fluid>
    <NavBar />
    <Nuxt />
  </b-container>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  export default {
    components: {
      NavBar
    }
  }
</script>