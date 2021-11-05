<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="majestic"
      :rules="nameRules"
      label="Majestic API Key"
      required
    ></v-text-field>

    <v-text-field
      v-model="smerush"
      :rules="nameRules"
      label="SEMrush API Key"
      required
    ></v-text-field>

    <!-- <v-select
      v-model="select"
      :items="items"
      :rules="[v => !!v || 'Item is required']"
      label="Item"
      required
    ></v-select> -->

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Save Settings
    </v-btn>
  </v-form>
</template>

<script>
import apiService from '@/services/setting.service'

export default {
  data: () => ({
    valid: true,
    smerush: '',
    majestic: '',
    nameRules: [
      v => !!v || 'Field is required'
    ]
  }),
  async created () {
    var data = await apiService.getSetting()
    this.smerush = data.data.smerush
    this.majestic = data.data.majestic
  },
  methods: {
    validate () {
      this.$refs.form.validate()
      apiService.saveSettings(this.smerush, this.majestic)
    }
  }
}
</script>
