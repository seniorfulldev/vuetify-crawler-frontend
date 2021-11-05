import Vue from 'vue'
import numeral from 'numeral'

Vue.filter('currency', (value, currency = '$') => {
  return numeral(value).format(currency + '0,0.00')
})
