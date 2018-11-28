import React from 'react';
import { connect } from 'dva';
import Swiper from 'react-id-swiper';
import PropTypes from 'prop-types';
import styles from './DesignerPro.less';
import { Radio, Slider, Button, Row, Col, Modal, Input, Pagination, Table, Form, InputNumber, Select, Checkbox, message, Tag,Spin } from 'antd';
import app from 'app';
import $$ from 'jquery';


const FormItem = Form.Item;
const { Column, ColumnGroup } = Table; // 表格属性
const { TextArea } = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { CheckableTag } = Tag;

const tableState = {
  bordered: true,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
};


const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 },
};
const formItemTwo = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 },
};
const proListData = [{}];
let proSelectEdList = [];

// 分页第几页，每页显示多少条记录
// function onShowSizeChange(current, pageSize) {
//   console.log(current, pageSize);
// }
// 分页第几页
// function onChange(pageNumber) {
//   console.log('Page: ', pageNumber);
// }


class DesignerPro extends React.Component {
  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      addShopLoading: false, // 添加到店铺加载状态
      startPrice: 0,
      endPrice: 3001,
      categoryId: '',
      designerId: '',
      seriecsId: '',
      seriesList: [], // 系列数据
      designDetailData: {}, // 设计师详细数据
      desALLCityData: [], // 全部国家设计师列表
      desSelectIDList: [], // 全部国家选择设计师ID
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
      searchDesName: '', // 设计师搜索框字段
      checkAll: false, // 产品全选/反选
      // indeterminate: true, // 产品全选/反选
      addGroundModalTF: false, // 发布上架弹窗
      cancelGroundModalTF: false, // 取消上架弹窗
      // 修改框架
      proSizeList: [{ value: '' }], // 产品款式尺寸
      imgDisplayList: [], // 图片示意图
      materList: [], // 材质列表
      designCityList: [], // 设计师国家
      designSelectList: [], // 设计师国家代表设计师列表
      desSelectList: [], //
      viewDesignTF: false, // 查看设计师资料
      marks: {// 滑块数据
        0: '0°C',
        200: {
          style: {
            color: '#f50',
          },
          label: <strong>10万以上</strong>,
        },
      },
      amount: 4, // 轮播数量
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      pageIndex: 1, // 当前页
      pageSize: 12, // 每页展示条数
      totalNum: 0, // 总条数
      seriesType: false, // 系列显示状态
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
      proLoading: true, // 产品加载中属性
    };
    // 定义全局变量方法
  }

  showModal(elem) {
    const self = this;
    const params = { productId: elem };
    app.$api.findProductByProductId(params).then((res) => {
      const tempList = [];
      // console.log('设计师尺寸');
      // console.log(res.data);
      const tempObj = res.data;
      if (tempObj.designs && tempObj.designs[0].designValue != undefined) {
        tempObj.designs.forEach((ielem, indOne) => {
          ielem.sizeList = ielem.designValue.split(',');
        });
      }

      self.setState({
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

      // ModelAmount
      self.setState({
        proViewModalTF: true,
        proViewId: elem,
        threeDImgDisplayTf: false,
        tempOneDis: true,
      });
    });

  }

  handleOk(thiselem) {
    thiselem.setState({
      proViewModalTF: false,
    });
  }
  // 改变分类事釿
  onChange(e) {
  }
  // 改变页码
  onChangePage(e) {
  }
  handleCancel(self) {
    self.setState({
      proViewModalTF: false,
      addGroundModalTF: false,
      cancelGroundModalTF: false,
    });
  }
  componentDidMount() {
    // 查询设计师产品数据信息
    // const params = { designSource: 2 };
    // app.$api.selectBrandPrudoctNumber(params).then((res) => {
    //   if (res.data) {
    //     this.setState({
    //       proDataList: res.data,
    //     });
    //   } else {
    //     this.setState({
    //       proDataList: [],
    //     });
    //   }
    // });
    this.getlist(1, 12);
    this.sliderInit();
    // 设计师国家列表
    app.$api.countryList().then((res) => {
      if (res.data) {
        this.setState({
          designCityList: res.data,
        });
      } else {
        this.setState({
          designCityList: [],
        });
      }
    });
    // 全部设计师国家列表
    app.$api.getByCode().then((res) => {
      if (res.data) {
        this.setState({
          designSelectList: res.data,
        });
      } else {
        this.setState({
          designSelectList: [],
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

  }

    // slider初始化
  sliderInit = () => {
    $$('#Second .numberTipFirst').remove();
    $$('#Second .numberTipSecond').remove();
    $$('#Second').find('.ant-slider-handle-1').append('<div class=\'numberTipFirst\'>0</div>');
    $$('#Second').find('.ant-slider-handle-2').append('<div class=\'numberTipSecond\'>3000以上</div>');
  }

  // 查询设计师产品数据信息
  getlist = (page, rows) => {
    this.setState({
      proLoading: true,
    });
    const params = {
      designSource: 2,
      categoryId: this.state.categoryId,
      designerId: this.state.designerId,
      seriecsId: this.state.seriecsId,
      startPrice: this.state.startPrice,
      endPrice: this.state.endPrice,
      page,
      rows,
    };
    app.$api.selectBrandPrudoctNumber(params).then((res) => {
      const data = res.data;
      if (data) {
        data.data.forEach((item) => {
          item.checked = false;
        });
        this.setState({
          proDataList: data.data,
          totalNum: data.rowSize,
          proLoading: false,
        });
      } else {
        this.setState({
          proDataList: [],
          proLoading: false,
        });
      }
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

  changeCate(e, thiselem) {
    // 查询供应商产品数据信息
    this.setState(() => ({
      pageIndex: 1,
      pageSize: 12,
      categoryId: e.target.value,
    }), () => {
      this.getlist(1, 12);
    });

  }

  // 款式系列
  getSeriesData = (id) => {
    const param = { designerId: id };
    app.$api.selectDesignerSeriecsById(param).then((res) => {
      if (res.data) {
        res.data.forEach((item) => {
          item.checked = false;
        });
        this.setState({
          seriesList: res.data,
        });
      } else {
        this.setState({
          seriesList: [],
        });
      }
    });
  }

  // 选择国家后设计师
  countryClick(elem) {
    // seriecsId
    // designerId
    const self = this;
    console.log('单个国家');
    console.log(elem);
    const params = {
      code: elem,
    };
    app.$api.getByCode(params).then((res) => {
      if (res.data.length != 0) {
        console.log('进来1');
        console.log('设计师个数');
        console.log(res.data);
        const designerId = [];
        res.data.forEach((item) => {
          designerId.push(item.id);
        });
        console.log(designerId);
        self.setState(() => ({
          designSelectList: [],
          designerId: designerId.join(','),
          pageIndex: 1,
          pageSize: 12,
          seriecsId: '',
          seriesType: true,
        }), () => {
          this.getlist(1, 12);
          this.setState({
            designSelectList: res.data,
          });
        });
      } else {
        console.log('进来2');
        self.setState(() => ({
          designSelectList: [],
          pageIndex: 1,
          pageSize: 12,
          proDataList: [],
          totalNum: 0,
          seriecsId: '',
          seriesType: true,
        }));
      }
      // console.log(self.state.designSelectList);
    });

    this.setState({
      seriesList: [],
    });
  }


  // 全部国家
  allCountryClick = (callback) => {
    const self = this;
    console.log('全部国家');
    const params = {
      code: '',
    };
    app.$api.getByCode(params).then((res) => {
      if (res.data) {
        // this.state.designSelectList = [];
        self.setState(() => ({
          designSelectList: [],
          desALLCityData: res.data,
          seriesType: false,
        }), () => {
          // self.judgeFun(res);
          console.log('进入测试');
          self.getlist(1, 12);
          self.setState({
            designSelectList: res.data,
          });
          console.log(typeof callback === 'function');
          if (typeof callback === 'function') {
            callback();
          }
        });
      } else {
        self.setState({
          designSelectList: [],
          desALLCityData: [],
          seriesType: false,
        });
      }
      // console.log(self.state.desALLCityData);
    });
  }

  judgeFun = (res) => {
    const self = this;
    console.log('长度');
    console.log(res.data.length);
    if (res.data.length >= 4) {
      console.log('进来1');
      self.setState({
        amount: 4,
      });
    } else {
      console.log('进来2');
      self.setState({
        amount: res.data.length,
      });
    }
  }

  // 店铺挑选产品
  proAddShop(thiselem) {
    console.log('开始');
    if (proSelectEdList.length != 0) {
      const params = { productId: proSelectEdList.join(','), brandType: 2 };
      this.setState({
        addShopLoading: true,
      });
      app.$api.choseProductToLibrary(params).then((res) => {
        thiselem.componentDidMount();
        message.success('产品添加店铺成功！');
        thiselem.setState(() => ({
          proViewModalTF: false,
          checkAll: false,
          addShopLoading: false,
        }), () => {
          this.getlist(this.state.page, this.state.pageSize);
          proSelectEdList = [];
        });
      });
    } else {
      message.warning('未选择产品，请重新选择！');
    }
  }
  // 产品详细添加到店铺
  thisproAddShop(thiselem) {
    if (thiselem.state.proViewId) {
      const params = { productId: thiselem.state.proViewId };
      app.$api.choseProductToLibrary(params).then((res) => {
        thiselem.componentDidMount();
        message.success('产品添加店铺成功！');
        thiselem.setState(() => ({
          proViewModalTF: false,
        }), () => {
          // this.context.router.push('/myShop/myShopFinishProduct');
          this.getlist(this.state.page, this.state.pageSize);
        });
      });
    } else {
      message.warning('未选择产品，请重新选择！');
    }
  }
  // 查看设计师资料
  viewDesign=(elem) => {
    console.log(elem);
    console.log(typeof elem.imgThree);
    console.log(app.$tool.country);

    app.$tool.country.forEach((item) => {
      if (item.cityEndName == elem.country) {
        elem.country = item.cityName;
      }
    });

    const state = typeof elem.imgThree;
    if (elem.imgThree != '' && elem.imgThree != undefined && state == 'string') {
      elem.imgThree = elem.imgThree.split(',');
    }
    this.setState(() => ({
      viewDesignTF: true,
      designDetailData: elem,
    }), () => {
      console.log(this.state.designDetailData.imgThree);
    });
  }
  // 取消查看设计师资料
  cancelViewDesign=() => {
    this.setState({
      viewDesignTF: false,
      designDetailData: {},
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

  onChangeSecond = (value) => {
    const diffValu = value[1] - value[0];
    $$('#Second .numberTipFirst').remove();
    $$('#Second .numberTipSecond').remove();
    $$('#Second .numberTipSecondTop').remove();
    if (diffValu == 100) {
      $$('#Second').find('.ant-slider-handle-1').append(`<div class='numberTipSecondTop'>${value[0]}</div>`);
    } else if (diffValu == 0) {
      this.setState({
        startPrice: value[1],
        endPrice: value[1],
      });
    } else {
      $$('#Second').find('.ant-slider-handle-1').append(`<div class='numberTipFirst'>${value[0]}</div>`);
    }

    if (value[1] == 3000) {
      $$('#Second').find('.ant-slider-handle-2').append('<div class=\'numberTipSecond\'>3000以上</div>');
      this.setState({
        startPrice: value[0],
        endPrice: 3001,
      });
    } else {
      $$('#Second').find('.ant-slider-handle-2').append(`<div class='numberTipSecond'>${value[1]}</div>`);
      this.setState({
        startPrice: value[0],
        endPrice: value[1],
      });
    }

  }

  afterChangeFun = () => {
    this.setState(() => ({
      pageIndex: 1,
      pageSize: 12,
    }), () => {
      this.getlist(1, 12);
    });
  }

  fileDesign = (data) => {
    this.setState(() => ({
      pageIndex: 1,
      pageSize: 12,
      designerId: data.id,
      seriesType: true,
    }), () => {
      this.getlist(1, 12);
      this.getSeriesData(data.id);
    });
  }

  // 选择系列
  // changeSeriecs = (data) => {
  //   // console.log('系列')
  //   // console.log(data)
  //   this.setState(() => ({
  //     pageIndex: 1,
  //     pageSize: 12,
  //     seriecsId: data,
  //   }), () => {
  //     this.getlist(1, 12);
  //   });
  // }

  searchSub = () => {
    const self = this;
    const desSelectList = [];
    const desSelectIDList = [];
    self.state.desALLCityData.forEach((item) => {
        // console.log(item)
      if (item.realName.toLowerCase().indexOf(self.state.searchDesName.toLowerCase()) >= 0) {
        desSelectList.push(item);
        desSelectIDList.push(item.id);
      }
    });
    self.setState({
      pageIndex: 1,
      pageSize: 12,
      designSelectList: desSelectList,
      desSelectIDList: desSelectIDList.join(','),
      designerId: desSelectIDList.join(','),
    }, () => {
      self.getlist(1, 12);
    });
  }

  // 搜索设计师
  searchDes=() => {
    const self = this;
    this.props.form.validateFields((err, values) => {
      this.setState({
        searchDesName: values.searchDesName,
      }, () => {
        this.allCountryClick(this.searchSub);
        // setTimeout(function(){
        //   var desSelectList = [];
        //   var desSelectIDList = []
        //   console.log(self.state.searchDesName)
        //   self.state.desALLCityData.forEach(item =>{
        //     console.log(item)
        //      if(item.realName.toLowerCase().indexOf(self.state.searchDesName.toLowerCase()) >=0){
        //       desSelectList.push(item);
        //       desSelectIDList.push(item.id)
        //     }
        //   })
        //   self.setState(() => ({
        //     pageIndex:1,
        //     pageSize:12,
        //     desALLCityData:desSelectList,
        //     desSelectIDList:desSelectIDList.join(',')
        //   }),() => {
        //     console.log(self.state.desSelectList)
        //     // self.getlist(1,12)
        //   })
        // },500)

      });

    });
  }

  handleChange = (checkedItem) => {
    console.log('kkk');
    console.log(this.state.designerId);
    const self = this;
    checkedItem.checked = !checkedItem.checked;
    console.log(checkedItem);
    this.state.seriesList.forEach((item) => {
      if (item.id == checkedItem.id) {
        item.checked = checkedItem.checked;
      }
    });

    const seriecsId = [];
    this.state.seriesList.forEach((item) => {
      if (item.checked) {
        seriecsId.push(item.id);
      }
    });

    this.setState(() => ({
      seriesList: self.state.seriesList,
      pageIndex: 1,
      pageSize: 12,
      seriecsId: seriecsId.join(','),
    }), () => {
      console.log('系列id');
      console.log(seriecsId);
      this.getlist(1, 12);
    });

    // this.setState(() => ({
    //   pageIndex: 1,
    //   pageSize: 12,
    //   seriecsId: data,
    // }), () => {
    //   this.getlist(1, 12);
    // });

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
    // console.log('渲染开始');
    const self = this;
    const { getFieldDecorator } = self.props.form;
    const { pageIndex, pageSize, totalNum, startPrice, endPrice, designDetailData } = this.state;
    const allParams = {
      // slidesPerView: this.state.amount,
      slidesPerView: 4,
      spaceBetween: 30,
      // centeredSlides: true,
      // loop: true,
      // pagination: {
      //   el: '.swiper-pagination',
      //   clickable: true,
      // },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
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


    const designerDetails = () => {
      return (
        <div className={styles.detailsWrap}>
          <div className={styles.personWrap}>
            <img src={app.$http.imgURL + designDetailData.headPic} className={styles.headPort} />
            <div className={styles.nameWrap}>
              <div className={styles.name}>{designDetailData.realName}</div>
              <div className={styles.sexWrap}>
                <span className={styles.sex}>{designDetailData.sex}</span>
                <span>{designDetailData.country}设计师</span>
              </div>
            </div>
          </div>

          <div className={styles.fieldWrap}>
            <div className={styles.field}>设计领域</div>
            <div className={styles.fieldDetail}>{designDetailData.designField}</div>
          </div>

          <div className={styles.line} />

          <div className={styles.ideaWrap}>
            <div className={styles.idea}>设计理念</div>
            <div className={styles.ideaDetails}>{designDetailData.introduce}</div>
          </div>

          <div className={styles.line} />

          <div className={styles.certWrap}>
            <div className={styles.certName}>获奖证书</div>
            <div className={styles.certImgWrap}>
              {designDetailData.imgThree != undefined && designDetailData.imgThree.length != 0 ?
                (designDetailData.imgThree.map((item) => {
                  return (
                    <img src={app.$http.imgURL + item} className={styles.certImg} />
                  );
                }))
                : ''
              }

              {/* {designDetailData.imgThree} */}
              {/* <img src={app.$http.imgURL + designDetailData.imgThree} className={styles.certImg} />
              {designDetailData.imgThree} */}
            </div>

          </div>

        </div>
      );
    };
    return (
      <div className={styles.DesignerPro}>
        <div className={styles.tit}>
          <Row>
            <Col span={15}>设计师款<span className={styles.titSubName}>选择产品添加到我的店铺，可回到“我的店铺”发布上架！</span></Col>
            <Col span={7} className={styles.searchInputWrap}>
              {getFieldDecorator('searchDesName', {
                initialValue: '',
              })(<Input placeholder="输入设计师查询" className={styles.searchInput} />)}
            </Col>
            <Col span={2} className={styles.textRight} style={{ padding: '0' }}>
              <Button className="bottonPublic" type="primary" onClick={this.searchDes}>搜索</Button>
            </Col>
          </Row>
        </div>
        <div className={styles.hr} />
        <div>
          <Row>
            <Col span={2} className={styles.leftTitle}>款式品类</Col>
            <Col span={22}>
              <RadioGroup onChange={event => self.changeCate(event, self)} defaultValue="">
                {self.state.categoryList.map(data =>
                  <RadioButton value={data.id}>{data.commonName}</RadioButton>,
                )}
              </RadioGroup>
            </Col>
          </Row>
        </div>
        <div className={styles.backWhite}>
          <div>
            <Row>
              <Col span={2} className={styles.leftTitle}>设计师国家</Col>
              <Col span={22}>
                <Button className={styles.buttonOne} onClick={this.allCountryClick}>全部</Button>
                {self.state.designCityList.map(data =>
                  <Button className={styles.buttonOne} onClick={() => self.countryClick(data.countryCode)}>{data.countryName}</Button>,
                )}
              </Col>
            </Row>
          </div>
          <div className={styles.hr} />
          <div>
            <Row>
              <Col span={2} className={styles.leftTitle}>设计师</Col>
              <Col span={22}>
                {self.state.designSelectList.length != 0 ?
                  <Swiper {...allParams} className={styles.swiperDiv} >
                    {self.state.designSelectList.map(data =>
                      <div className={styles.swiperSubDiv}>
                        <img src={app.$http.imgURL + data.headPic} className={styles.imgSmall} onClick={() => { this.fileDesign(data); }} />
                        <div className={styles.swiperDivTwo} onClick={() => this.viewDesign(data)}>查看资料</div>
                      </div>,
                    )}
                  </Swiper>
                  :
                  <span>此国家没有设计师！</span>
                }
              </Col>
            </Row>
            <Modal
              visible={this.state.viewDesignTF}
              onCancel={this.cancelViewDesign}
              footer={null}
              width={1150}
            >
              {designerDetails()}
            </Modal>
          </div>
          <div>
            {this.state.seriesType ?
              <span><div className={styles.hr} />
                <div>
                  <Row>
                    <Col span={2}>款式系列</Col>
                    <Col span={22}>
                      {this.state.seriesList.length != 0 ?
                        (this.state.seriesList.map((item) => {
                          return (
                            <a className={styles.checkBox}>
                              <CheckableTag className={styles.buttonOne} checked={item.checked} onChange={() => this.handleChange(item)}>
                                {item.seriecsName ?
                                  item.seriecsName
                                  :
                                  '无系列名称'
                                }
                              </CheckableTag>
                            </a>
                          );
                        }))
                      : '暂无系列'
                      }
                    </Col>
                  </Row>
                </div>
              </span>
          : ''
          }
          </div>
        </div>
        <div className={styles.priceWrap}>
          <span className={styles.leftTitle}>价格</span>
          <div className={styles.outerWrap}>
            <div className="sliderWrap" id="Second" style={{ width: '445px', height: 50 }}>
              <Slider
                range step={1} value={[startPrice, endPrice]} onChange={this.onChangeSecond} tipFormatter={null}
                min={0} max={3001} step={100} onAfterChange={this.afterChangeFun}
              />
            </div>
          </div>
        </div>
        <div className={styles.hr} />
        <div>
          <Row>
            {/* <Col span={12}>
            每页显示数量：
            <Button type="primary">20</Button>
              <Button>40</Button>
              <Button>60</Button>
            </Col> */}
            <Col span={24} className={styles.textRight}>
              <Checkbox
                // indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >全选</Checkbox>
              <Button className="bottonPublic" type="primary" onClick={() => self.proAddShop(self)} loading={this.state.addShopLoading}>
                添加到店铺
              </Button></Col>
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
                {this.state.proDataList.map(ielem =>
                  <Col className="gutter-row" span={6}>
                    <div className="gutter-box">
                      <div className={styles.pro}>
                        <div>
                          <p className={styles.textRight}>
                            {' '}
                            {/* {ielem.checked == true ? 'true' : 'false'} */}
                            <Checkbox value={ielem.productId} checked={ielem.checked} onChange={this.singleElection} />
                            {/* <Checkbox value={ielem.productId} checked={ielem.checked} /> */}
                          </p>
                          <img src={app.$http.imgURL + ielem.productImageUrl} onClick={() => self.showModal(ielem.productId)} />
                        </div>
                        <div className={styles.proDisplay} onClick={() => self.showModal(ielem.productId)}>
                          <p className={styles.proName}>{ielem.productName}</p>
                          <p className={styles.proPrice}>零售价： ￥{ielem.resalePrice}</p>
                        </div>
                      </div>
                    </div>
                  </Col>,
                )}
              </div>
            </Row>
            </Spin>
            <Modal
              visible={this.state.proViewModalTF}
              onCancel={() => self.handleCancel(self)}
              width="1100"
              footer={[
                <div className={styles.modalFooter}>
                  <Button className="bottonPublic" key="submit" type="primary" onClick={() => self.thisproAddShop(self)}>
                      添加到店铺
                    </Button>
                </div>,
              ]}
              >
              <div className={styles.modalDiv}>
                <Form onSubmit={this.newProSubmit}>
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
                            <Col span={2} className={styles.leftTxt}>产品类别：</Col>
                            <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.categoryName}</Col>
                            <Col span={2} className={styles.leftTxt}>适合人群：</Col>
                            <Col span={21} className={styles.rightTxt}>{this.state.proViewDetail.crowdName}</Col>
                            <Col span={2} className={styles.leftTxt}>产品名称：</Col>
                            <Col span={22} className={styles.rightTxt}>{this.state.proViewDetail.productName}</Col>
                            <Col span={2} className={styles.leftTxt}>宝石描述：</Col>
                            <Col span={22} className={styles.rightTxt}>{this.state.proViewDetail.productDescription}</Col>
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
                            <Column
                              title="平台批发价/￥"
                              dataIndex="salePrice"
                              key="salePrice"
                            />
                            <Column
                              title="统一零售价/￥"
                              dataIndex="sellPrice"
                              key="sellPrice"
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
                </Form>
              </div>
            </Modal>
          </div>
        </div>
        <div className={styles.hr} />
        <div className={styles.textRight}>
          <Pagination
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            current={pageIndex}
            total={totalNum}
            onChange={this.onChangPage}
            pageSize={pageSize} pageSizeOptions={['12', '24', '48']}
        />
        </div>
      </div>
    );
  }
}


DesignerPro.propTypes = {

};

DesignerPro.contextTypes = {
  router: PropTypes.object.isRequired,
};
const DesignerProFrom = Form.create()(DesignerPro);
export default DesignerProFrom;

