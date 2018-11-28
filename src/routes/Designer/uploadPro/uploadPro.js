import React from 'react';
import { connect } from 'dva';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import Editor from 'react-umeditor';
import styles from './uploadPro.less';
import app from 'app';

import { Radio, Button, Row, Col, Table, Input, Select, message, InputNumber, Form, Icon } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Column } = Table; // 表格属性
const proListData = [{}];
const tableState = {
  bordered: false,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
};
class UploadPro extends React.Component {
  constructor(props) {
    super(props);
    // 初始化参数
    this.state = {
      categoryList: [], // 产品分类接口数据
      categoryValue: '', // 产品分类选中信息
      crowdList: [], // 适合人群接口数据
      crowdValue: '', // 适合人群选中信息
      seriesList: [], // 产品系列列表
      seriesSelect: '1', // 选择产品系列无系列1，有系列为0
      seriesSelectNum: '0', // 选择产品系列无系列0，修改为1，新增系列为2
      seriesAddId: '',
      seriesId: '', // 选择产品系列id
      seriesName: '未选择', // 产品系列名称
      seriesDes: '未选择', // 产品系列注释
      materList: [], // 材质接口数据
      imgDisplayList: [], // 图片示意图
      jpgThreeDUrl: '', // 3D图包url
      jpgThreeDId: '', // 3D图包id
      figureImageId: '',
      message: '',
      proSizeList: [{ value: '' }], // 产品款式尺寸
      proBoySizeList: [{ value: '' }], // 产品款式尺寸
      proGirlSizeList: [{ value: '' }], // 产品款式尺寸
      proMaterList: [{ weight: 0, price: 0 }], // 产品材质

      productStr: {
        // 传过去
        productName: '', // 产品名称
        productDescription: '', // 宝石描述
        categoryId: 0, // 分类ID
        categoryName: '', // 分类名称
        crowdId: 0, // 适合人群ID
        crowdName: '', // 适合人群名称
        details: '', // 图文详情
        stonePrice: '', // 宝石价格
        wagePrice: '', // 生产工费价格
        combinationPrice: 0, // 批发价格，默认第一个
        productStatus: 3, // 上架状态 0 暂存 1 上架 2 下架 3 发布审核
        auditStatus: 0, // 审核状态 0 不需要审核 1 审核中 2 已审核 3 审核通过 4 驳回
        // figureFrom: {
        //   figureImageId: 0, // 3D图包包的ID
        // },
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
      defaultSelect: '请选择',
      createSeriesLoading: false, // 创建系列loading
      saveLoading: false, // 创建产品loading
    };
  }

  // 修改或新增系列
  modifySeries(elem, thiselem) {
    if (elem == '2') {
      thiselem.setState({
        seriesId: '',
      });
    }
    thiselem.setState({
      seriesSelectNum: elem,
    });
  }

  // 改变select系列
  changeSeries(e, thiselem) {
    // console.log(e);
    // console.log(thiselem);
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
  // 修改系列
  editSeries(thiselem) {
    const { seriesList } = thiselem.state;
    thiselem.setState({ createSeriesLoading: true });
    thiselem.props.form.validateFields((err, values) => {
      let flag = false;
      console.log(values);
      seriesList.forEach((item) => {
        console.log(item);
        if (values.seriesName === item.seriecsName && values.seriesId != item.id) {
          flag = true;
        }
      });

      if (flag) {
        thiselem.setState({ createSeriesLoading: false });
        message.error('不能创建重复的系列');
        return;
      }
      const tempObj = { id: thiselem.state.seriesId, seriecsName: values.seriesName, seriecsDescription: values.seriesDes };
      const params = { seriecsStr: JSON.stringify(tempObj) };
      // // 修改系列
      app.$api.updateSeriecsNumder(params).then((res) => {
        app.$api.selectSeriecsListByOperateId().then((res) => {
          thiselem.setState({
            seriesId: values.seriesId,
            cname: values.seriesName,
            seriesSelect: '0',
            seriesSelectNum: '0',
            createSeriesLoading: false,
          }), () => {
            thiselem.componentDidMount();
          };
        }).catch((err) => {
          thiselem.setState({ createSeriesLoading: false });
        });

      });
    });
  }
  // 增加新系列
  addseries=() => {
    const self = this;
    const { seriesList } = self.state;
    self.props.form.validateFields((err, values) => {
      let flag = false;
      seriesList.forEach((item) => {
        if (values.seriesName === item.seriecsName) {
          flag = true;
        }
      });

      if (flag) {
        self.setState({ createSeriesLoading: false });
        message.error('不能创建重复的系列');
        return;
      }

      const tempObj = { seriecsName: values.seriesName, seriecsDescription: values.seriesDes };
      const params = { seriecsStr: JSON.stringify(tempObj) };
      // 新增系列
      self.setState({ createSeriesLoading: true });
      app.$api.addSeriecsNumder(params).then((res) => {
        self.setState({ createSeriesLoading: false });
        self.componentDidMount();
        app.$api.selectSeriecsListByOperateId().then((res) => {
          const length = res.data.length - 1;
          self.setState({
            seriesList: res.data,
          }, () => {
            self.setState({
              seriesAddId: res.data[length].seriecsName,
              seriesId: res.data[length].id,
              cname: res.data[length].seriecsName,
              seriesSelect: '0',
              seriesSelectNum: '0',
            });
          });

        });
      }).catch((err) => {
        self.setState({ createSeriesLoading: false });
      });
    });
  }

  // 修改适合人群
  changeCrowd(e) {
    let loverTf = false;
    const { crowdList } = this.state;
    crowdList.forEach((item) => {
      if (e === item.id && item.commonName === '情侣组合') {
        loverTf = true;
      }
    });
    this.setState({
      loverTf,
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
  componentDidMount() {
    // 查询系列分类数据信息
    app.$api.selectSeriecsListByOperateId().then((res) => {
      if (res.data) {
        this.setState({
          seriesList: res.data,
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

  handleChange(content, thiselem) {
    thiselem.setState({
      content,
    });
  }

  // 平面产品图片上传
  imgUpload(thiselem) {
    thiselem.refs.imgInput.click();
  }
  // 平面产品图片删除
  delImg = (proId, ind) => {
    const self = this;
    // console.log('删除');
    // console.log(self.state.imgDisplayList);
    self.state.imgDisplayList.splice(ind, 1);
    self.setState({
      imgDisplayList: self.state.imgDisplayList,
    });
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
      });
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
  // 选择是新增系列还是选择原来系统
  clickSeries=(elem) => {
    if (elem == '1') {
      this.setState({
        seriesId: '',
        seriesSelect: elem,
      });
    } else {
      this.setState({
        seriesSelect: elem,
      });
    }
  }

  // 平面产品图片上传
  rarUpload(thiselem) {
    // console.log(thiselem);
    // console.log(self.refs.rarInput)
    thiselem.refs.rarInput.click();
    // console.log(self);
  }
  // 平面产品图片删除
  delRar(thiselem, elem) {
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
      thiselem.setState(() => ({
        jpgThreeDId: res.data.imageId,
        jpgThreeDUrl: res.data.imageUrl,
      }), () => {
        thiselem.refs.rarInput.value = '';
      });
    });
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
  addProMater = () => {
    // console.log(this.state.proMaterList);
    this.state.proMaterList.push({ weight: 0, price: 0 });
    this.setState({
      proMaterList: this.state.proMaterList,
    });
  }
  // 页眉返回产品管理
  returnPro(thiselem) {
    thiselem.context.router.push('/designer/designerFinishProduct');
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
        const referencePrice = values[`referencePrice_${indexNum}`];
        // const proMaxPrice = values[`proMaxPrice_${indexNum}`];
        const materId = values[`materId_${indexNum}`];
        proMaterListTwo.push({
          textureId: materId,
          textureName: '',
          textureWeight: `${proMinWeight}-${proMaxWeight}`,
          texturePrice: `${proMinPrice}`,
          reference_price: `${referencePrice}`,
        });
      }
    }

    self.state.productStr.categoryId = values.categoryId; // 分类ID
    self.state.productStr.crowdId = values.crowdId; // 适合人群ID
    self.state.productStr.productName = values.productName; // 款式名称
    self.state.productStr.productDescription = values.productDescription; // 宝石描述
    self.state.productStr.seriecsId = self.state.seriesId ? self.state.seriesId : ''; // 选择系列ID

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

      self.state.productStr.productStatus = 0; // 保存
      // console.log('提交数据：');
      // console.log(self.state.productStr);
      const params = app.$v.deleteEmptykey(self.state.productStr);

      app.$api.addDesignProductNumber(params).then((res) => {
        self.setState({
          saveLoading: false,
        });
        message.success(res.msg);
        this.context.router.push('/designer/designerFinishProduct');
      }).catch((err) => {
        self.setState({
          saveLoading: false,
        });
      });
    });
  }

  newProSubmit = (e) => {
    const self = this;
    self.setState({
      saveLoading: true,
    });
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let emptyTF = true; // 必填提示框判断

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

      // 判断系列
      if (this.state.seriesSelect === '0') {
        if (!this.state.seriesId) {
          emptyTF = false;
        }
      }

      for (const i in values) {
        // 产品材质/重量/价格遍历
        if (i.indexOf('proMaxWeight_') >= 0) {
          const indexNum = i.split('_')[1];
          // console.log(values[`materId_${indexNum}`]);
          // 材质
          if (!values[`materId_${indexNum}`]) {
            emptyTF = false;
          }
          // 批发最大值
          // if (!values[`proMaxPrice_${indexNum}`] || values[`proMaxPrice_${indexNum}`] == 0) {
          //   emptyTF = false;
          // }
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
      self.handleParams(err, values);
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
          const materId = values[`materId_${indexNum}`];
          const referencePrice = values[`referencePrice_${indexNum}`];
          proMaterListTwo.push({
            textureId: materId,
            textureName: '',
            textureWeight: `${proMinWeight}-${proMaxWeight}`,
            texturePrice: `${proMinPrice}`,
            reference_price: `${referencePrice}`,
          });
        }
      }
      self.state.productStr.categoryId = values.categoryId; // 分类ID
      self.state.productStr.crowdId = values.crowdId; // 适合人群ID
      self.state.productStr.productName = values.productName; // 款式名称
      self.state.productStr.productDescription = values.productDescription; // 宝石描述
      // console.log('全部数据');
      // console.log(self.state.productStr);
      // console.log('格式化');
      // console.log(proSizeList);
      // const newProSizeList = app.$v.isEmptyArray(proSizeList);
      // console.log(newProSizeList);

      // if (newProSizeList.length != 0) {
      //   // console.log('有数据');
      //   self.state.productStr.designs[0].designValue = newProSizeList.join(','); // 款式尺寸
      // } else {
      //   // self.state.productStr.designs[0].designValue = '';
      //   // console.log('没数据');
      //   delete self.state.productStr.designs;
      // }
      // self.state.productStr.designs[0].designValue = proSizeList.join(','); // 款式尺寸
      self.state.productStr.stonePrice = values.stonePrice;// +宝石价格
      self.state.productStr.wagePrice = values.wagePrice;// 生产工费
      self.state.productStr.imageIdFroms = this.state.imgDisplayList;// 生产工费
      self.state.productStr.textures = proMaterListTwo;// 产品材质/重量/价格遍历數組
      self.state.productStr.seriecsId = self.state.seriesId;// 选择系列ID
      self.state.productStr.details = self.state.content;// 图文详情
      if (self.state.jpgThreeDUrl != '') {
        self.state.productStr.figureFrom = { figureImageId: self.state.jpgThreeDId };// 3D图包ID
      } else {
        self.state.productStr.figureFrom = { figureImageId: '' };// 3D图包ID
      }
      self.state.productStr.productStatus = 3;// 提交审核
      // const params = { productStr: JSON.stringify(self.state.productStr) };
      // console.log('aaa:');
      // console.log(self.state.productStr);
      const params = app.$v.deleteEmptykey(self.state.productStr);
      app.$api.addDesignProductNumber(params).then((res) => {
        self.setState({
          saveLoading: false,
        });
        message.success(res.msg);
        this.context.router.push('/designer/designerFinishProduct');
      }).catch((err) => {
        self.setState({
          saveLoading: false,
        });
      });
    });
  }

  handleChange(content, thiselem) {
    thiselem.setState({
      content,
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
      <div className={`${styles.UploadPro} aa`}>
        <div className={styles.backPage} onClick={() => self.returnPro(self)}> <Icon type="left" /> 返回</div>
        <div className={styles.hr} />
        <Form onSubmit={this.newProSubmit}>
          <div className={styles.seriesSelectDiv}>
            <div >
              <img className="cursor" src={self.state.seriesSelect == '1' ? '/images/designer/redioTwo.jpg' : '/images/designer/redioOne.jpg'} onClick={() => self.clickSeries('1')} />
              无系列
              <span className={styles.seriesSubTxt}>直接上传不添加系列</span>
            </div>
            <div >
              <img className="cursor" src={self.state.seriesSelect == '0' ? '/images/designer/redioTwo.jpg' : '/images/designer/redioOne.jpg'} onClick={() => self.clickSeries('0')} />
              选择系列
              {self.state.seriesSelect == '0' ?
                (getFieldDecorator('seriesId', {
                  initialValue: self.state.seriesAddId,
                })(
                  <Select placeholder="请输入系列" className={styles.seriesSelect} showSearch onChange={event => self.changeSeries(event, self)} size="large">
                    {this.state.seriesList.map(data => (
                      <Option value={data.id} key={data.id} >{data.seriecsName}</Option>
                    ))}
                  </Select>,
                ))
              : ''
              }
            </div>
          </div>

          {self.state.seriesSelect == '0' ? (
            <div >
              <div className={styles.hr} />
              <div className={styles.seriesDiv}>
                <div>
                  <span
                    className={`${styles.seriesRedTxtOne} cursor`}
                    onClick={() => {
                      self.modifySeries('1', self);
                    }}
                  >
                    修改系列
                  </span>
                  <span
                    className={`${styles.seriesRedTxtTwo} cursor`}
                    onClick={() => {
                      self.modifySeries('2', self);
                    }}
                  >
                    创建新系列
                  </span>
                </div>
                <div className={styles.seriesItem}>
                  {self.state.seriesSelectNum == '0' ? (
                    <div>
                      <div >
                        <b>系列名称：</b>
                        {self.state.seriesName}
                      </div>
                      <div className="mt10">
                        <b>系列说明：</b>
                        {self.state.seriesDes}
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  {self.state.seriesSelectNum == '1' ? (
                    <div>
                      <div className="mt10">
                        {getFieldDecorator('seriesName', {
                          initialValue: self.state.seriesName,
                        })(<Input placeholder="请输入系列名称" />)}
                      </div>
                      <div className="mt10 mb20">
                        {getFieldDecorator('seriesDes', {
                          initialValue: self.state.seriesDes,
                        })(<TextArea rows={4} />)}
                      </div>
                      <div className={styles.bottonDiv}>
                        <Button className="bottonPublic" type="primary" loading={this.state.createSeriesLoading} onClick={() => self.editSeries(self)}>
                          修改
                        </Button>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  {self.state.seriesSelectNum == '2' ? (
                    <div>
                      <div className="mt10">{getFieldDecorator('seriesName', {})(<Input placeholder="请输入系列名称" />)}</div>
                      <div className="mt10 mb20">{getFieldDecorator('seriesDes', {})(<TextArea rows={4} style={{ height: 145 }} />)} <span className={styles.textdes}>可输入200字</span></div>
                      <div className={styles.bottonDiv}>
                        <Button className="bottonPublic" type="primary" loading={this.state.createSeriesLoading} onClick={self.addseries}>
                          创建
                        </Button>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          ) : (
            ''
          )}

          {/* todo */}
          <div className={styles.hr} />
          <div style={{ marginTop: '60px' }}>
            <FormItem {...formItemLayout} label="产品类别" style={{ marginBottom: 25 }}>
              {getFieldDecorator('categoryId', {
                rules: [
                  {
                    required: true,
                    message: '请选择产品类别',
                  },
                ],
              })(
                <Select placeholder="请选择产品类别" style={{ width: 211 }}>
                  {this.state.categoryList.map(data => (
                    <Option value={data.id} key={data.id}>
                      {data.commonName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="适合人群" style={{ marginBottom: 25 }}>
              {getFieldDecorator('crowdId', {
                rules: [
                  {
                    required: true,
                    message: '请选择合适人群',
                  },
                ],
              })(
                <Select showSearch placeholder="请选择适合人群" style={{ width: 211 }} onChange={this.changeCrowd.bind(this)}>
                  {self.state.crowdList.map((data, ind) => (
                    <Option value={data.id} key={data.id}>
                      {data.commonName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="款式名称" style={{ marginBottom: 29 }}>
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
              })(<TextArea placeholder="宝石描述" style={{ width: 616, height: 173, marginBottom: 16 }} />)}
            </FormItem>

            {!this.state.loverTf ? (
              <FormItem {...formItemTwo} label="款式尺寸">
                {self.state.proSizeList.map((data, ind) => (
                  <span>
                    <Col span={2} key={ind} style={{ marginRight: -8 }}>
                      {getFieldDecorator(`defsize_${ind}`, {
                        initialValue: data.value,
                      })(<Input placeholder="" style={{ width: 37, height: 37 }} />)}
                      <span className={styles.imgDelTwo} onClick={() => self.delSize(ind)}>
                        —
                      </span>
                    </Col>

                  </span>
                ))}
                <span className="cursor" style={{ color: 'red' }} onClick={this.addProSize.bind(this)}>
                  添加尺寸+
                </span>
              </FormItem>
            ) : (
              <div>
                <FormItem {...formItemTwo} label="男士尺寸">
                  {self.state.proBoySizeList.map((data, ind) => (
                    <Col span={2} key={ind} style={{ marginRight: 16 }}>
                      {getFieldDecorator(`boysize_${ind}`, {
                        initialValue: data.value,
                      })(<Input placeholder="" />)}
                      <span className={styles.imgDelTwo} onClick={() => self.delSizeDou(self.state.proBoySizeList, ind)}>
                        —
                      </span>
                    </Col>
                  ))}
                  <span className="cursor" onClick={this.addBoyProSize.bind(this)}>
                    添加尺寸+
                  </span>
                </FormItem>
                <FormItem {...formItemTwo} label="女士尺寸">
                  {self.state.proGirlSizeList.map((data, ind) => (
                    <Col span={2} key={ind} style={{ marginRight: 16 }}>
                      {getFieldDecorator(`girlsize_${ind}`, {
                        initialValue: data.value,
                      })(<Input placeholder="" />)}
                      <span className={styles.imgDelTwo} onClick={() => self.delSizeDou(self.state.proGirlSizeList, ind)}>
                        —
                      </span>
                    </Col>
                  ))}
                  <span className="cursor" onClick={this.addGirlProSize.bind(this)}>
                    添加尺寸+
                  </span>
                </FormItem>{' '}
              </div>
            )}

            <div className={styles.hr} />
            <div>
              <div style={{ marginTop: 40 }}>
                <Row className={styles.margin10} justify="space-between">
                  <Col className="dot" span={8} style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
                    产品材质/重量/价格
                  </Col>

                  <Col span={12} offset={4} className={`${styles.textRight} ${styles.flexAlign}`} style={{ display: 'none' }}>
                    <Col span={4} className={styles.textRight}>
                      宝石价格：
                    </Col>
                    <Col span={6} className={styles.textRight} style={{ marginRight: 14 }}>
                      {getFieldDecorator('stonePrice', {
                        initialValue: self.state.productStr.stonePrice,
                      })(<InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} className={styles.input140} min={0} />)}
                    </Col>
                    <Col span={4} className={styles.textRight}>
                      生产工费:
                    </Col>
                    <Col span={6} className={styles.textRight} style={{}}>
                      {getFieldDecorator('wagePrice', {
                        initialValue: self.state.productStr.wagePrice,
                      })(<InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} className={styles.input140} min={0} />)}
                    </Col>
                  </Col>
                </Row>
                <div style={{ paddingLeft: 30, paddingRight: 30 }} className={styles.tabOne}>
                  <Table style={{ borderBottom: 'none', marginTop: '20px' }} dataSource={self.state.proMaterList} {...tableState}>
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
                          })(<InputNumber min={0} className={styles.width98} />)}
                          ~
                          {getFieldDecorator(`proMaxWeight_${ind}`, {
                            initialValue: record.weight,
                          })(<InputNumber min={0} className={styles.width98} />)}
                        </div>
                      )}
                    />
                    <Column
                      title={
                        <div style={{ display: 'table', margin: '0 auto', textAlign: 'center' }} className="dot">
                          预估成本价/￥
                        </div>
                      }
                      key="referencePrice"
                      align="center"
                      render={(text, record, ind) => (
                        <div className={styles.txtCenter}>
                          {getFieldDecorator(`referencePrice_${ind}`, {
                            initialValue: '0',
                          })(<InputNumber min={0} className={styles.width98} />)}
                        </div>
                      )}
                    />
                    <Column
                      title={
                        <div style={{ display: 'table', margin: '0 auto', textAlign: 'center' }} className="dot">
                          建议售价/￥
                        </div>
                      }
                      key="priceOne"
                      align="center"
                      render={(text, record, ind) => (
                        <div className={styles.txtCenter}>
                          {getFieldDecorator(`proMinPrice_${ind}`, {
                            initialValue: record.price,
                          })(<InputNumber min={0} className={styles.width98} />)}
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
                  <div className={styles.margin10} style={{ marginTop: 32 }}>
                    <span onClick={this.addProMater} className="addTxtRed">
                      增加材质+
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.hr} style={{ margin: '30px 0 40px 0' }} />
            <div className={'dot mb20'} style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>上传平面图</div>
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
                    <div className="c9 f12" style={{ marginLeft: 12, width: 135 }}>请您上传8张以内格式为png、jpg的图片，图片大小为500KB以内</div>
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
            <div className="mb20" style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>上传3D图包（可选）</div>
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
                        <div style={{ margin: '20px 10px' }} style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>上传图文详情 <span style={{ color: '#666', fontSize: 14 }}>使用图文排版编辑器，上传你的作品详情。</span></div>
                        <div style={{ paddingLeft: 70, marginTop: 20 }}>
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
                    <div className={`${styles.textRight} fend`} style={{ marginTop: 40, marginRight: 60, paddingRight: 74 }}>
                      <Button className="bottonPublic" type="primary" loading={this.state.saveLoading} onClick={this.saveData.bind(this)} style={{ marginRight: 20, width: 154 }}>
                          保存
                        </Button>
                      <Button className="bottonPublic" type="primary" loading={this.state.saveLoading} htmlType="submit" style={{ width: 154 }}>
                          提交审核
                        </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
UploadPro.contextTypes = {
  router: PropTypes.object.isRequired,
};

const UploadProFrom = Form.create()(UploadPro);
export default UploadProFrom;
