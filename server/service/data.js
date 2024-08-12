const dayjs = require('dayjs');
const { read, save } = require('../lib/util');
const FILE_NAME = 'data';
/**
 * 新增数据函数
 * @param {object} newData - 新数据对象
 */
async function addData(newData) {
  try {
    const dataList = await read(FILE_NAME);
    save([...dataList, newData], FILE_NAME);
  } catch (error) {
    throw error;
  }
}

/**
 * 查询数据函数
 * @param {number} pageNo - 页码
 * @param {number} pageSize - 每页数据数量
 * @param {string} name - 名称
 * @param {string[]} tags - 标签数组
 * @param {Date} startTime - 开始时间
 * @param {Date} endTime - 结束时间
 * @returns {object} - 包含查询结果的对象
 */
async function getData(pageNo, pageSize, name, tags, startTime, endTime) {
  try {
    // 读取data.json文件中的数据
    const dataList = read(FILE_NAME);
    let filteredData = dataList.reverse(); //倒叙排列

    // console.log('dataList', dataList);

    // 模糊查询 名字模糊查询
    if (name) {
      filteredData = filteredData.filter(item => item.name.includes(name));
    }
    // 根据名称进行过滤
    // 根据标签进行过滤
    if (tags) {
      if (!Array.isArray(tags)) tags = [tags];
      filteredData = filteredData.filter(item => {
        // console.log(item.tags);
        return tags.every(tag => item.tags.includes(tag));
      });
    }

    // 根据时间范围过滤
    if (startTime && endTime) {
      filteredData = filteredData.filter(item => {
        // const itemTime = dayjs(item.time).format('YYYY:MM:DD HH:mm:ss');
        const time = new Date(item.time);
        const itemStartTime = new Date(startTime);
        const itemEndTime = new Date(endTime);
        // console.log(time);
        // console.log(itemStartTime, itemEndTime);
        if (itemEndTime < itemStartTime) {
          throw { status: 400, message: '结束时间不能小于开始时间' };
        }
        return time >= itemStartTime && time <= itemEndTime;
      });
    }
    // console.log(filteredData);
    // 计算总数
    const count = filteredData.length;

    if (pageNo && pageSize) {
      // 根据分页信息进行分页
      const startIdx = (pageNo - 1) * pageSize;
      const endIdx = pageNo * pageSize;
      filteredData = filteredData.slice(startIdx, endIdx);
      // console.log(filteredData, '分页查询');
    }
    // 返回查询结果
    return { count, data: filteredData };
  } catch (error) {
    throw error;
  }
}

/**
 * 修改数据函数
 * @param {string} id - 数据ID
 * @param {string} name - 名称
 * @param {string} description - 描述
 * @param {string[]} tags - 标签数组
 */
/* eslint-disable */
async function editData(id, name, description, tags) {
  try {
    const dataList = read(FILE_NAME);

    const newDataList = dataList.map(item => {
      if (item.id === id) {
        item.name = name;
        item.description = description;
        item.tags = tags;
      }
      return item;
    });

    save(newDataList, FILE_NAME);
  } catch (error) {
    throw error;
  }
}

/**
 * 删除数据函数
 * @param {string} id - 数据ID
 */
async function delData(id) {
  try {
    const dataList = read(FILE_NAME);

    const isDataExists = dataList.some(data => data.id === id);
    // console.log(id, '---', isDataExists);
    if (!isDataExists) {
      throw { status: 400, message: '数据不存在' };
    }
    const newDataList = dataList.filter(data => data.id !== id);
    save(newDataList, FILE_NAME);
  } catch (error) {
    throw error;
  }
}

// 导出数据查询服务函数
module.exports = {
  getData,
  addData,
  editData,
  delData,
};
