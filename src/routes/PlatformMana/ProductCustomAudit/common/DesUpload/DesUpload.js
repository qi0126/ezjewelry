import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './DesUpload.less';
import Swiper from 'react-id-swiper';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, InputNumber, Form, message, Tabs } from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { Column, ColumnGroup } = Table;// 表格属性

const marks = {// 滑块
  0: '0°C',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>10万以上</strong>,
  },
};

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


const tableState = {
  bordered: false,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
};

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


class DesUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      proDeiData: {},
      isMount: true,
      proImgBigUrl: '', // 第一张图片
      ModelAmount: () => {
        if (props.result.proAllData.imgList.length >= 3) {
          return 3;
        } else {
          return props.result.proAllData.imgList.length;
        }
      }, // 弹框的轮播数量
      loopStatu: () => {
        if (props.result.proAllData.imgList.length == 1) {
          return false;
        } else {
          return true;
        }
      }, // 图片轮播循环状态
      threeDImgOne: {}, // 3D图包数组第一张缩略图
      threeDImgData: {}, // 上传返回3D图包数组
      threeDImgDisplayTf: false, // 3D图包显示
      tempOneDis: true, // 3D图包显示不让重复添加d
    };
  }
  // 组件重复调用初始化组件
  componentWillReceiveProps() {
    this.componentDidMount();
    // this.state.isMount = false;
    // this.componentWillUnmount();
  }

  componentWillUnmount() {
    // console.log('aaaa');
  }
  // 初始化
  componentDidMount() {
    const self = this;
    // console.log('aaa:');

    // console.log(this.props.result.proAllData.skuPages);
    self.props.result.proAllData.manufactureProps.forEach((ielem, indTwo) => {
      ielem.sizeList = ielem.propValue.split(',');
    });
    this.setState({
      proImgBigUrl: self.props.result.proAllData.imgList[0],
      threeDImgDisplayTf: false,
      tempOneDis: true,
    });
    // console.log(this.props.result.proAllData);
    // console.log(self.props);
    // console.log(self.props.result.proAllData);
  }

   // 通过上架
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const texturesList = this.props.result.proAllData.skuPages;
        let tempSubmitList = [];
        if (this.props.result.proAllData.classifyName == '对戒') {
          tempSubmitList = [];
          this.props.result.proAllData.skuPages.forEach((ielem, ind) => {
            const tempObj = {
              skuId: ielem.skuId,
              wholesalePrice: values[`salePrice_${ind}_${ielem.skuProps[0].propValue}`] ? values[`salePrice_${ind}_${ielem.skuProps[0].propValue}`] : 0,
              saleBybulkPricr: values[`saleBybulkPricr_${ind}_${ielem.skuProps[0].propValue}`] ? values[`saleBybulkPricr_${ind}_${ielem.skuProps[0].propValue}`] : 0,
            };
            tempSubmitList.push(tempObj);
          });
        } else {
          tempSubmitList = [];
          for (let i = 0; i < texturesList.length; i++) {
            if (!values[`salePrice_${i}`]) {
              message.error('零售价和批发价还有未填，请重新填写再重新提交！');
              return false;
            }
            const tempTextureList = {
              skuId: texturesList[i].skuId,
              wholesalePrice: values[`salePrice_${i}`],
              saleBybulkPricr: values[`saleBybulkPricr_${i}`],
            };
            tempSubmitList.push(tempTextureList);
          }
        }
        const submitData = JSON.stringify(tempSubmitList);
        const params = {
          productId: this.props.result.proAllData.productId,
          skus: submitData,
        };
        app.$api.passSaleStatu(params).then((res) => {
          message.success(res.msg);
          this.componentDidMount();
          this.props.callbackParent();
        });

      }
    });
  }
  // 暂时保存
  stopSave=() => {
    this.props.form.validateFields((err, values) => {
      if (!err) {

        const texturesList = this.props.result.proAllData.skuPages;
        let tempSubmitList = [];
        if (this.props.result.proAllData.classifyName == '对戒') {
          tempSubmitList = [];
          this.props.result.proAllData.skuPages.forEach((ielem, ind) => {
            const tempObj = {
              skuId: ielem.skuId,
              wholesalePrice: values[`salePrice_${ind}_${ielem.skuProps[0].propValue}`] ? values[`salePrice_${ind}_${ielem.skuProps[0].propValue}`] : 0,
              saleBybulkPricr: values[`saleBybulkPricr_${ind}_${ielem.skuProps[0].propValue}`] ? values[`saleBybulkPricr_${ind}_${ielem.skuProps[0].propValue}`] : 0,
            };
            tempSubmitList.push(tempObj);
          });
        } else {
          tempSubmitList = [];
          for (let i = 0; i < texturesList.length; i++) {
            // if (!values[`salePrice_${i}`]) {
            //   message.error('零售价还有未填，请重新填写再重新提交！');
            //   return;
            // }
            const tempTextureList = {
              skuId: texturesList[i].skuId,
              wholesalePrice: values[`salePrice_${i}`],
              saleBybulkPricr: values[`saleBybulkPricr_${i}`],
            };
            tempSubmitList.push(tempTextureList);
          }
        }
        // console.log(tempSubmitList);
        const submitData = JSON.stringify(tempSubmitList);
        const params = {
          productId: this.props.result.proAllData.productId,
          skus: submitData,
        };

        app.$api.waitPassSaleStatu(params).then((res) => {
          message.success(res.msg);
          this.componentDidMount();
          this.props.callbackParent();
        });

      }
    });

  }
  // 拒绝上架
  cancelSave=() => {
    const params = {
      productId: this.props.result.proAllData.productId,
    };
    app.$api.NOPassSaleStatu(params).then((res) => {
      message.success(res.msg);
      this.componentDidMount();
      this.props.callbackParent();
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
      productId: this.props.result.proAllData.productId,
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

    const swiperParams = {
      slidesPerView: self.state.ModelAmount(),
      shouldSwiperUpdate: true,
      loop: self.state.loopStatu(),
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
                proImgBigUrl: self.props.result.proAllData.imgList[i],
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
      <div className={styles.DesignerUpload}>
        <Form layout="inline">
          <div className={styles.modalDiv}>
            <Row>
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
                <div id="swiperWrapId">{swiperLi(self.props.result.proAllData.imgList)}</div>
                </div>
                {self.props.result.proAllData.threeDUrl ? (
                  <div className={styles.titTxt} onClick={this.threeDImgDisplay}>
                        3D图包
                        <div>
                          <div className={styles.swiperSubDiv}>
                            <img src={app.$http.imgURL + self.props.result.proAllData.mPicUrl} className={styles.imgSmall} />
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
                    商品编号：{self.props.result.proAllData.productCode}
                  </span>
                  </div>
                  <div className={styles.tabTwo}>
                    <Row>
                      <Col span={24} className={styles.leftTxt}>设计师名称：<span className={styles.rightTxt}>{self.props.result.proAllData.nickName}</span></Col>
                      <Col span={2} className={styles.leftTxt}>产品系列：</Col>
                      <Col span={21} className={styles.rightTxt}>{self.props.result.proAllData.serieName}</Col>
                      <Col span={2} className={styles.leftTxt}>款式品类：</Col>
                      <Col span={21} className={styles.rightTxt}>{self.props.result.proAllData.classifyName}</Col>
                      <Col span={2} className={styles.leftTxt}>款式名称：</Col>
                      <Col span={22} className={styles.rightTxt}>{self.props.result.proAllData.productName}</Col>
                      <Col span={2} className={styles.leftTxt}>款式描述：</Col>
                      <Col span={22} className={styles.rightTxt}>{self.props.result.proAllData.productDetail}</Col>
                      {self.props.result.proAllData.manufactureProps.map(item =>
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
                      )}
                    </Row>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.contant}>
                  <div className={styles.mainTxt}>
                        产品材质/重量/价格:
                  </div>
                  <div className={styles.tabOne} >
                    {self.props.result.proAllData.classifyName != '对戒' ?
                      <span>
                        {self.props.result.proAllData.skuPages ?
                            self.props.result.proAllData.skuPages.map((data, ind) =>
                              <Row className={styles.tabOneCol} key={ind}>
                                {data.skuProps ?
                                  data.skuProps.map(idata =>
                                    <Col span={6} key={idata.cname}>
                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{idata.cname}</span>{idata.propValue}
                                    </Col>,
                                ) : ''}
                                <Col span={6} className={styles.titTxtOne} style={{ float: 'right' }}>
                                  <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>零售价/￥</span>
                                  {getFieldDecorator(`salePrice_${ind}`, {
                                    initialValue: data.wholesalePrice,
                                  })(<InputNumber min={0} placeholder="" style={{ width: 120 }} />)}
                                </Col>
                                <Col span={6} className={styles.titTxtOne} style={{ float: 'right' }}>
                                  <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>平台批发价/￥</span>
                                  {getFieldDecorator(`saleBybulkPricr_${ind}`, {
                                    initialValue: data.saleBybulkPricr,
                                  })(<InputNumber min={0} placeholder="" style={{ width: 120 }} />)}
                                </Col>
                                <Col span={6} className={styles.titTxtOne} style={{ float: 'right' }}>
                                  <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>建议售价/￥</span>
                                  {data.minPrice}
                                </Col>
                                {data.futurePrice ?
                                  <Col span={6} className={styles.titTxtOne} style={{ float: 'right' }}>
                                    <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>预估成本价/￥</span>
                                    {data.futurePrice}
                                  </Col>
                                  : ''
                                }
                              </Row>,
                            )
                            :
                            <div>此产品暂无材质规格！</div>
                          }
                      </span>
                      :
                      <span>
                        {self.props.result.proAllData.skuPages ?
                          (self.props.result.proAllData.skuPages.map((mdata, ind) =>
                            <Tabs defaultActiveKey="0">

                              <TabPane tab={mdata.skuProps[0].propValue} key={ind}>
                                <Row className={styles.tabOneCol}>
                                  {mdata.skuProps ?
                                    mdata.skuProps.map(kdata =>
                                      <Col span={6} style={{ height: 40 }}>
                                        <span style={{ color: '#333333', marginRight: 10, fontSize: '12px', fontFamily: 'PingFangSC-Regular' }}>{kdata.cname}</span>{kdata.propValue}
                                      </Col>,
                                    ) : ''}
                                  <Col span={6} style={{ height: 40, float: 'right' }}>
                                    <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>零售价/￥</span>
                                    {getFieldDecorator(`salePrice_${ind}_${mdata.skuProps[0].propValue}`, {
                                      initialValue: mdata.wholesalePrice,
                                    })(<Input placeholder="" style={{ width: 120 }} />)}
                                  </Col>
                                  <Col span={6} style={{ height: 40, float: 'right' }}>
                                    <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>平台批发价/￥</span>
                                    {getFieldDecorator(`saleBybulkPricr_${ind}_${mdata.skuProps[0].propValue}`, {
                                      initialValue: mdata.saleBybulkPricr,
                                    })(<Input placeholder="" style={{ width: 120 }} />)}
                                  </Col>
                                  <Col span={6} className={styles.titTxtOne} style={{ height: 40, float: 'right' }}>
                                    <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>建议售价/￥</span>
                                    {mdata.minPrice}
                                  </Col>
                                  {mdata.futurePrice ?
                                    <Col span={6} className={styles.titTxtOne} style={{ height: 40, float: 'right' }}>
                                      <span style={{ color: '#333333', marginRight: 10, fontSize: '12px' }}>预估成本价/￥</span>
                                      {mdata.futurePrice}
                                    </Col>
                                    : ''
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
          <div className={styles.txtRight}>
            {self.props.result.proAllData.isAudit == 2 || self.props.result.proAllData.isAudit == 5 ?
              <div className={styles.txtRight}>
                <Button size="large" type="primary" onClick={self.cancelSave} className={styles.txtRightButton}>拒绝上架</Button>
                <Button size="large" type="primary" onClick={self.stopSave} className={styles.txtRightButton}>暂时保存</Button>
                <Button size="large" type="primary" onClick={self.handleSubmit} className={styles.txtRightButton}>通过上架</Button>
              </div>
              : ''
            }
          </div>
        </Form>
      </div>
    );
  }
}

DesUpload.propTypes = {
  result: PropTypes.object,
};

DesUpload.defaultProps = {
  result: { proId: '' },
};

DesUpload.contextTypes = {
  router: PropTypes.object.isRequired,
};
const DesUploadForm = Form.create()(DesUpload);
export default DesUploadForm;
