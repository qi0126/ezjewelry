import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Tabs, Table, DatePicker, Radio, Spin } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import app from 'app';

import styles from './AccountMana.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

class AccountMana extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shopData: {},
      desData: {},
      factData: {},
      visibleShop: false,
      visibleDes: false,
      visiblePlat: false,
      loadingShop: false,
      loadingDes: false,
      loadingPlat: false,
      operations: '',
      proLoading: true, // 产品加载中属性

      // 当前页面
      shoCurrent: 1,
      desCurrent: 1,
      facCurrent: 1,

      // 当前type
      type: 'SHOP',
      tabKey: '1',

      shopCol: [{
        title: <span style={{ display: 'table', margin: '0 auto' }}>姓名</span>,
        dataIndex: 'realName',
        key: 'realName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>店铺名称</span>,
        dataIndex: 'nickName',
        key: 'nickName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>账号</span>,
        dataIndex: 'account',
        key: 'account',
      }, {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>实体店</span>,
        title: <span style={{ marginLeft: '0' }}>实体店</span>,
        dataIndex: 'storeNames',
        key: 'storeNames',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '有',
          value: '有',
        }, {
          text: '无',
          value: '无',
        }],
      }, {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
        title: <span style={{ marginLeft: '0' }}>申请时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '最近一天',
          value: '最近一天',
        }, {
          text: '最近一周',
          value: '最近一周',
        }, {
          text: '最近一月',
          value: '最近一月',
        }],
      },
      {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
        title: <span style={{ marginLeft: '0' }}>角色类型</span>,
        dataIndex: 'role',
        key: 'role',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '个人',
          value: 1,
        }, {
          text: '公司',
          value: 2,
        }],
        render: (text, record, index) => (
          <div>
            {text === 1 && <div>个人</div>}
            {text === 2 && <div>公司</div>}
          </div>
        ),
      },
      {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
        title: <span style={{ marginLeft: '0' }}>申请方式</span>,
        dataIndex: 'applyWay',
        key: 'applyWay',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '自主申请',
          value: 1,
        }, {
          text: '平台注册',
          value: 2,
        }],
        render: (text, record, index) => (
          <div>
            {text === 1 && <div>自主申请</div>}
            {text === 2 && <div>平台注册</div>}
          </div>
        ),
      },
      {
        title: <span style={{ display: 'table', margin: '0 auto' }}>权限到期时间</span>,
        dataIndex: 'powerTime',
        key: 'powerTime',
        onCellClick: (record, event) => { event.stopPropagation(); },
        render: (text, record, index) => (
          <div>
            <DatePicker style={{ width: 100 }} size="small" value={moment(text)} onChange={this.changeDate.bind(this, record, index)} />
          </div>
        ),
      },
      {
        title: <span style={{ display: 'table', margin: '0 auto' }}>审核状态</span>,
        dataIndex: 'audit',
        key: 'audit',
        render: (text, record, index) => (
          <div>
            {text === 0 && <span>未审核</span>}
            {text === 1 && <span>未审核</span>}
            {text === 2 && <span>已通过</span>}
            {text === 3 && <span>未通过</span>}
          </div>
        ),
      },
      {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>状态</span>,
        title: <span style={{ marginLeft: '38px' }}>操作</span>,
        dataIndex: 'statu',
        key: 'statu',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '启用',
          value: '0',
        }, {
          text: '禁用',
          value: '1',
        }],
        onCellClick: (record, event) => { event.stopPropagation(); },
        render: (text, record, index) => (
          <div>
            { <RadioGroup onChange={this.changeStatusModal.bind(this, record.id, text, index)} value={text}>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>禁用</Radio>
            </RadioGroup>}
          </div>
        ),
      }],

      desCol: [{
        title: <span style={{ display: 'table', margin: '0 auto' }}>申请人</span>,
        dataIndex: 'realName',
        key: 'realName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>地区</span>,
        dataIndex: 'countryName',
        key: 'countryName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>账号</span>,
        dataIndex: 'account',
        key: 'account',
      }, {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>个人品牌</span>,
        title: <span style={{ marginLeft: '0' }}>个人品牌</span>,
        dataIndex: 'brandNames',
        key: 'brandNames',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '有',
          value: '有',
        }, {
          text: '无',
          value: '无',
        }],
      }, {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
        title: <span style={{ marginLeft: '0' }}>申请时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '最近一天',
          value: '最近一天',
        }, {
          text: '最近一周',
          value: '最近一周',
        }, {
          text: '最近一月',
          value: '最近一月',
        }],
      },
      {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
        title: <span style={{ marginLeft: '0' }}>角色类型</span>,
        dataIndex: 'role',
        key: 'role',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '个人',
          value: 1,
        }, {
          text: '公司',
          value: 2,
        }],
        render: (text, record, index) => (
          <div>
            {text === 1 && <div>个人</div>}
            {text === 2 && <div>公司</div>}
          </div>
        ),
      },
      {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
        title: <span style={{ marginLeft: '0' }}>申请方式</span>,
        dataIndex: 'applyWay',
        key: 'applyWay',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '自主申请',
          value: 1,
        }, {
          text: '平台注册',
          value: 2,
        }],
        render: (text, record, index) => (
          <div>
            {text === 1 && <div>自主申请</div>}
            {text === 2 && <div>平台注册</div>}
          </div>
        ),
      },
      {
        title: <span style={{ display: 'table', margin: '0 auto' }}>权限到期时间</span>,
        dataIndex: 'powerTime',
        key: 'powerTime',
        onCellClick: (record, event) => { event.stopPropagation(); },
        render: (text, record, index) => (
          <div>
            <DatePicker size="small" value={moment(text)} onChange={this.changeDate.bind(this, record, index)} />
          </div>
        ),
      },
      {
        title: <span style={{ display: 'table', margin: '0 auto' }}>审核状态</span>,
        dataIndex: 'audit',
        key: 'audit',
        render: (text, record, index) => (
          <div>
            {text === 0 && <span>未审核</span>}
            {text === 1 && <span>未审核</span>}
            {text === 2 && <span>已通过</span>}
            {text === 3 && <span>未通过</span>}
          </div>
        ),
      },
      {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>状态</span>,
        title: <span style={{ marginLeft: '48px' }}>操作</span>,
        dataIndex: 'statu',
        key: 'statu',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '启用',
          value: '0',
        }, {
          text: '禁用',
          value: '1',
        }],
        onCellClick: (record, event) => { event.stopPropagation(); },
        render: (text, record, index) => (
          <div>
            { <RadioGroup onChange={this.changeStatusModal.bind(this, record.id, text, index)} value={text}>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>禁用</Radio>
            </RadioGroup>}
          </div>
        ),
      }],

      factCol: [{
        title: <span style={{ display: 'table', margin: '0 auto' }}>公司名称</span>,
        dataIndex: 'nickName',
        key: 'nickName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>申请人</span>,
        dataIndex: 'realName',
        key: 'realName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>制造类型</span>,
        dataIndex: 'produceType',
        key: 'produceType',
      }, {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
        title: <span style={{ marginLeft: '20px' }}>申请时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '最近一天',
          value: '最近一天',
        }, {
          text: '最近一周',
          value: '最近一周',
        }, {
          text: '最近一月',
          value: '最近一月',
        }],
      },
      {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
        title: <span style={{ marginLeft: '20px' }}>角色类型</span>,
        dataIndex: 'role',
        key: 'role',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '个人',
          value: 1,
        }, {
          text: '公司',
          value: 2,
        }],
        render: (text, record, index) => (
          <div>
            {text === 1 && <div>个人</div>}
            {text === 2 && <div>公司</div>}
          </div>
        ),
      },
      {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
        title: <span style={{ marginLeft: '20px' }}>申请方式</span>,
        dataIndex: 'applyWay',
        key: 'applyWay',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '自主申请',
          value: 1,
        }, {
          text: '平台注册',
          value: 2,
        }],
        render: (text, record, index) => (
          <div>
            {text === 1 && <div>自主申请</div>}
            {text === 2 && <div>平台注册</div>}
          </div>
        ),
      },
      {
        title: <span style={{ display: 'table', margin: '0 auto' }}>权限到期时间</span>,
        dataIndex: 'powerTime',
        key: 'powerTime',
        onCellClick: (record, event) => { event.stopPropagation(); },
        render: (text, record, index) => (
          <div>
            <DatePicker size="small" value={moment(text)} onChange={this.changeDate.bind(this, record, index)} />
          </div>
        ),
      },
      {
        title: <span style={{ display: 'table', margin: '0 auto' }}>审核状态</span>,
        dataIndex: 'audit',
        key: 'audit',
        render: (text, record, index) => (
          <div>
            {text === 0 && <span>未审核</span>}
            {text === 1 && <span>未审核</span>}
            {text === 2 && <span>已通过</span>}
            {text === 3 && <span>未通过</span>}
          </div>
        ),
      },
      {
        // title: <span style={{ display: 'table', margin: '0 auto' }}>审核状态</span>,
        title: <span style={{ marginLeft: '40px' }}>操作</span>,
        dataIndex: 'statu',
        key: 'statu',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '启用',
          value: '0',
        }, {
          text: '禁用',
          value: '1',
        }],
        onCellClick: (record, event) => { event.stopPropagation(); },
        render: (text, record, index) => (
          <div>
            { <RadioGroup onChange={this.changeStatusModal.bind(this, record.id, text, index)} value={text}>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>禁用</Radio>
            </RadioGroup>}
          </div>
        ),
      }],

    };
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalIndex/platAccountSave',
      payload: this.state,
    });
  }

  componentDidMount() {
    this.getInitData();
  }

  async getInitData() {
    if (JSON.stringify(this.props.stashProps) === '{}') {
      // this.setState({
      //   proLoading: true,
      // });
      await this.getshopData(1);
      await this.getdesignerData(1);
      await this.getfactoryData(1);
    }
    await Object.assign(this.state, this.props.stashProps);
    await this.changeTab(this.state.tabKey);
    await this.setState({});
  }


  // 设置权限时间 begin
  changeDate(item, index, e) {
    let refType;
    const time = e.format('YYYY-MM-DD');
    const params = {
      id: item.id,
      type: this.state.type,
      time,
    };
    if (this.state.type === 'SHOP') {
      refType = 'shopData';
    } else if (this.state.type === 'DESIGNER') {
      refType = 'desData';
    } else if (this.state.type === 'FACTORY') {
      refType = 'factData';
    }
    app.$api.userEditAuthTime(params).then((res) => {
      this.state[refType].data[index].powerTime = e;
      this.setState({
        [refType]: this.state[refType],
      });
    });
  }
  // 设置权限时间 end

  // 店铺筛选

  // 转换ctype字段筛选 1, 2 个人公司  1, 2 自己平台
  changeCtype(role, applyWay) {
    let ctype,
      roleWay;
    role = (role && role[0] !== ' ') ? role[0] : 0,
    applyWay = (applyWay && applyWay[0] !== ' ') ? applyWay[0] : 0;
    roleWay = `${role}${applyWay}`;
    if (roleWay === '10') {
      ctype = 5;
    } else if (roleWay === '20') {
      ctype = 6;
    } else if (roleWay === '01') {
      ctype = 7;
    } else if (roleWay === '02') {
      ctype = 8;
    } else if (roleWay === '11') {
      ctype = 1;
    } else if (roleWay === '21') {
      ctype = 2;
    } else if (roleWay === '12') {
      ctype = 3;
    } else if (roleWay === '22') {
      ctype = 4;
    }
    return {
      ctype,
    };
  }

  // 转换ctype字段展示 1, 2 个人公司  1, 2 自己平台
  getCtype(item) {
    let role,
      applyWay;
    const { ctype } = item;
    if (ctype === 1) {
      role = 1;
      applyWay = 1;
    } else if (ctype === 2) {
      role = 2;
      applyWay = 1;
    } else if (ctype === 3) {
      role = 1;
      applyWay = 2;
    } else if (ctype === 4) {
      role = 2;
      applyWay = 2;
    }
    return {
      role,
      applyWay,
    };
  }

  // 实体店过滤
  filterShop(pagina, filters) {
    const { storeNames, createTime, statu, role, applyWay } = filters;
    const { ctype } = this.changeCtype(role, applyWay);
    const params = {
      store: storeNames && storeNames[0],
      state: statu && statu[0],
      time: createTime && createTime[0],
      ctype,
    };
    if (storeNames && storeNames[0] === ' ') {
      delete params.store;
    }
    const funName = `get${this.state.type.toLowerCase()}Data`;
    this[funName](pagina.current, params);
  }


  // 设计师筛选
  filterDes(pagina, filters) {
    const { brandNames, createTime, statu, role, applyWay } = filters;
    const { ctype } = this.changeCtype(role, applyWay);
    const params = {
      brand: brandNames && brandNames[0],
      state: statu && statu[0],
      time: createTime && createTime[0],
      ctype,
    };
    if (brandNames && brandNames[0] === ' ') {
      delete params.brand;
    }
    const funName = `get${this.state.type.toLowerCase()}Data`;
    this[funName](pagina.current, params);
  }

  // 供应商筛选
  filterFact(pagina, filters) {
    const { createTime, statu, role, applyWay } = filters;
    const { ctype } = this.changeCtype(role, applyWay);
    const params = {
      state: statu && (statu.length > 1 ? '' : statu[0]),
      time: createTime && (createTime.length > 1 ? '' : createTime[0]),
      ctype,
    };
    const funName = `get${this.state.type.toLowerCase()}Data`;
    this[funName](pagina.current, params);
  }

  // 获取店铺数据
  getshopData(num, otherParams) {
    this.setState({
      proLoading: true,
    });
    const params = {
      page: num,
      row: 10,
    };
    otherParams && Object.assign(params, otherParams);
    return app.$api.shopList(params).then((res) => {
      if (res.data.data) {
        res.data.data.forEach((item) => {
          const { role, applyWay } = this.getCtype(item);
          item.role = role;
          item.applyWay = applyWay;
          item.createTime = app.$tool.day(item.createTime).format('YYYY-MM-DD');
          item.storeNames = item.storeName !== '无' ? '有' : '无';
        });
      }

      this.setState({
        shoCurrent: num,
        shopData: res.data,
        proLoading: false,
      });
    });
  }

  // 获取设计师数据
  getdesignerData(num, otherParams) {
    this.setState({
      proLoading: true,
    });
    const params = {
      page: num,
      row: 10,
    };
    otherParams && Object.assign(params, otherParams);
    return app.$api.designList(params).then((res) => {
      if (res.data.data) {
        res.data.data.forEach((item) => {
          const { role, applyWay } = this.getCtype(item);
          item.role = role;
          item.applyWay = applyWay;
          item.createTime = app.$tool.day(item.createTime).format('YYYY-MM-DD');
          item.countryName = this.changeCityName(item.country);
          item.brandNames = '无';
          if (item.brandName !== '无') {
            item.brandNames = '有';
          }
        });
      }
      this.setState({
        desCurrent: num,
        desData: res.data,
        proLoading: false,
      });
    });
  }

  // 获取供应商数据
  getfactoryData(num, otherParams) {
    this.setState({
      proLoading: true,
    });
    const params = {
      page: num,
      row: 10,
    };
    otherParams && Object.assign(params, otherParams);
    return app.$api.factoryList(params).then((res) => {
      if (res.data.data) {
        res.data.data.forEach((item) => {
          const { role, applyWay } = this.getCtype(item);
          item.role = role;
          item.applyWay = applyWay;
          item.createTime = app.$tool.day(item.createTime).format('YYYY-MM-DD');
        });
      }
      this.setState({
        facCurrent: num,
        factData: res.data,
        proLoading: false,
      });
    });
  }

  changeCityName(country) {
    if (country) {
      app.$tool.country.forEach((item) => {
        if (item.cityEndName === country) {
          country = item.cityName;
        }
      });
      return country;
    }
  }


  // 点击确定
  handleOkShop() {
    this.setState({
      loadingShop: true,
    });
  }

  handleOkDes() {
    this.setState({
      loadingDes: true,
    });
  }
  handleOkPlat() {
    this.setState({
      loadingPlat: true,
    });
  }

  // 点击返回
  handleCancel() {
    this.setState({
      visibleShop: false,
      visibleDes: false,
      visiblePlat: false,
    });
  }

  changeTab(e) {
    if (e === '2') {
      this.setState({
        type: 'DESIGNER',
        tabKey: '2',
        operations: <Button type="primary" onClick={this.createDesigner.bind(this)}>创建设计师帐号</Button>,
      });
    } else if (e === '3') {
      this.setState({
        type: 'FACTORY',
        tabKey: '3',
        operations: <Button type="primary" onClick={this.createPlatform.bind(this)}>创建供应商帐号</Button>,
      });
    } else {
      this.setState({
        type: 'SHOP',
        tabKey: '1',
        operations: <Button type="primary" onClick={this.createShop.bind(this)}>创建店铺帐号</Button>,
      });
    }
  }

  // 切换状态
  changeStatusModal(id, e, index) {
    const self = this;
    let typeName = '',
      typeStatu = '';

    // 改变文字
    if (this.state.type === 'SHOP') {
      typeName = '店铺';
    } else if (this.state.type === 'DESIGNER') {
      typeName = '设计师';
    } else if (this.state.type === 'FACTORY') {
      typeName = '供应商';
    }

    if (e === 0) {
      typeStatu = '禁用';
    } else if (e === 1) {
      typeStatu = '启用';
    }

    confirm({
      title: '提示?',
      content: `确定要${typeStatu}${typeName}吗？`,
      onOk() {
        self.changeStatus(id, e, index);
      },
      onCancel() {},
    });
  }


  changeStatus(id, e, index) {
    let statu,
      refType;
    if (e === 1) {
      statu = 0;
    } else if (e === 0) {
      statu = 1;
    }
    const params = {
      id,
      type: this.state.type,
      statu,
    };

    if (this.state.type === 'SHOP') {
      refType = 'shopData';
    } else if (this.state.type === 'DESIGNER') {
      refType = 'desData';
    } else if (this.state.type === 'FACTORY') {
      refType = 'factData';
    }
    app.$api.userEnaOrDisa(params).then((res) => {
      this.state[refType].data[index].statu = statu;
      this.setState({
        [refType]: this.state[refType],
      });
    });
  }

  // 创建模块
  createDesigner() {
    const data = {
      handle: 'new',
    };
    const path = {
      pathname: '/platformMana/accountMana/createDesigner',
      state: data,
    };
    this.context.router.push(path);
  }

  createPlatform() {
    const data = {
      handle: 'new',
    };
    const path = {
      pathname: '/platformMana/accountMana/createPlat',
      state: data,
    };
    this.context.router.push(path);
  }

  createShop() {
    const data = {
      handle: 'new',
    };
    const path = {
      pathname: '/platformMana/accountMana/createShop',
      state: data,
    };
    this.context.router.push(path);
  }

  // 点击店铺审核弹窗
  rowClickShop(e, index, event) {
    event.stopPropagation();

    const data = {
      handle: 'edit',
      backData: e,
    };
    const path = {
      pathname: '/platformMana/accountMana/createShop',
      state: data,
    };
    this.context.router.push(path);
  }

  // 点击设计师审核弹窗
  rowClickDes(e, index) {
    const data = {
      handle: 'edit',
      backData: e,
    };
    const path = {
      pathname: '/platformMana/accountMana/createDesigner',
      state: data,
    };
    this.context.router.push(path);
  }

  // 点击平台审核弹窗
  rowClickPlat(e, index) {
    const data = {
      handle: 'edit',
      backData: e,
    };
    const path = {
      pathname: '/platformMana/accountMana/createPlat',
      state: data,
    };
    this.context.router.push(path);
  }

  // 单元格样式
  rowClass() {
    return styles.rowClass;
  }

  render() {
    const { tabKey, shoCurrent, desCurrent, facCurrent } = this.state;
    return (
      <div className={styles.accountMana} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>帐户管理</div>
            {/* <div className={styles.searchBox}>
              <Input style={{ width: 300 }} size="large" placeholder="输入供应商名称查询" />
              <Button className={styles.btn} type="primary">搜索</Button>
            </div> */}
          </div>
          <Tabs tabBarExtraContent={this.state.operations} activeKey={tabKey} onTabClick={this.changeTab.bind(this)} style={{ paddingBottom: 100 }}>
            <TabPane tab="店铺" key="1" >
              <div className={styles.tableWrap}>
                <div className={styles.table}>
                  <Spin size="large" spinning={this.state.proLoading}>
                    <Table
                      onRowClick={this.rowClickShop.bind(this)}
                      rowClassName={this.rowClass}
                      dataSource={this.state.shopData.data}
                      columns={this.state.shopCol}
                      bordered
                      onChange={this.filterShop.bind(this)}
                      pagination={{
                        total: this.state.shopData.rowSize,
                        defaultPageSize: 10,
                        current: shoCurrent,
                      }}
                    />
                  </Spin>
                </div>
              </div>
            </TabPane>
            <TabPane tab="设计师" key="2">
              <div className={styles.tableWrap}>
                <div className={styles.table}>

                  <Spin size="large" spinning={this.state.proLoading} >
                    <Table
                      onRowClick={this.rowClickDes.bind(this)}
                      rowClassName={this.rowClass}
                      dataSource={this.state.desData.data}
                      columns={this.state.desCol}
                      bordered
                      onChange={this.filterDes.bind(this)}
                      pagination={{
                        total: this.state.desData.rowSize,
                        defaultPageSize: 10,
                        current: desCurrent,
                      }}
                    />
                  </Spin>
                </div>
              </div>
            </TabPane>
            <TabPane tab="供应商" key="3">
              <div className={styles.tableWrap}>
                <div className={styles.table}>
                  <Spin size="large" spinning={this.state.proLoading} >
                    <Table
                      onRowClick={this.rowClickPlat.bind(this)}
                      rowClassName={this.rowClass}
                      dataSource={this.state.factData.data}
                      columns={this.state.factCol}
                      bordered
                      onChange={this.filterFact.bind(this)}
                      pagination={{
                        total: this.state.factData.rowSize,
                        defaultPageSize: 10,
                        current: facCurrent,
                      }}
                    />
                  </Spin>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>

      </div>
    );
  }

}


AccountMana.propTypes = {

};

AccountMana.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    stashProps: state.globalIndex.platAccountProps,
  };
};

export default connect(mapStateToProps)(AccountMana);

