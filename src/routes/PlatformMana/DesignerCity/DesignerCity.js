import React from 'react';
import { Button, Col, Form, Input, Select, Message, Popconfirm, Spin } from 'antd';
import app from 'app';

import { connect } from 'dva';
import styles from './DesignerCity.less';

const Option = Select.Option;

class DesignerCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityList: [],
      addGoldShow: false, // 添加新材质状态默认false
      editGoldShow: false, // 编辑全部材质状态默认false
      newCityData: [], // 世界国家列表
      addCityData: {}, // 新增国家数据
      editImgIndex: 0, // 编辑图片
      proLoading: true, // 产品加载中属性
    };
  }
  componentDidMount() {
    // 设计师国家列表
    this.setState({
      cityList: [],
      proLoading: true,
    }, () => {
      app.$api.countryList().then((res) => {
        this.setState({
          cityList: res.data,
          newCityData: app.$tool.country,
          addCityData: {}, // 新增国家数据
          addGoldShow: false,
          proLoading: false,
        });
      });
    });
  }
  // 添加材质事件
  addGold=() => {
    // console.log(this.state);
    this.setState({
      addGoldShow: !this.state.addGoldShow,
      editGoldShow: false,
      addCityData: {},
    });
  }
  // 删除当前材质
  delGold(pId) {
    const params = { id: pId };
    app.$api.delCountry(params).then((res) => {
	    this.componentDidMount();
    });
  }
  // 编辑所有材质
  editGold() {
    this.setState({
      addGoldShow: false,
      editGoldShow: !this.state.editGoldShow,
    });
  }
  // 保存国家与图片
  saveGold=() => {
    const self = this;
    // 新增状态
    if (self.state.addGoldShow) {
      if (!self.state.addCityData.countryName || !self.state.addCityData.countryImg) {
        Message.warning('新增国家内容不完整，请重新添加再点击保存！');
        return false;
      }
      self.state.cityList.forEach((item) => {
        delete item.createTime;
      });
      let cityAddTF = false;
      for (let i = 0; i < self.state.cityList.length; i++) {
        for (let j = i + 1; j < self.state.cityList.length; j++) {
          if (self.state.cityList[i].countryName == self.state.cityList[j].countryName) {
            cityAddTF = true;
          }
        }
      }
      if (cityAddTF) {
        Message.error('有国家重复，不能被保存！');
        return;
      }

      self.state.cityList.push(self.state.addCityData);
      let cityAddTFTwo = false;
      for (let i = 0; i < self.state.cityList.length; i++) {
        for (let j = i + 1; j < self.state.cityList.length; j++) {
          if (self.state.cityList[i].countryName == self.state.cityList[j].countryName) {
            cityAddTFTwo = true;
          }
        }
      }
      if (cityAddTFTwo) {
        Message.error('有国家重复，不能被保存！');
        self.state.cityList.splice((self.state.cityList.length - 1), 1);
        return;
      }
      const params = {
        country: JSON.stringify(self.state.cityList),
      };
      app.$api.saveCountry(params).then((res) => {
        Message.success('图家新增成功，并刷新页面！');
        self.setState({
          addGoldShow: false,
          editGoldShow: false,
        }, () => {
          self.componentDidMount();

        });
      });
    } else {
      let cityTF = false;
      for (let i = 0; i < self.state.cityList.length; i++) {
        for (let j = i + 1; j < self.state.cityList.length; j++) {
          if (self.state.cityList[i].countryName == self.state.cityList[j].countryName) {
            cityTF = true;
          }
        }
      }
      if (cityTF) {
        Message.error('有国家重复，不能被保存！');
        return;
      }
      self.state.cityList.forEach((item) => {
        delete item.createTime;
      });
      const params = {
        country: JSON.stringify(self.state.cityList),
      };
      app.$api.saveCountry(params).then((res) => {
        Message.success('图家保存成功，并刷新页面！');
        self.setState({
          addGoldShow: false,
          editGoldShow: false,
        }, () => {
          self.componentDidMount();
        });
      });
    }
  }
  // 下拉选择框
  handleChange=(e, indexNum) => {
    const self = this;
    // self.state.cityList.forEach((tdata) => {
    //   if (tdata.countryName == e) {
    //     Message.error('国家不能重复，将不能被保存！');
    //     return false;
    //   }
    // });
    self.state.cityList[indexNum].countryName = e;
    delete self.state.cityList[indexNum].createTime;
    app.$tool.country.forEach((item) => {
      if (item.cityName === e) {
        self.state.cityList[indexNum].countryCode = item.cityEndName;
      }
    });
    // console.log(self.state.cityList[indexNum]);
    self.setState({
      cityList: self.state.cityList,
    });
    // console.log(self.state.cityList);
  }
    // 新增下拉选择框
  addSelectCity=(e) => {
    const self = this;
    self.state.addCityData.countryName = e;
    app.$tool.country.forEach((item) => {
      if (item.cityName === e) {
        self.state.addCityData.countryCode = item.cityEndName;
      }
    });
  }
  // 修改国家图片点击事件
  imgEditUpload=(indexNum) => {
    this.setState({
      editImgIndex: indexNum,
      editGoldShow: true,
    });
    this.refs.imgInputEdit.click();
  }
    // 新增国家图片点击事件
  imgAddUpload(thiselem) {
    thiselem.refs.imgInputAdd.click();
  }
  // 新增国家图片上传
  imgInputAddFun(thiselem) {
    // console.log(thiselem.refs.imgInputAdd.files);
    const params = new FormData();
    params.append('files', thiselem.refs.imgInputAdd.files[0]);

      // 图片上传
    app.$api.uploadImage(params).then((res) => {
      thiselem.state.addCityData.countryImg = res.data.imageUrl;
      thiselem.setState({
        addCityData: thiselem.state.addCityData,
      });
      console.log(thiselem.state.addCityData);
      // thiselem.setState({
      //   imgDisplayList: imgList,
      // });
    });
  }
  // 修改国家图片上传
  imgInputEditFun =(indexNum, e) => {
    // console.log(this.refs);
    const self = this;
    const indexNN = self.state.editImgIndex;
    const params = new FormData();
    params.append('files', this.refs.imgInputEdit.files[0]);
    // 图片上传
    app.$api.uploadImage(params).then((res) => {
      const imgList = self.state.imgDisplayList;
      self.state.cityList[indexNN].countryImg = res.data.imageUrl;
      self.setState({
        cityList: self.state.cityList,
      });
    });
  }
  // 取消按钮
  cancel=() => {
    this.componentDidMount();
  }

  render() {
    const self = this;
    return (
      <div className={styles.shopApply} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit} style={{ height: 40 }}>
              <Col span={12}>
                设计师国家
              </Col>
              <Col span={12} className={styles.topRight}>
                <span onClick={() => self.addGold()} className={styles.addCitySpanOne}>
                  {this.state.addGoldShow ? '关闭添加' : '添加开放的设计师国家'}
                </span>
              </Col>
            </div>
          </div>
          {this.state.cityList.length == 0 ? <span>暂无设计师国家，请点击<span onClick={() => self.addGold()} className={styles.addCitySpan}>添加设计师国家</span>！</span> : ''}
          {
            this.state.addGoldShow && (
            <div className={styles.items}>
              <Col span={10} className={styles.txtTwo}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择一个国家"
                  optionFilterProp="children"
                  onChange={event => self.addSelectCity(event)}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                  {this.state.newCityData.map((item, ind) => (
                    <Option value={item.cityName} key={ind} >{item.cityName}</Option>
                        ))}
                </Select>
              </Col>
              <Col span={7}>
                <Col span={8}>
                  <div className={styles.cityImgDiv} >
                    {
                            self.state.addCityData.countryImg ?
                              <img src={app.$http.imgURL + self.state.addCityData.countryImg} onClick={() => self.imgAddUpload(self)} className={styles.cityImg} />
                            :
                              <img src="../images/img-upload.png" onClick={() => self.imgAddUpload(self)} />
                          }

                    <input
                      type="file"
                      ref="imgInputAdd"
                      onChange={() => self.imgInputAddFun(self)}
                      className={styles.displayHide}
                          />
                  </div>
                </Col>
                <Col span={16}>
                  <div className={styles.cityImgTxtOne}>国家图片</div>
                  <div className={styles.cityImgTxtTwo}>请您上传单张格式为png、jpg的图片， 图片大小为500KB以内</div>
                </Col>
              </Col>
            </div>
              )
            }
          <Spin size="large" spinning={this.state.proLoading} >
            {this.state.cityList.map((number, ind) =>
              <div className={styles.items}>
                <Col span={10} className={styles.txtTwo}>
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    defaultValue={number.countryName}
                    placeholder="请选择一个国家"
                    optionFilterProp="children"
                    onChange={event => this.handleChange(event, ind)}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {this.state.newCityData.map((data, ind) => (
                      <Option value={data.cityName} key={data.cityCode}>{data.cityName}</Option>
                  ))}
                  </Select>
                </Col>
                <Col span={7}>
                  <Col span={8}>
                    <div className={styles.cityImgDiv} >
                      <img src={app.$http.imgURL + number.countryImg} onClick={() => self.imgEditUpload(ind)} className={styles.cityImg} />
                      <input
                        type="file"
                        ref="imgInputEdit"
                        onChange={event => self.imgInputEditFun(ind, event)}
                        className={styles.displayHide}
                    />
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className={styles.cityImgTxtOne}>国家图片</div>
                    <div className={styles.cityImgTxtTwo}>请您上传单张格式为png、jpg的图片， 图片大小为500KB以内</div>
                  </Col>
                </Col>
                {
                number.id ?
                  <Col span={7} className={styles.txtOneRight} >
                    <Popconfirm title={`确认需要删除'${number.countryName}'国家吗?`} onConfirm={() => self.delGold(number.id)} okText="确认" cancelText="取消">
                      删除
                    </Popconfirm>
                  </Col>
                : ''
              }

              </div>,
            )}
          </Spin>

          <div className={styles.bottom}>
            <div className={styles.txtOneRight}>
              <span style={{ marginRight: 20 }} onClick={self.cancel}>取消</span>
              <Button type="primary" onClick={() => self.saveGold()}>保存</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

const DesignerCityForm = Form.create()(DesignerCity);
export default connect(() => ({}))(DesignerCityForm);
