const tagsService = require('../service/tag');
const dataService = require('../service/data');

/**
 * 新增标签接口处理函数
 * @param {object} ctx - Koa 上下文对象
 */
async function addTag(ctx) {
  try {
    const { name } = ctx.request.body;

    if (!name) {
      throw { status: 400, message: 'name不能为空' };
    }

    if (name.length > 10) {
      throw { status: 400, message: 'name长度不能超过10个字符' };
    }

    await tagsService.addTag(name);

    const responseData = {
      code: 201,
      msg: '添加成功',
    };

    ctx.body = responseData;
  } catch (error) {
    throw error;
  }
}

/**
 * 标签查询接口处理函数
 * @param {object} ctx - Koa 上下文对象
 */
async function getTags(ctx) {
  try {
    const { data = [] } = await tagsService.getTags();

    const responseData = {
      code: 200,
      msg: '查询成功',
      data,
    };

    ctx.body = responseData;
  } catch (error) {
    throw error;
  }
}

/**
 * 修改标签接口处理函数
 * @param {object} ctx - Koa 上下文对象
 */
async function editTag(ctx) {
  try {
    const { id, name } = ctx.request.body;

    if (!id) {
      throw { status: 400, message: 'id不能为空' };
    }

    if (!name) {
      throw { status: 400, message: 'name不能为空' };
    }
    const { data } = await dataService.getData();

    const isThisIdWasUsed = data.some(item => item.tags.includes(id));

    if (isThisIdWasUsed) {
      throw { status: 400, message: '该标签已被使用，不能编辑' };
    }
    await tagsService.editTag(id, name);

    const responseData = {
      code: 201,
      msg: '修改成功',
    };

    ctx.body = responseData;
  } catch (error) {
    throw error;
  }
}

/**
 * 删除标签接口处理函数
 * @param {object} ctx - Koa 上下文对象
 */
async function delTag(ctx) {
  try {
    // console.log(ctx.request.query);
    const { 'id[]': ids } = ctx.request.query;
    // console.log(id);
    if (!ids) {
      throw { status: 400, message: 'id不能为空' };
    }
    if (Array.isArray(ids)) {
      // 批量删除
      const { data } = await dataService.getData();
      const { data: tags } = await tagsService.getTags();

      const tagsMap = {};
      tags.forEach(tag => {
        tagsMap[tag.id] = tag.name;
      });
      // const {} = await dataService.
      const usedTags = [];
      for (const id of ids) {
        const isThisIdWasUsed = data.some(item => item.tags.includes(id));
        if (isThisIdWasUsed) {
          usedTags.push(id);
        }
      }

      if (usedTags.length > 0) {
        const showTags = usedTags.map(item => tagsMap[item]);
        throw {
          status: 400,
          message: '以下标签已被使用，不能删除: ' + showTags.join(', '),
        };
      }

      const results = await Promise.all(ids.map(id => tagsService.delTag(id)));

      const responseData = {
        code: 204,
        msg: '批量删除成功',
        data: results,
      };

      ctx.body = responseData;
    } else {
      const { data } = await dataService.getData();

      const isThisIdWasUsed = data.some(item => item.tags.includes(ids));

      if (isThisIdWasUsed) {
        throw { status: 400, message: '该标签已被使用，不能删除' };
      }

      const result = await tagsService.delTag(ids);

      const responseData = {
        code: 204,
        msg: '删除成功',
        data: result,
      };
      ctx.body = responseData;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addTag,
  getTags,
  editTag,
  delTag,
};
