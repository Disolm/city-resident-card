import './assets/styles/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import {clickOutside} from '@/directive/clickOutside'
// @ts-ignore
import VirtualList from 'vue3-virtual-scroll-list'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('clickOutside', clickOutside)
app.component('VirtualList', VirtualList);

app.mount('#app')
