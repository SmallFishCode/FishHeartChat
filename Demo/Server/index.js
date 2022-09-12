// 引入依赖
const koa = require("koa2");
// 初始化koa
const app = new koa();
// 开启 http
var http = require("http").createServer(app.callback());
// 初始化 io
var io = require('socket.io')(http, { cors: true });
// router
const router = require('./Router');
const PORT = 3333;

// 处理跨域 
const cors = require('koa2-cors');// 配置中间件
app.use(cors, '*')
// 实例化koa 之后的代码如下：
// app.use(cors({
//   origin: function(ctx) { //设置允许来自指定域名请求
//     if (ctx.url === '/test') {
//       return '*'; // 允许来自所有域名请求
//     }
//     return 'http://localhost:5173'; //只允许http://localhost:8081这个域名的请求
//    },
//    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
//    credentials: true, //是否允许发送Cookie
//    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
//    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
//    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
//   }))



// 通过app.use启用路由,其他中间件也由app.use启用
app.use(router.routes(), router.allowedMethods());

let mesPer = {}
let userArrUn = []



// socket
io.on('connection', (socket) => {
  

  socket.on('userInfo', (params,userArr) => {
    console.log(userArrUn);
    if (userArrUn.includes(params.userName)) {
      socket.emit('error')
    } else {

      
     
      

      

      userArrUn.push(params.userName)
      console.log(userArrUn, 'after');
      io.emit('userArr', userArrUn)
      mesPer = {
        mes: params.userName + ' into FishChat!',
        userName: params.userName
      }
      io.emit('into', mesPer)
      io.emit('sysInto', mesPer)
    }
  })
  socket.on('perRemove', (userName, userArr) => {
    userArrUn.forEach((item, index) => {
      if (item === userName) {
        userArrUn.splice(index, 1)
      }
    })
    console.log(userArrUn, 'after');
    mesPer.mes = userName   + ' leave FishChat!'
    io.emit('leave', mesPer ) 
    io.emit('userArr', userArrUn)
    io.emit('sysOut', mesPer)
  })
  socket.on('sendData', (data, un) => {
      io.emit('everybody', data,un);
  })
  socket.on('init', (userName) => { 
    if (userArrUn.length) {
      userArrUn.forEach((item, index) => {
        if (item === userName) {
          userArrUn.splice(index, 1)
        }
      })
      io.emit('userArr', userArrUn)
    }
    console.log(userArrUn, 'after');
  })

   

  // 心跳检测包
  let timer = null, heartTime = null
  socket.on('hert', (userName, time) => {
    console.log('心跳检测包');

      clearTimeout(timer)
      timer = setTimeout(() => {
        userArrUn.forEach((item, index) => {
          if (item === userName) {
            userArrUn.splice(index, 1)
            socket.emit('error')
          }
        })
        io.emit('userArr', userArrUn)
      }, time)

      clearInterval(heartTime)
      let HeartCount = 59

      // 心跳检测滴答钟
      heartTime = setInterval(() => {
        socket.emit('hertTime', HeartCount)
        HeartCount--
        if (HeartCount === 0) {
          clearInterval(heartTime)
        }
      }, 1000)
    
  })

  
  
});




http.listen(PORT, () => {
  console.log('listening on :3333');
});