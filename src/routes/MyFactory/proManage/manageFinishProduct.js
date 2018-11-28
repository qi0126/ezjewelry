import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { router } from 'react-router';
import PropTypes from 'prop-types';
import Editor from 'react-umeditor';
import styles from './manageFinishProduct.less';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select, Checkbox, message, Form, InputNumber, Popconfirm, Pagination, Icon, Spin } from 'antd';

import Swiper from 'react-id-swiper';

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const { Column, ColumnGroup } = Table; // 表格属性

const tableState = {
  bordered: false,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
};

const proListData = [{}];
let proSelectEdList = [];

class manageFinishProduct extends React.Component {
  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      cancelLoading: false, // 取消加载状态
      confirmLoading: false, // 确定加载状态
      categoryList: [], // 产品分类接口数据
      modifyCategoryList: [], // 产品修改分类接口数据
      categoryValue: '', // 产品分类选中信息
      crowdList: [], // 适合人群接口数据
      crowdValue: '', // 适合人群选中信息
      proDataList: [], // 产品接口数据
      proViewModalTF: false, // 产品详细弹窗
      proModifyModalTF: false, // 修改产品弹窗
      proViewId: '', // 弹窗显示产品详细的ID
      proViewDetail: {}, // 弹窗显示产品详细的资料
      proImgBigUrl: '', // 弹窗显示产品详细第一张产品图片
      proImgList: [], // 弹窗显示产品详细所有产品图片
      threeDTF: false, // 是否有3D图包
      // proSelectEdList: [], // 产品选择数组
      checkAll: false, // 产品全选/反选
      // 修改框架
      proSizeList: [{ value: '' }], // 产品款式尺寸
      imgDisplayList: [], // 图片示意图
      materList: [], // 材质列表
      details: '', // 富文本默认内容
      categoryId: '', // 类别ID，默认为空全部
      productStatus: '', // 上下加筛选情态
      auditStatus: '', // 审核中状态 auditStatus;1//审核状态 0 不需要审核 1 审核中 2 已审核 3 审核通过 4 驳回
      pageIndex: 1, // 当前页
      pageSize: 12, // 每页展示条数
      totalNum: 0, // 总条数
      productStr: { // 修改产品对象
        figureFrom: {
          figureImageId: '', // 3D图包包的ID
        },
      },
      pictureIndex: 0, // 图片下标
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      jpgThreeDUrl: '', // 3D图包路径
      jpgThreeDId: '', // 3D图包id
      // ThreeDtype:false,//显示第一张3D图片状态
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
      proLoading: true, // 产品加载中属性
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
    };
    // 定义全局变量方法

  }

  componentDidMount() {

    this.getlist(1, 12);

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

  componentWillMount() {
    // console.log('生命周期1');
  }
  componentWillUnmount() {
    // console.log('生命周期2');
  }

  // 获取供应商产品查询列表信息
  getlist = (pageIndex, pageSize) => {
    this.setState({
      proLoading: true,
    });
    // 查询产品数据信息
    const params = {
      categoryId: this.state.categoryId,
      productStatus: this.state.productStatus,
      auditStatus: this.state.auditStatus,
      page: pageIndex,
      rows: pageSize,
    };
    app.$api.selectFactoryProductInfo(params).then((res) => {
      // console.log('数据');
      // console.log(res);
      let tempList;
      if (res.data.data) {
        tempList = res.data.data;
        tempList.forEach((item) => {
          item.checked = false;
        });
      } else {
        tempList = [];
      }
      // console.log('产品数据');
      // console.log(tempList);
      this.setState({
        proDataList: tempList,
        totalNum: res.data.rowSize,
        proLoading: false,
      });
    });
  }

  // 选择产品多选框
  // proSelectChange(checkedValues) {
  //   proSelectEdList = checkedValues;
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
    // 富文本图标功能
    const icons = self.getIcons();
    // 富文本图片上传功能
    const params = { productId: elem };
    // this.state.proImgList = [];
    this.state.ModelAmount = '';
    app.$api.findProductByProductId(params).then((res) => {
      const tempList = [];
      const tempObj = res.data;
      if (tempObj.designs && tempObj.designs[0].designValue != undefined) {
        tempObj.designs.forEach((ielem, indOne) => {
          ielem.sizeList = ielem.designValue.split(',');
        });
      } else {
        if(tempObj.designs){
          tempObj.designs.forEach((ielem, indOne) => {
            ielem.sizeList = [''];
          });
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


      this.setState(
        () => ({
          proViewDetail: tempObj,
          proImgBigUrl: res.data.images[0].imageUrl,
          proImgList: res.data.images,
        }),
        () => {
          self.setState({
            proViewModalTF: true,
            proViewId: elem,
          });
          // console.log(self.state.proViewDetail);
          if (this.state.proViewDetail.details) {
            setTimeout(() => {
              self.refs.imgTxtBackup.innerHTML = self.state.proViewDetail.details;
            }, 200);
          }
        });


      // console.log('图片数量');
      // console.log(this.state.proImgList);
      // console.log(this.state.proImgList.length);
      this.setState({
        proViewModalTF: true,
        proViewId: elem,
        threeDImgDisplayTf: false,
        tempOneDis: true,
      });


    });
  }
  clearDataFun = () => {
    // console.log('关闭弹框');
    this.setState({
      proImgList: [],
      ModelAmount: '',
    });
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
      // console.log('上传返回图片数据');
      // console.log(imgList);
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

  // 平面产品图片上传
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
    app.$api.uploadFile(params).then((res) => {
      this.setState(() => ({
        jpgThreeDId: res.data.imageId,
        jpgThreeDUrl: res.data.imageUrl,
      }), () => {
        thiselem.refs.rarInput.value = '';
      });
    });
  }


  // 平面产品图片删除
  delImg(proId, ind) {
    const self = this;
    if (self.state.imgDisplayList.length <= 1) {
      message.error('产品不能没有图片，此图片不能被删除！');

      return false;
    }
    self.state.imgDisplayList.splice(ind, 1);
    self.setState({
      imgDisplayList: self.state.imgDisplayList,
    });
  }

  // 平面产品图片删除
  delRar() {
    this.setState({
      jpgThreeDId: false,
      jpgThreeDUrl: false,
      // figureFrom: {
      //   figureImageId: '', // 3D图包包的ID
      // },
    });
  }

  // 打开‘发布上架’按钮
  addGround(thiselem) {

    if (proSelectEdList.length != 0) {

      let upData = [];
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

      let noData = [];
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
        // thiselem.componentDidMount();
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
          },
        );
      }).catch(() => {
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

      let downData = [];
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
        // thiselem.componentDidMount();
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
          // thiselem.componentDidMount();
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
  handleCancel(self) {
    self.setState(() => ({
      proViewModalTF: false,
      proModifyModalTF: false,
    }), () => {
      self.getlist(self.state.pageIndex, self.state.pageSize);
    });

  }
  // 弹出修改产品弹框
  modifyPro = () => {
    // console.log(this.state.proViewDetail)
    // 先将产品下架
    // console.log('开始编辑');
    const params = { productId: this.state.proViewDetail.id, productStatus: 2 };
    app.$api.updataProductStatus(params).then((res) => {
      message.success('此产品下架成功，正在路转修改产品页！');
      // console.log(this.state.proViewDetail);
      // console.log(this.state.proViewDetail.designs);
      // console.log(!!this.state.proViewDetail.designs);
      if (this.state.proViewDetail.designs && this.state.proViewDetail.designs[0].designValue != undefined) {
        var tempDesignValue = this.state.proViewDetail.designs[0].designValue.split(',');
      } else {
        var tempDesignValue = '';
      }
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
      if (this.state.proViewDetail.figureFrom != undefined) {
        this.setState({
          jpgThreeDId: this.state.proViewDetail.figureFrom.figureImageId,
          jpgThreeDUrl: this.state.proViewDetail.figureFrom.figuerThurl,
        });
      }
      // console.log('编辑数据1');
      // console.log(this.state.proViewDetail);
    });
  }
  // 弹出修改产品弹框
  modifyProTwo = () => {
    // console.log(this.state.proViewDetail)
    // 先将产品下架
    // const params = { productId: this.state.proViewDetail.id, productStatus: 2 };
    // app.$api.updataProductStatus(params).then((res) => {
    //   message.success('此产品下架成功，正在路转修改产品页！');
    // console.log(this.state.proViewDetail);
    const tempProSizeList = [];
    if (this.state.proViewDetail.designs != undefined && this.state.proViewDetail.designs[0].designValue != undefined) {
      const tempDesignValue = this.state.proViewDetail.designs[0].designValue.split(',');
      for (let i = 0; i < tempDesignValue.length; i++) {
        tempProSizeList.push({ value: tempDesignValue[i] });
      }
    }

    this.setState({
      proViewModalTF: false,
      proModifyModalTF: true,
      proSizeList: tempProSizeList,
    });

    this.state.imgDisplayList = this.state.proViewDetail.images;
    // console.log('数据123');
    // console.log(this.state.proViewDetail.figureFrom);

    if (this.state.proViewDetail.figureFrom != undefined) {
      this.setState({
        jpgThreeDId: this.state.proViewDetail.figureFrom.figureImageId,
        jpgThreeDUrl: this.state.proViewDetail.figureFrom.figuerThurl,
      });
    }

    // console.log('编辑数据2');
    // console.log(this.state.proViewDetail);
    // this.setState(() => ({
    //   jpgThreeDId: res.data.imageId,
    //   jpgThreeDUrl: res.data.imageUrl,
    // }), () => {
    //   thiselem.refs.rarInput.value = '';
    // });
    // ThreeDtype
    // });
  }
  // 修改产品数据调接口

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
      console.log(self.setState.proViewDetail);
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

  // 修改产品确认接口
  modifyProSubmit = () => {
    const self = this;
    // console.log(this.state);
    // console.log(this.state.proViewDetail);


    // e.preventDefault();
    self.props.form.validateFields((err, values) => {
      let emptyTF = true; // 必填提示框判断
      if (!err) {
        // console.log(values);
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
            // console.log(values[`proMinWeight_${indexNum}`]);
            const proMinWeight = values[`proMinWeight_${indexNum}`];
            const proMaxWeight = values[`proMaxWeight_${indexNum}`];
            const proSalePrice = values[`proSalePrice_${indexNum}`];
            const proMaxPrice = values[`proMaxPrice_${indexNum}`];
            const materId = values[`materId_${indexNum}`];
            proMaterListTwo.push({ productId: self.state.proViewDetail.id, textureId: materId, textureName: '', textureWeight: `${proMinWeight}-${proMaxWeight}`, texturePrice: `${proSalePrice}-${proMaxPrice}` });
          }
        }


        //校验产品材质/重量/价格是否填写
        for (const i in values) {
          // 产品材质/重量/价格遍历
          if (i.indexOf('proMaxWeight_') >= 0) {
            const indexNum = i.split('_')[1];
            // 材质
            if (!values[`materId_${indexNum}`]) {
              emptyTF = false;
            }
            // 克重最小范围值
            if (!values[`proMinWeight_${indexNum}`] || values[`proMinWeight_${indexNum}`] == 0) {
              emptyTF = false;
            }
            // 克重最大范围值
            if (!values[`proMaxWeight_${indexNum}`] || values[`proMaxWeight_${indexNum}`] == 0) {
              emptyTF = false;
            }
            //批发价开始值
            if (!values[`proSalePrice_${indexNum}`] || values[`proSalePrice_${indexNum}`] == 0) {
              emptyTF = false;
            }
            //批发价开始值
            if (!values[`proMaxPrice_${indexNum}`] || values[`proMaxPrice_${indexNum}`] == 0) {
              emptyTF = false;
            }
          }
        }


        if (!emptyTF) {
          message.error('请先完善上传信息才能提交！');
          return;
        }



        self.state.productStr.id = self.state.proViewDetail.id; // 修改ID
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


        if (self.state.proViewDetail.designs[0].sizeList) {
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

        const proImgList = [];
        self.state.imgDisplayList.forEach((item) => {
          proImgList.push({ imageId: item.id });
        });
        self.state.productStr.imageIdFroms = proImgList; // 修改图片ID
        self.state.productStr.textures = proMaterListTwo; // 产品材质/重量/价格遍历數組
        if (self.state.jpgThreeDUrl != '') {
          self.state.productStr.figureFrom = { figureImageId: self.state.jpgThreeDId }; // 3D图包ID
        } else {
          self.state.productStr.figureFrom = { figureImageId: '' };
        }
        // 图文详性富文本编辑
        if (self.state.proViewDetail.details && self.state.proViewDetail.details != '') {
          self.state.productStr.details = self.state.proViewDetail.details;
        } else {
          self.state.proViewDetail.details = '';
        }

        const params = app.$v.deleteEmptykey(self.state.productStr);

        app.$api.updateFactoryProduct(params).then((res) => {
          this.setState({
            proModifyModalTF: false,
            proViewModalTF: false,
          });
          this.getlist(this.state.pageIndex, this.state.pageSize);
          message.success('产品修改成功！');
        });
      }
    });
  }

  // 图文详情字符串转义成htmlDOM
  unTxtToDomOne() {
    // console.log('aaaa');
    // console.log(this.state);
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

  // 改变类别事件
  changeCate(e, thiselem) {
    // console.log('选择');
    // console.log(e);
    // console.log(thiselem);
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
    // console.log('状态');
    // console.log(e);
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
    thiselem.setState(
      () => ({
        pageIndex: 1,
        pageSize: 12,
      }),
      () => {
        this.getlist(1, 12);
      },
    );
    // const params = { categoryId: thiselem.state.categoryId, productStatus: thiselem.state.productStatus, auditStatus: thiselem.state.auditStatus };
    // 查询产品数据信息
    // app.$api.selectFactoryProductInfo(params).then((res) => {
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

  // 分页
  onShowSizeChange = (current, pageSize) => {
    // console.log(current);
    // console.log(pageSize);
    this.setState({
      pageSize,
      checkAll: false,
    });
    this.getlist(1, pageSize);
    proSelectEdList = [];
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

  swiperFun = () => {
    console.log('轮播事件');
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
                <Option value="0">待完善</Option>
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
              <Checkbox onChange={this.onCheckAllChange} checked={this.state.checkAll}>
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
                              <span className={styles.imgTopTxt} onClick={() => self.showModal(ielem.productId)}>
                                {ielem.productStatus == 0 ? '暂存' : ''}
                                {ielem.productStatus == 1 ? '已上架' : ''}
                                {/* {ielem.productStatus == 2 ? '下架' : ''} */}
                                {ielem.productStatus == 3 ? '审核中' : ''}
                                {ielem.productStatus == 4 ? '审核不通过' : ''}
                              </span>
                              {ielem.productStatus == 2 ? <div className={styles.underFrame} onClick={() => self.showModal(ielem.productId)} >已下架</div> : ''}
                              <div className={styles.imgTop} >
                                {/* {ielem.checked == true ? 'true' : 'false'} */}
                                {/* {ielem.productStatus != 3 ? */}
                                <Checkbox value={ielem.productId} checked={ielem.checked} onChange={this.singleElection} />
                                {/* : '' */}
                                {/* } */}
                              </div>
                              <img src={app.$http.imgURL + ielem.productImageUrl} onClick={() => self.showModal(ielem.productId)} />
                            </div>
                            <div className={styles.proDisplay} onClick={() => self.showModal(ielem.productId)}>
                              <p className={styles.proName}>{ielem.productName}</p>
                              <p className={styles.proPrice}>
                              批发价：￥
                              {ielem.combinationPrice}
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
              onCancel={() => self.handleCancel(self)}
              afterClose={this.clearDataFun}
              width="1100"
              footer={[
                <div className={styles.modalFooter}>
                  {this.state.proViewDetail.productStatus == 1 ? (
                    <Button className="bottonPublic" type="primary" onClick={() => self.editUnderState(self)} style={{ marginRight: 15 }}>
                      取消上架
                    </Button>
                  ) : (
                    ''
                  )}
                  {this.state.proViewDetail.productStatus == 2 ? (
                    <Button className="bottonPublic" type="primary" onClick={() => self.editAddState(self)} style={{ marginRight: 15 }}>
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
                    <Col span={12} className="proTit">产品信息</Col>
                    <Col span={12} className={styles.textRight}>
                      {this.state.proViewDetail.productStatus == 1 ? (
                        <Popconfirm title="需要先取消上架才能修改信息,是否取消上架？" onConfirm={() => this.modifyPro(self)} okText="确定" cancelText="否">
                          <span className={styles.spanTitModi} type="primary">修改产品信息</span>
                        </Popconfirm>
                    ) : (
                      <span className={styles.spanTitModi} onClick={() => this.modifyProTwo(self)}>
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

                  <Col span={12} />
                  <Col span={12} style={{ padding: 15, paddingLeft: 50 }}>
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
                          商品编号：
                          {this.state.proViewDetail.productCode}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>

                      <div className={styles.tabTwo}>
                        <Row>
                          {this.state.proViewDetail.designSource == 1 ?
                            <span>
                              <Col span={24} className={styles.leftTxt}>供应商名称：<span className={styles.rightTxt}>{this.state.proViewDetail.companyName}</span></Col>
                            </span>
                            : ''
                          }
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
                          </Col>

                          {this.state.proViewDetail.designs ?
                            (this.state.proViewDetail.designs.map((idata, ind) =>
                              <span>
                                <Col span={2} className={styles.leftTxt}>
                                  {idata.designName}:
                                </Col>
                                <Col span={22} className={styles.rightTxt}>
                                  <span className={styles.rightNumSpan}>
                                    {idata.sizeList != undefined ? idata.sizeList.map((data, index) => (
                                      <span className={styles.rightNumSpan} key={index}>
                                        {data}
                                      </span>
                                    )) : ''}
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
                            title="材质" dataIndex="textureName" key="textureName"
                          />
                          <Column title="重量/g" dataIndex="textureWeight" key="textureWeight" />
                          <Column title="批发价/￥" dataIndex="texturePrice" key="texturePrice" />
                        </Table>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.contant}>
                      {(this.state.proViewDetail.details && this.state.proViewDetail.details != '') ? (
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
            <Form>
              <Modal
                visible={this.state.proModifyModalTF}
                onCancel={() => self.handleCancel(self)}
                afterClose={this.clearDataFun}
                width="1100"
                footer={[
                  <div className={styles.modalFooter}>
                    <span className={`${styles.txtRed} right20`} onClick={this.modifyCancel}>
                      取消
                    </span>
                    <Button className="bottonPublic" type="primary" style={{ marginRight: 214, marginLeft: 60 }} onClick={this.modifyProSubmit}>
                      确定修改
                    </Button>
                  </div>,
                ]}
              >
                <div style={{ padding: 50 }}>
                  <div className={styles.titTopTwo} onClick={this.modifyCancel}><Icon type="left" />返回</div>
                  <div className={styles.modalDiv}>
                    <FormItem {...formItemLayout} label="产品类别" style={{ marginBottom: 16 }}>
                      {getFieldDecorator('categoryId', {
                        initialValue: self.state.proViewDetail.categoryId,
                        rules: [
                          {
                            required: true,
                            message: '请选择产品类别',
                          },
                        ],
                      })(
                        <Select placeholder="请输入产品类别" style={{ width: 211 }} showSearch disabled>
                          {this.state.modifyCategoryList.map(data => (
                            <Option value={data.id}>{data.commonName}</Option>
                        ))}
                        </Select>,
                    )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="适合人群" style={{ marginBottom: 16 }}>
                      {getFieldDecorator('crowdId', {
                        initialValue: self.state.proViewDetail.crowdId,
                        rules: [
                          {
                            required: true,
                            message: '请选择适合人群',
                          },
                        ],
                      })(
                        <Select showSearch placeholder="请输入适合人群" style={{ width: 211 }}>
                          {self.state.crowdList.map((data, ind) => (
                            <Option value={data.id}>{data.commonName}</Option>
                      ))}
                        </Select>,
                      )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="款式名称" style={{ marginBottom: 16 }}>
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
                      })(<TextArea style={{ width: 616, marginBottom: 16 }} placeholder="宝石描述" />)}
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
                          <Col className={`${styles.titTopThree} dot`} span={8} >
                            产品材质/重量/价格
                          </Col>

                          {/* <Col span={12} offset={4} className={`${styles.textRight} ${styles.flexAlign}`}>
                          <Col span={4} className={styles.textRight}>
                          宝石价格：
                        </Col>
                          <Col span={6} className={styles.textRight} style={{ marginRight: 14 }}>
                            {getFieldDecorator('stonePrice', {
                              initialValue: self.state.proViewDetail.stonePrice,
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
                              initialValue: self.state.proViewDetail.wagePrice,
                            })(
                              <InputNumber
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                className={styles.input140}
                                min={0}
                            />,
                          )}
                          </Col>
                        </Col> */}
                        </Row>
                        <div className={styles.tabThree}>
                          <Table dataSource={self.state.proViewDetail.textures} {...tableState}>
                            <Column
                              title={
                                <span className="dot">
                                  材质
                                </span>
                              }
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
                              title={
                                <span className="dot">
                                  克重/g
                                </span>
                              }
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
                              title={
                                <span className="dot">
                                  批发价/￥
                                </span>
                              }
                              key="priceOne"
                              align="center"
                              render={(text, record, ind) => (
                                <div className={styles.txtCenter}>
                                  {getFieldDecorator(`proSalePrice_${ind}`, {
                                    initialValue: self.state.proViewDetail.textures[`${ind}`].texturePrice.split('-')[0],
                                  })(<InputNumber min={0} className={styles.width60} />)}
                              ~
                              {getFieldDecorator(`proMaxPrice_${ind}`, {
                                initialValue: self.state.proViewDetail.textures[`${ind}`].texturePrice.split('-')[1],
                              })(<InputNumber min={0} className={styles.width60} />)}

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
                          <div className="mt10">
                            <span className="addTxtRed" onClick={() => self.addProMater(self)} style={{ marginBottom: 50 }}>
                              增加材质+
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.hr} style={{ margin: '30px 0 40px 0' }} />
                    <div className={`${styles.titTopThree} dot`}>上传平面图</div>
                    <div>
                      <Row>
                        <Col span={8}>
                          <Col span={8}>
                            <div className={styles.imgUpload} onClick={() => self.imgUpload(self)}>
                              <img src="./images/img-upload.png" />
                            </div>
                            <input type="file" ref="imgInput" src="./images/img-normal2.png" onChange={() => self.imgInputFun(self)} className={styles.displayHide} />
                          </Col>
                          <Col span={10}>
                            <div className="c9 f12 l12">请您上传单张或多张格式为png、jpg的图片，图片像素为534X534像素</div>
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
                    <div className="mb20" className={styles.titTopThree}>上传3D图包（可选）</div>
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
                            <div className="c9 f12 l12">请您上传格式为rar、zip的图包，文件大小为10M以内。</div>
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

                        <Col span={24}>
                          <div className={styles.hr} style={{ margin: '30px 0 40px 0' }} />
                          <div className={styles.contant}>
                            <div>
                              <div style={{ margin: '20px 10px' }} className={styles.titTopThree}>上传图文详情</div>
                              <Editor
                                ref="editor"
                                icons={app.$tool.icons}
                                value={self.state.proViewDetail.details}
                                onChange={event => self.handleChange(event)}
                                style={{ width: 750, minHeight: 500 }}
                                plugins={this.state.plugins}
                                />,
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Modal>
            </Form>

            )}

            {/* 分页 */}
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

manageFinishProduct.propTypes = {};

manageFinishProduct.contextTypes = {
  router: PropTypes.object.isRequired,
};
const proManageFrom = Form.create()(manageFinishProduct);
export default proManageFrom;

