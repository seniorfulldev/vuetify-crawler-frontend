<template>
  <v-breadcrumbs :items="items" v-if="items.length">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item :to="item.to">
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  computed: {
    items () {
      const items = (this.$route.meta.breadcrumbs || []).map(item => item)

      if (items.length) {
        items.unshift({
          text: 'Dashboard',
          to: '/'
        })
      }
      return items
    }
  }
}
</script>
