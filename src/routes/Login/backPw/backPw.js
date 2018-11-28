import React from 'react';
import styles from './backPw.less';
import PropTypes from 'prop-types';
import { Input, Button, Checkbox, Form, message } from 'antd';
import IndexSlide from '@/components/indexSlide/indexSlide';
import app from 'app';

const FormItem = Form.Item;

class backPw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changePage: 1,

      codeStatus: false,
      count: 60, // 秒数初始化为60秒,

      phoneStatus: true,

      code: '',
    };

    // this.getCookie = (name) => {
    //   const arr = document.cookie.split('; ');
    //   for (let i = 0; i < arr.length; i++) {
    //     const arr2 = arr[i].split('=');
    //     if (arr2[0] === name) {
    //       return arr2[1];
    //     }
    //   }
    //   return '';
    // };
  }

  vali(params) {
    if (params.pwd !== params.pwd2) {
      message.error('两次输入密码不一致');
      return false;
    }
    return true;
  }

  // 修改密码
  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    const otherParams = {
      code: this.state.code,
      phone: this.state.phone,
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
      setTimeout(() => {
        this.context.router.push('/login');
      }, 1000);
    }).catch((err) => {
      this.setState({ pwld: false });
    });
  }

  goIndexHome() {
    this.context.router.push({ pathname: '/' });
    // this.context.router.push('/indexHome');
  }


  // setCookie(name, value, timeout) {
  //   const d = new Date();
  //   d.setDate(d.getDate() + timeout);
  //   document.cookie = `${name}=${value};expires=${d}`;
  // }

  // getCookie(name) {
  //   const arr = document.cookie.split('; ');
  //   for (let i = 0; i < arr.length; i++) {
  //     const arr2 = arr[i].split('=');
  //     if (arr2[0] === name) {
  //       console.log(arr2[1]);
  //       return arr2[1];
  //     }
  //   }
  //   return '';
  // }

  // 获取手机号
  inputAccount(e) {
    const account = e.target.value;
    this.setState({
      account,
    });
  }

  // 获取短信验证码
  handleClick() {
    // this.sendCode();
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
    const params = { phone: this.state.account };
    app.$api.userSendCode(params).then((res) => {
      message.success('验证码发送成功');
    });
  }

  // 校验验证码
  validateCode(params) {
    Object.assign(params, { phone: this.state.account });
    return app.$api.userValidateCode(params);
  }

  changeCode() {
    this.setState({
      changePage: 2,
    });
  }

  inputCode(e) {
    let flag;
    if (e.target.value.length >= 4) {
      flag = false;
    } else {
      flag = true;
    }
    this.setState({
      phoneStatus: flag,
    });
  }

  changePw(e) {
    e.preventDefault();
    const { phone, code } = this.props.form.getFieldsValue();
    this.setState({
      phone,
      code,
    });
    // this.validateCode(params).then((res) => {
    //   this.setState({
    //     changePage: 2,
    //   });
    // });
    this.setState({
      changePage: 2,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.login}>
        <div className={styles.wrap}>

          {/* {this.state.changePage === 1 && (<Form onSubmit={this.changeCode.bind(this)}>
            <div className={styles.left}>
              <div className={styles.leftCont}>
                <p className={styles.lTit}>找回密码</p>
                <div className={styles.lRow}>
                  <p>帐号</p>
                  <FormItem >{getFieldDecorator('account', {})(
                    <Input style={{ width: 280 }} placeholder="已验证手机号/邮箱" />,
              )}
                  </FormItem>
                </div>

                <div className={styles.lButton} >
                  <Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading} >提交</Button>
                </div>

              </div>
            </div>
          </Form>)} */}

          {this.state.changePage === 1 && (<Form onSubmit={this.changePw.bind(this)}>
            <div className={styles.left}>
              <div className={styles.leftCont}>
                <p className={styles.lTit} >找回密码</p>

                <div className={styles.datum}>
                  <div className={styles.datumRow}>
                    <p className={styles.name}>请输入帐号：</p>
                    <p className={styles.value} style={{ color: '#1D94D2' }}>
                      <FormItem >{getFieldDecorator('phone', {})(
                        <Input onInput={this.inputAccount.bind(this)} style={{ width: 270 }} placeholder="请输入帐号(手机号)" />,
              )}
                      </FormItem></p>
                  </div>
                </div>

                {/* <div className={styles.datum}>
                  <div className={styles.datumRow} style={{ color: '#999' }}>
                    <p className={styles.name}>已验证手机：</p>
                    <p className={styles.value}>15623412611</p>
                  </div>
                </div> */}

                <div className={styles.datum}>
                  <div className={styles.datumRow}>
                    <p className={styles.name}>手机验证码：</p>
                    <p className={styles.value} >
                      <FormItem >{getFieldDecorator('code', {})(
                        <Input style={{ width: 100 }} onChange={this.inputCode.bind(this)} placeholder="请输入效验码" />,
              )}
                      </FormItem>
                      <Button className={styles.code} type="primary" size="large" disabled={this.state.codeStatus} onClick={this.handleClick.bind(this)} > {!this.state.codeStatus ? <span>获取验证码</span> : <span>{`${this.state.count}s`}</span>
          }</Button>
                    </p>
                  </div>
                </div>

                <div className={styles.lButton} >
                  <Button type="primary" size="large" htmlType="submit" disabled={this.state.phoneStatus} loading={this.state.createdLoading} >提交</Button>
                </div>

              </div>
            </div>
          </Form>)}

          {this.state.changePage === 2 && (<Form onSubmit={this.handleSubmit.bind(this)}>
            <div className={styles.left}>
              <div className={styles.leftCont}>
                <p className={styles.lTit}>密码设置</p>
                <div className={styles.lRow}>
                  <p>密码</p>
                  <FormItem >{getFieldDecorator('pwd', {})(
                    <Input style={{ width: 280 }} placeholder="密码长度由8-20位字母，数字和符号组合" />,
              )}
                  </FormItem>
                </div>
                <div className={styles.lRow}>
                  <p>确认密码</p>
                  <FormItem >{getFieldDecorator('pwd2', {})(
                    <Input style={{ width: 280 }} placeholder="" />,
              )}
                  </FormItem>
                </div>
                <div className={styles.lButton} >
                  <Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading} >提交</Button>
                </div>

              </div>
            </div>
          </Form>)}

          <div className={styles.right}>
            <div className={styles.wrapBox}>
              <IndexSlide
                widthWrap={402}
                heightWrap={178}
                imgWrap="./images/img-ezjconth.png"
              />
              <img src="./images/img-ewelry.png" width="44" height="20" style={{ marginLeft: '20px' }} alt="欢迎来到ezj" />
            </div>
            <div className={styles.wbottom}>
              <img className={styles.slideImg} src="./images/img-wbottom.png" alt="欢迎来到ezj" />
            </div>
          </div>
        </div>

      </div>
    );
  }
}


backPw.propTypes = {
};

backPw.contextTypes = {
  router: PropTypes.object.isRequired,
};

const backPwFrom = Form.create()(backPw);
export default backPwFrom;
