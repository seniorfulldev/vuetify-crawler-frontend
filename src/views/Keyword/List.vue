<template>
  <v-data-table
    :headers="headers"
    :items="table.data"
    :options.sync="options"
    :footer-props="footerProps"
    :server-items-length="total"
    :loading="loading"
    class="elevation-1"
  >
    <template v-slot:top>
      <table-header
        :dialog="dialog"
        :busy="busy"
        confirm-title="Delete Keywords List"
        confirm-message="Are you sure you want to delete this keywords list?"
        @close="close"
        @confirm="confirm"
      >
        <v-dialog v-model="dialog.form" persistent scrollable max-width="500">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on">
              New Keywords List
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
                {{ 'New Keywords List'}}
              </v-card-title>

              <v-card-text>
                <v-text-field
                  v-model="editedItem.name"
                  :rules="[validation.required]"
                  validate-on-blur
                  label="Keywords List Name"
                />

                <v-file-input
                  v-model="files.keyword_list"
                  :rules="[validation.required]"
                  accept=".txt"
                  show-size
                  label="Keywords List"
                />

                <v-text-field
                  v-model="editedItem.region"
                  :rules="[validation.required]"
                  validate-on-blur
                  label="Region"
                />
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn :disabled="busy" color="primary" text @click="close">Cancel</v-btn>
                <v-btn :disabled="busy" color="primary" text @click="save()">Save</v-btn>
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

    <template v-slot:item._id="{ item }">
      {{table.data.map(function(x) {return x._id; }).indexOf(item._id) + 1}}
    </template>

    <template v-slot:item.action="{ item }">
      <v-icon v-if="item.type == 1" small class="mr-2" @click="stopAuto(item)">
        {{ icons.mdiPause }}
      </v-icon>

      <v-icon v-if="!item.type || item.type == 2" small class="mr-2" @click="startAuto(item)">
        {{ icons.mdiPlay }}
      </v-icon>

      <v-icon small @click="deleteItem(item)">
        {{ icons.mdiDelete }}
      </v-icon>
    </template>

    <template v-slot:item.name="{ item }">
      <a :href="'keywords/' + item._id">{{ item.name }}</a>
    </template>
  </v-data-table>
</template>

<script>
import apiService from '@/services/keyword.service'
import tableMixin from '@/mixins/table.mixin'
import crudMixin from '@/mixins/crud.mixin'

export default {
  mixins: [tableMixin, crudMixin],
  watch: {

  },
  data: () => ({
    headers: [
      { text: '#', value: '_id', align: 'left', sortable: false },
      { text: 'Keywords List Name', value: 'name' },
      { text: 'Region', value: 'region' },
      { text: 'Type', value: 'type' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    defaultItem: {
      type: 0
    },
    interval: '',
    apiService
  }),
  methods: {
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
    this.params.campId = this.$route.params.campId
    this.fetchData()
  },
  beforeDestroy () {
    this.cancelAutoUpdate()
  }
}
</script>
