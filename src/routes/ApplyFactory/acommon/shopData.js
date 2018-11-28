import React from 'react';
import { Radio, Cascader, Button, Select, Input, Form, message } from 'antd';
import app from 'app';
import PropTypes from 'prop-types';
import styles from './shopData.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class ShopData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      createdLoading: false,
      country: 'China',
      produceType: 'k金',
      license: '',

      // 编辑回填数据
      backData: {},

      // 第一次拿到数据
      dataFlag: true,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { dataFlag } = this.state;

    if (!dataFlag) {
      return;
    }
    if (nextProps.result.propsStatus) {
      console.log(nextProps.result);
      this.backDataEvent(nextProps.result);
      this.setState({
        dataFlag: false,
      });
    }
  }

  /**
   *  编辑方法begin
   */

  // 数据回填
  backDataEvent(options) {
    const refObj = JSON.stringify(options);
    const obj = JSON.parse(refObj);
    for (const i in obj) {
      this.setState({
        [i]: obj[i],
      });
    }
  }

  /**
   *  编辑方法end
   */

  vali(params) {
    // 公用验证begin
    if (!params.cname) {
      message.error('请输入姓名');
      return false;
    }

    if (!params.cname.toString().trim()) {
      message.error('请输入姓名');
      return false;
    }


    if (!params.addr && params.addr.toString().trim()) {
      message.error('请输入详细地址');
      return false;
    }

    if (this.state.country === 'China') {
      if (!params.area) {
        message.error('请选择地址');
        return false;
      }
    }
    // 公用验证end

    return true;
  }

  backPage() {
    this.props.backPage();
  }

  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    const otherParams = {
      area: params.region ? params.region.join(',') : '',
      ctype: params.ctype !== 4 ? params.ctype : params.produceTypeValue,
    };

    Object.assign(params, otherParams);

    if (!this.vali(params)) {
      return false;
    }
    this.setState({ createdLoading: true });

    app.$api.factoryStep2(params).then((res) => {
      this.props.dataTrue(params);
      this.setState({ createdLoading: false });
    }).catch((err) => {
      this.setState({ createdLoading: false });
    });
  }


  // 获取logo
  changeLogo(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        logoImg: res.data,
      });
    });
  }

    // 生产
  changeProType(e) {
    this.setState({
      ctype: e.target.value,
    });
  }

    // 改变国家
  changeCountry(e) {
    this.setState({
      country: e,
    });
  }

  // 计算文字长度
  computeWord(e) {
    const val = e.target.value;
    this.setState({
      introLength: val && val.length,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.createPlat} >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div style={{ height: 10, weight: 10, background: '#f8f8f8' }} />
          <div className={`${styles.sAudit} ${styles.completeInfo}`} >
            <div className={styles.top}>
              <div className={`${styles.tit} ${styles.dot}`}>供应商资料</div>
              <div className={styles.right} style={{ fontSize: 14 }}>请尽快完善您的个人信息，“<span>*</span>”为必填项</div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>公司名称：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('cname', { initialValue: this.state.backData.nickName })(
                  <Input placeholder="请输入公司名称" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>您所在的国家及地区：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('country', { initialValue: this.state.backData.country || 'China' })(
                  <Select style={{ width: 120 }} onChange={this.changeCountry.bind(this)}>
                    {app.$tool.country.map((item) => {
                      return <Option value={item.cityEndName} key={item.cityEndName}>{item.cityName}</Option>;
                    })}
                  </Select>,
              )}
                </FormItem>

                {this.state.country === 'China' && <FormItem style={{ marginLeft: '20px' }}>{getFieldDecorator('region', { initialValue: this.state.backData.region || '' })(
                  <Cascader options={app.$tool.city} style={{ border: '1px solid #d9d9d9' }} onChange={this.changeCity} placeholder="请选择省市区" />,
              )}
                </FormItem>}
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>公司详细地址：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('addr', { initialValue: this.state.backData.addrDetail })(
                  <Input style={{ width: 400 }} placeholder="请输入公司详细地址" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}`}>供应商生产类型：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('ctype', { initialValue: this.state.ctype })(
                  <RadioGroup style={{ width: '200px', display: 'flex', alignItems: 'center' }} onChange={this.changeProType.bind(this)}>
                    <Radio value="K金">K金</Radio>
                    <Radio value="素金">素金</Radio>
                    <Radio value="镶嵌">镶嵌</Radio>
                    <Radio value={4}>其他</Radio>
                  </RadioGroup>)}
                </FormItem>
                {this.state.ctype !== 4 ? null : <FormItem >{getFieldDecorator('produceTypeValue', { initialValue: this.state.produceTypeValue })(
                  <Input style={{ border: '1px solid #eee', marginLeft: 60 }} placeholder="请输入您的实体店铺名称" />,
              )}
                </FormItem>}
              </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.btn}>
              <p onClick={this.backPage.bind(this)}>上一步</p>
              <FormItem>
                <Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading}>提交审核</Button>
              </FormItem>
            </div>
          </div>

        </Form>
      </div>
    );
  }
}

ShopData.propTypes = {

};

ShopData.contextTypes = {
  router: PropTypes.object.isRequired,
};

const ShopDataFrom = Form.create()(ShopData);


export default ShopDataFrom;
