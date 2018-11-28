import React from 'react';
import { connect } from 'dva';
import 'antd/dist/antd.css';
import Editor from 'react-umeditor';
import PropTypes from 'prop-types';
import styles from './uploadPro.less';
import app from 'app';

import {
  Radio,
  Button,
  Row,
  Col,
  Table,
  Input,
  Select,
  message,
  InputNumber,
  Form,
  Icon,
  Checkbox,
  Switch,
  Slider,
  Upload,
  Rate,
  Tabs,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Column } = Table; // 表格属性
const TabPane = Tabs.TabPane;
const proListData = [{}];
const tableState = {
  bordered: true,
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
      seriesId: '', // 选择产品系列id
      seriesAddId: '', // 选择产品系列id
      classifyId: '', // 销售类别字段
      classifySaleList: [], // 销售类别销售数据
      classifySkuBigList: [], // 销售类别sku大规格数据
      classifySkuSList: [], // 销售类别sku规格数据
      classifyTxt: '', // 销售类别选择Data
      cname: '未选择', // 产品系列名称
      materList: [], // 材质接口数据
      imgDisplayList: [], // 图片示意图
      message: '',
      proSizeList: [{}], // 产品款式尺寸
      proMaterList: [{ weight: 0, price: 0 }], // 产品材质
      ClassifyPropsList: [], // 品类属性列表
      presetList: [], // 规格选项
      presetListTwo: [], // 对戒规格选项
      presetIndex: '0', // 对戒规格选择index
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
        productStatus: 1, // 上架状态 0 未上架 1 上架 2 下架
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
        content: '', // 富文本默认字段
        modifySeriesTF: false, // 修改系列显示按钮
        tabIndexList: [{}], // 对式tab选择数组
        submitData: [], // 提交数据
        threeDImgData: {}, // 上传返回3D图包数组
        createSeriesLoading: false, // 创建系列loading
        saveLoading: false, // 创建产品loading
      },
    };
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
    app.$api.queryClassifyInfo().then((res) => {
      const tempData = res.data;
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
        // 查询系列据信息
    app.$api.querySeriesDesi().then((res) => {
      this.setState({
        seriesList: res.data,
      });
    });
    // 查询材质数据信息
    app.$api.selectGoldlist().then((res) => {
      this.setState({
        materList: res.data,
      });
    });
  }

  // 平面产品图片上传
  imgUpload(thiselem) {
    thiselem.refs.imgInput.click();
  }
  // 平面产品图片删除
  delImg(ind) {
    console.log('删除图片');
    const self = this;
    console.log(ind);
    console.log(self.state.imgDisplayList);
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
      threeDUrl: false, // 3D的Zip文件地址threeDUrl
      mPicUrl: false, // 3D的显示图片通过oneImageUrl
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
    app.$api.uploadThreeDFile(params).then((res) => {
      // console.log('3d数据');
      // console.log(res.data);
      this.setState(() => ({
        threeDUrl: res.data.threeDUrl,
        mPicUrl: res.data.oneImageUrl,
        threeDImgData: res.data,
      }), () => {
        thiselem.refs.rarInput.value = '';
      });
    });
  }

  // 添加款式尺寸
  addProSize=(ind) => {
    const self = this;
    // console.log(self.state.proSizeList[`${ind}`]);
    self.state.proSizeList[`${ind}`].sizeValue.push({ value: '' });
    self.setState({
      proSizeList: self.state.proSizeList,
    });
  }
  // 增加材质事件
  addProMater = () => {

    if (this.state.classifyTxt == '对戒') {
      // console.log(this.state.presetListTwo);
      const indexNum = this.state.presetIndex;
      this.state.tabIndexList.push(this.state.presetListTwo);
      this.state.submitData.push(this.state.presetListTwo[0]);
      this.setState({
        tabIndexList: this.state.tabIndexList,
      }, () => {
        // console.log(this.state.tabIndexList);
      });
    } else {
      this.state.classifySkuBigList.push(this.state.classifySkuSList);
      this.setState({
        classifySkuBigList: this.state.classifySkuBigList,
      });
    }

  }
  // 页眉返回产品管理
  returnPro(thiselem) {
    thiselem.context.router.push('designer/designerCustomMade');
  }

      // 删除尺寸
  delSize=(sizeData, indexNum) => {
    const self = this;
    if (sizeData.sizeValue.length > 1) {
      sizeData.sizeValue.splice(indexNum, 1);
    } else {
      message.error('款式尺寸不能全删！');

    }
    self.setState({
      proViewDetail: self.state.proViewDetail,
    });
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
    thiselem.setState({
      seriesSelect: '0', // 选择产品系列无系列1，有系列为0
      seriesSelectNum: '0', // 选择产品系列无系列0，修改为1，新增系列为2
      seriesId: e,
    });
    for (let i = 0; i < thiselem.state.seriesList.length; i++) {
      if (thiselem.state.seriesList[i].serieId == e) {
        // console.log(thiselem.state.seriesList[i]);
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
      seriesList.forEach((item) => {
        if (values.cname === item.cname && values.seriesId != item.serieId) {
          flag = true;
        }
      });

      if (flag) {
        thiselem.setState({ createSeriesLoading: false });
        message.error('不能创建重复的系列');
        return;
      }
      // console.log(thiselem.state);
      const params = { serieId: thiselem.state.seriesId, cname: values.cname };
      // 修改系列
      app.$api.updateSerie(params).then((res) => {
        thiselem.setState({
          seriesSelect: '0',
          seriesSelectNum: '0',
        });
        app.$api.querySeriesDesi(params).then((res) => {
          thiselem.setState({
            seriesId: thiselem.state.seriesId,
            cname: values.cname,
            seriesSelect: '0',
            seriesSelectNum: '0',
            createSeriesLoading: false,
          });
        });
        this.componentDidMount();
      }).catch((err) => {
        thiselem.setState({ createSeriesLoading: false });
      });
    });
  }
  // 增加新系列
  addseries(thiselem) {
    const { seriesList } = thiselem.state;
    thiselem.setState({ createSeriesLoading: true });
    thiselem.props.form.validateFields((err, values) => {
      let flag = false;
      seriesList.forEach((item) => {
        if (values.cname === item.cname) {
          flag = true;
        }
      });

      if (flag) {
        thiselem.setState({ createSeriesLoading: false });
        message.error('不能创建重复的系列');
        return;
      }
      const params = {
        cname: values.cname,
        serieDetai: values.serieDetai,
        serieType: 'DESIGNER',
      };
      // 新增系列
      app.$api.createSerie(params).then((res) => {
        // this.componentDidMount();
        thiselem.componentDidMount();
        app.$api.querySeriesDesi(params).then((res) => {
          // console.log('系列数据：');
          // console.log(res.data);
          const length = res.data.length - 1;

          thiselem.setState({
            seriesList: res.data,
          }, () => {
            thiselem.setState({
              seriesAddId: res.data[length].cname,
              seriesId: res.data[length].serieId,
              cname: res.data[length].cname,
              seriesSelect: '0',
              seriesSelectNum: '0',
              createSeriesLoading: false,
            });
          });

        });

      }).catch((err) => {
        thiselem.setState({ createSeriesLoading: false });
      });
    });
  }

    // 选择是新增系列还是选择原来系统
  clickSeries(elem, thiselem) {
    if (elem == 1) {
      thiselem.setState({
        seriesSelect: elem,
        seriesId: '',
      });
    } else {
      thiselem.setState({
        seriesSelect: elem,
      });
    }
  }
  // 改变款式品类
  changeCategory=(e, thiselem) => {
    const self = this;
    const params = { classifyId: e };
    app.$api.queryClassifyProps(params).then((res) => {
      // console.log('产品');
      // console.log(res);
      const classifyList = res.data;
      const classifySaleList = [];
      const classifySkuSList = [];
      self.state.proSizeList = [];
      classifyList.forEach((item) => {
        if (item.propId == 1015 || item.propId == 1016 || item.propId == 1017) {
          // console.log(item);
          self.state.proSizeList.push({
            cname: item.cname,
            propId: item.propId,
            sizeValue: [{ value: '' }],
          });
        }
        if (item.inSale == 'Y') {
          classifySkuSList.push(item);
        } else if (item.inSale == 'N') {
          classifySaleList.push(item);
        }
      });
      // 销售数据
      classifySaleList.forEach((itemX) => {
        if (itemX.isScheduled == 'Y') {
          itemX.presetList = itemX.presetValue.split(',');
        }
      });
      console.log('显示数据');
      console.log(classifySaleList);
      // 产品sku数据列表
      classifySkuSList.forEach((itemY) => {
        if (itemY.isScheduled == 'Y') {
          itemY.presetList = itemY.presetValue.split(',');
        }
      });
      console.log('尺寸');
      console.log(classifySkuSList);
      thiselem.state.categoryList.map((itemK) => {
        if (itemK.classifyId == e) {
          thiselem.state.classifyTxt = itemK.cname;
          if (itemK.cname == '对戒') {
            res.data.forEach((itemP) => {
              if (itemP.cname == '规格') {
                const tempList = [];
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
                // console.log('对戒');
                // console.log(tempList);
                this.setState({
                  presetListTwo: tempList,
                  tabIndexList: [tempList],
                  submitData: [tempList[0]],
                });
              }
            });
          }
        }

      });
      thiselem.setState({
        ClassifyPropsList: res.data,
        classifyId: e,
        classifySaleList,
        classifySkuBigList: [classifySkuSList],
        classifySkuSList,
        classifyTxt: thiselem.state.classifyTxt,
      }, () => {
        console.log('显示数据：');
        console.log(thiselem.state);
      });
    });
  }
  // 修改产品sku数值
  changePresetFun = (e, ind) => {
    const self = this;
    this.state.submitData[ind] = this.state.tabIndexList[ind][e];
    this.setState({
      submitData: this.state.submitData,
    });
  }

  // 添加产品参数
  addPro=(elem) => {
    const self = this;
    self.setState({
      saveLoading: true,
    });
    let skuNullTF = false;
    this.props.form.validateFields((err, values) => {
      const imgDisplayTempList = [];
      this.state.imgDisplayList.forEach((item) => {
        imgDisplayTempList.push(item.imageUrl);
      });
      const manufacturePropsList = [];
      let skusList = [];
      let indexNum = 0;

      // 款式尺寸方法开始
      let sizeList = [];
      const sizeObj = {};
      const sizeObjList = [];
      for (const i in values) {
        // 取销售规格
        if (i.indexOf('propId_') >= 0 && i.split('propId_')[1] != 1015 && i.split('propId_')[1] != 1016 && i.split('propId_')[1] != 1017) {
          manufacturePropsList.push({
            propId: parseInt(i.split('_')[1]),
            propValue: values[i],
          });

        }
        if (i.indexOf('size_') >= 0) {
          sizeList.push(i.split('_')[1]);
          sizeObj[`${i.split('_')[1]}`] = values[i];
        }
        // 取sku规格数组
        if (i.indexOf('minPrice_') >= 0) {
          indexNum++;
        }
      }
      sizeList = app.$v.distinct(sizeList);
      for (const i in values) {
        sizeList.forEach((item) => {
          if (i.split('_')[1] == item && i.indexOf('propId_') == -1) {
            const tempObj = {};
            tempObj[`${item}`] = values[i];
            sizeObjList.push(tempObj);
          }
        });
      }
      const tempObj = {};
      sizeList.forEach((item) => {
        tempObj[item] = [];
        for (const i in sizeObjList) {
          for (const j in sizeObjList[i]) {
            if (item == j) {
              if (sizeObjList[i][j] != '') {
                tempObj[item].push(sizeObjList[i][j]);
              } else {
                // message.error('款式尺寸还有未填，请重新填入提交！');
                // return;
              }
            }
          }
        }
      });
      // 款式尺寸事件结束
      if (this.state.classifyTxt != '对戒') {
        for (let i = 0; i < indexNum; i++) {
          const tempSkuList = [];
          for (const j in values) {
            if (j.indexOf(`skuPropId_${i}`) >= 0) {
              tempSkuList.push({
                propId: parseInt(j.split('_')[2]),
                propValue: values[j],
              });
            }
          }
          skusList.push({
            minPrice: values[`minPrice_${i}`],
            futurePrice: values[`futurePrice_${i}`],
            skuProps: tempSkuList,
          });
        }
      } else {


        // console.log('对戒');
        // console.log(values);
        // console.log(values.minDouPrice_);
        skusList = [];
        // console.log(self.state.submitData);
        for (let indexThree = 0; indexThree < self.state.submitData.length; indexThree++) {
          const jelem = self.state.submitData[indexThree];
          jelem.minPrice = values[`minDouPrice_${indexThree}_${jelem.name}`];
          if (!values[`minDouPrice_${indexThree}_${jelem.name}`]) {
            // message.error('sku规格和建议售价为必填，请重新填入提交！');
            skuNullTF = true;
          }
          const tempObj = [{
            cname: '规格',
            propId: 1006,
            propValue: jelem.name,
          }];
          for (let i = 0; i < jelem.value[0].length; i++) {
            const kelem = jelem.value[0][i];
            // if (!kelem.txtValue) {
            //   // message.error('sku规格和建议售价为必填，请重新填入提交！');
            //   skuNullTF = true
            // }
            tempObj.push({
              cname: kelem.cname,
              propId: kelem.propId,
              propValue: kelem.txtValue,
            });
          }
          skusList.push({
            minPrice: values[`minDouPrice_${indexThree}_${jelem.name}`],
            futurePrice: values[`futureDouPrice_${indexThree}_${jelem.name}`],
            cname: jelem.name,
            skuProps: tempObj,
          });
        }

      }

      for (const i in tempObj) {

        manufacturePropsList.push({
          propId: i,
          propValue: tempObj[i].join(','),
        });
      }

      const params = {
        serieId: this.state.seriesId ? this.state.seriesId : '',
        classifyId: this.state.classifyId,
        productName: values.productName,
        productDetail: values.productDescription,
        picUrl: imgDisplayTempList.join(','),
        threeDUrl: this.state.threeDUrl ? this.state.threeDUrl : '',
        mPicUrl: this.state.mPicUrl ? this.state.mPicUrl : '',
        // imageId: this.state.threeDImgData.imageId ? this.state.threeDImgData.imageId:null,
        designer: 'Y',
        manufactureProps: JSON.stringify(manufacturePropsList),
        skus: JSON.stringify(skusList),
      };
      if (this.state.threeDImgData) {
        params.imageId = this.state.threeDImgData.imageId;
      }
      if (elem == '1') {
        params.num = 1;
      }
      // console.log(params);
      if (skuNullTF) {
        self.setState({
          saveLoading: false,
        });
        message.error('sku规格和建议售价为必填，请重新填入提交！');
        return false;
      } else {
        app.$api.createProduct(params).then((res) => {
          self.setState({
            saveLoading: false,
          });
          message.success(res.msg);
          this.context.router.push('/designer/designerCustomMade');
        });
      }

    });
  }

  deleSize = (index) => {
    // console.log('删除');
    // console.log(index);
    // console.log(this.state.classifySkuBigList);
    const newArr = this.state.classifySkuBigList.splice(index, 1);
    // console.log(this.state.classifySkuBigList);
    this.setState({
      classifySkuBigList: [...this.state.classifySkuBigList],
    });

  }

  deleGroup = (index) => {
    // console.log('删除组合');
    // console.log(index);
    this.state.presetListTwo[0].value.splice(index, 1);
    // console.log(this.state.presetListTwo);
    this.setState({
      presetListTwo: [...this.state.presetListTwo],
    });
  }


  // 修改輸入框
  skuChange=(e, indexNum, indexTwo, item) => {
    const self = this;
    const subData = JSON.parse(JSON.stringify(self.state.submitData[indexNum]));
    subData.value[0].forEach((ielem) => {
      if (ielem.cname == item) {
        ielem.txtValue = e.target.value;
      }
    });
    self.state.submitData[indexNum] = subData;
    self.setState({
      submitData: self.state.submitData,
    });

    // console.log(self.state.submitData);
  }
    // 修改下拉框属性
  skuSelectChange=(e, indexNum, indexTwo, item) => {
    const self = this;
    const subData = JSON.parse(JSON.stringify(self.state.submitData[indexNum]));
    subData.value[0].forEach((ielem) => {
      // console.log(ielem);
      if (ielem.cname == item) {
        ielem.txtValue = e;
      }
    });
    self.state.submitData[indexNum] = subData;
    self.setState({
      submitData: self.state.submitData,
    });

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
    return (
      <div className={styles.UploadPro}>
        <div onClick={() => self.returnPro(self)}> ＜返回</div>
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
                (getFieldDecorator('seriesId', {
                  initialValue: self.state.seriesAddId,
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
                  : ''
                }
                <span className={styles.seriesRedTxtTwo} onClick={() => { self.modifySeries('2', self); }}>创建新系列</span>
              </div>
              <div>
                {self.state.seriesSelectNum == '0' ?
                  <div>
                    <div><b>系列名称：</b>{self.state.cname}</div>
                  </div> : ''}
                {self.state.seriesSelectNum == '1' ?
                  <div>
                    <div>
                      {getFieldDecorator('cname', {
                        initialValue: self.state.cname,
                      })(<Input placeholder="请输入系列名称" style={{ width: 300 }} />)}
                    </div>
                    <div>
                      {getFieldDecorator('serieDetai', {
                      })(<TextArea rows={4} placeholder="请输入系列描述" className={styles.textA} />)}
                    </div>可输入200字
                    <div className={styles.bottonDiv}>
                      <Button className="bottonPublic" loading={this.state.createSeriesLoading} type="primary" onClick={() => self.editSeries(self)}>修改</Button>
                    </div>
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
                    <div className={styles.bottonDiv}>
                      <Button className="bottonPublic" loading={this.state.createSeriesLoading} type="primary" onClick={() => self.addseries(self)}>创建</Button>
                    </div>
                  </div> : ''}
              </div>
            </div>
          </div>
              :
              ''
          }
        <div className={styles.hr} />
        <div>
          <Form>
            <FormItem {...formItemLayout} label="款式品类" className={styles.forItemDiv}>
              {getFieldDecorator('categoryId', {
                rules: [
                  {
                    required: true,
                    message: '请选择款式品类',
                  },
                ],
              })(
                <Select placeholder="请选择款式品类" style={{ width: 211 }} showSearch onChange={event => self.changeCategory(event, self)}>
                  {this.state.categoryList.map(data => (
                    <Option value={data.classifyId}>{data.cname}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="款式名称" className={styles.forItemDiv}>
              {getFieldDecorator('productName', {
                initialValue: self.state.message,
                rules: [
                  {
                    required: true,
                    message: '请输入款式名称',
                  },
                ],
              })(<Input placeholder="请输入款式名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="宝石描述" className={styles.forItemDiv}>
              {getFieldDecorator('productDescription', {
                initialValue: '',
              })(<TextArea placeholder="宝石描述" />)}
            </FormItem>
            {this.state.classifySaleList.map(data =>
              <FormItem {...formItemLayout} label={data.cname} className={styles.forItemDiv}>
                {getFieldDecorator(`propId_${data.propId}`, {
                  initialValue: '',
                })(data.isScheduled == 'N' ?
                    ((data.propId == 1015 || data.propId == 1016 || data.propId == 1017) ?
                      <span>
                        {self.state.proSizeList.map((idata, ind) => (
                        (idata.propId == data.propId ?
                          <span>
                            {idata.sizeValue.map((jdata, indThree) =>
                              <Col span={2} style={{ marginRight: 20 }}>
                                {getFieldDecorator(`size_${data.propId}_${indThree}`, {
                                  initialValue: '',
                                })(<Input placeholder="" />)}
                                <span className={styles.imgDelTwo} onClick={() => self.delSize(idata, indThree)}>
                                  —
                                </span>
                              </Col>,
                            )}

                            <span onClick={() => self.addProSize(ind)}>
                              添加尺寸+
                            </span>
                          </span>
                        : ''
                        )
                      ))}
                      </span>
                    : <Input placeholder={data.propDesc} />)
                  :
                    <Select placeholder="data.propDesc" style={{ width: 100 }} showSearch>
                      {data.presetList.map(Idata => (
                        <Option value={Idata}>{Idata}</Option>
                      ))}
                    </Select>,
                )}
              </FormItem>,
            )}

            {/* <FormItem {...formItemTwo} label="款式尺寸">
              {self.state.proSizeList.map((data, ind) => (
                <Col span={2} style={{ marginRight: 20 }}>
                  {getFieldDecorator(`size_${ind}`, {
                    initialValue: data.value,
                  })(<Input placeholder="" />)}
                </Col>
              ))}
              <span onClick={() => self.addProSize(self)}>
                添加尺寸+
              </span>
            </FormItem> */}

            <div className={styles.hr} />
            {this.state.classifyTxt != '' ?
              <div>
                <div>
                  <Row>
                    <Col span={24} className={`${styles.titTopTwo} dot`}>产品材质/重量/价格</Col>
                  </Row>
                  <div>
                    {this.state.classifyTxt != '对戒'
                    ?
                      this.state.classifySkuBigList.map((itemC, indexOne) =>
                        <Row style={{ borderBottom: '#eeeeee solid 1px', padding: '10px 0' }}>
                          {this.state.classifySkuSList.map((itemX, index) =>
                            <Col span={6}>
                              <Row>
                                <Col span={8} style={{ textAlign: 'right' }}>
                                  {itemX.cname}：
                              </Col>
                                <Col span={16}>
                                  {itemX.isScheduled == 'N' ?
                                      getFieldDecorator(`skuPropId_${indexOne}_${itemX.propId}`, {
                                        initialValue: '',
                                      })(
                                        <Input style={{ width: 120 }} placeholder={itemX.propDesc} />,
                                    )
                                  :
                                    getFieldDecorator(`skuPropId_${indexOne}_${itemX.propId}`, {
                                      initialValue: '',
                                    })(
                                      <Select placeholder={itemX.propDesc} style={{ width: 120 }} showSearch>
                                        {itemX.presetList.map(Idata => (
                                          <Option value={Idata}>{Idata}</Option>
                                      ))}
                                      </Select>,
                                    )
                                  }
                                </Col>
                              </Row>
                            </Col>,
                        )}
                          <Col span={6} style={{ float: 'right' }}>
                            <Row>
                              <Col span={8} style={{ textAlign: 'right' }}>
                                建议售价：
                              </Col>
                              <Col span={16}>
                                {getFieldDecorator(`minPrice_${indexOne}`, {
                                  initialValue: '',
                                })(
                                  <InputNumber min={0} placeholder="" style={{ width: 60 }} />,
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col span={6} style={{ float: 'right' }}>
                            <Row>
                              <Col span={10} style={{ textAlign: 'right' }}>
                                预估成本价：
                              </Col>
                              <Col span={14}>
                                {getFieldDecorator(`futurePrice_${indexOne}`, {
                                  initialValue: '',
                                })(
                                  <InputNumber min={0} placeholder="" style={{ width: 60 }} />,
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>,
                      )
                  :
                      <span>
                        {this.state.tabIndexList.map((Jdata, indexOne) =>
                          <Tabs defaultActiveKey="0" onChange={event => this.changePresetFun(event, indexOne)}>
                            {Jdata.map((Idata, indexTwo) => (
                              <TabPane tab={Idata.name} key={indexTwo}>
                                <span>
                                  {Idata.value.map((itemE, index) =>
                                    <Row>
                                      <Col span={17} style={{ padding: '10px 0' }}>
                                        {itemE.map(itemX =>
                                          <div className={styles.leftWrap}>
                                            <div style={{ textAlign: 'right' }}>
                                              {itemX.cname}：
                                              </div>
                                            <div style={{ marginRight: 20, marginBottom: 20 }}>
                                              {itemX.isScheduled == 'N' ?
                                                getFieldDecorator(`skuProId_${indexOne}_${itemX.propId}_${indexTwo}`, {
                                                })(
                                                  <Input style={{ width: 120 }} placeholder={itemX.propDesc} onChange={event => self.skuChange(event, indexOne, index, itemX.cname)} />,
                                                )
                                              :
                                                getFieldDecorator(`skuProId_${indexOne}_${itemX.propId}_${indexTwo}`, {
                                                })(
                                                  <Select placeholder={itemX.propDesc} style={{ width: 120 }} showSearch onChange={event => self.skuSelectChange(event, indexOne, index, itemX.cname)}>
                                                    {itemX.presetList.map(Idata => (
                                                      <Option value={Idata}>{Idata}</Option>
                                                    ))}
                                                  </Select>,
                                                )
                                              }
                                            </div>
                                          </div>,
                                        )}
                                      </Col>
                                      <Col span={7} style={{ padding: '10px 0', float: 'right' }}>
                                        <Col span={9} style={{ textAlign: 'left' }}>
                                            预估成本价：
                                          </Col>
                                        <Col span={15}>
                                          {getFieldDecorator(`futureDouPrice_${indexOne}_${Idata.name}`, {
                                          })(
                                            <InputNumber min={0} placeholder="" style={{ width: 70 }} />,
                                            )}
                                        </Col>
                                      </Col>

                                      <Col span={7} style={{ padding: '10px 0', float: 'right' }}>
                                        <Col span={9} style={{ textAlign: 'left' }}>
                                            建议售价：
                                          </Col>
                                        <Col span={15}>
                                          {getFieldDecorator(`minDouPrice_${indexOne}_${Idata.name}`, {
                                          })(
                                            <InputNumber min={0} placeholder="" style={{ width: 70 }} />,
                                            )}
                                        </Col>
                                      </Col>
                                    </Row>,
                                    )}
                                </span>
                              </TabPane>
                            ))}
                          </Tabs>,
                        )}
                      </span>
                  }
                    {this.state.classifyTxt != '' ?
                      <div className={styles.margin10}>
                        <span
                          className="addTxtRed"
                          onClick={self.addProMater}
                        >
                          增加材质+
                      </span>
                      </div> : ''
                  }

                  </div>
                </div>
              </div>
             : ''}
            <div className={styles.hr} />
            <div className={`${styles.titTopTwo} dot`}>上传平面图</div>
            <div>
              <Row>
                <Col span={8}>
                  <Col span={8}>
                    <div
                      className={styles.imgUpload}
                      onClick={() => self.imgUpload(self)}
                    >
                      <img src="./images/img-upload.png" />
                      <input type="file" ref="imgInput" src="./images/img-normal2.png" onChange={() => self.imgInputFun(self)} className={styles.displayHide} />
                    </div>
                    <input
                      type="file"
                      ref="imgInput"
                      onChange={() => self.imgInputFun(self)}
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
                  {this.state.imgDisplayList.map((ielem, index) => {
                    return (
                      <Col span={4} key={ielem.imageId}>
                        <div className={styles.textRight}>
                          <img
                            src={app.$http.imgURL + ielem.imageUrl}
                            className={styles.imgSmall}
                          />
                          <span
                            className={styles.imgDel}
                            onClick={() =>
                              self.delImg(index)
                            }
                          >
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
            <div className={`${styles.titTopTwo}`}>上传3D图包（可选）</div>
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
                      {this.state.mPicUrl && (
                        <div>
                          <img src={app.$http.imgURL + this.state.mPicUrl} className={styles.imgSmallTwo} />
                          <span className={styles.imgDel} onClick={this.delRar.bind(this)}>
                            —
                          </span>
                        </div>
                      )}
                    </div>
                  </Col>
                </Col>


                {this.state.classifyTxt != '' ?
                  <Col span={24}>
                    <div className={styles.textRight} style={{ marginTop: 20 }}>
                      <Button
                        type="primary"
                        className="bottonPublic"
                        onClick={() => self.addPro('0')}
                        style={{ marginRight: 20 }}
                        loading={this.state.saveLoading}
                    >
                      保存
                    </Button>
                      <Button className="bottonPublic" loading={this.state.saveLoading} type="primary" onClick={() => self.addPro('1')}>
                      提交审核
                    </Button>
                    </div>
                  </Col>
                : ''}
              </Row>
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

