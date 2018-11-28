import React from 'react';
import { connect } from 'dva';
import { router } from 'react-router';
import PropTypes from 'prop-types';
import styles from './myShopFinishProduct.less';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select, Checkbox, message, Form, InputNumber, Popconfirm, Tabs, Pagination, Spin } from 'antd';

import Swiper from 'react-id-swiper';

const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
const { Column, ColumnGroup } = Table;// 表格属性
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

const tableState = {
  bordered: true,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
};
const swiperParams = {
  slidesPerView: 1,
  spaceBetween: 30,
  shouldSwiperUpdate: true,
  // centeredSlides: true,
  // pagination: {
  //   el: '.swiper-pagination',
  //   clickable: true,
  // },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
};

const proListData = [{}];
let proSelectEdList = [];

class myShopFinishProduct extends React.Component {

  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      cancelLoading: false, // 取消加载状态
      confirmLoading: false, // 确定加载状态
      hotGunLoading: false, // 甄选加载状态
      addPriceLoading: false, // 统一加价加载状态
      brandType: '',
      hotGun: '', // 甄选状态
      setStatus: '', // 设置零售价
      productStatus: '', // 上下架状态
      categoryId: '', // 分类id
      categoryList: [], // 产品分类接口数据
      categoryValue: '', // 产品分类选中信息

      crowdList: [], // 适合人群接口数据
      crowdValue: '', // 适合人群选中信息
      proDataList: [], // 产品接口数据
      proViewModalTF: false, // 产品详细弹窗
      proViewId: '', // 弹窗显示产品详细的ID
      proViewDetail: {}, // 弹窗显示产品详细的资料
      noModifyproViewDetail: {}, // 弹窗产品详细的资料(原始数据)
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
      hotGunCheck: false, // 甄选推荐款选择框
      unifyAddPriceTF: false, // 统一加价选择框
      changeAddPriceNumber: '1', // 统一加价类型PriceOne加价倍数，PriceTwo加价金额
      uniftAddPriceOne: '', // 统一加价倍数
      uniftAddPriceTwo: '', // 统一加价固定金额
      pageIndex: 1, // 当前页
      pageSize: 12, // 每页展示条数
      totalNum: 0, // 总条数
      MarkupPrice: '', // 查询产品加价类型
      MarkupTabNum: '1', // 加类显示tab第几项
      facAllList: [], // 全部供应商，
      desAllList: [], // 全部设计师，
      desSelectData: '', // 选择设计师ID
      SeriecsAllList: '', // 全部系列查询
      companyId: '', // 供应商ID
      designeId: '', // 设计师ID
      seriecsId: '', // 系列ID
      brandType: '', // 产品类型
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
      pictureIndex: 0, // 图片下标
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      proLoading: true, // 产品加载中属性
      editPriceTf: false, // 产品规格编辑状态
    };
    // 定义全局变量方法
  }
  componentDidMount() {
    // 查询产品数据信息
    // const params = { brandType: '' };
    // app.$api.selectStoreProductInfo(params).then((res) => {
    //   this.setState({
    //     proDataList: res.data,
    //   });
    // });

    // 成品款查询加价信息
    this.viewMarkupPrice();
    this.getlist(1, 12);
    // 查询分类数据信息
    app.$api.selectCategoryNumber().then((res) => {
      const tempData = res.data;
      tempData.unshift({ id: '', commonName: '全部' });

      this.setState({
        categoryList: tempData,
      });
    });
    // 查询所有设计师
    app.$api.selectStoreBrandDesigner().then((res) => {
      const tempData = res.data;
      this.setState({
        desAllList: tempData,
      });
      // console.log(res.data);
    });

    // 查询所有供应商
    app.$api.selectStoreBrandCompany().then((res) => {
      const tempData = res.data;
      this.setState({
        facAllList: tempData,
      });
    });

    // // 查询系列数据信息
    // app.$api.selectSeriecsListByOperateId().then((res) => {
    //   this.setState({
    //     SeriecsAllList: res.data,
    //   });
    // });

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
  viewMarkupPrice=() => {
    // 成品款查询加价信息
    app.$api.selectStoreMarkupPrice().then((res) => {
      if (res.data != undefined) {
        this.setState(() => ({
          MarkupPrice: res.data,
          // MarkupPrice: {},
          MarkupTabNum: JSON.stringify(res.data.markupType),
        }), () => {
          // console.log(this.state.MarkupTabNum);
        });
      } else {
        this.setState(() => ({
          MarkupPrice: '',
          MarkupTabNum: '1',
        }), () => {
          // console.log(this.state.MarkupTabNum);
        });
      }
    });
  }
  // 查询产品数据信息
  getlist = (pageIndex, pageSize) => {
    this.setState({
      proLoading: true,
    });
    const paramsOne = {
      hotGun: this.state.hotGun,
      brandType: this.state.brandType,
      setStatus: this.state.setStatus,
      productStatus: this.state.productStatus,
      categoryId: this.state.categoryId,
      companyId: this.state.companyId,
      designeId: this.state.designeId,
      seriecsId: this.state.seriecsId,
      page: pageIndex,
      rows: pageSize,
    };
    // const params = app.$v.deleteEmptykey(paramsOne);
    app.$api.selectStoreProductInfo(paramsOne).then((res) => {
      if (res.data) {
        // console.log(this.state.MarkupPrice)
        const tempOBJ = res.data.data;
        tempOBJ.forEach((item) => {
          item.checked = false;
        });
        if (this.state.MarkupPrice != '') {
          if (this.state.MarkupPrice.markupType == 1) {
            // console.log('倍数');
            tempOBJ.forEach((item) => {
              item.salePriceNum = (parseFloat(item.combinationPrice) * this.state.MarkupPrice.multiple).toFixed(2);
            });
            // console.log(tempOBJ);
          } else if (this.state.MarkupPrice.markupType == 2) {
            // console.log('金额加价');
            tempOBJ.forEach((item) => {
              item.salePriceNum = (parseFloat(item.combinationPrice) + this.state.MarkupPrice.raisePrice).toFixed(2);
            });
            // console.log(tempOBJ);
          }
          this.setState({
            proDataList: tempOBJ,
            totalNum: res.data.rowSize,
          });
        } else {
          this.setState({
            proDataList: tempOBJ,
            totalNum: res.data.rowSize,
          });
        }
        // console.log('全部数据');
        // console.log(this.state.proDataList);
      } else {
        this.setState({
          proDataList: [],
          totalNum: 0,
        });
      }
    });
    this.setState(() => ({
      checkAll: false,
      proLoading: false,
    }), () => {
      proSelectEdList = [];
    });
  }

  proSelectChange(checkedValues) {
    // console.log('checked = ', checkedValues);
    proSelectEdList = checkedValues;
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
    console.log(this.state.proDataList);
    proSelectEdList = [];
    if (res) {
      this.state.proDataList.forEach((tip) => {
        if (tip.productStatus != 3) {
          proSelectEdList.push(tip.productId);
        }
      });
    }
    console.log('总数量id');
    console.log(proSelectEdList);
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
      this.passiveAllCheck();
      if (e.target.checked) {
        // console.log('选中');
        // console.log(proSelectEdList);
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

  // 甄选推荐款
  hotGunCheckChange=(e) => {
    // const allSelectList = [];
    proSelectEdList = [];
    // console.log('正选');
    if (!e.target.checked) {
      this.setState(() => ({
        pageIndex: 1,
        pageSize: 12,
        hotGun: '',
        hotGunCheckTF: e.target.checked,
      }), () => {
        this.getlist(1, 12);
      });
    } else {
      this.setState(() => ({
        pageIndex: 1,
        pageSize: 12,
        hotGun: 2,
        hotGunCheckTF: e.target.checked,
      }), () => {
        this.getlist(1, 12);
      });
    }
  }
  // 打开产品详细资料+弹窗
  showModal(elem) {
    const self = this;
    const params = { id: elem };
    this.state.ModelAmount = '';
    app.$api.findStoreBrandProductById(params).then((res) => {
      const tempList = [];
      // console.log(res.data);
      // console.log(res.data.designs);
      const tempObj = res.data;
      if (tempObj.designs && tempObj.designs.length != 0) {
        // console.log(tempObj.designs)
        if (tempObj.designs[0].designValue != undefined) {
          tempObj.designs.forEach((ielem, indOne) => {
            ielem.sizeList = ielem.designValue.split(',');
          });
        } else {
          tempObj.sizeList = [''];
        }
      }


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


      this.setState({
        proViewDetail: tempObj,
        noModifyproViewDetail: res.data,
        proImgBigUrl: res.data.images[0].imageUrl,
        designsListOne: tempList,
        proImgList: res.data.images,
      });
      // console.log(this.state.proImgList);
      this.setState({
        proViewModalTF: true,
        proViewId: elem,
        threeDImgDisplayTf: false,
        tempOneDis: true,
        editPriceTf: false,
      }, () => {
        if (this.state.proViewDetail.details) {
          setTimeout(() => {
            self.refs.imgTxtBackup.innerHTML = self.state.proViewDetail.details;
          }, 200);
        }
      });
    });
  }


  // {
  //   this.state.MarkupPrice.id != undefined ? <Checkbox value={ielem.productId} checked={ielem.checked} hotGun ={ielem.hotGun} onChange={this.singleElection}/>
  // : (ielem.productStatus == 6 && ielem.setStatus == 1 && ielem.brandType == 1 ? '' : <Checkbox value={ielem.productId} checked={ielem.checked} hotGun ={ielem.hotGun} onChange={this.singleElection}/>)
  // }

  // 打开‘发布上架’按钮  （productStatus == 6 下架）
  addGround = () => {
    // console.log('发布上架');
    // console.log(proSelectEdList);
    // console.log(this.state.proDataList);

    const subData = [];
    if (proSelectEdList.length != 0) {
      // proSelectEdList.forEach((item) => {
      //   this.state.proDataList.forEach((sign) => {

      //   });
      // });

      if (this.state.MarkupPrice.id != undefined) {
        proSelectEdList.forEach((item) => {
          // console.log('aaa');
          subData.push(item);
        });
      } else {
        // console.log('bbb');
        this.state.proDataList.forEach((sign) => {
          if (sign.productStatus == 6 && sign.setStatus == 1 && sign.brandType == 1) {
            // console.log('ccc');
            // continue
          } else {
            proSelectEdList.forEach((once) => {
              if (sign.productId == once) {
                // console.log('ddd');
                subData.push(once);
              }
            });
          }
        });
      }


      // console.log('没有零售价继续执行');
      // 没有零售价继续执行
      // console.log(subData);
      if (subData.length == 0) {
        message.warning('抱歉，请选择您要上下架的产品！');
        return;
      }

      const upData = [];
      let viewState = false;
      subData.forEach((item) => {
        this.state.proDataList.forEach((sing) => {
          if (item == sing.productId && sing.productStatus == 1) {
            upData.push(sing.productId);
            viewState = true;
          }
        });
      });

      if (upData.length == subData.length) {
        message.warning('抱歉，您选择的产品已经上架了！');
        return;
      }

      if (viewState) {
        message.warning('抱歉，您选择的产品有已经上架的，请重新选择！');
        return;
      }

      const params = { id: subData.join(','), productStatus: 1 };

      this.setState({
        confirmLoading: true,
      });
      app.$api.updateStoreBrandProductStatus(params).then((res) => {
        message.success('产品发布上架成功，正在刷新页面');
        // thiselem.componentDidMount();
        this.setState(() => ({
          // pageIndex: 1,
          // pageSize: 12,
          proViewModalTF: false,
          checkAll: false,
          confirmLoading: false,
        }), () => {
          this.getlist(this.state.pageIndex, this.state.pageSize);
          proSelectEdList = [];
        });
      }).catch(() => {
        this.setState({
          confirmLoading: false,
        });
      });
    } else {
      // message.error('还未选择产品，请重新选择！');
      message.warning('抱歉，请选择您要上下架的产品！');
    }
  }

  // 打开‘取消上架’按钮
  cancelGround = () => {
    // console.log('取消下架！');
    const submintData = [];
    if (proSelectEdList.length != 0) {
      this.state.proDataList.forEach((item) => {
        proSelectEdList.forEach((sign) => {
          if (item.productStatus != 6 && item.productId == sign) {
            submintData.push(sign);
          }
        });
      });
      if (submintData.length == 0) {
        message.warning('抱歉！您选择的产品已经下架了！');
        return;
      }

      let viewState = false;
      this.state.proDataList.forEach((item) => {
        proSelectEdList.forEach((sign) => {
          if (item.productStatus == 6 && item.productId == sign) {
            viewState = true;
          }
        });
      });

      if (viewState) {
        message.warning('抱歉！您选择的产品有已经下架的，请重新选择！');
        return;
      }

      this.setState({
        cancelLoading: true,
      });
      const params = { id: submintData.join(','), productStatus: 6 };
      app.$api.updateStoreBrandProductStatus(params).then((res) => {
        message.success('产品取消上架成功，正在刷新页面');
        // thiselem.componentDidMount();
        // this.getlist(1, 12);
        this.setState(() => ({
          // pageIndex: 1,
          // pageSize: 12,
          proViewModalTF: false,
          checkAll: false,
          cancelLoading: false,
        }), () => {
          this.getlist(this.state.pageIndex, this.state.pageSize);
          proSelectEdList = [];
        });
      }).catch(() => {
        this.setState({
          cancelLoading: false,
        });
      });
    } else {
      // message.error('还未选择产品，请重新选择！');
      message.warning('抱歉，请选择您要上下架的产品！');
    }
  }
    // 删除产品
  delPro(thiselem) {
    if (proSelectEdList.length != 0) {

      let result = false;
      thiselem.state.proDataList.forEach((ielem, ind) => {
        proSelectEdList.forEach((jelem) => {
          if (ielem.productId == jelem && ielem.productStatus == 1) {
            result = true;
          }
        });
      });

      if (result) {
        message.error('抱歉，已上架的产品不能删除！');
        return;
      }
      const params = { id: proSelectEdList.join(',') };
      app.$api.deleteStoreBrandProduct(params).then((res) => {
        message.success('产品删除成功，正在刷新页面');
          // thiselem.componentDidMount();
        thiselem.setState(() => ({
          proViewModalTF: false,
          checkAll: false,
          pageIndex: 1,
        }), () => {
          this.getlist(this.state.pageIndex, this.state.pageSize);
          proSelectEdList = [];
        });
      });

    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }
  // 打开‘上传产品’按钮
  uploadPro(thiselem) {
    thiselem.context.router.push('/MyShop/uploadPro');
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
    // console.log(self.state);
  }
  // 取消加价
  cancelAddPrice = () => {
    this.setState({
      unifyAddPriceTF: false,
    });
  }
    // 统一加价弹框
  unifyAddPrice=() => {
    // console.log('唐匡');
    this.props.form.resetFields();
    const self = this;
    // this.viewMarkupPrice();
      // 成品款查询加价信息
    if (self.state.MarkupPrice.markupType != undefined) {
      // console.log('进来1');
      self.setState(() => ({
        MarkupTabNum: JSON.stringify(self.state.MarkupPrice.markupType),
      }), () => {
        if (self.state.MarkupPrice.id == undefined) {
          self.setState({
            uniftAddPriceOne: '', // 统一加价倍数
            uniftAddPriceTwo: '', // 统一加价固定金额
            unifyAddPriceTF: true,
          });
        } else {

          self.setState({
            uniftAddPriceOne: self.state.MarkupPrice.multiple ? self.state.MarkupPrice.multiple : '', // 统一加价倍数
            uniftAddPriceTwo: self.state.MarkupPrice.raisePrice ? self.state.MarkupPrice.raisePrice : '', // 统一加价固定金额
            unifyAddPriceTF: true,
          });
        }
      });
    } else {
      // console.log('进来2');
      self.setState(() => ({
        MarkupTabNum: '1',
        unifyAddPriceTF: true,
      }));
    }


    // setTimeout(() => {
    //   if (self.state.MarkupPrice == '') {
    //     self.setState({
    //       uniftAddPriceOne: 0, // 统一加价倍数
    //       uniftAddPriceTwo: 0, // 统一加价固定金额
    //       unifyAddPriceTF: true,
    //     });
    //   } else {
    //     self.setState({
    //       uniftAddPriceOne: self.state.MarkupPrice.multiple ? self.state.MarkupPrice.multiple : 0, // 统一加价倍数
    //       uniftAddPriceTwo: self.state.MarkupPrice.raisePrice ? self.state.MarkupPrice.raisePrice : 0, // 统一加价固定金额
    //       unifyAddPriceTF: true,
    //     });
    //   }
    // }, 500);
  }
  // 统一加价
  confirmAddPrice = () => {
    // console.log('数据');
    const self = this;
    this.setState({
      addPriceLoading: true,
    });
    self.props.form.validateFields((err, values) => {
      switch (self.state.changeAddPriceNumber) {
        case '1':// 统一加价倍数
          if (self.state.MarkupPrice.id == undefined) {
            const params = {
              multiple: values.uniftAddPriceOne,
              markupType: 1,
            };
            app.$api.addMarkupPrice(params).then((res) => {
              message.success(res.msg);
              self.setState(() => ({
                unifyAddPriceTF: false,
                uniftAddPriceOne: '', // 统一加价倍数
                uniftAddPriceTwo: '', // 统一加价固定金额
                addPriceLoading: false,
              }), () => {
                self.getlist(self.state.pageIndex, self.state.pageSize);
                self.viewMarkupPrice();
              });
            });
          } else {
            if (values.uniftAddPriceOne == 0) {
              message.success('统一加价格式不对，请重新输入！');
              self.setState({
                addPriceLoading: false,
              });
              break;
            }
            // console.log(values.uniftAddPriceOne);
            const params = {
              id: this.state.MarkupPrice.id,
              multiple: values.uniftAddPriceOne,
              markupType: 1,
            };
            app.$api.updataMarkupPrice(params).then((res) => {
              message.success(res.msg);
              self.setState(() => ({
                unifyAddPriceTF: false,
                uniftAddPriceOne: '', // 统一加价倍数
                uniftAddPriceTwo: '', // 统一加价固定金额
                addPriceLoading: false,
              }), () => {
                self.getlist(self.state.pageIndex, self.state.pageSize);
                self.viewMarkupPrice();
              });
            });
          }

          break;
        case '2':// 统一加价固定金额
          // console.log('我是2');
          if (values.uniftAddPriceTwo == 0) {
            message.success('统一加价格式不对，请重新输入！');
            self.setState({
              addPriceLoading: false,
            });
            break;
          }
          // console.log(self.state.MarkupPrice.id);
          if (self.state.MarkupPrice.id == undefined) {
            console.log('新增2');
            const params = {
              raisePrice: values.uniftAddPriceTwo,
              markupType: 2,
            };
            app.$api.addMarkupPrice(params).then((res) => {
              message.success(res.msg);
              self.setState(() => ({
                unifyAddPriceTF: false,
                uniftAddPriceOne: '', // 统一加价倍数
                uniftAddPriceTwo: '', // 统一加价固定金额
                addPriceLoading: false,
              }), () => {
                self.getlist(self.state.pageIndex, self.state.pageSize);
                self.viewMarkupPrice();
              });
            });
          } else {
            // console.log('编辑2');
            const params = {
              id: this.state.MarkupPrice.id,
              raisePrice: values.uniftAddPriceTwo,
              markupType: 2,
            };
            app.$api.updataMarkupPrice(params).then((res) => {
              message.success(res.msg);
              self.setState(() => ({
                unifyAddPriceTF: false,
                uniftAddPriceOne: '', // 统一加价倍数
                uniftAddPriceTwo: '', // 统一加价固定金额
                addPriceLoading: false,
              }), () => {
                self.getlist(self.state.pageIndex, self.state.pageSize);
                self.viewMarkupPrice();
              });
            });
          }

          break;
      }
    });
    // this.setState({
    //   // unifyAddPriceTF: false,
    //   uniftAddPriceOne: 0, // 统一加价倍数
    //   uniftAddPriceTwo: 0, // 统一加价固定金额
    // });
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
      const params = { productStr: JSON.stringify(self.state.productStr) };
      // 提交新产品参数
      app.$api.addProductNumber(params).then((res) => {
        self.context.router.push('/MyFactory/proManage');
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

      // 提交新产品参数
      const params = { productStr: JSON.stringify(self.state.productStr) };
      // 提交新产品参数
      // app.$api.addProductNumber(params).then((res) => {
      //   self.context.router.push('/MyFactory/proManage');
      // });
    });
  };

  // 保存金价
  savePrice=() => {
    const tempPriceList = [];
    let returnTF = false;
    this.props.form.validateFields((err, values) => {
      for (let i = 0; i < this.state.proViewDetail.textures.length; i++) {
        if (!values[`proPrice_${i}`]) {
          message.error('零售价还有未填，请重新填写再重新提交！');
          returnTF = true;
          return;
        }
        const tempObj = {
          textureId: this.state.proViewDetail.textures[i].id,
          combinationPrice: this.state.proViewDetail.textures[i].texturePrice,
          resalePrice: values[`proPrice_${i}`],
        };
        tempPriceList.push(tempObj);
      }
    });
    if (returnTF) { return; }
    const submitObj = {
      id: this.state.proViewDetail.id,
      updateStatus: 0,
      storeTextureFroms: tempPriceList,
    };
    const params = { productStr: JSON.stringify(submitObj) };
    app.$api.saveStoreBrandProductDetail(params).then((res) => {
      message.success(res.msg);
      this.setState({
        proViewModalTF: false,
        proViewDetail: {},
      });
      this.componentDidMount();
    });
  }
  // 保存并保存上架
  saveAndUpPrice = () => {
    // console.log('上架');
    const tempPriceList = [];
    let returnTF = false;
    // console.log(this.state.proViewDetail.textures);
    // console.log('--------------');
    // console.log(this.state.noModifyproViewDetail.textures);
    this.props.form.validateFields((err, values) => {
      for (let i = 0; i < this.state.proViewDetail.textures.length; i++) {
        if (!values[`proPrice_${i}`] && this.state.editPriceTf) {
          message.error('零售价还有未填，请重新填写再重新提交！');
          returnTF = true;
          return;
        }
        const tempObj = {
          textureId: this.state.proViewDetail.textures[i].id,
          combinationPrice: this.state.proViewDetail.textures[i].texturePrice,
          resalePrice: values[`proPrice_${i}`] ? values[`proPrice_${i}`] : this.state.proViewDetail.textures[i].salePrice,
        };
        tempPriceList.push(tempObj);
      }
    });
    // console.log('编辑的数据');
    // console.log(tempPriceList);

    const modifyData = [];
    const showData = this.state.proViewDetail.textures;
    if (tempPriceList.length != 0) {
      for (let i = 0; i < showData.length; i++) {
        for (let j = 0; j < tempPriceList.length; j++) {
          if (showData[i].id == tempPriceList[j].textureId && showData[i].salePrice != tempPriceList[j].resalePrice) {
            modifyData.push(tempPriceList[j]);
          }
        }
      }
    }


    if (returnTF) { return; }
    const submitObj = {
      id: this.state.proViewDetail.id,
      updateStatus: 1,
      storeTextureFroms: modifyData,
    };
    const params = { productStr: JSON.stringify(submitObj) };
    app.$api.saveStoreBrandProductDetail(params).then((res) => {
      message.success(res.msg);
      this.setState({
        proViewModalTF: false,
        proViewDetail: {},
      });

      this.componentDidMount();
    });
  }

  // 改变类别事件
  changeCate(e, thiselem) {
    thiselem.setState(() => ({
      pageIndex: 1,
      pageSize: 12,
      categoryId: e,
      checkAll: false,
    }), () => {
      proSelectEdList = [];
      this.getlist(1, 12);
    });
  }

  // 改变状态
  changeStatus(e, thiselem) {
    thiselem.setState(() => ({
      pageIndex: 1,
      pageSize: 12,
      productStatus: e,
      checkAll: false,
    }), () => {
      proSelectEdList = [];
      this.getlist(1, 12);
    });
  }

  // 改变审核中状态
  changeAudit(e, thiselem) {
    // console.log('审核');
    if (e.target.checked == true) {
      // thiselem.state.auditStatus = 1;
      this.setState(() => ({
        setStatus: 1,
      }), () => {
        this.getlist(1, 12);
      });
    } else {
      // thiselem.state.auditStatus = '';
      this.setState(() => ({
        setStatus: '',
      }), () => {
        this.getlist(1, 12);
      });
    }
    // const params = { categoryId: thiselem.state.categoryId, productStatus: thiselem.state.productStatus, setStatus: thiselem.state.auditStatus };
    // 查询产品数据信息
    // app.$api.selectStoreProductInfo(params).then((res) => {
    //   let tempList;
    //   if (res.data) {
    //     tempList = res.data;
    //   } else {
    //     tempList = [];
    //   }
    //   tempList.forEach((item) => {
    //     item.checked = true;
    //   });
    //   this.setState({
    //     proDataList: tempList,
    //   });
    // });
  }
  // 设置为甄选款
  addHotGunPro = () => {

    if (proSelectEdList.length != 0) {
      let statusOne = false;
      this.state.proDataList.forEach((item) => {
        proSelectEdList.forEach((sign) => {
          if (item.productStatus == 6 && item.productId == sign) {
            statusOne = true;

          }
        });
      });
      if (statusOne) {
        message.warning('抱歉，下架的产品不能设置为甄选款！');
        return;
      }

      let statusTwo = false;
      this.state.proDataList.forEach((item) => {
        proSelectEdList.forEach((sign) => {
          if (item.hotGun == 2 && item.productId == sign) {
            statusTwo = true;

          }
        });
      });
      if (statusTwo) {
        message.warning('抱歉，选中的产品有甄选款，请重新选择！');
        return;
      }

      // console.log(proSelectEdList);
      const params = { ids: proSelectEdList.join(','), hotgun: '2' };
      this.setState({
        hotGunLoading: true,
      });
      app.$api.choseProductToHotgun(params).then((res) => {
        // console.log('进入正选12');
        message.success(res.msg);
        // this.setState(() => ({
        //   pageIndex: 1,
        //   pageSize: 12,
        // }), () => {
        //   this.getlist(1, 12);
        // });
        this.setState({
          hotGunLoading: false,
        });
        this.getlist(this.state.pageIndex, this.state.pageSize);
        proSelectEdList = [];
      }).catch((err) => {
        this.setState({
          hotGunLoading: false,
        });
      });

    } else {
      // message.error('还未选择产品，请重新选择！');
      message.warning('抱歉，请选择您要上下架的产品！');
    }
  }
    // 取消设为甄选款
  cancelHotGunPro = () => {
    if (proSelectEdList.length == 0) {
      // message.error('还未选择产品，请重新选择！');
      message.warning('抱歉，您还没选择产品！');
      return;
    }

    let tip = false;
    // console.log('全部数据');
    // console.log(proSelectEdList);
    // console.log(this.state.proDataList);
    this.state.proDataList.forEach((item) => {
      proSelectEdList.forEach((sign) => {
        if (item.productId == sign && item.hotGun == 1) {
          tip = true;
        }
      });
    });

    if (tip) {
      message.error('只有甄选款的产品才能进行取消操作，请确保选中的都是甄选款的产品！');
      return;
    }

    const params = { ids: proSelectEdList.join(','), hotgun: '1' };
    app.$api.choseProductToHotgun(params).then((res) => {
      message.success(res.msg);
      this.getlist(this.state.pageIndex, this.state.pageSize);
      proSelectEdList = [];
    });
  }

  // 切换加数类型
  changeAddPriceTab=(e) => {
    this.setState({
      changeAddPriceNumber: e,
      MarkupTabNum: e,
    });
  }


  // 分页
  onShowSizeChange = (current, pageSize) => {
    this.setState(() => ({
      pageSize,
      checkAll: false,
    }), () => {
      this.getlist(1, pageSize);
      proSelectEdList = [];
    });
  }

  onChangPage = (page, pageSize) => {
    this.setState(() => ({
      pageIndex: page,
      checkAll: false,
    }), () => {
      this.getlist(page, pageSize);
      proSelectEdList = [];
    });
  }

  // 改变款式类型，0为全部，1为供应商款，2为设计师款
  changeProDes(e, thiselem) {
    // console.log(e);
    this.setState(() => ({
      brandType: e,
      designeId: '',
      seriecsId: '',
      companyId: '',
      pageIndex: 1,
      pageSize: 12,
      checkAll: false,
    }), () => {
      proSelectEdList = [];
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
      designeId: e,
      pageIndex: 1,
      pageSize: 12,
      checkAll: false,
    }), () => {
      proSelectEdList = [];
      this.getlist(1, 12);
    });
  }
  // 改变系列
  changeSeriecsSelect=(e) => {
    const self = this;
    // console.log(this.state.brandType);
    // console.log(e);
    this.setState(() => ({
      seriecsId: e,
      pageIndex: 1,
      pageSize: 12,
      checkAll: false,
    }), () => {
      proSelectEdList = [];
      this.getlist(1, 12);
    });
  }
  // 改变供应商
  changeFacSelect=(e) => {
    const self = this;
    // console.log(this.state.brandType);
    // console.log(e);
    this.setState(() => ({
      companyId: e,
      designeId: '',
      seriecsId: '',
      pageIndex: 1,
      pageSize: 12,
      checkAll: false,
    }), () => {
      proSelectEdList = [];
      this.getlist(1, 12);
    });
  }
  // 店铺产品详细下架操作
  downFrame=() => {
    const self = this;
    const params = { id: self.state.proViewDetail.id, productStatus: 6 };
    app.$api.updateStoreBrandProductStatus(params).then((res) => {
      message.success(res.msg);
      self.setState({
        proViewModalTF: false,
      });
      self.getlist(1, 12);
    });
  }
    // 店铺产品详细上架操作
  upFrame=() => {
    const self = this;
    const params = { id: self.state.proViewDetail.id, productStatus: 1 };
    app.$api.updateStoreBrandProductStatus(params).then((res) => {
      message.success(res.msg);
      self.setState({
        proViewModalTF: false,
      });
      self.getlist(1, 12);
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
    app.$api.selectStoreFigureThumbUrl(params).then((res) => {
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
            // console.log($('.panorama_box'));
            // $('.panorama_box').html();
            if (result) {
              self.setState(() => ({
                pictureIndex: i,
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
            console.log('图片数据');
            console.log(proImgList);
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
            <span className={styles.marginLeft14}>
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
                    <Option value={data.companyId}>{data.companyName}</Option>,
                  )}
                </Select>
                 : ''
              }
              {this.state.brandType == '2' ?
                <span>
                  <Select defaultValue="全部设计师" style={{ width: 120, marginLeft: 10 }} onChange={event => self.changeDesSelect(event)}>
                    <Option value="">全部设计师</Option>
                    {this.state.desAllList.map(data =>
                      <Option value={data.designerId}>{data.designerName}</Option>,
                    )}
                  </Select>
                  {/* {this.state.SeriecsAllList} */}
                  {this.state.SeriecsAllList != '' ?
                    <Select defaultValue="" style={{ width: 120, marginLeft: 10 }} onChange={event => self.changeSeriecsSelect(event)}>
                      <Option value="">全部系列</Option>
                      {this.state.SeriecsAllList.map(data =>
                        <Option value={data.id}>{data.seriecsName}</Option>,
                      )}
                    </Select>
                  : ''
                  }
                </span>
                : ''
              }

            </span>
            <span className={styles.marginLeft14}>
              类别：
              <Select defaultValue="全部" style={{ width: 100 }} onChange={event => self.changeCate(event, self)}>
                {this.state.categoryList.map(data =>
                  <Option value={data.id}>{data.commonName}</Option>,
                )}
              </Select>
            </span>
            <span className={styles.marginLeft14}>
              状态：
              <Select defaultValue="全部" style={{ width: 100 }} onChange={event => self.changeStatus(event, self)}>
                <Option value="">全部</Option>
                <Option value="1">已上架</Option>
                <Option value="6">未上架</Option>
              </Select>
            </span>
            <span>
              {/* <Checkbox onChange={event => self.changeAudit(event, self)}>未设置零售价</Checkbox> */}
              {self.state.brandType != '2' ?
                <span className={styles.redtxt} onClick={self.unifyAddPrice} style={{ color: 'red' }}>统一加价</span>
                : ''
              }

              <Modal
                visible={this.state.unifyAddPriceTF}
                footer={null}
                onCancel={self.cancelAddPrice}
              >
                <div className={styles.unifyAddPriceDiv}>
                  {/* <Tabs defaultActiveKey={this.state.MarkupTabNum} onChange={self.changeAddPriceTab} > */}
                  <Tabs defaultActiveKey={this.state.MarkupTabNum} onChange={self.changeAddPriceTab} >
                    <TabPane tab="倍数加价" key="1">
                      批发价X
                      {getFieldDecorator('uniftAddPriceOne', {
                        initialValue: self.state.uniftAddPriceOne,
                      })(<InputNumber placeholder="加价倍数" className={styles.inputOne} min={0} />)}
                       倍
                    </TabPane>
                    <TabPane tab="金额加价" key="2">
                    加价金额
                    {getFieldDecorator('uniftAddPriceTwo', {
                      initialValue: self.state.uniftAddPriceTwo,
                    })(<InputNumber placeholder="加价金额" className={styles.inputOne} min={0} />)}
                    .00
                    </TabPane>
                  </Tabs>
                  <div className={styles.textCenter}>
                    <Button type="primary" className={styles.buttonOne} onClick={self.cancelAddPrice} loading={this.state.addPriceLoading}>取消加价</Button>
                    <Button type="primary" className={styles.buttonOne} onClick={self.confirmAddPrice} loading={this.state.addPriceLoading}>确认加价</Button>
                  </div>
                </div>
              </Modal>
            </span>
          </span>
        </div>
        <div className={styles.hr} />
        <div>
          <Row>
            <Col span={4}>
              {/* <Button type="primary" onClick={() => self.uploadPro(this)}>上传产品</Button> */}
            </Col>
            <Col span={10}>
              <Checkbox
                onChange={this.hotGunCheckChange}
                checked={this.state.hotGunCheckTF}
              >甄选推荐款</Checkbox>
              <Button type="primary" className={styles.marginLeft30} onClick={this.addHotGunPro} loading={this.state.hotGunLoading}>设置为甄选推荐款</Button>
              <span className={styles.redtxt} onClick={this.cancelHotGunPro} >取消设置</span>
            </Col>
            <Col span={10} className={styles.textRight}>
              <Checkbox
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >全选</Checkbox>
              <Popconfirm title="确定取消上架所选产品?" onConfirm={self.cancelGround} okText="确定取消上架" cancelText="取消">
                <Button type="primary" className={styles.marginLeft30} loading={this.state.cancelLoading}>取消上架</Button>
              </Popconfirm>
              <Popconfirm title="确定发布上架所选产品?" onConfirm={self.addGround} okText="确定上架" cancelText="取消">
                <Button type="primary" className={styles.marginLeft30} loading={this.state.confirmLoading}>发布上架</Button>
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
                              <div className={styles.imgTop} >
                                <span className={styles.imgTopTxt} onClick={() => self.showModal(ielem.productId)} >
                                  {/* {ielem.productStatus == 0 ? '暂存' : ''} */}
                                  {ielem.productStatus == 1 ? '已上架' : ''}
                                  {/* {ielem.productStatus == 2 ? '下架' : ''} */}
                                  {ielem.productStatus == 3 ? '审核中' : ''}
                                </span>
                                {ielem.productStatus == 6 || ielem.productStatus == 0 ? <div className={styles.underFrame} onClick={() => self.showModal(ielem.productId)} >已下架</div> : ''}
                                <span className={styles.imgTopTxt} onClick={() => self.showModal(ielem.productId)} >
                                  {this.state.MarkupPrice.markupType == '' ?
                                    <span>
                                      {ielem.productStatus != 3 ? '未设置零售价' : ''}
                                    </span>
                                : ''
                              }
                                </span>
                                {/* <Checkbox value={ielem.productId} /> */}
                                {/* {ielem.checked == true ? 'true' : 'false'} */}

                                {/* {
                                this.state.MarkupPrice.id == undefined && ielem.productStatus == 6 && ielem.setStatus == 1 && ielem.brandType == 1 ? ""
                              : <Checkbox value={ielem.productId} checked={ielem.checked} hotGun ={ielem.hotGun} onChange={this.singleElection}/>
                              } */}

                                {
                                this.state.MarkupPrice.id != undefined ? <Checkbox value={ielem.productId} checked={ielem.checked} hotGun={ielem.hotGun} onChange={this.singleElection} />
                              : (ielem.productStatus == 6 && ielem.setStatus == 1 && ielem.brandType == 1 ? '' : <Checkbox value={ielem.productId} checked={ielem.checked} hotGun={ielem.hotGun} onChange={this.singleElection} />)
                              }


                              </div>
                              <div>
                                {ielem.hotGun == 2 ? <span className={styles.hotTxt}>甄选款</span> : ''}
                                <img className={styles.hotImg} src={app.$http.imgURL + ielem.productImageUrl} onClick={() => self.showModal(ielem.productId)} />
                              </div>
                            </div>
                            <div className={styles.proDisplay} onClick={() => self.showModal(ielem.productId)}>
                              <p className={styles.proName}>{ielem.productName}</p>
                              <p className={styles.proPrice}>
                                {this.state.MarkupPrice.markupType == '' ?
                                  <span>
                                    {
                                    ielem.setStatus == 1 ?
                                      <span className={styles.yellowtxt}>设置售价</span>
                                    :
                                    ''
                                  }
                                  </span>
                                :
                                  <span>
                                    {ielem.resalePrice ?
                                      <span>零售价￥{ielem.resalePrice}</span>
                                  :
                                      <span>零售价￥{ielem.combinationPrice}</span>
                                  }
                                  </span>
                              }
                              </p>
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
                <div className={styles.modalFooter}>
                  {this.state.proViewDetail.designSource == 1 ?
                    <div>
                      {this.state.editPriceTf ?
                        <Popconfirm title="确定保存所修改价格?" onConfirm={self.savePrice} okText="确定保存" cancelText="取消">
                          <Button className="bottonPublic" type="primary">
                              保存
                          </Button>
                        </Popconfirm>
                        : null
                      }

                      {this.state.proViewDetail.productStatus != 1 ?
                        <Popconfirm title="确定发布上架?" onConfirm={self.saveAndUpPrice} okText="确定上架" cancelText="取消">
                          <Button className="bottonPublic" type="primary" >
                            发布上架
                          </Button>
                        </Popconfirm>
                      :
                        <Popconfirm title="确定取消上架?" onConfirm={self.downFrame} okText="确定取消上架" cancelText="取消">
                          <Button className="bottonPublic" type="primary">
                            取消上架
                          </Button>
                        </Popconfirm>
                      }
                    </div>
                   : ''
                  }
                  {this.state.proViewDetail.designSource == 2 ?
                    <div>
                      {this.state.proViewDetail.productStatus == 1 ?
                        <Popconfirm title="确定取消上架?" onConfirm={self.downFrame} okText="确定取消上架" cancelText="取消">
                          <Button className="bottonPublic" type="primary">
                            取消上架
                          </Button>
                        </Popconfirm>
                        : ''
                      }
                      {this.state.proViewDetail.productStatus == 6 ?
                        <Popconfirm title="确定发布上架?" onConfirm={self.upFrame} okText="确定上架" cancelText="取消">
                          <Button className="bottonPublic" type="primary">
                            发布上架
                          </Button>
                        </Popconfirm>
                       : ''
                      }
                    </div>
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
                      <div>
                        <div id="swiperWrapId">{this.state.proViewModalTF && (swiperLi(this.state.proImgList))}</div>
                      </div>
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
                            <Col span={24} className={styles.leftTxt}>供应商名称：<span className={styles.rightTxt}>{this.state.proViewDetail.companyName}</span></Col>
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
                          {this.state.proViewDetail.designSource == 1 ?
                            <Column
                              title="平台批发价/￥"
                              dataIndex="texturePrice"
                              key="texturePrice"
                            />
                            : ''
                          }
                          {this.state.proViewDetail.designSource == 2 ?
                            <Column
                              title="平台批发价/￥"
                              dataIndex="salePrice"
                              key="salePrice"
                            />
                            : ''
                          }
                          <Column
                            title={
                              <span>
                                零售价/￥
                                {this.state.proViewDetail.designSource == 1 ?
                                  (!self.state.editPriceTf ?
                                    <span>
                                      <span onClick={self.editPriceInd} className={styles.redTxt}>修改价格</span>
                                    </span>
                                      :
                                    <span>
                                      <span onClick={self.cancelPriceInd} className={styles.redTxt}>取消</span>
                                    </span>
                                  )
                                  : ''
                                }

                              </span>
                            }
                            key="sellPrice"
                            render={(text, record, ind) => (
                              <span>
                                {self.state.proViewDetail.designSource == 1 ?
                                  <span >
                                    {record.salePrice && record.salePrice != 'null' ?
                                      <span>
                                        {self.state.editPriceTf ?
                                          (getFieldDecorator(`proPrice_${ind}`, {
                                            initialValue: record.salePrice,
                                          })(<InputNumber min={0} placeholder="零售价" size="large" style={{ width: 138 }} />))
                                          :
                                          (record.salePrice)
                                        }

                                      </span>
                                    :
                                      <span>
                                        {getFieldDecorator(`proPrice_${ind}`, {
                                          initialValue: '',
                                        })(<InputNumber min={0} placeholder="零售价" size="large" style={{ width: 138 }} />)}
                                      </span>
                                    }
                                  </span>
                                  :
                                    ''
                                }
                                {this.state.proViewDetail.designSource == 2 ?
                                  <span>
                                    {record.sellPrice}
                                  </span>
                                  : ''
                                }
                              </span>
                            )}
                          />
                        </Table>
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

            {/* 分页 */}
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

myShopFinishProduct.propTypes = {

};

myShopFinishProduct.contextTypes = {
  router: PropTypes.object.isRequired,
};
const proManageFrom = Form.create()(myShopFinishProduct);
export default proManageFrom;
