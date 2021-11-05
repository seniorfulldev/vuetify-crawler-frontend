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
          :disabled="buttonStatus"
          @click="startAction()"
        >
          {{ actionName }}
        </v-btn>
        <v-btn
          color="success"
          class="ma-2"
          @click="backAction()"
          :disabled="backStatus"
        >
          Back
        </v-btn>
        <v-btn
          color="success"
          class="ma-2"
          @click="skipAction()"
          :disabled="skipStatus"
        >
          {{skipButton}}
        </v-btn>
     </table-header>
    </template>

    <!-- <template v-slot:item.is_course="{ item }">
      <v-chip v-if="item.is_course" color="success" small>Course</v-chip>
      <v-chip v-if="!item.is_course" color="warning" small>Event</v-chip>
    </template> -->

     <template v-slot:item.status="{ item }">
      <v-chip v-if="item.status==2" color="danger" small>Failed</v-chip>
      <v-chip v-if="item.status==1" color="success" small>Success</v-chip>
      <v-chip v-if="item.status==3" color="primary" small>Progress</v-chip>
      <v-chip v-if="item.status==4" color="teal" small>Deleted</v-chip>
      <v-chip v-if="!item.status" color="warning" small>Pending</v-chip>
    </template>

    <template v-slot:item.contactForm="{ item }">
      <v-chip v-if="item.contactForm==1" color="success" small>Found</v-chip>
      <v-chip v-if="item.contactForm==2" color="danger" small>Not Found</v-chip>
      <v-chip v-if="!item.contactForm" color="default" small>Not Checked</v-chip>
    </template>

    <template v-slot:item.contact_email="{ item }">
      <v-chip v-if="item.femail == 1" color="success" small>{{item.contact_email}}</v-chip>
      <v-chip v-if="item.femail == 2" color="danger" small>Not Found</v-chip>
      <v-chip v-if="!item.femail" color="danger" small>Not Checked</v-chip>
    </template>

    <template v-slot:item.semail="{ item }">
      <v-chip v-if="item.semail ==1" color="success" small>Success</v-chip>
      <v-chip v-if="item.semail == 2" color="danger" small>Failed</v-chip>
    </template>

    <template v-slot:item.contactFormSub="{ item }">
      <v-chip v-if="item.contactFormSub==1" color="success" small>Submitted</v-chip>
      <v-chip v-if="item.contactFormSub==2" color="danger" small>Failed</v-chip>
    </template>

    <template v-slot:item._id="{ item }">
      {{table.data.map(function(x) {return x._id; }).indexOf(item._id) + 1}}
    </template>

    <template v-slot:item.url="{ item }">
      <a :href="item.url" target="_blank">{{ item.url }}</a>
    </template>

    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="skipItem(item)">
        {{ icons.mdiDebugStepOver }}
      </v-icon>

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
    <v-btn color="primary" class="ml-2" @click="restoreAction(selected); selected=[];">
      Restore Selected
    </v-btn>
  </div>
  </div>
</template>

<script>
import apiService from '@/services/url.service'
import campaignService from '@/services/unit.service'
import tableMixin from '@/mixins/table.mixin'
import crudMixin from '@/mixins/crud.mixin'

export default {
  mixins: [tableMixin, crudMixin],
  data: () => ({
    selected: [],
    headers: [
      { text: '#', value: '_id', align: 'left', sortable: false },
      { text: 'Url', value: 'url' },
      { text: 'Majestic TF', value: 'tf' },
      { text: 'Majestic CF', value: 'cf' },
      { text: 'Majestic Ratio', value: 'ctf' },
      { text: 'SEMrush Organic Keywords', value: 'organKey' },
      { text: 'SEMrush Organic Traffic', value: 'organTraffic' },
      { text: 'SEMrush Authority', value: 'authority' },
      { text: 'Contact Page', value: 'contactForm' },
      { text: 'Contact Form Submission', value: 'contactFormSub' },
      { text: 'Find Email', value: 'contact_email' },
      { text: 'Send Email', value: 'semail' },
      { text: 'Status', value: 'status' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    defaultItem: {
    },
    params: {
      status_id: -1
    },
    statusList: [
      { id: -1, name: 'All' },
      { id: 0, name: 'Pending' },
      { id: 1, name: 'Success' },
      { id: 2, name: 'Failed' },
      { id: 3, name: 'Progress' },
      { id: 4, name: 'Deleted' }
    ],
    buttonStatus: 0,
    skipStatus: false,
    addStatus: false,
    backStatus: false,
    actionName: 'Start',
    skipButton: 'Skip',
    interval: '',
    status: ['Majestic Metrics Update', 'Majestic Filtering', 'SEMrush Metrics Update', 'SEMrush Filtering', 'Find Contact URL', 'Contact Forms Submission', 'Find Emails', 'Send Email'],
    apiService
  }),
  watch: {
    'params.status_id': 'fetchData'
  },
  methods: {
    updateAction: async function () {
      campaignService.getStatus({
        id: this.params.campId
      }).then(({ data }) => {
        let status = ['Majestic Metrics Update', 'Majestic Filtering', 'SEMrush Metrics Update', 'SEMrush Filtering', 'Find Contact URL', 'Contact Forms Submission', 'Find Emails', 'Send Email']
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
    startAction: async function () {
      this.cancelAutoUpdate()
      if (this.progress <= 7) {
        this.buttonStatus = true
        this.actionName = 'Working in Progress'
        this.skipButton = 'Stop Process'
        this.interval = setInterval(() => {
          this.fetchData()
          this.updateAction()
        }, 5000)
        campaignService.actionStart(this.params.campId)
      }
    },
    skipAction: async function () {
      this.buttonStatus = false
      this.backStatus = false
      this.skipButton = 'Skip'
      if (this.progress > 7) {
        this.skipStatus = true
        this.actionName = 'Finished'
      } else {
        this.actionName = this.status[this.progress]
        await campaignService.actionSkip(this.params.campId)
        campaignService.getStatus({
          id: this.params.campId
        }).then(({ data }) => {
          let status = ['Majestic Metrics Update', 'Majestic Filtering', 'SEMrush Metrics Update', 'SEMrush Filtering', 'Find Contact URL', 'Contact Forms Submission', 'Find Emails', 'Send Email']
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
      }
    },
    backAction: async function () {
      this.buttonStatus = false
      this.skipStatus = false
      this.skipButton = 'Skip'
      if (this.progress <= 0) {
        this.backStatus = true
        this.actionName = this.status[0]
      } else {
        // this.progress = this.progress - 1
        if (this.progress === 0) {
          this.backStatus = true
        }
        this.actionName = this.status[this.progress]
        await campaignService.actionBack(this.params.campId)
        campaignService.getStatus({
          id: this.params.campId
        }).then(({ data }) => {
          let status = ['Majestic Metrics Update', 'Majestic Filtering', 'SEMrush Metrics Update', 'SEMrush Filtering', 'Find Contact URL', 'Contact Forms Submission', 'Find Emails', 'Send Email']
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
      }
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
