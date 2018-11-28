import React from 'react';
import styles from './Home.less';
import PropTypes from 'prop-types';
import IndexSlide from '@/components/indexSlide/indexSlide';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: '@',
    };
  }

  componentDidMount() {

  }

  login() {
    this.context.router.push('/login');
  }

  goRegister() {
    this.context.router.push('/register');
  }


  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.cont} />
            <div className={styles.left}>
              <p onClick={this.login.bind(this)}>账号登录</p>
              <p style={{ marginTop: '12px' }} onClick={this.goRegister.bind(this)}>申请合作/注册</p>
            </div>
          </div>

          <div className={styles.wrapBox}>
            <IndexSlide />
            <img src="./images/img-ewelry.png" width="44" height="20" style={{ marginLeft: '20px' }} alt="欢迎来到ezj" />
          </div>
          <div className={styles.wbottom}>
            <img className={styles.slideImg} src="./images/img-wbottom.png" alt="欢迎来到ezj" />
          </div>

        </div>

        <div className="gs-bottom">Copyright 2018 深圳市中谷科技文化有限公司版权所有。 <span className="c00"> <a href="http://www.miitbeian.gov.cn" target="_blank" >粤ICP备17002323号-1</a> </span> </div>
      </div>
    );
  }
}


Home.propTypes = {

};

Home.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Home;
