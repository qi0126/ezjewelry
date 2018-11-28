import React from 'react';
import { connect } from 'dva';

import Swiper from 'react-id-swiper';
import PropTypes from 'prop-types';
import styles from './SellerPro.less';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Pagination, Form, InputNumber, Select, Checkbox, message, Spin } from 'antd';

const { Column, ColumnGroup } = Table; // 表格属性
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
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

// const swiperParams = {
//   slidesPerView: 4,
//   spaceBetween: 30,
//   centeredSlides: true,
//   pagination: {
//     el: '.swiper-pagination',
//     clickable: true,
//   },
//   navigation: {
//     nextEl: '.swiper-button-next',
//     prevEl: '.swiper-button-prev',
//   },
// };




const params = {
  slidesPerView: 4,
  spaceBetween: 30,
  centeredSlides: true,
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

class sellerPro extends React.Component {
  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      addShopLoading: false, // 添加到店铺加载状态
      startPrice: 0,
      endPrice: 3001,
      categoryId: '',
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
      // proSelectEdList: [], // 选择产品数组
      // 修改框架
      proSizeList: [{ value: '' }], // 产品款式尺寸
      imgDisplayList: [], // 图片示意图
      materList: [], // 材质列表
      marks: {// 滑块数据
        0: '0°C',
        200: {
          style: {
            color: '#f50',
          },
          label: <strong>10万以上</strong>,
        },
      },
      ModelAmount: 1, // 弹框的轮播数量
      loopStatu: true, // 图片轮播循环状态
      pageIndex: 1, // 当前页
      pageSize: 12, // 每页展示条数
      totalNum: 0, // 总条数
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
      proLoading: true, // 产品加载中属性
    };
    // 定义全局变量方法
  }
  componentDidMount() {
    // 查询供应商产品数据信息
    this.getlist(1, 12);
    this.sliderInit();
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

  // 查询供应商产品数据信息
  getlist = (page, rows) => {
    this.setState({
      proLoading: true,
    });
    const params = {
      designSource: 1,
      categoryId: this.state.categoryId,
      startPrice: this.state.startPrice,
      endPrice: this.state.endPrice,
      page,
      rows,
    };
    app.$api.selectBrandPrudoctNumber(params).then((res) => {
      // console.log('商家品牌');
      // console.log(res);
      if (res.data) {
        this.setState({
          proDataList: res.data.data,
          totalNum: res.data.rowSize,
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


  showModal(elem) {
    const self = this;
    const params = { productId: elem };
    app.$api.findProductByProductId(params).then((res) => {
      const tempList = [];
      const tempObj = res.data;
      if (tempObj.designs && tempObj.designs[0].designValue != undefined) {
        tempObj.designs.forEach((ielem, indOne) => {
          ielem.sizeList = ielem.designValue.split(',');
        });
      }


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
      // console.log(this.state.proImgList);
      this.setState({
        proViewModalTF: true,
        proViewId: elem,
        threeDImgDisplayTf: false,
        tempOneDis: true,
      });
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
  handleOk(thiselem) {
    thiselem.setState({
      proViewModalTF: false,
    });
  }
  // 改变分类筛选事件
  onChange(e) {
      // 查询供应商产品数据信息
    const params = { designSource: 1, categoryId: e.target.value };
    console.log('测试');
    this.setState(() => ({
      categoryId: e.target.value,
    }), () => {
      this.getlist(1, 12);
    });
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
  }
  // 改变页码
  onChangePage(e) {
    console.log(e);
  }
  handleCancel(self) {
    self.setState({
      proViewModalTF: false,
      addGroundModalTF: false,
      cancelGroundModalTF: false,
    });
  }
  // 多选框选择产品
  // proSelectChange(e, thiselem) {
  //   thiselem.setState({
  //     proSelectEdList: e,
  //   });
  // }
  // 店铺挑选产品
  proAddShop(thiselem) {

    if (proSelectEdList.length != 0) {
      this.setState({
        addShopLoading: true,
      });
      const params = { productId: proSelectEdList.join(','), brandType: 1 };
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
  changeCate(e, thiselem) {
    // 查询供应商产品数据信息
    // const params = { designSource: 1, categoryId: e.target.value };
    // app.$api.selectBrandPrudoctNumber(params).then((res) => {
    //   if (res.data) {
    //     thiselem.setState({
    //       proDataList: res.data.data,
    //     });
    //   } else {
    //     thiselem.setState({
    //       proDataList: [],
    //     });
    //   }
    // });
    this.setState(() => ({
      categoryId: e.target.value,
      pageIndex: 1,
      pageSize: 12,
    }), () => {
      this.getlist(1, 12);
    });
  }

     // 分页
  onShowSizeChange = (current, pageSize) => {
    console.log(pageSize);
    this.setState(() => ({
      pageSize,
      checkAll: false,
    }), () => {
      this.getlist(1, pageSize);
      proSelectEdList = [];
    });

  }

  onChangPage = (page, pageSize) => {
    console.log(page, pageSize);
    this.setState(() => ({
      pageIndex: page,
      checkAll: false,
    }), () => {
      this.getlist(page, pageSize);
      proSelectEdList = [];
    });
  }

  onChangeSecond = (value) => {
    console.log('滑动');
    console.log(value);
    console.log(value[1] - value[0]);
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
      this.setState(() => ({
        startPrice: value[0],
        endPrice: 3001,
      }));
    } else {
      $$('#Second').find('.ant-slider-handle-2').append(`<div class='numberTipSecond'>${value[1]}</div>`);
      this.setState(() => ({
        startPrice: value[0],
        endPrice: value[1],
      }));
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
          console.log('删除');
          proSelectEdList.splice(numIndex, 1);
        }
        console.log('新数组2');
        console.log(numIndex);
        console.log(proSelectEdList);
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
    const { pageIndex, pageSize, totalNum, startPrice, endPrice } = this.state;
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


    return (
      <div className={styles.SellerPro}>
        <div className={styles.tit}>
        供应商款
        <span className={styles.titSubName}>
          选择产品添加到我的店铺，可回到“我的店铺”设置零售价或发布上架！
        </span>
        </div>
        <div className={styles.hr} />
        <Row>
          <Col span={2} className={styles.leftTitle}>
            款式品类
          </Col>
          <Col span={22}>
            <RadioGroup onChange={event => self.changeCate(event, self)} defaultValue="">
              {this.state.categoryList.map(data =>
                <RadioButton value={data.id}>{data.commonName}</RadioButton>,
              )}
            </RadioGroup>
          </Col>
        </Row>
        <div className={styles.hr} />
        <Row>
          <Col span={2} className={styles.leftTitle}>
          价格
          </Col>
          <Col span={22}>
            <div className={styles.outerWrap}>
              <div className="sliderWrap" id="Second" style={{ width: '445px', height: 50 }}>
                <Slider
                  range step={1} value={[startPrice, endPrice]} onChange={this.onChangeSecond} tipFormatter={null}
                  min={0} max={3001} step={100} onAfterChange={this.afterChangeFun}
                />
              </div>
            </div>
          </Col>
        </Row>
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
                className="f12"
              >全选</Checkbox>
              <Button className="bottonPublic" type="primary" onClick={() => self.proAddShop(self)} loading={this.state.addShopLoading}>
                添加到店铺
              </Button>
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
                  {this.state.proDataList.map(ielem =>
                  <Col className="gutter-row" span={6}>
                    <div className="gutter-box">
                      <div className={styles.pro}>
                        <div>
                          <p className={styles.textRight}>
                            {' '}
                            {/* <Checkbox value={ielem.productId} /> */}
                            {/* {ielem.checked == true ? 'true' : 'false'} */}
                            <Checkbox value={ielem.productId} checked={ielem.checked} onChange={this.singleElection} />
                          </p>
                          <img src={app.$http.imgURL + ielem.productImageUrl} onClick={() => self.showModal(ielem.productId)} />
                        </div>
                        <div className={styles.proDisplay} onClick={() => self.showModal(ielem.productId)}>
                          <p className={styles.proName}>{ielem.productName}</p>
                          <p className={styles.proPrice}>批发价： ￥{ielem.resalePrice}</p>
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
                            key="Price"
                            />
                          <Column
                            title="店铺零售价/￥"
                            key="salePrice"
                            render={(text, record) => (
                              <span>
                                挑选店铺后设置零售价
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
          </div>
        </div>
        <div className={styles.hr} />
        <div className={styles.textRight}>
          <Pagination
            showSizeChanger onShowSizeChange={this.onShowSizeChange} current={pageIndex} total={totalNum} onChange={this.onChangPage}
            pageSize={pageSize} pageSizeOptions={['12', '24', '48']}
          />
        </div>
      </div>
    );
  }
}

sellerPro.propTypes = {

};

sellerPro.contextTypes = {
  router: PropTypes.object.isRequired,
};
const sellerProFrom = Form.create()(sellerPro);
export default sellerProFrom;
