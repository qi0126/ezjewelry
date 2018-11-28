import axios from 'axios';
import querystring from 'qs';
import storage from './storage';
import { message } from 'antd';
// import { browserHistory } from 'react-router';
import app from 'app';


// const tesetURL = 'http://192.168.21.122:8880';// 陈祥林
// const tesetURL = 'http://192.168.21.111:8080';// 海生
// const tesetURL = 'http://192.168.21.185/ezjewelry/'; // xwh
// const tesetURL = 'http://192.168.21.163:8880';// 白贻波接口服务
const tesetURL = 'http://192.168.16.18:8082';// 心杰接口服务
// const tesetURL = 'https://m.ezgold.cn';// 心杰

const testImgURL = 'http://192.168.16.103:9999/';// 图片服务器地址

const env = process.env.NODE_ENV;

// const imgURL = env === 'development' ? testImgURL : 'https://image.ezgold.cn/';
// const URL = env === 'development' ? tesetURL : 'http://m.ezgold.cn/';

// 开发环境
const imgURL = testImgURL;
const URL = tesetURL;

// 生产环境
// const imgURL = 'https://image.ezgold.cn/';
// const URL = 'http://m.ezgold.cn/';

// 配置axios
const instance = axios.create({
  // baseURL: process.env.API_HOST,
  baseURL: URL,
  timeout: 20000,
});
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截器
instance.interceptors.request.use((config) => {
  config.headers.Authorization = app.$storage.get('accessToken');
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 返回拦截器
instance.interceptors.response.use((response) => {
  if (!response.status === 200) {
    // 请求失败
    message.error('服务器繁忙，请重试');
  }
  if (response.data.code === 203) {
    // browserHistory.push('/#/login');
    location.replace('/#/login');
    return response;
  }
  // if (response.data.code !== 200) {
  //   message.error(response.data.msg);
  //   return Promise.reject(response.data.msg);
  // }
  return response;
}, (error) => {
  message.error('服务器繁忙，请重试');
  return Promise.reject(error);
});


// 自定义拦截器
const interceptorsCustom = (res, resolve, reject, isToast) => {
   // 是否显示自定义tost
  if (res.data.code !== 200) {
    if (isToast) {
      reject(res.data);
    } else {
      message.error(res.data.msg);
      reject(res.data);
    }
  }
  resolve(res.data);
};


const handleForm = (formData) => {
  for (const [key, value] of formData.entries()) {
    if (value === 'undefined') {
      formData.delete(key);
    }
  }

  if (formData.entries().next().value === undefined) {
    console.log(formData.entries().next());
    return false;
  }
  return true;
};

// 封装参数
const buildURL = (url, needToken) => {
  if (!needToken) {
    return url;
  }
  const accessToken = storage.get('accessToken');
  if (!accessToken) {
    return false;
  }
  return `${url + (url.indexOf('?') >= 0 ? '&' : '?')}access_token=${accessToken}`;
};

export default {
  instance,
    /**
     *  图片地址
     */
  imgURL,

    /**
     *  接口地址
     */
  URL,

    /**
     * GET请求
     *
     * @param {*} needToken 是否需要凭证
     * @param {*} url 请求地址
     * @param {*} callback  回调函数
     * @param {*} param 请求参数
     */
  get(needToken, url, params, isToast) {
    // url = buildURL(url, needToken);

    // if (!url) {
    //   return;
    // }
    const data = {
      params,
    };
    return new Promise((resolve, reject) => {
      instance.get(url, data).then((res) => {
        interceptorsCustom(res, resolve, reject, isToast);
      }).catch((err) => {
        reject(err);
      });
    });
  },

    /**
     * POST请求
     *
     * @param {*} needToken 是否需要凭证
     * @param {*} url 请求地址
     * @param {*} params 请求参数
     */
  post(needToken, url, params, isToast) {
    // console.log(arguments);

    // url = buildURL(url, needToken);
    // if (!url) {
    //   return;
    // }

    const config = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    };
    return new Promise((resolve, reject) => {
      instance.post(url, querystring.stringify(params)).then((res) => {
        interceptorsCustom(res, resolve, reject, isToast);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  /**
 * POST请求
 *
 * @param {*} needToken 是否需要凭证
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 */
  postJson(needToken, url, params, isToast) {
    // url = buildURL(url, needToken);

    // if (!url) {
    //   return;
    // }

    return new Promise((resolve, reject) => {
      instance.post(url, params).then((res) => {
        interceptorsCustom(res, resolve, reject, isToast);
      }).catch((err) => {
        reject(err);
      });
    });
  },

    /**
     * 文件上传
     *
     * @param {*} needToken 是否需要凭证
     * @param {*} url 地址
     * @param {*} formData 表单数据
     * @param {*} callback 回调
     * @param {*} showToast 显示提示
     */
  upload(needToken, url, formData, isToast) {
    url = buildURL(url, needToken);
    if (!url) {
      return;
    }
    // 验证form
    if (!handleForm(formData)) {
      return Promise.resolve();
    }
    const config = {
      headers: {
        'Content-Type': 'multiple/form-data',
      },
    };
    return new Promise((resolve, reject) => {
      instance.post(url, formData).then((res) => {
        interceptorsCustom(res, resolve, reject, isToast);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};
