import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import './styles/main.css'

import App from './App.vue'

const vuetify = createVuetify()

createApp(App).use(vuetify).mount('#app')
