import React from 'react';
import { connect } from 'dva';
import { router } from 'react-router';
import PropTypes from 'prop-types';
import styles from './designerCustomMade.less';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select, Checkbox, message, Form, InputNumber, Popconfirm, Pagination, Tabs, Spin } from 'antd';

import Swiper from 'react-id-swiper';

const { TextArea } = Input;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Column, ColumnGroup } = Table;// 表格属性
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const tableState = {
  bordered: true,
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
//   shouldSwiperUpdate:true,
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
      seriesList: [], // 产品系列搂口信息
      crowdList: [], // 适合人群接口数据
      crowdValue: '', // 适合人群选中信息
      seriesSelect: '0',
      seriesSelectNum: '0', // 选择产品系列无系列0，修改为1，新增系列为2
      proDataList: [], // 产品接口数据
      proViewModalTF: false, // 产品详细弹窗
      proModifyModalTF: false, // 修改产品弹窗
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
      serieId: '', // 系列ID
      onSale: '', // 空为全部，Y为上架 N下架
      statu: '', // 状态筛选1.上架，2、下架，3、审核中4待完善，5审核不通过
      classifyId: '', // 分类id
      pageIndex: 1, // 当前页
      pageSize: 12, // 每页展示条数
      totalNum: 0, // 总条数
      isAudit: '', // 审核中
      seriesSelectNum: '0', // 选择产品系列无系列0，修改为1，新增系列为2
      modifySeriesTF: false,
      serieDetai: '',
      // pictureIndex:0,//图片下标
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgData: {}, // 上传返回3D图包数组
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
      proLoading: true, // 产品加载中属性
      createSeriesLoading: false, // 创建系列loading
      saveLoading: false, // 创建产品loading
    };
    // 定义全局变量方法
  }
  componentDidMount() {
        // 查询产品数据信息
    this.getList(1, 12);

    // 查询所有的系列---设计师查看
    app.$api.querySeriesDesi().then((res) => {
      const tempData = res.data;
      this.setState({
        seriesList: tempData,
      });
    });
    // 查询分类数据信息
    app.$api.queryClassifyInfo().then((res) => {
      const tempData = res.data;
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

   // 查询产品数据信息
  getList = (pageIndex, pageSize) => {
    this.setState({
      proLoading: true,
    });
    const paramsOne = {
      companyId: this.state.companyId,
      onSale: this.state.onSale,
      statu: this.state.statu,
      productStatus: this.state.productStatus,
      classifyId: this.state.classifyId,
      serieId: this.state.serieId,
      isAudit: this.state.isAudit,
      page: pageIndex,
      rows: pageSize,
    };
    app.$api.getProductsByDesigner(paramsOne).then((res) => {
      if (res.data.data) {
        let tempList;
        if (res.data.data) {
          tempList = res.data.data;
        } else {
          tempList = [];
        }
        tempList.forEach((item) => {
          item.picUrlList = item.picUrl.split(',');
          item.checked = false;
        });
        this.setState({
          proDataList: tempList,
          totalNum: res.data.rowSize,
          proLoading: false,
        });
      } else {
        this.setState({
          proDataList: [],
          proLoading: false,
        });
      }


      // if (res.data) {
      //   this.setState({
      //     proDataList: res.data.data,
      //     totalNum: res.data.rowSize,
      //   });
      // } else {
      //   this.setState({
      //     proDataList: [],
      //   });
      // }
    });
  }

  // proSelectChange(checkedValues) {
  //   // console.log('checked = ', checkedValues);
  //   proSelectEdList = checkedValues;
  //   // console.log(proSelectEdList);

  // }
  // 全选/反选
  // onCheckAllChange = (e) => {
  //   const allSelectList = [];
  //   this.state.proDataList.forEach((ielem) => {
  //     allSelectList.push(ielem.productId);
  //   });
  //   this.setState({
  //     proSelectEdList: e.target.checked ? allSelectList : [],
  //     indeterminate: false,
  //     checkAll: e.target.checked,
  //   });
  // }

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


  // 打开产品详细资料+弹窗
  showModal(elem) {
    const self = this;

    if (elem.serieId) {
      self.setState({
        seriesSelect: '0',
      });
    } else {
      self.setState({
        seriesSelect: '1',
      });
    }
    // 材质下拉选择
    elem.skuPages.forEach((item) => {
      item.skuProps.forEach((jelem) => {
        // console.log(jelem)
        if (jelem.isScheduled == 'Y') {
          jelem.presetValueList = jelem.presetValue.split(',');
        }
      });
    });
    // 富文本图标功能
    const icons = self.getIcons();
    // 富文本图片上传功能
    const plugins = self.getPlugins();
    elem.manufacturePropSizes.forEach((item) => {
      item.proSizeList = item.propValue.split(',');
    });

    if (elem.picUrlList.length >= 3) {
      self.setState({
        ModelAmount: 3,
      });
    } else {
      self.setState({
        ModelAmount: elem.picUrlList.length,
      });
    }

    // loopStatu
    if (elem.picUrlList.length == 1) {
      self.setState({
        loopStatu: false,
      });
    } else {
      self.setState({
        loopStatu: true,
      });
    }

    // console.log(elem);
    const tempSkuDouList = [];
    const tempSkuManList = [];
    const tempSkuWomanList = [];
    elem.skuPages.forEach((ielem, indOne) => {
      // console.log(ielem);
      // console.log(ielem.skuProps[0]);
      if (ielem.skuProps[0].parentPropValue) {
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
      } else {
        switch (ielem.skuProps[0].propValue) {
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

    if (elem.serieId == 0) {
      elem.serieId = '';
    }
    if (elem.classifyName == '对戒') {
      // console.log('elem:');
      // console.log(elem);
      const params = { classifyId: elem.classifyId };
      let tempList = [];
      app.$api.queryClassifyProps(params).then((res) => {
        // console.log(res.data);

        const classifyList = res.data;
        const classifySkuSList = [];
        const classifySaleList = [];
        classifyList.forEach((item) => {
          if (item.inSale == 'Y') {
            classifySkuSList.push(item);
          } else if (item.inSale == 'N') {
            classifySaleList.push(item);
          }
        });
        // console.log('显示数据');
        // console.log(classifySaleList);
        // 产品sku数据列表
        classifySkuSList.forEach((itemY) => {
          if (itemY.isScheduled == 'Y') {
            itemY.presetList = itemY.presetValue.split(',');
          }
        });
        // console.log('尺寸');
        // console.log(classifySkuSList);
        res.data.forEach((itemP) => {
          if (itemP.cname == '规格') {
            tempList = [];
            itemP.presetList.forEach((itemZ) => {
              const tempListTwo = [];
              classifySkuSList.forEach((itemA) => {
                if (itemZ == itemA.parentPropValue) {
                  tempListTwo.push(itemA);
                }
              });
              const tempObj = { name: itemZ, propId: itemP.propId, value: [tempListTwo] };
              tempList.push(tempObj);
            });
          }
        });
        elem.skuAlldata = tempList;
        elem.skuDisList = [];
        elem.skuList.forEach((ielem) => {
          ielem.skuSList.forEach((jelem) => {
            const tempListOne = JSON.parse(JSON.stringify(tempList));
            tempListOne.forEach((welem) => {
              if (welem.name == jelem.skuProps[0].propValue) {
                welem.minPrice = jelem.minPrice;
                welem.value[0].forEach((relem) => {
                  jelem.skuProps.forEach((melem) => {
                    if (relem.propId == melem.propId) {
                      relem.propValue = melem.propValue;
                    }
                  });
                });
              }
            });

            jelem.skuAllList = tempListOne;
            // console.log(jelem.skuProps[0].parentPropValue)
            // console.log('结束：')

            let skuNum = 0;
            tempList.forEach((qelem, indOne) => {
              if (ielem.skuName == qelem.name) {
                skuNum = indOne;
              }
            });
            elem.skuDisList.push({ skuName: ielem.skuName, skuIndex: JSON.stringify(skuNum), skuData: jelem });
          });
        });
        // console.log(elem);
      });
    }

    self.setState({
      proViewDetail: elem,
      proImgBigUrl: elem.picUrlList[0],
      proViewModalTF: true,
      threeDImgDisplayTf: false,
      tempOneDis: true,
    });
  }
    // 修改产品sku数值
  changePresetFun = (e, ind) => {
    const self = this;
    self.state.proViewDetail.skuDisList[ind].skuName = self.state.proViewDetail.skuAlldata[e].name;
    self.state.proViewDetail.skuDisList[ind].skuIndex = e;
  }


  // 打开‘发布上架’按钮
  addGround = () => {
    const self = this;
    if (proSelectEdList.length != 0) {
      const params = { productIds: JSON.stringify(proSelectEdList), onSale: 'Y' };
      app.$api.updateSaleStatu(params).then((res) => {
        message.success('产品发布上架成功，正在刷新页面');
        self.setState({
          proModifyModalTF: false,
          proViewModalTF: false,
        }, () => {
          this.getList(this.state.pageIndex, this.state.pageSize);
          proSelectEdList = [];
        });
      });
    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }
    // 选择是新增系列还是选择原来系统
  clickSeries(elem, thiselem) {
    if (elem == 1) {
      thiselem.setState({
        seriesSelect: elem,
        // serieId: '',
      });
    } else {
      thiselem.setState({
        seriesSelect: elem,
      });
    }
  }

  // 打开‘取消上架’按钮
  cancelGround = () => {
    const self = this;
    if (proSelectEdList.length != 0) {
      const params = { productIds: JSON.stringify(proSelectEdList), onSale: 'N' };
      app.$api.updateSaleStatu(params).then((res) => {
        message.success('产品取消上架成功，正在刷新页面');
        self.setState({
          proModifyModalTF: false,
          proViewModalTF: false,
        }, () => {
          this.getList(this.state.pageIndex, this.state.pageSize);
          proSelectEdList = [];
        });
      });
    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }
  // 删除产品
  delPro = () => {
    const self = this;
    if (proSelectEdList.length != 0) {
      const tempProList = [];
      let delTF = true;
      self.state.proDataList.forEach((ielem, ind) => {
        proSelectEdList.forEach((jelem) => {
          if (ielem.productId == jelem) {
            if (ielem.onSale == 'Y' && ielem.isAudit == 4) {
              message.error('上架不能被删除，请重新选择！');
              delTF = false;
              return false;
            }
          }
        });
      });
      if (delTF) {
        const params = { productIds: JSON.stringify(proSelectEdList) };
        app.$api.deleteProduct(params).then((res) => {
          message.success(res.msg);
          self.setState({
            proModifyModalTF: false,
            proViewModalTF: false,
            pageIndex: 1,
            pageSize: 12,
          }, () => {
            self.getList(1, 12);
            proSelectEdList = [];
          });
        });
      }
    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }
  // 打开‘上传产品’按钮
  uploadPro(thiselem) {
    thiselem.context.router.push('/designer/uploadProCustom');
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

  getIcons() {
    const icons = [
      'source | undo redo | bold italic underline strikethrough fontborder emphasis | ',
      'paragraph  fontsize |',
      'forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ',
      'cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ',
      'horizontal date time  | image emotion spechars | inserttable',
    ];
    return icons;
  }
  getPlugins() {
    return {
      image: {
        uploader: {
          name: 'file',
          url: `${app.$http.URL}/common/uploadImg`,
        },
      },
    };
  }
  // 修改产品弹出框

  // 修改产品弹出框(上架中，需要下架)
  modifyProOne = () => {
    const self = this;
    const params = { productIds: JSON.stringify([self.state.proViewDetail.productId]), onSale: 'N' };
    // console.log(params);
    app.$api.updateSaleStatu(params).then((res) => {
      message.success('产品下架成功，正在跳转到编辑页面！');
      self.getList(1, 12);
      this.setState({
        proViewModalTF: false,
        proModifyModalTF: true,
      });
    });

    // console.log(this.state.proViewDetail);
  }

  // 修改产品弹出框(不是上架中，不需要下架)
  modifyProTwo = () => {
    // console.log('kkkk');
    this.setState({
      proViewModalTF: false,
      proModifyModalTF: true,
    });
    console.log(this.state.proViewDetail);
    console.log(this.state.proViewDetail.manufactureProps);
  }
  // 修改产品数据调接口
  modifySave(self) {
    // 修改产品数据调接口
    const params = { productStr: JSON.stringify(self.state.proViewDetail) };
    app.$api.updateFactoryProduct(params).then((res) => {
      self.setState({
        proModifyModalTF: false,
      });
    });
  }
  modifyCancel=() => {
    this.setState({
      proModifyModalTF: false,
    }, () => {
      this.getList(1, 12);
    });
  }

  newProSubmit = (e) => {
    const self = this;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // const proSizeList = [];// 款式尺寸数组
      // const proMaterListTwo = [];// 产品材质/重量/价格遍历数组
      // for (const i in values) {
      //   // 款式尺寸遍历
      //   if (i.indexOf('size_') >= 0) {
      //     proSizeList.push(values[i]);
      //   }
      //   // 产品材质/重量/价格遍历
      //   if (i.indexOf('proMaxWeight_') >= 0) {
      //     const indexNum = i.split('_')[1];
      //     const proMinWeight = values[`proMinWeight_${indexNum}`];
      //     const proMaxWeight = values[`proMaxWeight_${indexNum}`];
      //     const proMinPrice = values[`proMinPrice_${indexNum}`];
      //     const materId = values[`materId_${indexNum}`];
      //     proMaterListTwo.push({ textureId: materId, textureName: '', textureWeight: `${proMinWeight}-${proMaxPrice}`, texturePrice: `${proMinPrice}-${proMaxPrice}` });
      //   }
      // }
      // self.state.productStr.categoryId = values.categoryId; // 分类ID
      // self.state.productStr.crowdId = values.crowdId; // 适合人群ID
      // self.state.productStr.productName = values.productName; // 款式名称
      // self.state.productStr.productDescription = values.productDescription; // 宝石描述

      // self.state.productStr.designs[0].designValue = proSizeList.join(','); // 款式尺寸
      // self.state.productStr.stonePrice = values.stonePrice;// 宝石价格
      // self.state.productStr.wagePrice = values.wagePrice;// 生产工费
      // self.state.productStr.imageIdFroms = this.state.imgDisplayList;// 生产工费
      // self.state.productStr.textures = proMaterListTwo;// 产品材质/重量/价格遍历數組
      // // console.log(self.state.productStr);
      // const params = new FormData();
      // params.append('productStr', JSON.stringify(self.state.productStr));
      // // 提交新产品参数

      // Axios.ajax_post_formdata('/product/addProductNumber', params)
      // .then(
      //   (res) => {
      //     if (res.data.code == '200') {
      //       this.context.router.push('/MyFactory/manageFinishProduct');
      //     } else {
      //       message.error(res.data.msg);
      //     }
      //   },
      // )
      // .catch((error) => {
      //   message.error(error);
      // });
    });
  };

  // 分页
  onShowSizeChange = (current, pageSize) => {
    this.setState({
      pageSize,
      pageIndex: 1,
      checkAll: false,
    }, () => {
      this.getList(1, pageSize);
      proSelectEdList = [];
    });
  }


  onChangPage = (page, pageSize) => {
    this.setState(() => ({
      pageIndex: page,
      checkAll: false,
    }), () => {
      this.getList(page, pageSize);
      proSelectEdList = [];
    });
  }

  // 改变系列事件
  changeSerice = (e) => {
    this.setState(() => ({
      serieId: e,
      pageIndex: 1,
      pageSize: 12,
    }), () => {
      this.getList(1, 12);
    });
  }
  // 改变类别事件
  changeCate(e, thiselem) {
    thiselem.setState(() => ({
      classifyId: e,
      pageIndex: 1,
      pageSize: 12,
    }), () => {
      thiselem.getList(1, 12);
    });
  }

  // 改变状态
  changeStatus = (e) => {
    this.setState(() => ({
      statu: e,
      pageIndex: 1,
      pageSize: 12,
    }), () => {
      this.getList(1, 12);
    });
  }

  // 改变审核中状态
  changeAudit=(e) => {
    if (e.target.checked == true) {
      this.state.isAudit = 1;
    } else {
      this.state.isAudit = '';
    }
    this.setState(() => ({
      isAudit: this.state.isAudit,
      pageIndex: 1,
      pageSize: 12,
    }), () => {
      this.getList(1, 12);
    });
  }

  // 提交审核事件
  modifyProSubmit(thiselem) {
    const self = thiselem;
    // 保存修改事件
    // this.modifySaveData('N');
    self.modifySaveData('N', self);
    // await self.editAddState(self);
  }


  // 平面产品图片删除
  delImg(ind) {
    const self = this;
    // console.log(self.state.proViewDetail);
    if (self.state.proViewDetail.picUrlList.length <= 1) {
      message.error('产品不能没有图片，此图片不能被删除！');
      return false;
    }
    self.state.proViewDetail.picUrlList.splice(ind, 1);
    self.setState({
      proViewDetail: self.state.proViewDetail,
    });
  }


  // 平面产品图片上传
  imgUpload(thiselem) {
    thiselem.refs.imgInput.click();
  }

  // 事件平面产品图片上传
  imgInputFun = () => {
    // console.log('图片');
    const self = this;
    // console.log(this.refs.imgInput.files)
    const params = new FormData();
    params.append('files', self.refs.imgInput.files[0]);
    // 图片上传
    app.$api.uploadImage(params).then((res) => {
      const imgList = self.state.proViewDetail.picUrlList;
      imgList.push(res.data.imageUrl);
      self.setState(() => ({
        proViewDetail: self.state.proViewDetail,
      }), () => {
        self.refs.imgInput.value = '';
      });
    });
  }

  // 添加尺寸
  addProSize = (ind) => {
    this.state.proViewDetail.manufacturePropSizes[`${ind}`].proSizeList.push('');
    this.setState({
      proViewDetail: this.state.proViewDetail,
    });
  }


  // 添加材质
  addProMater(self) {
    if (self.state.proViewDetail.classifyName != '对戒') {
      const newSku = self.state.proViewDetail.skuPages[0];
      const objData = JSON.parse(JSON.stringify(newSku));
      objData.maxPrice = 0;
      objData.minPrice = 0;
      objData.skuId = 'new';
      objData.skuProps.forEach((item) => {
        item.propValue = '';
      });
      self.state.proViewDetail.skuPages.push(objData);
      self.setState({
        proViewDetail: self.state.proViewDetail,
      });
    } else {
      const tempObj = JSON.parse(JSON.stringify(self.state.proViewDetail.skuDisList[0]));
      tempObj.skuName = '对戒';
      tempObj.skuIndex = '0';
      tempObj.skuData = {
        maxPrice: 0,
        minPrice: 0,
        saleBybulkPricr: 0,
        wholesalePrice: 0,
        skuId: 'new',
        skuAllList: self.state.proViewDetail.skuAlldata,
      };
      // const tempObj = JSON.parse(JSON.stringify(self.state.proViewDetail.skuAlldata));
      tempObj.skuId = 'new';
      self.state.proViewDetail.skuDisList.push(tempObj);
      self.setState({
        proViewDetail: self.state.proViewDetail,
      });
    }
  }

  // 保存修改产品确认接口
  modifySaveData(elem, thiselem) {
    const self = thiselem;
    // console.log(elem);
    self.setState({
      saveLoading: true,
    });
    // e.preventDefault();
    self.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        // console.log(self.state.proViewDetail);
        // 图片url遍历
        const picTxt = [];
        self.state.proViewDetail.picUrlList.forEach((item) => {
          picTxt.push(item);
        });
        // 款式尺寸
        const sizeAllData = self.state.proViewDetail.manufacturePropSizes;
        sizeAllData.forEach((item) => {
          item.proSizeList = [];
          for (const i in values) {
            if (i.indexOf(`size_${item.propId}`) >= 0) {
              item.proSizeList.push(values[i]);
            }
          }
          item.propValue = item.proSizeList.join(',');
        });
        // 副规格
        const sizeAllDataTwo = self.state.proViewDetail.manufactureProps;
        sizeAllDataTwo.forEach((item) => {
          for (const i in values) {
            if (i.indexOf(`propValue_${item.propId}`) >= 0) {
              item.propValue = values[i];
            }
          }
        });
        // 产品材质/重量/价格
        let skuAllData = [];
        if (self.state.proViewDetail.classifyName != '对戒') {
          skuAllData = self.state.proViewDetail.skuPages;
          skuAllData.forEach((item, ind) => {
            // console.log(ind)
            item.minPrice = values[`minPrice_${ind}`];
            item.maxPrice = values[`maxPrice_${ind}`];
            item.skuProps.forEach((jelem, index) => {
              for (const i in values) {
                if (i.split('_')[2] == jelem.propId && i.split('_')[1] == ind) {
                  jelem.propValue = values[i];
                }
              }
            });
          });
        } else {
          skuAllData = [];
          let subSkuData = {};
          self.state.proViewDetail.skuDisList.forEach((item, indSum) => {
            const skuPropsList = [{
              propId: 1006,
              propValue: item.skuName,
            }];
            let minPriceNum = 0;
            item.skuData.skuAllList.forEach((ielem, indOne) => {
              if (item.skuName == ielem.name) {
                // console.log(values);
                // console.log(`minDouPrice_${indSum}_${ielem.name}`);
                // console.log(values[`minDouPrice_${indSum}_${ielem.name}`]);
                minPriceNum = parseInt(values[`minDouPrice_${indSum}_${ielem.name}`]);
                ielem.value[0].forEach((jelem, indTwo) => {
                  skuPropsList.push({
                    propId: jelem.propId,
                    propValue: jelem.isScheduled == 'Y' ? values[`propValueTwo_${indSum}_${indOne}_${jelem.propId}`] : values[`propValue_${indSum}_${indOne}_${jelem.propId}`],
                  });
                });
              }
            });
            // console.log(values)
            subSkuData = {
              minPrice: minPriceNum,
              // maxPrice:values[`maxDouPrice_${indSum}_${item.skuName}`],
              skuProps: skuPropsList,
              skuId: item.skuId != 'new' ? item.skuData.skuId : 'new',
            };
            skuAllData.push(subSkuData);
          });
        }
        // console.log(skuAllData);
        const params = {
          productId: this.state.proViewDetail.productId,
          serieId: values.serieId ? values.serieId : '',
          classifyId: this.state.proViewDetail.classifyId,
          productName: values.productName,
          productDetail: values.productDetail,
          picUrl: picTxt.join(','),
          threeDUrl: this.state.proViewDetail.threeDUrl ? this.state.proViewDetail.threeDUrl : '',
          mPicUrl: this.state.proViewDetail.mPicUrl ? this.state.proViewDetail.mPicUrl : '',
          imageId: self.state.threeDImgData.imageId,
          manufactureProps: JSON.stringify(sizeAllDataTwo),
          manufacturePropSizes: JSON.stringify(sizeAllData),
          skus: JSON.stringify(skuAllData),
        };
        if (elem == 'N') {
          params.num = 1;
        }

        app.$api.updateProduct(params).then((res) => {
          message.success(res.msg);
          self.setState({
            saveLoading: false,
            proModifyModalTF: false,
            proViewModalTF: false,
            serieId: '',
          }, () => {
            self.getList(1, 12);
          });
        }).catch((err) => {
          self.saveLoading({
            saveLoading: false,
          });
        });
      }
    });
  }


  // 删除sku事件
  delSku=(index) => {
    const self = this;
    if (this.state.proViewDetail.classifyName != '对戒') {
      if (this.state.proViewDetail.skuPages.length <= 1) {
        message.error('规格不能全部删除！');
        return;
      }
      this.state.proViewDetail.skuPages.splice(index, 1);
      self.setState({
        proViewDetail: self.state.proViewDetail,
      });
    } else {
      if (this.state.proViewDetail.skuDisList.length <= 1) {
        message.error('规格不能全部删除！');
        return;
      }
      console.log(index);
      // console.log(this.state.proViewDetail.skuDisList);
      const tempData = JSON.parse(JSON.stringify(this.state.proViewDetail.skuDisList));
      tempData.splice(index, 1);
      this.state.proViewDetail.skuDisList = tempData;
      self.setState({
        proViewDetail: self.state.proViewDetail,
      }, () => {
        console.log(self.state.proViewDetail.skuDisList);
      });
    }
  }


  // 删除审核中、待审核产品
  delProFun=() => {
    const self = this;
    const params = {
      productIds: JSON.stringify([this.state.proViewDetail.productId]),
    };
    app.$api.deleteProduct(params).then((res) => {
      message.success(res.msg);
      self.setState({
        proModifyModalTF: false,
        proViewModalTF: false,
      }, () => {
        self.getList(1, 12);
      });
    });
  }
  // 审核不通过'提交审核'按钮
  submitAudit=() => {
    // console.log(this.state.proViewDetail.productId);
    const self = this;
    const params = {
      productIds: JSON.stringify([this.state.proViewDetail.productId]),
      onSale: 'Y',
    };
    app.$api.updateSaleStatu(params).then((res) => {
      message.success(res.msg);
      self.setState({
        proModifyModalTF: false,
        proViewModalTF: false,
      }, () => {
        self.getList(1, 12);
      });
    });
  }

    // 产品发布上架
  editAddState = () => {
    const params = { productIds: JSON.stringify([this.state.proViewDetail.productId]), onSale: 'Y' };
    app.$api.updateSaleStatu(params).then((res) => {
      message.success(res.msg);
      this.setState({
        proModifyModalTF: false,
        proViewModalTF: false,
      }, () => {
        this.getList(1, 12);
      });
    });
  }
      // 产品取消上架
  editUnderState=() => {
    const params = { productIds: JSON.stringify([this.state.proViewDetail.productId]), onSale: 'N' };
    app.$api.updateSaleStatu(params).then((res) => {
      message.success(res.msg);
      this.setState({
        proModifyModalTF: false,
        proViewModalTF: false,
      }, () => {
        this.getList(1, 12);
      });
    });
  }

  // 修改或新增系列
  modifySeries(elem, thiselem) {
    if (elem == '2') {
      thiselem.setState({
        serieId: '',
      });
    }
    thiselem.setState({
      seriesSelectNum: elem,
    });
  }

  // 改变select系列
  changeSeries(e, thiselem) {
    // console.log(e);
    thiselem.setState({
      seriesSelect: '0', // 选择产品系列无系列1，有系列为0
      seriesSelectNum: '0', // 选择产品系列无系列0，修改为1，新增系列为2
      serieId: e,
    });
    for (let i = 0; i < thiselem.state.seriesList.length; i++) {
      if (thiselem.state.seriesList[i].serieId == e) {
        if (thiselem.state.seriesList[i].serieType == 'SYS') {
          thiselem.setState({
            modifySeriesTF: false,
          });
        } else {
          thiselem.setState({
            modifySeriesTF: true,
          });
        }
        thiselem.setState({
          cname: thiselem.state.seriesList[i].cname,
          serieDetai: thiselem.state.seriesList[i].serieDetai ? thiselem.state.seriesList[i].serieDetai : '',
        });
      }
    }
  }

    // 增加新系列
  addseries(thiselem) {
    thiselem.props.form.validateFields((err, values) => {
      const params = {
        cname: values.cname,
        serieDetai: values.serieDetai,
        serieType: 'DESIGNER',
      };
        // 新增系列
      app.$api.createSerie(params).then((res) => {
          // this.componentDidMount();
        app.$api.querySeriesDesi(params).then((res) => {
          const length = res.data.length - 1;
          thiselem.setState({
            serieId: res.data[length].serieId,
            cname: res.data[length].cname,
            serieDetai: res.data[length].serieDetai,
            seriesSelect: '0',
            seriesSelectNum: '0',
          }, () => {
            thiselem.componentDidMount();
          });
        });
      });
    });
  }
  // 修改系列
  editSeries(thiselem) {
    thiselem.props.form.validateFields((err, values) => {
      // console.log(thiselem.state);
      const params = { serieId: thiselem.state.serieId, cname: values.cname, serieDetai: values.serieDetai };
      // 修改系列
      app.$api.updateSerie(params).then((res) => {
        thiselem.setState({
          seriesSelect: '0',
          seriesSelectNum: '0',
          serieId: '',
        }, () => {
          thiselem.componentDidMount();
        });
      });
    });
  }

  // 删除3d图包
  delRar() {
    this.state.proViewDetail.threeDUrl = false;
    this.state.proViewDetail.mPicUrl = false;
    this.setState({
      proViewDetail: this.state.proViewDetail,
    });
  }

  rarUpload(thiselem) {
    thiselem.refs.rarInput.click();
  }

  // 3D压缩图上传
  rarInputFun(thiselem) {
    const params = new FormData();
    // console.log('3d图片');
    // console.log(thiselem.refs.rarInput.files[0]);
    // console.log(thiselem.refs.rarInput.files[0].name);
    const name = thiselem.refs.rarInput.files[0].name;
    const fileName = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    if (fileName != 'rar' && fileName != 'zip') {
      message.error('请上传要求上传3D图包！');
      thiselem.refs.rarInput.value = '';
      return;
    }
    params.append('files', thiselem.refs.rarInput.files[0]);
    app.$api.uploadThreeDFile(params).then((res) => {
      // console.log('3d图包');
      // console.log(res.data);
      this.state.proViewDetail.threeDUrl = res.data.threeDUrl;
      this.state.proViewDetail.mPicUrl = res.data.oneImageUrl;
      this.setState(() => ({
        proViewDetail: this.state.proViewDetail,
        threeDImgData: res.data,
      }), () => {
        thiselem.refs.rarInput.value = '';
      });
    });

    // this.state.proViewDetail.threeDUrl = false;
    // this.state.proViewDetail.mPicUrl = false;
    // this.setState({
    //   proViewDetail: this.state.proViewDetail,
    // });
  }


  // 删除尺寸
  delSize=(sizeData, indexNum) => {
    const self = this;
    self.props.form.validateFields((err, values) => {
      if (sizeData.proSizeList.length > 1) {
        sizeData.proSizeList.splice(indexNum, 1);
      } else {
        message.error('款式尺寸不能全删！');
      }

      // });
      self.setState({
        proViewDetail: self.state.proViewDetail,
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
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const formItemTwo = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const imgLis = () => {
      if (self.state.proViewDetail.picUrlList) {
        const lis = self.state.proViewDetail.picUrlList.map((item) => {
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
                proImgBigUrl: self.state.proViewDetail.picUrlList[i],
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
              系列：
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => self.changeSerice(event)}>
                <Option value="">全部</Option>
                {this.state.seriesList.map(data =>
                  <Option value={data.serieId}>{data.cname}</Option>,
                )}
              </Select>
            </span>
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
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => this.changeStatus(event)} >
                <Option value="">全部</Option>
                <Option value="1">已上架</Option>
                <Option value="2">未上架</Option>
                <Option value="3">审核中</Option>
                <Option value="4">待完善</Option>
                <Option value="5">审核不通过</Option>
              </Select>
            </span>
            {/* <span>
              <Checkbox onChange={event => this.changeAudit(event)}>审核中</Checkbox>
            </span> */}
          </span>
        </div>
        <div className={styles.hr} />
        <div>
          <Row>
            <Col span={12}>
              <Button className="bottonPublic" type="primary" onClick={() => self.uploadPro(this)}>上传产品</Button>
            </Col>
            <Col span={12} className={styles.textRight}>
              <Checkbox
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
                className="f12"
              >全选</Checkbox>
              <Popconfirm title="确定取消上架所选产品?" onConfirm={() => self.cancelGround(self)} okText="确定取消上架" cancelText="取消">
                <Button type="primary" className={`${styles.marginLeft30} bottonPublic`}>取消上架</Button>
              </Popconfirm>
              <Popconfirm title="确定发布上架所选产品?" onConfirm={() => self.addGround(self)} okText="确定上架" cancelText="取消">
                <Button className="bottonPublic" type="primary" className={`${styles.marginLeft30} bottonPublic`}>发布上架</Button>
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
                  {this.state.proDataList.map((ielem) => {
                    return (
                      <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                          <div className={styles.pro} >
                            <div>
                              <div className={styles.imgTop} >
                                {/* <span className={styles.imgTopTxt} onClick={() => self.showModal(ielem)} >
                                {ielem.productStatus == 0 ? '暂存' : ''}
                                {ielem.productStatus == 1 ? '已上架' : ''}
                                {ielem.productStatus == 2 ? '下架' : ''}
                              </span> */}
                                <span className={styles.imgTopTxt} onClick={() => self.showModal(ielem)} >
                                  {ielem.onSale == 'N' ?
                                  ''
                                  :
                                  <span>
                                    {ielem.isAudit == 1 ? '待完善' : ''}
                                    {ielem.isAudit == 2 ? '审核中' : ''}
                                    {ielem.isAudit == 3 ? '审核不通过' : ''}
                                    {ielem.isAudit == 4 ? '已上架' : ''}
                                    {ielem.isAudit == 5 ? '待审核' : ''}
                                  </span>
                                }
                                </span>
                                {ielem.onSale == 'N' ? <div className={styles.underFrame} onClick={() => self.showModal(ielem)} >已下架</div> : ''}
                                {/* {ielem.checked == true ? 'true' : 'false'} */}
                                {/* <Checkbox value={ielem.productId} /> */}
                                <Checkbox value={ielem.productId} checked={ielem.checked} onChange={this.singleElection} />
                              </div>
                              <img src={app.$http.imgURL + ielem.sPicUrl} onClick={() => self.showModal(ielem)} />
                            </div>
                            <div className={styles.proDisplay} onClick={() => self.showModal(ielem)}>
                              <p className={styles.proName}>{ielem.productName}</p>
                              {ielem.auditStatus == 3 ?
                                <p className={styles.proPrice}>建议零售价：￥{ielem.resalePrice}</p> :
                                <p className={styles.proPrice}>建议零售价：￥{ielem.suggestSale}</p>
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
            <Modal
              visible={this.state.proViewModalTF}
              onCancel={() => this.handleCancel(self)}
              width="1100"
              footer={[
                <div className={styles.modalFooter}>
                  {this.state.proViewDetail.onSale == 'N' ?
                    <Button className="bottonPublic" type="primary" onClick={self.editAddState}>
                      重新上架
                    </Button>
                    :
                    <span>
                      {this.state.proViewDetail.isAudit == 1 ?
                        <Button className="bottonPublic" type="primary" onClick={self.modifyProTwo}>
                          回到上传
                        </Button>
                       : ''}
                      {this.state.proViewDetail.isAudit == 2 ?
                        <Button className="bottonPublic" type="primary" onClick={self.delProFun}>
                          删除产品
                        </Button>
                      : ''}
                      {this.state.proViewDetail.isAudit == 3 ?
                        <Button className="bottonPublic" type="primary" onClick={self.submitAudit}>
                          提交审核
                        </Button>
                      : ''}
                      {this.state.proViewDetail.isAudit == 4 ?
                        <Button className="bottonPublic" type="primary" onClick={self.editUnderState}>
                          取消上架
                        </Button>
                      : ''}
                      {this.state.proViewDetail.isAudit == 5 ?
                        <Button className="bottonPublic" type="primary" onClick={self.delProFun}>
                          删除产品
                        </Button>
                      : ''}
                    </span>
                  }
                </div>,
              ]}
            >
              <div className={styles.modalDiv}>
                <Row>
                  <Row className={styles.titTop}>
                    <Col span={12}>
                      产品信息
                    </Col>
                    <Col span={12} className={styles.textRight}>
                      {this.state.proViewDetail.isAudit == 4 && this.state.proViewDetail.onSale != 'N' ?
                        <Popconfirm title="需要先取消上架才能修改信息,是否取消上架？" onConfirm={this.modifyProOne} okText="确定" cancelText="否">
                          <span className={styles.spanTitModi} >
                            修改产品信息
                          </span>
                        </Popconfirm>
                      :
                        <span className={styles.spanTitModi} onClick={this.modifyProTwo}>
                          修改产品信息
                        </span>
                      }
                    </Col>
                  </Row>
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

                      <div id="swiperWrapId">{this.state.proViewModalTF && (swiperLi(this.state.proViewDetail.picUrlList))}</div>
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
                          <Col span={24} className={styles.leftTxt}>
                            设计师名称：
                            <span span={20} className={styles.rightTxt}>
                              {this.state.proViewDetail.nickName}
                            </span>
                          </Col>
                          <Col span={2} className={styles.leftTxt}>产品系列：</Col>
                          <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.serieName}</Col>
                          <Col span={2} className={styles.leftTxt}>款式品类：</Col>
                          <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.classifyName}</Col>
                          <Col span={2} className={styles.leftTxt}>款式名称：</Col>
                          <Col span={22} className={styles.rightTxt}>{this.state.proViewDetail.productName}</Col>
                          <Col span={2} className={styles.leftTxt}>款式描述：</Col>
                          <Col span={22} className={styles.rightTxt}>{this.state.proViewDetail.productDetail}</Col>
                          {this.state.proViewDetail.manufactureProps ?
                              this.state.proViewDetail.manufactureProps.map(data =>
                                <span>
                                  <Col span={2} className={styles.leftTxt}>{data.cname}：</Col>
                                  <Col span={22} className={styles.rightTxt}>{data.propValue}</Col>
                                </span>,
                            ) : <span />
                          }
                          {this.state.proViewDetail.manufacturePropSizes ?
                              this.state.proViewDetail.manufacturePropSizes.map(data =>
                                <span>
                                  <Col span={2} className={styles.leftTxt}>{data.cname}：</Col>
                                  <Col span={22} className={styles.rightTxt}>
                                    {data.proSizeList ?
                                      <Row>
                                        {data.proSizeList.map(sizeData =>
                                          <Col span={2}>{sizeData}</Col>,
                                        )}
                                      </Row>
                                        : data.propValue
                                    }
                                  </Col>
                                </span>,
                            ) : <span />
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
                        {/* <div className={styles.tabOneTitName}>
                          {this.state.proViewDetail.classifyName}
                        </div> */}
                        {this.state.proViewDetail.classifyName != '对戒' ?
                          <span>
                            {this.state.proViewDetail.skuPages ?
                              this.state.proViewDetail.skuPages.map((data, ind) =>
                                <Row className={styles.tabOneCol}>
                                  {data.skuProps ?
                                    data.skuProps.map(idata =>
                                      <Col span={6} style={{ height: 40 }}>
                                        <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{idata.cname}</span>{idata.propValue}
                                      </Col>,
                                  ) : ''}
                                  <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                    <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>建议售价/￥</span>
                                    <span style={{ color: '#333333', fontSize: '16px' }}>{data.minPrice}</span>
                                  </Col>
                                </Row>,
                              )
                              :
                              <div>此产品暂无材质规格！</div>
                            }
                          </span>
                        :

                          <span>
                            <Tabs defaultActiveKey="0">
                              {this.state.proViewDetail.skuList ?
                                (this.state.proViewDetail.skuList.map((mdata, ind) =>
                                  <TabPane tab={mdata.skuName} key={ind}>
                                    {mdata.skuSList ?
                                      (mdata.skuSList.map((idata, ind) =>
                                        <Row className={styles.tabOneCol}>
                                          {idata.skuProps ?
                                            idata.skuProps.map(kdata =>
                                              <Col span={6} style={{ height: 40 }}>
                                                <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{kdata.cname}</span>{kdata.propValue}
                                              </Col>,
                                            ) : ''}
                                          <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>建议售价/￥</span>
                                            <span style={{ color: '#333333', fontSize: '16px' }}>{idata.minPrice}</span>
                                          </Col>
                                        </Row>,
                                      ))
                                    : <div>此类型暂无材质规格！</div>
                                  }
                                  </TabPane>,
                                ))
                                : <div>此类型暂无材质规格！</div>
                              }
                            </Tabs>
                          </span>
                      }


                      </div>


                      {/* <div className={styles.tabOne}>
                        <div className={styles.tabOneTitName}>{this.state.proViewDetail.classifyName}</div>
                        {this.state.proViewDetail.skuPages ?
                            this.state.proViewDetail.skuPages.map((data, ind) =>
                              <Row className={styles.tabOneCol}>
                                {data.skuProps ?
                                  data.skuProps.map(idata =>
                                    <Col span={6} className={styles.tabOneDiv}>
                                      <span className={styles.tabOneTxtOne}>{idata.cname}</span>{idata.propValue}
                                    </Col>,
                                ) : ''}
                                <Col span={6} className={styles.titTxtOne} style={{ float: 'right' }}>
                                  <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>建议售价/￥</span>
                                  {data.minPrice}
                                </Col>
                              </Row>,
                            )
                            :
                            <div>此产品暂无材质规格！</div>
                          }

                      </div>
                     */}

                    </div>
                  </Col>
                </Row>
              </div>
            </Modal>
            {this.state.proModifyModalTF && (
              <Modal
                visible={this.state.proModifyModalTF}
                onCancel={this.modifyCancel}
                width="1100"
                footer={[
                  <div className={styles.modalFooter}>
                    <Button className="bottonPublic" loading={this.state.saveLoading} type="primary" onClick={() => this.modifySaveData('Y', this)}>
                      保存
                    </Button>
                    {this.state.proViewDetail.isAudit != 2 && this.state.proViewDetail.isAudit != 5 ?
                      <Button className="bottonPublic" loading={this.state.saveLoading} type="primary" onClick={() => this.modifyProSubmit(self)}>
                        提交审核
                      </Button>
                      : ''
                    }

                  </div>,
                ]}
              >
                <div className={styles.modalDiv}>
                  <Form onSubmit={this.newProSubmit}>
                    <div className={styles.hr} />
                    <div className={styles.seriesSelectDiv}>
                      <div>
                        <img src={self.state.seriesSelect == '1' ? '/images/designer/redioTwo.jpg' : '/images/designer/redioOne.jpg'} onClick={() => self.clickSeries('1', self)} />
                        无系列
                        <span className={styles.seriesSubTxt}>直接上传不添加系列</span>
                      </div>
                      <div>
                        <img src={self.state.seriesSelect == '0' ? '/images/designer/redioTwo.jpg' : '/images/designer/redioOne.jpg'} onClick={() => self.clickSeries('0', self)} />
                        选择系列
                        {self.state.seriesSelect == '0' ?
                            (getFieldDecorator('serieId', {
                              initialValue: self.state.proViewDetail.serieId,
                            })(
                              <Select placeholder="请输入系列" className={styles.seriesSelect} showSearch onChange={event => self.changeSeries(event, self)}>
                                {this.state.seriesList.map(data => (
                                  <Option value={data.serieId}>{data.cname}</Option>
                              ))}
                              </Select>,
                          ))
                        : ''
                        }
                      </div>
                    </div>
                    {self.state.seriesSelect == '0' ?
                      <div>
                        <div className={styles.hr} />
                        <div className={styles.seriesDiv}>
                          <div>
                            {self.state.modifySeriesTF ?
                              <span className={styles.seriesRedTxtOne} onClick={() => { self.modifySeries('1', self); }}>修改系列</span>
                            : ''}
                            <span className={styles.seriesRedTxtTwo} onClick={() => { self.modifySeries('2', self); }}>创建新系列</span>
                          </div>
                          <div>
                            {self.state.seriesSelectNum == '0' ?
                              <div>
                                {self.state.cname && (<div className={styles.seriesTxtOne}><b>系列名称：</b>{self.state.cname}</div>)}
                                {self.state.serieDetai && (<div className={styles.seriesTxtOne}><b>系列描述：</b>{self.state.serieDetai}</div>)}
                              </div>
                              : ''
                            }
                            {self.state.seriesSelectNum == '1' ?
                              <div>
                                <div>
                                  {getFieldDecorator('cname', {
                                    initialValue: self.state.cname,
                                  })(<Input placeholder="请输入系列名称" style={{ width: 300 }} />)}
                                </div>
                                <div>
                                  {getFieldDecorator('serieDetai', {
                                    initialValue: self.state.serieDetai,
                                  })(<TextArea rows={4} placeholder="请输入系列描述" className={styles.textA} />)}
                                </div>可输入200字
                                  <div className={styles.bottonDiv}><Button className="bottonPublic" type="primary" onClick={() => self.editSeries(self)}>修改</Button></div>
                              </div> : ''}
                            {self.state.seriesSelectNum == '2' ?
                              <div>
                                <div className={styles.marginB20}>
                                  {getFieldDecorator('cname', {
                                  })(<Input placeholder="请输入系列名称" style={{ width: 300 }} />)}
                                </div>
                                <div>
                                  {getFieldDecorator('serieDetai', {
                                  })(<TextArea rows={4} placeholder="请输入系列描述" className={styles.textA} />)}
                                </div>可输入200字
                                  <div className={styles.bottonDiv}><Button className="bottonPublic" type="primary" onClick={() => self.addseries(self)}>创建</Button></div>
                              </div> : ''}
                          </div>
                        </div>
                      </div>
                        :
                        ''
                    }
                    <div className={styles.hr} />
                    <FormItem {...formItemLayout} label="产品类别" className={styles.forItemDiv}>
                      {getFieldDecorator('categoryId', {
                        initialValue: self.state.proViewDetail.classifyName,
                        rules: [
                          {
                            required: true,
                            message: '请选择产品类别',
                          },
                        ],
                      })(
                        <Select placeholder="请选择产品类别" style={{ width: 211 }} showSearch disabled>
                          {this.state.categoryList.map(data => (
                            <Option value={data.classifyId}>{data.cname}</Option>
                          ))}
                        </Select>,
                      )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="款式名称" className={styles.forItemDiv}>
                      {getFieldDecorator('productName', {
                        initialValue: self.state.proViewDetail.productName,
                        rules: [
                          {
                            required: true,
                            message: '请输入款式名称',
                          },
                        ],
                      })(
                        <Input style={{ width: 480 }} placeholder="请输入款式名称" />,
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="宝石描述" className={styles.forItemDiv}>
                      {getFieldDecorator('productDetail', {
                        initialValue: self.state.proViewDetail.productDetail,
                      })(
                        <TextArea placeholder="宝石描述" />,
                      )}
                    </FormItem>
                    {this.state.proViewDetail.manufactureProps ?
                        (this.state.proViewDetail.manufactureProps.map((idata, index) =>
                          <FormItem {...formItemLayout} label={idata.cname}>
                            {getFieldDecorator(`propValue_${idata.propId}`, {
                              initialValue: idata.propValue,
                            })(<Input placeholder="" width={{ width: 616 }} />)}
                          </FormItem>,
                        )) : ''
                    }
                    {this.state.proViewDetail.manufacturePropSizes ?
                        (this.state.proViewDetail.manufacturePropSizes.map((idata, index) =>
                          <FormItem {...formItemLayout} label={idata.cname} className={styles.forItemDiv}>
                            {getFieldDecorator(`propValue_${idata.propId}`, {
                              initialValue: idata.propValue,
                            })(
                              <span>
                                {idata.proSizeList.map((jdata, ind) => (
                                  <Col span={2} style={{ marginRight: 20, textAlign: 'center' }}>
                                    {getFieldDecorator(`size_${idata.propId}_${ind}`, {
                                      initialValue: jdata,
                                    })(<Input placeholder="" />)}
                                    <span className={styles.imgDelTwo} onClick={() => self.delSize(idata, ind)}>
                                      —
                                    </span>
                                  </Col>

                                ))}
                                <span onClick={() => self.addProSize(index)}>
                                  添加尺寸+
                                </span>
                              </span>,
                            )}
                          </FormItem>,
                        )) : ''
                    }

                    <div className={styles.hr} />
                    <div>
                      <div>
                        <Row className={styles.margin10}>
                          <Col span={24}>
                            <div className={styles.contant}>
                              <div className={`${styles.mainTxt} dot`}>
                                产品材质/重量/价格:
                              </div>
                              <div className={styles.tabOne}>
                                {this.state.proViewDetail.classifyName == '对戒' ?
                                  <span>
                                    {this.state.proViewDetail.skuDisList ?
                                      (this.state.proViewDetail.skuDisList.map((data, ind) =>
                                        (<Tabs defaultActiveKey={data.skuIndex} onChange={event => this.changePresetFun(event, ind)}>
                                          {data.skuData.skuAllList.map((ielem, indOne) =>
                                            // (ielem.map((telem,indFour)=>
                                            <TabPane tab={ielem.name} key={indOne}>
                                              <Row type="flex" align="middle" className={styles.tabOneCol}>
                                                <Col span={18}>
                                                  {ielem.value[0].map((kelem, indTwo) =>
                                                    <Col span={8} style={{ height: 40 }}>
                                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>{kelem.cname}</span>
                                                      {kelem.isScheduled == 'Y' ?
                                                        (getFieldDecorator(`propValueTwo_${ind}_${indOne}_${kelem.propId}`, {
                                                          initialValue: kelem.propValue,
                                                        })(
                                                          <Select defaultValue={kelem.propDesc} style={{ width: 100 }}>
                                                            {kelem.presetList.map(kdata => (
                                                              <Option value={kdata}>{kdata}</Option>
                                                              ))}
                                                          </Select>,
                                                        ))
                                                        :
                                                        (getFieldDecorator(`propValue_${ind}_${indOne}_${kelem.propId}`, {
                                                          initialValue: kelem.propValue,
                                                        })(<Input placeholder="" style={{ width: 80 }} />))
                                                      }
                                                    </Col>,
                                                )}
                                                </Col>
                                                <Col span={5} className={styles.titTxtOne} style={{ float: 'right' }}>
                                                  <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>供应商批发价/￥</span>
                                                  {getFieldDecorator(`minDouPrice_${ind}_${ielem.name}`, {
                                                    initialValue: ielem.minPrice,
                                                  })(<InputNumber placeholder="" style={{ width: 50 }} />)}
                                                  <span className={styles.delSkuIco} onClick={() => this.delSku(ind)}> X </span>
                                                </Col>
                                              </Row>
                                            </TabPane>,
                                          )}
                                        </Tabs>),
                                      ))

                                  : <div>此产品暂无材质规格！</div>

                                }
                                  </span>

                                :
                                (this.state.proViewDetail.skuPages ?
                                    this.state.proViewDetail.skuPages.map((data, ind) =>
                                      <Row className={styles.tabOneCol}>
                                        {data.skuProps ?
                                          data.skuProps.map(idata =>
                                            <Col span={6} style={{ height: 40 }}>
                                              <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{idata.cname}</span>
                                              {idata.isScheduled == 'Y' ?
                                                  (getFieldDecorator(`propValueTwo_${ind}_${idata.propId}`, {
                                                    initialValue: idata.propValue,
                                                  })(
                                                    <Select defaultValue={idata.propDesc} style={{ width: 120 }}>
                                                      {idata.presetValueList.map(kdata => (
                                                        <Option value={kdata}>{kdata}</Option>
                                                        ))}
                                                    </Select>,
                                                  ))
                                                  : ''
                                                }
                                              {idata.isScheduled == 'N' ?
                                                  (getFieldDecorator(`propValue_${ind}_${idata.propId}`, {
                                                    initialValue: idata.propValue,
                                                  })(<Input placeholder="" style={{ width: 80 }} />))
                                                  : ''
                                                }
                                            </Col>,
                                              ) : ''}
                                        <Col span={6} className={styles.titTxtOne} style={{ float: 'right' }}>
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>建议售价/￥</span>
                                          {getFieldDecorator(`minPrice_${ind}`, {
                                            initialValue: data.minPrice,
                                          })(<InputNumber placeholder="" style={{ width: 60 }} />)}
                                          <span className={styles.delSkuIco} onClick={() => this.delSku(ind)}> X </span>
                                        </Col>
                                      </Row>,
                                      )
                                      :
                                    <div>此产品暂无材质规格！</div>
                                )
                                }
                              </div>

                              {/* <div className={styles.tabOne}>
                                <div className={styles.tabOneTitName}>
                                  {this.state.proViewDetail.classifyName}
                                </div>
                                {this.state.proViewDetail.skuPages ?
                                  this.state.proViewDetail.skuPages.map((data, ind) =>
                                    <Row className={styles.tabOneCol}>
                                      {data.skuProps ?
                                        data.skuProps.map(idata =>
                                          <Col span={6} className={styles.tabOneDiv}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{idata.cname}</span>
                                            {idata.isScheduled == 'Y' ?
                                                (getFieldDecorator(`propValueTwo_${ind}_${idata.propId}`, {
                                                  initialValue: idata.propValue,
                                                })(
                                                  <Select defaultValue={idata.propDesc} style={{ width: 120 }}>
                                                    {idata.presetValueList.map(kdata => (
                                                      <Option value={kdata}>{kdata}</Option>
                                                      ))}
                                                  </Select>,
                                                ))
                                                : ''
                                              }
                                            {idata.isScheduled == 'N' ?
                                                (getFieldDecorator(`propValue_${ind}_${idata.propId}`, {
                                                  initialValue: idata.propValue,
                                                })(<Input placeholder="" style={{ width: 80 }} />))
                                                : ''
                                              }
                                          </Col>,
                                            ) : ''}
                                      <Col span={6} className={styles.titTxtOne} style={{ float: 'right' }}>
                                        <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>建议售价/￥</span>
                                        {getFieldDecorator(`minPrice_${ind}`, {
                                          initialValue: data.minPrice,
                                        })(<InputNumber placeholder="" style={{ width: 60 }} />)}
                                      </Col>
                                    </Row>,
                                    )
                                    :
                                  <div>此产品暂无材质规格！</div>
                              }
                              </div>
                             */}
                            </div>
                          </Col>
                        </Row>
                        <div>
                          <div className={styles.margin10} style={{ fontSize: 12, marginBottom: 50 }}>
                            <span
                              className="addTxtRed"
                              onClick={() => self.addProMater(self)}
                            >
                              增加材质+
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.hr} />
                    <div className={`${styles.mainTxt} dot`}>上传平面图</div>
                    <div>
                      <Row>
                        <Col span={8}>
                          <Col span={8}>
                            <div
                              onClick={() => self.imgUpload(self)}
                            >
                              <img src="./images/img-upload.png" />
                            </div>
                            <input
                              type="file"
                              ref="imgInput"
                              onChange={self.imgInputFun}
                              className={styles.displayHide}
                            />
                          </Col>
                          <Col span={16}>
                            <div className="c9 f12">
                              请您上传单张或多张格式为png、jpg的图片，图片像素为534X534像素
                            </div>
                          </Col>
                        </Col>
                        <Col span={16}>

                          {this.state.proViewDetail.picUrlList ?
                            this.state.proViewDetail.picUrlList.map((ielem, ind) => {
                              return (
                                <Col span={6} key={ielem.imageId}>
                                  <div className={styles.textRight}>
                                    <img
                                      src={app.$http.imgURL + ielem}
                                      className={styles.imgSmall}
                                    />
                                    {ielem.imageId}
                                    <span
                                      className={styles.imgDel}
                                      onClick={() =>
                                        self.delImg(ind)
                                      }
                                    >
                                      —
                                    </span>
                                  </div>
                                </Col>
                              );
                            }) : ''
                        }
                        </Col>
                      </Row>
                    </div>
                    <div className={styles.mainTxt}>上传3D图包（可选）</div>
                    <div>
                      <Row>
                        <Col span={8}>
                          <Col span={8}>
                            <div className={styles.imgUpload} onClick={() => self.rarUpload(self)}>
                              <img src="./images/img-upload3D.png" />
                            </div>
                            <input type="file" ref="rarInput" onChange={() => self.rarInputFun(self)} className={styles.displayHide} />
                          </Col>
                          <Col span={10}>
                            <div className="c9 f12">请您上传格式为rar、zip的图包，文件大小为10M以内。</div>
                          </Col>
                        </Col>
                        <Col span={16}>
                          <Col span={4}>
                            <div className={styles.textRight}>
                              {/* {this.state.jpgThreeDId && (
                                  <div>
                                    <img src="../images/zipIcon.png" className={styles.imgSmallTwo} />
                                    <span className={styles.imgDel} onClick={this.delRar.bind(this)}>
                                      —
                                    </span>
                                  </div>
                                )} */}
                              {this.state.proViewDetail.mPicUrl && (
                                <div>
                                  {/* <img src="./images/zipIcon.png" className={styles.imgSmallTwo} /> */}
                                  {/* <img src={app.$http.imgURL + this.state.proViewDetail.mPicUrl} className={styles.imgSmallTwo} /> */}
                                  <img src={app.$http.imgURL + this.state.proViewDetail.mPicUrl} className={styles.imgSmallTwo} />
                                  <span className={styles.imgDel} onClick={this.delRar.bind(this)}>
                                      —
                                    </span>
                                </div>
                                )}


                            </div>
                          </Col>
                        </Col>
                        {/* <Col span={16}>
                          {proListData.map((ielem) => {
                            return (
                              <Col span={6}>
                                <div className={styles.textRight}>
                                  <img
                                    src="../images/pro01.png"
                                    className={styles.imgSmall}
                                  />
                                  <span className={styles.imgDel}>—</span>
                                </div>
                              </Col>
                            );
                          })}
                        </Col> */}
                      </Row>
                    </div>
                  </Form>
                </div>
              </Modal>
            )}
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
