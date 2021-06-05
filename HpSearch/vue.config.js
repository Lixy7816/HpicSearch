module.exports = {
  devServer: {
    proxy: {
      '/query': {
        target: 'http://loaclhost:8889',
        changOrigin: true
      },
      '/docmanager': {
        target: 'http://loaclhost:8889',
        changOrigin: true
      },
      '/usermanager': {
        target: 'http://loaclhost:8889',
        changOrigin: true
      }
    }
  }
}
