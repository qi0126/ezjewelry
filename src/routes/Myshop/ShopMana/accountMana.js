import React from 'react';
import { Input, Button, Row, Col, Table, message, Radio, Modal, Form, Checkbox,Spin } from 'antd';
import app from 'app';

import styles from './accountMana.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class AccountMana extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      search: '',
      changeVisible: false,

      // 新增子账号
      visible: false,
      confirmLoading: false,
      saveLoading: false,
      visibleInfo: false,

      // 弹窗用户
      modalUser: {},

      // 弹窗权限
      modalAuth: [],
      modalAuthTrue: [],

      pwdSlide: false,
      proLoading: true, // 筛选条件加载中属性
    };
  }

  getCol() {
    this.setState({
      columns: [
        {
          title: <span style={{ display: 'table', margin: '0 auto' }}>帐号</span>,
          dataIndex: 'account',
          key: 'account',
        },
        {
          title: <span style={{ display: 'table', margin: '0 auto' }}>密码</span>,
          dataIndex: 'id',
          key: 'id',
          render: () => <div>********</div>,
        },
        {
          title: <span style={{ display: 'table', margin: '0 auto' }}>姓名</span>,
          dataIndex: 'nickName',
          key: 'nickName',
        },
        {
          title: <span style={{ display: 'table', margin: '0 auto' }}>备注</span>,
          dataIndex: 'remark',
          key: 'remark',
        },
        {
          // title: <span style={{ display: 'table', margin: '0 auto' }}>审核状态</span>,
          title: <span style={{ display: 'table', margin: '0 auto' }}>审核状态</span>,
          dataIndex: 'isUse',
          key: 'isUse',
          onCellClick: (record, event) => { event.stopPropagation(); },
          render: (text, record, index) => (
            <div>
              {
                <RadioGroup onChange={this.changeStatusModal.bind(this, record, index)} defaultValue={text}>
                  <Radio value={0}>启用</Radio>
                  <Radio value={1}>禁用</Radio>
                </RadioGroup>
              }
            </div>
          ),
        },
      ],
    });
  }

  changeStatusModal(item, index) {
    let { id, isUse } = item;
    isUse = isUse === 0 ? 1 : 0;
    const params = {
      id,
      statu: isUse,
    };
    app.$api.enaOrDisaSub(params).then();
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
    app.$api.shopSubList(params).then((res) => {
      const { rowSize: total, data: dataSource } = res.data;
      this.setState({
        dataSource,
        total,
        proLoading:false,
      });
    });
  }

  filterVip(pagina) {
    this.getVipList(pagina.current);
  }

  // 单元格样式
  rowClass() {
    return styles.rowClass;
  }

  // 新增
  create() {
    this.setState({
      visible: true,
    });
  }

  // 取消创建子账号
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 取消修改子账号
  handleCancelInfo= () => {
    this.setState({
      visibleInfo: false,
    });
  }

  vali(params) {
    if (!app.$v.verifyMobile(params.account)) {
      message.error('帐号请输入手机格式');
      return false;
    }

    if (!params.password && params.password.toString().trim()) {
      message.error('请输入密码');
      return false;
    }
    if (!params.name && params.name.toString().trim()) {
      message.error('请输入姓名');
      return false;
    }
    if (!params.remark && params.remark.toString().trim()) {
      message.error('请输入备注');
      return false;
    }

    return true;
  }

  // 创建子账号
  createAccount(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    if (!this.vali(params)) {
      return false;
    }
    this.setState({
      confirmLoading: true,
    });
    app.$api.shopAddSub(params).then((res) => {
      message.success('创建成功');
      this.setState({
        visible: true,
        confirmLoading: false,
      });
    }).catch((err) => {
      this.setState({
        confirmLoading: false,
      });
    });
  }

  // 取出数组不同
  getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter((v, i, arr) => {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    });
  }

  // 修改子账号
  editAccount(e) {
    e.preventDefault();
    const paramsFrom = this.props.form.getFieldsValue();
    const { modalAuth } = this.state;
    const { id: userId } = this.state.modalUser;
    const { auths } = paramsFrom;

    const modalAuthAll = modalAuth.map((item) => {
      return item.id;
    });

    const params = {
      userId,
      auths: this.getArrDifference(auths, modalAuthAll).join(','),
    };

    app.$api.userUserAuth(params).then((res) => {
      message.success('创建成功');
      this.setState({
        visibleInfo: true,
        saveLoading: false,
      });
    }).catch((err) => {
      this.setState({
        saveLoading: false,
      });
    });
  }

  // 验证密码
  inputPWd(e) {
    const option = e.target.value;
    // app.$v.verifyPassword(option)
    // console.log(app.$v.verifyPassword(option));
  }

  // 点击行
  rowClick(e) {
    const params = {
      userId: e.id,
    };
    app.$api.getAuthByUserId(params).then((res) => {
      console.log(res);
      let { user: modalUser, auth: modalAuth, modalAuthTrue } = res.data;
      modalAuthTrue = modalAuth.map((item) => {
        if (item.ais === 'true') {
          return item.id;
        }
      });
      // console.log(modalAuthTrue, modalAuth);
      this.setState({
        modalUser,
        modalAuth,
        modalAuthTrue,
      }, () => {
        this.setState({
          visibleInfo: true,
        });
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource, columns, total, visible, visibleInfo, confirmLoading, saveLoading, modalUser, modalAuth, modalAuthTrue } = this.state;
    return (
      <div className={styles.accountMana}>
        <div className={styles.sAudit}>
          <div className={styles.top}>
            <div className={styles.tit}>帐号管理</div>
          </div>
          <Row type="flex" justify="end">
            <Col span={4}>
              <Button type="primary" onClick={this.create.bind(this)}>
                创建子账号
              </Button>
            </Col>
          </Row>
          <div style={{ height: 30 }} />
          <Spin size="large" spinning={this.state.proLoading} >
            <Table
              style={{ marginRight: 50 }}
              bordered
              onRowClick={this.rowClick.bind(this)}
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
        </div>

        <Modal title="创建子账号" visible={visible} footer={false} onCancel={this.handleCancel} >
          <div>
            <Form onSubmit={this.createAccount.bind(this)}>
              <div className={styles.inWrap}>
                <div className={`${styles.left}`}>帐号: </div>
                <div className={styles.right}>
                  <FormItem>{getFieldDecorator('account', {})(<Input style={{ width: 234 }} placeholder="请输入账户名称" />)}</FormItem>
                </div>
              </div>

              <div className={styles.inWrap}>
                <div className={`${styles.left}`}>密码：</div>
                <div className={styles.right}>
                  <FormItem>
                    {getFieldDecorator('password', {})(<Input type={this.state.pwdSlide ? 'text' : 'password'} style={{ width: 234 }} onInput={this.inputPWd.bind(this)} placeholder="请输入密码" />)}
                  </FormItem>

                  <div style={{ marginLeft: '30px' }}>
                    <img
                      className="cursor"
                      onClick={() => {
                        this.setState({
                          pwdSlide: !this.state.pwdSlide,
                        });
                      }}
                      src={this.state.pwdSlide ? './images/icon-showpwd.png' : './images/icon-hidepwd.png'}
                      alt="show"
                      width="20"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.inWrap}>
                <div className={`${styles.left}`}>姓名:</div>
                <div className={styles.right}>
                  <FormItem>{getFieldDecorator('name', {})(<Input style={{ width: 234 }} placeholder="请输入姓名" />)}</FormItem>
                </div>
              </div>

              <div className={styles.inWrap}>
                <div className={`${styles.left}`}>备注:</div>
                <div className={styles.right}>
                  <FormItem>{getFieldDecorator('remark', {})(<Input style={{ width: 234 }} placeholder="请输入备注" />)}</FormItem>
                </div>
              </div>
              <div style={{ margin: '40px 0' }} />
              <Row type="flex" justify="center" > <Col> <Button type="primary" onClick={this.handleCancel} >取消</Button> </Col><Col offset={2} ><Button htmlType="submit" type="primary" loading={confirmLoading} >确认创建</Button></Col> </Row>
            </Form>
          </div>
        </Modal>


        <Modal title="子账号信息" width={800} visible={visibleInfo} footer={false} onCancel={this.handleCancelInfo} >
          <div>
            <Form onSubmit={this.editAccount.bind(this)}>
              <div className={styles.inWrap}>
                <div className={`${styles.left}`}>帐号: </div>
                <div className={styles.right}>
                  {modalUser.account}
                  {/* <FormItem>{getFieldDecorator('account', {})(<Input style={{ width: 234 }} placeholder="请输入账户名称" />)}</FormItem> */}
                </div>
              </div>

              <div className={styles.inWrap}>
                <div className={`${styles.left}`}>密码：</div>
                <div className={styles.right}>
                *******
                </div>
              </div>

              <div className={styles.inWrap}>
                <div className={`${styles.left}`}>姓名:</div>
                <div className={styles.right}>
                  {modalUser.nickName}
                  {/* <FormItem>{getFieldDecorator('name', {})(<Input style={{ width: 234 }} placeholder="请输入姓名" />)}</FormItem> */}
                </div>
              </div>

              <div className={styles.inWrap}>
                <div className={`${styles.left}`}>备注:</div>
                <div className={styles.right}>
                  {modalUser.remark}
                  {/* <FormItem>{getFieldDecorator('remark', {})(<Input style={{ width: 234 }} placeholder="请输入备注" />)}</FormItem> */}
                </div>
              </div>

              <div className={styles.inWrap} style={{ alignItems: 'start', marginTop: 10 }}>
                <div className={`${styles.left}`}>权限:</div>
                <div className={styles.right}>
                  <FormItem>{getFieldDecorator('auths', { initialValue: modalAuthTrue })(
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row>
                        {modalAuth.map((item) => { return (<Col span={8} key={item.id} ><Checkbox value={item.id}>{item.aname}</Checkbox></Col>); })}
                      </Row>
                    </Checkbox.Group>,
                  )}</FormItem>

                  {/* <FormItem>{getFieldDecorator('remark', {})(<Input style={{ width: 234 }} placeholder="请输入备注" />)}</FormItem> */}
                </div>
              </div>

              <div style={{ margin: '40px 0' }} />
              <Row type="flex" justify="center" > <Col> <Button type="primary" onClick={this.handleCancelInfo} >取消</Button> </Col><Col offset={2} ><Button htmlType="submit" type="primary" loading={saveLoading} >保存</Button></Col> </Row>
            </Form>
          </div>
        </Modal>


      </div>
    );
  }
}

AccountMana.propTypes = {};

const AccountManaFrom = Form.create()(AccountMana);

export default AccountManaFrom;
