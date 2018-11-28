// import React from 'react';
// import { Router, Route, Switch } from 'dva/router';
// import PropTypes from 'prop-types';
// import IndexPage from './routes/IndexPage';
// import Index from './routes/Index/Index';
// import Me from './routes/Me/Me';

// import Products from './routes/Products';

import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'dva/router';
// import App from './routes/App';
import Index from './routes/Index/Index';
import Home from './routes/Login/Home/Home';

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model);
  }
};

const Routers = ({
  history,
  // app,
}) => {
  const routes = [{
    path: '/',
    component: Index,
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, {
          component: require('./routes/Index/Index'),
        });
      }, 'index');
    },
    childRoutes: [
      // 富文本 組件
      {
        path: 'editor',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./components/umeditor/umeditor'));
          }, 'umeditor-umeditor');
        },
      },

      // 默认选择页面
      // indexHome
      {
        path: 'indexHome',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Login/IndexHome/IndexHome'));
          }, 'login-indexHome');
        },
      },


      /**
       * 个人中心
       */

      // 我的资料
      {
        path: 'me',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Me/Me/Me'));
          }, 'me');
        },
      },
      // 更改密码
      {
        path: 'me/passWord',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Me/PassWord/PassWord'));
          }, 'me-passWord');
        },
      },

      /**
       * 平台管理
       */
      // 账户管理
      {
        path: 'platformMana/accountMana',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/AccountMana/AccountMana'));
          }, 'platformMana-accountMana');
        },
      },
      // 创建店铺
      {
        path: 'platformMana/accountMana/createShop',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/AccountMana/CreateShop/CreateShop'));
          }, 'platformMana-accountMana-createShop');
        },
      },
      // 创建设计师
      {
        path: 'platformMana/accountMana/createDesigner',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/AccountMana/CreateDesigner/CreateDesigner'));
          }, 'platformMana-accountMana-createDesigner');
        },
      },
      // 创建供应商
      {
        path: 'platformMana/accountMana/createPlat',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/AccountMana/CreatePlat/CreatePlat'));
          }, 'platformMana-accountMana-createPlat');
        },
      },
      // 店铺审核
      {
        path: 'platformMana/shopApply',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/ShopApply/ShopApply'));
          }, 'platformMana-shopApply');
        },
      },
      // 设计师审核
      {
        path: 'platformMana/designerApply',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/DesignerApply/DesignerApply'));
          }, 'platformMana-shopApply');
        },
      },
      // 产品审核
      {
        path: 'platformMana/productAudit',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/ProductAudit/ProductAudit'));
          }, 'platformMana-productAudit');
        },
      },
      // 产品审核
      {
        path: 'platformMana/productCustomAudit',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/ProductCustomAudit/ProductCustomAudit'));
          }, 'platformMana-productCustomAudit');
        },
      },
      // 产品库管理------------成品款
      {
        path: 'platformMana/platformFinishProduct',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            // registerModel(app, require('models/dashboard'))
            cb(null, require('./routes/PlatformMana/proManage/platformFinishProduct'));
          }, 'platformFinishProduct');
        },
      },
     // 产品库管理------------钻石定制款
      {
        path: 'platformMana/platformCustomMade',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
          // registerModel(app, require('models/dashboard'))
            cb(null, require('./routes/PlatformMana/proManage/platformCustomMade'));
          }, 'platformCustomMade');
        },
      },
      // 订单中心------（平台管理）
      // {
      //   path: 'platformMana/OrderCenter',
      //   getComponent(nextState, cb) {
      //     require.ensure([], (require) => {
      //       cb(null, require('./routes/PlatformMana/OrderCenter/OrderCenter'));
      //     }, 'platformMana-OrderCenter');
      //   },
      // },
      // 订单中心-----------自有
      {
        path: 'platformMana/ownOrder',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/OrderCenter/ownOrder'));
          }, 'platformMana-ownOrder');
        },
      },
       // 订单中心-----------全部
      {
        path: 'platformMana/allOrder',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/OrderCenter/allOrder'));
          }, 'platformMana-allOrder');
        },
      },
      // 钻石定制款
      // {
      //   path: 'platformMana/OrderCustomMade',
      //   getComponent(nextState, cb) {
      //     require.ensure([], (require) => {
      //       cb(null, require('./routes/PlatformMana/OrderCenter/OrderCustomMade'));
      //     }, 'platformMana-OrderCustomMade');
      //   },
      // },
      // 自有订单详情
      {
        path: 'platformMana/ownOrderDetails',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/OrderCenter/OrderDetails/ownOrderDetails'));
          }, 'platformMana-ownOrderDetails');
        },
      },
      // 订单详情(全部)
      {
        path: 'platformMana/allOrderDetails',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
             // cb(null, require('./routes/platformMana/OrderCenter/OrderDetails/OrderDetails'));
            cb(null, require('./routes/PlatformMana/OrderCenter/OrderDetails/allOrderDetails'));
          }, 'platformMana-allOrderDetails');
        },
      },
      // 材质管理
      {
        path: 'platformMana/MaterManage',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/MaterManage/MaterManage'));
          }, 'platformMana-MaterManage');
        },
      },
      // 设计师国家
      {
        path: 'platformMana/DesignerCity',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/DesignerCity/DesignerCity'));
          }, 'platformMana-DesignerCity');
        },
      },
      //日志查看
      {
        path: 'platformMana/LogView',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/LogView/LogView'));
          }, 'platformMana-LogView');
        },
      },
      //品类管理
      {
        path: 'platformMana/classManage',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/classManage/classManage'));
          }, 'platformMana-classManage');
        },
      },
      // 钻石加价
      {
        path: 'platformMana/DiamondIncrease',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/DiamondCenter/DiamondIncrease'));
          }, 'platformMana-DiamondIncrease');
        },
      },
       // 客户钻石管理
      {
        path: 'platformMana/DiamondRetail',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/PlatformMana/DiamondCenter/DiamondRetail'));
          }, 'platformMana-DiamondRetail');
        },
      },
      /**
       * 我的店铺
       */

      // 店铺信息
      {
        path: 'myShop/shopInfo',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/ShopInfo/ShopInfo'));
          }, 'myShop-shopInfo');
        },
      },
      // 上传产品
      {
        path: 'myShop/uploadPro',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/uploadPro/uploadPro'));
          }, 'myShop-uploadProduct');
        },
      },

      // 产品管理-----成品款
      {
        path: 'myShop/myShopFinishProduct',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/proManage/myShopFinishProduct'));
          }, 'myShopFinishProduct');
        },
      },
       // 产品管理-----钻石定制款
      {
        path: 'myShop/myShopCustomMade',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/proManage/myShopCustomMade'));
          }, 'myShopCustomMade');
        },
      },
      // 订单中心-----------自有
      {
        path: 'myShop/ownOrder',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/OrderCenter/ownOrder'));
          }, 'myShop-ownOrder');
        },
      },
       // 订单中心-----------全部
      {
        path: 'myShop/allOrder',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/OrderCenter/allOrder'));
          }, 'myShop-allOrder');
        },
      },
      // 订单中心-----钻石定制款
      // {
      //   path: 'myShop/OrderCustomMade',
      //   getComponent(nextState, cb) {
      //     require.ensure([], (require) => {
      //       cb(null, require('./routes/Myshop/OrderCenter/OrderCustomMade'));
      //     }, 'myShop-OrderCustomMade');
      //   },
      // },

      // 订单详情(自有)
      {
        path: 'myShop/ownOrderDetails',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/OrderCenter/OrderDetails/ownOrderDetails'));
          }, 'myShop-orderDetails');
        },
      },

      // 订单详情（全部）
      {
        path: 'myShop/allOrderDetails',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/OrderCenter/OrderDetails/allOrderDetails'));
          }, 'myShop-orderDetails');
        },
      },

      // 订单详情
      // {
      //   path: 'myShop/OrderDetails',
      //   getComponent(nextState, cb) {
      //     require.ensure([], (require) => {
      //       cb(null, require('./routes/Myshop/OrderCenter/OrderDetails/OrderDetails'));
      //     }, 'myShop-orderDetails');
      //   },
      // },

      // 钻石加价
      {
        path: 'myShop/DiamondIncrease',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/DiamondCenter/DiamondIncrease'));
          }, 'DiamondIncrease');
        },
      },

      // 钻石零售库
      {
        path: 'myShop/DiamondRetail',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/DiamondCenter/DiamondRetail'));
          }, 'DiamondRetail');
        },
      },

      // 店铺管理

      // 微信VIP
      {
        path: 'myShop/weChatVip',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/ShopMana/weChatVip'));
          }, 'myShop-weChatVip');
        },
      },

      // 线下VIP
      {
        path: 'myShop/unLineVip',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/ShopMana/unLineVip'));
          }, 'myShop-unLineVip');
        },
      },

      // 店铺销售
      {
        path: 'myShop/shopSale',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/ShopMana/shopSale'));
          }, 'myShop-shopSale');
        },
      },

      // 消息推送
      {
        path: 'myShop/messageSend',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/ShopMana/messageSend'));
          }, 'myShop-messageSend');
        },
      },

      // 账号管理
      {
        path: 'myShop/accountMana',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Myshop/ShopMana/accountMana'));
          }, 'myShop-accountMana');
        },
      },

      /**
       * 挑选产品库
       */
      // 供应商款
      {
        path: 'product/sellerPro',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Product/SellerPro/SellerPro'));
          }, 'sellerPro');
        },
      },
      // 设计师款
      {
        path: 'product/designerPro',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Product/DesignerPro/DesignerPro'));
          }, 'designerPro');
        },
      },

      /*
       * 设计师模块
       */
      // 上传作品
      {
        path: 'designer/uploadPro',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Designer/uploadPro/uploadPro'));
          }, 'uploadPro');
        },
      },
      // 上传钻石定制款
      {
        path: 'designer/uploadProCustom',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Designer/uploadPro/uploadProCustom'));
          }, 'uploadProCustom');
        },
      },
      // 产品管理-----------成品款
      {
        path: 'designer/designerFinishProduct',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Designer/proManage/designerFinishProduct'));
          }, 'designerFinishProduct');
        },
      },
      // 产品管理-----------钻石定制款
      {
        path: 'designer/designerCustomMade',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Designer/proManage/designerCustomMade'));
          }, 'designerCustomMade');
        },
      },
      // 销售数据
      {
        path: 'designer/saleData',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Designer/saleData/saleData'));
          }, 'saleData');
        },
      },
      /*
       * 我的供应商
       */
      // 上传作品
      {
        path: 'MyFactory/uploadPro',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/MyFactory/uploadPro/uploadPro'));
          }, 'myfamUploadPro');
        },
      },
      // 产品管理---------成品款
      {
        path: 'MyFactory/manageFinishProduct',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/MyFactory/proManage/manageFinishProduct'));
          }, 'manageFinishProduct');
        },
      },
       // 产品管理---------钻石定制款
      {
        path: 'MyFactory/manageCustomMade',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/MyFactory/proManage/manageCustomMade'));
          }, 'manageCustomMade');
        },
      },
      // 产品管理---------钻石定制款上传
      {
        path: 'MyFactory/uploadProCustom',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/MyFactory/uploadPro/uploadProCustom'));
          }, 'uploadProCustom');
        },
      },
      // 订单中心-----成品款（我的供应商）
      {
        path: 'MyFactory/OrderCenter',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/MyFactory/orderCenter/orderCenter'));
          }, 'myfamOrderCenter');
        },
      },
      // 订单中心-----钻石定制款（我的供应商）
      // {
      //   path: 'MyFactory/OrderCustomMade',
      //   getComponent(nextState, cb) {
      //     require.ensure([], (require) => {
      //       cb(null, require('./routes/MyFactory/orderCenter/OrderCustomMade'));
      //     }, 'OrderCustomMade');
      //   },
      // },
      // 订单详情
      {
        path: 'MyFactory/OrderDetails',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/MyFactory/orderCenter/OrderDetails/OrderDetails'));
          }, 'MyFactoryOrderDetail');
        },
      },
      /**
       * 钻石证书查询
       */
      {
        path: 'Certificate',
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./routes/Certificate/Certificate/Certificate'));
          }, 'Certificate');
        },
      },
    ],
  }, {
    //  主页
    path: '/home',
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, {
          component: require('./routes/Login/Home/Home'),
        });
      }, 'login-home');
    },
  },
  {
    // 登录
    path: '/login',
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, {
          component: require('./routes/Login/Login/Login'),
        });
      }, 'login-login');
    },
  },
  {
    // 注册
    path: '/register',
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, {
          component: require('./routes/Login/Register/Register'),
        });
      }, 'login-register');
    },
  },
  {
    // 忘记密码
    path: '/backPw',
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, {
          component: require('./routes/Login/backPw/backPw'),
        });
      }, 'login-backPw');
    },
  },

  // 完善信息
    /**
     * 申请店铺
     */
    // 完善信息
  {
    path: '/applyShop',
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, {
          component: require('./routes/ApplyShop/CompleteInfo/CompleteInfo'),
        });
      }, 'applyShop-completeInfo');
    },
  },

    /**
     * 申请设计师
     */
    // 完善信息
  {
    path: '/applyDesigner',
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, {
          component: require('./routes/ApplyDesigner/CompleteInfo/CompleteInfo'),
        });
      }, 'applyDesigner-completeInfo');
    },
  },

  /**
   * 申请供应商
   */
  // 完善信息
  {
    path: '/applyFactory',
    getIndexRoute(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, {
          component: require('./routes/ApplyFactory/CompleteInfo/CompleteInfo'),
        });
      }, 'applyFactory-completeInfo');
    },
  },

  ];

  return (<Router history={history} routes={routes} />);
};


Routers.propTypes = {
  history: PropTypes.object,
  // app: PropTypes.object,
};

export default Routers;
