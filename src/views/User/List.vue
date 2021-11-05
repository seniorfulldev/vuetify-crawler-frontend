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
        confirm-title="Delete User"
        confirm-message="Are you sure you want to delete the user?"
        @close="close"
        @confirm="confirm"
      >
        <v-dialog v-model="dialog.form" persistent max-width="500">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on">
              New User
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

          <v-form ref="form" lazy-validation @submit.prevent="submit">
            <v-card :loading="busy">
              <v-card-title>
                {{ editedIndex === -1 ? 'New User' : 'Edit User' }}
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.name"
                      :rules="[validation.required]"
                      validate-on-blur
                      label="Username"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.email"
                      :rules="[validation.required, validation.email]"
                      :error-messages="errors.email"
                      validate-on-blur
                      label="Email"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="editedIndex === -1">
                  <v-col>
                    <v-text-field
                      v-model="editedItem.password"
                      :rules="[validation.required]"
                      label="Password"
                      validate-on-blur
                      type="password"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.confirm_password"
                      :rules="[validation.passwordMatch(editedItem.confirm_password, editedItem.password)]"
                      validate-on-blur
                      label="Confirm password"
                      type="password"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.first_name"
                      :rules="[validation.required]"
                      validate-on-blur
                      label="First name"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.last_name"
                      :rules="[validation.required]"
                      validate-on-blur
                      label="Last name"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                     <v-text-field
                      v-model="editedItem.phone"
                      label="Phone number"
                    />
                  </v-col>
                  <v-col>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.majestic.limit"
                      label="Majestic API Limit"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.semrush.limit"
                      label="SEMrush API Limit"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.clearout.limit"
                      label="Clearout API Limit"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.hunterio.limit"
                      label="Hunter.io API Limit"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="editedItem.keyword"
                      label="Keywords Credit"
                    />
                  </v-col>
                  <v-col>
                  </v-col>
                </v-row>
                <v-checkbox
                  v-model="editedItem.roles"
                  false-value="user"
                  true-value="admin"
                  hide-details
                  label="Administrator"
                  color="primary"
                  class="mt-0"
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
     </table-header>
    </template>

    <template v-slot:item.majestic="{ item }">
      {{item.majestic.used}}/{{item.majestic.limit}}
      <v-progress-linear :value="item.majestic.used/item.majestic.limit*100"></v-progress-linear>
    </template>

    <template v-slot:item.semrush="{ item }">
      {{item.semrush.used}} / {{item.semrush.limit}}
      <v-progress-linear :value="item.semrush.used/item.semrush.limit*100"></v-progress-linear>
    </template>

    <template v-slot:item.clearout="{ item }">
      {{item.clearout.used}} / {{item.clearout.limit}}
      <v-progress-linear :value="item.clearout.used/item.clearout.limit*100"></v-progress-linear>
    </template>

    <template v-slot:item.hunterio="{ item }">
      {{item.hunterio.used}} / {{item.hunterio.limit}}
      <v-progress-linear :value="item.hunterio.used/item.hunterio.limit*100"></v-progress-linear>
    </template>

    <template v-slot:item.roles="{ item }">
      <v-chip v-if="item.roles=='admin'" small color="primary">Yes</v-chip>
      <v-chip v-if="item.roles=='user'" small>No</v-chip>
    </template>

    <template v-slot:item._id="{ item }">
      {{table.data.map(function(x) {return x._id; }).indexOf(item._id) + 1}}
    </template>

    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="viewItem(item)">
        {{ icons.mdiPencil }}
      </v-icon>

      <v-icon small @click="deleteItem(item)">
        {{ icons.mdiDelete }}
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import apiService from '@/services/user.service'
import tableMixin from '@/mixins/table.mixin'
import crudMixin from '@/mixins/crud.mixin'

export default {
  mixins: [tableMixin, crudMixin],
  data: () => ({
    headers: [
      { text: '#', value: '_id', align: 'left', sortable: false },
      { text: 'Username', value: 'name' },
      { text: 'Majestic API', value: 'majestic' },
      { text: 'SEMrush API', value: 'semrush' },
      { text: 'Clearout API', value: 'clearout' },
      { text: 'Hunter.io API', value: 'hunterio' },
      { text: 'Keywords Credit', value: 'keyword' },
      { text: 'Administrator', value: 'roles' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    defaultItem: {
      roles: 'user',
      majestic: {
        limit: 100,
        used: 0
      },
      semrush: {
        limit: 100,
        used: 0
      },
      clearout: {
        limit: 100,
        used: 0
      },
      hunterio: {
        limit: 100,
        used: 0
      },
      keyword: 0
    },
    apiService
  }),
  methods: {
    submit () {
      if (!this.$refs.form.validate()) {
        return
      }
      this.save(this.editedItem)
    }
  }
}
</script>
