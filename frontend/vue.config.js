module.exports = {
  publicPath: './',
  devServer: {
    host: '127.0.0.1',
    port: 8089,
    //proxy: {
    //  '/api': {
    //    target: 'http://acmer.site/',
    //    pathRewrite: {
    //      //'^/api': '/'
    //    },
    //    changeOrigin: true
    //  }
    //}
    /*proxy:{
      '/api': {
        target : 'http://127.0.0.1:9000', //设置你调用的接口域名和端口号.别忘了加http
        changeOrigin : true, //允许跨域
        ws: true,
        pathRewrite : {
          '^/api':'/'
        // '‘这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替。
        // 比如我要调用’http://127.0.0.1:8000/index/’，直接写‘/api/index/’即可
        }
      }
    }, */
  },
 }