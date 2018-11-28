import React from 'react';
import styles from './Login.less';
import PropTypes from 'prop-types';
import { Input, Button, Checkbox, Form, message } from 'antd';
import IndexSlide from '@/components/indexSlide/indexSlide';
import app from 'app';

const FormItem = Form.Item;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createdLoading: false,
      account: '',
      password: '',
      checked: false,
    };
  }

  componentDidMount() {
    if (document.cookie) {
      const cook = document.cookie;
      const cookOne = cook.split(';');
      const account = cookOne[cookOne.length - 1].split('=')[0].trim();
      const password = cookOne[cookOne.length - 1].split('=')[1].trim();
      this.setState({
        checked: true,
        account,
        password,
      });
      // console.log(app.$tool.cook.getCookie(name));
    }
    // app.$tool.cook.getCookie(params.account, params.password);
  }


  // 登录
  handleSubmit(e) {
    const { checked } = this.state;
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    // Object.assign(params, { arr: JSON.stringify([{ c: 3 }]) });
    const { account, password } = params;
    this.setState({ createdLoading: true });
    app.$api.userLogin(params).then((res) => {
      app.$storage.set('accessToken', res.data);
      if (checked) {
        app.$tool.cook.setCookie(account, password);
      }
      this.goNext();
      this.setState({ createdLoading: false });
    }).catch((err) => {
      this.setState({ createdLoading: false });
      // 未完善信息处理
      if (err.code === 1002) {
        app.$storage.set('accessToken', err.data);
        if (checked) {
          app.$tool.cook.setCookie(account, password);
        }
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

  // 修改密码
  backPw() {
    this.context.router.push('/backPw');
  }

  changeSave(e) {
    this.setState({
      checked: e.target.checked,
    });
  }

  goRegister() {
    this.context.router.push('/register');
  }

  changePhone(e) {
    const name = e.target.value;
    this.setState({
      password: app.$tool.cook.getCookie(name) || '',
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { checked, account, password } = this.state;
    return (
      <div className={styles.login}>
        <div className={styles.wrap}>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <div className={styles.left}>
              <div className={styles.leftCont}>
                <p className={styles.lTit}>登录您的个人帐号</p>
                <div className={styles.lRow}>
                  <p>帐号</p>
                  <FormItem >{getFieldDecorator('account', { initialValue: account })(
                    <Input style={{ width: 280 }} onChange={this.changePhone.bind(this)} placeholder="请输入您的手机号或邮箱" />,
              )}
                  </FormItem>
                </div>
                <div className={styles.lRow}>
                  <p>密码</p>
                  <FormItem >{getFieldDecorator('password', { initialValue: password })(
                    <Input type="password" style={{ width: 280 }} placeholder="请输入您的密码" />,
              )}
                  </FormItem>
                </div>
                <div className={styles.password}>
                  <p onClick={this.backPw.bind(this)}>忘记密码?</p>
                  <div><Checkbox checked={checked} onChange={this.changeSave.bind(this)}>记住密码</Checkbox></div>
                </div>
                <div className={styles.lButton} >
                  <Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading} >登录</Button>
                </div>
                <div className={styles.noAccount}>
                  <p>还没有账号?<span onClick={this.goRegister.bind(this)}>立即注册</span> </p>
                </div>
              </div>
            </div>
          </Form>

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

            <div className="gs-bottom" style={{ width: 'inherit' }}>Copyright 2018 深圳市中谷科技文化有限公司版权所有。 <span className="c00"> <a href="http://www.miitbeian.gov.cn" target="_blank" >粤ICP备17002323号-1</a> </span> </div>

          </div>

        </div>


      </div>
    );
  }
}


Login.propTypes = {
};

Login.contextTypes = {
  router: PropTypes.object.isRequired,
};

const LoginFrom = Form.create()(Login);
export default LoginFrom;
