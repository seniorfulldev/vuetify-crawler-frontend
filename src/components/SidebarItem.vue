<template>
  <v-list-item v-if="!item.children" :to="{ name: item.alias }" exact link>
    <v-list-item-icon v-if="item.icon">
      <v-icon>
        {{ icons[item.icon] }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-title>
      {{ item.title }}
    </v-list-item-title>
  </v-list-item>

  <v-list-group v-else :prepend-icon="item.icon ? icons[item.icon] : false" no-action>
    <template v-slot:activator>
      <v-list-item-title>
        {{ item.title }}
      </v-list-item-title>
    </template>

    <SidebarItem v-for="childItem in item.children" :key="childItem.alias" :item="childItem" sub-group />
  </v-list-group>
</template>

<script>
import SidebarItem from './SidebarItem'

export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  components: {
    SidebarItem
  }
}
</script>
