export default {
  data: () => ({
    table: {},
    options: {
      itemsPerPage: 10
    },
    footerProps: {
      'items-per-page-options': [10, 25, 50, 100, 500]
    },
    search: '',
    params: {},
    loading: false
  }),
  computed: {
    total () {
      return this.table.data ? this.table.total : 0
    }
  },
  watch: {
    options: 'fetchData'
  },
  methods: {
    async fetchData () {
      this.loading = true
      const { data } = await this.apiService.getAll(Object.assign(this.options, { search: this.search }, this.params))
      this.table = data
      this.loading = false
    }
  }
}
