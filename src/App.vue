<template>
  <v-app>
    <router-view />
    <notification />
  </v-app>
</template>

<script>
import Notification from '@/components/Notification'

export default {
  components: {
    Notification
  }
}
</script>
