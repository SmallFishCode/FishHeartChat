// 提交登录信息
const postUserInfo = (ctx) => {
    console.log(ctx);
    ctx.body = 'success'
}

module.exports = {
    postUserInfo
}