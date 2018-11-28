import React from 'react';
import { Radio, Cascader, Button, Select, Input, Form, message } from 'antd';
import app from 'app';
import PropTypes from 'prop-types';
import styles from './completeInfo.less';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class CreatePlat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      createdLoading: false,
      country: 'China',
      produceType: 'k金',

      // 编辑回填数据
      backData: {},

      dataFlag: true,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { dataFlag } = this.state;

    if (!dataFlag) {
      return;
    }
    if (nextProps.result.propsStatus) {
      console.log(nextProps);
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

  // 生产
  changeProType(e) {
    this.setState({
      produceType: e.target.value,
    });
  }

  // 改变国家
  changeCountry(e) {
    this.setState({
      country: e,
    });
  }

  // 获取身份证正面
  cartTrue(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        cardTrueImg: res.data,
      });
    });
  }

  // 获取身份证反面
  cartFalse(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        cardFalseImg: res.data,
      });
    });
  }

  vali(params) {
    // 公用验证begin
    if (!params.name) {
      message.error('请输入姓名');
      return false;
    }

    if (!params.name.toString().trim()) {
      message.error('请输入姓名');
      return false;
    }

    if (!params.sex) {
      message.error('请输入性别');
      return false;
    }

    if (params.phone) {
      if (!app.$v.verifyPhone(params.phone)) {
        message.error('请输入正确的固定电话');
        return false;
      }
    }


    if (params.email) {
      if (!app.$v.verifyEmail(params.email)) {
        message.error('邮箱格式不正确');
        return false;
      }
    }

    // 公用验证end

    if (!params.name) {
      message.error('请输入公司名称');
      return false;
    }

    return true;
  }

  backPage() {
    this.context.router.goBack();
  }

  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    const otherParams = {
      region: params.region ? params.region.join(',') : '',
      pic: `${this.state.cardTrueImg},${this.state.cardFalseImg}`,
      produceType: params.produceType !== 4 ? params.produceType : params.produceTypeValue,
    };

    Object.assign(params, otherParams);

    if (!this.vali(params)) {
      return false;
    }
    this.setState({ createdLoading: true });
    app.$api.factoryStep1(params).then((res) => {
      this.props.comTrue(params);
      this.setState({ createdLoading: false });
    }).catch((err) => {
      this.setState({ createdLoading: false });
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
              <div className={`${styles.tit} ${styles.dot}`}>完善信息</div>
              <div className={styles.right} style={{ fontSize: 14 }}>请尽快完善您的个人信息，“<span>*</span>”为必填项</div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>法人代表姓名：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('name', { initialValue: this.state.backData.realName })(
                  <Input placeholder="请输入您的姓名" />,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>性别：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('sex', { initialValue: this.state.backData.sex || '男' })(
                  <RadioGroup >
                    <Radio value="男">男</Radio>
                    <Radio value="女">女</Radio>
                  </RadioGroup>,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}`}>手机号：</div>
              <div className={styles.right}>
                {this.state.backData.account}
              </div>
            </div>


            <div className={styles.col}>
              <div className={`${styles.left} `}>固定电话：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('phone', { initialValue: this.state.backData.phone })(
                  <Input placeholder="请输入您的固定电话" />,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles.left}>邮箱：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('email', { initialValue: this.state.backData.email })(
                  <Input placeholder="请输入您的常用邮箱" />,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.imgCol}>
              <div className={styles.imgTop}>身份证</div>
              <div className={styles.imgWrap}>

                <div className={styles.imgItem}>
                  <div className={styles.imgBox}> <label htmlFor="cardTrue"><img src={this.state.cardTrueImg ? `${app.$http.imgURL}${this.state.cardTrueImg}` : './images/img-normal.png'} alt="身份证正面照" /></label>
                    {this.state.cardTrueImg && (<div className={styles.delImg} onClick={() => { this.setState({ cardTrueImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证正面照</p>
                </div>
                <input type="file" id="cardTrue" onChange={this.cartTrue.bind(this)} style={{ display: 'none' }} />

                <div className={styles.imgItem}>
                  <div className={styles.imgBox}> <label htmlFor="cardFalse"><img src={this.state.cardFalseImg ? `${app.$http.imgURL}${this.state.cardFalseImg}` : './images/img-normal.png'} alt="身份证反面照" /></label>
                    {this.state.cardFalseImg && (<div className={styles.delImg} onClick={() => { this.setState({ cardFalseImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证反面照</p>
                </div>
                <input type="file" id="cardFalse" onChange={this.cartFalse.bind(this)} style={{ display: 'none' }} />

              </div>
            </div>

          </div>

          <div className={styles.bottom}>
            <div className={styles.btn}>
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

CreatePlat.propTypes = {

};

CreatePlat.contextTypes = {
  router: PropTypes.object.isRequired,
};


const CreatePlatx = Form.create()(CreatePlat);

export default CreatePlatx;
