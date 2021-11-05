<template>
  <div>
  <v-data-table
    :headers="headers"
    :items="table.data"
    :options.sync="options"
    :footer-props="footerProps"
    :server-items-length="total"
    :loading="loading"
    item-key="_id"
    v-model="selected"
    show-select
    class="elevation-1"
  >

    <template v-slot:top>
      <table-header
        :dialog="dialog"
        :busy="busy"
        confirm-title="Delete Domain"
        confirm-message="Are you sure you want to delete this domain?"
        @close="close"
        @confirm="confirm"
      >
        <v-select
          v-model="params.status_id"
          :items="statusList"
          item-value="id"
          item-text="name"
          class="py-0 my-0 mr-5 flex-grow-0"
          style="width: 200px"
          hide-details
        />

        <v-text-field
          v-model="search"
          v-debounce="fetchData"
          :append-icon="icons.mdiMagnify"
          label="Search"
          single-line
          hide-details
          class="mr-5"
        />
        <v-btn
          color="primary"
          class="ma-2"
          @click="updateMajestic()"
        >
          Update Majestic
        </v-btn>
        <v-btn
          color="success"
          class="ma-2"
          @click="updateSEMrush()"
        >
          Update SEMrush
        </v-btn>
        <v-btn
          color="success"
          class="ma-2"
          @click="csvMetricExport({_id:params.campId})"
        >
          Export
        </v-btn>
     </table-header>
    </template>

    <template v-slot:item._id="{ item }">
      {{table.data.map(function(x) {return x._id; }).indexOf(item._id) + 1}}
    </template>

    <template v-slot:item.domain="{ item }">
      <a :href="'https://' + item.domain" target="_blank" >{{ item.domain }}</a>
    </template>

    <template v-slot:item.action="{ item }">

      <v-icon small @click="deleteItem(item)">
        {{ icons.mdiDelete }}
      </v-icon>
    </template>
  </v-data-table>
  <div class="text-center pt-2">
    <v-dialog v-model="dialog.form" persistent scrollable max-width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" v-on="on" :disabled="addStatus">
          Add more Domains
        </v-btn>
      </template>

      <v-form ref="form" lazy-validation @submit.prevent="save">
        <v-card :loading="busy">
          <v-card-title>
            Add Domains
          </v-card-title>

          <v-card-text>

            <v-file-input
              v-model="files.domain_list"
              :rules="[validation.required]"
              accept=".txt"
              show-size
              label="Domain List"
            />

          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn :disabled="busy" color="primary" text @click="close">Cancel</v-btn>
            <v-btn :disabled="busy" color="primary" text type="submit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-btn color="primary" class="ml-2" @click="deleteAction(selected); selected=[];">
      Delete Selected
    </v-btn>
    <v-btn color="primary" class="ml-2" @click="restoreMetricDomainAction(selected); selected=[];">
      Restore Selected
    </v-btn>
  </div>
  </div>
</template>

<script>
import apiService from '@/services/metricdomain.service'
import metricService from '@/services/metric.service'
import tableMixin from '@/mixins/table.mixin'
import crudMixin from '@/mixins/crud.mixin'

export default {
  mixins: [tableMixin, crudMixin],
  data: () => ({
    selected: [],
    headers: [
      { text: '#', value: '_id', align: 'left', sortable: false },
      { text: 'Domain', value: 'domain' },
      { text: 'Majestic TF', value: 'tf' },
      { text: 'Majestic CF', value: 'cf' },
      { text: 'Majestic Ratio', value: 'ctf' },
      { text: 'SEMrush Organic Keywords', value: 'organKey' },
      { text: 'SEMrush Organic Traffic', value: 'organTraffic' },
      { text: 'SEMrush Authority', value: 'authority' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    defaultItem: {
    },
    params: {
      status_id: -1
    },
    statusList: [
      { id: -1, name: 'All' },
      { id: 4, name: 'Deleted' }
    ],
    buttonStatus: 0,
    skipStatus: false,
    addStatus: false,
    backStatus: false,
    actionName: 'Start',
    skipButton: 'Skip',
    interval: '',
    status: ['Majestic Metrics Update', 'Majestic Filtering', 'SEMrush Metrics Update', 'SEMrush Filtering'],
    apiService
  }),
  watch: {
    'params.status_id': 'fetchData'
  },
  methods: {
    updateAction: async function () {
      metricService.getStatus({
        id: this.params.campId
      }).then(({ data }) => {
        let status = ['Majestic Metrics Update', 'Majestic Filtering', 'SEMrush Metrics Update', 'SEMrush Filtering']
        if (this.params.campId != null) {
          this.progress = data['progress']
          this.buttonStatus = Boolean(data.type)
          if (data['progress'] >= 8) {
            this.skipStatus = true
            this.actionName = 'Finished'
          } else {
            this.actionName = status[data['progress']]
            if (data.type !== 0) {
              this.actionName = 'Working in Progress'
              this.skipButton = 'Stop Process'
            } else {
              this.skipButton = 'Skip'
              this.backStatus = false
            }
            if (data['progress'] === 0) {
              this.backStatus = true
            }
          }
        } else {
          this.buttonStatus = true
          this.skipStatus = true
          this.addStatus = true
          this.backStatus = true
          this.actionName = status[0]
        }
      })
    },
    updateMajestic: async function () {
      metricService.updateMajestic(this.params.campId)
      this.updateAction()
      this.fetchData()
      this.updateAction()
    },
    updateSEMrush: async function () {
      metricService.updateSEMrush(this.params.campId)
      this.fetchData()
      this.updateAction()
    },
    cancelAutoUpdate () {
      try {
        clearInterval(this.interval)
      } catch (err) {
        // console.log('no timer')
      }
    }
  },
  created () {
    this.cancelAutoUpdate()
    this.interval = setInterval(() => {
      this.fetchData()
    }, 5000)
  },
  mounted () {
    this.params.campId = this.$route.query.campId
    this.updateAction()
  },
  beforeDestroy () {
    this.cancelAutoUpdate()
  }
}
</script>
