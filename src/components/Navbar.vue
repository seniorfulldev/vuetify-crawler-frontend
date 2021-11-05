<template>
  <v-app-bar app color="indigo" dark clipped-left fixed>
    <v-app-bar-nav-icon @click.stop="$root.drawer = !$root.drawer" class="hidden-lg-and-up" />

    <v-toolbar-title>
      SERP Crawler
    </v-toolbar-title>

    <v-spacer />

    <v-menu bottom offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon class="mr-3">{{ icons.mdiAccount }}</v-icon>
          {{ $auth.user().name }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click.prevent="logout" link>
          <v-icon class="mr-3">{{ icons.mdiLogout }}</v-icon>
          <v-list-item-title>
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    drawer: Boolean
  },
  methods: {
    logout () {
      this.$auth.logout({
        makeRequest: true,
        redirect: '/login'
      })
    }
  }
}
</script>
