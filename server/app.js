const Koa = require('koa');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const {historyApiFallback} = require('koa2-connect-history-api-fallback');
const routes = require('./router');

const app = new Koa();
app.use(historyApiFallback())

// 全局异常处理 解决什么
process.on('uncaughtException', (err, origin) => {
  console.log(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

// 静态资源目录，
app.use(serve('../client/build'));
// 解析请求体
app.use(koaBody());

// // use historyApiFallback

// 统一接口错误处理
app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.response.status === 404 && !ctx.response.body) {
      ctx.throw(404);
    }
  } catch (error) {
    const { url = '' } = ctx.request;
    const { status = 500, message } = error;
    if (url.startsWith('/api')) {
      ctx.status = typeof status === 'number' ? status : 500;
      ctx.body = {
        msg: message,
      };
    }
    // 不以api开头的接口接口返回的http:localhost:3001/


  }
});


// 加载数据路由
app.use(routes.routes());

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
