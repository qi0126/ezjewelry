import React from 'react';
import { Table } from 'antd';
import { Modal, Button, Pagination, Spin } from 'antd';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import app from 'app';
import $$ from 'jquery';

import { connect } from 'dva';
import styles from './ProductAudit.less';

import DesUpload from './common/DesUpload/DesUpload';
import FactoryUpload from './common/FactoryUpload/FactoryUpload';
import ShopUpload from './common/ShopUpload/ShopUpload';

const TabPane = Tabs.TabPane;

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号',
  address: '西湖区湖底公园1号',
  job: 'xxx',
  startTime: 'xxx',
  endTime: 'xxx',
  status: 'xxx',
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号',
  job: 'xxx',
  startTime: 'xxx',
  endTime: 'xxx',
  status: 'xxx',
}];

const shopCol = [{
  title: <span style={{ display: 'table', margin: '0 auto' }}>账户</span>,
  dataIndex: 'name',
  key: 'name',
}, {
  title: <span style={{ display: 'table', margin: '0 auto' }}>店铺名称</span>,
  dataIndex: 'age',
  key: 'age',
}, {
  title: <span style={{ display: 'table', margin: '0 auto' }}>申请人</span>,
  dataIndex: 'address',
  key: 'address',
}, {
  title: <span style={{ display: 'table', margin: '0 auto' }}>实体店</span>,
  dataIndex: 'job',
  key: 'job',
}, {
  title: <span style={{ display: 'table', margin: '0 auto' }}>申请时间</span>,
  dataIndex: 'startTime',
  key: 'startTime',
}, {
  title: <span style={{ display: 'table', margin: '0 auto' }}>权限到期</span>,
  dataIndex: 'endTime',
  key: 'endTime',
}, {
  title: <span style={{ display: 'table', margin: '0 auto' }}>状态</span>,
  dataIndex: 'status',
  key: 'status',
  render: () => (
    <div>
      <Button type="primary">启用</Button>
      <Button type="primary" style={{ marginLeft: 10 }} ghost>禁用</Button>
    </div>
  ),
}];

class ProductAudit extends React.Component {
  constructor(props) {
    super(props);
    const self = this;
    this.state = {
      searchName: '', // 搜索关键字
      tabKay: 1, // 当前选项卡的key值
      visibleShop: false,
      visibleDes: false,
      visibleFact: false,
      loadingShop: false,
      loadingDes: false,
      loadingPlat: false,
      operations: '',
      designerProList: [], // 设计产品列表
      factoryProList: [], // 供应商产品列表

      categoryList: [], // 分类列表

      // 当前type
      type: 'DESIGNER',


      pageIndex: 1, // 当前页
      pageSize: 10, // 每页展示条数
      totalNum: 0, // 总条数设计师
      totalNumFact: 0, // 总条数供应商
      current: '',
      ModelAmount: 6,
      proLoading: true, // 产品加载中属性
    };
  }
  // 产品状态 0 暂存 1 上架 2 下架
  proStatusDisplay(productStatus) {
    switch (productStatus) {
      case 0:
        return (
          <span>暂存待审核</span>
        );
        break;
      case 1:
        return (
          <span>上架</span>
        );
        break;
      case 2:
        return (
          <span>下架</span>
        );
        break;
      default:
        break;
    }
  }
  // 审核状态 1 未审核 2 审核中 3 通过 4 拒绝
  auditStatusDisplay(auditStatus) {
    switch (auditStatus) {
      case 0:
        return (
          <span>暂存待审核</span>
        );
        break;
      case 1:
        return (
          <span>待审核</span>
        );
        break;
      case 3:
        return (
          <span>通过</span>
        );
        break;
      case 4:
        return (
          <span>审核不通过</span>
        );
        break;
      default:
        break;
    }
  }
  componentDidMount() {
    const self = this;
    // this.getList();
    this.getClassifyId();
    // this.getFactAuditProduct(1, 12);
  }


  getClassifyId() {
    this.setState({
      proLoading: true,
    });
    app.$api.selectCategoryNumber().then((res) => {
      const tempData = res.data;
      const arr = [{
        text: '全部',
        value: ' ',
      }];
      const list = tempData.map((item) => {
        return {
          text: item.commonName,
          value: item.id,
        };
      });
      const categoryList = arr.concat(list);
      this.setState({
        categoryList,
      }, () => {
        this.getList();
        this.getProList(2, 1); // 查询设计师上传数据信息
        // this.getProList(1, 1); // 查询供应商上传数据信息
      });
    });
  }

  getList() {
    const self = this;
    this.setState({
      factCol: [{// 供应商产品列表样式
        title: <span style={{ display: 'table', margin: '0 auto' }}>产品图片</span>,
        dataIndex: 'productImageUrl',
        key: 'productImageUrl',
        render: (text, record) => (
          <span >
            <img src={app.$http.imgURL + record.productImageUrl} className={styles.imgSmall} />
          </span>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>产品名称</span>,
        dataIndex: 'productName',
        key: 'productName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>供应商</span>,
        dataIndex: 'factoryName',
        key: 'factoryName',
      }, {
        title: <span style={{ marginLeft: '38px' }}>品类</span>,
        dataIndex: 'categoryName',
        key: 'categoryName',
        filterMultiple: false,
        filters: this.state.categoryList,
      }, {
        title: <span style={{ marginLeft: '38px' }}>上传时间</span>,
        dataIndex: 'createDate',
        key: 'createDate',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '最近一天',
          value: '1',
        }, {
          text: '最近一周',
          value: '2',
        }, {
          text: '最近一月',
          value: '3',
        }],
      }, {
        title: <span style={{ marginLeft: '38px' }}>审核状态</span>,
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '暂存',
          value: '0',
        }, {
          text: '待审核',
          value: '1',
        }],
        render: (text, record) => (
          <span>
            {self.auditStatusDisplay(record.auditStatus)}
          </span>
        ),
      }],
      desCol: [{// 设计师产品列表样式
        title: <span style={{ display: 'table', margin: '0 auto' }}>产品图片</span>,
        dataIndex: 'productImageUrl',
        key: 'productImageUrl',
        render: (text, record) => (
          <span >
            <img src={app.$http.imgURL + record.productImageUrl} className={styles.imgSmall} />
          </span>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>产品名称</span>,
        dataIndex: 'productName',
        key: 'productName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>设计师</span>,
        dataIndex: 'designer',
        key: 'designer',
      }, {
        title: <span style={{ marginLeft: '38px' }}>品类</span>,
        dataIndex: 'categoryName',
        key: 'categoryName',
        filterMultiple: false,
        filters: this.state.categoryList,
      }, {
        title: <span style={{ marginLeft: '38px' }}>上传时间</span>,
        dataIndex: 'createDate',
        key: 'createDate',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '最近一天',
          value: '1',
        }, {
          text: '最近一周',
          value: '2',
        }, {
          text: '最近一月',
          value: '3',
        }],
      }, {
        title: <span style={{ marginLeft: '38px' }}>审核状态</span>,
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '暂存',
          value: '0',
        }, {
          text: '待审核',
          value: '1',
        }],
        render: (text, record) => (
          <span>
            {self.auditStatusDisplay(record.auditStatus)}
          </span>
        ),
      }],
      // pageIndexFac: 1, // 当前页码供应商
      // pageIndexDes: 1, // 当前页码设计师
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页展示条数
      totalNum: 0, // 总条数设计师
      // totalNumFact: 0, // 总条数供应商
      placeholder: '请输入设计师名称',
      totalNumFact: 0, // 总条数供应商
      type: 'DESIGNER',
    });
  }

  // 产品状态 0 暂存 1 上架 2 下架
  proStatusDisplay(productStatus) {
    switch (productStatus) {
      case 0:
        return (
          <span>暂存待审核</span>
        );
        break;
      case 1:
        return (
          <span>上架</span>
        );
        break;
      case 2:
        return (
          <span>下架</span>
        );
        break;
      default:
        break;
    }
  }
  // 审核状态 1 未审核 2 审核中 3 通过 4 拒绝
  auditStatusDisplay(auditStatus) {
    switch (auditStatus) {
      case 0:
        return (
          <span>暂存待审核</span>
        );
        break;
      case 1:
        return (
          <span>待审核</span>
        );
        break;
      case 3:
        return (
          <span>通过</span>
        );
        break;
      case 4:
        return (
          <span>审核不通过</span>
        );
        break;
      default:
        break;
    }
  }

  // 查询列表
  getProList(brandType, pageIndexDes, otherParams) {
    this.setState({
      proLoading: true,
    });
    const paramsTwo = {
      brandType,
      searchName: this.state.searchName,
      page: pageIndexDes,
      rows: 10,
    };
    Object.assign(paramsTwo, otherParams);
    const param = app.$v.deleteEmptykey(paramsTwo);
    app.$api.desAuditProduct(param).then((res) => {
      if (brandType === 2) {
        this.setState({
          designerProList: res.data.data,
          totalNum: res.data.rowSize,
        });
      } else if (brandType === 1) {
        this.setState({
          factoryProList: res.data.data,
          totalNumFact: res.data.rowSize,
        });
      }
      this.setState({
        current: pageIndexDes,
        proLoading: false,
      });

    });
  }

  // todo
  // 设计师筛选
  filterDes(pagina, filters) {
    // console.log('设计师');
    // console.log(pagina);
    // console.log(filters);
    const { categoryName, createDate, auditStatus } = filters;
    const params = {
      validTime: createDate && createDate[0],
      auditStatus: auditStatus && auditStatus[0],
      categoryId: categoryName && categoryName[0],
    };
    this.getProList(2, pagina.current, params);
  }

  filterShop(pagina, filters) {
    // console.log('店铺');
    const { categoryName, createDate, auditStatus } = filters;
    const params = {
      validTime: createDate && createDate[0],
      auditStatus: auditStatus && auditStatus[0],
      categoryId: categoryName && categoryName[0],
    };
    this.getProList(1, pagina.current, params);
  }

  // 查询设计师上传数据信息
  getDesignerProList = (pageIndexDes, pageSize) => {
    this.setState({
      proLoading: true,
    });
    const paramsTwo = {
      brandType: 2,
      searchName: this.state.searchName,
      page: pageIndexDes,
      rows: pageSize,
    };
    const param = app.$v.deleteEmptykey(paramsTwo);
    app.$api.desAuditProduct(param).then((res) => {
      this.setState({
        designerProList: res.data.data,
        totalNum: res.data.rowSize,
        proLoading: false,
      });
    });
  }

   // 查询供应商上传数据信息
  getFactAuditProduct = (pageIndexFac, pageSize) => {
    this.setState({
      proLoading: true,
    });
    const paramsTwo = {
      brandType: 1,
      searchName: this.state.searchName,
      page: pageIndexFac,
      rows: pageSize,
    };
    const param = app.$v.deleteEmptykey(paramsTwo);
    app.$api.desAuditProduct(param).then((res) => {
      this.setState({
        factoryProList: res.data.data,
        totalNum: res.data.rowSize,
        proLoading: false,
      });
    });
  }

  // 点击确定
  handleOkShop() {
    this.setState({
      loadingShop: true,
    });
  }

  handleOkDes() {
    this.setState({
      loadingDes: true,
    });
  }
  handleOkPlat() {
    this.setState({
      gitPlat: true,
    });
  }

  // 点击返回
  handleCancel() {
    this.setState({
      visibleShop: false,
      visibleDes: false,
      visibleFact: false,
    });
  }


  // 点击店铺审核弹窗
  rowClickShop(e, index) {
    this.setState({
      visibleShop: true,
    });
  }

  // 点击设计师审核弹窗
  rowClickDes(e, index) {
    const self = this;

    const params = { productId: e.productId };
    app.$api.findProductByProductId(params).then((res) => {
      this.timer = setTimeout(
        () => {
          const proTempData = res.data;
          proTempData.mainImg = proTempData.images[0].imageUrl;
          if (!!proTempData.designs && proTempData.designs[0].designValue != undefined) {
            proTempData.sizeTxtOne = proTempData.designs[0].designValue;
          } else {
            proTempData.sizeTxtOne = '';
          }
          self.setState({
            proId: e.productId,
            proAllData: proTempData,
            visibleDes: true,
          });
        },
        500,
      );
    });
  }

  // 点击供应商审核弹窗
  rowClickFact(e, index) {
    // console.log('供应商');
    // console.log(e, index);
    const self = this;
    // 查询供应商上传数据信息
    // 提交新产品参数
    const params = { productId: e.productId };
    app.$api.findProductByProductId(params).then((res) => {

      this.timer = setTimeout(
        () => {
          const proTempData = res.data;
          // console.log('平台参数');
          // console.log(proTempData.designs);
          proTempData.mainImg = proTempData.images[0].imageUrl;
          if (proTempData.designs) {
            proTempData.sizeTxtOne = proTempData.designs[0].designValue;
          } else {
            proTempData.sizeTxtOne = '';
          }
          self.setState({
            proId: e.productId,
            proAllData: proTempData,
            visibleFact: true,
          });

          if (proTempData.images.length >= 3) {
            self.setState({
              ModelAmount: 3,
            });
          } else {
            self.setState({
              ModelAmount: proTempData.images.length,
            });
          }

        },
        500,
      );
    });

  }


  // 单元格样式
  rowClass() {
    return styles.rowClass;
  }

    // 底部样式
  modalFooter() {
    return {
      marginRight: '20px',
      width: '300px',
      height: '100px',
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
    };
  }

  // 分页
  onShowSizeChange = (current, pageSize) => {
    this.setState(() => ({
      pageSize,
      proLoading: true,
    }), () => {
      // this.getDesignerProList(1, pageSize);
      if (this.state.tabKay == 1) {
        this.getDesignerProList(this.state.pageIndex, 10);
      } else if (this.state.tabKay == 2) {
        this.getFactAuditProduct(this.state.pageIndex, 10);
      }
    });

  }

  onChangPage = (page, pageSize) => {
    // pageIndex:1,//当前页
    // pageSize: 12, // 每页展示条数
    this.setState(() => ({
      pageIndex: page,
      proLoading: true,
    }), () => {
      // this.getDesignerProList(page, pageSize);
      if (this.state.tabKay == 1) {
        this.getDesignerProList(this.state.pageIndex, 10);
        this.setState({
          placeholder: '请输入设计师名称',
        });
      } else if (this.state.tabKay == 2) {
        this.getFactAuditProduct(this.state.pageIndex, 10);
        this.setState({
          placeholder: '请输入供应商名称',
        });
      }
    });
  }

   // 供应商分页
  onFactShowSizeChange = (current, pageSize) => {
    // console.log(pageSize);
    this.getFactAuditProduct(1, pageSize);
  }

  onFactChangPage = (page, pageSize) => {
    // console.log(page, pageSize);
    this.getFactAuditProduct(page, pageSize);
  }

  closeModalFun = () => {
    const self = this;
    this.setState(() => ({
      visibleDes: false,
      visibleFact: false,
      proAllData: this.state.proAllData,
    }), () => {
      if (self.state.tabKay == 1) {
        self.getDesignerProList(1, 10);
        self.setState({
          placeholder: '请输入设计师名称',
        });
      } else if (self.state.tabKay == 2) {
        self.getFactAuditProduct(1, 10);
        self.setState({
          placeholder: '请输入供应商名称',
        });
      }
    });
  }

  // 搜索
  searchFun = () => {
    if (this.state.tabKay == 1) {
      this.getDesignerProList(1, 10);
    } else {
      this.getFactAuditProduct(1, 10);
    }
  }

  // 输入框事件
  inputChangFun = (e) => {
    this.setState({
      searchName: e.target.value,
    });
  }

  // 选项卡事件
  TabPaneFun = (key) => {
    this.setState(() => ({
      tabKay: key,
      searchName: '',
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页展示条数
      totalNum: 0, // 总条数设计师
      proLoading: true,
    }), () => {
      if (key == 1) {
        this.getDesignerProList(1, 10);
        this.setState({
          placeholder: '请输入设计师名称',
        });
      } else if (key == 2) {
        this.getFactAuditProduct(1, 10);
        this.setState({
          placeholder: '请输入供应商名称',
        });
      }
    });
  }

  // 设计师名称搜索
  searchNameFun = () => {
    const { type, searchName } = this.state;
    this.setState({
      searchName,
    });

    if (this.state.tabKay == 1) {
      this.getDesignerProList(1, 10);
    } else {
      this.getFactAuditProduct(1, 10);
    }
  }
  render() {
    const { pageSize, pageIndex, totalNum, placeholder } = this.state;
    const self = this;
    return (
      <div className={styles.productAudit} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>成品</div>
            <div className={styles.searchBox}>
              <Input style={{ width: 300 }} size="large" placeholder={placeholder} value={this.state.searchName} onChange={this.inputChangFun} />
              <Button className={styles.btn} type="primary" onClick={this.searchFun}>搜索</Button>
            </div>
          </div>
          <Spin size="large" spinning={this.state.proLoading} >
            <Tabs onTabClick={this.TabPaneFun.bind(this)} >
              <TabPane tab="设计师上传" key="1">
                <div className={styles.tableWrap}>
                  <div className={styles.table}>
                    <Table
                      pagination={false}
                      onRowClick={this.rowClickDes.bind(this)}
                      onChange={this.filterDes.bind(this)}
                      rowClassName={this.rowClass} dataSource={this.state.designerProList} columns={this.state.desCol} bordered
                  />
                  </div>
                  <div className={styles.pagWrap} />
                </div>
              </TabPane>
              <TabPane tab="供应商上传" key="2">
                <div className={styles.tableWrap}>
                  <div className={styles.table}>
                    <Table
                      pagination={false}
                      onRowClick={this.rowClickFact.bind(this)}
                      onChange={this.filterShop.bind(this)}
                      rowClassName={this.rowClass} dataSource={this.state.factoryProList} columns={this.state.factCol} bordered
                  />
                  </div>
                  <div className={styles.pagWrap} />
                </div>
              </TabPane>
            </Tabs>
          </Spin>
        </div>
        <div className={styles.pagWrap}>
          <Pagination
            onShowSizeChange={this.onShowSizeChange} current={pageIndex} total={totalNum} onChange={this.onChangPage}
            pageSize={pageSize} pageSizeOptions={['10', '15', '20']}
                  />
        </div>

        {/* 设计师上传弹窗 */}
        {this.state.visibleDes && (
        <Modal
          visible={this.state.visibleDes}
          title="设计师上传审核"
          onOk={this.handleOkDes}
          onCancel={this.handleCancel.bind(this)}
          width="1100px"
          footer={
            <div style={this.modalFooter.call(this)} >
              {/* <span>拒绝上架</span>
              <Button key="submit" size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>暂时保存</Button>
              <Button size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>通过上架</Button> */}
            </div>}
      >
          <DesUpload result={{ proId: self.state.proId, proAllData: self.state.proAllData }} callbackParent={this.closeModalFun} />
        </Modal>)}


        {/* 供应商上传弹窗 */}
        {this.state.visibleFact && (
        <Modal
          visible={this.state.visibleFact}
          title="供应商上传审核"
          onOk={this.handleOkFact}
          onCancel={this.handleCancel.bind(this)}
          width="1100px"
          footer={
            <div style={this.modalFooter.call(this)} >
              {/* <span>拒绝上架</span>
              <Button key="submit" size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>暂时保存</Button>
              <Button size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>通过上架</Button> */}
            </div>}
        >
          <FactoryUpload result={{ proId: self.state.proId, proAllData: self.state.proAllData }} callbackParent={this.closeModalFun} />
        </Modal>)}


        {/* 店铺上传弹窗 */}
        {/* {this.state.visibleShop && (<Modal
          visible={this.state.visibleShop}
          title="店铺上上传审核"
          onOk={this.handleOkShop}
          onCancel={this.handleCancel.bind(this)}
          width="1100px"
          footer={
            <div style={this.modalFooter.call(this)} >
              <span>拒绝上架</span>
              <Button key="submit" size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>暂时保存</Button>
              <Button size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>通过上架</Button>
            </div>}
            >
          <ShopUpload />
        </Modal>)} */}


      </div>
    );
  }

}

ProductAudit.propTypes = {

};

ProductAudit.contextTypes = {
  router: PropTypes.object.isRequired,
};


export default ProductAudit;
