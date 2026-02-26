import type { UserConfigExport } from "@tarojs/cli"

// 开发环境使用本地 Mock 服务器
// 如果是真机测试，改为电脑的局域网 IP，如：'http://192.168.1.x:3001'
export default {
  defineConstants: {
    API_BASE_URL: JSON.stringify('http://localhost:3001')
  },
  mini: {},
  h5: {}
} satisfies UserConfigExport<'vite'>
