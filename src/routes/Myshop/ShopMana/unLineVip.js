import React from 'react';
import { Input, Button, message, Row, Col, Table, DatePicker, Select,Spin } from 'antd';
import moment from 'moment';
import app from 'app';
import DownModal from './common/downModal';

import styles from './unLineVip.less';

const Option = Select.Option;

class unLineVip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      search: '',
      visible: false,
      editStatus: false,

      emptyObj: {
        key: (Math.random() * 1000).toFixed(2),
        name: '',
        sex: '男',
        phone: '',
        birthday: new Date(),
        // createTime: new Date(),
        edit: true,
      },
      proLoading: true, // 筛选条件加载中属性
    };
  }

  getCol() {
    this.setState({
      columns: [{
        title: <span style={{ display: 'table', margin: '0 auto' }}>姓名</span>,
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => (
          <div>
            {record.edit ? <Input size="small" defaultValue={text} style={{ width: 80 }} onInput={this.getName.bind(this, record, index)} /> : text}
          </div>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>性别</span>,
        dataIndex: 'sex',
        key: 'sex',
        render: (text, record, index) => (
          (record.edit ? (<Select defaultValue={text || '男'} style={{ width: 50 }} size="small" onChange={this.changeSex.bind(this, record, index)}>
            <Option value="男">男</Option>
            <Option value="女">女</Option>
          </Select>) : text)
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>手机号码</span>,
        dataIndex: 'phone',
        key: 'phone',
        render: (text, record, index) => (
          <div>
            {record.edit ? <Input size="small" defaultValue={text} style={{ width: 110 }} onInput={this.getPhone.bind(this, record, index)} /> : text}
          </div>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>生日</span>,
        dataIndex: 'birthday',
        key: 'birthday',
        render: (text, record, index) => (
          <div>
            <DatePicker disabled={!record.edit} size="small" style={{ width: 110 }} defaultValue={moment(text)} onChange={this.changeBirth.bind(this, record, index)} />
          </div>
        ),
      }, {
        title: <span style={{ display: 'table', margin: '0 auto' }}>创建日期</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record, index) => (
          <div>
            {moment(text).format('YYYY-MM-DD')}
            {/* {record.edit ? (<DatePicker size="small" style={{ width: 110 }} defaultValue={moment(text)} onChange={this.changeDate.bind(this, record, index)} />) : text } */}
          </div>
        ),
      }, {
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
    app.$api.clientDelInfo(params).then((res) => {
      this.state.dataSource.splice(index, 1);
      this.setState({});
    });
  }

  valiCol(params) {
    if (!params.name) {
      message.error('请输入名称');
      return false;
    }
    if (!params.sex) {
      message.error('请选择性别');
      return false;
    }
    if (!app.$v.verifyMobile(params.phone)) {
      message.error('请输入正确的手机号');
      return false;
    }
    if (!params.birthday) {
      message.error('请输入生日');
      return false;
    }
    return true;
  }

  // 保存
  save(item, index, e) {
    let httpType = '';
    const { dataSource } = this.state;
    const { name, sex, birthday, phone } = item;
    const params = {
      name,
      sex,
      birthday: moment(birthday).format('YYYY-MM-DD'),
      phone,
    };
    if (!this.valiCol(params)) {
      return false;
    }
    if (item.id) {
      httpType = 'clientUpdateInfo';
      Object.assign(params, { id: item.id });
    } else {
      httpType = 'clientAddInfo';
    }
    app.$api[httpType](params).then((res) => {
      this.state.dataSource[index].edit = false;
      this.setState({ dataSource });
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

  // 名字
  getName(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].name = e.target.value;
    this.setState({ dataSource });
  }

  // 性别
  changeSex(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].sex = e;
    this.setState({ dataSource });
  }

  // 电话
  getPhone(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].phone = e.target.value;
    this.setState({ dataSource });
  }

  // 生日
  changeBirth(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].birthday = e;
    this.setState({ dataSource });
  }

  // 创建日期
  changeDate(item, index, e) {
    const { dataSource } = this.state;
    dataSource[index].createTime = e;
    this.setState({ dataSource });
  }

  componentDidMount() {
    this.getCol();
    this.getVipList(1);
  }

  getVipList(page, otherParams) {
    this.setState({
      proLoading: true,
    });
    const params = {
      page,
      row: 10,
      // search,
    };
    otherParams && Object.assign(params, otherParams);
    app.$api.clientInfoList(params).then((res) => {
      const { rowSize: total = 20, data: dataSource } = res.data;
      dataSource.forEach((item) => {
        item.key = (Math.random() * 1000).toFixed(2),
        item.name = item.realName,
        item.birthday = moment(item.birthday).format('YYYY-MM-DD');
        item.createTime = moment(item.createTime).format('YYYY-MM-DD');
        item.updateTime = moment(item.updateTime).format('YYYY-MM-DD');
      });
      this.setState({
        dataSource,
        total,
        proLoading: false,
      });

    });
  }

  filterVip(pagina) {
    this.getVipList(pagina.current);
  }

  // 获取搜索参数
  getSear(e) {
    this.setState({
      search: e.target.value,
    });
  }

  // 点击确定
  searInfo() {
    const { search } = this.state;
    const params = {
      search,
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

  // 增加更多
  addMore() {
    this.setState({
      visible: true,
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

  render() {
    const { dataSource, columns, total, visible } = this.state;
    return (
      <div className={styles.unLineVip} >
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>VIP客户管理</div>
            {/* <div className={styles.searchBox}>
          <Input style={{ width: 300 }} size="large" placeholder="输入供应商名称查询" />
          <Button className={styles.btn} type="primary">搜索</Button>
        </div> */}
          </div>
          <Row>
            <Col span={6} > <Input placeholder="昵称/手机号码/姓名" onInput={this.getSear.bind(this)} /></Col><Col span={4} offset={1} ><Button type="primary" onClick={this.searInfo.bind(this)} >搜索</Button></Col>
            <Col span={2} offset={6} ><Button type="primary" onClick={this.addOne.bind(this)} >单个增加</Button></Col><Col span={2} offset={1}><Button type="primary" onClick={this.addMore.bind(this)} >批量增加</Button></Col></Row>
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

unLineVip.propTypes = {

};

export default unLineVip;
