import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Modal, Button, Tabs, Table, Pagination, Spin } from 'antd';

import app from 'app';

import { connect } from 'dva';
import styles from './ProductCustomAudit.less';

import DesUpload from './common/DesUpload/DesUpload';
import FactoryUpload from './common/FactoryUpload/FactoryUpload';
import ShopUpload from './common/ShopUpload/ShopUpload';


const TabPane = Tabs.TabPane;

class ProductAudit extends React.Component {
  constructor(props) {
    super(props);
    const self = this;
    this.state = {
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

      searchName: '', // 设计师名称搜索
      tabKay: 1, // 当前选项卡的key值
      totalNum: 0, // 设计师分页总数
      totalNumFact: 0, // 供应商产品分页总数
      brandType: '1',
      current: 0,
      // 当前type
      type: 'DESIGNER',

      desParams: {},
      shopParams: {},
      proLoading: true, // 产品加载中属性
    };
  }

  // 2、审核中，3、审核不通过，4已通过，5待审核
  proStatusDisplay(productStatus) {
    switch (productStatus) {
      case 2:
        return (
          <span>待审核</span>
        );
        break;
      case 3:
        return (
          <span>审核不通过</span>
        );
        break;
      case 4:
        return (
          <span>已通过</span>
        );
        break;
      case 5:
        return (
          <span>暂存待审核</span>
        );
        break;
      default:
        break;
    }
  }
  // 创建时间格式显示
  uploadTime(timeData) {
    const timeDataTxt = app.$tool.day(timeData).format('YYYY.MM.DD');
    return (
      <span>{timeDataTxt}</span>
    );
  }

  closeModalFun = () => {
    this.setState(() => ({
      visibleDes: false,
      visibleFact: false,
      proAllData: this.state.proAllData,
    }), () => {
          // 查询供应商上传数据信息
      this.changeDesignerDate('N', 1);
    // 查询设计师上传数据信息
      this.changeDesignerDate('Y', 1);
    });
  }

  // 申请类型 Y：上架 N：下架,R下架
  auditStatusDisplay(auditStatus) {
    switch (auditStatus) {
      case 'Y':
        return (
          <span>已上架</span>
        );
        break;
      case 'R':
        return (
          <span>已上架</span>
        );
        break;
      case 'N':
        return (
          <span>下架</span>
        );
        break;
      default:
        break;
    }
  }

  getClassifyId() {
    this.setState({
      proLoading: true,
    });
    app.$api.queryClassifyInfo().then((res) => {
      const tempData = res.data;
      const arr = [{
        text: '全部',
        value: ' ',
      }];
      const list = tempData.map((item) => {
        return {
          text: item.cname,
          value: item.classifyId,
        };
      });
      const categoryList = arr.concat(list);
      this.setState({
        categoryList,
        proLoading: false,
      }, () => {
        this.getList();
        this.changeDesignerDate('N', 1);  // 查询供应商上传数据信息
        this.changeDesignerDate('Y', 1); // 查询设计师上传数据信息
      });
    });
  }

  getList() {
    const self = this;
    this.setState({
      proLoading: true,
      // 供应商产品列表样式
      factCol: [{
        title: <span style={{ display: 'table', margin: '0 auto' }}>产品图片</span>,
        dataIndex: 'sPicUrl',
        key: 'sPicUrl',
        render: (text, record) => (
          <span >
            <img src={app.$http.imgURL + record.sPicUrl} className={styles.imgSmall} />
          </span>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>产品名称</span>,
        dataIndex: 'productName',
        key: 'productName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>供应商</span>,
        dataIndex: 'nickName',
        key: 'nickName',
      }, {
        title: <span style={{ marginLeft: '38px' }}>品类</span>,
        dataIndex: 'classifyName',
        key: 'classifyName',
        filterMultiple: false,
        filters: this.state.categoryList,
      }, {
        title: <span style={{ marginLeft: '38px' }}>上传时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
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
        render: (text, record) => (
          <span>
            {self.uploadTime(record.createTime)}
          </span>
        ),
      }, {
        title: <span style={{ marginLeft: '38px' }}>审核状态</span>,
        dataIndex: 'isAudit',
        key: 'isAudit',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '审核中',
          value: '2',
        }, {
          text: '暂存待审核',
          value: '5',
        }],
        render: (text, record) => (
          <span>
            {self.proStatusDisplay(record.isAudit)}
          </span>
        ),
      }],

      // 设计师产品列表样式
      desCol: [{
        title: <span style={{ display: 'table', margin: '0 auto' }}>产品图片</span>,
        dataIndex: 'sPicUrl',
        key: 'sPicUrl',
        render: (text, record) => (
          <span >
            <img src={app.$http.imgURL + record.sPicUrl} className={styles.imgSmall} />
          </span>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>产品名称</span>,
        dataIndex: 'productName',
        key: 'productName',
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>设计师</span>,
        dataIndex: 'nickName',
        key: 'nickName',
      }, {
        title: <span style={{ marginLeft: '38px' }}>品类</span>,
        dataIndex: 'classifyName',
        key: 'classifyName',
        filterMultiple: false,
        filters: this.state.categoryList,
      }, {
        title: <span style={{ marginLeft: '38px' }}>上传时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
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
        render: (text, record) => (
          <span>
            {self.uploadTime(record.createTime)}
          </span>
        ),
      }, {
        title: <span style={{ marginLeft: '38px' }}>审核状态</span>,
        dataIndex: 'isAudit',
        key: 'isAudit',
        filterMultiple: false,
        filters: [{
          text: '全部',
          value: ' ',
        }, {
          text: '暂存',
          value: '5',
        }, {
          text: '待审核',
          value: '2',
        }],
        render: (text, record) => (
          <span>
            {self.proStatusDisplay(record.isAudit)}
          </span>
        ),
      }],
    });
  }

  componentDidMount() {
    // 查询所有产品类目
    this.getClassifyId();
  }

  // 获取数据列表
  changeDesignerDate = (elem, page) => {
    const self = this;
    this.setState({
      proLoading: true,
    });
    const params = {
      productName: self.state.searchName,
      designer: elem,
      page,
      rows: 10,
    };
    if (elem === 'Y' && (this.state.desParams !== '{}')) {
      Object.assign(params, this.state.desParams);
    }
    if (elem === 'N' && (this.state.shopParams !== '{}')) {
      Object.assign(params, this.state.shopParams);
    }
    // otherParams && Object.assign(params, otherParams);
    app.$api.getProductsByplatform(params).then((res) => {
      if (elem === 'Y') {
        self.setState({
          designerProList: res.data.data,
          totalNum: res.data.rowSize,
        });
      } else if (elem === 'N') {
        self.setState({
          factoryProList: res.data.data,
          totalNumFact: res.data.rowSize,
        });
      }

      // 处理完弹窗后页数还原
      this.setState({
        current: page,
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
      loadingPlat: true,
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
    e.imgList = e.picUrl.split(',');

    // console.log(elem);
    // console.log(e);
    const tempSkuDouList = [];
    const tempSkuManList = [];
    const tempSkuWomanList = [];
    e.skuPages.forEach((ielem) => {
      // console.log('áaaa:');
      // console.log(ielem);
      // console.log(ielem.skuProps[0]);
      switch (ielem.skuProps[0].parentPropValue) {
        case '对戒':
          tempSkuDouList.push(ielem);
          break;
        case '男戒':
          tempSkuManList.push(ielem);
          break;
        case '女戒':
          tempSkuWomanList.push(ielem);
          break;
      }
    });
    e.skuList = [];
    if (tempSkuDouList.length != 0) {
      e.skuList.push({ skuName: '对戒', skuSList: tempSkuDouList });
    }
    if (tempSkuManList.length != 0) {
      e.skuList.push({ skuName: '男戒', skuSList: tempSkuManList });
    }
    if (tempSkuWomanList.length != 0) {
      e.skuList.push({ skuName: '女戒', skuSList: tempSkuWomanList });
    }
    // const tempSkuDouList = [];
    // const tempSkuManList = [];
    // const tempSkuWomanList = [];
    // e.skuPages.forEach((ielem) => {
    //   switch (ielem.skuProps[0].propValue) {
    //     case '对戒':
    //       tempSkuDouList.push(ielem);
    //       break;
    //     case '男戒':
    //       tempSkuManList.push(ielem);
    //       break;
    //     case '女戒':
    //       tempSkuWomanList.push(ielem);
    //       break;
    //   }
    // });

    // e.skuList = [
    //   { skuName: '对戒', skuSList: tempSkuDouList },
    //   { skuName: '男戒', skuSList: tempSkuManList },
    //   { skuName: '女戒', skuSList: tempSkuWomanList },
    // ];
    self.setState({
      proId: e.productId,
      proAllData: e,
      visibleDes: true,
    });
  }

  // 点击供应商审核弹窗
  rowClickFact(e, index) {
    const self = this;
    e.imgList = e.picUrl.split(',');

    // console.log(elem);
    const tempSkuDouList = [];
    const tempSkuManList = [];
    const tempSkuWomanList = [];
    e.skuPages.forEach((ielem) => {
      // console.log(ielem.skuProps[0]);
      switch (ielem.skuProps[0].parentPropValue) {
        case '对戒':
          tempSkuDouList.push(ielem);
          break;
        case '男戒':
          tempSkuManList.push(ielem);
          break;
        case '女戒':
          tempSkuWomanList.push(ielem);
          break;
      }
    });
    e.skuList = [];
    if (tempSkuDouList.length != 0) {
      e.skuList.push({ skuName: '对戒', skuSList: tempSkuDouList });
    }
    if (tempSkuManList.length != 0) {
      e.skuList.push({ skuName: '男戒', skuSList: tempSkuManList });
    }
    if (tempSkuWomanList.length != 0) {
      e.skuList.push({ skuName: '女戒', skuSList: tempSkuWomanList });
    }

    // const tempSkuDouList = [];
    // const tempSkuManList = [];
    // const tempSkuWomanList = [];
    // e.skuPages.forEach((ielem) => {
    //   switch (ielem.skuProps[0].propValue) {
    //     case '对戒':
    //       tempSkuDouList.push(ielem);
    //       break;
    //     case '男戒':
    //       tempSkuManList.push(ielem);
    //       break;
    //     case '女戒':
    //       tempSkuWomanList.push(ielem);
    //       break;
    //   }
    // });

    // e.skuList = [
    //   { skuName: '对戒', skuSList: tempSkuDouList },
    //   { skuName: '男戒', skuSList: tempSkuManList },
    //   { skuName: '女戒', skuSList: tempSkuWomanList },
    // ];
    self.setState({
      proId: e.productId,
      proAllData: e,
      visibleFact: true,
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

  // 设计师筛选
  filterDes(pagina, filters) {

    const { classifyName, createTime, isAudit } = filters;
    const params = {
      validTime: createTime && createTime[0],
      isAudit: isAudit && isAudit[0],
      classifyId: classifyName && classifyName[0],
    };
    this.setState({
      desParams: params,
    }, () => {
      this.changeDesignerDate('Y', pagina.current);
    });
  }

  filterShop(pagina, filters) {
    const { classifyName, createTime, isAudit } = filters;
    const params = {
      validTime: createTime && createTime[0],
      isAudit: isAudit && isAudit[0],
      classifyId: classifyName && classifyName[0],
    };
    this.setState({
      shopParams: params,
    }, () => {
      this.changeDesignerDate('N', pagina.current);
    });
  }

  // 设计师分页

  // 供应商分页

  // closeModalFun = () => {
  //   this.setState(() => ({
  //     visibleDes: false,
  //     visibleFact: false,
  //     proAllData: this.state.proAllData,
  //   }), () => {
  //     this.getFactAuditProduct(1, 12);
  //     this.getDesignerProList(1, 12);
  //     this.componentDidMount();
  //   });
  // }

    // 输入框事件
  inputChangFun = (e) => {
    this.setState({
      searchName: e.target.value,
    });
  }

  // 设计师名称搜索
  searchNameFun = () => {
    const { type, searchName } = this.state;
    const params = {
      productName: searchName,
    };
    if (type === 'DESIGNER') {
      this.changeDesignerDate('Y', 1);
    } else if (type === 'FACTORY') {
      this.changeDesignerDate('N', 1);
    }
  }
    // 查询设计师上传数据信息
  // getDesignerProList = (pageIndex, otherParams) => {
  //   const paramsTwo = {
  //     // brandType: 2,
  //     designer: 'Y',
  //     productName: this.state.searchName,
  //     page: pageIndex,
  //     rows: 4,
  //   };
  //   otherParams && Object.assign(paramsTwo, otherParams);
  //   const param = app.$v.deleteEmptykey(paramsTwo);
  //   app.$api.getProductsByplatform(param).then((res) => {
  //     this.setState({
  //       designerProList: res.data.data,
  //       pageIndexDes: pageIndex,
  //       totalNum: res.data.rowSize,
  //     });
  //   });
  // }
  // // 查询供应商上传数据信息
  // getFactAuditProduct = (pageIndex, otherParams) => {
  //   const paramsTwo = {
  //     // brandType: 1,
  //     productName: this.state.searchName,
  //     designer: 'N',
  //     page: pageIndex,
  //     rows: 10,
  //   };
  //   otherParams && Object.assign(paramsTwo, otherParams);
  //   const param = app.$v.deleteEmptykey(paramsTwo);
  //   app.$api.getProductsByplatform(paramsTwo).then((res) => {
  //     this.setState({
  //       factoryProList: res.data.data,
  //       pageIndexFac: pageIndex,
  //       totalNumFact: res.data.rowSize,
  //     });
  //   });
  // }

  changeTab(e) {
    const self = this;
    if (e === '1') {
      this.setState({
        type: 'DESIGNER',
        searchName: '',
      }, () => {
        // self.changeDesignerDate('Y', 1);
      });
    } else if (e === '2') {
      this.setState({
        type: 'FACTORY',
        searchName: '',
      }, () => {
        // self.changeDesignerDate('N', 1);
      });
    }
  }

  render() {
    const self = this;
    const { totalNum, totalNumFact, current } = this.state;
    return (
      <div className={styles.productAudit} >
        <Form layout="inline" >
          <div className={styles.sAudit}>
            <div className={styles.top}>
              <div className={styles.tit}>钻石定制款</div>
              {this.state.type === 'DESIGNER' && (<div className={styles.searchBox}>
                <Input style={{ width: 300 }} size="large" placeholder="请输入设计师名称" value={this.state.searchName} onChange={this.inputChangFun} />
                <Button className={styles.btn} type="primary" onClick={self.searchNameFun}>搜索</Button>
              </div>) }

              {this.state.type === 'FACTORY' && (<div className={styles.searchBox}>
                <Input style={{ width: 300 }} size="large" placeholder="请输入供应商名称" value={this.state.searchName} onChange={this.inputChangFun} />
                <Button className={styles.btn} type="primary" onClick={self.searchNameFun}>搜索</Button>
              </div>) }

            </div>
            <Spin size="large" spinning={this.state.proLoading} >
              <Tabs onTabClick={this.changeTab.bind(this)} style={{ paddingBottom: 100 }}>
                <TabPane tab="设计师上传" key="1" >
                  <div className={styles.tableWrap}>
                    <div className={styles.table}>
                      <Table
                        onRowClick={this.rowClickDes.bind(this)}
                        rowClassName={this.rowClass} dataSource={this.state.designerProList} columns={this.state.desCol} bordered
                        onChange={this.filterDes.bind(this)}
                        pagination={{
                          total: totalNum,
                          defaultPageSize: 10,
                          current,
                        }}
                    />

                    </div>

                  </div>
                </TabPane>
                <TabPane tab="供应商上传" key="2">
                  <div className={styles.tableWrap}>
                    <div className={styles.table}>
                      <Table
                        onRowClick={this.rowClickFact.bind(this)}
                        rowClassName={this.rowClass} dataSource={this.state.factoryProList} columns={this.state.factCol} bordered
                        onChange={this.filterShop.bind(this)}
                        pagination={{
                          total: totalNumFact,
                          defaultPageSize: 10,
                          current,
                        }}
                    />
                    </div>

                  </div>
                </TabPane>
                {/* <TabPane tab="店铺上传" key="3">
              <div className={styles.tableWrap}>
                <div className={styles.table}>
                  <Table
                    onRowClick={this.rowClickShop.bind(this)}
                    rowClassName={this.rowClass} dataSource={dataSource} columns={shopCol} bordered
                  />
                </div>
              </div>
            </TabPane> */}
              </Tabs>
            </Spin>
          </div>

          {/* 设计师上传弹窗 */}
          {this.state.visibleDes && (
          <Modal
            visible={this.state.visibleDes}
            title="设计师上传审核"
            onOk={this.handleOkDes}
            onCancel={this.handleCancel.bind(this)}
            width="1100px"
            footer={null/*
              <div style={this.modalFooter.call(this)} >
              <span>拒绝上架</span>
              <Button key="submit" size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>暂时保存</Button>
              <Button size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>通过上架</Button>
              </div>*/}
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
            footer={null/*
              <div style={this.modalFooter.call(this)} >
                <span>拒绝上架</span>
              <Button key="submit" size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>暂时保存</Button>
              <Button size="large" type="primary" loading={this.state.loadingShop} onClick={this.handleOkShop.bind(this)}>通过上架</Button>
              </div>*/}
          >
            <FactoryUpload result={{ proId: self.state.proId, proAllData: self.state.proAllData }} callbackParent={this.closeModalFun} />
          </Modal>)}


          {/* 店铺上传弹窗 */}
          {this.state.visibleShop && (
          <Modal
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
          </Modal>)}
        </Form>
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
