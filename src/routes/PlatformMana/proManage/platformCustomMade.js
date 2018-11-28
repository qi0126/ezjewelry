import React from 'react';
import { connect } from 'dva';
import { router } from 'react-router';
import PropTypes from 'prop-types';
import styles from './platformCustomMade.less';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select, Checkbox, message, Form, InputNumber, Popconfirm, Pagination, Tabs, Spin } from 'antd';


import Swiper from 'react-id-swiper';

const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Column, ColumnGroup } = Table;// 表格属性
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const tableState = {
  // bordered: true,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
};
const tableData = [
  {
    key: 'PT950',
    name: '3.45g',
    age: '￥2366.00',
    address: '￥3100.00~￥3888.00',
    priceOne: '￥2366.00',
  },
  {
    key: '18K金',
    name: '3.45g',
    age: '￥2366.00',
    address: '￥3100.00~￥3888.00',
    priceOne: '￥2366.00',
  },
];
// const swiperParams = {
//   slidesPerView: 4,
//   spaceBetween: 30,
//   centeredSlides: true,
//   shouldSwiperUpdate: true,
//   pagination: {
//     el: '.swiper-pagination',
//     clickable: true,
//   },
//   navigation: {
//     nextEl: '.swiper-button-next',
//     prevEl: '.swiper-button-prev',
//   },
// };

const proListData = [{}];
let proSelectEdList = [];

class proManage extends React.Component {

  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      categoryList: [], // 产品分类接口数据
      categoryValue: '', // 产品分类选中信息
      crowdList: [], // 适合人群接口数据
      crowdValue: '', // 适合人群选中信息
      proDataList: [], // 产品接口数据
      proViewModalTF: false, // 产品详细弹窗
      proViewId: '', // 弹窗显示产品详细的ID
      proViewDetail: {}, // 弹窗显示产品详细的资料
      proImgBigUrl: '', // 弹窗显示产品详细第一张产品图片
      proImgList: [], // 弹窗显示产品详细所有产品图片
      designsListOne: [], // 款式数组
      pageIndex: 1, // 当前页
      pageSize: 12, // 每页展示条数
      totalNum: '', // 总条数
      // proSelectEdList: [], // 产品选择数组
      checkAll: false, // 产品全选/反选
      // indeterminate: true, // 产品全选/反选
      addGroundModalTF: false, // 发布上架弹窗
      cancelGroundModalTF: false, // 取消上架弹窗
      // 修改框架
      proSizeList: [{ value: '' }], // 产品款式尺寸
      imgDisplayList: [], // 图片示意图
      materList: [], // 材质列表
      facAllList: [], // 全部供应商，
      desAllList: [], // 全部设计师，
      companyId: '', // 选择设计师ID.
      designer: 'N', // 产品类型,供应商，设计师
      onSale: '', // 空为全部，Y为上架 N下架
      classifyId: '', // 分类id
      designerId: '', // 设计师id
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgData: {}, // 上传返回3D图包数组
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
      proLoading: true, // 产品加载中属性
      editPriceTf: false, // 产品规格编辑状态
    };
    // 定义全局变量方法
  }
  componentDidMount() {

    // 查询产品数据信息
    this.setState({
      proLoading: true,
      proDataList: this.getlist(1, 12),
    });
    // app.$api.selectPlatformProductInfo().then((res) => {
    //   this.setState({
    //     proDataList: res.data,
    //   });
    // });

        // 查询所有设计师
    app.$api.designAll().then((res) => {
      const tempData = res.data;
      this.setState({
        desAllList: tempData,
      });
      // console.log(res.data);
    });

            // 查询所有供应商
    app.$api.factoryAll().then((res) => {
      const tempData = res.data;
      this.setState({
        facAllList: tempData,
      });
    });

    // 查询分类数据信息
    app.$api.queryClassifyInfo().then((res) => {
      const tempData = res.data;
      tempData.unshift({ classifyId: '', cname: '全部' });
      this.setState({
        categoryList: res.data,
      });
    });

    // 查询材质数据信息
    app.$api.selectGoldlist().then((res) => {
      this.setState({
        materList: res.data,
      });
    });

    // 查询适合人群数据信息
    app.$api.selectCrowdNumber().then((res) => {
      this.setState({
        crowdList: res.data,
      });
    });
  }

  // proSelectChange(checkedValues) {
  //   console.log('checked = ', checkedValues);
  //   proSelectEdList = checkedValues;
  //   console.log(proSelectEdList);

  // }
  // 全选/反选
  // onCheckAllChange = (e) => {
  //   const allSelectList = [];
  //   this.state.proDataList.forEach((ielem) => {
  //     allSelectList.push(ielem.productId);
  //   });
  //   this.setState({
  //     proSelectEdList: e.target.checked ? allSelectList : [],
  //     // indeterminate: false,
  //     checkAll: e.target.checked,
  //   });
  // }


  // 全选/反选
  onCheckAllChange = (e) => {
    // console.log('全选择');
    // console.log(e);
    const self = this;
    self.setState({
      checkAll: e.target.checked,
    });
    self.state.proDataList.forEach((item, ind) => {
      item.checked = e.target.checked;
    });
    self.setState(() => ({
      proDataList: self.state.proDataList,
    }), () => {
      self.getProdId(e.target.checked);
    });
    // console.log(self.state.proDataList);
  }

  // 全选获取产品id
  getProdId = (res) => {
    proSelectEdList = [];
    if (res) {
      this.state.proDataList.forEach((tip) => {
        if (tip.productStatus != 3) {
          proSelectEdList.push(tip.productId);
        }
      });
    }
    // console.log('总数量id');
    // console.log(proSelectEdList);
  }

  // 单选
  singleElection = (e) => {
    // console.log('单选');
    // console.log(e);
    // // console.log(item.checked);
    // console.log(this.state.proDataList);
    const self = this;
    this.state.proDataList.forEach((item) => {
      if (e.target.value == item.productId) {
        item.checked = e.target.checked;
      }
    });
    this.setState(() => ({
      proDataList: [...this.state.proDataList],
    }), () => {
      console.log('进来');
      console.log(e.target.checked);
      this.passiveAllCheck();
      if (e.target.checked) {
        // console.log('选中');
        // console.log(proSelectEdList);
        const result = proSelectEdList.includes(e.target.value);
        if (!result) {
          proSelectEdList.push(e.target.value);
        }
        console.log('新数组1');
        console.log(proSelectEdList);
      } else {
        let numIndex = '';
        proSelectEdList.forEach((pop, index) => {
          if (pop == e.target.value) {
            numIndex = index;
          }
        });
        if (!isNaN(numIndex)) {
          // console.log('删除');
          proSelectEdList.splice(numIndex, 1);
        }
        // console.log('新数组2');
        // console.log(numIndex);
        // console.log(proSelectEdList);
      }
    });


  }

  // 被动全选
  passiveAllCheck = () => {

    const arrPrud = [];
    this.state.proDataList.forEach((sigle) => {
      if (sigle.productStatus != 3) {
        arrPrud.push(sigle);
      }
    });

    const resutl = arrPrud.every((it) => {
      return it.checked == true;
    });

    this.setState({
      checkAll: resutl,
    });
  }


  // 打开产品详细资料+弹窗
  showModal(elem) {
    const self = this;

    // console.log(elem);
    const tempSkuDouList = [];
    const tempSkuManList = [];
    const tempSkuWomanList = [];
    elem.skuPages.forEach((ielem) => {
      // console.log(ielem.skuProps[0]);
      switch (ielem.skuProps[0].parentPropValue) {
        case '对戒':
          tempSkuDouList.push(ielem);
          break;
        case '男戒':
          tempSkuManList.push(ielem);
          break;
        case '女戒':
          tempSkuWomanList.push(ielem);
          break;
      }
    });
    elem.skuList = [];
    if (tempSkuDouList.length != 0) {
      elem.skuList.push({ skuName: '对戒', skuSList: tempSkuDouList });
    }
    if (tempSkuManList.length != 0) {
      elem.skuList.push({ skuName: '男戒', skuSList: tempSkuManList });
    }
    if (tempSkuWomanList.length != 0) {
      elem.skuList.push({ skuName: '女戒', skuSList: tempSkuWomanList });
    }

    this.setState({
      proImgList: elem.picUrl.split(','),
      proImgBigUrl: elem.picUrl.split(',')[0],
      proViewDetail: elem,
      proViewModalTF: true,
      proViewId: elem,
      threeDImgDisplayTf: false,
      tempOneDis: true,
      editPriceTf: false,
    });

    if (elem.picUrl.split(',').length >= 3) {
      self.setState({
        ModelAmount: 3,
      });
    } else {
      self.setState({
        ModelAmount: elem.picUrl.split(',').length,
      });
    }

    // loopStatu
    if (elem.picUrl.split(',').length == 1) {
      self.setState({
        loopStatu: false,
      });
    } else {
      self.setState({
        loopStatu: true,
      });
    }
    // console.log('产品数据');
    elem.manufactureProps.forEach((ielem) => {
      // console.log(ielem);
      ielem.sizeList = ielem.propValue.split(',');
    });
    console.log(elem);

  }


  handleCancel(self) {
    self.setState({
      proViewModalTF: false,
      addGroundModalTF: false,
      cancelGroundModalTF: false,
    });
  }
  // 修改产品弹出框
  modifyPro(thiselem) {
    const tempDesignValue = thiselem.state.proViewDetail.designs[0].designValue.split(',');
    const tempProSizeList = [];
    for (let i = 0; i < tempDesignValue.length; i++) {
      tempProSizeList.push({ value: tempDesignValue[i] });
    }
    thiselem.setState({
      proViewModalTF: false,
      proSizeList: tempProSizeList,
    });

    thiselem.state.imgDisplayList = thiselem.state.proViewDetail.images;

  }
  // 添加尺寸
  addProSize(thiselem) {
    const tempProSizeList = this.state.proSizeList;
    tempProSizeList.push({ value: '0' });
    thiselem.setState({
      proSizeList: tempProSizeList,
    });
  }
  // 添加材质
  addProMater(self) {
    // console.log(self);
    // console.log(self.state.proViewDetail.textures);
    self.state.proViewDetail.textures.push(
      { textureId: '',
        texturePrice: '0-0',
        textureWeight: '0-0' },
    );
    self.setState({
      proViewDetail: self.state.proViewDetail,
    });
    console.log(self.state);
  }
  newProSubmit = (e) => {
    const self = this;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // if (!err) {
      //   console.log('Received values of form: ', values);
      // }
      const proSizeList = [];// 款式尺寸数组
      const proMaterListTwo = [];// 产品材质/重量/价格遍历数组
      for (const i in values) {
        // 款式尺寸遍历
        if (i.indexOf('size_') >= 0) {
          proSizeList.push(values[i]);
        }
        // 产品材质/重量/价格遍历
        if (i.indexOf('proMaxWeight_') >= 0) {
          const indexNum = i.split('_')[1];
          const proMinWeight = values[`proMinWeight_${indexNum}`];
          const proMaxWeight = values[`proMaxWeight_${indexNum}`];
          const proMinPrice = values[`proMinPrice_${indexNum}`];
          const proMaxPrice = values[`proMaxPrice_${indexNum}`];
          const materId = values[`materId_${indexNum}`];
          proMaterListTwo.push({ textureId: materId, textureName: '', textureWeight: `${proMinWeight}-${proMaxWeight}`, texturePrice: `${proMinPrice}-${proMaxPrice}` });
        }
      }
      self.state.productStr.categoryId = values.categoryId; // 分类ID
      self.state.productStr.crowdId = values.crowdId; // 适合人群ID
      self.state.productStr.productName = values.productName; // 款式名称
      self.state.productStr.productDescription = values.productDescription; // 宝石描述

      self.state.productStr.designs[0].designValue = proSizeList.join(','); // 款式尺寸
      self.state.productStr.stonePrice = values.stonePrice;// 宝石价格
      self.state.productStr.wagePrice = values.wagePrice;// 生产工费
      self.state.productStr.imageIdFroms = this.state.imgDisplayList;// 生产工费
      self.state.productStr.textures = proMaterListTwo;// 产品材质/重量/价格遍历數組
      // console.log(self.state.productStr);
      const params = { productStr: JSON.stringify(self.state.productStr) };
      // 提交新产品参数
      app.$api.addProductNumber(params).then((res) => {
        self.context.router.push('/MyFactory/manageFinishProduct');
      });

    });
  };
  newProSubmit = (e) => {
    const self = this;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // if (!err) {
      //   console.log('Received values of form: ', values);
      // }
      const proSizeList = [];// 款式尺寸数组
      const proMaterListTwo = [];// 产品材质/重量/价格遍历数组
      for (const i in values) {
        // 款式尺寸遍历
        if (i.indexOf('size_') >= 0) {
          proSizeList.push(values[i]);
        }
        // 产品材质/重量/价格遍历
        if (i.indexOf('proMaxWeight_') >= 0) {
          const indexNum = i.split('_')[1];
          const proMinWeight = values[`proMinWeight_${indexNum}`];
          const proMaxWeight = values[`proMaxWeight_${indexNum}`];
          const proMinPrice = values[`proMinPrice_${indexNum}`];
          const proMaxPrice = values[`proMaxPrice_${indexNum}`];
          const materId = values[`materId_${indexNum}`];
          proMaterListTwo.push({ textureId: materId, textureName: '', textureWeight: `${proMinWeight}-${proMaxWeight}`, texturePrice: `${proMinPrice}-${proMaxPrice}` });
        }
      }
      self.state.productStr.categoryId = values.categoryId; // 分类ID
      self.state.productStr.crowdId = values.crowdId; // 适合人群ID
      self.state.productStr.productName = values.productName; // 款式名称
      self.state.productStr.productDescription = values.productDescription; // 宝石描述

      self.state.productStr.designs[0].designValue = proSizeList.join(','); // 款式尺寸
      self.state.productStr.stonePrice = values.stonePrice;// 宝石价格
      self.state.productStr.wagePrice = values.wagePrice;// 生产工费
      self.state.productStr.imageIdFroms = this.state.imgDisplayList;// 生产工费
      self.state.productStr.textures = proMaterListTwo;// 产品材质/重量/价格遍历數組
      // console.log(self.state.productStr);

      // 提交新产品参数
      const params = { productStr: JSON.stringify(self.state.productStr) };
      // 提交新产品参数
      app.$api.addProductNumber(params).then((res) => {
        self.context.router.push('/MyFactory/manageFinishProduct');
      });

    });
  };
    // 改变款式类型，0为全部，1为供应商款，2为设计师款
  changeProDes(e, thiselem) {
      // console.log(e);
    this.setState(() => ({
      designer: e,
      designerId: '',
      seriecsId: '',
      companyId: '',
      pageIndex: 1,
      pageSize: 12,
    }), () => {
      this.getlist(1, 12);
    });
  }
  getlist = (page, rows) => {
    const self = this;
    self.setState({
      proLoading: true,
    });
    const params = {
      designer: self.state.designer,
      companyId: this.state.companyId,
      onSale: this.state.onSale,
      productStatus: this.state.productStatus,
      classifyId: this.state.classifyId,
      page,
      rows,
    };
    app.$api.getplatformProductsStore(params).then((res) => {
      self.setState({
        proDataList: res.data.data,
        totalNum: res.data.rowSize,
        proLoading: false,
      });
    });
  }
      // 改变供应商
  changeFacSelect=(e) => {
    const self = this;
    this.setState(() => ({
      companyId: e,
      designerId: '',
      seriecsId: '',
      pageIndex: 1,
      pageSize: 12,
    }), () => {
      this.getlist(1, 12);
    });
  }
    // 改变设计师
  changeDesSelect=(e) => {
    const self = this;
      // console.log(this.state.brandType);
      // console.log(e);
    this.state.desAllList.forEach((item) => {
      if (item.designerId == e) {
        if (item.seriecs) {
          this.setState({
            seriecsId: '',
            SeriecsAllList: item.seriecs,
          });
        } else {
          this.setState({
            seriecsId: '',
            SeriecsAllList: '',
          });
        }
      }
    });
    this.setState(() => ({
      companyId: e,
      pageIndex: 1,
      pageSize: 12,
    }), () => {
      this.getlist(1, 12);
    });
  }

  // 改变状态
  changeStatus(e, thiselem) {
    thiselem.setState(() => ({
      pageIndex: 1,
      pageSize: 12,
      onSale: e,
    }), () => {
      this.getlist(1, 12);
    });
  }
  // 改变类别事件
  changeCate(e, thiselem) {
    thiselem.setState(() => ({
      pageIndex: 1,
      pageSize: 12,
      classifyId: e,
    }), () => {
      this.getlist(1, 12);
    });

  }

  // 打开‘发布上架’按钮
  addGround(thiselem) {
    if (proSelectEdList.length != 0) {
      const params = { productIds: JSON.stringify(proSelectEdList), onSale: 'Y' };
      app.$api.platformupdateSaleStatu(params).then((res) => {
        message.success('产品发布上架成功，正在刷新页面');
        thiselem.setState(() => ({
          // pageIndex: 1,
          // pageSize: 12,
          checkAll: false,
        }), () => {
          this.getlist(this.state.pageIndex, this.state.pageSize);
          proSelectEdList = [];
        });
      });
    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }

  // 打开‘取消上架’按钮
  cancelGround(thiselem) {
    if (proSelectEdList.length != 0) {
      const params = { productIds: JSON.stringify(proSelectEdList), onSale: 'N' };
      app.$api.platformupdateSaleStatu(params).then((res) => {
        message.success('产品取消上架成功，正在刷新页面');
        thiselem.setState(() => ({
          // pageIndex: 1,
          // pageSize: 12,
          checkAll: false,
        }), () => {
          this.getlist(this.state.pageIndex, this.state.pageSize);
          proSelectEdList = [];
        });
      });
    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }

  // 删除产品
  delPro(thiselem) {
    if (proSelectEdList.length != 0) {
      const tempProList = [];
      thiselem.state.proDataList.forEach((ielem, ind) => {
        proSelectEdList.forEach((jelem) => {
          if (ielem.productId == jelem) {
            if (ielem.onSale == 'R') {
              tempProList.push(ielem.productId);
            }
          }
        });
      });
      if (tempProList.length != 0) {
        const params = { productIds: JSON.stringify(tempProList) };
        app.$api.deleteProductByPlatform(params).then((res) => {
          message.success('产品删除成功，正在刷新页面');
          this.setState(() => ({
            checkAll: false,
            pageIndex: 1,
          }), () => {
            this.getlist(this.state.pageIndex, this.state.pageSize);
            proSelectEdList = [];
          });
        });
      } else {
        message.error('抱歉，已上架的产品不能删除！');
      }

    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }
  // 分页
  onShowSizeChange = (current, pageSize) => {
    this.setState({
      pageSize,
      pageIndex: 1,
      checkAll: false,
    }, () => {
      this.getlist(1, pageSize);
      proSelectEdList = [];
    });
  }

  onChangPage = (page, pageSize) => {
    // console.log(page, pageSize);
    this.setState(() => ({
      pageIndex: page,
      checkAll: false,
    }), () => {
      this.getlist(page, pageSize);
      proSelectEdList = [];
    });
  }
  // 编辑sku价格，变输入框
  editSku = (elem, index) => {
    const self = this;
    // console.log(elem);
    // console.log(index);

    // console.log(self.state.proViewDetail);
    // console.log(self.state.proViewDetail.skuPages[`${index}`]);
    self.setState({
      editPriceTf: true,
    });
  }
    // 编辑sku价格，变输入框
  saveSku = () => {
    const self = this;
    self.props.form.validateFields((err, values) => {
      // console.log(values);
      // console.log(self.state.proViewDetail);
      let skusList = [];
      if (self.state.proViewDetail.classifyName != '对戒') {
      // 非对戒
      // 供应商编辑sku
        if (self.state.proViewDetail.designer == 'N') {
          // if (!values[`saleOne_${index}`]) {
          //   message.error('平台批发价不能为空，请重新输入！');
          //   return;
          // }
          skusList = [];
          self.state.proViewDetail.skuPages.forEach((ielem, ind) => {
            // console.log(ielem);
            skusList.push({
              skuId: ielem.skuId,
              wholesalePrice: values[`saleOne_${ind}`],
            });
          });
          const params = {
            skus: JSON.stringify(skusList),
            designer: 'N',
          };
          app.$api.updatePriceByPlatform(params).then((res) => {
            self.setState(() => ({
              pageIndex: 1,
              pageSize: 12,
              proViewModalTF: false,
            }), () => {
              self.getlist(1, 12);
            });
          });
        }
      // 设计师编辑sku
        if (self.state.proViewDetail.designer == 'Y') {
          skusList = [];
          self.state.proViewDetail.skuPages.forEach((ielem, ind) => {
            skusList.push({
              skuId: ielem.skuId,
              wholesalePrice: values[`saleDesTwo_${ind}`],
              saleBybulkPricr: values[`saleDesOne_${ind}`],
            });
          });
          const params = {
            skus: JSON.stringify(skusList),
            designer: 'Y',
          };
          app.$api.updatePriceByPlatform(params).then((res) => {
            self.setState(() => ({
              pageIndex: 1,
              pageSize: 12,
              proViewModalTF: false,
            }), () => {
              self.getlist(1, 12);
            });
          });
        // console.log(values);
        }
      } else {
        // 对戒
        // console.log(values);
        // 供应商编辑sku
        if (self.state.proViewDetail.designer == 'N') {
          skusList = [];
          self.state.proViewDetail.skuPages.forEach((ielem, ind) => {
            skusList.push({
              skuId: ielem.skuId,
              wholesalePrice: values[`wholesalePrice_${ind}`],
            });
          });
          const params = {
            skus: JSON.stringify(skusList),
            designer: 'N',
          };
          app.$api.updatePriceByPlatform(params).then((res) => {

            self.setState(() => ({
              pageIndex: 1,
              pageSize: 12,
              proViewModalTF: false,
            }), () => {
              self.getlist(1, 12);
            });
          });
        }
        // 设计师编辑sku
        if (self.state.proViewDetail.designer == 'Y') {
          skusList = [];
          self.state.proViewDetail.skuPages.forEach((ielem, ind) => {
            skusList.push({
              skuId: ielem.skuId,
              wholesalePrice: values[`wholesalePrice_${ind}`],
              saleBybulkPricr: values[`saleBybulkPricr_${ind}`],
            });
          });
          const params = {
            skus: JSON.stringify(skusList),
            designer: 'Y',
          };
          app.$api.updatePriceByPlatform(params).then((res) => {
            self.getlist(self.state.pageIndex, self.state.pageSize);
            setTimeout(() => {
              self.state.proDataList.forEach((ielem, ind) => {
                if (ielem.productCode === self.state.proViewDetail.productCode) {
                  self.setState({
                    proViewDetail: ielem,
                  }, () => {
                    message.success('修改价格成功！');
                    self.setState({
                      editPriceTf: false,
                    });
                  });
                }
              });
            }, 200);
          });
        }
      }

    });
    // self.setState({
    //   editPriceTf: false,
    //   proViewDetail: self.state.proViewDetail,
    // });

  }  // 编辑sku价格，变输入框
  editSkuTwo = (elem, ind) => {
    const self = this;
    self.setState({
      editPriceTf: true,
      editSkuTwo: true,
    });
  }

  //   // 编辑对戒sku价格，变输入框
  // saveSkuTwo = (elem, ind) => {
  //   const self = this;
  //   // console.log(index);
  //   // console.log(self.state.proViewDetail);
  //   self.props.form.validateFields((err, values) => {

  //       // 对戒
  //       // 供应商编辑sku
  //     if (self.state.proViewDetail.designer == 'N') {
  //         // if (!values[`minPrice_${index}`]) {
  //         //   message.error('对戒的零售价不能为空，请重新输入！');
  //         //   return;
  //         // }
  //       const params = {
  //         skuId: elem.skuId,
  //         wholesalePrice: values[`wholesalePrice_${ind}`],
  //         designer: 'N',
  //       };
  //       elem.wholesalePrice = values[`wholesalePrice_${ind}`];
  //       app.$api.updatePriceByPlatform(params).then((res) => {
  //         message.success('Sku修改价格成功！');
  //         self.setState({
  //           proViewDetail: self.state.proViewDetail,
  //         });
  //       });
  //     }
  //       // 设计师编辑sku
  //     if (self.state.proViewDetail.designer == 'Y') {
  //         // if (!values[`minPrice_${index}`] || !values[`maxPrice_${index}`]) {
  //         //   message.error('对戒的零售价不能为空，请重新输入！');
  //         //   return;
  //         // }
  //       const params = {
  //         skuId: elem.skuId,
  //         wholesalePrice: values[`wholesalePrice_${ind}`],
  //         saleBybulkPricr: values[`saleBybulkPricr_${ind}`],
  //         designer: 'Y',
  //       };
  //       elem.wholesalePrice = values[`wholesalePrice_${ind}`];
  //       elem.saleBybulkPricr = values[`saleBybulkPricr_${ind}`];
  //         // console.log(self.state.proViewDetail);
  //       app.$api.updatePriceByPlatform(params).then((res) => {
  //         message.success('Sku修改价格成功！');
  //         self.setState({
  //           proViewDetail: self.state.proViewDetail,
  //         });
  //       });
  //     // console.log(values);
  //     }
  //   });
  //   self.setState({
  //     editPriceTf: true,
  //     proViewDetail: self.state.proViewDetail,
  //   });

  // }
  // 改变供应商平台批发价事件
  changeSaleOne(e, indexNum) {
  }


    // 产品详情页‘发布上架’按钮
  addProGround=() => {
    const params = { productIds: JSON.stringify([this.state.proViewDetail.productId]), onSale: 'Y' };
    app.$api.platformupdateSaleStatu(params).then((res) => {
      message.success('产品发布上架成功，正在刷新页面');
      this.setState(() => ({
        pageIndex: 1,
        pageSize: 12,
        proViewModalTF: false,
      }), () => {
        this.getlist(1, 12);
      });
    });
  }

    // 产品详情页‘取消上架’按钮
  cancelProGround=() => {
    const params = { productIds: JSON.stringify([this.state.proViewDetail.productId]), onSale: 'N' };
    app.$api.platformupdateSaleStatu(params).then((res) => {
      message.success('产品取消上架成功，正在刷新页面');
      this.setState(() => ({
        pageIndex: 1,
        pageSize: 12,
        proViewModalTF: false,
      }), () => {
        this.getlist(1, 12);
      });
    });
  }


  // 3D图包点击显示3D图包，隐藏产品图片
  threeDImgDisplay = () => {
    const self = this;
    // console.log(self.state.proViewDetail)

    self.setState({
      threeDImgDisplayTf: true,
    }, () => {
      if (self.state.tempOneDis) {
        self.threeDImgDisplayFun();
      }
    });
  }
  // 3D图包点击显示3D图包，隐藏产品图片
  threeDImgDisplayFun=() => {
    const self = this;
      // 3D图包加载开始
    const params = {
      productId: self.state.proViewDetail.productId,
    };
    app.$api.selectThreeDUrl(params).then((res) => {
      let tempImgList = [];
      // console.log(app.$http.imgURL)
      // console.log(tempImgList)
      if (res.data.length > 0) {
        for (let i = res.data.length - 1; i >= 0; i--) {
          tempImgList.push(app.$http.imgURL + res.data[i]);
        }
      } else {
        tempImgList = [];
      }
      self.setState({
        threeDImgOne: { imgUrl: tempImgList[(res.data.length - 1)] },
        threeDImgList: tempImgList,
        tempOneDis: false,
      }, () => {
        $(this.refs.threeDImg).threesixty({ images: this.state.threeDImgList, method: 'click', cycle: 1, auto: 'true' });
      });
    });
    // 3D图包加载结束
  }
  render() {
    const self = this;
    const { getFieldDecorator } = self.props.form;
    const { pageIndex, pageSize, totalNum } = this.state;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };
    const formItemTwo = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };
    const imgLis = () => {
      const self = this;
      if (self.state.proImgList) {
        const lis = self.state.proImgList.map((item) => {
          return (
            <img src={app.$http.imgURL + item} className={styles.imgSmall} />
          );
        });
        return lis;
      }
    };

    const swiperParams = {
      slidesPerView: this.state.ModelAmount,
      shouldSwiperUpdate: true,
      loop: this.state.loopStatu,
      // noSwiping:true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      on: {
        slideChange: (index) => {
          const spans = $$('.swiper-pagination').find('span');
          for (let i = 0; i < spans.length; i++) {
            const result = $$(spans[i]).is('.swiper-pagination-bullet-active');
            if (result) {
              self.setState(() => ({
                pictureIndex: i,
                proImgBigUrl: self.state.proImgList[i],
                threeDImgDisplayTf: false,
                tempOneDis: true,
              }));

            }
          }
        },
      },
    };

    const swiperLi = (proImgList) => {
      return (
        <Swiper {...swiperParams} className={styles.swiperDiv}>
          {proImgList.map((data, index) => {
            return (
              <div className={styles.imgWrap} key={index}>
                <img src={app.$http.imgURL + data} className={styles.imgSmall} key={index} />
              </div>
            );
          })}
        </Swiper>
      );
    };

    return (
      <div className={styles.proManage}>
        <div className={styles.tit}>钻石定制款管理
          <span className={styles.titSubName}>
            <span className={styles.marginLeft30}>
              类别：
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => self.changeCate(event, self)}>
                <Option value="">全部</Option>
                {this.state.categoryList.map(data =>
                  <Option value={data.classifyId}>{data.cname}</Option>,
                )}
              </Select>
            </span>
            <span className={styles.marginLeft30}>
              状态：
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => self.changeStatus(event, self)}>
                <Option value="">全部</Option>
                <Option value="Y">已上架</Option>
                <Option value="N">未上架</Option>
              </Select>
            </span>
            <span className={styles.marginLeft30}>
              款式来源：
              <Select defaultValue="N" style={{ width: 120 }} onChange={event => this.changeProDes(event)}>
                <Option value="N">供应商上传</Option>
                <Option value="Y">设计师上传</Option>
              </Select>
              {this.state.designer == 'N' ?
                <Select defaultValue="全部供应商" style={{ width: 120, marginLeft: 10 }} onChange={event => self.changeFacSelect(event)}>
                  <Option value="">全部供应商</Option>
                  {this.state.facAllList.map(data =>
                    <Option value={data.id}>{data.realName}</Option>,
                  )}
                </Select>
                 : ''
              }
              {this.state.designer == 'Y' ?
                <span>
                  <Select defaultValue="全部设计师" style={{ width: 120, marginLeft: 10 }} onChange={event => self.changeDesSelect(event)}>
                    <Option value="">全部设计师</Option>
                    {this.state.desAllList.map(data =>
                      <Option value={data.id}>{data.realName}</Option>,
                    )}
                  </Select>
                </span>
                : ''
              }
            </span>
          </span>
        </div>
        <div className={styles.hr} />
        <div>
          <Row>
            <Col span={12} />
            <Col span={12} className={styles.textRight}>
              <Checkbox
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >全选</Checkbox>
              <Popconfirm title="确定取消上架所选产品?" onConfirm={() => self.cancelGround(self)} okText="确定取消上架" cancelText="取消">
                <Button type="primary" className={styles.marginLeft30}>取消上架</Button>
              </Popconfirm>
              <Popconfirm title="确定发布上架所选产品?" onConfirm={() => self.addGround(self)} okText="确定上架" cancelText="取消">
                <Button type="primary" className={styles.marginLeft30}>发布上架</Button>
              </Popconfirm>
              <span style={{ marginRight: 20 }}>
                <Popconfirm placement="topRight" title="确定删除所选产品？" onConfirm={() => self.delPro(self)} okText="确定删除" cancelText="取消">
                  <img src="./images/delPro.png" />
                </Popconfirm>
              </span>
            </Col>
          </Row>
        </div>
        <div className={styles.hr} />
        <div>
          <div className="gutter-example">
            <Spin size="large" spinning={this.state.proLoading} >
              <Row gutter={16}>
                <div style={{ width: '100%' }}>
                  {this.state.proDataList.length == 0 ?
                    <div className={styles.noProImgDiv}>
                      <img src="./images/noProPng.png" />
                      <div>暂无您要的产品哦！</div>
                    </div>
                : ''}
                  {this.state.proDataList.map((ielem) => {
                    return (
                      <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                          <div className={styles.pro} >
                            <div>
                              <span className={styles.imgTopTxt} onClick={() => self.showModal(ielem)} >
                                {ielem.onSale == 'Y' ?
                                '已上架'
                                :
                                ''
                              }
                              </span>
                              {ielem.onSale == 'R' ? <div className={styles.underFrame} onClick={() => self.showModal(ielem)} >已下架</div> : ''}
                              <div className={styles.imgTop} >
                                <Checkbox value={ielem.productId} checked={ielem.checked} onChange={this.singleElection} />
                              </div>
                              <img src={app.$http.imgURL + ielem.sPicUrl} onClick={() => self.showModal(ielem)} />
                            </div>
                            <div className={styles.proDisplay} onClick={() => self.showModal(ielem)}>
                              <p className={styles.proName}>{ielem.productName}</p>
                              <p className={styles.proPrice}>批发价：{ielem.suggestSale}</p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}

                </div>
              </Row>
            </Spin>
            <Modal
              visible={this.state.proViewModalTF}
              onCancel={() => this.handleCancel(self)}
              width="1100"
              footer={[
                <div className={styles.footerStyle}>
                  {this.state.editPriceTf ?
                    <Popconfirm title="确定保存所修改价格?" onConfirm={self.saveSku} okText="确定保存" cancelText="取消">
                      <Button type="primary" className={styles.marginLeft30}>保存</Button>
                    </Popconfirm>
                    : null
                  }
                  {this.state.proViewDetail.onSale == 'Y' ?
                    <Popconfirm title="确定取消上架?" onConfirm={self.cancelProGround} okText="确定取消上架" cancelText="取消">
                      <Button type="primary" className={styles.marginLeft30}>取消上架</Button>
                    </Popconfirm>
                    : ''
                  }
                  {this.state.proViewDetail.onSale == 'R' ?
                    <Popconfirm title="确定发布上架?" onConfirm={self.addProGround} okText="确定上架" cancelText="取消">
                      <Button type="primary" className={styles.marginLeft30}>发布上架</Button>
                    </Popconfirm>
                    : ''
                  }
                </div>,
              ]}
            >
              <div className={styles.modalDiv}>
                <Row>
                  <Col span={24} className="proTit">
                    产品信息
                  </Col>
                  {this.state.threeDImgDisplayTf == false ?
                    <Col span={12} ref="threeImgDiv">
                      <img src={app.$http.imgURL + this.state.proImgBigUrl} className={styles.mainImg} />
                    </Col>
                    : ''
                  }
                  {this.state.threeDImgDisplayTf == true ?
                    <Col span={12} ref="threeImgDiv">
                      {this.state.threeDImgOne.imgUrl && (
                        <img ref="threeDImg" src={this.state.threeDImgOne.imgUrl} className={styles.mainImg} />
                      )}
                    </Col>
                    : ''
                  }
                  <Col span={12} style={{ padding: 15, paddingLeft: 50 }}>
                    <div className={styles.titTxt}>
                      平面图
                      <div id="swiperWrapId">{this.state.proViewModalTF && (swiperLi(this.state.proImgList))}</div>
                    </div>
                    {this.state.proViewDetail.threeDUrl ?
                      <div className={styles.titTxt} onClick={this.threeDImgDisplay}>
                          3D图包
                          <div>
                            <div className={styles.swiperSubDiv}>
                              <img src={app.$http.imgURL + this.state.proViewDetail.mPicUrl} className={styles.imgSmall} />
                            </div>
                          </div>
                      </div>
                      : ''
                    }
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>
                      <div className={styles.mainTxt}>
                        产品信息
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>
                      <div className={styles.hr} />
                      <div className={styles.tabTwo}>
                        <Row>
                          {this.state.proViewDetail.designer == 'N' ?
                            <span>
                              <Col span={24} className={styles.leftTxt}>供应商名称：<span className={styles.rightTxt}>{this.state.proViewDetail.nickName}</span></Col>
                            </span>
                            : ''
                          }
                          {this.state.proViewDetail.designer == 'Y' ?
                            <span>
                              <Col span={3} className={styles.leftTxt}>设计师名称：</Col>
                              <Col span={20} className={styles.rightTxt}>{this.state.proViewDetail.nickName}</Col>
                            </span>
                            : ''
                          }
                          <Col span={2} className={styles.leftTxt}>产品系列：</Col>
                          <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.serieName}</Col>
                          <Col span={2} className={styles.leftTxt}>款式品类：</Col>
                          <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.classifyName}</Col>
                          <Col span={2} className={styles.leftTxt}>款式名称：</Col>
                          <Col span={22} className={styles.rightTxt}>{this.state.proViewDetail.productName}</Col>
                          <Col span={2} className={styles.leftTxt}>款式描述：</Col>
                          <Col span={22} className={styles.rightTxt}>{this.state.proViewDetail.productDetail}</Col>
                          {this.state.proViewDetail.manufactureProps ?
                            (this.state.proViewDetail.manufactureProps.map(item =>
                              <span key={item.cname}>
                                <Col span={2} className={styles.leftTxt}>{item.cname}：</Col>
                                <Col span={22} className={styles.rightTxt}>
                                  {item.sizeList ?
                                    (item.sizeList.map((data, index) => (
                                      <span className={styles.rightNumSpan} key={index}>
                                        {data}
                                      </span>
                                    )))
                                    : (item.propValue)
                                  }
                                </Col>
                              </span>,
                            ))
                            : ''
                          }
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>
                      <div className={styles.mainTxt}>
                        产品材质/重量/价格:
                        {this.state.editPriceTf != true ?
                          <span style={{ color: '#F05656', marginRight: 10, fontSize: '14px', textAlgin: 'center', float: 'right' }} onClick={this.editSku}>编辑</span>
                        :
                          null
                        }
                      </div>
                      <div className={styles.tabOne}>
                        {/* <div className={styles.tabOneTitName}>{this.state.proViewDetail.classifyName}</div> */}
                        {this.state.proViewDetail.classifyName != '对戒' ?
                          (this.state.proViewDetail.skuPages ?
                            this.state.proViewDetail.skuPages.map((data, ind) =>
                              <Row className={styles.tabOneCol}>
                                <Col span={22}>
                                  <Row>
                                    {data.skuProps ?
                                      data.skuProps.map(idata =>
                                        <Col span={6}>
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{idata.cname}</span>{idata.propValue}
                                        </Col>,
                                    ) : ''}
                                    {this.state.proViewDetail.designer == 'Y' ?
                                      <span>
                                        <Col span={6} className={styles.titTxtOne}>
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>零售价/￥</span>
                                          {data.minPrice}
                                        </Col>
                                        <Col span={6} className={styles.titTxtOne}>
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>批发价/￥</span>
                                          {this.state.editPriceTf != true ?
                                            <span>{data.saleBybulkPricr}</span>
                                            :
                                            <span>
                                              {getFieldDecorator(`saleDesOne_${ind}`, {
                                                initialValue: data.saleBybulkPricr,
                                              })(
                                                <InputNumber placeholder="批发价" min={0} style={{ width: 120 }} />,
                                            )}
                                            </span>
                                          }
                                        </Col>
                                        <Col span={6} className={styles.titTxtOne}>
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>零售价/￥</span>
                                          {this.state.editPriceTf != true ?
                                            <span>{data.wholesalePrice}</span>
                                            :
                                            <span>
                                              {getFieldDecorator(`saleDesTwo_${ind}`, {
                                                initialValue: data.wholesalePrice,
                                              })(
                                                <InputNumber placeholder="零售价" min={0} style={{ width: 120 }} />,
                                            )}
                                            </span>
                                          }
                                        </Col>
                                      </span>
                                      : ''
                                    }
                                    {this.state.proViewDetail.designer == 'N' ?
                                      <span>
                                        <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>平台批发价/￥</span>
                                          {this.state.editPriceTf != true ?
                                            <span>{data.wholesalePrice}</span>
                                            :
                                            <span>
                                              {getFieldDecorator(`saleOne_${ind}`, {
                                                initialValue: data.wholesalePrice,
                                              })(
                                                <InputNumber placeholder="平台批发价" min={0} style={{ width: 120 }} />,
                                            )}
                                            </span>
                                          }
                                        </Col>
                                        <Col span={6} className={styles.titTxtOne} style={{ float: 'right, height: 40' }}>
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>供应商批发价/￥</span>
                                          {data.minPrice} ~ {data.maxPrice}
                                        </Col>
                                        {data.futurePrice ?
                                          <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>预估成本价/￥</span>
                                            {data.futurePrice}
                                          </Col>
                                          : ''
                                        }

                                      </span>
                                    : ''
                                  }

                                  </Row>
                                </Col>
                              </Row>,
                            )
                            :
                            <div>此产品暂无材质规格！</div>
                        )
                        :
                            <span>
                              {this.state.proViewDetail.designer == 'N' ?
                              (this.state.proViewDetail.skuPages ?
                                <span>
                                  {this.state.proViewDetail.skuPages.map((mdata, ind) =>
                                    <Tabs defaultActiveKey="0">
                                      <TabPane tab={mdata.skuProps[0].propValue} key="0">
                                        <Row className={styles.tabOneCol}>
                                          {mdata.skuProps ?
                                            mdata.skuProps.map(kdata =>
                                              <Col span={6} style={{ height: 40 }}>
                                                <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{kdata.cname}</span>{kdata.propValue}
                                              </Col>,
                                            ) : ''}
                                          <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>平台批发价/￥</span>
                                            {this.state.editPriceTf != true ?
                                              <span style={{ color: '#333333', fontSize: '16px' }}>
                                                {mdata.wholesalePrice}
                                              </span>
                                            :
                                              <span>
                                                {getFieldDecorator(`wholesalePrice_${ind}`, {
                                                  initialValue: mdata.wholesalePrice,
                                                })(
                                                  <InputNumber placeholder="平台批发价" min={0} style={{ width: 50 }} />,
                                                )}
                                              </span>
                                            }
                                          </Col>
                                          <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>供应商批发价/￥</span>
                                            <span style={{ color: '#333333', fontSize: '16px' }}>
                                              {mdata.minPrice} ~ {mdata.maxPrice}
                                            </span>
                                          </Col>
                                          {mdata.futurePrice ?
                                            <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                              <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>预估成本价/￥</span>
                                              <span style={{ color: '#333333', fontSize: '16px' }}>
                                                {mdata.futurePrice}
                                              </span>
                                            </Col>
                                            : ''
                                          }
                                        </Row>
                                      </TabPane>
                                    </Tabs>,
                                )}
                                </span>
                                : <div>此类型暂无材质规格！</div>
                                )
                              :
                                <span>
                                  {this.state.proViewDetail.skuPages ?
                                (this.state.proViewDetail.skuPages.map((mdata, ind) =>
                                  <Tabs defaultActiveKey="0">
                                    <TabPane tab={mdata.skuProps[0].propValue} key="0">
                                      <Row className={styles.tabOneCol}>
                                        {mdata.skuProps ?
                                            mdata.skuProps.map(kdata =>
                                              <Col span={6} style={{ height: 40 }}>
                                                <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{kdata.cname}</span>{kdata.propValue}
                                              </Col>,
                                            ) : ''}
                                        <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>批发价/￥</span>
                                          {this.state.editPriceTf != true ?
                                            <span style={{ color: '#333333', fontSize: '16px' }}>
                                              {mdata.saleBybulkPricr}
                                            </span>
                                            :
                                            <span>
                                              {getFieldDecorator(`saleBybulkPricr_${ind}`, {
                                                initialValue: mdata.saleBybulkPricr,
                                              })(
                                                <InputNumber placeholder="批发价" min={0} style={{ width: 50 }} />,
                                                )}
                                            </span>
                                            }
                                        </Col>
                                        <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>零售价/￥</span>
                                          {this.state.editPriceTf != true ?
                                            <span style={{ color: '#333333', fontSize: '16px' }}>
                                              {mdata.wholesalePrice}
                                            </span>
                                            :
                                            <span>
                                              {getFieldDecorator(`wholesalePrice_${ind}`, {
                                                initialValue: mdata.wholesalePrice,
                                              })(
                                                <InputNumber placeholder="建议售价" min={0} style={{ width: 50 }} />,
                                                )}
                                            </span>
                                            }
                                        </Col>
                                      </Row>
                                    </TabPane>

                                  </Tabs>,
                                ))

                                : <div>此类型暂无材质规格！</div>

                              }
                                </span>
                            }
                            </span>
                      }


                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Modal>
            <div className={styles.pagWrap}>
              <Pagination
                showSizeChanger onShowSizeChange={this.onShowSizeChange} defaultCurrent={1} total={totalNum} onChange={this.onChangPage}
                pageSize={pageSize} pageSizeOptions={['12', '24', '48']}
                  />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

proManage.propTypes = {

};

proManage.contextTypes = {
  router: PropTypes.object.isRequired,
};
const proManageFrom = Form.create()(proManage);
export default proManageFrom;

