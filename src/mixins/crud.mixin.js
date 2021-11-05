import deepcopy from 'deepcopy'
import axios from '@/axios'

export default {
  data: () => ({
    files: {},
    editedItem: {},
    editedIndex: -1,
    dialog: {
      form: false,
      confirm: false,
      stepDialog: false
    },
    busy: false,
    errors: {}
  }),
  mounted () {
    this.editedItem = deepcopy(this.defaultItem || {})
  },
  methods: {
    viewItem (item) {
      this.editedIndex = this.table.data.indexOf(item)
      this.editedItem = deepcopy(item)
      this.dialog.form = true
    },
    deleteItem (item) {
      this.editedItem = deepcopy(item)
      this.dialog.confirm = true
    },
    async deleteAction (selected) {
      if (selected.length > 0) {
        await axios.post('domains/delete', selected)
        this.fetchData()
      }
    },
    async restoreAction (selected) {
      if (selected.length > 0) {
        await axios.post('domains/restore', selected)
        this.fetchData()
      }
    },
    async restoreMetricDomainAction (selected) {
      if (selected.length > 0) {
        await axios.post('metricdomains/restore', selected)
        this.fetchData()
      }
    },
    showItem (item) {
      // this.$router.push('domains/' + item._id)
      if (item.campType === 1) {
        this.$router.push({ name: 'url', query: { campId: item._id } })
      } else {
        this.$router.push({ name: 'domain', query: { campId: item._id } })
      }
    },
    showMetricItem (item) {
      // this.$router.push('domains/' + item._id)
      if (item.campType === 1) {
        this.$router.push({ name: 'metricurl', query: { campId: item._id } })
      } else {
        this.$router.push({ name: 'metricdomain', query: { campId: item._id } })
      }
    },
    skipItem (item) {
      axios.post('domains/skip/' + item._id)
    },
    async csvExport (item) {
      await axios({
        url: 'domains/download/' + item._id,
        method: 'POST',
        responseType: 'blob'
      }).then(function (response) {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Report.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    async csvMetricExport (item) {
      await axios({
        url: 'metricdomains/download/' + item._id,
        method: 'POST',
        responseType: 'blob'
      }).then(function (response) {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute('download', 'Report.xlsx')
        document.body.appendChild(fileLink)
        fileLink.click()
      })
    },
    async archiveCampaign (item) {
      await axios.post('units/archive/' + item._id)
      this.fetchData()
    },
    async activeCampaign (item) {
      await axios.post('units/active/' + item._id)
      this.fetchData()
    },
    async archiveMetricCampaign (item) {
      await axios.post('metrics/archive/' + item._id)
      this.fetchData()
    },
    async activeMetricCampaign (item) {
      await axios.post('metrics/active/' + item._id)
      this.fetchData()
    },
    async startAuto (item) {
      await this.apiService.startAuto(item._id)
      this.fetchData()
    },
    async stopAuto (item) {
      await this.apiService.stopAuto(item._id)
      this.fetchData()
    },
    async confirm () {
      this.busy = true

      try {
        await this.apiService.deleteById(this.editedItem._id)
        this.close()
        this.fetchData()
      } catch (err) {
      } finally {
        this.busy = false
      }
    },
    async test () {
      try {
        await this.apiService.testEmail(this.editedItem)
      } catch (err) {
        if (err.response) {
          this.errors = err.response.data.errors || {}
        }
      }
    },
    async save () {
      this.errors = {}
      if (!this.$refs.form.validate() && !this.editedItem._id) {
        return
      }

      this.busy = true

      try {
        await this.apiService.save(this.editedItem, this.files)
        this.close()
        this.fetchData()
      } catch (err) {
        if (err.response) {
          this.errors = err.response.data.errors || {}
        }
      } finally {
        this.busy = false
      }
    },
    close () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.files = {}
      this.errors = {}
      this.dialog.form = false
      this.dialog.confirm = false
      this.editedItem = deepcopy(this.defaultItem || {})
      this.editedIndex = -1
    }
  }
}
