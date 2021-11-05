import Vue from 'vue'
import {
  mdiAccount,
  mdiLogout,
  mdiAccountMultiple,
  mdiRecycle,
  mdiKey,
  mdiHome,
  mdiCalendar,
  mdiMagnify,
  mdiCreditCardOutline,
  mdiPencil,
  mdiDelete,
  mdiDownload,
  mdiArchive,
  mdiPlay,
  mdiPause,
  mdiDebugStepOver,
  mdiSettingsOutline,
  mdiEye,
  mdiKeyboard,
  mdiRefresh,
  mdiEyeOff,
  mdiCalendarCheckOutline,
  mdiChartMultiple,
  mdiUpload,
  mdiCardPlusOutline
} from '@mdi/js'

const validation = {
  required: value => !!value || 'Required value',
  email: value => {
    const pattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return !value || pattern.test(value) || 'Invalid email.'
  },
  phone: value => {
    const pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/
    return !value || pattern.test(value) || 'Invalid phone number.'
  },
  decimal: value => {
    const pattern = /^[1-9]\d*(.\d+)?$/
    return !value || pattern.test(value) || 'Invalid value.'
  },
  price: value => {
    const pattern = /^\d+(\.\d{1,2})?$/
    return !value || pattern.test(value) || 'Invalid value.'
  },
  passwordMatch: (value, valueMatched) => {
    return value === valueMatched || 'Confirm password does not match new password.'
  }
}

const icons = {
  mdiAccount,
  mdiRefresh,
  mdiLogout,
  mdiAccountMultiple,
  mdiRecycle,
  mdiKey,
  mdiHome,
  mdiCalendar,
  mdiMagnify,
  mdiCreditCardOutline,
  mdiPencil,
  mdiDelete,
  mdiDownload,
  mdiArchive,
  mdiPlay,
  mdiPause,
  mdiDebugStepOver,
  mdiSettingsOutline,
  mdiCalendarCheckOutline,
  mdiEye,
  mdiKeyboard,
  mdiEyeOff,
  mdiChartMultiple,
  mdiUpload,
  mdiCardPlusOutline
}

Vue.mixin({
  data: () => ({
    validation,
    icons
  })
})
