import React from 'react';
import { connect } from 'dva';
import { router } from 'react-router';
import PropTypes from 'prop-types';
import Editor from 'react-umeditor';
import styles from './manageCustomMade.less';
import app from 'app';
import $$ from 'jquery';


import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select, Checkbox, message, Form, InputNumber, Popconfirm, Tabs, Pagination, Spin } from 'antd';

import Swiper from 'react-id-swiper';

const { TextArea } = Input;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Column, ColumnGroup } = Table;// 表格属性
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const tableState = {
  bordered: true,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
};
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
      // threeDUrl:'',//3D的Zip文件地址threeDUrl
      // mPicUrl:'',//3D的显示图片通过oneImageUrl
      categoryList: [], // 产品分类接口数据
      categoryValue: '', // 产品分类选中信息
      crowdList: [], // 适合人群接口数据
      crowdValue: '', // 适合人群选中信息
      serieId: '', // 系列当前ID
      onSale: '', // 是否上架, Y 代表上架， N 代表下架
      statu: '', // 状态筛选1.上架，2、下架，3、审核中4待完善，5审核不通过
      classifyId: '', // 款式品类id
      proDataList: [], // 产品接口数据
      seriesList: [], // 产品系列搂口信息
      proViewModalTF: false, // 产品详细弹窗
      proModifyModalTF: false, // 修改产品弹窗
      proViewId: '', // 弹窗显示产品详细的ID
      proViewDetail: {}, // 弹窗显示产品详细的资料
      proImgBigUrl: '', // 弹窗显示产品详细第一张产品图片
      proImgList: [], // 弹窗显示产品详细所有产品图片
      designsListOne: [], // 款式数组
      // proSelectEdList: [], // 产品选择数组
      checkAll: false, // 产品全选/反选
      indeterminate: true, // 产品全选/反选
      // 修改框架
      proSizeList: [{ value: '' }], // 产品款式尺寸
      imgDisplayList: [], // 图片示意图
      materList: [], // 材质列表
      content: 'text', // 富文本默认内容
      categoryId: '', // 类别ID，默认为空全部
      productStatus: '', // 上下加筛选情态
      auditStatus: '', // 审核中状态 auditStatus;1//审核状态 0 不需要审核 1 审核中 2 已审核 3 审核通过 4 驳回
      isAudit: '', // 审核中和未审核
      proPageNum: 1, // 产品接口第几页默认为1
      proRowSize: 12, // 产品接口每页显示几条
      proAllSize: 0, // 产品总数是多少个产品
      seriesList: [], // 产品系列列表
      seriesSelect: '1', // 选择产品系列无系列1，有系列为0
      seriesSelectNum: '0', // 选择产品系列无系列0，修改为1，新增系列为2
      serieId: '', // 选择产品系列id
      pictureIndex: 0, // 图片下标
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      queryData: [], // 对戒材质
      proLoading: true, // 产品加载中属性
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgData: {}, // 上传返回3D图包数组
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
    };
    // 定义全局变量方法
  }




  componentDidMount() {
    // 查询产品接口
    this.getList(1, 12);

    // 查询系列数据信息
    app.$api.querySeriesFac().then((res) => {
      const tempData = res.data;
      // tempData.unshift({ serieId: '', cname: '全部' });
      this.setState({
        seriesList: tempData,
      });
    });
        // 查询分类数据信息
    app.$api.queryClassifyInfo().then((res) => {
      const tempData = res.data;
      tempData.unshift({ classifyId: '', cname: '全部' });
      this.setState({
        categoryList: tempData,
      });
    });

    // 查询适合人群数据信息
    app.$api.selectCrowdNumber().then((res) => {
      this.setState({
        crowdList: res.data,
      });
    });
  }
  // 选择产品多选框
  // proSelectChange(checkedValues) {
  //   proSelectEdList = checkedValues;
  // }

  // 改变品类
  changeClass= (e) => {
    const self = this;
    self.setState(() => ({
      classifyId: e,
    }), () => {
      self.getList(1, 12);
    });
  }
    // 改变品类
  changeStatus= (e) => {
    const self = this;
    self.setState(() => ({
      statu: e,
    }), () => {
      self.getList(1, 12);
    });
  }
  // 产品查询接口
  getList(page, rowSize) {
    this.setState({
      proLoading: true,
    });
    const self = this;
    // 查询产品数据信息
    const params = {
      serieId: self.state.serieId,
      classifyId: self.state.classifyId,
      // onSale: self.state.onSale,
      statu: self.state.statu,
      isAudit: self.state.isAudit,
      page,
      rows: rowSize,
    };
    if (!self.state.serieId) {
      delete params.serieId;
    }
    if (!self.state.classifyId) {
      delete params.classifyId;
    }
    if (!self.state.onSale) {
      delete params.onSale;
    }
    if (!self.state.isAudit) {
      delete params.isAudit;
    }

     // 钻石定制产品读取
    app.$api.getProductsByfactory(params).then((res) => {
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
      console.log(res.data);
      this.setState({
        proDataList: tempList,
        proPageNum: 1,
        proAllSize: res.data.rowSize,
        proLoading: false,
      });
    });
  }

  // 页码、每页显示几条事件
  onShowSizeChange=(current, pageSize) => {
    // console.log(current, pageSize);
    const self = this;

    self.setState(() => ({
      proPageNum: current,
      proAllSize: pageSize,
      checkAll: false,
    }), () => {
      self.getList(current, pageSize);
      proSelectEdList = [];
    });

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
  showModal=(elem) => {
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
    elem.skuPages.forEach((ielem) => {
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
      // switch (ielem.skuProps[0].parentPropValue) {
      //   case '对戒':
      //     tempSkuDouList.push(ielem);
      //     break;
      //   case '男戒':
      //     tempSkuManList.push(ielem);
      //     break;
      //   case '女戒':
      //     tempSkuWomanList.push(ielem);
      //     break;
      // }
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
              if (jelem.skuProps[0].propValue) {
                if (welem.name == jelem.skuProps[0].propValue) {
                  welem.minPrice = jelem.minPrice;
                  welem.maxPrice = jelem.maxPrice;
                  // welem.futurePrice = jelem.futurePrice;
                  welem.value[0].forEach((relem) => {
                    jelem.skuProps.forEach((kelem) => {
                      if (relem.propId == kelem.propId) {
                        relem.propValue = kelem.propValue;
                      }
                    });
                  });
                }
              } else if (welem.name == jelem.skuProps[0].propValue) {
                welem.value[0].forEach((relem) => {
                  jelem.skuProps.forEach((kelem) => {
                      // console.log("CCC:")
                      // console.log(kelem)
                      // console.log(relem)
                    if (relem.propId == kelem.propId) {
                      relem.propValue = kelem.propValue;
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


    if (elem.serieId == 0) {
      elem.serieId = '';
    }
    self.setState({
      proViewDetail: elem,
      proImgBigUrl: elem.picUrlList[0],
      proViewModalTF: true,
      threeDImgDisplayTf: false,
      tempOneDis: true,
    }, () => {
      // console.log(self.state.proViewDetail);
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
          // self.getList(1, 12);
          self.getList(self.state.proPageNum, self.state.proRowSize);
          proSelectEdList = [];
        });
      });
    } else {
      message.error('还未选择产品，请重新选择！');
    }
  }

  // 打开‘取消上架’按钮
  cancelGround = () => {
    const self = this;
    if (proSelectEdList.length != 0) {
      console.log(self.state.proDataList);
      console.log(proSelectEdList);
      const params = { productIds: JSON.stringify(proSelectEdList), onSale: 'N' };
      app.$api.updateSaleStatu(params).then((res) => {
        message.success('产品取消上架成功，正在刷新页面');
        self.setState({
          proModifyModalTF: false,
          proViewModalTF: false,
        }, () => {
          // self.getList(1, 12);
          self.getList(self.state.proPageNum, self.state.proRowSize);
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
          }, () => {
            self.getList(self.state.proPageNum, self.state.proRowSize);
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
    thiselem.context.router.push('/MyFactory/uploadProCustom');
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


  handleChange(content) {
    // console.log(content);
    this.setState({
      content,
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

  getImg(e) {
    const files = e.target.files[0];
    const fromData = new FormData();
    fromData.append('uploadType', 1);
    fromData.append('file', files);
    app.$api.upImgs(fromData).then((res) => {
      console.log(res);
    });
  }


  handleCancel(self) {
    self.setState({
      proViewModalTF: false,
    });
  }

  // 修改产品弹出框(上架中，需要下架)
  modifyProOne = () => {

    // return;
    const params = { productIds: JSON.stringify([this.state.proViewDetail.productId]), onSale: 'N' };
    app.$api.updateSaleStatu(params).then((res) => {
      message.success('此产品下架成功，正在路转修改产品页！');
    // console.log('kkkk');
      // console.log(this.state.proViewDetail.manufacturePropSizes);
    // 先将产品下架
      this.setState({
        proViewModalTF: false,
        proModifyModalTF: true,
      });
      // console.log(this.state.proViewDetail);

      this.state.imgDisplayList = this.state.proViewDetail.images;
    });
    // const tempDesignValue = thiselem.state.proViewDetail.designs[0].designValue.split(',');
    // const tempProSizeList = [];
    // for (let i = 0; i < tempDesignValue.length; i++) {
    //   tempProSizeList.push({ value: tempDesignValue[i] });
    // }
    // thiselem.setState({
    //   proViewModalTF: false,
    //   proModifyModalTF: true,
    //   proSizeList: tempProSizeList,
    // });

    // thiselem.state.imgDisplayList = thiselem.state.proViewDetail.images;

  }

  // 修改产品弹出框(不是上架中，不需要下架)
  modifyProTwo = () => {
    // console.log('kkkk');
    // 先将产品下架
    // console.log(this.state.proViewDetail.manufacturePropSizes);

    this.setState({
      proViewModalTF: false,
      proModifyModalTF: true,
    });
    // console.log(this.state.proViewDetail);
    // return;
    if (this.state.proViewDetail.isAudit == 4 && this.state.proViewDetail.onSale != 'N') {
      const params = { productIds: JSON.stringify(this.state.proViewDetail.productId), isSale: 'N' };
      app.$api.updateSaleStatu(params).then((res) => {
        message.success('此产品下架成功，正在路转修改产品页！');
        const tempDesignValue = this.state.proViewDetail.designs[0].designValue.split(',');
        const tempProSizeList = [];
        for (let i = 0; i < tempDesignValue.length; i++) {
          tempProSizeList.push({ value: tempDesignValue[i] });
        }
        this.setState({
          proViewModalTF: false,
          proModifyModalTF: true,
          proSizeList: tempProSizeList,
        });

        this.state.imgDisplayList = this.state.proViewDetail.images;
      });
    } else {
      const tempDesignValue = this.state.proViewDetail.designs[0].designValue.split(',');
      const tempProSizeList = [];
      for (let i = 0; i < tempDesignValue.length; i++) {
        tempProSizeList.push({ value: tempDesignValue[i] });
      }
      this.setState({
        proViewModalTF: false,
        proModifyModalTF: true,
        proSizeList: tempProSizeList,
      });

      this.state.imgDisplayList = this.state.proViewDetail.images;
    }

    // const tempDesignValue = thiselem.state.proViewDetail.designs[0].designValue.split(',');
    // const tempProSizeList = [];
    // for (let i = 0; i < tempDesignValue.length; i++) {
    //   tempProSizeList.push({ value: tempDesignValue[i] });
    // }
    // thiselem.setState({
    //   proViewModalTF: false,
    //   proModifyModalTF: true,
    //   proSizeList: tempProSizeList,
    // });

    // thiselem.state.imgDisplayList = thiselem.state.proViewDetail.images;

  }
  // 修改产品数据调接口
  modifySave(thiselem) {
    // 提交新产品参数
    const params = { productStr: JSON.stringify(self.state.proViewDetail) };
    app.$api.updateFactoryProduct(params).then((res) => {
      thiselem.setState({
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


  // 改变页码
  changePage = (page, pageSize) => {
    // console.log(page);
    // console.log(pageSize);
    const self = this;
    this.setState({
      proPageNum: page,
      proRowSize: pageSize,
      checkAll: false,
    });
    this.getList(page, this.state.proRowSize);
    proSelectEdList = [];
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
        message.success(res.msg);
        self.setState({
          proModifyModalTF: false,
          proViewModalTF: false,
        }, () => {
          self.getList(1, 12);
        });
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
      console.log(self.state.productStr);
      // app.$api.addProductNumber(params).then((res) => {
      //   self.context.router.push('/MyFactory/manageFinishProduct');
      // });

    });
  };


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
  // 改变select系列
  changeSeries=(e) => {
    // console.log(e);
    const self = this;
    self.setState({
      seriesSelect: '0', // 选择产品系列无系列1，有系列为0
      seriesSelectNum: '0', // 选择产品系列无系列0，修改为1，新增系列为2
      serieId: e,
    });
    for (let i = 0; i < self.state.seriesList.length; i++) {
      if (self.state.seriesList[i].serieId == e) {
        if (self.state.seriesList[i].serieType == 'SYS') {
          self.setState({
            modifySeriesTF: false,
          });
        } else {
          self.setState({
            modifySeriesTF: true,
          });
        }
        self.setState({
          cname: self.state.seriesList[i].cname,
          serieDetai: self.state.seriesList[i].serieDetai ? self.state.seriesList[i].serieDetai : '',
        });
      }
    }
  }

  // 修改系列
  editSeries(thiselem) {
    thiselem.props.form.validateFields((err, values) => {
      const params = { serieId: thiselem.state.serieId, cname: values.cname, serieDetai: values.serieDetai };
      // 修改系列
      app.$api.updateSerie(params).then((res) => {
        thiselem.setState({
          seriesSelect: '1',
          seriesSelectNum: '0',
          // serieId: '',
        });
        this.componentDidMount();
      });
    });
  }
  // 增加新系列
  addseries(thiselem) {
    thiselem.props.form.validateFields((err, values) => {
      const params = { cname: values.cname, serieType: 'DESIGNER', serieDetai: values.serieDetai };
      // 新增系列
      app.$api.createSerie(params).then((res) => {
        this.componentDidMount();
        thiselem.setState({
          seriesSelect: '1',
          seriesSelectNum: '0',
        });
      });
    });
  }
    // 选择是新增系列还是选择原来系统
  clickSeries(elem, thiselem) {
    if (elem == 1) {
      thiselem.setState({
        seriesSelect: elem,
        serieId: '',
      });
    } else {
      thiselem.setState({
        seriesSelect: elem,
      });
    }
  }

    // 产品发布上架
  editAddState(thiselem) {
    const params = { productIds: JSON.stringify([thiselem.state.proViewDetail.productId]), onSale: 'Y' };
    app.$api.updateSaleStatu(params).then((res) => {
      message.success(res.msg);
      thiselem.setState({
        proModifyModalTF: false,
        proViewModalTF: false,
      }, () => {
        thiselem.getList(1, 12);
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

  // 删除3d图包
  delRar() {
    this.state.proViewDetail.threeDUrl = false;
    this.state.proViewDetail.mPicUrl = false;
    this.setState({
      proViewDetail: this.state.proViewDetail,
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

  // 保存修改产品确认接口
  modifySaveData(elem, thiselem) {
    const self = thiselem;
    // console.log(elem);
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

        let skuAllData = self.state.proViewDetail.skuPages;
        // console.log(self.state.proViewDetail);
        // console.log(self.state);

        // if()
        if (self.state.proViewDetail.classifyName != '对戒') {
          skuAllData.forEach((item, ind) => {
            // console.log(ind)
            // item.futurePrice = values[`futurePrice_${ind}`];
            item.minPrice = values[`minPrice_${ind}`];
            item.maxPrice = values[`maxPrice_${ind}`];
            // console.log(item)
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
            let maxPriceNum = 0;
            // let futurePriceNum = 0;
            item.skuData.skuAllList.forEach((ielem, indOne) => {
              if (item.skuName == ielem.name) {
                // futurePriceNum = parseInt(values[`futurePriceDou_${indSum}_${ielem.name}`]);
                minPriceNum = parseInt(values[`minDouPrice_${indSum}_${ielem.name}`]);
                maxPriceNum = parseInt(values[`maxDouPrice_${indSum}_${ielem.name}`]);
                ielem.value[0].forEach((jelem, indTwo) => {
                  skuPropsList.push({
                    propId: jelem.propId,
                    propValue: jelem.isScheduled == 'Y' ? values[`propValueTwo_${indSum}_${indOne}_${jelem.propId}`] : values[`propValue_${indSum}_${indOne}_${jelem.propId}`],
                  });
                });
              }
            });
            // console.log('bbbb:');
            // console.log(values);
            subSkuData = {
              // futurePrice: futurePriceNum,
              minPrice: minPriceNum,
              maxPrice: maxPriceNum,
              skuProps: skuPropsList,
              skuId: item.skuId != 'new' ? item.skuData.skuId : 'new',
            };

            skuAllData.push(subSkuData);
          });

        }


        const params = {
          productId: this.state.proViewDetail.productId,
          serieId: values.serieId ? values.serieId : '',
          classifyId: this.state.proViewDetail.classifyId,
          productName: values.productName,
          productDetail: values.productDetail,
          picUrl: picTxt.join(','),
          threeDUrl: this.state.proViewDetail.threeDUrl ? this.state.proViewDetail.threeDUrl : '',
          mPicUrl: this.state.proViewDetail.mPicUrl ? this.state.proViewDetail.mPicUrl : '',
          manufactureProps: JSON.stringify(sizeAllDataTwo),
          manufacturePropSizes: JSON.stringify(sizeAllData),
          imageId: self.state.threeDImgData.imageId,
          skus: JSON.stringify(skuAllData),
        };
        if (elem == 'N') {
          params.num = 1;
        }
        // console.log(skuAllData);
        // console.log('修改数据');
        // console.log(params);

        app.$api.updateProduct(params).then((res) => {
          message.success(res.msg);
          self.setState({
            proModifyModalTF: false,
            proViewModalTF: false,
            serieId: '',
          }, () => {
            self.getList(1, 12);
          });
        });

      }
    });
  }

  // 删除sku事件
  delSku=(index) => {
    if (this.state.proViewDetail.classifyName != '对戒') {
      if (this.state.proViewDetail.skuPages.length <= 1) {
        message.error('规格不能全部删除！');
        return;
      }
      this.state.proViewDetail.skuPages.splice(index, 1);
      this.setState({
        proViewDetail: this.state.proViewDetail,
      });
    } else {
      if (this.state.proViewDetail.skuDisList.length <= 1) {
        message.error('规格不能全部删除！');
        return;
      }
      this.state.proViewDetail.skuDisList.splice(index, 1);
      this.setState({
        proViewDetail: this.state.proViewDetail,
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
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const formItemTwo = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const formItemThree = {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
    };
    // const imgLis = () => {
    //   if (self.state.proViewDetail.picUrlList) {
    //     const lis = self.state.proViewDetail.picUrlList.map((item) => {
    //       return (
    //         <img src={app.$http.imgURL + item} className={styles.imgSmall} />
    //       );
    //     });
    //     return lis;
    //   }
    // };

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
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => this.changeSerice(event)}>
                <Option value="">全部</Option>
                {this.state.seriesList.map(data =>
                  <Option value={data.serieId}>{data.cname}</Option>,
                )}
              </Select>
            </span>
            <span className={styles.marginLeft30}>
              类别：
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => this.changeClass(event)}>
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
              <Popconfirm title="确定取消上架所选产品?" onConfirm={self.cancelGround} okText="确定取消上架" cancelText="取消">
                <Button className="bottonPublic" type="primary" className={styles.marginLeft30}>取消上架</Button>
              </Popconfirm>
              <Popconfirm title="确定发布上架所选产品?" onConfirm={self.addGround} okText="确定上架" cancelText="取消">
                <Button className="bottonPublic" type="primary" className={styles.marginLeft30}>发布上架</Button>
              </Popconfirm>
              <span style={{ marginRight: 20 }}>
                <Popconfirm placement="topRight" title="确定删除所选产品？" onConfirm={self.delPro} okText="确定删除" cancelText="取消">
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
                                {ielem.onSale == 'N' ?
                                ''
                                :
                                <span>
                                  {ielem.isAudit == 1 ? '待完善' : ''}
                                  {ielem.isAudit == 2 ? '审核中' : ''}
                                  {ielem.isAudit == 3 ? '审核不通过' : ''}
                                  {ielem.isAudit == 4 ? '已上架' : ''}
                                  {ielem.isAudit == 5 ? '审核中' : ''}
                                </span>
                              }
                              </span>
                              {ielem.onSale == 'N' ? <div className={styles.underFrame} onClick={() => self.showModal(ielem)} >已下架</div> : ''}
                              <div className={styles.imgTop} >
                                {/* {ielem.checked == true ? 'true' : 'false'} */}
                                {/* <Checkbox value={ielem.productId} checked /> */}
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
            {self.state.proAllSize != 0 ?
              <Row className={styles.textRight}>
                <Pagination
                  showSizeChanger
                  onShowSizeChange={self.onShowSizeChange}
                  defaultCurrent={self.state.proPageNum}
                  onChange={self.changePage}
                  total={self.state.proAllSize}
                  defaultPageSize={self.state.proRowSize}
                  pageSizeOptions={[12, 24, 48]}
                />
              </Row>
              : ''
            }
            <Modal
              visible={this.state.proViewModalTF}
              onCancel={() => this.handleCancel(self)}
              width="1100"
              footer={[
                <div className={styles.modalFooter}>
                  {this.state.proViewDetail.onSale == 'N' ?
                    <Button className="bottonPublic" type="primary" onClick={() => self.editAddState(this)}>
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
                    <Col span={12} className="proTit">
                      产品信息
                    </Col>
                    <Col span={12}>
                      {this.state.proViewDetail.isAudit == 4 && this.state.proViewDetail.onSale != 'N' ?
                        <Popconfirm title="需要先取消上架才能修改信息,是否取消上架？" onConfirm={this.modifyProOne} okText="确定" cancelText="否">
                          <span className={styles.spanTitModi} type="primary">修改产品信息</span>
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
                          <Col span={24} className={styles.leftTxt}>供应商名称：<span className={styles.rightTxt}>{this.state.proViewDetail.nickName}</span></Col>
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
                                    <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>供应商批发价/￥</span>
                                    <span style={{ color: '#333333', fontSize: '16px' }}>{data.minPrice}~{data.maxPrice}</span>
                                  </Col>
                                  {/* {data.futurePrice ?
                                    <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>预估成本价/￥</span>
                                      <span style={{ color: '#333333', fontSize: '16px' }}>{data.futurePrice}</span>
                                    </Col>
                                    : ''
                                  } */}

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
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>供应商批发价/￥</span>
                                            <span style={{ color: '#333333', fontSize: '16px' }}>{idata.minPrice}~{idata.maxPrice}</span>
                                          </Col>
                                          {/* {idata.futurePrice ?
                                            <Col span={6} className={styles.titTxtOne} style={{ float: 'right', height: 40 }}>
                                              <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>预估成本价/￥</span>
                                              <span style={{ color: '#333333', fontSize: '16px' }}>{idata.futurePrice}</span>
                                            </Col>
                                            : ''
                                          } */}

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
                    <Button className="bottonPublic" type="primary" onClick={() => this.modifySaveData('Y', this)}>
                    保存
                    </Button>
                    {this.state.proViewDetail.isAudit != 2 && this.state.proViewDetail.isAudit != 5 ?
                      <Button className="bottonPublic" type="primary" onClick={() => this.modifyProSubmit(self)}>
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
                              <Select placeholder="请输入系列" className={styles.seriesSelect} showSearch onChange={event => self.changeSeries(event)}>
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
                            {self.state.seriesSelect == '0' ?
                              <span className={styles.seriesRedTxtOne} onClick={() => { self.modifySeries('1', self); }}>修改系列</span>
                              : ''
                            }
                            <span className={styles.seriesRedTxtTwo} onClick={() => { self.modifySeries('2', self); }}>创建新系列</span>
                          </div>
                          <div>
                            {self.state.seriesSelectNum == '0' ?
                              <div>
                                <div className={styles.seriesTxtOne}><b>系列名称：</b>{self.state.cname}</div>
                              </div> : ''}
                            {self.state.seriesSelectNum == '1' ?
                              <div>
                                <div>
                                  {getFieldDecorator('cname', {
                                    initialValue: self.state.cname,
                                  })(<Input placeholder="请输入系列名称" style={{ width: 300 }} />)}
                                </div>
                                <div><Button className="bottonPublic" type="primary" onClick={() => self.editSeries(self)}>修改</Button></div>
                              </div> : ''}
                            {self.state.seriesSelectNum == '2' ?
                              <div>
                                <div className={styles.marginB20}>
                                  {getFieldDecorator('cname', {
                                  })(<Input placeholder="请输入系列名称" style={{ width: 300 }} />)}
                                </div>
                                <div><Button className="bottonPublic" type="primary" onClick={() => self.addseries(self)}>创建</Button></div>
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
                      })(
                        <Select placeholder="请输入产品类别" style={{ width: 211 }} showSearch disabled>
                          {this.state.categoryList.map(data => (
                            <Option value={data.classifyId}>{data.cname}</Option>
                          ))}
                        </Select>,
                      )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="款式名称" className={styles.forItemDiv}>
                      {getFieldDecorator('productName', {
                        initialValue: self.state.proViewDetail.productName,
                      })(
                        <Input style={{ width: 462 }} placeholder="请输入款式名称" />,
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
                          <FormItem {...formItemLayout} label={idata.cname} className={styles.forItemDiv}>
                            {getFieldDecorator(`propValue_${idata.propId}`, {
                              initialValue: idata.propValue,
                            })(<Input placeholder="" width={{ width: 480 }} />)}
                          </FormItem>,
                        )) : ''
                    }
                    {this.state.proViewDetail.manufacturePropSizes ?
                        (this.state.proViewDetail.manufacturePropSizes.map((idata, index) =>
                          <FormItem {...formItemThree} label={idata.cname}>
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
                              <div className={styles.mainTxt}>
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
                                              <Row className={styles.tabOneCol}>
                                                {ielem.value[0].map((kelem, indTwo) =>
                                                  (
                                                    <Col span={6} style={{ height: 40 }}>
                                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{kelem.cname}</span>
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
                                                    </Col>
                                                  ),
                                                )}
                                                <Row>
                                                  {/* {ielem.futurePrice ?
                                                    <Col span={6} style={{ float: 'right', height: 40 }}>
                                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>预估成本价/￥</span>
                                                      {getFieldDecorator(`futurePriceDou_${ind}_${ielem.name}`, {
                                                        initialValue: ielem.futurePrice,
                                                      })(<InputNumber placeholder="" style={{ width: 50 }} />)}
                                                    </Col>
                                                    : ''
                                                  } */}
                                                  <Col span={6} style={{ float: 'right', height: 40 }}>
                                                    <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>供应商批发价/￥</span>
                                                    {getFieldDecorator(`minDouPrice_${ind}_${ielem.name}`, {
                                                      initialValue: ielem.minPrice,
                                                    })(<InputNumber placeholder="" style={{ width: 50 }} />)}
                                                  ~
                                                  {getFieldDecorator(`maxDouPrice_${ind}_${ielem.name}`, {
                                                    initialValue: ielem.maxPrice,
                                                  })(<InputNumber placeholder="" style={{ width: 50 }} />)}
                                                    <span className={styles.delSkuIco} onClick={() => this.delSku(ind)}> X </span>
                                                  </Col>
                                                </Row>
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
                                          <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>供应商批发价/￥</span>
                                          {getFieldDecorator(`minPrice_${ind}`, {
                                            initialValue: data.minPrice,
                                          })(<InputNumber placeholder="" style={{ width: 50 }} />)}
                                          ~
                                          {getFieldDecorator(`maxPrice_${ind}`, {
                                            initialValue: data.maxPrice,
                                          })(<InputNumber placeholder="" style={{ width: 50 }} />)}
                                          <span className={styles.delSkuIco} onClick={() => this.delSku(ind)}> X </span>
                                        </Col>
                                        {/* {data.futurePrice ?
                                          <Col span={6} className={styles.titTxtOne} style={{ float: 'right' }}>
                                            <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>预估成本价/￥</span>
                                            {getFieldDecorator(`futurePrice_${ind}`, {
                                              initialValue: data.futurePrice,
                                            })(<InputNumber placeholder="" style={{ width: 50 }} />)}
                                          </Col>
                                          : ''
                                        } */}
                                      </Row>,
                                      )
                                      :
                                    <div>此产品暂无材质规格！</div>
                                )
                               }
                              </div>

                            </div>
                          </Col>
                        </Row>
                        <div>
                          <div className={styles.margin10} style={{ marginBottom: 50 }}>
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
                              className={styles.imgUpload}
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
                          <Col span={10}>
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
                    <div className={styles.hr} style={{ margin: '30px 0 40px 0' }} />
                    <div className={`${styles.mainTxt}`}>上传3D图包（可选）</div>
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
