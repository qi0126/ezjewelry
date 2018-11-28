import tool from './api/tool.js';
import { cityJson, icons } from './api/tool.js';
import http from './api/http.js';
import storage from './api/storage.js';
import api from './api/api.js';
import validate from './utils/validate.js';
import mockjs from 'mockjs';

// const prod = require('../config/prod.env');
// const dev = require('../config/dev.env');
// process.env.NODE_ENV = 1;
console.log(process.env.NODE_ENV);


// console.log(prod);
// console.log(dev);

class App {
  constructor() {
    this.$tool = tool;
    this.$storage = storage;
    this.$http = http;
    this.$api = api;
    this.$v = validate;
    this.$m = mockjs;
  }

}

const app = new App();

// this.$http = http;

export default app;

