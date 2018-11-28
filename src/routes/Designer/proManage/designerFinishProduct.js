import React from 'react';
import { connect } from 'dva';
import { router } from 'react-router';
import PropTypes from 'prop-types';
import styles from './designerFinishProduct.less';
import Editor from 'react-umeditor';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select, Checkbox, message, Form, InputNumber, Popconfirm, Pagination, Spin } from 'antd';

import Swiper from 'react-id-swiper';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Column, ColumnGroup } = Table; // 表格属性
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const tableState = {
  bordered: false,
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
      cancelLoading: false, // 取消加载状态
      confirmLoading: false, // 确定加载状态
      categoryList: [], // 产品分类接口数据
      modifyCategoryList: [], // 产品修改分类接口数据
      categoryValue: '', // 产品分类选中信息
      seriesList: [], // 产品系列搂口信息
      crowdList: [], // 适合人群接口数据
      crowdValue: '', // 适合人群选中信息
      proDataList: [], // 产品接口数据
      seriesList: [], // 产品系列数据
      seriesSelect: '1', // 选择产品系列无系列1，有系列为0
      seriesSelectNum: '0', // 选择产品系列无系列0，修改为1，新增系列为2
      seriesId: '', // 选择产品系列ID
      seriecsId: '', // 选择产品系列ID
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
      pageIndex: 1, // 当前页
      pageSize: 12, // 每页展示条数
      totalNum: 0, // 总条数
      content: '', // 富文本默认字段
      productStr: {}, // 修改产品对象
      pictureIndex: 0, // 图片下标
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      plugins: { // 富文本上传
        image: {
          uploader: {
            name: 'files',
            filename: 'files',
            url: `${app.$http.URL}/imagers/uploadImage`,
            filter(res) {
              return app.$http.imgURL + res.data.imageUrl;
            },
          },
        },
      },
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
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
    this.getlist(1, 12);
    // 查询系列分类数据信息
    app.$api.selectSeriecsListByOperateId().then((res) => {
      if (res.data) {
        const tempData = res.data;
        this.setState({
          seriesList: tempData,
        });
      } else {
        this.setState({
          seriesList: [],
        });
      }
    });
    // 查询分类数据信息
    app.$api.selectCategoryNumber().then((res) => {
      const tempData = res.data;
      tempData.unshift({ id: '', commonName: '全部' });
      this.setState({
        categoryList: res.data,
      });
    });

    // 查询修改分类数据信息
    app.$api.selectCategoryNumber().then((res) => {
      this.setState({
        modifyCategoryList: res.data,
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

  // 改变类别事件
  changeSerice(e, thiselem) {
    thiselem.setState(
      () => ({
        seriecsId: e,
        pageIndex: 1,
        pageSize: 12,
      }),
      () => {
        this.getlist(1, 12);
      },
    );
  }

  // 改变类别事件
  changeCate(e, thiselem) {
    thiselem.setState(
      () => ({
        categoryId: e,
        pageIndex: 1,
        pageSize: 12,
      }),
      () => {
        this.getlist(1, 12);
      },
    );
  }

  // 改变状态
  changeStatus(e, thiselem) {
    thiselem.setState(
      () => ({
        productStatus: e,
        pageIndex: 1,
        pageSize: 12,
      }),
      () => {
        this.getlist(1, 12);
      },
    );
  }

  // 改变审核中状态
  changeAudit(e, thiselem) {
    if (e.target.checked == true) {
      thiselem.state.auditStatus = 1;
    } else {
      thiselem.state.auditStatus = '';
    }
    this.setState(
      () => ({
        pageIndex: 1,
        pageSize: 12,
      }),
      () => {
        this.getlist(1, 12);
      },
    );
  }

  // 查询产品数据信息
  getlist = (pageIndex, pageSize) => {
    this.setState({
      proLoading: true,
    });
    const paramsOne = {
      seriecsId: this.state.seriecsId,
      categoryId: this.state.categoryId,
      productStatus: this.state.productStatus,
      auditStatus: this.state.auditStatus,
      page: pageIndex,
      rows: pageSize,
    };
    app.$api.DesignProductInfo(paramsOne).then((res) => {
      let tempList;
      if (res.data.data) {
        tempList = res.data.data;
        tempList.forEach((item) => {
          item.checked = false;
        });
      } else {
        tempList = [];
      }
      this.setState({
        proDataList: tempList,
        totalNum: res.data.rowSize,
        proLoading: false,
      });
    });
  }

  proSelectChange(checkedValues) {
    console.log('checked = ', checkedValues);
    proSelectEdList = checkedValues;
    console.log(proSelectEdList);
  }
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
    console.log('总数量id');
    console.log(proSelectEdList);
  }

  // 单选
  singleElection = (e) => {
    console.log('单选');
    console.log(e);
    // console.log(item.checked);
    console.log(this.state.proDataList);
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

  getPlugins() {
    return {
      image: {
        uploader: {
          name: 'files',
          filename: 'files',
          url: `${app.$http.URL}/imagers/uploadImage`,
          filter(res) {
            return app.$http.imgURL + res.data.imageUrl;
          },
        },
      },
    };
  }
  // 打开产品详细资料+弹窗
  showModal=(elem) => {
    const self = this;
    // console.log(elem);
    const params = { productId: elem };
    // 打开产品详细资料+弹窗
    this.state.ModelAmount = '';
    app.$api.findProductByProductId(params).then((res) => {
      const tempList = res.data.designs ? res.data.designs : [];
      const tempObj = res.data;
      if (tempObj.designs && tempObj.designs[0].designValue != undefined) {
        tempObj.designs.forEach((ielem, indOne) => {
          ielem.sizeList = ielem.designValue.split(',');
        });
      } else {
        tempObj.designs.forEach((ielem, indOne) => {
          ielem.sizeList = [''];
        });
      }

      // console.log(res.data.designs);
      // console.log(tempList);
      let seriesSelect = '1';
      let seriesId = '';
      if (res.data.seriecsId == '') {
        seriesSelect = '1';
        seriesId = '';
      } else {
        seriesSelect = '0';
        seriesId = res.data.seriecsId;
      }
      // console.log(res.data);
      // console.log(res.data.seriecsId);


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

      let referencePriceTF = false;
      tempObj.textures.forEach((ielem) => {
        if (ielem.referencePrice) {
          referencePriceTF = true;
        }
      });
      tempObj.referencePriceTF = referencePriceTF;
      self.setState(
        {
          proViewDetail: tempObj,
          proImgBigUrl: res.data.images[0].imageUrl,
          designsListOne: tempList,
          proImgList: res.data.images,
          seriesSelect,
          seriesId,
        },
        () => {
          console.log(self.state.proViewDetail);
          // console.log(self.state.proViewDetail.designs);
          if (this.state.proViewDetail.details) {
            setTimeout(() => {
              self.refs.imgTxtBackup.innerHTML = self.state.proViewDetail.details;
            }, 200);
          }
        },
      );
      // console.log(self.state.proImgList);
      self.setState({
        proViewModalTF: true,
        proViewId: elem,
        threeDImgDisplayTf: false,
        tempOneDis: true,
      });
    });
  }
  // 选择是新增系列还是选择原来系统
  clickSeries(elem, thiselem) {
    thiselem.setState({
      seriesSelect: elem,
    });
  }
  // 改变select系列
  changeSeries(e, thiselem) {
    thiselem.setState({
      seriesSelect: '0', // 选择产品系列无系列1，有系列为0
      seriesSelectNum: '0', // 选择产品系列无系列0，修改为1，新增系列为2
      seriesId: e,
    });
    for (let i = 0; i < thiselem.state.seriesList.length; i++) {
      if (thiselem.state.seriesList[i].id == e) {
        thiselem.setState({
          seriesName: thiselem.state.seriesList[i].seriecsName,
          seriesDes: thiselem.state.seriesList[i].seriecsDescription,
        });
      }
    }
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


      let noExamine = false;
      proSelectEdList.forEach((item) => {
        thiselem.state.proDataList.forEach((sing) => {
          if (item == sing.productId && sing.productStatus == 4) {
            noExamine = true;
          }
        });
      });

      if (noExamine) {
        message.warning('抱歉！审核不通过的产品不能上下架！');
        return;
      }


      const params = { productId: proSelectEdList.join(','), productStatus: 1 };
      this.setState({
        confirmLoading: true,
      });
      app.$api.updataProductStatus(params).then((res) => {
        message.success('产品发布上架成功，正在刷新页面');
        thiselem.setState(
          () => ({
            proViewModalTF: false,
            checkAll: false,
            confirmLoading: false,
            // pageIndex: 1,
            // pageSize: 12,
          }),
          () => {
            this.getlist(this.state.pageIndex, this.state.pageSize);
            proSelectEdList = [];
            // this.componentDidMount();
          },
        );
      }).catch((err) => {
        thiselem.setState({
          confirmLoading: false,
        });
      });
    } else {
      // message.error('还未选择产品，请重新选择！');
      message.warning('抱歉，请选择您要上下架的产品！');
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


      let noExamine = false;
      proSelectEdList.forEach((item) => {
        thiselem.state.proDataList.forEach((sing) => {
          if (item == sing.productId && sing.productStatus == 4) {
            noExamine = true;
          }
        });
      });

      if (noExamine) {
        message.warning('抱歉！审核不通过的产品不能上下架！');
        return;
      }

      const params = { productId: proSelectEdList.join(','), productStatus: 2 };
      this.setState({
        cancelLoading: true,
      });
      app.$api.updataProductStatus(params).then((res) => {
        message.success('产品取消上架成功，正在刷新页面');
        thiselem.setState(
          () => ({
            proViewModalTF: false,
            checkAll: false,
            cancelLoading: false,
            // pageIndex: 1,
            // pageSize: 12,
          }),
          () => {
            this.getlist(this.state.pageIndex, this.state.pageSize);
            proSelectEdList = [];
          },
        );
      }).catch(() => {
        thiselem.setState({
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
      // console.log('产品数据12');
      // console.log(proSelectEdList);
      // console.log(thiselem.state.proDataList);
      // const tempProList = [];
      // thiselem.state.proDataList.forEach((ielem, ind) => {
      //   proSelectEdList.forEach((jelem) => {
      //     if (ielem.productId == jelem) {
      //       if (ielem.productStatus == 2) {
      //         tempProList.push(ielem.productId);
      //       }
      //     }
      //   });
      // });
      const tempProList = [];
      thiselem.state.proDataList.forEach((ielem, ind) => {
        proSelectEdList.forEach((jelem) => {
          if (ielem.productId == jelem) {
            if (ielem.productStatus != 1) {
              tempProList.push(ielem.productId);
            }
          }
        });
      });


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

      if (tempProList.length != 0) {
        const params = { productId: tempProList.join(',') };
        app.$api.deleteProductInfo(params).then((res) => {
          message.success('产品删除成功，正在刷新页面');
          thiselem.setState(
              () => ({
                proViewModalTF: false,
                checkAll: false,
                pageIndex: 1,
              }),
              () => {
                thiselem.getlist(this.state.pageIndex, this.state.pageSize);
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
  // 打开‘上传产品’按钮
  uploadPro(thiselem) {
    thiselem.context.router.push('/Designer/uploadPro');
  }
  // 平面产品图片上传
  imgUpload(thiselem) {
    thiselem.refs.imgInput.click();
  }
  // 事件平面产品图片上传
  imgInputFun(thiselem) {
    // console.log(this.refs.imgInput.files)
    const params = new FormData();
    params.append('files', thiselem.refs.imgInput.files[0]);
    // 图片上传
    app.$api.uploadImage(params).then((res) => {
      const imgList = thiselem.state.imgDisplayList;
      // imgList.push(res.data);
      imgList.push({
        id: res.data.imageId,
        imageUrl: res.data.imageUrl,
      });
      thiselem.setState(() => ({
        imgDisplayList: imgList,
      }), () => {
        thiselem.refs.imgInput.value = '';
      });
    });
  }
  // 平面产品图片删除
  delImg(proId, ind) {
    const self = this;
    if (self.state.proViewDetail.images.length <= 1) {
      message.error('产品不能没有图片，此图片不能被删除！');
      return false;
    }
    self.state.proViewDetail.images.splice(ind, 1);
    self.setState({
      proViewDetail: self.state.proViewDetail,
    });
  }

  // 平面产品图片上传
  rarUpload(thiselem) {
    console.log(thiselem);
    // console.log(self.refs.rarInput)
    thiselem.refs.rarInput.click();
    // console.log(self);
  }
  // 平面产品图片删除
  delRar(thiselem, elem) {
    console.log(thiselem);
    console.log(elem);
    this.setState({
      jpgThreeDId: false,
      jpgThreeDUrl: false,
      // figureFrom: {
      //   figureImageId: '', // 3D图包包的ID
      // },
    });
  }
  // 3D压缩图上传
  rarInputFun(thiselem) {
    const params = new FormData();
    const name = thiselem.refs.rarInput.files[0].name;
    const fileName = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    if (fileName != 'rar' && fileName != 'zip') {
      message.error('请上传要求上传3D图包！');
      thiselem.refs.rarInput.value = '';
      return;
    }
    params.append('files', thiselem.refs.rarInput.files[0]);
    app.$api.uploadFile(params).then((res) => {
      this.setState(() => ({
        jpgThreeDId: res.data.imageId,
        jpgThreeDUrl: res.data.imageUrl,
      }), () => {
        thiselem.refs.rarInput.value = '';
      });
    });
  }

  // 打开‘发布上架’按钮
  // addGround(thiselem) {
  //   if (proSelectEdList.length != 0) {
  //     const params = { productId: proSelectEdList.join(','), productStatus: 1 };
  //     app.$api.updataProductStatus(params).then((res) => {
  //       message.success('产品发布上架成功，正在刷新页面');
  //       thiselem.componentDidMount();
  //       thiselem.setState({
  //         pageIndex: 1,
  //         pageSize: 12,
  //         proViewModalTF: false,
  //       });
  //     });
  //   } else {
  //     message.error('还未选择产品，请重新选择！');
  //   }
  // }

  // 打开‘取消上架’按钮
  // cancelGround(thiselem) {
  //   if (proSelectEdList.length != 0) {
  //     const params = { productId: proSelectEdList.join(','), productStatus: 2 };
  //     app.$api.updataProductStatus(params).then((res) => {
  //       message.success('产品取消上架成功，正在刷新页面');
  //       thiselem.componentDidMount();
  //       thiselem.setState({
  //         pageIndex: 1,
  //         pageSize: 12,
  //         proViewModalTF: false,
  //       });
  //     });
  //   } else {
  //     message.error('还未选择产品，请重新选择！');
  //   }
  // }

  handleCancel(self) {
    self.setState({
      proViewModalTF: false,
      addGroundModalTF: false,
      cancelGroundModalTF: false,
    });
  }
  // 产品发布上架
  editAddState(thiselem) {
    const params = { productId: thiselem.state.proViewId, productStatus: 1 };
    app.$api.updataProductStatus(params).then((res) => {
      thiselem.componentDidMount();
      thiselem.setState({
        proViewModalTF: false,
      });
    });
  }
  // 产品取消上架
  editUnderState(thiselem) {
    const params = { productId: thiselem.state.proViewId, productStatus: 2 };
    app.$api.updataProductStatus(params).then((res) => {
      thiselem.componentDidMount();
      thiselem.setState({
        proViewModalTF: false,
      });
    });
  }

  // 修改产品弹出框
  modifyPro(thiselem) {
    // console.log(this.state.proViewDetail)
    // 先将产品下架;
    const params = { productId: this.state.proViewDetail.id, productStatus: 2 };
    console.log('参数12312');
    app.$api.updataProductStatus(params).then((res) => {
      message.success('此产品下架成功，正在路转修改产品页！');

      let tempDesignValue = [];
      if (thiselem.state.proViewDetail.designs && thiselem.state.proViewDetail.designs[0].designValue != undefined) {
        tempDesignValue = thiselem.state.proViewDetail.designs[0].designValue.split(',');
      } else {
        tempDesignValue = [];
      }

      const tempProSizeList = [];
      for (let i = 0; i < tempDesignValue.length; i++) {
        tempProSizeList.push({ value: tempDesignValue[i] });
      }
      thiselem.setState(
        {
          proViewModalTF: false,
          proModifyModalTF: true,
          proSizeList: tempProSizeList,
        },
        () => {
          console.log(thiselem.state.proViewDetail);
        },
      );
      thiselem.state.imgDisplayList = thiselem.state.proViewDetail.images;

      if (this.state.proViewDetail.figureFrom != undefined) {
        this.setState({
          jpgThreeDId: this.state.proViewDetail.figureFrom.figureImageId,
          jpgThreeDUrl: this.state.proViewDetail.figureFrom.figuerThurl,
        });
      }
    });
  }
  // 修改产品弹出框()
  modifyProTwo(thiselem) {
    // console.log(this.state.proViewDetail)
    // 先将产品下架;
    // const params = { productId: this.state.proViewDetail.id, productStatus: 2 };
    // app.$api.updataProductStatus(params).then((res) => {
    //   message.success('此产品下架成功，正在路转修改产品页！');

    let tempDesignValue = [];
    if (thiselem.state.proViewDetail.designs && thiselem.state.proViewDetail.designs[0].designValue != undefined) {
      tempDesignValue = thiselem.state.proViewDetail.designs[0].designValue.split(',');
    } else {
      tempDesignValue = [];
    }

    const tempProSizeList = [];
    for (let i = 0; i < tempDesignValue.length; i++) {
      tempProSizeList.push({ value: tempDesignValue[i] });
    }
    thiselem.setState(
      {
        proViewModalTF: false,
        proModifyModalTF: true,
        proSizeList: tempProSizeList,
      },
      () => {
        console.log(thiselem.state.proViewDetail);
      },
    );
    thiselem.state.imgDisplayList = thiselem.state.proViewDetail.images;

    if (this.state.proViewDetail.figureFrom != undefined) {
      this.setState({
        jpgThreeDId: this.state.proViewDetail.figureFrom.figureImageId,
        jpgThreeDUrl: this.state.proViewDetail.figureFrom.figuerThurl,
      });
    }
    // console.log('编辑数据');
    // console.log(thiselem.state.proViewDetail);
    // console.log(thiselem.state.imgDisplayList);
    // });
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
  modifyCancel = () => {
    this.setState(() => ({
      proModifyModalTF: false,
      proViewModalTF: false,
    }), () => {
      this.getlist(this.state.pageIndex, this.state.pageSize);
    });
  }
  // 添加尺寸
  addProSize=(ind) => {
    const tempProSizeList = this.state.proViewDetail.designs[`${ind}`].sizeList;
    // console.log(tempProSizeList);
    const self = this;
    tempProSizeList.push('');
    // console.log(self.state.proViewDetail.designs[`${ind}`].sizeList);
    self.setState({
      proViewDetail: self.state.proViewDetail,
    }, () => {
      // console.log(self.setState.proViewDetail);
    });
  }
  // 添加材质
  addProMater(self) {
    // console.log(self);
    // console.log(self.state.proViewDetail.textures);
    self.state.proViewDetail.textures.push({
      textureId: '',
      texturePrice: '',
      textureWeight: '',
    });
    self.setState({
      proViewDetail: self.state.proViewDetail,
    });
    // console.log(self.state);
  }
  handleChange = (details) => {
    this.state.proViewDetail.details = details;
    this.setState({
      proViewDetail: this.state.proViewDetail,
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
    // console.log(icons);
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

  // 修改产品确认接口
  modifyProSubmit = () => {
    const self = this;
    // e.preventDefault();
    self.setState({
      saveLoading: true,
    });
    self.props.form.validateFields((err, values) => {
      const emptyTF = true; // 必填提示框判断
      if (!err) {
        // console.log('Received values of form: ', values);
        const proSizeList = []; // 款式尺寸数组
        const proMaterListTwo = []; // 产品材质/重量/价格遍历数组
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
            const proSalePrice = values[`proSalePrice_${indexNum}`];
            const referencePrice = values[`referencePrice_${indexNum}`];
            const materId = values[`materId_${indexNum}`];
            proMaterListTwo.push({
              productId: self.state.proViewDetail.id,
              textureId: materId,
              reference_price: referencePrice,
              textureWeight: `${proMinWeight}-${proMaxWeight}`,
              texturePrice: `${proSalePrice}`,
            });
          }
        }

        // console.log(proMaterListTwo);

        let Materflag = false,
          MaterIndex;
        proMaterListTwo.forEach((item, index) => {
          item.min = item.textureWeight.split('-')[0];
          item.max = item.textureWeight.split('-')[1];
          if (isNaN(item.min)) {
            MaterIndex = index;
            Materflag = true;
          }
          if (isNaN(item.max)) {
            MaterIndex = index;
            Materflag = true;
          }
          if (Number(item.max) < Number(item.min)) {
            MaterIndex = index;
            Materflag = true;
          }
          if (!item.textureId || !item.reference_price || !item.texturePrice) {
            MaterIndex = index;
            Materflag = true;
          }
        });

        if (Materflag) {
          message.error(`规格第${MaterIndex + 1}行填写错误`);
          return;
        }

        // console.log(self.state.proViewDetail);
        // console.log(self.state);
        self.state.productStr.id = self.state.proViewDetail.id; // 修改ID
        // 系列ID，无系列不传seriecsId
        if (self.state.seriesSelect == '0') {
          self.state.productStr.seriecsId = self.state.seriesId;
        } else {
          delete self.state.productStr.seriecsId;
        }

        self.state.productStr.categoryId = values.categoryId; // 分类ID
        self.state.productStr.crowdId = values.crowdId; // 适合人群ID
        self.state.productStr.productName = values.productName; // 款式名称
        self.state.productStr.productDescription = values.productDescription; // 宝石描述
        if (!self.state.proViewDetail.designs) {
          self.state.proViewDetail.designs = [{
            designValue: proSizeList.join(','),
          }];
        } else {
          self.state.proViewDetail.designs[0].designValue = proSizeList.join(',');
        }

        self.state.productStr.designs = [{
          designValue: '',
        }];


        const arr = self.state.proViewDetail.designs[0].designValue.split(',');
        const newProSizeList = app.$v.isEmptyArray(arr);

        if (self.state.proViewDetail.designs) {
          const tempListOne = [];
          self.state.proViewDetail.designs.forEach((ielem, indOne) => {
            ielem.sizeList.forEach((jelem, indTwo) => {
              ielem.sizeList[`${indTwo}`] = values[`size_${indOne}_${indTwo}`];
            });
            tempListOne.push({
              designValue: ielem.sizeList.join(','), // 款式尺寸
              productId: self.state.proViewDetail.id, // 款式产品id
              designName: ielem.designName, // 款式名称
              id: ielem.id, // 款式id
            });
          });
          self.state.productStr.designs = tempListOne;
        } else {
          delete self.state.productStr.designs;
        }

        // self.state.productStr.designs = [self.state.proViewDetail.designs[0]]; // 款式尺寸
        self.state.productStr.stonePrice = values.stonePrice; // 宝石价格
        self.state.productStr.wagePrice = values.wagePrice; // 生产工费
        const proImgList = [];
        self.state.proViewDetail.images.forEach((item) => {
          proImgList.push({ imageId: item.id });
        });
        self.state.productStr.imageIdFroms = proImgList; // 修改图片ID
        self.state.productStr.textures = proMaterListTwo; // 产品材质/重量/价格遍历數組

        if (self.state.jpgThreeDUrl != '') {
          self.state.productStr.figureFrom = { figureImageId: self.state.jpgThreeDId }; // 3D图包ID
        } else {
          self.state.productStr.figureFrom = { figureImageId: '' };
        }
        // console.log(self.state.productStr);
        // const params = { productStr: JSON.stringify(self.state.productStr) };
        // 图文详性富文本编辑
        if (self.state.proViewDetail.details && self.state.proViewDetail.details != '') {
          self.state.productStr.details = self.state.proViewDetail.details;
        } else {
          self.state.proViewDetail.details = '';
        }
        const params = app.$v.deleteEmptykey(self.state.productStr);
        // 提交新产品参数
        app.$api.updateDesignerProduct(params).then((res) => {
          self.setState(() => ({
            proModifyModalTF: false,
            proViewModalTF: false,
            saveLoading: false,
          }), () => {
            // self.context.router.push('/designer/designerFinishProduct');
            message.success(res.msg);
            self.getlist(self.state.pageIndex, self.state.pageSize);
          });
        }).catch((err) => {
          self.saveLoading({
            saveLoading: false,
          });
        });
      }
    });
  }

  // 分页
  onShowSizeChange = (current, pageSize) => {
    this.setState(
      {
        pageSize,
        pageIndex: 1,
        checkAll: false,
      },
      () => {
        this.getlist(1, pageSize);
        proSelectEdList = [];
      },
    );
  }

  onChangPage = (page, pageSize) => {
    this.setState(
      () => ({
        pageIndex: page,
        checkAll: false,
      }),
      () => {
        this.getlist(page, pageSize);
        proSelectEdList = [];
      },
    );
  }
  // 删除尺寸
  delSize=(sizeData, indexNum) => {
    const self = this;
    if (sizeData.sizeList.length > 1) {
      sizeData.sizeList.splice(indexNum, 1);
    } else {
      message.error('款式尺寸不能全删！');
    }
    self.setState({
      proViewDetail: self.state.proViewDetail,
    });
  }
  // 删除sku
  delSkuFun=(indexNum) => {
    const self = this;
    if (self.state.proViewDetail.textures.length > 1) {
      self.state.proViewDetail.textures.splice(indexNum, 1);
      self.setState({
        proViewDetail: self.state.proViewDetail,
      });
    } else {
      message.error('产品材质不能全删！');
    }
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
  };
// 3D图包点击显示3D图包，隐藏产品图片
  threeDImgDisplayFun = () => {
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
  };

  render() {
    const self = this;
    const { getFieldDecorator } = self.props.form;
    const { pageIndex, pageSize, totalNum } = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
    };
    const formItemTwo = {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
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
        <div className={styles.tit}>
          成品款管理
          <span className={styles.titSubName}>
            <span className={styles.marginLeft30}>
              系列：
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => self.changeSerice(event, self)}>
                <Option value="">全部</Option>
                {this.state.seriesList.map(data => (
                  <Option value={data.id}>{data.seriecsName}</Option>
                ))}
              </Select>
            </span>
            <span className={styles.marginLeft30}>
              类别：
              <Select defaultValue="全部" style={{ width: 120 }} onChange={event => self.changeCate(event, self)}>
                {this.state.categoryList.map(data => (
                  <Option value={data.id}>{data.commonName}</Option>
                ))}
              </Select>
            </span>
            <span className={styles.marginLeft30}>
              状态：
              <Select defaultValue="" style={{ width: 120 }} onChange={event => self.changeStatus(event, self)}>
                <Option value="">全部</Option>
                <Option value="0">待完善 </Option>
                <Option value="1">已上架</Option>
                <Option value="2">下架</Option>
                <Option value="3">审核中</Option>
                <Option value="4">审核不通过</Option>
              </Select>
            </span>
            <span>
              {/* <Checkbox onChange={event => self.changeAudit(event, self)}>审核中</Checkbox> */}
            </span>
          </span>
        </div>
        <div className={styles.hr} />
        <div>
          <Row>
            <Col span={12}>
              <Button className="bottonPublic" type="primary" onClick={() => self.uploadPro(this)}>
                上传产品
              </Button>
            </Col>
            <Col span={12} className={styles.textRight}>
              <Checkbox className="f12" onChange={this.onCheckAllChange} checked={this.state.checkAll}>
                全选
              </Checkbox>
              <Popconfirm title="确定取消上架所选产品?" onConfirm={() => self.cancelGround(self)} okText="确定取消上架" cancelText="取消">
                <Button type="primary" className={styles.marginLeft30} loading={this.state.cancelLoading}>
                  取消上架
                </Button>
              </Popconfirm>
              <Popconfirm title="确定发布上架所选产品?" onConfirm={() => self.addGround(self)} okText="确定上架" cancelText="取消">
                <Button type="primary" className={styles.marginLeft30} loading={this.state.confirmLoading}>
                  发布上架
                </Button>
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
                          <div className={styles.pro}>
                            <div>
                              <div className={styles.imgTop}>
                                {/* <span className={styles.imgTopTxt} onClick={() => self.showModal(ielem.productId)} >
                                {ielem.productStatus == 0 ? '暂存' : ''}
                                {ielem.productStatus == 1 ? '已上架' : ''}
                                {ielem.productStatus == 2 ? '下架' : ''}
                              </span> */}
                                <span className={styles.imgTopTxt} onClick={() => self.showModal(ielem.productId)}>
                                  {ielem.productStatus == 0 ? '暂存' : ''}
                                  {ielem.productStatus == 1 ? '已上架' : ''}
                                  {/* {ielem.productStatus == 2 ? '下架' : ''} */}
                                  {ielem.productStatus == 3 ? '审核中' : ''}
                                  {ielem.productStatus == 4 ? '审核不通过' : ''}
                                </span>
                                {/* {ielem.auditStatus} */}
                                {/* <Checkbox value={ielem.productId} checked={ielem.checked == true} /> */}
                                {/* {ielem.checked == true ? 'true' : 'false'} */}
                                {/* {ielem.productStatus != 3 ? */}
                                <Checkbox value={ielem.productId} checked={ielem.checked == true} onChange={this.singleElection} />
                                {/* : ''
                              } */}
                                {ielem.productStatus == 2 ? (
                                  <div className={styles.underFrame} onClick={() => self.showModal(ielem.productId)}>
                                  已下架
                                </div>
                              ) : (
                                ''
                              )}
                              </div>
                              <img src={app.$http.imgURL + ielem.productImageUrl} onClick={() => self.showModal(ielem.productId)} />
                            </div>
                            <div className={styles.proDisplay} onClick={() => self.showModal(ielem.productId)}>
                              <p className={styles.proName}>{ielem.productName}</p>
                              {ielem.auditStatus == 3 ? (
                                <p className={styles.proPrice}>
                                建议零售价：￥
                                {ielem.resalePrice}
                                </p>
                            ) : (
                              <p className={styles.proPrice}>
                                建议零售价：￥
                                {ielem.combinationPrice}
                              </p>
                            )}
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
                  {this.state.proViewDetail.productStatus == 1 ? (
                    <Button className="bottonPublic" type="primary" onClick={() => self.editUnderState(self)}>
                      取消上架
                    </Button>
                  ) : (
                    ''
                  )}
                  {this.state.proViewDetail.productStatus == 2 ? (
                    <Button className="bottonPublic" type="primary" onClick={() => self.editAddState(self)}>
                      发布上架
                    </Button>
                  ) : (
                    ''
                  )}
                </div>,
              ]}
            >
              <div className={styles.modalDiv}>
                <Row>
                  <Row className={styles.titTop}>
                    <Col span={12}>产品信息</Col>
                    <Col span={12} className={styles.textRight} style={{ textAlign: 'right', color: 'red' }}>
                      {this.state.proViewDetail.productStatus == 1 ? (
                        <Popconfirm title="需要先取消上架才能修改信息,是否取消上架？" onConfirm={() => this.modifyPro(self)} okText="确定" cancelText="否">
                          <span className={styles.spanTitModi} >修改产品信息</span>
                        </Popconfirm>
                        ) : (
                          <span onClick={() => this.modifyProTwo(self)} className={styles.spanTitModi}>
                            修改产品信息
                          </span>
                        )}
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
                      {/* <div>
                        <Swiper {...swiperParams} className={styles.swiperDiv}>
                          {this.state.proImgList.map(data => (
                            <img src={app.$http.imgURL + data.imageUrl} className={styles.imgSmall} />
                          ))}
                        </Swiper>
                      </div> */}
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
                          商品编号：
                          {this.state.proViewDetail.productCode}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>
                      <div className={styles.hr} />
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
                          <Col span={2} className={styles.leftTxt}>
                            产品类别：
                          </Col>
                          <Col span={21} className={styles.rightTxt}>
                            {this.state.proViewDetail.categoryName}
                          </Col>
                          <Col span={2} className={styles.leftTxt}>
                            适合人群：
                          </Col>
                          <Col span={21} className={styles.rightTxt}>
                            {this.state.proViewDetail.crowdName}
                          </Col>
                          <Col span={2} className={styles.leftTxt}>
                            产品名称：
                          </Col>
                          <Col span={22} className={styles.rightTxt}>
                            {this.state.proViewDetail.productName}
                          </Col>
                          <Col span={2} className={styles.leftTxt}>
                            宝石描述：
                          </Col>
                          <Col span={22} className={styles.rightTxt}>
                            {this.state.proViewDetail.productDescription}
                            {/* {this.state.proViewDetail.designsListOne} */}
                          </Col>

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
                          <Column title="材质" dataIndex="textureName" key="textureName" />
                          <Column title="重量/g" dataIndex="textureWeight" key="textureWeight" />
                          {this.state.proViewDetail.referencePriceTF ?
                            <Column title="预估成本价/￥" dataIndex="referencePrice" key="referencePrice" />
                            : null
                          }
                          <Column title="建议售价/￥" dataIndex="texturePrice" key="texturePrice" />
                          {this.state.proViewDetail.productStatus == 1 && this.state.proViewDetail.auditStatus == 3 ? <Column title="统一零售价/￥" dataIndex="salePrice" key="salePrice" /> : ''}
                        </Table>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>
                      {this.state.proViewDetail.details ? (
                        <span>
                          <div className={styles.mainTxt}>图文详情</div>
                          <div ref="imgTxtBackup" className="imgTxtBackup" />
                        </span>
                      ) : (
                        ''
                      )}
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
                  <Button className="bottonPublic" type="primary" onClick={this.modifyCancel} loading={this.state.saveLoading}>
                    取消
                  </Button>
                  <Button className="bottonPublic" type="primary" onClick={this.modifyProSubmit} loading={this.state.saveLoading}>
                    确定修改
                  </Button>
                </div>,
              ]}
            >
              <div className={styles.modalDiv}>
                <Form>
                  <div className={styles.hr} />
                  <div className={styles.seriesSelectDiv}>
                    <div>
                      <img className="cursor" src={self.state.seriesSelect == '1' ? '/images/designer/redioTwo.jpg' : '/images/designer/redioOne.jpg'} onClick={() => self.clickSeries('1', self)} />
                      无系列
                      <span className={styles.seriesSubTxt}>直接上传不添加系列</span>
                    </div>
                    <div>
                      <img className="cursor" src={self.state.seriesSelect == '0' ? '/images/designer/redioTwo.jpg' : '/images/designer/redioOne.jpg'} onClick={() => self.clickSeries('0', self)} />
                      选择系列
                      {self.state.seriesSelect == '0' ?
                        (getFieldDecorator('seriesId', {
                          initialValue: this.state.seriesId,
                        })(
                          <Select placeholder="请输入系列" className={styles.seriesSelect} showSearch onChange={event => self.changeSeries(event, self)} size="large">
                            {this.state.seriesList.map(data => (
                              <Option value={data.id}>{data.seriecsName}</Option>
                            ))}
                          </Select>,
                        ))
                        : ''
                      }
                    </div>
                  </div>
                  <div className={styles.hr} style={{ marginBottom: 73 }} />

                  <FormItem {...formItemLayout} label="产品类别" style={{ marginBottom: 25 }}>
                    {getFieldDecorator('categoryId', {
                      initialValue: self.state.proViewDetail.categoryId,
                      rules: [
                        {
                          required: true,
                          message: '请选择产品类别',
                        },
                      ],
                    })(
                      <Select placeholder="请选择产品类别" style={{ width: 211 }} showSearch disabled>
                        {this.state.modifyCategoryList.map(data => (
                          <Option value={data.id}>{data.commonName}</Option>
                         ))}
                      </Select>,
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="适合人群" style={{ marginBottom: 32 }}>
                    {getFieldDecorator('crowdId', {
                      initialValue: self.state.proViewDetail.crowdId,
                      rules: [
                        {
                          required: true,
                          message: '请选择适合人群',
                        },
                      ],
                    })(
                      <Select showSearch placeholder="请选择适合人群" style={{ width: 211 }}>
                        {self.state.crowdList.map((data, ind) => (
                          <Option value={data.id}>{data.commonName}</Option>
                    ))}
                      </Select>,
                    )}
                  </FormItem>

                  <FormItem {...formItemLayout} label="款式名称" style={{ marginBottom: 29 }}>
                    {getFieldDecorator('productName', {
                      initialValue: self.state.proViewDetail.productName,
                      rules: [
                        {
                          required: true,
                          message: '请输入款式名称',
                        },
                      ],
                    })(<Input style={{ width: 616 }} placeholder="请输入款式名称" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="宝石描述">
                    {getFieldDecorator('productDescription', {
                      initialValue: self.state.proViewDetail.productDescription,
                    })(<TextArea style={{ width: 616, height: 173, marginBottom: 32 }} placeholder="宝石描述" />)}
                  </FormItem>

                  {self.state.proViewDetail.designs ?
                      self.state.proViewDetail.designs.map((ielem, indOne) =>
                        <FormItem {...formItemTwo} label={ielem.designName}>
                          { ielem.sizeList.length != 0 ?
                             ielem.sizeList.map((data, ind) => (
                               <Col span={2} style={{ marginRight: 20, textAlign: 'center' }}>
                                 {getFieldDecorator(`size_${indOne}_${ind}`, {
                                   initialValue: data,
                                 })(<Input placeholder="" />)}
                                 <span className={styles.imgDelTwo} onClick={() => self.delSize(ielem, ind)}>
                                  —
                                </span>
                               </Col>
                            )) : ''}
                          <span className={styles.txtRed} onClick={() => self.addProSize(indOne)}>添加尺寸+</span>
                        </FormItem>,
                      )
                      : ''
                    }


                  <div className={styles.hr} />
                  <div>
                    <div className={styles.tableBox}>
                      <Row className={styles.margin10} justify="space-between">
                        <Col className="dot" span={8} className={styles.mainTxt}>
                          产品材质/重量/价格
                        </Col>
                        <Col span={12} offset={4} className={`${styles.textRight} ${styles.flexAlign}`} style={{ display: 'none' }}>
                          <Col span={4} className={styles.textRight}>
                            宝石价格：
                          </Col>
                          <Col span={6} className={styles.textRight} style={{ marginRight: 14 }}>
                            {getFieldDecorator('stonePrice', {
                              initialValue: self.state.productStr.stonePrice,
                            })(
                              <InputNumber
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                className={styles.input140}
                                min={0}
                              />,
                              )}
                          </Col>
                          <Col span={4} className={styles.textRight}>
                            生产工费:
                          </Col>
                          <Col span={6} className={styles.textRight} style={{}}>
                            {getFieldDecorator('wagePrice', {
                              initialValue: self.state.productStr.wagePrice,
                            })(
                              <InputNumber
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                className={styles.input140}
                                min={0}
                              />,
                          )}
                          </Col>
                        </Col>
                      </Row>
                      <div className={styles.tabOne}>
                        <Table dataSource={self.state.proViewDetail.textures} {...tableState}>
                          <Column
                            title="材质"
                            dataIndex="key"
                            key="key"
                            align="center"
                            render={(text, record, ind) => (
                              <div className={styles.txtCenter}>
                                {getFieldDecorator(`materId_${ind}`, {
                                  initialValue: self.state.proViewDetail.textures[`${ind}`].textureId != '' ? self.state.proViewDetail.textures[`${ind}`].textureId : '',
                                })(
                                  <Select defaultValue="请输入材质" style={{ width: 120 }}>
                                    {self.state.materList.map(data => (
                                      <Option value={data.id}>{data.textureName}</Option>
                                  ))}
                                  </Select>,
                                )}
                              </div>
                            )}
                          />
                          <Column
                            title="预计克重/g"
                            dataIndex="value"
                            key="value"
                            align="center"
                            render={(text, record, ind) => (
                              <div className={styles.txtCenter}>
                                {getFieldDecorator(`proMinWeight_${ind}`, {
                                  initialValue: self.state.proViewDetail.textures[`${ind}`].textureWeight.split('-')[0],
                                })(<InputNumber min={0} className={styles.width60} />)}
                                ~
                                {getFieldDecorator(`proMaxWeight_${ind}`, {
                                  initialValue: self.state.proViewDetail.textures[`${ind}`].textureWeight.split('-')[1],
                                })(<InputNumber min={0} className={styles.width60} />)}
                              </div>
                            )}
                          />
                          <Column
                            title="预估成本价/g"
                            dataIndex="referencePrice"
                            key="referencePrice"
                            align="center"
                            render={(text, record, ind) => (
                              <div className={styles.txtCenter}>
                                {getFieldDecorator(`referencePrice_${ind}`, {
                                  initialValue: self.state.proViewDetail.textures[`${ind}`].referencePrice ? self.state.proViewDetail.textures[`${ind}`].referencePrice : 0,
                                })(<InputNumber min={0} className={styles.width60} />)}
                              </div>
                            )}
                          />
                          <Column
                            title="建议售价/￥"
                            key="priceOne"
                            align="center"
                            render={(text, record, ind) => (
                              <div className={styles.txtCenter}>
                                {getFieldDecorator(`proSalePrice_${ind}`, {
                                  initialValue: self.state.proViewDetail.textures[`${ind}`].texturePrice,
                                })(<Input className={styles.width60} style={{ width: 98, textAlign: 'center' }} />)}
                              </div>
                            )}
                          />
                          <Column
                            title=""
                            key="delSku"
                            align="center"
                            render={(text, record, ind) => (
                              <span className={styles.delSkuTxt} onClick={() => self.delSkuFun(ind)}>
                                  X
                              </span>
                            )}
                          />
                        </Table>
                        <div className="mt10" style={{ marginTop: 20, fontSize: 12 }}>
                          <span type="primary" onClick={() => self.addProMater(self)} style={{ color: 'red', marginBottom: 50 }}>
                            增加材质+
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.hr} style={{ margin: '30px 0 40px 0' }} />
                  <div className={`${styles.mainTxt} dot`}>上传平面图</div>
                  <div style={{ paddingLeft: 70 }}>
                    <Row>
                      <Col span={8}>
                        <Col span={8}>
                          <div className={styles.imgUpload} onClick={() => self.imgUpload(self)}>
                            <img src="./images/img-upload.png" />
                          </div>
                          <input type="file" ref="imgInput" src="./images/img-normal2.png" onChange={() => self.imgInputFun(self)} className={styles.displayHide} />
                        </Col>
                        <Col span={10}>
                          <div className="c9 f12" style={{ marginLeft: 12, width: 135 }}>请您上传单张或多张格式为png、jpg的图片，图片像素为534X534像素</div>
                        </Col>
                      </Col>
                      <Col span={16}>
                        {this.state.imgDisplayList.map((ielem, ind) => {
                          return (
                            <Col span={4} key={ielem.imageId}>
                              <div className={styles.textRight}>
                                <img src={app.$http.imgURL + ielem.imageUrl} className={styles.imgSmall} />
                                <span className={styles.imgDel} onClick={() => self.delImg(ielem.id, ind)}>
                                  —
                                </span>
                              </div>
                            </Col>
                          );
                        })}
                      </Col>
                    </Row>
                  </div>
                  <div className={styles.hr} style={{ margin: '30px 0 40px 0' }} />
                  <div className={`${styles.mainTxt}`}>上传3D图包（可选）</div>
                  <div >
                    <div style={{ paddingLeft: 70 }}>
                      <Row>
                        <Col span={8}>
                          <Col span={8}>
                            <div className={styles.imgUpload} onClick={() => self.rarUpload(self)}>
                              <img src="./images/img-upload3D.png" />
                            </div>
                            <input type="file" ref="rarInput" onChange={() => self.rarInputFun(self)} className={styles.displayHide} />
                          </Col>
                          <Col span={10}>
                            <div className="c9 f12" style={{ marginLeft: 12, width: 135 }}>请您上传格式为rar、zip的图包，文件大小为10M以内。</div>
                          </Col>
                        </Col>
                        <Col span={16}>
                          <Col span={4}>
                            <div className={styles.textRight}>
                              {this.state.jpgThreeDId && (
                                <div>
                                  {/* <img src="./images/zipIcon.png" className={styles.imgSmallTwo} /> */}
                                  <img src={app.$http.imgURL + this.state.jpgThreeDUrl} className={styles.imgSmallTwo} />
                                  <span className={styles.imgDel} onClick={this.delRar.bind(this)}>
                                    —
                                  </span>
                                </div>
                                )}
                            </div>
                          </Col>
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Row>
                        <Col span={24}>
                          <div className={styles.hr} style={{ margin: '30px 0 40px 0' }} />
                          <div className={styles.contant}>
                            <div>
                              <div className={`${styles.mainTxt}`}>上传图文详情</div>
                              <div style={{ paddingLeft: 70 }}>
                                <Editor
                                  ref="editor"
                                  icons={app.$tool.icons}
                                  value={self.state.proViewDetail.details}
                                  onChange={event => self.handleChange(event)}
                                  style={{ width: 750, minHeight: 500 }}
                                  plugins={this.state.plugins}
                                />
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Form>
              </div>
            </Modal>

            )}{/* 分页 */}
            <div className={styles.pagWrap}>
              <Pagination
                showSizeChanger
                onShowSizeChange={this.onShowSizeChange}
                current={pageIndex}
                total={totalNum}
                onChange={this.onChangPage}
                pageSize={pageSize}
                pageSizeOptions={['12', '24', '48']}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

proManage.propTypes = {};

proManage.contextTypes = {
  router: PropTypes.object.isRequired,
};
const proManageFrom = Form.create()(proManage);
export default proManageFrom;
