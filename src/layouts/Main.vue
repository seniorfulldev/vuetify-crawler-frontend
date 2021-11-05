<template>
  <div>
    <navbar />
    <sidebar />

    <v-content>
      <breadcrumbs class="py-4" />

      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  components: {
    Navbar,
    Sidebar,
    Breadcrumbs
  }
}
</script>
