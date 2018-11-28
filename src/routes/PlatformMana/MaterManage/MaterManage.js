import React from 'react';
import { Button, Col, Form, Input, Spin, InputNumber } from 'antd';
import { connect } from 'dva';
import styles from './MaterManage.less';
import app from 'app';

const FormItem = Form.Item;


class MaterManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goldList: [],
      addGoldShow: false, // 添加新材质状态默认false
      editGoldShow: false, // 编辑全部材质状态默认false
      proLoading: true, // 产品加载中属性
    };
  }
  componentDidMount() {
    // 查询金价列表
    this.setState({
      proLoading: true,
    });
    app.$api.selectGoldlist().then((res) => {
      const goldTempList = res.data;
      for (let i = 0; i < goldTempList.length; i++) {
        // console.log(goldTempList[i]);
        goldTempList[i].editTF = false;
      }
      this.setState({
        goldList: res.data,
        proLoading: false,
      });
    });
  }
  // 添加材质事件
  addGold=() => {
    for (let i = 0; i < this.state.goldList.length; i++) {
      // console.log(goldTempList[i]);
      this.state.goldList[i].editTF = false;
    }
    this.setState({
      editGoldShow: false,
      addGoldShow: !this.state.addGoldShow,
    });
  }
  // 删除当前材质
  delGold=(item) => {
    const params = { id: item.id };
    app.$api.delectGoldPrice(params).then((res) => {
      this.componentDidMount();
      this.setState({
        addGoldShow: false,
      });
    });
  }
  // 编辑单个材质字变输入框
  editGold(elem) {
    for (let i = 0; i < this.state.goldList.length; i++) {
      if (i == elem) {
        this.state.goldList[i].editTF = true;
      } else {
        this.state.goldList[i].editTF = false;
      }
    }
    this.setState({
      goldList: this.state.goldList,
      addGoldShow: false,
    });
  }
  // 编辑单个材质保存事件
  editSaveGold(elem) {
    this.props.form.validateFields((err, values) => {
      const tempObj = { id: elem.id, textureName: values.textureName, goldPrice: values.goldPrice };
      app.$api.updateGoldPrice(tempObj).then((res) => {
        for (let i = 0; i < this.state.goldList.length; i++) {
          this.state.goldList[i].editTF = false;
        }
        this.setState({
          goldList: this.state.goldList,
          addGoldShow: false,
        });
        this.componentDidMount();
      });
    });


  }
  // 保存当前材质结果
  saveGold(thiselem) {
    // console.log(thiselem.state.goldList);
    // console.log(thiselem.state.goldList.length);
    // const maxI = thiselem.state.goldList.length - 1;
    // console.log(thiselem.state.goldList[`${maxI}`]);
    // console.log(thiselem.state);
    // console.log(thiselem.state.addGoldShow);
    if (thiselem.state.addGoldShow) {
      // console.log('新增状态');
    }
    // this.setState({
    //   addGoldShow: false, // 添加新材质状态默认false
    //   editGoldShow: false, // 编辑全部材质状态默认false
    // });
  }
  // 创建新材质
  addMater(thiselem) {
    // console.log(thiselem);
    thiselem.props.form.validateFields((err, values) => {
      // console.log(values);
      // const params = { goldPrice: JSON.stringify(values) };
      const params = {
        textureName: values.textureNameNew,
        goldPrice: values.goldPriceNew,
      };
      app.$api.addGoldPrice(params).then((res) => {
        thiselem.setState({
          addGoldShow: false,
        });
        thiselem.componentDidMount();
      });
    });
  }
  // 取消材质编辑
  cancelMater(thiselem) {
    thiselem.setState({
      addGoldShow: false,
    });
    this.componentDidMount();
  }
  cancelMater
  render() {
    const self = this;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.shopApply} >
        <div className={styles.sAudit}>
          <Form onSubmit={() => self.saveGold(self)} className="login-form">
            <div className={styles.top}>
              <div className={styles.tit} style={{ height: 40 }}>
                <Col span={12}>
                材质管理 <span style={{ fontSize: '14px' }}>（ ¥/g ）</span>
                </Col>
                <Col span={12} className={styles.topRight}>
                  <span onClick={() => self.addGold()}>
                    {this.state.addGoldShow ? '关闭添加' : '添加材质'}
                  </span>
                </Col>
              </div>
            </div>
            <Spin size="large" spinning={this.state.proLoading} >
              {self.state.goldList.map((number, ind) =>
                <div className={styles.items}>
                  <Col span={10} className={styles.txtTwo}>
                    {
                      number.editTF ?
                        <span>
                          {getFieldDecorator('textureName', {
                            initialValue: number.textureName,
                          })(<Input style={{ width: 145 }} placeholder="请输入材质名称" />)}
                        </span>

                      :
                      number.textureName
                    }
                  </Col>
                  <Col span={7}>
                    <span className={styles.txtTwo}>
                      {
                        number.editTF ?
                          <span>
                            {getFieldDecorator('goldPrice', {
                              initialValue: number.goldPrice,
                            })(<InputNumber min={0} style={{ width: 145 }} placeholder="请输入材质价格" />)}
                          </span>
                        :
                        number.goldPrice
                      }
                    </span>
                    元/g
                  </Col>
                  <Col span={7} className={styles.txtOneRight}>
                    {
                        number.editTF ?
                          <span onClick={() => self.editSaveGold(number)} className="ml20">保存</span>
                        :
                          <span onClick={() => self.editGold(ind)} className="ml20">编辑</span>
                      }

                    <span onClick={() => self.delGold(number)} className="ml20">删除</span>
                  </Col>
                </div>,
              )}
              {
              this.state.addGoldShow
                  ?
                    <div className={styles.items}>
                      <Col span={10} className={styles.txtTwo}>
                        {getFieldDecorator('textureNameNew', {
                          initialValue: '',
                        })(<Input style={{ width: 145 }} placeholder="请输入材质名称" />)}
                      </Col>
                      <Col span={14}>
                        <span className={styles.txtTwo}>
                          {getFieldDecorator('goldPriceNew', {
                            initialValue: '',
                          })(<InputNumber min={0} style={{ width: 145 }} placeholder="请输入材质价格" />)}
                        </span>
                      元/g
                      </Col>
                    </div>
                  :
                  null
              }


              <div className={styles.bottom}>
                {
              this.state.addGoldShow
                  ?
                    <div className={styles.txtOneRight}>
                      <span style={{ marginRight: 20 }} onClick={() => self.cancelMater(self)}>取消</span>
                      <Button type="primary" onClick={() => self.addMater(self)}>创建</Button>
                    </div> : null}
              </div>
            </Spin>
          </Form>

        </div>
      </div>
    );
  }

}

const MaterManageForm = Form.create()(MaterManage);
export default connect(() => ({}))(MaterManageForm);
