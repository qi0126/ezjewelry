import React from 'react';
import styles from './Register.less';
import PropTypes from 'prop-types';
import { Input, Button, Checkbox, Form, Select, Radio, Row, Col, message } from 'antd';
import IndexSlide from '@/components/indexSlide/indexSlide';
import app from 'app';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdLoading: false,
      account: '',
      password: '',
      checked: true,

      // 短信验证码
      codeTrue: true,
      code: '123456',
      count: 60,
      result: {},

      // 页面切换
      pageIndex: 0,
    };
  }

  componentDidMount() {}

  backPw() {
    this.context.router.push('/backPw');
  }

  // 改变主体类型
  changeType(e) {
    console.log(e.target.value);
  }

  // 改变入住类型
  changeShop(e) {
    console.log(e);
  }

  // 获取手机号
  getPhone(e) {
    this.setState({
      phone: e.target.value,
    });
  }

  registerShow() {
    console.log(this.state);

    const { phone: account, password } = this.state;
    const params = {
      account,
      password,
    };
    app.$api.userLogin(params).then((res) => {}).catch((err) => {
      this.setState({ createdLoading: false });
      // 未完善信息处理
      if (err.code === 1002) {
        app.$storage.set('accessToken', err.data);
        this.goNext(true);
      } else {
        message.error(err.msg);
      }
    });
  }

    // 前往首页
  goNext(options) {
    app.$storage.set('urlHistory', '/');
    if (options) {
      this.getMyInfo().then((res) => {
        let pathname = '';
        const { roleType } = res.data;
        switch (roleType) {
          case 'SHOP':
            pathname = '/applyShop';
            break;
          case 'DESIGNER':
            pathname = '/applyDesigner';
            break;
          case 'FACTORY':
            pathname = '/applyFactory';
            break;
          default:
            break;
        }
        this.context.router.push({ pathname });
      });
      return;
    }
    this.context.router.push({ pathname: '/' });
  }

    // 获取用户信息
  getMyInfo() {
    return app.$api.userMyInfo();
  }

  // 完成注册
  registerOver(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    const { pwd: password } = params;
    const { ctype, rtype, phone, code, pageIndex } = this.state;
    const otherParams = {
      ctype,
      rtype,
      phone,
      code,
    };

    Object.assign(params, otherParams);
    if (!this.vali(params)) {
      return false;
    }
    if (pageIndex === 1) {
      app.$api.userRegister(params).then((res) => {
        this.setState({
          password,
          pageIndex: 2,
        });
      });
    }
  }

  // 确认注册
  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    const { code, ctype, rtype, phone } = params;
    const { pageIndex } = this.state;
    this.setState({
      ctype,
      rtype,
      code,
      phone,
    });
    if (pageIndex === 0) {
      this.validateCode(params).then((res) => {
        this.setState({
          code,
          phone,
          pageIndex: 1,
        });
      });
    }
  }

  vali(params) {
    if (params.pwd !== params.pwd2) {
      message.error('两次输入密码不一致');
      return false;
    }
    return true;
  }

  // 获取短信验证码
  handleClick = () => {
    const { phone } = this.state;
    if (!app.$v.verifyMobile(phone)) {
      message.error('请输入正确的手机号');
      return;
    }

    this.sendCode();
    var timer = setInterval(() => {
      this.setState({
        codeStatus: true,
        count: this.state.count - 1,
      });
      if (this.state.count === 0) {
        clearInterval(timer);
        this.setState({
          codeStatus: false,
          count: 60,
        });
      }
    }, 1000);
  }

  // 发送验证码
  sendCode() {
    const { phone } = this.state;
    const params = { phone };
    app.$api.userSendCode(params).then((res) => {
      message.success('验证码发送成功');
    });
  }

  // 校验验证码
  validateCode(params) {
    return app.$api.userValidateCode(params);
  }

  inputCode(e) {
    let flag;
    if (e.target.value.length >= 4) {
      flag = false;
    } else {
      flag = true;
    }
    this.setState({
      codeTrue: flag,
    });
  }

  changeSave(e) {
    this.setState({
      checked: e.target.checked,
    });
  }

  backHome() {
    this.context.router.push('/home');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { checked, pageIndex } = this.state;
    return (
      <div className={styles.register}>
        <div className={styles.wrap}>
          {pageIndex === 0 && (
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <div className={styles.left}>
                <div className={styles.leftCont}>
                  <div className={styles.lRow}>
                    <Row>
                      <Col className="f16 fb">请选择注册角色类型</Col>
                    </Row>
                    <div style={{ height: 30 }} />
                    <Row>
                      <Col>
                        <FormItem>
                          {getFieldDecorator('ctype', { initialValue: '1' })(
                            <RadioGroup onChange={this.changeType.bind(this)}>
                              <Radio value={'1'}>个人</Radio>
                              <Radio value={'2'}>公司</Radio>
                            </RadioGroup>,
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <div style={{ height: 30 }} />
                    <Row type="flex" align="middle">
                      <Col>请选择您要申请的类型</Col>
                      <Col offset={2}>
                        <FormItem>
                          {getFieldDecorator('rtype', { initialValue: 'DESIGNER' })(
                            <Select style={{ width: 120 }} onChange={this.changeShop.bind(this)}>
                              <Option value="DESIGNER">设计师入驻</Option>
                              <Option value="SHOP">创建店铺</Option>
                              <Option value="FACTORY">供应商入驻</Option>
                            </Select>,
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                  <div style={{ height: 30 }} />
                  <div className={styles.datumWrap}>
                    <div className={`${styles.tit} f16 fb`}>手机注册</div>
                    <div className={styles.datum}>
                      <div className={styles.datumRow}>
                        <p className={styles.name}>中国大陆</p>
                        <p className={styles.value}>
                          <div className="f">
                            <span style={{ marginRight: 10 }}>+86</span>
                            <FormItem>
                              {getFieldDecorator('phone', {})(
                                <Input style={{ width: 200 }} onInput={this.getPhone.bind(this)} placeholder="请输入手机号码" />,
                            )}
                            </FormItem>
                          </div>
                        </p>
                      </div>
                    </div>

                    <div className={styles.datum}>
                      <div className={styles.datumRow}>
                        <p className={styles.value}>
                          <FormItem>{getFieldDecorator('code', {})(<Input style={{ width: 100 }} onChange={this.inputCode.bind(this)} placeholder="请输入短信效验码" />)}</FormItem>
                          <Button className={styles.code} type="primary" size="large" disabled={this.state.codeStatus} onClick={this.handleClick}>
                            {!this.state.codeStatus ? <span>获取验证码</span> : <span>{`${this.state.count}s`}</span>}
                          </Button>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.lButton}>
                    <Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading}>
                      确认注册
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
          {pageIndex === 1 && (
            <Form onSubmit={this.registerOver.bind(this)}>
              <div className={styles.left}>
                <div className={styles.leftCont} style={{ width: 330 }}>
                  <p className={styles.lTit}>密码设置</p>
                  <div className={`${styles.lRow}`}>
                    <Row type="flex" align="middle">
                      <Col span={5}>
                        <p>密码</p>
                      </Col>
                      <Col>
                        <FormItem>{getFieldDecorator('pwd', {})(<Input type="password" style={{ width: 260 }} placeholder="密码由8-20位字母，数字和符号组合" />)}</FormItem>
                      </Col>
                    </Row>
                  </div>
                  <div className={styles.lRow}>
                    <Row type="flex" align="middle">
                      <Col span={5}>
                        <p>确认密码</p>
                      </Col>
                      <Col>
                        <FormItem>{getFieldDecorator('pwd2', {})(<Input type="password" style={{ width: 260 }} placeholder="请再次确认您的密码" />)}</FormItem>
                      </Col>
                    </Row>
                  </div>

                  <div className={`${styles.noAccount}`} style={{ marginTop: 40 }}>
                    <p>
                      <Checkbox checked={checked} onChange={this.changeSave.bind(this)} style={{ marginRight: 10 }} />
                      我已阅读并同意网站的<span>使用条件</span>及<span>隐私声明</span> 。
                    </p>
                  </div>
                  <div className={styles.lButton}>
                    <Button type="primary" style={{ width: 330 }} size="large" htmlType="submit" loading={this.state.createdLoading}>
                      完成注册
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}

          {pageIndex === 2 && (
            <div className={styles.left}>
              <div className={styles.leftCont}>
                <div>
                  <div style={{ marginBottom: 40 }}>
                    <span className="c9">您的账号</span> <span className="cblue">{this.state.phone}</span>，
                  </div>
                  <div className={'c0 f18 fb '} style={{ marginBottom: 80 }}> 注册成功！！</div>
                  {this.state.rtype === 'SHOP' && <div className={'c0 fb'}>想创建一家珠宝首饰店铺？</div>}
                  {this.state.rtype === 'FACTORY' && <div className={'c0 fb'}>想创建一家珠宝首饰供应商？</div>}
                  {this.state.rtype === 'DESIGNER' && <div className={'c0 fb'}>想想成为珠宝首饰设计师？</div>}

                  <div className={'c0 fb'}>请继续完善您的信息</div>
                  <div className={styles.lButton} style={{ justifyContent: 'flex-start' }}>
                    <Button type="primary" style={{ width: 200, marginTop: 80 }} size="large" htmlType="submit" onClick={this.registerShow.bind(this)}>
                      完善信息
                    </Button>
                  </div>
                  <div onClick={this.backHome.bind(this)} className={'cblue fend cursor'}>谢谢，先不申请</div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.right}>
            <div className={styles.wrapBox}>
              <IndexSlide widthWrap={402} heightWrap={178} imgWrap="./images/img-ezjconth.png" />
              <img src="./images/img-ewelry.png" width="44" height="20" style={{ marginLeft: '20px' }} alt="欢迎来到ezj" />
            </div>

            <div className={styles.wbottom}>
              <img className={styles.slideImg} src="./images/img-wbottom.png" alt="欢迎来到ezj" />
            </div>

            <div className="gs-bottom" style={{ width: 'inherit' }}>
              Copyright 2018 深圳市中谷科技文化有限公司版权所有。
              <span className="c00">
                <a href="http://www.miitbeian.gov.cn" target="_blank">
                  粤ICP备17002323号-1
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {};

Register.contextTypes = {
  router: PropTypes.object.isRequired,
};

const RegisterFrom = Form.create()(Register);
export default RegisterFrom;
