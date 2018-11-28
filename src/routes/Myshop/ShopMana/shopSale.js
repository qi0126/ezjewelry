import React from 'react';
import { Input, Button, message, Row, Col, Table, DatePicker, Select, InputNumber,Spin } from 'antd';
import moment from 'moment';
import app from 'app';
import DownModal from './common/downModal';

import styles from './shopSale.less';

const Option = Select.Option;

const { MonthPicker, RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';

class ShopSale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      searchName: '',
      visible: false,
      editStatus: false,

      categoryList: [],
      pinCategoryList: [],
      salesclerkList: [],

      emptyObj: {
        key: (Math.random() * 1000).toFixed(2),
        categoryId: '',
        categoryName: '',
        clientTel: '',
        pinName: '',
        productName: '',
        salePrice: '',
        saleTime: new Date(),
        salesclerk: '',
        edit: true,
      },
      proLoading: true, // 筛选条件加载中属性
    };
  }

  componentDidMount() {
    this.getTableSelect();
  }

  async getTableSelect() {
    await this.getClassInfo();
    await this.getClassItem();
    await this.getClassCleark();
    await this.getCol();
    await this.getVipList(1);
  }

  // 查询分类信息
  getClassInfo() {
    return Promise.resolve(app.$api.selectCategoryNumber().then((res) => {
      const arr = [{
        text: '全部',
        value: ' ',
      }];
      const list = res.data.map((item) => {
        return {
          text: item.commonName,
          value: item.id.toString(),
        };
      });
      const categoryList = arr.concat(list);
      this.setState({
        categoryList,
      });
    }));
  }

  // 品类查询
  getClassItem() {
    return Promise.resolve(app.$api.selectPinCategory().then((res) => {
      const arr = [{
        text: '全部',
        value: ' ',
      }];
      const list = res.data.map((item) => {
        return {
          text: item.commonName,
          value: item.id.toString(),
        };
      });
      const pinCategoryList = arr.concat(list);
      this.setState({
        pinCategoryList,
      });
    }));
  }

    // 品类查询
  getClassCleark() {
    return Promise.resolve(app.$api.shopClerk().then((res) => {
      const arr = [{
        text: '全部',
        value: ' ',
      }];
      const list = res.data.map((item) => {
        return {
          text: item.account,
          value: item.id.toString(),
        };
      });
      const salesclerkList = arr.concat(list);
      this.setState({
        salesclerkList,
      });
    }));
  }


  getCol() {
    const { pinCategoryList, categoryList, salesclerkList } = this.state;
    this.setState({
      columns: [{
        title: <span style={{ marginLeft: '20px' }}>品目</span>,
        dataIndex: 'pinName',
        key: 'pinName',
        filterMultiple: false,
        filters: pinCategoryList,
        render: (text, record, index) => (
          (record.edit ? (<Select defaultValue={text || pinCategoryList[0].value} style={{ width: 60 }} size="small" onChange={this.getPinName.bind(this, record, index)}>
            {pinCategoryList.filter(item => item.text !== '全部').map((item) => {
              return <Option value={item.value} key={item.value} >{item.text}</Option>;
            })}
          </Select>) : text)
        ),
      }, {
        title: <span style={{ marginLeft: '20px' }}>类别</span>,
        dataIndex: 'categoryName',
        key: 'categoryName',
        filterMultiple: false,
        filters: categoryList,
        render: (text, record, index) => (
          (record.edit ? (<Select defaultValue={text || categoryList[0].value} style={{ width: 60 }} size="small" onChange={this.getCate.bind(this, record, index)}>
            {categoryList.filter(item => item.text !== '全部').map((item) => {
              return <Option value={item.value} key={item.value} >{item.text}</Option>;
            })}
          </Select>) : text)
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>产品名称</span>,
        dataIndex: 'productName',
        key: 'productName',
        render: (text, record, index) => (
          <div>
            {record.edit ? <Input size="small" defaultValue={text} style={{ width: 80 }} onInput={this.getProName.bind(this, record, index)} /> : text}
          </div>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>单价</span>,
        dataIndex: 'salePrice',
        key: 'salePrice',
        render: (text, record, index) => (
          <div>
            {record.edit ? <InputNumber size="small" defaultValue={text} style={{ width: 40 }} onChange={this.getPrice.bind(this, record, index)} /> : text}
          </div>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>客户名称</span>,
        dataIndex: 'clientName',
        key: 'clientName',
        render: (text, record, index) => (
          <div>
            {record.edit ? <Input size="small" defaultValue={text} style={{ width: 80 }} onInput={this.getClientName.bind(this, record, index)} /> : text}
          </div>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>联系方式</span>,
        dataIndex: 'clientTel',
        key: 'clientTel',
        render: (text, record, index) => (
          <div>
            {record.edit ? <Input size="small" defaultValue={text} style={{ width: 80 }} onInput={this.getClientTel.bind(this, record, index)} /> : text}
          </div>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>店员</span>,
        dataIndex: 'salesclerk',
        key: 'salesclerk',
        render: (text, record, index) => (
          (record.edit ? (<Select defaultValue={text || salesclerkList[0].value} style={{ width: 100 }} size="small" onChange={this.getSaleName.bind(this, record, index)}>
            {salesclerkList.filter(item => item.text !== '全部').map((item) => {
              return <Option value={item.value} key={item.value} >{item.text}</Option>;
            })}
          </Select>) : text)
        ),

        // render: (text, record, index) => (
        //   <div>
        //     {record.edit ? <Input size="small" defaultValue={text} style={{ width: 60 }} onInput={this.getSaleName.bind(this, record, index)} /> : text}
        //   </div>
        // ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>销售日期</span>,
        dataIndex: 'saleTime',
        key: 'saleTime',
        render: (text, record, index) => (
          <div>
            <DatePicker disabled={!record.edit} size="small" style={{ width: 110 }} defaultValue={moment(text)} onChange={this.getSaleTime.bind(this, record, index)} />
          </div>
        ),
      },
      {
        title: <span style={{ display: 'table', margin: '0 auto' }}>操作</span>,
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => (
          <div className={`${styles.handle} cursor c00`}>
            {record.edit ? (<div><div onClick={this.save.bind(this, record, index)}>保存</div>
              <div onClick={this.cancel.bind(this, record, index)}>取消</div></div>) : (<div><div onClick={this.edit.bind(this, record, index)} >编辑</div>
                <div onClick={this.del.bind(this, record, index)}>删除</div></div>)}
          </div>
        ),
      }],
    });
  }

  // 编辑
  edit(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].edit = true;
    this.setState({ dataSource });
  }

  // 删除
  del(item, index, e) {
    const params = {
      id: item.id,
    };
    app.$api.deleteStoreSaleNumber(params).then((res) => {
      this.state.dataSource.splice(index, 1);
      this.setState({});
    });
  }

  valiCol(params) {
    if (!app.$v.verifyMobile(params.clientTel)) {
      message.error('请输入正确的联系方式');
      return false;
    }
    return true;
  }

  // 保存
  save(item, index, e) {
    let httpType = '';
    const { dataSource, salesclerkList } = this.state;
    const { pinId, categoryId, productName, salePrice, clientName, clientTel, salesclerkId, saleTime } = item;
    // 获取店员名称
    let salesclerk = '';
    salesclerkList.forEach((item) => {
      if (item.value === salesclerkId) {
        salesclerk = item.text;
      }
    });
    const params = {
      pinId,
      categoryId,
      productName,
      salePrice,
      clientName,
      clientTel,
      salesclerk,
      salesclerkId,
      saleTime: moment(saleTime).format('YYYY-MM-DD'),
    };
    if (!this.valiCol(params)) {
      return false;
    }
    if (item.id) {
      httpType = 'updateStoreSaleNumber';
      Object.assign(params, { id: item.id });
    } else {
      httpType = 'addStoreSaleNumber';
    }
    app.$api[httpType](params).then((res) => {
      // this.state.dataSource[index].edit = false;
      this.getVipList(1);
      // this.setState({ dataSource });
    });
  }

  // 取消
  cancel(item, index, e) {
    const { dataSource } = this.state;
    if (item.id) {
      dataSource[index].edit = false;
    } else {
      dataSource.splice(index, 1);
    }
    this.setState({ dataSource });
  }

  // 品目
  getPinName(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].pinId = e;
    this.setState({ dataSource });
  }

  // 类别
  getCate(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].categoryId = e;
    this.setState({ dataSource });
  }

  // 产品名称
  getProName(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].productName = e.target.value;
    this.setState({ dataSource });
  }

  // 单价
  getPrice(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].salePrice = e;
    this.setState({ dataSource });
  }

  // 客户名称
  getClientName(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].clientName = e.target.value;
    this.setState({ dataSource });
  }

  // 联系方式
  getClientTel(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].clientTel = e.target.value;
    this.setState({ dataSource });
  }

  // 店员
  getSaleName(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].salesclerkId = e;
    this.setState({ dataSource });
  }

  // 销售日期
  getSaleTime(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].saleTime = e;
    this.setState({ dataSource });
  }

  getVipList(page, otherParams) {
    this.setState({
      proLoading: true,
    });
    const params = {
      page,
      row: 10,
    };
    otherParams && Object.assign(params, otherParams);
    app.$api.selectStoreSaleNumber(params).then((res) => {
      const { rowSize: total = 20, data: dataSource } = res.data;
      dataSource.forEach((item) => {
        item.key = (Math.random() * 1000).toFixed(2);
      });
      this.setState({
        dataSource,
        total,
        proLoading:false,
      });
    });
  }

  filterVip(pagina, filters) {
    const { categoryName, pinName } = filters;
    const params = {
      categoryId: categoryName && categoryName[0],
      pincateId: pinName && pinName[0],
    };
    this.getVipList(pagina.current, params);
  }

  // 获取搜索参数
  getSear(e) {
    this.setState({
      searchName: e.target.value,
    });
  }

  // 点击确定
  searInfo() {
    const { searchName } = this.state;
    const params = {
      searchName,
    };
    this.getVipList(1, params);
  }

  // 增加单个
  addOne() {
    const { emptyObj, dataSource } = this.state;
    Object.assign(emptyObj, { key: (Math.random() * 1000).toFixed(2) });
    const empty = JSON.parse(JSON.stringify(emptyObj));
    this.state.dataSource.unshift(empty);
    this.setState({
      dataSource,
    });
  }

  // 单元格样式
  rowClass() {
    return styles.rowClass;
  }

  onOK() {
    this.setState({
      visible: false,
    });
  }

  onCancel() {
    this.setState({
      visible: false,
    });
  }

  // 筛选日期
  changeDate(date, dateString) {
    // console.log(dateString);
    const params = {
      startTime: dateString[0].replace(/\//g, '-'),
      endTime: dateString[1].replace(/\//g, '-'),
    };
    this.getVipList(1, params);
  }

  render() {
    const { dataSource, columns, total, visible } = this.state;
    return (
      <div className={styles.shopSale} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>店铺销售管理</div>
          </div>
          <Row>
            <Col span={6} > <Input placeholder="店员/客户手机号码" onInput={this.getSear.bind(this)} /></Col>
            <Col span={3} offset={1} ><Button type="primary" onClick={this.searInfo.bind(this)} >搜索</Button></Col>
            <Col span={8} offset={1} >
              <RangePicker defaultValue={[moment(new Date(), dateFormat), moment(new Date(), dateFormat)]} format={dateFormat} onChange={this.changeDate.bind(this)} /></Col>
            <Col span={2} offset={2} ><Button type="primary" onClick={this.addOne.bind(this)} >添加</Button></Col></Row>
          <div style={{ height: 30 }} />
          <Spin size="large" spinning={this.state.proLoading} >
            <Table
              style={{ marginRight: 50 }}
              bordered
              rowClassName={this.rowClass}
              dataSource={dataSource}
              columns={columns}
              onChange={this.filterVip.bind(this)}
              pagination={{
                total,
                defaultPageSize: 10,
              }}
            />
          </Spin>

          <DownModal visible={visible} onOk={this.onOK.bind(this)} onCancel={this.onCancel.bind(this)} />
        </div>


      </div>
    );
  }
}

ShopSale.propTypes = {

};

export default ShopSale;
