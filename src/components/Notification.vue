<template>
  <v-snackbar v-model="snackbar" :color="color" bottom right>
    {{ text }}

    <v-btn color="light" text @click="snackbar = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import eventBus from '@/eventBus'

export default {
  data: () => ({
    color: 'red',
    text: '',
    snackbar: false
  }),
  mounted () {
    eventBus.$on('notification.error', (err) => {
      const message = err.response.data.message || err.message

      if (message) {
        this.text = message
        this.color = 'red'
        this.snackbar = true
      }
    })

    eventBus.$on('notification.info', (res) => {
      if (res.data.message) {
        this.text = res.data.message
        this.color = 'info'
        this.snackbar = true
      }
    })
  }
}
</script>
