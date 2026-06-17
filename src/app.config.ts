export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/body/index',
    'pages/process/index',
    'pages/archive/index',
    'pages/order/index',
    'pages/lacquer/index',
    'pages/body-register/index',
    'pages/work-detail/index',
    'pages/order-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8B2323',
    navigationBarTitleText: '漆艺工坊',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F0E8'
  },
  tabBar: {
    color: '#8B7355',
    selectedColor: '#8B2323',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '工作台'
      },
      {
        pagePath: 'pages/body/index',
        text: '胎体'
      },
      {
        pagePath: 'pages/process/index',
        text: '工序'
      },
      {
        pagePath: 'pages/archive/index',
        text: '档案'
      },
      {
        pagePath: 'pages/order/index',
        text: '订单'
      }
    ]
  }
})
