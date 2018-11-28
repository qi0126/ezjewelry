import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './FactoryUpload.less';
import Swiper from 'react-id-swiper';
import app from 'app';
import $$ from 'jquery';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, InputNumber, Form, message } from 'antd';

const FormItem = Form.Item;

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

// const params = {
//   slidesPerView: 3,
//   spaceBetween: 30,
//   loop:true,
//   // centeredSlides: true,
//   pagination: {
//     el: '.swiper-pagination',
//     clickable: true,
//   },
//   navigation: {
//     nextEl: '.swiper-button-next',
//     prevEl: '.swiper-button-prev',
//   },
// };

class FactoryUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      proDeiData: {},
      proImgBigUrl: '', // 第一张图片
      isMount: true,
      ModelAmount: () => {
        if (props.result.proAllData.images.length >= 3) {
          return 3;
        } else {
          return props.result.proAllData.images.length;
        }
      }, // 弹框的轮播数量
      loopStatu: () => {
        if (props.result.proAllData.images.length == 1) {
          return false;
        } else {
          return true;
        }
      }, // 图片轮播循环状态
      threeDImgList: [], // 3D图包数组
      threeDImgOne: {}, // 3D图包数组第一张缩略图
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
    if(self.props.result.proAllData.designs){
      self.props.result.proAllData.designs.forEach((ielem, indTwo) => {
        ielem.sizeList = ielem.designValue.split(',');
      });
    }

    if (self.props.result.proAllData.details) {
      setTimeout(() => {
        self.refs.imgTxtBackup.innerHTML = self.props.result.proAllData.details;
      }, 200);
    }
    // console.log('产品数据');
    // console.log(self.props.result.proAllData.images);
    this.setState({
      proImgBigUrl: self.props.result.proAllData.images[0].imageUrl,
      threeDImgDisplayTf: false,
      tempOneDis: true,
    });

  }
   // 通过上架
  handleSubmit = (e) => {
    const self = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const texturesList = this.props.result.proAllData.textures;
        const tempSubmitList = [];
        // console.log('提交数据');
        // console.log(texturesList);
        let result = false;
        for (let i = 0; i < texturesList.length; i++) {
          // console.log('进入12');
          // console.log(values[`proPrice_${i}`]);
          if (!values[`proPrice_${i}`]) {
            message.error('零售价还有未填，请重新填写再重新提交！');
            result = true;
            return;
          }
          const tempTextureList = {
            productId: texturesList[i].productId,
            textureId: texturesList[i].id,
            salePrice: values[`proPrice_${i}`],
            passStatus: 3,
          };
          tempSubmitList.push(tempTextureList);
        }

        if (result) {
          return;
        }
        const submitData = JSON.stringify({ platTextureFroms: tempSubmitList });
        const params = { productStr: submitData };
        app.$api.updatePlatformProduct(params).then((res) => {
          message.success(res.msg);
          this.componentDidMount();
          this.props.callbackParent();
        });
      }
    });
  }
  // 暂时保存事件
  timeSave(thiselem) {
    thiselem.props.form.validateFields((err, values) => {
      if (!err) {
        const texturesList = this.props.result.proAllData.textures;
        console.log('保存数据');
        console.log(this.props.result.proAllData.textures);
        const tempSubmitList = [];
        for (let i = 0; i < texturesList.length; i++) {
          // if (!values[`proPrice_${i}`]) {
          //   message.error('零售价还有未填，请重新填写再重新提交！');
          //   return;
          // }
          const tempTextureList = {
            productId: texturesList[i].productId,
            textureId: texturesList[i].id,
            salePrice: values[`proPrice_${i}`],
            passStatus: 0,
          };
          tempSubmitList.push(tempTextureList);
        }
        // console.log(tempSubmitList);
        const submitData = JSON.stringify({ platTextureFroms: tempSubmitList });
        const params = { productStr: submitData };
        app.$api.updatePlatformProduct(params).then((res) => {
          message.success(res.msg);
          this.componentDidMount();
          this.props.callbackParent();
        });
      }
    });
  }
  // 拒绝上架
  cancelSave(thiselem) {
    thiselem.props.form.validateFields((err, values) => {
      if (!err) {
        const texturesList = this.props.result.proAllData.textures;
        const tempSubmitList = [];
        for (let i = 0; i < texturesList.length; i++) {
          // if (!values[`proPrice_${i}`]) {
          //   message.error('零售价还有未填，请重新填写再重新提交！');
          //   return;
          // }
          const tempTextureList = {
            productId: texturesList[i].productId,
            textureId: texturesList[i].id,
            salePrice: values[`proPrice_${i}`],
            passStatus: 4,
          };
          tempSubmitList.push(tempTextureList);
        }
        // console.log(tempSubmitList);
        const submitData = JSON.stringify({ platTextureFroms: tempSubmitList });
        const params = { productStr: submitData };
        app.$api.updatePlatformProduct(params).then((res) => {
          message.success(res.msg);
          this.componentDidMount();
          this.props.callbackParent();
        });
      }
    });
  }
  showModal() {

  }

  handleOk() {
  }

  handleCancel() {
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
      productId: self.props.result.proAllData.id,
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
    // const swiperLi = () => {
    //   const lis = this.props.result.proAllData.images.map((item) => {
    //     return (
    //       <div key={item.id} className={styles.imgWrap}>
    //         <img src={app.$http.imgURL + item.imageUrl} className={styles.imgSmall} />
    //       </div>
    //     );
    //   });
    //   return lis;
    // };

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
                proImgBigUrl: self.props.result.proAllData.images[i].imageUrl,
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
      <div className={styles.FactoryUpload}>
        <Form layout="inline" onSubmit={this.handleSubmit}>
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
                  <div id="swiperWrapId">{swiperLi(self.props.result.proAllData.images)}</div>
                </div>
                {self.props.result.proAllData.figureFrom ? (
                  <div className={styles.titTxt} onClick={this.threeDImgDisplay}>
                        3D图包
                        <div>
                          <div className={styles.swiperSubDiv}>
                            <img src={app.$http.imgURL + self.props.result.proAllData.figureFrom.figuerThurl} className={styles.imgSmall} />
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
                      {self.props.result.proAllData.designSource == 1 ?
                        <span>
                          <Col span={24} className={styles.leftTxt}>供应商名称：<span className={styles.rightTxt}>{self.props.result.proAllData.companyName}</span></Col>
                        </span>
                        : ''
                      }

                      <Col span={2} className={styles.leftTxt}>产品类别：</Col>
                      <Col span={21} className={styles.rightTxt}>{self.props.result.proAllData.categoryName}</Col>
                      <Col span={2} className={styles.leftTxt}>产品名称：</Col>
                      <Col span={22} className={styles.rightTxt}>{self.props.result.proAllData.productName}</Col>
                      <Col span={2} className={styles.leftTxt}>宝石描述：</Col>
                      <Col span={22} className={styles.rightTxt}>{self.props.result.proAllData.productDescription}</Col>
                      {self.props.result.proAllData.designs ?
                        (self.props.result.proAllData.designs.map((ielem, indOne) =>
                          <span>
                            <Col span={2} className={styles.leftTxt}>{ielem.designName}:</Col>
                            <Col span={22} className={styles.rightTxt}>
                              <span className={styles.rightNumSpan}>
                                {ielem.sizeList ?
                                  (ielem.sizeList.map((data, index) => (
                                    <span className={styles.rightNumSpan} key={index}>
                                      {data}
                                    </span>
                                  )))
                                  : ''
                                }
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
                    <Table dataSource={self.props.result.proAllData.textures} {...tableState}>
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
                        title="平台批发价/￥"
                              // dataIndex="priceOne"
                        key="priceOne"
                        render={(text, record, ind) => (
                          <span>
                            {getFieldDecorator(`proPrice_${ind}`, {
                              initialValue: record.salePrice,
                            })(
                              <InputNumber
                                formatter={value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                className={styles.input140}
                                min={0}
                              />,
                            )}
                          </span>
                              )}
                            />
                    </Table>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.contant}>
                  {/* <div className={styles.tempDiv} /> */}
                  {self.props.result.proAllData.details ?
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
          <div className={styles.footerStyle}>
            <span onClick={() => self.cancelSave(self)} className={styles.noGround}>拒绝上架</span>
            <Button size="large" type="primary" onClick={() => self.timeSave(self)} className={styles.btnSave}>暂时保存</Button>
            <Button htmlType="submit" size="large" type="primary">通过上架</Button>
          </div>
        </Form>
      </div>
    );
  }
}

FactoryUpload.propTypes = {
  result: PropTypes.object,
};

FactoryUpload.defaultProps = {
  result: { proId: '' },
};

FactoryUpload.contextTypes = {
  router: PropTypes.object.isRequired,
};
const FactoryUploadForm = Form.create()(FactoryUpload);
export default FactoryUploadForm;
