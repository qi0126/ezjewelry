import http from './http';

class Api {
  constructor() {
    this.http = http;
  }

  // 上传图片的接口(成品)
  upImgs(params) {
    return this.http.upload(false, '/imagers/uploadImg', params);
  }
    // 3D图包上传（成品）
  uploadFile(params) {
    return this.http.upload(false, '/imagers/uploadFile', params);
  }

  // 3D图包上传（定制）
  uploadThreeDFile(params) {
    return this.http.upload(false, '/imagers/uploadThreeDFile', params);
  }


  // 线下Vipexc解析
  clientUploadFile(params) {
    return this.http.upload(false, '/client/uploadFile', params);
  }

  //  获取材质
  // 获取今日金价
  selectGoldlist(params) {
    return this.http.post(false, '/goldManage/selectGoldlist', params);
  }

  // 添加材质
  addGoldPrice(params) {
    return this.http.post(false, '/goldManage/addGoldPrice', params);
  }

  // 删除材质
  delectGoldPrice(params) {
    return this.http.post(false, '/goldManage/delectGoldPrice', params);
  }
  // 修改材质
  updateGoldPrice(params) {
    return this.http.post(false, '/goldManage/updateGoldPrice', params);
  }

  /**
   *  用户模块
   */

  // 添加店铺
  shopAdd(params) {
    return this.http.post(false, '/shop/add', params);
  }

  // 店铺列表
  shopList(params) {
    return this.http.post(false, '/shop/list', params);
  }

  // 添加设计师
  designAdd(params) {
    return this.http.post(false, '/design/add', params);
  }

  // 设计师列表
  designList(params) {
    return this.http.post(false, '/design/list', params);
  }

  // 添加供应商
  factoryAdd(params) {
    return this.http.post(false, '/factory/add', params);
  }

  // 供应商列表
  factoryList(params) {
    return this.http.post(false, '/factory/list', params);
  }

  // 登录
  userLogin(params) {
    return this.http.post(false, '/user/login', params, true);
  }

  // 我的信息
  userMyInfo(params) {
    return this.http.get(false, '/user/myinfo', params);
  }

  // 修改密码
  userChangPwd(params) {
    return this.http.post(false, '/user/changPwd', params);
  }

  // 退出登录
  userLogout(params) {
    return this.http.post(false, '/user/logout', params);
  }

  // 启用或禁用
  userEnaOrDisa(params) {
    return this.http.post(false, '/user/enaOrDisa', params);
  }

  // 查询证书
  getCert(params) {
    return this.http.get(false, '/getCert', params);
  }

  // 店铺首页修改
  shopEdit(params) {
    return this.http.post(false, '/shop/edit', params);
  }

  // 查看店铺臻选款
  selectHotgunStoreProduct(params) {
    return this.http.get(false, '/product/selectHotgunStoreProduct', params);
  }

  // 发送短信校验
  userSendCode(params) {
    return this.http.post(false, '/user/sendCode', params);
  }

  // 校验验证码
  userValidateCode(params) {
    return this.http.post(false, '/user/validateCode', params);
  }

  // 权限接口
  userGetAuth(params) {
    return this.http.get(false, '/user/getAuth', params);
  }

  // 店铺信息修改
  shopUpdate(params) {
    return this.http.post(false, '/shop/update', params);
  }

  // 设计师信息修改
  designEdit(params) {
    return this.http.post(false, '/design/edit', params);
  }

  // 供应商信息修改
  factoryEdit(params) {
    return this.http.post(false, '/factory/edit', params);
  }

  // 获取用户账号
  userGetAccount(params) {
    return this.http.post(false, '/user/getAccount', params);
  }

  // 平台修改其他人密码
  userChangPwd2(params) {
    return this.http.post(false, '/user/changPwd2', params);
  }

  // 修改权限时间
  userEditAuthTime(params) {
    return this.http.post(false, '/user/editAuthTime', params);
  }

  // 微信vip
  clientList(params) {
    return this.http.post(false, '/client/list', params);
  }

  // 新建线下vip
  clientAddInfo(params) {
    return this.http.post(false, '/client/addInfo', params);
  }

  // 修改线下vip
  clientUpdateInfo(params) {
    return this.http.post(false, '/client/updateInfo', params);
  }

  // 线下vip列表
  clientInfoList(params) {
    return this.http.post(false, '/client/infoList', params);
  }

  // 删除线下vip
  clientDelInfo(params) {
    return this.http.post(false, '/client/delInfo', params);
  }

  // 获取子账号信息
  getAuthByUserId(params) {
    return this.http.get(false, '/user/getAuthByUserId', params);
  }

  // 店铺子账号列表
  shopSubList(params) {
    return this.http.get(false, '/shop/subList', params);
  }

  // 添加店铺子帐号
  shopAddSub(params) {
    return this.http.post(false, '/shop/addSub', params);
  }

  // 设置子账号权限
  userUserAuth(params) {
    return this.http.post(false, '/user/userAuth', params);
  }

  // 设置子账号启用禁用
  enaOrDisaSub(params) {
    return this.http.post(false, '/user/enaOrDisaSub', params);
  }

  // 品类查询
  selectPinCategory(params) {
    return this.http.get(false, '/CommonManage/selectPinCategory', params);
  }

  // 查询下拉店员
  shopClerk(params) {
    return this.http.get(false, '/shop/clerk', params);
  }

  // 店铺销售数据添加
  addStoreSaleNumber(params) {
    return this.http.post(false, '/product/addStoreSaleNumber', params);
  }

  // 店铺销售数据查询
  selectStoreSaleNumber(params) {
    return this.http.post(false, '/product/selectStoreSaleNumber', params);
  }

  // 店铺销售数据修改
  updateStoreSaleNumber(params) {
    return this.http.post(false, '/product/updateStoreSaleNumber', params);
  }

  // 店铺销售删除
  deleteStoreSaleNumber(params) {
    return this.http.post(false, '/product/deleteStoreSaleNumber', params);
  }

  // 注册账号
  userRegister(params) {
    return this.http.post(false, '/user/register', params);
  }

  // 完善信息1（设计师）
  designStep1(params) {
    return this.http.post(false, '/design/step1', params);
  }

  // 完善信息2（设计师）
  designStep2(params) {
    return this.http.post(false, '/design/step2', params);
  }

  // 完善信息1（工厂）
  factoryStep1(params) {
    return this.http.post(false, '/factory/step1', params);
  }

  // 完善信息2（工厂）
  factoryStep2(params) {
    return this.http.post(false, '/factory/step2', params);
  }

  // 完善信息1（店铺）
  shopStep1(params) {
    return this.http.post(false, '/shop/step1', params);
  }

  // 完善信息1（店铺）
  shopStep2(params) {
    return this.http.post(false, '/shop/step2', params);
  }

  // 审核通过
  userExamine(params) {
    return this.http.post(false, '/user/examine', params);
  }


  /**
   *  挑选产品库模块
   */
  // 挑选设计师、供应商产品列表
  selectBrandPrudoctNumber(params) {
    return this.http.post(false, '/product/selectBrandPrudoctNumber', params);
  }
  // 店铺挑选产品
  choseProductToLibrary(params) {
    return this.http.post(false, '/product/choseProductToLibrary', params);
  }

  // 查询系列信息
  selectDesignerSeriecsById(params) {
    return this.http.post(false, '/CommonManage/selectDesignerSeriecsById', params);
  }

  /**
   *  平台管理
   */

  // 平台查询供应商审核产品
  factAuditProduct(params) {
    return this.http.post(false, '/product/selectPlatformAuditProduct', params);
  }
  // 平台查询设计师审核产品
  desAuditProduct(params) {
    return this.http.post(false, '/product/selectPlatformAuditProduct', params);
  }
  // 设计师、供应商待审核产品详细
  findProductByProductId(params) {
    return this.http.post(false, '/product/findProductByProductId', params);
  }
  // 设计师、供应商待审核产品详用
  updatePlatformProduct(params) {
    return this.http.post(false, '/product/updatePlatformProduct', params);
  }
  // 平台产品管理修改价格接口
  updatePlatProductTexturePrice(params) {
    return this.http.postJson(false, '/product/updatePlatProductTexturePrice', params);
  }
  // 设计师国家列表
  countryList(params) {
    return this.http.post(false, '/design/countryList', params);
  }
  // 根据国家编码查询设计师
  getByCode(params) {
    return this.http.post(false, '/design/getByCode', params);
  }
  // 平台查询产品库
  selectPlatformProductInfo(params) {
    return this.http.post(false, '/product/selectPlatformProductInfo', params);
  }
  // 查询钻石定制款（平台）
  getProductsByplatform(params) {
    return this.http.get(false, '/jewelry/getProductsByplatform', params);
  }
  // 对首饰处于处理中，显示审核中
  waitPassSaleStatu(params) {
    return this.http.post(false, '/jewelry/waitPassSaleStatu', params);
  }
  // 审核不通过钻石定制款（首饰）
  NOPassSaleStatu(params) {
    return this.http.post(false, '/jewelry/NOPassSaleStatu', params);
  }
  // 通过钻石定制款（首饰）
  passSaleStatu(params) {
    return this.http.post(false, '/jewelry/passSaleStatu', params);
  }
  // 查询钻石定制款（平台产品库）
  getplatformProductsStore(params) {
    return this.http.get(false, '/jewelry/getplatformProductsStore', params);
  }
  // 发布（取消）上下架（平台产品库）
  platformupdateSaleStatu(params) {
    return this.http.post(false, '/jewelry/platformupdateSaleStatu', params);
  }

  // 设计师国家添加、修改
  saveCountry(params) {
    return this.http.post(false, '/design/saveCountry', params);
  }
  // 刪除设计师国家
  delCountry(params) {
    return this.http.post(false, '/design/delCountry', params);
  }
  // 产品删除--适用于平台，设计师，供应商
  deleteProductInfo(params) {
    return this.http.post(false, '/product/deleteProductInfo', params);
  }
  // 修改产品的状态上架，下架--适用于平台、设计师，供应商
  updataProductStatus(params) {
    return this.http.post(false, '/product/updataProductStatus', params);
  }
  // 查询所有客户（店铺）
  queryAllShop() {
    return this.http.get(false, '/shop/all', {});
  }
  // 品类查询
  selectPinCategory() {
    return this.http.post(false, '/CommonManage/selectPinCategory', {});
  }
  // 品类添加
  addPinCategoryNumber(params) {
    return this.http.post(false, '/CommonManage/addPinCategoryNumber', params);
  }
  // 品类删除
  deletePinCategoryById(params) {
    return this.http.post(false, '/CommonManage/deletePinCategoryById', params);
  }



  /**
   *  店铺模块
   */
  // 查询店铺相关供应商
  selectStoreBrandCompany() {
    return this.http.get(false, '/product/selectStoreBrandCompany', {});
  }
  // 查询店铺相关设计师
  selectStoreBrandDesigner() {
    return this.http.get(false, '/product/selectStoreBrandDesigner', {});
  }
  // 店铺模块产品数据接口
  selectStoreProductInfo(params) {
    return this.http.post(false, '/product/selectStoreProductInfo', params);
  }
  // 店铺模块产品查询详情接口
  findStoreBrandProductById(params) {
    return this.http.post(false, '/product/findStoreBrandProductById', params);
  }
  // 店铺保存修改零售价
  saveStoreBrandProductDetail(params) {
    return this.http.post(false, '/product/saveStoreBrandProductDetail', params);
  }

  // 店铺选择相应的产品进行状态修改，可以选择多个，或者单个，上架，下架操作
  updateStoreBrandProductStatus(params) {
    return this.http.post(false, '/product/updateStoreBrandProductStatus', params);
  }

  // 店铺删除产品
  deleteStoreBrandProduct(params) {
    return this.http.post(false, '/product/deleteStoreBrandProduct', params);
  }
  // 店铺设置甄选款产品
  choseProductToHotgun(params) {
    return this.http.post(false, '/product/choseProductToHotgun', params);
  }

  // 查询钻石加价系数列表
  diamondListFare() {
    return this.http.get(false, '/diamond/listFare', {});
  }

  // 删除范围加价系数
  deleteFare(params) {
    return this.http.get(false, '/diamond/deleteFare', params);
  }

  // 新增范围加价系数
  addFare(params) {
    return this.http.post(false, '/diamond/addFare', params);
  }
  // 更新范围加价系数
  updateFare(params) {
    return this.http.post(false, '/diamond/updateFare', params);
  }

  // 钻石列表
  getDiamondList(params) {
    return this.http.post(false, '/diamond/list', params);
  }

  // 平台针对个体加价
  addFareLevel(params) {
    return this.http.post(false, '/diamond/addFareLevel', params);
  }
  // 成品款查询加价信息
  selectStoreMarkupPrice(params) {
    return this.http.get(false, '/product/selectStoreMarkupPrice', params);
  }

  // 成品款添加加价信息
  addMarkupPrice(params) {
    return this.http.post(false, '/product/addMarkupPrice', params);
  }

  // 成品款修改加价信息
  updataMarkupPrice(params) {
    return this.http.get(false, '/product/updataMarkupPrice', params);
  }
  // 店铺选择相应的产品进行统一的加价
  raiseStoreBandProduct(params) {
    return this.http.post(false, '/product/raiseStoreBandProduct', params);
  }
  // 查询钻石定制款（店铺）----供应商
  getFactoryProducts(params) {
    return this.http.get(false, '/jewelry/getFactoryProducts', params);
  }
    // 查询钻石定制款（店铺）----设计师
  getDesignerProducts(params) {
    return this.http.get(false, '/jewelry/getDesignerProducts', params);
  }

  // 给指定的产品指定售价（店铺）
  addProductprice(params) {
    return this.http.post(false, '/jewelry/addProductprice', params);
  }
  // 给指定的产品批量加价（店铺）
  addAllpriceByMony(params) {
    return this.http.post(false, '/jewelry/addAllpriceByMony', params);
  }
  // 给指定的产品批量案系数加价（店铺）
  addAllpriceByCoefficient(params) {
    return this.http.post(false, '/jewelry/addAllpriceByCoefficient', params);
  }

  /**
   *  设计师模块
   */
    // 查询所有设计师
  designAll() {
    return this.http.get(false, '/design/all', {});
  }

      // 查询所有供应商
  factoryAll() {
    return this.http.get(false, '/factory/all', {});
  }

  // 设计师产品数据接口
  DesignProductInfo(params) {
    return this.http.get(false, '/product/selectDesignProductInfo', params);
  }
  // 查询系列分类数据信息
  selectSeriecsListByOperateId() {
    return this.http.get(false, '/CommonManage/selectSeriecsListByOperateId', {});
  }
  // 查询分类数据信息
  selectCategoryNumber() {
    return this.http.get(false, '/CommonManage/selectCategoryNumber', {});
  }
  // 查询金价材质数据
  selectGoldlist() {
    return this.http.get(false, '/goldManage/selectGoldlist', {});
  }
  // 查询适合人群数据信息
  selectCrowdNumber() {
    return this.http.get(false, '/CommonManage/selectCrowdNumber', {});
  }
  // 打开产品详细资料+弹窗
  findProductByProductId(params) {
    return this.http.post(false, '/product/findProductByProductId', params);
  }
  // 供应商对产品的修改
  updateFactoryProduct(params) {
    return this.http.postJson(false, '/product/updateFactoryProduct', params);
  }
  // 设计师对产品的修改
  updateDesignerProduct(params) {
    return this.http.postJson(false, '/product/updateDesignerProduct', params);
  }
  // 提交新产品参数
  addProductNumber(params) {
    return this.http.postJson(false, '/product/addProductNumber', params);
  }
  // 设计师、供应商图片上传
  uploadImage(params) {
    return this.http.upload(false, '/imagers/uploadImage', params);
  }
  // 提交设计师产品
  addDesignProductNumber(params) {
    return this.http.postJson(false, '/product/addDesignProductNumber', params);
  }
  // 新增系列
  addSeriecsNumder(params) {
    return this.http.post(false, '/CommonManage/addSeriecsNumder', params);
  }
  // 产品3D图片调接口（店铺产品除外）——成品款
  selectFigureThumbUrl(params) {
    return this.http.post(false, '/product/selectFigureThumbUrl', params);
  }
    // 店铺3D图片调接口——成品款
  selectStoreFigureThumbUrl(params) {
    return this.http.post(false, '/product/selectStoreFigureThumbUrl', params);
  }
  // 产品3D图片调接口——钻石定制款
  selectThreeDUrl(params) {
    return this.http.get(false, '/jewelry/selectThreeDUrl', params);
  }

  // 修改系列
  updateSeriecsNumder(params) {
    return this.http.post(false, '/CommonManage/updateSeriecsNumder', params);
  }
  // 设计师商品销量报表
  designerSalesVolume(params) {
    return this.http.get(false, '/report/designerSalesVolume', params);
  }
  // 查看所有的系列
  selectAllSerie() {
    return this.http.get(false, '/jewelry/selectAllSerie', {});
  }
  // 查询所有的品类
  selectAllClassify() {
    return this.http.get(false, '/jewelry/selectAllClassify', {});
  }

  /**
   *  供应商模块
   */


  /**
   * 日志
   */
   // 查询日志
  findLogAll(params) {
    return this.http.get(false, '/log/find/logAll', params);
  }


  /**
   *  供应商模块
   */
  // 供应商产品数据接口
  selectFactoryProductInfo(params) {
    return this.http.post(false, '/product/selectFactoryProductInfo', params);
  }

   /**
   *  订单中心
   */
  // 查看公司接收到的订单(自有)
  receivedOrders(params) {
    return this.http.get(false, '/order/receivedOrders', params);
  }

  // 查看全部订单（全部）
  cusOrders(params) {
    return this.http.get(false, '/order/cusOrders', params);
  }

  // 查询订单详情数据（自有）
  receivedOrderDetail(params) {
    return this.http.get(false, '/order/receivedOrderDetail', params);
  }


  // 查询订单详情数据（全部）
  retailOrderDetail(params) {
    return this.http.get(false, '/order/retailOrderDetail', params);
  }


  // 订单操作
  operateGeneral(params) {
    return this.http.get(false, '/order/operateGeneral', params);
  }

  // 查看订单的状态筛选列表(自有)
  receivedOrderStatuList() {
    return this.http.get(false, '/order/receivedOrderStatuList', {});
  }

  // 查看订单时的状态筛选列表(全部)
  retailStatus() {
    return this.http.get(false, '/order/retailStatus', {});
  }

  /**
   *  钻石模块
   */
  // 查询所有款式品类
  queryClassifyInfo(params) {
    return this.http.get(false, '/jewelry/queryClassifyInfo', params);
  }
  // 查询款式品类对应的属性模板
  queryClassifyProps(params) {
    return this.http.get(false, '/jewelry/queryClassifyProps', params);
  }
  // 查询所有的系列---供应商查看
  querySeriesFac(params) {
    return this.http.get(false, '/jewelry/querySeriesFac', params);
  }
    // 创建系列
  createSerie(params) {
    return this.http.post(false, 'jewelry/createSerie', params);
  }

  // 修改系列
  updateSerie(params) {
    return this.http.post(false, '/jewelry/updateSerie', params);
  }
  // 查询所有的系列---设计师查看
  querySeriesDesi(params) {
    return this.http.get(false, '/jewelry/querySeriesDesi', params);
  }
  // 查询钻石定制款（供应商）
  getProductsByfactory(params) {
    return this.http.get(false, '/jewelry/getProductsByfactory', params);
  }

  // 查询钻石定制款（设计师）
  getProductsByDesigner(params) {
    return this.http.get(false, '/jewelry/getProductsByDesigner', params);
  }
  // 创建商品（砖石定制款（首饰））
  createProduct(params) {
    return this.http.post(false, '/jewelry/createProduct', params);
  }
  // 发布(取消)商品到平台
  updateSaleStatu(params) {
    return this.http.post(false, '/jewelry/updateSaleStatu', params);
  }
  // 对产品进行上下架操作（店铺）---供应商的
  updateSaleStatuByshopF(params) {
    return this.http.post(false, '/jewelry/updateSaleStatuByshopF', params);
  }
  // 对产品进行上下架操作（店铺）---设计师的
  updateSaleStatuByshopD(params) {
    return this.http.post(false, '/jewelry/updateSaleStatuByshopD', params);
  }
  // 删除钻石定制款（供应商与设计师要分开调）
  deleteProduct(params) {
    return this.http.post(false, '/jewelry/deleteProduct', params);
  }
  // 修改商品(供应商、设计师)
  updateProduct(params) {
    return this.http.post(false, '/jewelry/updateProduct', params);
  }
  // 编辑修改批发价格（平台产品库）
  updatePriceByPlatform(params) {
    return this.http.post(false, '/jewelry/updatePriceByPlatform', params);
  }
  // 删除钻石定制款（平台产品库)
  deleteProductByPlatform(params) {
    return this.http.post(false, '/jewelry/deleteProductByPlatform', params);
  }
  // 查看加价系数
  selectOldTactic(params) {
    return this.http.post(false, '/jewelry/selectOldTactic', params);
  }
}


export default new Api();

