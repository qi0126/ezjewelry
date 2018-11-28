import React from 'react';
import { connect } from 'dva';
import { router } from 'react-router';
import PropTypes from 'prop-types';
import styles from './myShopCustomMade.less';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select, Checkbox, message, Form, InputNumber, Popconfirm, Tabs, Pagination, Spin } from 'antd';

import Swiper from 'react-id-swiper';

const { TextArea } = Input;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { Column, ColumnGroup } = Table;// 表格属性
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const tableState = {
  bordered: true,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
};
const swiperParams = {
  slidesPerView: 4,
  spaceBetween: 30,
  centeredSlides: true,
  shouldSwiperUpdate: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};

const proListData = [{}];
let proSelectEdList = [];

class myShopCustomMade extends React.Component {

  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      designerYN: 'N', // Y为设计师产品，N为供应商产品默认为供应商产品
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
      // proSelectEdList: [], // 产品选择数组
      checkAll: false, // 产品全选/反选
      indeterminate: true, // 产品全选/反选
      addGroundModalTF: false, // 发布上架弹窗
      cancelGroundModalTF: false, // 取消上架弹窗
      // 修改框架
      proSizeList: [{ value: '' }], // 产品款式尺寸
      imgDisplayList: [], // 图片示意图
      materList: [], // 材质列表
      unifyAddPriceTF: false, // 统一加价选择框
      changeAddPriceNumber: 'PriceOne', // 统一加价类型PriceOne加价倍数，PriceTwo加价金额
      uniftAddPriceOne: 0, // 统一加价倍数
      uniftAddPriceTwo: 60, // 统一加价固定金额
      brandType: '1', // 默认是供应商款
      facAllList: [], // 全部供应商，
      desAllList: [], // 全部设计师，
      SeriecsAllList: [], // 全部系列查询
      proPageNum: 1, // 产品接口第几页默认为1
      proRowSize: 12, // 产品接口每页显示几条
      proAllSize: 0, // 产品总数是多少个产品
      serieId: '', // 系列ID
      addPriceNum: 'PriceOne',
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgData: {}, // 上传返回3D图包数组
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
      pictureIndex: 0, // 图片下标
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      proLoading: true, // 产品加载中属性
    };
    // 定义全局变量方法
  }
  componentDidMount() {
    // 查询产品数据信息
    this.getList(1, 12);


    // 查询分类数据信息
    app.$api.queryClassifyInfo().then((res) => {
      const tempData = res.data;
      tempData.unshift({ classifyId: '', cname: '全部' });
      this.setState({
        categoryList: res.data,
      });
    });
    // 查询所有设计师
    app.$api.selectStoreBrandDesigner().then((res) => {
      const tempData = res.data;
      this.setState({
        desAllList: res.data,
      });
    });

    // 查询所有供应商
    app.$api.selectStoreBrandCompany().then((res) => {
      const tempData = res.data;
      this.setState({
        facAllList: res.data,
      });
    });

    // 查询系列数据信息
    app.$api.selectSeriecsListByOperateId().then((res) => {
      this.setState({
        SeriecsAllList: res.data,
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
  // 统一加价
  unifyAddPrice=() => {
    // if (proSelectEdList.length == 0) {
    //   message.error('还未选择产品，请重新选择，再点击“统一加价”！');
    //   return;
    // }
    const self = this;
    // 查询适合人群数据信息
    app.$api.selectOldTactic().then((res) => {
      // console.log(res.data);
      if (res.data) {
        if (res.data.pricingType == '_ADD') {
          self.setState({
            uniftAddPriceOne: 0, // 统一加价倍数
            uniftAddPriceTwo: res.data.pricingValue, // 统一加价固定金额
            addPriceNum: 'PriceTwo',
            unifyAddPriceTF: true,
          });
        }
        if (res.data.pricingType == '_RATE') {
          self.setState({
            uniftAddPriceOne: res.data.pricingValue, // 统一加价倍数
            uniftAddPriceTwo: 0, // 统一加价固定金额
            addPriceNum: 'PriceOne',
            unifyAddPriceTF: true,
          });
        }
      } else {
        self.setState({
          addPriceNum: 'PriceOne',
          unifyAddPriceTF: true,
          uniftAddPriceOne: 0, // 统一加价倍数
          uniftAddPriceTwo: 0, // 统一加价固定金额
        });
      }


    });

  }

  // 取消加价
  cancelAddPrice = () => {
    this.setState({
      unifyAddPriceTF: false,
      uniftAddPriceOne: 0, // 统一加价倍数
      uniftAddPriceTwo: 0, // 统一加价固定金额
    });
  }

  // 确认加价
  confirmAddPrice = () => {
    const self = this;
    switch (self.state.changeAddPriceNumber) {
      case 'PriceOne':// 统一加价倍数
        self.props.form.validateFields((err, values) => {
          const params = {
            // productIds: JSON.stringify(proSelectEdList),
            coefficient: values.uniftAddPriceOne,
          };
          app.$api.addAllpriceByCoefficient(params).then((res) => {
            message.success(res.msg);
            self.setState(() => ({
              unifyAddPriceTF: false,
              proPageNum: 1, // 产品接口第几页默认为1
              proRowSize: 12, // 产品接口每页显示几条
              uniftAddPriceOne: 0, // 统一加价倍数
              uniftAddPriceTwo: 0, // 统一加价固定金额
            }), () => {
              this.getList(1, 12);
            });
          });
        });
        break;
      case 'PriceTwo':// 统一加价固定金额
        self.props.form.validateFields((err, values) => {
          const params = {
          // productIds: JSON.stringify(proSelectEdList),
            money: values.uniftAddPriceTwo,
          };
          app.$api.addAllpriceByMony(params).then((res) => {
            message.success(res.msg);
            self.setState(() => ({
              unifyAddPriceTF: false,
              proPageNum: 1, // 产品接口第几页默认为1
              proRowSize: 12, // 产品接口每页显示几条
              uniftAddPriceOne: 0, // 统一加价倍数
              uniftAddPriceTwo: 0, // 统一加价固定金额
            }), () => {
              this.getList(1, 12);
            });
          });
        });
        break;

    }
    // this.setState({
    //   // unifyAddPriceTF: false,
    //   uniftAddPriceOne: 0, // 统一加价倍数
    //   uniftAddPriceTwo: 0, // 统一加价固定金额
    // });
  }

  // 改变审核中状态
  changeAudit(e, thiselem) {
    if (e.target.checked == true) {
      thiselem.state.auditStatus = 1;
    } else {
      thiselem.state.auditStatus = '';
    }
    const params = { categoryId: thiselem.state.categoryId, productStatus: thiselem.state.productStatus, auditStatus: thiselem.state.auditStatus };
    // 查询产品数据信息
    app.$api.selectStoreProductInfo(params).then((res) => {
      let tempList;
      if (res.data) {
        tempList = res.data;
      } else {
        tempList = [];
      }
      tempList.forEach((item) => {
        item.checked = true;
      });
      this.setState({
        proDataList: tempList,
      });
    });
  }
  // 多选框选择
  // proSelectChange(checkedValues) {
  //   console.log('checked = ', checkedValues);
  //   proSelectEdList = checkedValues;
  //   console.log(proSelectEdList);

  // }
  // 供应商和设计师产品数量（1为供应商，2为设计师）
  getList(page, rows) {
    const self = this;
    this.setState({
      proLoading: true,
    });
    if (self.state.brandType == 1) {
      this.setState({
        designerYN: 'N',
      });
    } else if (self.state.brandType == 2) {
      this.setState({
        designerYN: 'Y',
      });
    }
    const params = {
      companyId: this.state.companyId,
      onSale: this.state.onSale,
      classifyId: this.state.classifyId,
      serieId: this.state.serieId,
      page,
      rows,
    };
    if (self.state.brandType == 1) {
      // 供应商产品数量
      app.$api.getFactoryProducts(params).then((res) => {
        this.setState({
          proDataList: res.data.data,
          proPageNum: page,
          proAllSize: res.data.rowSize,
        });
        if (res.data.data.picUrl != undefined) {
          this.state.proDataList.picUrlList = res.data.data.picUrl.split(',');
        }
        this.setState({
          proDataList: this.state.proDataList,
          proLoading: false,
        });
      });
    } else if (self.state.brandType == 2) {
      // 设计师产品数量
      app.$api.getDesignerProducts(params).then((res) => {
        this.setState({
          proDataList: res.data.data,
          proPageNum: page,
          proAllSize: res.data.rowSize,
          proLoading: false,
        });
      });
    }
  }


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
    // console.log(item.checked);
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
      // console.log('进来');
      // console.log(e.target.checked);
      this.passiveAllCheck();
      if (e.target.checked) {
        // console.log('选中');
        // console.log(proSelectEdList);
        const result = proSelectEdList.includes(e.target.value);
        if (!result) {
          proSelectEdList.push(e.target.value);
        }
        // console.log('新数组1');
        // console.log(proSelectEdList);
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
    elem.imgList = elem.picUrl.split(',');


    if (elem.imgList.length >= 3) {
      self.setState({
        ModelAmount: 3,
      });
    } else {
      self.setState({
        ModelAmount: elem.imgList.length,
      });
    }

    // loopStatu
    if (elem.imgList.length == 1) {
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

    this.setState({
      proImgList: elem.picUrl.split(','),
      proViewModalTF: true,
      proViewDetail: elem,
      threeDImgDisplayTf: false,
      tempOneDis: true,
      proImgBigUrl: elem.imgList[0],
      editPriceTf: false,
    }, () => {
      // console.log(self.state.proViewDetail);
    });
  }


  // 打开‘发布上架’按钮
  addGround(thiselem) {
    if (proSelectEdList.length != 0) {
      // console.log(thiselem.state.designerYN)
      if (thiselem.state.designerYN == 'N') {
        // 供应商上架产品
        const params = {
          productIds: JSON.stringify(proSelectEdList),
          isSale: 'Y',
        };
        app.$api.updateSaleStatuByshopF(params).then((res) => {
          message.success('产品发布上架成功，正在刷新页面');
          thiselem.setState(() => ({
            checkAll: false,
          }), () => {
            thiselem.getList(thiselem.state.proPageNum, thiselem.state.proRowSize);
            proSelectEdList = [];
          });
        });
      } else if (thiselem.state.designerYN == 'Y') {
        // 设计师上架产品
        const params = {
          productIds: JSON.stringify(proSelectEdList),
          isSale: 'Y',
        };
        app.$api.updateSaleStatuByshopD(params).then((res) => {
          message.success('产品发布上架成功，正在刷新页面');
          thiselem.setState(() => ({
            checkAll: false,
          }), () => {
            thiselem.getList(thiselem.state.proPageNum, thiselem.state.proRowSize);
            proSelectEdList = [];
          });
        });
      }
    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }

  // 修改单个零售价文字改输入框
  editPriceInd = () => {
    this.setState({
      editPriceTf: true,
    });
  }
    // 取消单个零售价文字改输入框
  cancelPriceInd=() => {
    this.setState({
      editPriceTf: false,
    });
  }
  // 打开‘取消上架’按钮
  cancelGround(thiselem) {
    if (proSelectEdList.length != 0) {
      if (thiselem.state.designerYN == 'N') {
        // 供应商上架产品
        const params = {
          productIds: JSON.stringify(proSelectEdList),
          isSale: 'N',
        };
        app.$api.updateSaleStatuByshopF(params).then((res) => {
          message.success('产品发布上架成功，正在刷新页面');
          thiselem.setState(() => ({
            checkAll: false,
          }), () => {
            thiselem.getList(thiselem.state.proPageNum, thiselem.state.proRowSize);
            proSelectEdList = [];
          });
        });
      } else if (thiselem.state.designerYN == 'Y') {
        // 设计师上架产品
        const params = {
          productIds: JSON.stringify(proSelectEdList),
          isSale: 'N',
        };
        app.$api.updateSaleStatuByshopD(params).then((res) => {
          message.success('产品发布上架成功，正在刷新页面');
          thiselem.setState(() => ({
            checkAll: false,
          }), () => {
            thiselem.getList(thiselem.state.proPageNum, thiselem.state.proRowSize);
            proSelectEdList = [];
          });
        });
      }
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
            if (ielem.onSale == 'Y') {
              tempProList.push(ielem.productId);
            }
          }
        });
      });
      if (tempProList.length != 0) {
        const params = { productId: tempProList.join(',') };
        app.$api.deleteProductByPlatform(params).then((res) => {
          message.success('产品删除成功，正在刷新页面');
          thiselem.setState(() => ({
            proPageNum: 1,
            proRowSize: 12,
            checkAll: false,
          }), () => {
            thiselem.getList(thiselem.state.proPageNum, thiselem.state.proRowSize);
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

  // 打开‘上传产品’按钮
  uploadPro(thiselem) {
    thiselem.context.router.push('/MyShop/uploadPro');
  }

  handleOk() {
    // dispatch({
    //   type: 'myfamProManage/handleOk',
    //   payload: true,
    // });
    // setTimeout(() => {
    //   dispatch({
    //     type: 'myfamProManage/handleOk',
    //     payload: false,
    //   });
    // }, 3000);
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

  // 切换加数类型
  changeAddPriceTab=(e) => {
    this.setState({
      changeAddPriceNumber: e,
    });
  }

  // 改变款式类弄，0为全部，1为供应商款，2为设计师款
  changeProDes(e, thiselem) {
    // 查询产品数据信息
    // console.log(e);
    thiselem.setState({
      brandType: e,
    }, () => {
      thiselem.getList(1, 12);
    });
  }
  // 改变品类
  changeClass= (e) => {
    const self = this;
    self.setState(() => ({
      classifyId: e,
    }), () => {
      self.getList(1, 12);
    });
  }
  // 修改供应商
  changeFacSelect=(e) => {
    const self = this;
    self.setState(() => ({
      companyId: e,
    }), () => {
      self.getList(1, 12);
    });
  }
    // 修改设计师
  changeDesSelect=(e) => {
    const self = this;
    self.setState(() => ({
      companyId: e,
    }), () => {
      self.getList(1, 12);
    });
  }
      // 改变品类
  changeSale= (e) => {
    const self = this;
    self.setState(() => ({
      onSale: e,
    }), () => {
      self.getList(1, 12);
    });
  }
  // 改变系列ID(只限设计款)
  changeSeriecsSelect=(e) => {
    const self = this;
    self.setState(() => ({
      serieId: e,
    }), () => {
      self.getList(1, 12);
    });
  }
    // 改变页码
  changePage = (page) => {
    const self = this;
    this.setState({
      proPageNum: page,
      checkAll: false,
    }, () => {
      self.getList(page, 12);
      proSelectEdList = [];
    });
  }
      // 页码、每页显示几条事件
  onShowSizeChange=(current, pageSize) => {

    const self = this;
    self.setState(() => ({
      proPageNum: 1,
      proRowSize: pageSize,
      checkAll: false,
    }), () => {
      self.getList(1, pageSize);
      proSelectEdList = [];
    });
  }
    // 编辑sku价格，变输入框
  editSku = (elem, index) => {
    console.log(elem);
    console.log(index);
  }
  // 供应商产品保存
  saveAddState(thiselem) {
    const self = thiselem;
    let tempPriceList = [];
    let paramsOne = {};
    thiselem.props.form.validateFields((err, values) => {
      // console.log(self.state.proViewDetail);
      // console.log(values);

      if (self.state.proViewDetail.classifyName != '对戒') {
        tempPriceList = [];
        for (let i = 0; i < self.state.proViewDetail.skuPages.length; i++) {
          // console.log(self.state.proViewDetail.skuPages[i]);
          tempPriceList.push({
            salePrice: values[`salePrice_${i}`],
            skuId: self.state.proViewDetail.skuPages[i].skuId,
          });
        }

        paramsOne = {
          productId: self.state.proViewDetail.productId,
          skus: JSON.stringify(tempPriceList),
        };
      } else {
        tempPriceList = [];
        for (const j in values) {
          if (j.indexOf('salePrice_') >= 0) {
            tempPriceList.push({
              salePrice: values[j],
              skuId: self.state.proViewDetail.skuPages[`${j.split('_')[1]}`].skuId,
            });
          }
        }
        paramsOne = {
          productId: self.state.proViewDetail.productId,
          skus: JSON.stringify(tempPriceList),
        };
      }
    });

    app.$api.addProductprice(paramsOne).then((res) => {
      message.success(res.msg);
      thiselem.setState({
        proModifyModalTF: false,
        proViewModalTF: false,
      }, () => {
        thiselem.getList(1, 12);
      });
    });
  }

      // 产品发布上架
  editAddState(thiselem) {
    const self = thiselem;
    const tempPriceList = [];
    thiselem.props.form.validateFields((err, values) => {
      for (let i = 0; i < self.state.proViewDetail.skuPages.length; i++) {
        // console.log(self.state.proViewDetail.skuPages[i]);
        tempPriceList.push({
          salePrice: values[`salePrice_${i}`] ? values[`salePrice_${i}`] : self.state.proViewDetail.skuPages[i].salePrice,
          skuId: self.state.proViewDetail.skuPages[i].skuId,
        });
      }
    });
    const paramsOne = {
      productId: self.state.proViewDetail.productId,
      skus: JSON.stringify(tempPriceList),
      num: 1,
    };
    app.$api.addProductprice(paramsOne).then((res) => {
      message.success(res.msg);
      thiselem.setState({
        proModifyModalTF: false,
        proViewModalTF: false,
      }, () => {
        thiselem.getList(1, 12);
      });
    });
  }

    // 店铺产品详细下架操作
  downFrame=() => {
    const self = this;
    const params = { productIds: JSON.stringify([self.state.proViewDetail.productId]), isSale: 'N' };
    app.$api.updateSaleStatuByshopD(params).then((res) => {
      message.success(res.msg);
      self.setState({
        proViewModalTF: false,
      });
      self.getList(1, 12);
    });
  }
      // 店铺产品详细上架操作
  upFrame=() => {
    const self = this;
    const params = { productIds: JSON.stringify([self.state.proViewDetail.productId]), isSale: 'Y' };
    app.$api.updateSaleStatuByshopD(params).then((res) => {
      message.success(res.msg);
      self.setState({
        proViewModalTF: false,
      });
      self.getList(1, 12);
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
        $(self.refs.threeDImg).threesixty({ images: self.state.threeDImgList, method: 'click', cycle: 1, auto: 'true' });
      });
    });
    // 3D图包加载结束
  }

  render() {
    const self = this;
    const { getFieldDecorator } = self.props.form;
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
                // pictureIndex:i,
                proImgBigUrl: self.state.proViewDetail.imgList[i],
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
              款式类型：
              <Select defaultValue="1" style={{ width: 100 }} onChange={event => self.changeProDes(event, self)}>
                <Option value="1">供应商款</Option>
                <Option value="2">设计师款</Option>
              </Select>
              {this.state.brandType == '1' ?
                <Select defaultValue="" style={{ width: 100, marginLeft: 10 }} onChange={event => self.changeFacSelect(event)}>
                  <Option value="">全部供应商</Option>
                  {this.state.facAllList.map(data =>
                    <Option value={data.companyId}>{data.companyName}</Option>,
                  )}
                </Select>
                 : ''
              }
              {this.state.brandType == '2' ?
                <span>
                  <Select defaultValue="" style={{ width: 80, marginLeft: 10 }} onChange={event => self.changeDesSelect(event)}>
                    <Option value="">全部设计师</Option>
                    {this.state.desAllList.map(data =>
                      <Option value={data.designerId}>{data.designerName}</Option>,
                    )}
                  </Select>
                  <Select defaultValue="" style={{ width: 80, marginLeft: 10 }} onChange={event => self.changeSeriecsSelect(event)}>
                    <Option value="">全部系列</Option>
                    {this.state.SeriecsAllList.map(data =>
                      <Option value={data.id}>{data.seriecsName}</Option>,
                    )}
                  </Select>
                </span>
                : ''
              }

            </span>
            <span className={styles.marginLeft30}>
              类别：
              <Select defaultValue="全部" style={{ width: 80 }} onChange={event => self.changeClass(event, self)}>
                {this.state.categoryList.map(data =>
                  <Option value={data.classifyId}>{data.cname}</Option>,
                )}
              </Select>
            </span>

            <span className={styles.marginLeft30}>
              状态：
              <Select defaultValue="全部" style={{ width: 80 }} onChange={event => this.changeSale(event)} >
                <Option value="">全部</Option>
                <Option value="Y">已上架</Option>
                <Option value="N">未上架</Option>
              </Select>
            </span>
            <span>
              <span>
                {/* <Checkbox onChange={event => self.changeAudit(event, self)}>未设置零售价</Checkbox> */}
                {this.state.designerYN == 'N' ?
                  <span className={styles.redtxt} onClick={self.unifyAddPrice} style={{ color: 'red' }}>统一加价</span>
                  : ''
                }
                <Modal
                  visible={this.state.unifyAddPriceTF}
                  footer={null}
                  onCancel={self.cancelAddPrice}
                >
                  <div className={styles.unifyAddPriceDiv}>
                    <Tabs defaultActiveKey={this.state.addPriceNum} onChange={self.changeAddPriceTab} >
                      <TabPane tab="倍数加价" key="PriceOne">
                      批发价X
                      {getFieldDecorator('uniftAddPriceOne', {
                        initialValue: self.state.uniftAddPriceOne,
                      })(<InputNumber min={0} placeholder="加价倍数" className={styles.inputOne} />)}
                       倍
                    </TabPane>
                      <TabPane tab="金额加价" key="PriceTwo">
                    加价金额
                    {getFieldDecorator('uniftAddPriceTwo', {
                      initialValue: self.state.uniftAddPriceTwo,
                    })(<InputNumber min={0} placeholder="加价金额" className={styles.inputOne} />)}
                    .00
                    </TabPane>
                    </Tabs>
                    <div className={styles.textCenter}>
                      <Button className="bottonPublic" type="primary" className={styles.buttonOne} onClick={self.cancelAddPrice}>取消加价</Button>
                      <Button className="bottonPublic" type="primary" className={styles.buttonOne} onClick={self.confirmAddPrice} >确认加价</Button>
                    </div>
                  </div>
                </Modal>
              </span>
            </span>
          </span>
        </div>
        <div className={styles.hr} />
        <div>
          <Row>
            <Col span={4}>
              {/* <Button type="primary" onClick={() => self.uploadPro(this)}>上传产品</Button> */}
            </Col>
            <Col span={10} />
            <Col span={10} className={styles.textRight}>
              <Checkbox
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >全选</Checkbox>
              <Popconfirm title="确定取消上架所选产品?" onConfirm={() => self.cancelGround(self)} okText="确定取消上架" cancelText="取消">
                <Button type="primary" className={`${styles.marginLeft30} bottonPublic`}>取消上架</Button>
              </Popconfirm>
              <Popconfirm title="确定发布上架所选产品?" onConfirm={() => self.addGround(self)} okText="确定上架" cancelText="取消">
                <Button type="primary" className={`${styles.marginLeft30} bottonPublic`}>发布上架</Button>
              </Popconfirm>
              {/* <span style={{ marginRight: 20 }}>
                <Popconfirm placement="topRight" title="确定删除所选产品？" onConfirm={() => self.delPro(self)} okText="确定删除" cancelText="取消">
                  <img src="./images/delPro.png" />
                </Popconfirm>
              </span> */}
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
                                {ielem.isSale == 'Y' ?
                                '已上架'
                                :
                                ''
                                // <span>
                                //   {ielem.isAudit == 1 ? '待完善' : ''}
                                //   {ielem.isAudit == 2 ? '审核中' : ''}
                                //   {ielem.isAudit == 3 ? '审核不通过' : ''}
                                //   {ielem.isAudit == 4 ? '已上架' : ''}
                                //   {ielem.isAudit == 5 ? '待审核' : ''}
                                // </span>
                              }
                              </span>
                              {ielem.isSale == 'N' ? <div className={styles.underFrame} onClick={() => self.showModal(ielem)} >已下架</div> : ''}
                              {!ielem.isSale ? <div className={styles.underFrame} onClick={() => self.showModal(ielem)} >已下架</div> : ''}
                              <div className={styles.imgTop} >
                                {/* {ielem.checked == true ? 'true' : 'false'} */}
                                {/* <Checkbox value={ielem.productId} checked /> */}
                                <Checkbox value={ielem.productId} checked={ielem.checked} onChange={this.singleElection} />
                              </div>
                              <img src={app.$http.imgURL + ielem.sPicUrl} onClick={() => self.showModal(ielem)} />
                            </div>
                            <div className={styles.proDisplay} onClick={() => self.showModal(ielem)}>
                              <p className={styles.proName}>{ielem.productName}</p>
                              {(!ielem.isSale && ielem.viewSale == 1) ?
                                <p className={styles.proPriceTwo}>请设置零售价</p>
                              :
                                <p className={styles.proPrice}>零售价￥{ielem.suggestSale}</p>
                            }

                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </div>
              </Row>
            </Spin>
            {self.state.proAllSize != 0 ?
              <Row className={styles.textRight}>
                <Pagination
                  showSizeChanger
                  onShowSizeChange={self.onShowSizeChange}
                  current={self.state.proPageNum}
                  onChange={self.changePage}
                  total={self.state.proAllSize}
                  pageSize={self.state.proRowSize}
                  pageSizeOptions={[12, 24, 48]}
                />
              </Row>
              : ''
            }
            {this.state.proViewModalTF && (
            <Modal
              visible={this.state.proViewModalTF}
              onCancel={() => this.handleCancel(self)}
              width="1100"
              footer={[
                <div className={styles.modalFooter}>
                  {this.state.proViewDetail.designer == 'N' ?
                    <span>
                      {this.state.editPriceTf ?
                        <Popconfirm title="确定保存所修改价格?" onConfirm={() => self.saveAddState(this)} okText="确定保存" cancelText="取消">
                          <Button className="bottonPublic" type="primary">
                            保存
                          </Button>
                        </Popconfirm>
                        : null
                      }
                      {this.state.proViewDetail.isSale == 'Y' ?
                        <span>
                          <Popconfirm title="确定取消上架?" onConfirm={() => self.downFrame(this)} okText="确定取消上架" cancelText="取消">
                            <Button className="bottonPublic" type="primary">
                              取消上架
                            </Button>
                          </Popconfirm>
                        </span>
                      :
                        <span>
                          <Popconfirm title="确定发布上架?" onConfirm={() => self.editAddState(this)} okText="确定上架" cancelText="取消">
                            <Button className="bottonPublic" type="primary">
                              发布上架
                            </Button>
                          </Popconfirm>
                        </span>
                      }
                    </span>
                  :
                    <span>
                      {this.state.proViewDetail.isSale == 'N' ?
                        <span>
                          <Popconfirm title="确定发布上架?" onConfirm={() => self.upFrame(this)} okText="确定上架" cancelText="取消">
                            <Button className="bottonPublic" type="primary">
                              发布上架
                            </Button>
                          </Popconfirm>
                        </span>
                    :
                        <span>
                          <Popconfirm title="确定取消上架?" onConfirm={() => self.downFrame(this)} okText="确定取消上架" cancelText="取消">
                            <Button className="bottonPublic" type="primary">
                              取消上架
                            </Button>
                          </Popconfirm>
                        </span>
                    }
                    </span>
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
                      <div id="swiperWrapId">{this.state.proViewModalTF && (swiperLi(self.state.proViewDetail.imgList))}</div>
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
                        <span className={styles.mainTxtSub}>
                          商品编号：
                          {this.state.proViewDetail.productCode}
                        </span>
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
                        {this.state.proViewDetail.designer == 'N' ?
                          (this.state.editPriceTf != true ?
                            <span style={{ color: '#F05656', marginRight: 10, fontSize: '14px', textAlgin: 'center', float: 'right' }} onClick={this.editPriceInd}>修改价格</span>
                          :
                            <span style={{ color: '#F05656', marginRight: 10, fontSize: '14px', textAlgin: 'center', float: 'right' }} onClick={this.cancelPriceInd}>取消</span>
                          )
                        : ''}

                      </div>
                      <div className={styles.tabOne}>
                        {this.state.proViewDetail.classifyName != '对戒' ?
                          <span>
                            {this.state.proViewDetail.skuPages ?
                            this.state.proViewDetail.skuPages.map((data, ind) =>
                              <Row className={styles.tabOneCol}>
                                {data.skuProps ?
                                  data.skuProps.map(idata =>
                                    <Col span={6} className={styles.titTxtOne} style={{ height: 40, lineHeight: '40px' }}>
                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{idata.cname}</span>{idata.propValue}
                                    </Col>,
                                ) : ''}
                                {this.state.proViewDetail.designer == 'Y' ?
                                  <span>
                                    <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40, lineHeight: '40px' }}>
                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>平台批发价/￥</span>
                                      {data.saleBybulkPricr}
                                    </Col>
                                    <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40, lineHeight: '40px' }}>
                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>零售价/￥</span>
                                      {data.wholesalePrice}
                                    </Col>
                                  </span>
                                : ''
                                }
                                {this.state.proViewDetail.designer == 'N' ?
                                  <span>
                                    <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40, lineHeight: '40px' }}>

                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>零售价/￥</span>
                                      {this.state.editPriceTf ?
                                      (getFieldDecorator(`salePrice_${ind}`, {
                                        initialValue: data.salePrice,
                                      })(<InputNumber min={0} placeholder="" style={{ width: 100 }} />))
                                      :
                                      (data.salePrice)
                                      }

                                    </Col>
                                    <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40, lineHeight: '40px' }}>
                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>平台批发价/￥</span>
                                      {data.wholesalePrice}
                                    </Col>
                                  </span>
                              : ''}


                              </Row>,
                            )
                            :
                            <div>此产品暂无材质规格！</div>
                          }
                          </span>
                          :
                          <span>
                            {this.state.proViewDetail.skuPages ?
                              (this.state.proViewDetail.skuPages.map((mdata, ind) =>
                                <Tabs defaultActiveKey="0">
                                  <TabPane tab={mdata.skuProps[0].propValue} key="0">
                                    <Row className={styles.tabOneCol}>
                                      {mdata.skuProps ?
                                          mdata.skuProps.map((kdata, indOne) =>
                                            (indOne != 0 ?
                                              <Col span={6} style={{ height: 40, lineHeight: '40px' }}>
                                                <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{kdata.cname}</span>{kdata.propValue}
                                              </Col>
                                            : ''
                                            ),
                                          )
                                          : ''}
                                      {this.state.proViewDetail.designer == 'N' ?
                                        <span>
                                          <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40, lineHeight: '40px' }}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>零售价/￥</span>
                                            {this.state.editPriceTf ?
                                              (getFieldDecorator(`salePrice_${ind}`, {
                                                initialValue: mdata.salePrice,
                                              })(<InputNumber min={0} placeholder="" style={{ width: 100 }} />))
                                              :
                                              (mdata.salePrice)
                                            }

                                          </Col>
                                          <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40, lineHeight: '40px' }}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>平台批发价/￥</span>
                                            {mdata.wholesalePrice}
                                          </Col>
                                        </span>
                                        : ''}
                                      {self.state.proViewDetail.designer == 'Y' ?
                                        <span>
                                          <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40, lineHeight: '40px' }}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>平台批发价/￥</span>
                                            {mdata.saleBybulkPricr}
                                          </Col>
                                          <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40, lineHeight: '40px' }}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>零售价/￥</span>
                                            {mdata.wholesalePrice}
                                          </Col>

                                        </span>
                                        :
                                          ''
                                        }
                                    </Row>
                                  </TabPane>
                                </Tabs>,
                              ))
                              : <div>此类型暂无材质规格！</div>
                            }
                          </span>
                        }

                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Modal>)}


          </div>
        </div>
      </div>
    );
  }
}

myShopCustomMade.propTypes = {

};

myShopCustomMade.contextTypes = {
  router: PropTypes.object.isRequired,
};
const proManageFrom = Form.create()(myShopCustomMade);
export default proManageFrom;

