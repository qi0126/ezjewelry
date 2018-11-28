import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import app from 'app';
import styles from './saleData.less';

import { Radio, Slider, Button, Row, Col, Card, Modal, Table, Input, Select, Pagination, Tabs, DatePicker, Spin } from 'antd';

const Option = Select.Option;

const { Column, ColumnGroup } = Table;// 表格属性

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const marks = {// 滑块
  0: '0°C',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>10万以上</strong>,
  },
};
const tableState = {
  bordered: true,
  defaultExpandAllRows: true,
  expandRowByClick: false,
  pagination: false,
};


function handleChange(value) {
  // console.log(`selected ${value}`);
}


// 分页第几页，每页显示多少条记录
function onShowSizeChange(current, pageSize) {
  console.log(current, pageSize);
}
// 分页第几页
function onChange(pageNumber) {
  console.log('Page: ', pageNumber);
}





class saleData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [], // 表格数据
      serieData: [], // 系列数据
      classData: [], // 品类数据
      timeData: null, // 时间控件动态值
      startTime: '',
      endTime: '',
      blockName: 'BLOCK-DESIGNER',
      order: 'DESC', // 销量排序
      categoryId: 'null', // 品类
      seriesId: 'null', // 系列
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页展示条数
      totalNum: 0, // 总条数
      proLoading: true, // 产品加载中属性
    };
  }

  componentDidMount() {

    this.getTableData();
    this.selectAllSerie();
    this.selectAllClassify();
  }

  // 获取表格数据
  getTableData = () => {
    this.setState({
      proLoading: true,
    });
    const params = {
      pageIndex: this.state.pageIndex,
      rows: this.state.pageSize,
      keyword: '',
      blockName: 'BLOCK-DESIGNER',
      categoryId: this.state.categoryId != 'null' ? this.state.categoryId : '',
      seriesId: this.state.seriesId != 'null' ? this.state.seriesId : '',
      order: this.state.order,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      onlyFinished: false,
    };
    app.$api.designerSalesVolume(params).then((res) => {
      this.setState({
        tableData: res.data.data,
        totalNum: res.data.rowSize,
        proLoading: false,
      });
    });
  }

  // 系列数据
  selectAllSerie = () => {
    app.$api.selectAllSerie().then((res) => {
      res.data.unshift({
        cname: '全部系列',
        serieId: 'null',
      });
      this.setState({
        serieData: res.data,
      });
    });
  }

  // 品类数据
  selectAllClassify = () => {
    app.$api.selectAllClassify().then((res) => {
      res.data.unshift({
        cname: '全部品类',
        classifyId: 'null',
      });
      this.setState({
        classData: res.data,
      });
    });
  }

  // 日期
  handleDate = (value) => {
    this.setState({
      timeData: value,
    });
    if (value.length == 2) {
      this.setState(() => ({
        startTime: app.$tool.day(value[0]._d).format('YYYY-MM-DD'),
        endTime: app.$tool.day(value[1]._d).format('YYYY-MM-DD'),
      }), () => {
        this.getTableData();
      });
    } else {
      this.setState(() => ({
        startTime: '',
        endTime: '',
      }), () => {
        this.getTableData();
      });
    }

  };

  // 销量排序
  handleOrder = (value) => {
    this.setState(() => ({
      order: value,
    }), () => {
      this.getTableData();
    });
  }

  // 品类
  handleCategory = (value) => {
    this.setState(() => ({
      categoryId: value,
    }), () => {
      this.getTableData();
    });
  }

  // 系列
  handleSeries = (value) => {
    this.setState(() => ({
      seriesId: value,
    }), () => {
      this.getTableData();
    });
  }

  // 选显卡
  tabsFun = (value) => {
    this.setState(() => ({
      blockName: value,
      startTime: '',
      endTime: '',
      order: 'DESC', // 销量排序
      categoryId: 'null', // 品类
      seriesId: 'null', // 系列
      timeData: null,
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页展示条数
    }), () => {
      this.getTableData();
    });
  }

  // 分页
  onChangPage = (pageIndex, pageSize) => {
    this.setState(() => ({
      pageIndex,
    }), () => {
      this.getTableData();
    });
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState(() => ({
      pageSize,
    }), () => {
      this.getTableData();
    });
  }

  render() {
    const { tableData, serieData, classData, timeData, pageIndex, pageSize, totalNum } = this.state;
    const columns = [
      {
        title: '产品图片',
        key: 'picUrl',
        render: (text, record) => (
          <span>
            <img src={app.$http.imgURL + record.picUrl} className={styles.imgSmall} />
          </span>
        ),
      }, {
        title: '产品名称',
        dataIndex: 'proName',
        key: 'proName',
      }, {
        title: '产品系列',
        dataIndex: 'series',
        key: 'series',
      }, {
        title: '品类',
        dataIndex: 'category',
        key: 'category',
      }, {
        title: '销售数量（件）',
        dataIndex: 'count',
        key: 'count',
      }];
    return (
      <div className={styles.saleData}>
        <div className={styles.tit}>销售数据
        </div>
        <div className={styles.hr} />
        <Spin size="large" spinning={this.state.proLoading} >
          <Tabs defaultActiveKey="BLOCK-DESIGNER" onChange={this.tabsFun}>
            <TabPane tab={'成品款'} key="BLOCK-DESIGNER">

              <div className={styles.tabOne}>
                <div style={{ marginBottom: 20 }}>
                  <Row className={styles.boxAlignCenter}>
                    <Col span={5}>
                      <span className={styles.txtGold}>
                        系列
                      </span>
                      <span>
                        <Select value={this.state.seriesId} style={{ width: 120 }} onChange={this.handleSeries}>
                          {serieData.map((item) => {
                            return (
                              <Option key={item.serieId}>{item.cname}</Option>
                            );
                          })}
                        </Select>
                      </span>
                    </Col>
                    <Col span={5}>
                      <span className={styles.txtGold}>
                        品类
                      </span>
                      <span>
                        <Select value={this.state.categoryId} style={{ width: 120 }} onChange={this.handleCategory}>
                          {/* <Option value="按产品销售">按产品销售</Option>
                          <Option value="按销售金额">按销售金额</Option> */}
                          {classData.map((item) => {
                            return (
                              <Option key={item.classifyId}>{item.cname}</Option>
                            );
                          })}
                        </Select>
                      </span>
                    </Col>
                    <Col span={5}>
                      <span className={styles.txtGold}>
                        销量
                      </span>
                      <span>
                        <Select value={this.state.order} style={{ width: 120 }} onChange={this.handleOrder}>
                          <Option key="DESC">从高到低</Option>
                          <Option key="ASC">从低到高</Option>
                        </Select>
                      </span>
                    </Col>
                    <Col span={7}>
                      <span className={styles.txtGold}>
                        时间
                      </span>
                      <span style={{ width: 180, display: 'inline-block' }}>

                        <RangePicker onChange={this.handleDate} value={timeData} />
                      </span>
                    </Col>
                  </Row>
                </div>
                <Table dataSource={tableData} bordered {...tableState} columns={columns} />
              </div>
            </TabPane>
            <TabPane tab={'钻石定制款'} key="BLOCK-DIAMOND">
              <div className={styles.tabOne}>
                <div style={{ marginBottom: 20 }}>
                  <Row className={styles.boxAlignCenter}>
                    <Col span={5}>
                      <span className={styles.txtGold}>
                          系列
                        </span>
                      <span>
                        <Select value={this.state.seriesId} style={{ width: 120 }} onChange={this.handleSeries}>
                          {serieData.map((item) => {
                            return (
                              <Option key={item.serieId}>{item.cname}</Option>
                            );
                          })}
                        </Select>
                      </span>
                    </Col>
                    <Col span={5}>
                      <span className={styles.txtGold}>
                          品类
                        </span>
                      <span>
                        <Select value={this.state.categoryId} style={{ width: 120 }} onChange={this.handleCategory}>
                          {/* <Option value="按产品销售">按产品销售</Option>
                            <Option value="按销售金额">按销售金额</Option> */}
                          {classData.map((item) => {
                            return (
                              <Option key={item.classifyId}>{item.cname}</Option>
                            );
                          })}
                        </Select>
                      </span>
                    </Col>
                    <Col span={5}>
                      <span className={styles.txtGold}>
                          销量
                        </span>
                      <span>
                        <Select value={this.state.order} style={{ width: 120 }} onChange={this.handleOrder}>
                          <Option key="DESC">从高到低</Option>
                          <Option key="ASC">从低到高</Option>
                        </Select>
                      </span>
                    </Col>
                    <Col span={7}>
                      <span className={styles.txtGold}>
                          时间
                        </span>
                      <span style={{ width: 180, display: 'inline-block' }}>
                        <RangePicker onChange={this.handleDate} value={timeData} />
                      </span>
                    </Col>
                  </Row>
                </div>
                <Table dataSource={tableData} bordered {...tableState} columns={columns} />
              </div>
            </TabPane>
          </Tabs>
        </Spin>

        <div className={styles.textRight}>
          <Pagination
            showSizeChanger onShowSizeChange={this.onShowSizeChange} current={pageIndex}
            total={totalNum}
            onChange={this.onChangPage}
            pageSize={pageSize}
            pageSizeOptions={['10', '20', '30']}
              />
        </div>
      </div>
    );
  }
}

saleData.propTypes = {

};

saleData.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default saleData;
