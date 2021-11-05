<template>
  <v-form lazy-validation ref="form" @submit.prevent="onSubmit">
    <v-card class="mx-auto" max-width="400">
      <v-card-title>
        Login
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="form.username"
          :rules="[validation.required, validation.email]"
          :prepend-inner-icon="icons.mdiAccount"
          validate-on-blur
          label="Email"
        />

        <v-text-field
          v-model="form.password"
          :rules="[validation.required]"
          :prepend-inner-icon="icons.mdiKey"
          validate-on-blur
          label="Password"
          type="password"
        />

        <v-checkbox
          v-model="rememberMe"
          color="primary"
          label="Remember me"
          hide-details
        />
      </v-card-text>

      <v-card-actions>
        <v-btn :loading="isLoading" type="submit" block color="primary">
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    form: {
      username: '',
      password: ''
    },
    rememberMe: false,
    isLoading: false
  }),
  methods: {
    async onSubmit () {
      if (!this.$refs.form.validate()) {
        return
      }

      this.isLoading = true
      const redirect = this.$auth.redirect()

      try {
        await this.$auth.login({
          data: this.form,
          rememberMe: this.rememberMe,
          redirect: redirect ? redirect.from.path : '/',
          fetchUser: true
        })
      } catch (err) {
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
