import React from 'react';
import PropTypes from 'prop-types';
import styles from './batarHeader.less';
import app from 'app';

class batarHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  clickItem(item) {
    this.props.tabList.forEach((it) => {
      it.checked = false;
    });
    item.checked = true;
    this.setState({
      item,
    });

    // 重置侧边栏选中状态
    item.childs.forEach((it) => {
      it.checked = false;
      if (it.childs) {
        it.childs.forEach((iit) => {
          iit.checked = false;
        });
      }
    });

    // 点击菜单储存第一个侧边栏样式
    app.$storage.set('urlHistory', item.childs[0].menuUrl);
    app.$storage.remove('urlHistoryTwo');
    this.props.changeSide(item);
  }

  render() {
    return (
      <div className={styles.headerWrap}>
        <div className={styles.headerCont}>
          <img src="./images/img-logo.png" width="90" height="42" />
          <div className={styles.headerTab}>
            {this.props.tabList.map((item) => {
              return (item.hasAuth &&
              <p className={item.checked && styles.on} key={item.name} onClick={() => { this.clickItem(item); }}>{item.name}</p>);
            })}
          </div>
        </div>
      </div>

    );
  }
}

batarHeader.propTypes = {
  tabList: PropTypes.array,
};

export default batarHeader;
