import React from 'react';
import { connect } from 'dva';
import { Select, Button, Slider, Row, Col, Input, Form, message, Spin } from 'antd';
import PropTypes from 'prop-types';
import app from 'app';

import styles from './DiamondIncrease.less';

const FormItem = Form.Item;

class DiamondIncrease extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ListFareData: [{ startWeight: '', endWeight: '', rule: '' }],
      proLoading: true, // 产品加载中属性
    };
  }


  componentDidMount() {

    this.getListFare();
  }

  getListFare = () => {
    this.setState({
      proLoading: true,
    });
    app.$api.diamondListFare().then((res) => {
      if (res.data.length != 0) {
        this.setState({
          ListFareData: res.data,
          proLoading: false,
        });
      } else {
        const arr = [{ startWeight: '', endWeight: '', rule: '', level: 4 }];
        this.setState({
          ListFareData: arr,
          proLoading: false,
        });
      }
    });
  }
    // 添加加价
  handlePrice = () => {
    const newData =
      this.setState({
        ListFareData: [...this.state.ListFareData, { startWeight: '', endWeight: '', rule: '', level: 4 }],
      });
  }
    // 删除加价
  delPrice = (item, index) => {
    if (item.id == undefined || item.id == '') {
      const newData = [...this.state.ListFareData];
      newData.splice(index, 1);
      this.setState({
        ListFareData: newData,
      });
    } else {
      const params = {
        id: item.id,
      };
      app.$api.deleteFare(params).then((res) => {
        this.getListFare();
      }).catch((err) => {
          // console.log(err);
      });
    }
  }
    // 新增编辑加价
  newUpdataPrice = (item, index) => {

      // this.props.form.validateFields((err, values) => {
      //   console.log(values);

      // });
      // this.props.form.getFieldsValue();
    const num1 = this.props.form.getFieldValue(`startWeight_${index}`);
    const num2 = this.props.form.getFieldValue(`endWeight_${index}`);

    const startWeight = Number(num1);
    const endWeight = Number(num2);
    const rule = this.props.form.getFieldValue(`rule_${index}`);
    if (startWeight == '' || endWeight == '' || rule == '') {
      message.warning('请输入数字！');
      return;
    }
    if (isNaN(startWeight) || isNaN(endWeight) || isNaN(rule)) {
      message.warning('请输入数字！');
      return;
    }
    if (startWeight > endWeight || startWeight == endWeight) {
      message.warning('开始克重不能大于等于结束克重！');
      return;
    }
    if (item.id == undefined || item.id == '') { // 新增
      const params = {
        startWeight,
        endWeight,
        rule,
        level: 4,
      };
      app.$api.addFare(params).then((res) => {
        this.getListFare();
        message.success('创建成功！');
      });
    } else { // 更新
      const params = {
        id: item.id,
        startWeight,
        endWeight,
        rule,
        level: 4,
      };
      app.$api.updateFare(params).then((res) => {
        this.getListFare();
        message.success('更新成功！');
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const list = () => {
      const res = this.state.ListFareData.map((item, index) => {
        return (
          <Spin size="large" spinning={this.state.proLoading} >
            <div className={styles.tr} key={index}>

              <div className={styles.tdA}>
                {getFieldDecorator(`startWeight_${index}`, {
                  initialValue: item.startWeight,
                  rules: [{ required: true }],
                })(
                  <Input placeholder="请输入" />,
                    )}
                <span className={styles.tip}>~</span>
                {getFieldDecorator(`endWeight_${index}`, {
                  initialValue: item.endWeight,
                  rules: [{ required: true }],
                })(
                  <Input placeholder="请输入" />,
                    )}
                <span style={{ marginLeft: '10px', lineHeight: '26px' }}>ct</span>
              </div>
              <div className={styles.tdB}>
                {getFieldDecorator(`rule_${index}`, {
                  initialValue: item.rule,
                  rules: [{ required: true }],
                })(
                  <Input placeholder="请输入" />,
                    )}
              </div>
              <div className={styles.tdC}>
                <div className={styles.btn} onClick={() => { this.newUpdataPrice(item, index); }}>确认</div>
                {index != 0 ?
                  <img className={styles.delIcon} src={'../images/delPro.png'} onClick={() => { this.delPrice(item, index); }} /> : ''
                      }
              </div>
            </div>
          </Spin>
        );
      });
      return res;
    };
    return (
      <div id={styles.diamondWrap} >
        <div className={styles.titleWrap}>
          <div className={styles.pricTitle}>钻石加价</div>
          <div>
            <div className={styles.btn} onClick={this.handlePrice}>添加加价</div>
          </div>
        </div>
        {/* 表格 */}
        <div className={styles.tabel}>
          <div className={styles.trWrap}>
            <div className={styles.thWrapA}>
              <div>开始克重</div>
              <div style={{ width: '28px' }} />
              <div>结束克重</div>
            </div>
            <div className={styles.thWrapB}>加价系数</div>
            <div className={styles.thWrapC} />
          </div>

          <Form>
            {list()}
          </Form>


        </div>
        {/*  */}
        {/* <div className="sliderWrap">
            <Slider range marks={marks} step={null} defaultValue={[26,37]}/>
        </div> */}
        {/*  */}
      </div>
    );
  }
}

DiamondIncrease.propTypes = {

};

DiamondIncrease.contextTypes = {
  router: PropTypes.object.isRequired,
};

const DiamondIncreaseForm = Form.create({})(DiamondIncrease);

export default DiamondIncreaseForm;
