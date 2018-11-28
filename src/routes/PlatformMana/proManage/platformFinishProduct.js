import React from 'react';
import { connect } from 'dva';
import { router } from 'react-router';
import PropTypes from 'prop-types';
import styles from './platformFinishProduct.less';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select, Checkbox, message, Form, InputNumber, Pagination, Popconfirm, Spin } from 'antd';

import Swiper from 'react-id-swiper';

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
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
      // proSelectEdList: [], // 产品选择数组
      checkAll: false, // 产品全选/反选
      // indeterminate: true, // 产品全选/反选
      addGroundModalTF: false, // 发布上架弹窗
      cancelGroundModalTF: false, // 取消上架弹窗
      // 修改框架
      proSizeList: [{ value: '' }], // 产品款式尺寸
      imgDisplayList: [], // 图片示意图
      materList: [], // 材质列表
      pageIndex: 1, // 当前页
      pageSize: 12, // 每页展示条数
      totalNum: 0, // 总条数
      facAllList: [], // 全部供应商，
      desAllList: [], // 全部设计师，
      desSelectData: '', // 选择设计师ID.
      brandType: '', // 产品类型,供应商，设计师
      productStatus: '', // 空为全部，1为上架 2下架
      categoryId: '', // 分类id
      designerId: '', // 设计师id
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
      proLoading: true, // 产品加载中属性
      editPriceTf: false, // 产品规格编辑状态
    };
    // 定义全局变量方法
  }
    // 改变款式类型，0为全部，1为供应商款，2为设计师款
  changeProDes(e, thiselem) {
      // console.log(e);
    this.setState(() => ({
      brandType: e,
      designerId: '',
      seriecsId: '',
      companyId: '',
      pageIndex: 1,
      pageSize: 12,
      proLoading: true,
    }), () => {
      this.getlist(1, 12);
    });
  }
  componentDidMount() {
    // 查询产品数据信息
    // app.$api.selectPlatformProductInfo().then((res) => {
    //   this.setState({
    //     proDataList: res.data,
    //   });
    // });
    this.setState({
      proLoading: true,
    });
    this.getlist(1, 12);


    // 查询分类数据信息
    app.$api.selectCategoryNumber().then((res) => {
      const tempData = res.data;
      tempData.unshift({ id: '', commonName: '全部' });
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

    // 查询适合人群数据信息
    app.$api.selectCrowdNumber().then((res) => {
      this.setState({
        crowdList: res.data,
      });
    });
  }

  // 查询产品数据信息
  getlist = (pageIndex, pageSize) => {
    this.setState({
      proLoading: true,
    });
    const params = {
      categoryId: this.state.categoryId,
      seriecsId: this.state.seriecsId,
      companyId: this.state.companyId,
      designerId: this.state.designerId,
      brandType: this.state.brandType,
      productStatus: this.state.productStatus,
      page: pageIndex,
      rows: pageSize,
    };
    app.$api.selectPlatformProductInfo(params).then((res) => {
      // console.log(res);
      this.setState({
        proDataList: res.data.data,
        totalNum: res.data.rowSize,
        proLoading: false,
      });
    });
  }


   // 全选/反选
  onCheckAllChange = (e) => {
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
  }

  // 单选
  singleElection = (e) => {
    const self = this;
    this.state.proDataList.forEach((item) => {
      if (e.target.value == item.productId) {
        item.checked = e.target.checked;
      }
    });
    this.setState(() => ({
      proDataList: [...this.state.proDataList],
    }), () => {
      this.passiveAllCheck();
      if (e.target.checked) {
        const result = proSelectEdList.includes(e.target.value);
        if (!result) {
          proSelectEdList.push(e.target.value);
        }
      } else {
        let numIndex = '';
        proSelectEdList.forEach((pop, index) => {
          if (pop == e.target.value) {
            numIndex = index;
          }
        });
        if (!isNaN(numIndex)) {
          proSelectEdList.splice(numIndex, 1);
        }
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

    const params = { productId: elem };
    app.$api.findProductByProductId(params).then((res) => {
      let tempList;
      // console.log(res.data);
      const tempObj = res.data;
      if (tempObj.designs && tempObj.designs[0].designValue != undefined) {
        tempObj.designs.forEach((ielem, indOne) => {
          ielem.sizeList = ielem.designValue.split(',');
        });
      }

      let referencePriceTF = false;
      tempObj.textures.forEach((ielem) => {
        if (ielem.referencePrice) {
          referencePriceTF = true;
        }
      });
      tempObj.referencePriceTF = referencePriceTF;
      // const tempList = res.data.designs[0].designValue;
      this.setState({
        proViewDetail: tempObj,
        proImgBigUrl: res.data.images[0].imageUrl,
        designsListOne: tempList,
        proImgList: res.data.images,

      }, () => {
        if (this.state.proViewDetail.details) {
          setTimeout(() => {
            self.refs.imgTxtBackup.innerHTML = self.state.proViewDetail.details;
          }, 200);
        }
      });

      if (res.data.images.length >= 3) {
        self.setState({
          ModelAmount: 3,
        });
      } else {
        self.setState({
          ModelAmount: res.data.images.length,
        });
      }

      // loopStatu
      if (res.data.images.length == 1) {
        self.setState({
          loopStatu: false,
        });
      } else {
        self.setState({
          loopStatu: true,
        });
      }

      // for (let i = 0; i < this.state.proViewDetail.textures.length; i++) {
      //   // console.log(this.state.proViewDetail.textures[i]);
      //   this.state.proViewDetail.textures[i].editPriceTf = false;
      // }

      // console.log(this.state.proImgList);
      this.setState({
        proViewDetail: this.state.proViewDetail,
        proViewModalTF: true,
        proViewId: elem,
        threeDImgDisplayTf: false,
        tempOneDis: true,
        editPriceTf: false,
      });
    });

  }

  // 打开‘发布上架’按钮
  addGroundModal() {
    this.setState({
      addGroundModalTF: true,
    });
  }

  // 打开‘取消上架’按钮
  cancelGroundModal() {
    this.setState({
      cancelGroundModalTF: true,
    });
  }

    // 打开‘上传产品’按钮
  uploadPro(thiselem) {
    thiselem.context.router.push('/MyFactory/uploadPro');
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
    self.state.proViewDetail.textures.push(
      { textureId: '',
        texturePrice: '0-0',
        textureWeight: '0-0' },
    );
    self.setState({
      proViewDetail: self.state.proViewDetail,
    });
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

  // 产品详情页‘发布上架’按钮
  addProGround=() => {
    const params = { productId: this.state.proViewDetail.id, productStatus: 1 };
    app.$api.updataProductStatus(params).then((res) => {
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
    const params = { productId: this.state.proViewDetail.id, productStatus: 2 };
    app.$api.updataProductStatus(params).then((res) => {
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

  // 打开‘发布上架’按钮
  addGround(thiselem) {
    if (proSelectEdList.length != 0) {

      const upData = [];
      let viewState = false;
      proSelectEdList.forEach((item) => {
        thiselem.state.proDataList.forEach((sing) => {
          if (item == sing.productId && sing.productStatus == 1) {
            upData.push(item);
            viewState = true;
          }
        });
      });

      if (upData.length == proSelectEdList.length) {
        message.warning('抱歉！您选择的产品已经上架了！');
        return;
      }

      if (viewState) {
        message.warning('抱歉！您选择的产品有已经上架的，请重新选择！');
        return;
      }

      const noData = [];
      proSelectEdList.forEach((item) => {
        thiselem.state.proDataList.forEach((sing) => {
          if (item == sing.productId && sing.productStatus == 0) {
            noData.push(item);
          }
        });
      });

      if (noData.length > 0) {
        message.warning('抱歉！暂存的产品不能上下架！');
        return;
      }

      let examine = false;
      proSelectEdList.forEach((item) => {
        thiselem.state.proDataList.forEach((sing) => {
          if (item == sing.productId && sing.productStatus == 3) {
            examine = true;
          }
        });
      });

      if (examine) {
        message.warning('抱歉！审核中的产品不能上下架！');
        return;
      }

      const params = { productId: proSelectEdList.join(','), productStatus: 1 };
      app.$api.updataProductStatus(params).then((res) => {
        message.success('产品发布上架成功，正在刷新页面');
        thiselem.setState(() => ({
          // pageIndex: 1,
          // pageSize: 12,
          checkAll: false,
        }), () => {
          this.getlist(this.state.pageIndex, this.state.pageSize);
          proSelectEdList = [];
          // this.componentDidMount();
        });
      });
    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }

  // 打开‘取消上架’按钮
  cancelGround(thiselem) {
    if (proSelectEdList.length != 0) {

      const downData = [];
      let viewState = false;
      proSelectEdList.forEach((item) => {
        thiselem.state.proDataList.forEach((sing) => {
          if (item == sing.productId && sing.productStatus == 2) {
            downData.push(item);
            viewState = true;
          }
        });
      });

      if (downData.length == proSelectEdList.length) {
        message.warning('抱歉！您选择的产品已经下架了！');
        return;
      }

      if (viewState) {
        message.warning('抱歉！您选择的产品有已经下架的，请重新选择！');
        return;
      }


      const noData = [];
      proSelectEdList.forEach((item) => {
        thiselem.state.proDataList.forEach((sing) => {
          if (item == sing.productId && sing.productStatus == 0) {
            noData.push(item);
          }
        });
      });

      if (noData.length > 0) {
        message.warning('抱歉！暂存的产品不能上下架！');
        return;
      }


      let examine = false;
      proSelectEdList.forEach((item) => {
        thiselem.state.proDataList.forEach((sing) => {
          if (item == sing.productId && sing.productStatus == 3) {
            examine = true;
          }
        });
      });

      if (examine) {
        message.warning('抱歉！审核中的产品不能上下架！');
        return;
      }


      const params = { productId: proSelectEdList.join(','), productStatus: 2 };
      app.$api.updataProductStatus(params).then((res) => {
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

      let upStatu = false;
      thiselem.state.proDataList.forEach((ielem, ind) => {
        proSelectEdList.forEach((jelem) => {
          if (ielem.productId == jelem) {
            if (ielem.productStatus == 1) {
              upStatu = true;
            }
          }
        });
      });

      if (upStatu) {
        message.error('抱歉，已上架的产品不能删除！');
        return;
      }

      const tempProList = [];
      thiselem.state.proDataList.forEach((ielem, ind) => {
        proSelectEdList.forEach((jelem) => {
          if (ielem.productId == jelem) {
            if (ielem.productStatus == 2) {
              tempProList.push(ielem.productId);
            }
          }
        });
      });
      if (tempProList.length != 0) {
        const params = { productId: tempProList.join(',') };
        console.log();
        app.$api.deleteProductInfo(params).then((res) => {
          message.success('产品删除成功，正在刷新页面');
          thiselem.setState(
            () => ({
              checkAll: false,
              pageIndex: 1,
            }),
            () => {
              this.getlist(this.state.pageIndex, this.state.pageSize);
              proSelectEdList = [];
            },
          );
        });
      } else {
        message.error('抱歉，已上架的产品不能删除！');
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

  // 保存供应商单个零售价文字改输入框
  savePriceInd=() => {
    const self = this;
    self.props.form.validateFields((err, values) => {
      const skusList = [];
      self.state.proViewDetail.textures.forEach((ielem, ind) => {
        if (!values[`proSalePrice_${ind}`]) {
          message.error('平台批发价不能为空，请重新填入！');
          return;
        }
        skusList.push({
          productId: self.state.proViewDetail.id,
          textureId: self.state.proViewDetail.textures[ind].id,
          salePrice: values[`proSalePrice_${ind}`],
        });
      });
      app.$api.updatePlatProductTexturePrice(skusList).then((res) => {
        self.setState(() => ({
          pageIndex: 1,
          pageSize: 12,
          proViewModalTF: false,
        }), () => {
          self.getlist(1, 12);
        });
      });
    });

  }
    // 保存设计师单个零售价文字改输入框
  saveDesPriceInd = () => {
    const self = this;
    self.props.form.validateFields((err, values) => {

      // console.log(values);
      const skusList = [];
      self.state.proViewDetail.textures.forEach((ielem, ind) => {
        if (!values[`proSellPrice_${ind}`] || !values[`proSalePrice_${ind}`]) {
          message.error('零售价和批发价不能为空，请重新填入！');
          return;
        }
        // console.log(ielem);
        skusList.push({
          productId: self.state.proViewDetail.id,
          textureId: self.state.proViewDetail.textures[ind].id,
          salePrice: values[`proSalePrice_${ind}`],
          sellPrice: values[`proSellPrice_${ind}`],
        });
      });
      app.$api.updatePlatProductTexturePrice(skusList).then((res) => {
        self.setState(() => ({
          pageIndex: 1,
          pageSize: 12,
          proViewModalTF: false,
        }), () => {
          self.getlist(1, 12);
        });
      });
    });
  }

  // 分页
  onShowSizeChange = (current, pageSize) => {
    // console.log(pageSize);
    // this.getlist(1, pageSize);
    this.setState(() => ({
      pageSize,
      checkAll: false,
    }), () => {
      this.getlist(1, pageSize);
      proSelectEdList = [];
    });
  }

  onChangPage = (page, pageSize) => {
    // this.getlist(page, pageSize);
    this.setState(() => ({
      pageIndex: page,
      checkAll: false,
    }), () => {
      this.getlist(page, pageSize);
      proSelectEdList = [];
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
            companyId: '',
            seriecsId: '',
            SeriecsAllList: item.seriecs,
          });
        } else {
          this.setState({
            companyId: '',
            seriecsId: '',
            SeriecsAllList: '',
          });
        }
      }
    });
    this.setState(() => ({
      designerId: e,
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
      productStatus: e,
    }), () => {
      this.getlist(1, 12);
    });
  }
  // 改变类别事件
  changeCate(e, thiselem) {
    thiselem.setState(() => ({
      pageIndex: 1,
      pageSize: 12,
      categoryId: e,
    }), () => {
      this.getlist(1, 12);
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
      productId: self.state.proViewDetail.id,
    };
    app.$api.selectFigureThumbUrl(params).then((res) => {
      // console.log(res.data)
      let tempImgList = [];
      // console.log(app.$http.imgURL)
      // console.log(tempImgList)
      if (res.data.length > 0) {

        for (let i = res.data.length - 1; i >= 0; i--) {
          tempImgList.push(app.$http.imgURL + res.data[i].figureUrl);
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
    const { pageIndex, pageSize, totalNum } = this.state;
    const { getFieldDecorator } = self.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
    };
    const formItemTwo = {
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
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
                proImgBigUrl: self.state.proImgList[i].imageUrl,
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
          {proImgList.map((data) => {
            return (
              <div className={styles.imgWrap} key={data.id}>
                <img src={app.$http.imgURL + data.imageUrl} className={styles.imgSmall} key={data.id} />
              </div>
            );
          })}
        </Swiper>
      );
    };

    return (
      <div className={styles.proManage}>
        <div className={styles.tit}>成品款管理
          <span className={styles.titSubName}>
            <span className={styles.marginLeft30}>
              类别：
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => self.changeCate(event, self)}>
                {this.state.categoryList.map(data =>
                  <Option value={data.id}>{data.commonName}</Option>,
                )}
              </Select>
            </span>
            <span className={styles.marginLeft30}>
              状态：
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => self.changeStatus(event, self)}>
                <Option value="">全部</Option>
                <Option value="1">已上架</Option>
                <Option value="2">未上架</Option>
              </Select>
            </span>
            <span className={styles.marginLeft30}>
              款式类型：
              <Select defaultValue="" style={{ width: 100 }} onChange={event => self.changeProDes(event, self)}>
                <Option value="">全部</Option>
                <Option value="1">供应商款</Option>
                <Option value="2">设计师款</Option>
              </Select>
              {this.state.brandType == '1' ?
                <Select defaultValue="全部供应商" style={{ width: 120, marginLeft: 10 }} onChange={event => self.changeFacSelect(event)}>
                  <Option value="">全部供应商</Option>
                  {this.state.facAllList.map(data =>
                    <Option value={data.id}>{data.realName}</Option>,
                  )}
                </Select>
                 : ''
              }
              {this.state.brandType == '2' ?
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
            {/* <span className={styles.marginLeft30}>
              款式来源：
              <Select defaultValue="全部" style={{ width: 120 }}>
                <Option value="全部">全部</Option>
                <Option value="已上架">供应商上传</Option>
                <Option value="未上架">设计师上传</Option>
              </Select>
            </span>
            <span className={styles.marginLeft30}>
              供应商上传：
              <Select defaultValue="全部" style={{ width: 120 }}>
                <Option value="全部">全部</Option>
                <Option value="已上架">深圳利百泰</Option>
                <Option value="未上架">深圳金百泰</Option>
              </Select>
            </span> */}
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
            <Row gutter={16}>
              <Spin size="large" spinning={this.state.proLoading} >
                <div style={{ width: '100%' }} onChange={self.proSelectChange}>

                  {this.state.proDataList.length == 0 ? (
                    <div className={styles.noProImgDiv}>
                      <img src="./images/noProPng.png" />
                      <div>暂无您要的产品哦！</div>
                    </div>
                  ) : (
                    ''
                  )}
                  {this.state.proDataList.map((ielem) => {
                    return (
                      <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                          <div className={styles.pro} >
                            <div>
                              <div className={styles.imgTop} >
                                <span className={styles.imgTopTxt} onClick={() => self.showModal(ielem.productId)} >
                                  {ielem.productStatus == 0 ? '暂存' : ''}
                                  {ielem.productStatus == 1 ? '已上架' : ''}
                                  {/* {ielem.productStatus == 2 ? '下架' : ''} */}
                                  {ielem.productStatus == 3 ? '审核中' : ''}
                                </span>
                                {/* {ielem.checked == true ? 'true' : 'false'} */}
                                {/* <Checkbox value={ielem.productId} /> */}
                                <Checkbox value={ielem.productId} checked={ielem.checked} onChange={this.singleElection} />
                              </div>
                              <img src={app.$http.imgURL + ielem.productImageUrl} onClick={() => self.showModal(ielem.productId)} />
                              {ielem.productStatus == 2 ? <div className={styles.underFrame} onClick={() => self.showModal(ielem.productId)} >已下架</div> : ''}
                            </div>
                            <div className={styles.proDisplay} onClick={() => self.showModal(ielem.productId)}>
                              <p className={styles.proName}>{ielem.productName}</p>
                              {ielem.resalePrice ?
                                <p className={styles.proPrice}>零售价：￥{ielem.resalePrice}</p> :
                                <p className={styles.proPrice}>批发价：￥{ielem.combinationPrice}</p>
                              }
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </div>
              </Spin>
            </Row>
            <Modal
              visible={this.state.proViewModalTF}
              onCancel={() => this.handleCancel(self)}
              width="1100"
              footer={[
                <div className={styles.modalFooter}>
                  {this.state.editPriceTf ?
                    (this.state.proViewDetail.designSource == 1 ?
                      <Popconfirm title="确定保存所修改价格?" onConfirm={self.savePriceInd} okText="确定保存" cancelText="取消">
                        <Button type="primary" className={styles.marginLeft30}>保存</Button>
                      </Popconfirm>
                      :
                      <Popconfirm title="确定保存所修改价格?" onConfirm={self.saveDesPriceInd} okText="确定保存" cancelText="取消">
                        <Button type="primary" className={styles.marginLeft30}>保存</Button>
                      </Popconfirm>
                    )
                    : null
                  }
                  {this.state.proViewDetail.productStatus == 1 ?
                    <Popconfirm title="确定取消上架?" onConfirm={self.cancelProGround} okText="确定取消上架" cancelText="取消">
                      <Button type="primary" className={styles.marginLeft30}>取消上架</Button>
                    </Popconfirm>
                    : ''
                  }
                  {this.state.proViewDetail.productStatus == 2 ?
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
                  <Col span={12} style={{ padding: 15 }}>
                    <div className={styles.titTxt}>
                        平面图
                      <div id="swiperWrapId">{this.state.proViewModalTF && (swiperLi(this.state.proImgList))}</div>
                    </div>
                    {this.state.proViewDetail.figureFrom ? (
                      <div className={styles.titTxt} onClick={this.threeDImgDisplay}>
                        3D图包
                        <div>
                          <div className={styles.swiperSubDiv}>
                            <img src={app.$http.imgURL + this.state.proViewDetail.figureFrom.figuerThurl} className={styles.imgSmall} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>
                      <div className={styles.mainTxt}>
                        产品信息
                        <span className={styles.mainTxtSub}>
                          商品编号：{this.state.proViewDetail.productCode}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>
                      {this.state.proViewDetail.designSource == 2 ?
                        <div className={styles.tabTwo}>
                          <Row>
                            <span>
                              <Col span={2} className={styles.leftTxt}>设计师：</Col>
                              <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.designerListFrom.designerName}</Col>
                            </span>
                            {this.state.proViewDetail.seriecs ?
                              <span>
                                <Col span={2} className={styles.leftTxt}>产品系列：</Col>
                                <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.seriecs.seriecsName}</Col>
                                {this.state.proViewDetail.seriecs.seriecsDescription ?
                                  <span>
                                    <Col span={2} className={styles.leftTxt}>系列描述：</Col>
                                    <Col span={22} className={styles.rightTxt}>{this.state.proViewDetail.seriecs.seriecsDescription}</Col>
                                  </span>
                                    : ''
                                  }
                              </span>
                                : ''
                              }
                          </Row>
                        </div>
                          : ''
                        }
                      <div className={styles.tabTwo}>
                        <Row>
                          {this.state.proViewDetail.designSource == 1 ?
                            <span>
                              <Col span={24} className={styles.leftTxt}>供应商名称：<span className={styles.rightTxt}>{this.state.proViewDetail.companyName}</span></Col>
                            </span>
                            : ''
                          }
                          <Col span={2} className={styles.leftTxt}>产品类别：</Col>
                          <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.categoryName}</Col>
                          <Col span={2} className={styles.leftTxt}>适合人群：</Col>
                          <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.crowdName}</Col>
                          <Col span={2} className={styles.leftTxt}>产品名称：</Col>
                          <Col span={22} className={styles.rightTxt}>{this.state.proViewDetail.productName}</Col>
                          <Col span={2} className={styles.leftTxt}>宝石描述：</Col>
                          <Col span={22} className={styles.rightTxt}>{this.state.proViewDetail.productDescription}{this.state.proViewDetail.designsListOne}</Col>

                          {this.state.proViewDetail.designs ?
                            (this.state.proViewDetail.designs.map((idata, ind) =>
                              <span>
                                <Col span={2} className={styles.leftTxt}>
                                  {idata.designName}:
                                </Col>
                                <Col span={22} className={styles.rightTxt}>
                                  <span className={styles.rightNumSpan}>
                                    {idata.sizeList.map((data, index) => (
                                      <span className={styles.rightNumSpan} key={index}>
                                        {data}
                                      </span>
                                    ))}
                                  </span>
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
                      </div>
                      <div className={styles.tabOne}>
                        {this.state.proViewDetail.designSource == 1 ? // 供应商显示sku规格
                          <Table dataSource={this.state.proViewDetail.textures} {...tableState}>
                            <Column
                              title="材质"
                              dataIndex="textureName"
                              key="textureName"
                              />
                            <Column
                              title="重量/g"
                              dataIndex="textureWeight"
                              key="textureWeight"
                            />

                            <Column
                              title="供应商批发价/￥"
                              dataIndex="texturePrice"
                              key="texturePrice"
                                />
                            <Column
                              title={
                                <span>
                                  平台批发价/￥
                                  {!self.state.editPriceTf ?
                                    <span>
                                      <span onClick={self.editPriceInd} className={styles.redTxt}>修改价格</span>
                                    </span>
                                      :
                                    <span>
                                      <span onClick={self.cancelPriceInd} className={styles.redTxt}>取消</span>
                                    </span>
                                  }
                                </span>
                              }
                              key="salePrice"
                              render={(text, record, ind) => (
                                <span>
                                  {!self.state.editPriceTf ?
                                    <span>
                                      {record.salePrice}

                                    </span>
                                    :
                                    <span>
                                      {getFieldDecorator(`proSalePrice_${ind}`, {
                                        initialValue: record.salePrice,
                                      })(<InputNumber min={0} placeholder="平台批发价" size="large" style={{ width: 138 }} />)}
                                    </span>
                                    }
                                </span>
                                )}
                            />
                          </Table>
                        : ''}
                        {this.state.proViewDetail.designSource == 2 ? // 设计师显示sku规格
                          <Table dataSource={this.state.proViewDetail.textures} {...tableState}>
                            <Column
                              title="材质"
                              dataIndex="textureName"
                              key="textureName"
                              />
                            <Column
                              title="重量/g"
                              dataIndex="textureWeight"
                              key="textureWeight"
                            />
                            {self.state.proViewDetail.referencePriceTF ?
                              <Column
                                title="预估成本价/￥"
                                dataIndex="referencePrice"
                                key="referencePrice"
                              />
                               : null
                            }
                            <Column
                              title="建议售价/￥"
                              dataIndex="texturePrice"
                              key="texturePrice"
                                />
                            <Column
                              title="零售价/￥"
                              key="sellPrice"
                              render={(text, record, ind) => (
                                <span>
                                  {!self.state.editPriceTf ?
                                    <span>
                                      {record.sellPrice}
                                    </span>
                                    :
                                    <span>
                                      {getFieldDecorator(`proSellPrice_${ind}`, {
                                        initialValue: record.sellPrice,
                                      })(<InputNumber placeholder="零售价" min={0} size="large" style={{ width: 138 }} />)}
                                    </span>
                                    }
                                </span>
                                )}
                                />
                            <Column
                              title={
                                <span>
                                  "批发价/￥"
                                  {!self.state.editPriceTf ?
                                    <span>
                                      <span onClick={self.editPriceInd} className={styles.redTxt}>修改价格</span>
                                    </span>
                                      :
                                    <span>
                                      <span onClick={self.cancelPriceInd} className={styles.redTxt}>取消</span>
                                      {/* <span onClick={self.saveDesPriceInd} className={styles.redTxt}>保存</span> */}
                                    </span>
                                  }
                                </span>
                              }
                              key="salePrice"
                              render={(text, record, ind) => (
                                <span>
                                  {!self.state.editPriceTf ?
                                    <span>
                                      {record.salePrice}
                                    </span>
                                    :
                                    <span>
                                      {getFieldDecorator(`proSalePrice_${ind}`, {
                                        initialValue: record.salePrice,
                                      })(<InputNumber placeholder="批发价" min={0} size="large" style={{ width: 138 }} />)}
                                    </span>
                                    }
                                </span>
                                )}
                                />
                          </Table>
                        : ''}
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>
                      {this.state.proViewDetail.details ?
                        <span>
                          <div className={styles.mainTxt}>
                            图文详情
                          </div>
                          <div ref="imgTxtBackup" className="imgTxtBackup" />
                        </span>
                      : ''
                      }
                    </div>
                  </Col>
                </Row>
              </div>
            </Modal>
            <div className={styles.pagWrap}>
              <Pagination
                showSizeChanger onShowSizeChange={this.onShowSizeChange} current={pageIndex} total={totalNum} onChange={this.onChangPage}
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
