import React from 'react';
import PropTypes from 'prop-types';
import styles from './batarHeaderTop.less';
import { message } from 'antd';
import app from 'app';


class batarHeaderTop extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      result: {
        account: '',
      },
    };
  }

  componentDidMount() {
    if (app.$storage.get('accessToken')) {
      this.getMyInfo();
    }
  }

  getMyInfo() {
    app.$api.userMyInfo().then((res) => {
      this.setState({
        result: res.data,
        imgSlide: false,
      });
    });
  }

  imgSlide(self, e) {
    self.setState({
      imgSlide: !this.state.imgSlide,
    });
  }

  userLogout() {
    const params = {};
    app.$api.userLogout(params).then((res) => {
      message.success('退出成功');
      app.$storage.remove('accessToken');
      this.context.router.push('/login');
    });
  }

  render() {
    return (
      <div className={styles.headerTopWrap}>
        <div className={styles.headerTopCont}>
          <p className={styles.htAccount} onClick={(e) => { this.imgSlide(this, e); }}>帐号
           <span >{this.state.result && this.state.result.account}
             <span className={styles.imgSlide}> {this.state.imgSlide ? <img src="./images/icon-down.png" /> : <img style={{ marginTop: '4px' }} src="./images/icon-up.png" /> }
             </span>
             {this.state.imgSlide ? (<ul className={styles.htaList}>
               <li onClick={this.userLogout.bind(this)}>退出登录</li>
             </ul>) : ''}
           </span>
          </p>
          {/* <p className={styles.htMessage}>消息
            </p>
          <p className={styles.htLg}>中文
            <span>></span>
          </p> */}
        </div>
      </div>
    );
  }

}

batarHeaderTop.propTypes = {
    // products: PropTypes.array.isRequired,
};

batarHeaderTop.contextTypes = {
  router: PropTypes.object.isRequired,
};


export default batarHeaderTop;
