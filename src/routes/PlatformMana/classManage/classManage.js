import React from 'react';
import { Button, Col, Form, Input, message, Spin } from 'antd';
import { connect } from 'dva';
import styles from './classManage.less';
import app from 'app';

const FormItem = Form.Item;


class ClassManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goldList: [],
      addCategory: [], // 添加品类的标志
      proLoading: true, // 产品加载中属性
    };
  }
  componentDidMount() {
    this.selectPinCategory();
  }

  // 查询品类数据
  selectPinCategory = () => {
    this.setState({
      proLoading: true,
    });
    app.$api.selectPinCategory().then((res) => {
      this.setState({
        goldList: res.data,
        proLoading: false,
      });
    });
  }


  // 添加品类
  addCategoryFun = () => {
    const self = this;
    const num = this.state.addCategory.length;
    this.state.addCategory.push(num);
    this.setState(() => ({
      addCategory: [...self.state.addCategory],
    }));
  }

  // 删除之前的品类
  deleBeforeFun = (item) => {
    if (this.state.goldList.length == 1) {
      message.warning('抱歉！要保留最后一条品类数据哦！');
      return;
    }
    const params = {
      id: item.id,
    };
    app.$api.deletePinCategoryById(params).then((res) => {
      this.selectPinCategory();
    });

  }

  // 删除
  deleFun = (index) => {
    this.state.addCategory.splice(index, 1);
    this.setState(() => ({
      addCategory: [...this.state.addCategory],
    }));
  }

  // 保存
  createFun = () => {
    const inputArr = this.props.form.getFieldsValue();
    const subData = [];
    for (const i in inputArr) {
      subData.push(inputArr[i]);
    }

    let ressult = false;
    subData.forEach((item) => {
      if (item == '') {
        ressult = true;
      }
    });

    if (ressult) {
      message.warning('抱歉！产品名称不能为空！');
      return;
    }
    if (subData.length == 0) {
      message.warning('请添加品类在保存！');
      return;
    }
    const params = {
      pinCategory: subData.join(','),
    };
    app.$api.addPinCategoryNumber(params).then((res) => {
      this.setState(() => ({
        addCategory: [],
      }), () => {
        this.selectPinCategory();
      });
    });

  }

  // 取消
  cancelFun = () => {
    this.setState({
      addCategory: [],
    });
  }

  render() {
    const self = this;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.shopApply} >
        <div className={styles.sAudit}>
          <Form className="login-form">
            <div className={styles.top}>
              <div className={styles.tit} style={{ height: 40 }}>
                <Col span={12}>
                品类管理 <span style={{ fontSize: '14px' }}>（ ¥/g ）</span>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={this.addCategoryFun}>添加品类</Button>
                </Col>
              </div>
            </div>
            {self.state.goldList.map((number, index) =>
              <div className={styles.items} key={index}>
                <Col span={14} className={styles.txtTwo}>
                  {number.commonName}

                </Col>
                <Col span={10} className={styles.txtOneRight}>
                  <span onClick={() => { this.deleBeforeFun(number); }}>删除</span>
                </Col>
              </div>,
              )}
            <Spin size="large" spinning={this.state.proLoading} >
              {this.state.addCategory.length != 0 ?
                        this.state.addCategory.map((item, index) => {
                          return (
                            <div className={styles.items} key={index}>
                              <Col span={14} className={styles.txtTwo}>
                                {getFieldDecorator(`name_${item}`, {
                                  initialValue: '',
                                })(<Input style={{ width: 145 }} placeholder="请输入材质名称" />)}
                              </Col>
                              <Col span={10} className={styles.txtOneRight}>
                                <span onClick={() => { this.deleFun(index); }}>删除</span>
                              </Col>
                            </div>
                          );
                        }) : ''

            }
              {this.state.goldList.length != 0 ?
                <div className={styles.bottom}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ marginRight: 20, color: 'red' }} onClick={this.cancelFun}>取消</span>
                    <Button type="primary" onClick={this.createFun}>保存</Button>
                  </div>
                </div> : ''
            }
            </Spin>

          </Form>

        </div>
      </div>
    );
  }

}

const ClassManageForm = Form.create()(ClassManage);
export default connect(() => ({}))(ClassManageForm);
