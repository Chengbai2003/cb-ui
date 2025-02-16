import { createApp } from 'vue'
import App from './App.vue'

import Icon from '@chengbai/components/icon'
import '@chengbai/theme-chalk/src/index.scss';
import Tree from '@chengbai/components/tree'
import Checkbox from '@chengbai/components/checkbox'
import Button from '@chengbai/components/button'
import Input from '@chengbai/components/input'
import { FormItem, Form} from '@chengbai/components/form'
import Upload from '@chengbai/components/upload'
import Calendar from '@chengbai/components/calendar'
import VirtualList from '@chengbai/components/virtual-scroll-list';

const plugins = [Icon, Tree, Checkbox, Button, Input, FormItem, Form, Upload, Calendar, VirtualList]

const app = createApp(App)
plugins.forEach(plugin => app.use(plugin))


app.mount('#app')
