import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Tabs, Table, DatePicker, Radio, Spin } from 'antd';
import PropTypes from 'prop-types';
import BatarHeaderTop from '../../components/batarHeaderTop/batarHeaderTop';
import BatarHeader from '../../components/batarHeader/batarHeader';
import BatarAside from '../../components/batarAside/batarAside';
// import BatarMain from '../../components/batarMain/batarMain';
import IndexHome from '../Login/IndexHome/IndexHome';
import BatarSuspend from '../../components/batarSuspend/batarSuspend';
import app from 'app';

import styles from './Index.less';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 初始化
      sideList: {
        id: 1,
        name: '挑选产品库',
        menuUrl: '/product/sellerPro',
        childs: [
          {
            id: 11,
            name: '商家品牌',
            menuUrl: '/product/sellerPro',
            auth: ',product-select,',
          },
          {
            id: 12,
            name: '设计师款',
            menuUrl: '/product/designerPro',
            auth: ',product-select,',
          },
        ],
      },
      // 列表
      tabList: [
        {
          id: 1,
          name: '挑选产品库',
          menuUrl: '/product/sellerPro',
          childs: [
            {
              id: 11,
              name: '商家品牌',
              menuUrl: '/product/sellerPro',
              auth: ',product-select,',
            },
            {
              id: 12,
              name: '设计师款',
              menuUrl: '/product/designerPro',
              auth: ',product-select,',
            },
          ],
        },
        {
          id: 2,
          name: '我的店铺',
          childs: [
            {
              id: 21,
              name: '店铺信息',
              menuUrl: '/myShop/shopInfo',
              auth: ',user-shop-info,',
            },
            {
              id: 23,
              name: '产品管理',
              menuUrl: '/myShop/myShopFinishProduct',
              childs: [
                {
                  id: 12,
                  name: '成品款',
                  menuUrl: '/myShop/myShopFinishProduct',
                  auth: ',product-shop-manage,',
                },
                {
                  id: 13,
                  name: '钻石定制款',
                  menuUrl: '/myShop/myShopCustomMade',
                  auth: ',product-shop-manage,',
                },
              ],
            },
            {
              id: 24,
              name: '钻石中心',
              menuUrl: '/myShop/DiamondIncrease',
              childs: [
                {
                  id: 244,
                  name: '钻石加价',
                  menuUrl: '/myShop/DiamondIncrease',
                  auth: ',dimond-shop-center,',
                },
                {
                  id: 245,
                  name: '钻石定制款',
                  menuUrl: '/myShop/DiamondRetail',
                  auth: ',dimond-shop-center,',
                },
              ],
            },
            {
              id: 25,
              name: '订单中心',
              menuUrl: '/myShop/ownOrder',
              childs: [
                {
                  id: 255,
                  name: '自有',
                  menuUrl: '/myShop/ownOrder',
                  auth: ',order-shop-own,',
                },
                {
                  id: 256,
                  name: '全部',
                  menuUrl: '/myShop/allOrder',
                  auth: ',order-shop-center,',
                },
              ],
            },
            {
              id: 26,
              name: '店铺管理',
              menuUrl: '/myShop/weChatVip',
              childs: [
                {
                  id: 261,
                  name: '微信VIP',
                  menuUrl: '/myShop/weChatVip',
                  auth: ',user-client-wechat,',
                },
                {
                  id: 262,
                  name: '线下VIP',
                  menuUrl: '/myShop/unLineVip',
                  auth: ',user-client-info,',
                },
                {
                  id: 263,
                  name: '店铺销售',
                  menuUrl: '/myShop/shopSale',
                  auth: ',product-sale,',
                },
                {
                  id: 264,
                  name: '消息推送',
                  menuUrl: '/myShop/messageSend',
                  auth: ',user-msg-send,',
                },
                {
                  id: 265,
                  name: '帐号管理',
                  menuUrl: '/myShop/accountMana',
                  auth: ',user-shop-manage,',
                },
              ],
            },
          ],
        },
        {
          id: 3,
          name: '作品库',
          childs: [
            {
              id: 32,
              name: '产品管理',
              menuUrl: '/designer/designerFinishProduct',
              childs: [
                {
                  id: 322,
                  name: '成品款',
                  menuUrl: '/designer/designerFinishProduct',
                  auth: ',product-design-manage,',
                },
                {
                  id: 323,
                  name: '钻石定制款',
                  menuUrl: '/designer/designerCustomMade',
                  auth: ',product-design-manage,',
                },
              ],
            },
            {
              id: 33,
              name: '销售数据',
              menuUrl: '/designer/saleData',
              auth: ',product-sale-design,',
            },
          ],
        },
        {
          id: 4,
          name: '个人中心',
          childs: [
            {
              id: 41,
              name: '我的资料',
              menuUrl: '/me',
              auth: ',LOGIN,',
            },
            {
              id: 42,
              name: '密码设置',
              menuUrl: '/me/passWord',
              auth: ',LOGIN,',
            },
          ],
        },
        {
          id: 5,
          name: '钻石证书查询',
          childs: [
            {
              id: 51,
              name: '',
              menuUrl: '/Certificate',
              auth: ',cert-select,',
            },
          ],
        },
        {
          id: 6,
          name: '平台管理',
          childs: [
            {
              id: 61,
              name: '账号管理',
              menuUrl: '/platformMana/accountMana',
              auth: ',user-manage,',
            },
            {
              id: 62,
              name: '产品审核',
              menuUrl: '/platformMana/productAudit',
              childs: [
                {
                  id: 633,
                  name: '成品款',
                  menuUrl: '/platformMana/productAudit',
                  auth: ',product-check,',
                },
                {
                  id: 634,
                  name: '钻石定制款',
                  menuUrl: '/platformMana/ProductCustomAudit',
                  auth: ',product-check,',
                },
              ],
            },
            {
              id: 63,
              name: '产品库管理',
              menuUrl: '/platformMana/platformFinishProduct',
              childs: [
                {
                  id: 633,
                  name: '成品款',
                  menuUrl: '/platformMana/platformFinishProduct',
                  auth: ',product-sys-manage,',
                },
                {
                  id: 634,
                  name: '钻石定制款',
                  menuUrl: '/platformMana/platformCustomMade',
                  auth: ',product-sys-manage,',
                },
              ],
            },
            {
              id: 24,
              name: '钻石中心',
              menuUrl: '/platformMana/DiamondIncrease',
              childs: [
                {
                  id: 244,
                  name: '钻石加价',
                  menuUrl: '/platformMana/DiamondIncrease',
                  auth: ',dimond-sys-center,',
                },
                {
                  id: 245,
                  name: '客户钻石管理',
                  menuUrl: '/platformMana/DiamondRetail',
                  auth: ',dimond-sys-center,',
                },
              ],
            },
            {
              id: 64,
              name: '订单中心',
              menuUrl: '/platformMana/ownOrder',
              // auth: ',order-sys-center,',
              childs: [
                {
                  id: 644,
                  name: '自有',
                  menuUrl: '/platformMana/ownOrder',
                  auth: ',order-sys-center,',
                },
                {
                  id: 645,
                  name: '全部',
                  menuUrl: '/platformMana/allOrder',
                  auth: ',order-sys-center,',
                },
              ],
            },
            {
              id: 641,
              name: '系统管理',
              menuUrl: '/platformMana/MaterManage',
              childs: [
                {
                  id: 642,
                  name: '材质管理',
                  menuUrl: '/platformMana/MaterManage',
                  auth: ',product-price,',
                },
                {
                  id: 643,
                  name: '设计师国家',
                  menuUrl: '/platformMana/DesignerCity',
                  auth: ',user-design-country,',
                },
                {
                  id: 644,
                  name: '日志查看',
                  menuUrl: '/platformMana/LogView',
                  auth: ',log-manage,',
                },
                {
                  id: 645,
                  name: '品类管理',
                  menuUrl: '/platformMana/classManage',
                  auth: ',product-category-manage,',
                },
              ],
            },
          ],
        },
        {
          id: 7,
          name: '产品管理',
          childs: [
            {
              id: 72,
              name: '产品管理',
              menuUrl: '/MyFactory/manageFinishProduct',
              childs: [
                {
                  id: 722,
                  name: '成品款',
                  menuUrl: '/MyFactory/manageFinishProduct',
                  auth: ',product-factory-manage,',
                },
                {
                  id: 723,
                  name: '钻石定制款',
                  menuUrl: '/MyFactory/manageCustomMade',
                  auth: ',product-factory-manage,',
                },
              ],
            },
            {
              id: 73,
              name: '订单中心',
              menuUrl: '/MyFactory/OrderCenter',
              auth: ',order-factory-center,',
            },
          ],
        },
      ],
    };
  }

  getSlide(item) {
    this.context.router.push(item.childs[0].menuUrl);
    item.childs.forEach((it) => {
      it.checked = false;
    });
    item.childs[0].checked = true;
    this.setState({
      sideList: item,
    });
  }

  async getAuth() {
    if (app.$storage.get('accessToken')) {
      await app.$api.userGetAuth().then((res) => {
        let authList;
        if (res.data) {
          authList = res.data;
          app.$storage.set('authList', authList);
        }
      });
      await this.hanlderAuth();
    }
  }

  // 处理路由权限
  hanlderAuth() {
    this.state.tabList.forEach((item) => {
      item.childs.forEach((it) => {
        if (app.$tool.judAuth(it.auth)) {
          item.hasAuth = true;
          it.hasAuth = true;
          if (it.childs) {
            it.menuUrl = it.childs[0].menuUrl;
          }
        }
        if (it.childs) {
          it.childs.forEach((iit) => {
            if (app.$tool.judAuth(iit.auth)) {
              item.hasAuth = true;
              it.hasAuth = true;
              iit.hasAuth = true;
            }
          });
        }
      });
    });
    this.setState({
      tabList: this.state.tabList,
    });
  }

  // 展示全部路由
  showTotal() {
    this.state.tabList.forEach((item) => {
      item.childs.forEach((it) => {
        item.hasAuth = true;
        it.hasAuth = true;
        if (it.childs) {
          it.childs.forEach((iit) => {
            item.hasAuth = true;
            it.hasAuth = true;
            iit.hasAuth = true;
          });
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {

  }


  componentDidMount() {
    this.getAuth();
    // this.showTotal();
    let itemTrue = '';
    // 头部选中样式
    this.state.tabList.forEach((item) => {
      item.childs.forEach((it) => {
        if (it.menuUrl === app.$storage.get('urlHistory')) {
          item.checked = true;
          it.checked = true;
          it.slide = true;
          itemTrue = item;
          this.setState({
            tabList: this.state.tabList,
          });
        }
        // 三级菜单显示
        if (it.childs && app.$storage.get('urlHistoryTwo')) {
          it.childs.forEach((iit) => {
            if (iit.menuUrl === app.$storage.get('urlHistoryTwo')) {
              iit.checked = true;
            }
          });
        }
      });
    });

    if (app.$storage.get('urlHistory')) {
      this.setState({
        sideList: itemTrue,
      });
    }

    if (!this.props.routes[1].path) {
      this.state.tabList.forEach((item) => {
        item.checked = false;
      });
    }
  }

  render() {
    const { show } = this.state;
    return (
      <Spin tip="Loading..." spinning={false}>
        <div className={styles.bodyWrap}>
          <BatarHeaderTop />
          <BatarHeader tabList={this.state.tabList} changeSide={(item) => { this.getSlide(item); }} />
          <div className={styles.contentWrap}>
            {this.props.routes[1].path && <BatarAside sideList={this.state.sideList} />}
            {/* <BatarMain></BatarMain> */}
            {!this.props.routes[1].path ? <IndexHome /> :
            (
              <div className={styles.mainWrap}>
                {this.props.children}
              </div>)}
          </div>

          <BatarSuspend />
        </div>
      </Spin>
    );
  }

}

Index.propTypes = {
  children: PropTypes.object.isRequired,
};

Index.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Index;
