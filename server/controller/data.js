// 引入数据服务模块

const dataService = require('../service/data');
const tagsService = require('../service/tag');

const { v4: uuidv4 } = require('uuid');

// 使用koa-bodyparser中间件来解析请求主体

/**
 * 新增数据接口处理函数
 * @param {Object} ctx - Koa上下文对象
 */
async function addData(ctx) {
  try {
    // console.log(ctx.request.body, '----');
    const { name = '', description = '', tags = [] } = ctx.request.body;
    if (!name || !description) {
      throw { status: 400, message: 'name或description不能为空' };
    }
    if (name.length > 20) {
      throw { status: 400, message: 'name长度不符合要求' };
    }
    const { data: tagData } = await tagsService.getTags();

    const allTagsId = tagData.map(item => item.id);
    console.log('allTagsId', allTagsId);

    if (tags.length > 0) {
      const isTagExist = tags.every(id => allTagsId.includes(id));
      if (!isTagExist) {
        throw { status: 400, message: '标签不存在' };
      }
    }
    const newData = {
      id: uuidv4(),
      name,
      description,
      time: Date.now(),
      tags,
    };
    // 调用服务模块的新增数据函数
    await dataService.addData(newData);
    // 封装返回数据格式
    const responseData = {
      code: 201,
      msg: '新增成功',
    };
    // 返回结果
    ctx.body = responseData;
  } catch (error) {
    throw error;
  }
}

/**
 * 数据查询接口处理函数
 * @param {Object} ctx - Koa上下文对象
 */
async function getData(ctx) {
  try {
    const {
      pageNo = 1,
      pageSize = 10,
      name,
      'tags[]': tags,
      startTime,
      endTime,
    } = ctx.request.query;
    // console.log('ctx.request.qury', ctx.request.query);
    // 调用数据服务模块的查询函数，根据条件查询数据
    const result = await dataService.getData(
      pageNo,
      pageSize,
      name,
      tags,
      startTime,
      endTime
    );
    // console.log('request', result);
    // 封装返回数据格式
    const responseData = {
      code: 200,
      msg: '查询成功',
      data: {
        pageInfo: {
          pageNo: parseInt(pageNo, 10),
          pageSize: parseInt(pageSize, 10),
          total: result.count,
        },
        dataInfo: result.data,
      },
    };

    // 返回结果
    ctx.body = responseData;
  } catch (error) {
    throw error;
  }
}

/**
 * 修改数据接口处理函数
 * @param {Object} ctx - Koa上下文对象
 */
async function editData(ctx) {
  try {
    console.log(ctx.request.body, '------');
    const { id, name, description, tags } = ctx.request.body;

    if (!id) {
      throw { status: 400, message: 'id不能为空' };
    }
    // 执行更新操作，这里假设你的数据库操作函数是 awaitable 的
    await dataService.editData(id, name, description, tags);
    const responseData = {
      code: 201,
      msg: '修改成功',
    };

    ctx.body = responseData;
  } catch (error) {
    console.error('数据更新失败', error);
    ctx.status = 500;
    ctx.body = { success: false, message: '数据更新失败' };
  }
}

/**
 * 删除数据接口处理函数
 * @param {Object} ctx - Koa上下文对象
 */
async function delData(ctx) {
  try {
    const { id } = ctx.request.query;
    if (!id) {
      throw { status: 400, message: 'id不能为空' };
    }
    // 调用标签服务模块的删除函数
    const result = await dataService.delData(id);
    // 封装返回数据格式
    const responseData = {
      code: 204,
      msg: '删除成功',
      data: result,
    };
    // 返回结果
    ctx.body = responseData;
  } catch (error) {
    // 处理错误情况
    throw error;
  }
}

// 导出接口处理函数
module.exports = {
  getData,
  addData,
  editData,
  delData,
};
