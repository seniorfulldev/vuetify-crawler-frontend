<template>
  <v-navigation-drawer v-model="$root.drawer" clipped fixed app>
    <v-list v-if="$auth.user().roles=='admin'" dense>
      <SidebarItem v-for="item in Adminitems" :key="item.alias" :item="item" />
    </v-list>
    <v-list v-else-if="$auth.user().roles=='user'" dense>
      <SidebarItem v-for="item in Useritems" :key="item.alias" :item="item" />
    </v-list>
    <v-card
      class="mx-auto"
      max-width="344"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">API Credentials
            <v-btn icon color="green" @click="fetchData()">
              <v-icon>{{icons.mdiRefresh}}</v-icon>
            </v-btn>
          </v-list-item-title>
          <div class="overline mb-4">Majestic API Credit
            <v-progress-linear align-content="center" justify="center" :value="this.creditData.majestic.used/this.creditData.majestic.limit*100"></v-progress-linear>
            <p class="font-weight-black title text-right">{{this.creditData.majestic.used}} / {{this.creditData.majestic.limit}}</p>
          </div>
          <div class="overline mb-4">SEMRUSH API Credit
            <v-progress-linear align-content="center" justify="center" :value="this.creditData.semrush.used/this.creditData.semrush.limit*100"></v-progress-linear>
            <p class="font-weight-black title text-right">{{this.creditData.semrush.used}} / {{this.creditData.semrush.limit}}</p>
          </div>
          <div class="overline mb-4">Clearout API Credit
            <v-progress-linear align-content="center" justify="center" :value="this.creditData.clearout.used/this.creditData.clearout.limit*100"></v-progress-linear>
            <p class="font-weight-black title text-right">{{this.creditData.clearout.used}} / {{this.creditData.clearout.limit}}</p>
          </div>
          <div class="overline mb-4">Hunterio API Credit
            <v-progress-linear align-content="center" justify="center" :value="this.creditData.hunterio.used/this.creditData.hunterio.limit*100"></v-progress-linear>
            <p class="font-weight-black title text-right">{{this.creditData.hunterio.used}} / {{this.creditData.hunterio.limit}}</p>
          </div>
          <div class="overline mb-4">Keywords Credit
            <p class="font-weight-black title text-right">{{this.creditData.keyword}}</p>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import SidebarItem from './SidebarItem'
import reportService from '@/services/report.service'

export default {
  components: {
    SidebarItem
  },
  data: () => ({
    Adminitems: [
      {
        alias: 'home',
        icon: 'mdiHome',
        title: 'Dashboard'
      },
      {
        alias: 'unit',
        icon: 'mdiCalendar',
        title: 'Campaigns'
      },
      {
        alias: 'keyword',
        icon: 'mdiKeyboard',
        title: 'Keywords'
      },
      {
        alias: 'domain',
        icon: 'mdiCalendarCheckOutline',
        title: 'Domains'
      },
      {
        alias: 'url',
        icon: 'mdiCalendarCheckOutline',
        title: 'Urls'
      },
      {
        alias: 'metric',
        icon: 'mdiChartMultiple',
        title: 'Metrics'
      },
      {
        alias: 'user',
        icon: 'mdiAccountMultiple',
        title: 'Users'
      },
      {
        alias: 'settings',
        icon: 'mdiSettingsOutline',
        title: 'Settings'
      }
    ],
    Useritems: [
      {
        alias: 'home',
        icon: 'mdiHome',
        title: 'Dashboard'
      },
      {
        alias: 'unit',
        icon: 'mdiCalendar',
        title: 'Campaigns'
      },
      {
        alias: 'keyword',
        icon: 'mdiKeyboard',
        title: 'Keywords'
      },
      {
        alias: 'domain',
        icon: 'mdiCalendarCheckOutline',
        title: 'Domains'
      },
      {
        alias: 'url',
        icon: 'mdiCalendarCheckOutline',
        title: 'Urls'
      },
      {
        alias: 'metric',
        icon: 'mdiChartMultiple',
        title: 'Metrics'
      }
    ],
    creditData: {
      majestic: {
        limit: 0,
        used: 0
      },
      semrush: {
        limit: 0,
        used: 0
      },
      clearout: {
        limit: 0,
        used: 0
      },
      hunterio: {
        limit: 0,
        used: 0
      }
    }
  }),
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const { data } = await reportService.getUserData()
      this.creditData = data.data
    }
  }
}
</script>
