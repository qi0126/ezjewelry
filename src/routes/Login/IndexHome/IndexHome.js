import React from 'react';
import styles from './IndexHome.less';
import PropTypes from 'prop-types';
import IndexSlide from '@/components/indexSlide/indexSlide';
import app from 'app';

class IndexHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: '@',
    };
  }

  componentDidMount() {
    if (!app.$storage.get('urlHistory')) {
      this.context.router.push('/home');
    }
    app.$storage.set('urlHistory', '/');
  }

  render() {
    return (
      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.wrapBox}>
            <IndexSlide imgWrap="./images/img-ezjconth.png" />
            <img src="./images/img-ewelry.png" width="44" height="20" style={{ marginLeft: '20px' }} alt="欢迎来到ezj" />
          </div>
          <div className={styles.wbottom}>
            <img className={styles.slideImg} src="./images/img-wbottom.png" alt="欢迎来到ezj" />
          </div>
        </div>
        {/* <div className="gs-bottom" style={{ width: `1200` }}>Copyright 2018 深圳市中谷科技文化有限公司版权所有。 <span className="c00"> <a href="http://www.miitbeian.gov.cn" target="_blank" >粤ICP备17002323号-1</a> </span> </div> */}

      </div>
    );
  }
}


IndexHome.propTypes = {

};

IndexHome.contextTypes = {
  router: PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
};

export default IndexHome;
