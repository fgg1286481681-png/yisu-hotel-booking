import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'

import './app.css'
import './styles/global.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('易宿酒店小程序启动')
    console.log('当前环境:', process.env.NODE_ENV)
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
