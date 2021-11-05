<template>
  <v-toolbar flat color="white">
    <v-toolbar-title>
      {{ $route.meta.title }}
    </v-toolbar-title>

    <v-spacer />

    <slot />

    <v-dialog v-if="dialog" v-model="dialog.confirm" persistent max-width="350">
      <v-card :loading="busy">
        <v-card-title>
          {{ confirmTitle }}
        </v-card-title>

        <v-card-text>
          {{ confirmMessage }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="busy" color="primary" text @click="$emit('close')">No</v-btn>
          <v-btn :disabled="busy" color="primary" text @click="$emit('confirm')">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Object,
      default: null
    },
    busy: Boolean,
    confirmTitle: {
      type: String,
      default: 'Delete Item'
    },
    confirmMessage: {
      type: String,
      default: 'Are you sure you want to delete this item?'
    }
  }
}
</script>
