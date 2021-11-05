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
      <table-header>
        <v-text-field
          v-model="search"
          v-debounce="fetchData"
          :append-icon="icons.mdiMagnify"
          label="Search"
          single-line
          hide-details
          class="mr-5"
        />
     </table-header>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip v-if="item.status==2" color="danger" small>Failed</v-chip>
      <v-chip v-if="item.status==1" color="success" small>Success</v-chip>
      <v-chip v-if="!item.status" color="warning" small>Pending</v-chip>
    </template>

    <template v-slot:item.whole="{ item }">
      <v-menu
        open-on-hover
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-chip color="teal" dark v-on="on">{{item.whole}}</v-chip>
        </template>
        <v-list v-if="item.whole_list && item.whole_list.length > 0">
          <v-list-item
            v-for="it in item.whole_list"
            :href="it.domain"
            :key="it.title"
            target="_blank"
          >
            <v-list-item-title><span v-html="it.title"></span></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template v-slot:item.partial="{ item }">
      <v-menu
        open-on-hover
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-chip color="blue" dark v-on="on">{{item.partial}}</v-chip>
        </template>
        <v-list v-if="item.partial_list && item.partial_list.length > 0">
          <v-list-item
            v-for="it in item.partial_list"
            :href="it.domain"
            :key="it.title"
            target="_blank"
          >
            <v-list-item-title><span v-html="it.title"></span></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <template v-slot:item.nomatch="{ item }">
      <v-menu
        open-on-hover
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-chip color="blue-grey" dark v-on="on">{{item.nomatch}}</v-chip>
        </template>
        <v-list v-if="item.nomatch_list && item.nomatch_list.length > 0">
          <v-list-item
            v-for="it in item.nomatch_list"
            :href="it.domain"
            :key="it.title"
            target="_blank"
          >
            <v-list-item-title><span v-html="it.title"></span></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <!-- <template v-slot:item.is_course="{ item }">
      <v-chip v-if="item.is_course" color="success" small>Course</v-chip>
      <v-chip v-if="!item.is_course" color="warning" small>Event</v-chip>
    </template> -->

    <template v-slot:item._id="{ item }">
      {{table.data.map(function(x) {return x._id; }).indexOf(item._id) + 1}}
    </template>
  </v-data-table>
</template>

<script>
import apiService from '@/services/keydomain.service'
import tableMixin from '@/mixins/table.mixin'
import crudMixin from '@/mixins/crud.mixin'

export default {
  mixins: [tableMixin, crudMixin],
  data: () => ({
    headers: [
      { text: '#', value: '_id', align: 'left', sortable: false },
      { text: 'Keywords', value: 'keywords' },
      { text: 'Full Match', value: 'whole' },
      { text: 'Partial Match', value: 'partial' },
      { text: 'No Match', value: 'nomatch' },
      { text: 'Status', value: 'status' }
    ],
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
    this.params.keyId = this.$route.params.id
    this.fetchData()
  },
  beforeDestroy () {
    this.cancelAutoUpdate()
  }
}
</script>
