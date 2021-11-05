<template>
  <v-data-table
    :headers="headers"
    :items="table.data"
    :options.sync="options"
    :footer-props="footerProps"
    :server-items-length="total"
    :loading="loading"
    @onRowClick="deleteItem"
    class="elevation-1"
  >
    <template v-slot:top>
      <table-header
        :dialog="dialog"
        :busy="busy"
        confirm-title="Delete Campaign"
        confirm-message="Are you sure you want to delete the campaign?"
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
        <v-dialog v-model="dialog.form" persistent scrollable max-width="500">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on">
              New Campaign
            </v-btn>

            <v-text-field
              v-model="search"
              v-debounce="fetchData"
              :append-icon="icons.mdiMagnify"
              label="Search"
              single-line
              hide-details
              class="mr-5"
            />
          </template>

          <v-form ref="form" lazy-validation>
            <v-card :loading="busy">
              <v-card-title>
                {{ editedIndex === -1 ? 'New Campaign' : 'Edit Campaign' }}
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="[validation.required]"
                    validate-on-blur
                    label="Campaign Name"
                  />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.region"
                      label="Region"
                      placeholder="us"
                    />
                  </v-col>
                </v-row>

                <v-row v-if="editedIndex === -1">
                  <v-col
                    cols="12"
                    md="6"
                  >
                  <v-file-input
                    v-model="files.domain_list"
                    :rules="[validation.required]"
                    accept=".txt"
                    show-size
                    label="Domain List"
                  />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                  <v-select
                    v-model="editedItem.campType"
                    :items="campTypeList"
                    item-value="id"
                    item-text="name"
                    label="Campaign Type"
                  />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.min_organ"
                      validate-on-blur
                      label="Minimum of Organic Traffic"
                      type="number"
                      @click:append-outer="increment"
                      @click:prepend="decrement"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.min_auth"
                      validate-on-blur
                      label="Minimum of Authority"
                      type="number"
                      @click:append-outer="increment"
                      @click:prepend="decrement"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.min_tf"
                      validate-on-blur
                      label="Minimum of TF"
                      type="number"
                      @click:append-outer="increment"
                      @click:prepend="decrement"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.min_tcf"
                      validate-on-blur
                      label="Minimum of TF/CF ratio"
                      type="number"
                      @click:append-outer="increment"
                      @click:prepend="decrement"
                    />
                  </v-col>
                </v-row>
                <!-- <v-text-field
                  v-model="editedItem.scheduled_weekdays"
                  validate-on-blur
                  label="Scheduled weekday"
                /> -->

                <!-- <v-text-field
                  v-model="editedItem.notify_email"
                  :rules="[validation.email]"
                  validate-on-blur
                  label="Alert Email"
                /> -->
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.smtp"
                      :rules="[validation.required]"
                      validate-on-blur
                      placeholder="smtp.gmail.com:465"
                      label="SMTP Server"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.phone"
                      validate-on-blur
                      label="Contact Phone Number"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.smtpUser"
                      :rules="[validation.email]"
                      validate-on-blur
                      label="SMTP Username"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >

                    <v-text-field
                      v-model="editedItem.smtpPass"
                      :append-icon="show1 ? icons.mdiEye : icons.mdiEyeOff"
                      :rules="[validation.required]"
                      :type="show1 ? 'text' : 'password'"
                      validate-on-blur
                      label="SMTP Password"
                      @click:append="show1 = !show1"
                      class="input-group--focused"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.fname"
                      validate-on-blur
                      label="First Name"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.lname"
                      validate-on-blur
                      label="Last Name"
                    />
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="editedItem.email_subject"
                  :rules="[validation.required]"
                  validate-on-blur
                  label="Email Subject"
                />

                <v-textarea
                  v-model="editedItem.email_template"
                  :rules="[validation.required]"
                  validate-on-blur
                  label="Email Content"
                />
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn :disabled="busy" color="primary" text @click="close">Cancel</v-btn>
                <v-btn :disabled="busy" color="primary" text @click="test()">Test Email</v-btn>
                <v-btn :disabled="busy" color="primary" text @click="save()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-dialog v-model="dialog.stepDialog" persistent scrollable max-width="500">
        <v-form ref="form1" lazy-validation @submit.prevent="startStepAuto">
          <v-card :loading="busy">
            <v-card-title>
              Automation Step
            </v-card-title>
            <v-card-text>

              <v-select
                v-model="autoStep"
                :items="stepList"
                validate-on-blur
                item-value="id"
                item-text="name"
                class="py-0 my-0 mr-5 flex-grow-0"
                hide-details
              />

            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="busy" color="primary" text @click="closebox">Cancel</v-btn>
              <v-btn :disabled="busy" color="primary" text type="submit">Start</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      </table-header>
    </template>

    <template v-slot:item.type="{ item }">
      <v-chip v-if="item.type==2" color="success" small>Finished</v-chip>
      <v-chip v-if="item.type==1" color="primary" small>In Progress</v-chip>
      <v-chip v-if="!item.type" color="warning" small>Pending</v-chip>
    </template>

    <template v-slot:item.campType="{ item }">
      <v-chip v-if="item.campType==1" color="deep-purple accent-4" outlined>Niche Edits</v-chip>
      <v-chip v-if="item.campType!=1" color="indigo darken-3" outlined>Guest Posts</v-chip>
    </template>

    <template v-slot:item.progress="{ item }">
      <v-progress-linear
        color="light-blue"
        height="25"
        min="0"
        max="9"
        :value="item.progress/8*100"
        striped
      >
        <strong>{{ status[item.progress] }}</strong>
      </v-progress-linear>
    </template>

    <template v-slot:item._id="{ item }">
      {{table.data.map(function(x) {return x._id; }).indexOf(item._id) + 1}}
    </template>

    <template v-slot:item.action="{ item }" class="flex-row">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon small class="mr-2" v-on="on" @click="viewItem(item)">
            {{ icons.mdiPencil }}
          </v-icon>
        </template>
        <span>Edit</span>
      </v-tooltip>

      <v-tooltip bottom v-if="item.archived != 1">
        <template v-slot:activator="{ on }">
          <v-icon small class="mr-2" v-on="on" @click="archiveCampaign(item)">
          {{ icons.mdiArchive }}
          </v-icon>
        </template>
        <span>Archive</span>
      </v-tooltip>

      <v-tooltip bottom v-if="item.archived == 1">
        <template v-slot:activator="{ on }">
          <v-icon small class="mr-2" v-on="on" @click="activeCampaign(item)">
            {{ icons.mdiRecycle }}
          </v-icon>
        </template>
        <span>Unarchive</span>
      </v-tooltip>

      <v-tooltip bottom v-if="item.auto == 1">
        <template v-slot:activator="{ on }">
          <v-icon small class="mr-2" v-on="on" @click="stopAuto(item)">
            {{ icons.mdiPause }}
          </v-icon>
        </template>
        <span>Pause</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }" v-if="item.auto != 1 && item.progress < 8">
          <v-icon small class="mr-2" v-on="on" @click="startDialog(item)">
            {{ icons.mdiPlay }}
          </v-icon>
        </template>
        <span>Start</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon small class="mr-2" v-on="on" @click="csvExport(item)">
            {{ icons.mdiDownload }}
          </v-icon>
        </template>
        <span>Export</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon small v-on="on" @click="deleteItem(item)">
            {{ icons.mdiDelete }}
          </v-icon>
        </template>
        <span>Delete</span>
      </v-tooltip>
    </template>

    <template v-slot:item.name="{ item }">
      <a @click="showItem(item)">{{ item.name }}</a>
    </template>
  </v-data-table>
</template>

<script>
import apiService from '@/services/unit.service'
import tableMixin from '@/mixins/table.mixin'
import crudMixin from '@/mixins/crud.mixin'

export default {
  mixins: [tableMixin, crudMixin],
  watch: {
    'params.status_id': 'fetchData'
  },
  data: () => ({
    headers: [
      { text: '#', value: '_id', align: 'left', sortable: false },
      { text: 'Campaign Name', value: 'name' },
      // { text: 'Search Query', value: 'title' },
      { text: 'Progess', value: 'progress', width: '40%' },
      { text: 'Status', value: 'type' },
      { text: 'Type', value: 'campType' },
      { text: 'Actions', value: 'action', sortable: false, width: '150px' }
    ],
    defaultItem: {
      type: 0,
      progress: 0,
      min_tcf: 0,
      min_tf: 0,
      min_organ: 0,
      min_auth: 0,
      region: 'us'
    },
    apiService,
    show1: false,
    menu1: false,
    menu2: false,
    menu3: false,
    status: ['Majestic Metrics Update', 'Majestic Filtering', 'SEMrush Metrics Update', 'SEMrush Filtering', 'Find Contact URL', 'Contact Forms Submission', 'Find Emails', 'Send Email'],
    chips: [],
    params: {
      status_id: 0
    },
    statusList: [
      { id: -1, name: 'All' },
      { id: 0, name: 'Active' },
      { id: 1, name: 'Archived' }
    ],
    campTypeList: [
      { id: 0, name: 'Guest Posts' },
      { id: 1, name: 'Niche Edits' }
    ],
    stepList: [
      { id: 1, name: '1 - Majestic Metrics Update' },
      { id: 2, name: '2 - Majestic Filtering' },
      { id: 3, name: '3 - SEMrush Metrics Update' },
      { id: 4, name: '4 - SEMrush Metrics Filtering' },
      { id: 5, name: '5 - Find Contact URL' },
      { id: 6, name: '6 - Contact Form Submission' },
      { id: 7, name: '7 - Find Email' },
      { id: 8, name: '8 - Send Email' }
    ],
    autoStep: 8,
    campId: 0,
    items: []
  }),
  methods: {
    remove (item) {
      this.chips.splice(this.chips.indexOf(item), 1)
      this.chips = [...this.chips]
    },
    increment () {
      this.foo = parseInt(this.foo, 10) + 1
    },
    decrement () {
      this.foo = parseInt(this.foo, 10) - 1
    },
    async startStepAuto () {
      if (!(this.autoStep > 0)) {
        return
      }
      await this.apiService.startAuto(this.campId, this.autoStep)
      this.dialog.stepDialog = false
      this.fetchData()
    },
    closebox () {
      this.dialog.stepDialog = false
    },
    startDialog (item) {
      this.campId = item._id
      this.dialog.stepDialog = true
    }
  }
}
</script>
