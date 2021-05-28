import Vue from 'vue'
// import { Button } from 'element-ui'
// //按需导入
// import { Form , FormItem} from 'element-ui'
// import { Input } from 'element-ui'

// //导入弹框提示警告
// import { Message } from 'element-ui'

//优化组件按需导入
import {Button, Form , FormItem , Input , Message} from "element-ui"


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
