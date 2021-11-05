<template>
  <div>
    <h1 class="title my-3">
      Dashboard
    </h1>

    <v-row>
      <v-col md="6" cols="12" v-if="$auth.user().roles=='admin'">
        <v-card color="#385F73" shaped dark>
          <v-card-title class="headline">Customers</v-card-title>

          <v-card-subtitle>
            SERP Service Users
          </v-card-subtitle>

          <v-card-text>
            <v-row align="center" no-gutters>
              <v-icon x-large class="mr-3">
                {{ icons.mdiAccount }}
              </v-icon>

              <h2 class="display-1">
                {{ stats.totalUsers }}
              </h2>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn to="/users" text>
              Manage Users
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col md="6" cols="12">
        <v-card color="#952175" shaped dark>
          <v-card-title class="headline">Campaigns</v-card-title>

          <v-card-subtitle>
            Total Campaigns
          </v-card-subtitle>

          <v-card-text>
            <v-row align="center" no-gutters>
              <v-icon x-large class="mr-3">
                {{ icons.mdiCreditCardOutline }}
              </v-icon>

              <h2 class="display-1">
                {{ stats.totalCampaigns }}
              </h2>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn to="/units" text>
              Manage Campaigns
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import reportService from '@/services/report.service'

export default {
  data: () => ({
    stats: {},
    params: {}
  }),
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const { data } = await reportService.getDashboardStats(this.$auth.user()._id)
      this.stats = data
    }
  }
}
</script>
