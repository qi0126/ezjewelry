import React from 'react';
import { Input, Button, Checkbox, Form, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './PassWord.less';
import app from 'app';

const FormItem = Form.Item;

class PassWord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changePage: true,
      codeStatus: false,
      count: 60, // 秒数初始化为60秒,

      codeTrue: true,

      code: '123456',

      valiCode: '',

      result: {
        account: '',
      },
    };
  }

  componentDidMount() {
    app.$api.userMyInfo().then((res) => {
      this.setState({
        result: res.data,
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    this.setState({
      code: params.code,
    });
    this.validateCode(params).then((res) => {
      this.setState({
        changePage: false,
      });
    });

    // this.setState({ createdLoading: true });
    // app.$api.userChangPwd(params).then((res) => {
    //   this.setState({
    //     changePage: false,
    //   });
    // }).catch((err) => {
    //   this.setState({ createdLoading: false });
    // });
  }

  vali(params) {
    if (params.pwd !== params.pwd2) {
      message.error('两次输入密码不一致');
      return false;
    }
    return true;
  }

  changePw(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    const otherParams = {
      phone: this.state.result.account,
      code: this.state.code,
    };
    Object.assign(params, otherParams);
    if (!this.vali(params)) {
      return false;
    }
    delete params.pwd2;

    this.setState({ pwld: true });
    app.$api.userChangPwd(params).then((res) => {
      this.setState({ pwld: false });
      message.success(res.msg);
      app.$storage.set('urlHistory', '/me');
      setTimeout(() => {
        this.context.router.push('/me');
      }, 1000);
    }).catch((err) => {
      this.setState({ pwld: false });
    });
  }

  // 获取短信验证码
  handleClick = () => {
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
    const params = { phone: this.state.result.account };
    app.$api.userSendCode(params).then((res) => {
      message.success('验证码发送成功');
    });
  }

  // 校验验证码
  validateCode(params) {
    Object.assign(params, { phone: this.state.result.account });
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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.passWord}>
        {this.state.changePage ? (
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <div className={styles.datumWrap}>
              <div className={styles.tit}>登录密码设置</div>
              <div className={styles.datum}>
                <div className={styles.datumRow}>
                  <p className={styles.name}>已验证手机：</p>
                  <p className={styles.value}>{this.state.result && this.state.result.account}</p>
                </div>
              </div>

              <div className={styles.datum}>
                <div className={styles.datumRow}>
                  <p className={styles.name}>请填写短信效验码：</p>
                  <p className={styles.value} >
                    <FormItem >{getFieldDecorator('code', {})(
                      <Input style={{ width: 100 }} onChange={this.inputCode.bind(this)} placeholder="请输入效验码" />,
              )}
                    </FormItem>
                    <Button className={styles.code} type="primary" size="large" disabled={this.state.codeStatus} onClick={this.handleClick} > {!this.state.codeStatus ? <span>获取验证码</span> : <span>{`${this.state.count}s`}</span>
          }</Button>
                  </p>
                </div>
              </div>

              {/* <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>验证码：</p>
                <p className={styles.value}>自由职业</p>
              </div>
            </div> */}
            </div>
            <div className={styles.bottom}>
              <Button type="primary" size="large" htmlType="submit" disabled={this.state.codeTrue} loading={this.state.createdLoading} >提交</Button>
            </div>
          </Form>) : (<Form onSubmit={this.changePw.bind(this)}>
            <div className={styles.datumWrap}>
              <div className={styles.tit}>登录密码设置</div>
              <div className={styles.datum}>
                <div className={styles.datumRow}>
                  <p className={styles.name}>新的登录密码：</p>
                  <p className={styles.value}>
                    <FormItem >{getFieldDecorator('pwd', {})(
                      <Input type="password" style={{ width: 200 }} placeholder="密码长度由8-20位字母，数字和符号组合" />,
              )}
                    </FormItem></p>
                </div>
              </div>
              <div className={styles.datum}>
                <div className={styles.datumRow}>
                  <p className={styles.name}>请再输入一次密码</p>
                  <p className={styles.value} >
                    <FormItem >{getFieldDecorator('pwd2', {})(
                      <Input type="password" style={{ width: 200 }} placeholder="请再输入一次密码" />,
              )}
                    </FormItem>
                  </p>
                </div>
              </div>
              {/* <div className={styles.datum}>
              <div className={styles.datumRow}>
                <p className={styles.name}>验证码：</p>
                <p className={styles.value}>自由职业</p>
              </div>
            </div> */}
            </div>
            <div className={styles.bottom}>
              <Button type="primary" size="large" htmlType="submit" loading={this.state.pwld} >提交</Button>
            </div>
          </Form>)}


      </div>
    );
  }

}

PassWord.propTypes = {};

PassWord.contextTypes = {
  router: PropTypes.object.isRequired,
};
const PassWordFrom = Form.create()(PassWord);

export default PassWordFrom;
