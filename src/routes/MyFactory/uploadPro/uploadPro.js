import React from 'react';
import { connect } from 'dva';
import 'antd/dist/antd.css';
import Editor from 'react-umeditor';
import PropTypes from 'prop-types';
import styles from './uploadPro.less';
import app from 'app';

import { Radio, Button, Row, Col, Table, Input, Select, message, InputNumber, Form, Icon, Checkbox, Switch, Slider, Upload, Rate } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Column } = Table; // 表格属性
const proListData = [{}];
const tableState = {
  // bordered: true,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
  rowClassName: () => {
    return styles.rowClass;
  },
};

class UploadPro extends React.Component {
  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      categoryList: [], // 产品分类接口数据
      categoryValue: '', // 产品分类选中信息
      crowdList: [], // 适合人群接口数据
      crowdValue: '', // 适合人群选中信息\
      materList: [], // 材质接口数据
      imgDisplayList: [], // 图片示意图
      loverTf: false, // 情侣
      message: '',
      proSizeList: [{ value: '' }], // 产品款式尺寸
      proBoySizeList: [{ value: '' }], // 产品款式尺寸
      proGirlSizeList: [{ value: '' }], // 产品款式尺寸
      proMaterList: [{ weight: 0, price: 0, key: 0 }], // 产品材质
      materCount: 1, // 增加材质
      jpgThreeDUrl: '', // 3D图包路径
      jpgThreeDId: '', // 3D图包id
      productStr: {
        // 传过去
        productName: '', // 产品名称
        productDescription: '', // 宝石描述
        categoryId: 0, // 分类ID
        categoryName: '', // 分类名称
        crowdId: 0, // 适合人群ID
        crowdName: '', // 适合人群名称
        details: '', // 图文详情
        stonePrice: 0, // 宝石价格
        wagePrice: 0, // 生产工费价格
        combinationPrice: 0, // 批发价格，默认第一个
        productStatus: 3, // 上架状态 0 暂存 1 上架 2 下架 3 发布审核
        auditStatus: 0, // 审核状态 0 不需要审核 1 审核中 2 已审核 3 审核通过 4 驳回
        figureFrom: {
          figureImageId: '', // 3D图包包的ID
        },
        imageIdFroms: [],
        designs: [
          {
            designName: '款式尺寸', // 款式名称
            designValue: '', // 款式大小，以逗号隔开
          },
        ],
        textures: [],
      },
      content: '', // 富文本默认字段
      loading: false, // 加载状态
      saveLoading: false, // 创建产品loading
    };
  }

  handleChange(content, thiselem) {
    thiselem.setState({
      content,
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

  getImg(e) {
    const files = e.target.files[0];
    const fromData = new FormData();
    fromData.append('uploadType', 1);
    fromData.append('file', files);
    // 图片上传
    app.$api.uploadImage(fromData).then((res) => {
      console.log(res);
    });
  }

  componentDidMount() {
    // 查询分类数据信息
    app.$api.selectCategoryNumber().then((res) => {
      const categoryList = res.data;
      categoryList.forEach((item) => {
        item.id = `${item.id}`;
      });
      this.setState({
        categoryList,
      });
    });

    // 查询适合人群数据信息
    app.$api.selectCrowdNumber().then((res) => {
      const crowdList = res.data;
      crowdList.forEach((item) => {
        item.id = `${item.id}`;
      });
      this.setState({
        crowdList,
      });
    });
    // 查询材质数据信息
    app.$api.selectGoldlist().then((res) => {
      const materList = res.data;
      materList.forEach((item) => {
        item.id = `${item.id}`;
      });
      this.setState({
        materList,
      });
    });
  }

  // 平面产品图片上传
  imgUpload(thiselem) {
    thiselem.refs.imgInput.click();
    console.log('点击图片');
  }
  // 平面产品图片删除
  delImg(proId, ind) {
    const self = this;
    console.log(proId);
    console.log(ind);
    // console.log(self.state.imgDisplayList);
    self.state.imgDisplayList.splice(ind, 1);
    self.setState(() => ({
      imgDisplayList: self.state.imgDisplayList,
    }));
  }
  // 事件平面产品图片上传
  imgInputFun(thiselem) {
    // console.log(this.refs.imgInput.files)
    const params = new FormData();
    params.append('files', thiselem.refs.imgInput.files[0]);
    // 图片上传
    app.$api.uploadImage(params).then((res) => {
      const imgList = thiselem.state.imgDisplayList;
      imgList.push(res.data);
      thiselem.setState(() => ({
        imgDisplayList: imgList,
      }), () => {
        thiselem.refs.imgInput.value = '';
        console.log('图片数据');
        console.log(thiselem.state.imgDisplayList);
        console.log(thiselem.refs.imgInput);
      });
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
  delRar() {
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
    // console.log('3d图片');
    // console.log(thiselem.refs.rarInput.files[0]);
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

  deleteEmptyProperty = (object) => {
    for (const i in object) {
      const value = object[i];
      // sodino.com
      // console.log('typeof object[' + i + ']', (typeof value));
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          if (value.length == 0) {
            delete object[i];
            console.log('delete Array', i);
            continue;
          }
        }
        this.deleteEmptyProperty(value);
        if (this.isEmpty(value)) {
          console.log('isEmpty true', i, value);
          delete object[i];
          console.log('delete a empty object');
        }
      } else if (value === '' || value === null || value === undefined) {
        delete object[i];
        console.log('delete ', i);
      } else {
        console.log('check ', i, value);
      }
    }
  }
  isEmpty = (object) => {
    for (const name in object) {
      return false;
    }
    return true;
  }

  // 添加款式尺寸
  addProSize() {
    this.state.proSizeList.push({ value: '' });
    this.setState({
      proSizeList: this.state.proSizeList,
    });
  }
  // 添加男款式尺寸
  addBoyProSize() {
    const { proBoySizeList } = this.state;
    proBoySizeList.push({ value: '' });
    this.setState({
      proBoySizeList,
    });
  }
  // 添加女款式尺寸
  addGirlProSize() {
    const { proGirlSizeList } = this.state;
    proGirlSizeList.push({ value: '' });
    this.setState({
      proGirlSizeList,
    });
  }

  // 增加材质事件
  addProMater() {
    const { proMaterList, materCount } = this.state;
    proMaterList.push({ weight: 0, price: 0, key: materCount + 1 });
    // console.log('表格数据');
    // console.log(this.state.proMaterList);
    const num = materCount + 1;
    this.setState({
      proMaterList,
      materCount: num,
    });
  }
    // 删除尺寸
  delSize=(ind) => {
    const self = this;
    if (self.state.proSizeList.length > 1) {
      self.state.proSizeList.splice(ind, 1);
    } else {
      message.error('款式尺寸不能全删！');
    }
    self.setState({
      proSizeList: self.state.proSizeList,
    });
  }
          // 情侣组合删除尺寸
  delSizeDou=(elem, ind) => {
    const self = this;
    if (elem.length > 1) {
      elem.splice(ind, 1);
    } else {
      message.error('款式尺寸不能全删！');
    }
    self.setState({
      proSizeList: self.state.proSizeList,
      proBoySizeList: self.state.proBoySizeList,
      proGirlSizeList: self.state.proGirlSizeList,
    });
  }

  // 页眉返回产品管理
  returnPro() {
    this.context.router.push('MyFactory/manageFinishProduct');
  }

  // 处理参数
  handleParams(err, values) {
    const self = this;
    const proSizeList = []; // 款式尺寸数组
    const proBoySizeList = []; // 款式尺寸数组
    const proGirlSizeList = []; // 款式尺寸数组
    const proMaterListTwo = []; // 产品材质/重量/价格遍历数组
    for (const i in values) {
      // 款式尺寸遍历
      if (i.indexOf('defsize_'.toLocaleLowerCase()) >= 0) {
        proSizeList.push(values[i]);
      }
      if (i.indexOf('boysize_'.toLocaleLowerCase()) >= 0) {
        proBoySizeList.push(values[i]);
      }
      if (i.indexOf('girlsize_'.toLocaleLowerCase()) >= 0) {
        proGirlSizeList.push(values[i]);
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

    self.state.productStr.designs = [];
    if (proSizeList.length > 0) {
      self.state.productStr.designs.push({ designName: '款式尺寸', designValue: proSizeList.filter(item => item).join(',') });
    }
    if (proBoySizeList.length > 0) {
      self.state.productStr.designs.push({ designName: '男士尺寸', designValue: proBoySizeList.filter(item => item).join(',') });
    }
    if (proGirlSizeList.length > 0) {
      self.state.productStr.designs.push({ designName: '女士尺寸', designValue: proGirlSizeList.filter(item => item).join(',') });
    }

    self.state.productStr.stonePrice = values.stonePrice; // 宝石价格
    self.state.productStr.wagePrice = values.wagePrice; // 生产工费
    self.state.productStr.imageIdFroms = this.state.imgDisplayList; // 生产工费
    self.state.productStr.textures = proMaterListTwo; // 产品材质/重量/价格遍历數組
    self.state.productStr.details = self.state.content; // 图文详情
    if (self.state.jpgThreeDUrl != '') {
      self.state.productStr.figureFrom = { figureImageId: self.state.jpgThreeDId }; // 3D图包ID
    }
  }

  // 产品上架保存
  saveData(e) {
    const self = this;
    self.setState({
      saveLoading: true,
    });
    this.props.form.validateFields((err, values) => {
      this.handleParams(err, values);

      self.setState({
        loading: true,
      });

      self.state.productStr.productStatus = 0; // 保存
      const params = app.$v.deleteEmptykey(self.state.productStr);
      app.$api.addProductNumber(params).then((res) => {

        message.success(res.msg);
        self.setState({
          loading: false,
          saveLoading: false,
        });
        self.context.router.push('/MyFactory/manageFinishProduct');
      }).catch((err) => {
        self.setState({
          loading: false,
          saveLoading: false,
        });
      });
    });
  }

  newProSubmit = (e) => {
    // console.log('提交数据');
    const self = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let emptyTF = true; // 必填提示框判断
      self.handleParams(err, values);
      /*
      ** 非空判断开始
      */
      // 产品类别
      if (!values.categoryId) {
        emptyTF = false;
      }
      // 适合人群
      if (!values.crowdId) {
        emptyTF = false;
      }
      // 款式名称
      if (!values.productName) {
        emptyTF = false;
      }

      for (const i in values) {
        // 产品材质/重量/价格遍历
        if (i.indexOf('proMaxWeight_') >= 0) {
          const indexNum = i.split('_')[1];
          // 材质
          if (!values[`materId_${indexNum}`]) {
            emptyTF = false;
          }
          // 批发最大值
          if (!values[`proMaxPrice_${indexNum}`] || values[`proMaxPrice_${indexNum}`] == 0) {
            emptyTF = false;
          }
          // 批发最小值
          if (!values[`proMinPrice_${indexNum}`] || values[`proMinPrice_${indexNum}`] == 0) {
            emptyTF = false;
          }
          // 克重最大值
          if (!values[`proMaxWeight_${indexNum}`] || values[`proMaxWeight_${indexNum}`] == 0) {
            emptyTF = false;
          }
          // 克重最小值
          if (!values[`proMinWeight_${indexNum}`] || values[`proMinWeight_${indexNum}`] == 0) {
            emptyTF = false;
          }
        }
      }

      // 产品图片不能为空
      if (this.state.imgDisplayList.length == 0) {
        emptyTF = false;
      }
      if (!emptyTF) {
        message.error('请先完善上传信息才能提交！');
        return;
      }


      /*
      ** 非空判断结束
      */
      this.handleParams(err, values);
      self.state.productStr.productStatus = 3;// 提交审核

      // console.log('提交参数前');
      // console.log(self.state.productStr.designs[0].designValue);
      // console.log(self.state.productStr.designs);

      self.setState({
        loading: true,
      });

      // 材质判断
      if (self.state.productStr.designs[0].designValue == undefined || self.state.productStr.designs[0].designValue == '') {
        delete self.state.productStr.designs[0].designName;
      }

      const paramsTwo = app.$v.deleteEmptykey(self.state.productStr);
      // console.log('提交参数后');
      // console.log(paramsTwo);
      // return;
      app.$api.addProductNumber(paramsTwo).then((res) => {
        message.success(res.msg);
        self.setState({
          loading: false,
        });
        self.context.router.push('/MyFactory/manageFinishProduct');
      }).catch((err) => {
        self.setState({
          loading: false,
        });
      });
    });
  }

  // 修改适合人群
  changeCrowd(e) {
    let loverTf = false;
    const { crowdList } = this.state;
    crowdList.forEach((item) => {
      if (e === item.id && item.commonName == '情侣组合') {
        this.clearSize();
        loverTf = true;
      }
    });
    this.setState({
      loverTf,
    });
  }

  // 初始化尺寸
  clearSize() {
    this.setState({
      proSizeList: [{ value: '' }],
      proBoySizeList: [{ value: '' }],
      proGirlSizeList: [{ value: '' }],
    });
  }

      // 删除sku
  delSkuFun=(indexNum) => {
    const self = this;
    if (self.state.proMaterList.length > 1) {
      self.state.proMaterList.splice(indexNum, 1);
      self.setState({
        proMaterList: self.state.proMaterList,
      });
    } else {
      message.error('产品材质不能全删！');
    }
  }
  render() {
    const self = this;
    const { getFieldDecorator } = self.props.form;
    const plugins = this.getPlugins();
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
    };
    const formItemTwo = {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={styles.UploadPro}>
        <div className={styles.titTopTwo} onClick={this.returnPro.bind(this)}>
          <Icon type="left" /> 返回
        </div>
        <div className={styles.hr} />
        <div style={{ marginTop: '26px' }}>
          <Form onSubmit={this.newProSubmit}>
            <FormItem {...formItemLayout} label="产品类别" style={{ marginBottom: 30 }}>
              {getFieldDecorator('categoryId', {
                rules: [
                  {
                    required: true,
                    message: '请选择产品类别',
                  },
                ],
              })(
                <Select placeholder="请选择产品类别" style={{ width: 247 }} size="large">
                  {this.state.categoryList.map(data => (
                    <Option value={data.id} key={data.id}>
                      {data.commonName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="适合人群" style={{ marginBottom: 32 }}>
              {getFieldDecorator('crowdId', {
                rules: [
                  {
                    required: true,
                    message: '请选择适合人群',
                  },
                ],
              })(
                <Select showSearch placeholder="请选择适合人群" style={{ width: 247 }} onChange={this.changeCrowd.bind(this)}>
                  {self.state.crowdList.map((data, ind) => (
                    <Option value={data.id} key={data.id}>
                      {data.commonName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="款式名称" style={{ marginBottom: 33 }}>
              {getFieldDecorator('productName', {
                initialValue: self.state.message,
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
                initialValue: self.state.productStr.productDescription,
              })(<TextArea placeholder="宝石描述" style={{ width: 616, height: 173, marginBottom: 46 }} />)}
            </FormItem>

            {!this.state.loverTf ? (
              <FormItem {...formItemTwo} label="款式尺寸">
                {self.state.proSizeList.map((data, ind) => (
                  <Col span={2} key={ind} style={{ marginRight: -8 }}>
                    {getFieldDecorator(`defsize_${ind}`, {
                      initialValue: data.value,
                    })(<Input placeholder="" style={{ width: 37, height: 37 }} />)}
                    <span className={styles.imgDelTwo} onClick={() => self.delSize(ind)}>
                       —
                    </span>
                  </Col>
                ))}
                <span className="cursor" onClick={this.addProSize.bind(this)} style={{ color: 'red' }}>
                  添加尺寸+
                </span>
              </FormItem>
            ) : (
              <div>
                <FormItem {...formItemTwo} label="男士尺寸" style={{ marginBottom: 12 }}>
                  {self.state.proBoySizeList.map((data, ind) => (
                    <Col span={2} key={ind} style={{ marginRight: -8 }}>
                      {getFieldDecorator(`boysize_${ind}`, {
                        initialValue: data.value,
                      })(<Input placeholder="" style={{ width: 37, height: 37 }} />)}
                      <span className={styles.imgDelTwo} onClick={() => self.delSizeDou(self.state.proBoySizeList, ind)}>
                        —
                      </span>
                    </Col>
                  ))}
                  <span className="cursor" onClick={this.addBoyProSize.bind(this)} style={{ color: 'red' }}>
                    添加尺寸+
                  </span>
                </FormItem>
                <FormItem {...formItemTwo} label="女士尺寸">
                  {self.state.proGirlSizeList.map((data, ind) => (
                    <Col span={2} key={ind} style={{ marginRight: -8 }}>
                      {getFieldDecorator(`girlsize_${ind}`, {
                        initialValue: data.value,
                      })(<Input placeholder="" style={{ width: 37, height: 37 }} />)}
                      <span className={styles.imgDelTwo} onClick={() => self.delSizeDou(self.state.proBoySizeList, ind)}>
                        —
                      </span>
                    </Col>
                  ))}
                  <span className="cursor" onClick={this.addGirlProSize.bind(this)} style={{ color: 'red' }}>
                    添加尺寸+
                  </span>
                </FormItem>{' '}
              </div>
            )}

            <div className={styles.hr} />
            <div>
              <div style={{ marginTop: 40 }}>
                <Row className={styles.margin10}>
                  <Col className={`${styles.titTopTwo} dot`} span={9}>
                    产品材质/重量/价格
                  </Col>
                  {/* <Col span={14} className={`${styles.textRight} ${styles.flexAlign}`}>
                    <Col span={6} className={styles.textRight}>
                      宝石价格：
                    </Col>
                    <Col span={6} className={styles.textRight} style={{ marginLeft: 6 }}>
                      {getFieldDecorator('stonePrice', {
                        initialValue: self.state.productStr.stonePrice,
                      })(<InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} className={styles.input140} min={0} />)}
                    </Col>
                    <Col span={6} className={styles.textRight}>
                      生产工费:
                    </Col>
                    <Col span={6} className={styles.textRight} style={{ marginLeft: 8 }}>
                      {getFieldDecorator('wagePrice', {
                        initialValue: self.state.productStr.wagePrice,
                      })(<InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} className={styles.input140} min={0} />)}
                    </Col>
                  </Col> */}
                </Row>
                <div className={styles.tabThree}>
                  <Table dataSource={self.state.proMaterList} {...tableState}>
                    <Column
                      title={
                        <div style={{ display: 'table', margin: '0 auto' }} className="dot">
                          {' '}
                          材质
                        </div>
                      }
                      dataIndex="weight"
                      key="weight"
                      align="center"
                      render={(text, record, ind) => (
                        <span>
                          {getFieldDecorator(`materId_${ind}`, {})(
                            <Select style={{ width: 120, margin: '0 auto' }}>
                              {self.state.materList.map(data => (
                                <Option value={data.id} key={data.id}>
                                  {data.textureName}
                                </Option>
                              ))}
                            </Select>,
                          )}
                        </span>
                      )}
                    />
                    <Column
                      title={
                        <div style={{ display: 'table', margin: '0 auto' }} className="dot">
                          克重/g
                        </div>
                      }
                      dataIndex="value"
                      key="value"
                      align="center"
                      render={(text, record, ind) => (
                        <div className={styles.txtCenter}>
                          {getFieldDecorator(`proMinWeight_${ind}`, {
                            initialValue: record.weight,
                          })(<InputNumber min={0} className={styles.width60} />)}
                          ~
                          {getFieldDecorator(`proMaxWeight_${ind}`, {
                            initialValue: record.weight,
                          })(<InputNumber min={0} className={styles.width60} />)}
                        </div>
                      )}
                    />
                    <Column
                      title={
                        <div style={{ display: 'table', margin: '0 auto' }} className="dot">
                          批发价/￥
                        </div>
                      }
                      key="priceOne"
                      align="center"
                      render={(text, record, ind) => (
                        <div className={styles.txtCenter}>
                          {getFieldDecorator(`proMinPrice_${ind}`, {
                            initialValue: record.price,
                          })(<InputNumber min={0} className={styles.width60} />)}
                          ~
                          {getFieldDecorator(`proMaxPrice_${ind}`, {
                            initialValue: record.price,
                          })(<InputNumber min={0} className={styles.width60} />)}
                        </div>
                      )}
                    />
                    <Column
                      title=""
                      key="delSku"
                      render={(text, record, ind) => (
                        <span className={styles.delSkuTxt} onClick={() => self.delSkuFun(ind)}>
                            X
                        </span>
                      )}
                    />
                  </Table>
                  <div className={styles.margin10}>
                    <span className="addTxtRed" onClick={this.addProMater.bind(this)}>
                      增加材质+
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.hr} style={{ margin: '30px 0 40px 0' }} />
            <div className={styles.titTopTwo}>上传平面图</div>
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
            <div className={styles.titTopTwo}>上传3D图包（可选）</div>
            <div>
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
                </Row>
              </div>

              <div>
                <Row>
                  <Col span={24}>
                    <div className={styles.hr} style={{ margin: '30px 0 40px 0' }} />
                    <div className={styles.contant}>
                      <div>
                        <div className={styles.titTopTwo}>上传图文详情</div>
                        <div style={{ paddingLeft: 70 }}>
                          <Editor
                            ref="editor"
                            icons={app.$tool.icons}
                            value={self.state.content}
                            defaultValue={self.state.content}
                            onChange={event => self.handleChange(event, self)}
                            style={{ width: 750, minHeight: 500 }}
                            plugins={plugins}
                        />
                        </div>
                      </div>
                    </div>
                    <div className={styles.textRight} style={{ marginTop: 40, marginRight: 60 }}>
                      <Button className="bottonPublic" type="primary" loading={this.state.saveLoading} onClick={this.saveData.bind(this)} style={{ marginRight: 20 }} loading={this.state.loading}>
                        保存
                      </Button>
                      <Button className="bottonPublic" type="primary" loading={this.state.saveLoading} htmlType="submit" loading={this.state.loading}>
                        提交审核
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>

            </div>
          </Form>
        </div>
      </div>
    );
  }
}
UploadPro.contextTypes = {
  router: PropTypes.object.isRequired,
};

const UploadProFrom = Form.create()(UploadPro);
export default UploadProFrom;
