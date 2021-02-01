import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/defaultSettings'

// base library
import './directives/action'

Vue.use(VueStorage, config.storageOptions)
