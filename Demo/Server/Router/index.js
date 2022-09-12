/**
 * router.js
 * 路由回调函数单独抽出,不在router中操作业务逻辑，方便维护
*/

const router = require('koa-router')();
const controllers = require('./controllers')


router
    // 提交登录信息
  .post('/user', controllers.postUserInfo)




module.exports = router