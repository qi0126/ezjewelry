import React from 'react';
import { Radio, Cascader, Button, Select, Input, Form, message } from 'antd';
import app from 'app';
import PropTypes from 'prop-types';
import styles from './CreatePlat.less';
import CancelEdit from '../common/CancelEdit/CancelEdit';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class CreatePlat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pwdSlide: false, // 密码显示隐藏
      createdLoading: false,
      country: 'China',
      produceType: 'k金',

      // 编辑方法begin
      backData: {}, // 编辑回填数据
      pageEdit: false, // 是否处于编辑页面
      editBtnStatu: false, // 编辑按钮是否显示
      editStatu: true, // 是否处于编辑状态
      // 编辑方法end

      // 是否是审批状态
      auditStatu: false,
    };
  }

  componentDidMount() {
    this.backDataEvent();
  }


  // 判断是否是未审批状态 true未审批 false已审批
  getAuditStatu(options) {
    if (options.audit === 0 || options.audit === 1) {
      return true;
    }
    return false;
  }

  /**
   *  编辑方法begin
   */

  // 数据回填
  backDataEvent() {
    const { handle, backData } = this.props.location.state;
    if (handle === 'edit') {
      this.backDataHandle(backData);
      this.setState({
        editStatu: false,
        editBtnStatu: true,
        pageEdit: true,
        backData,
      });
    }
  }

  // 回填数据处理
  backDataHandle(options) {
    const { id, country, region, imgOne, headPic, produceType, account } = options;
    const otherData = {
      region: (region && typeof region === 'string') ? region.split(',') : region,
    };
    const cardImg = imgOne.split(',');
    Object.assign(options, otherData);

    // 回填图片处理
    this.setState({
      backAccount: account,
      id,
      auditStatu: this.getAuditStatu(options),
      country,
      produceType: (produceType !== 'k金' && produceType !== '素金' && produceType !== '镶嵌') ? 4 : produceType,
      produceTypeValue: (produceType !== 'k金' && produceType !== '素金' && produceType !== '镶嵌') ? produceType : '',
      logoImg: headPic,
      cardTrueImg: cardImg[0],
      cardFalseImg: cardImg[1],
      backData: options,
    }, () => {
      // console.log(this.state.backData);
    });
  }

  /**
   *  编辑方法end
   */

  // 生产
  changeProType(e) {
    this.setState({
      produceType: e.target.value,
    });
  }

  // 改变国家
  changeCountry(e) {
    this.setState({
      country: e,
    });
  }

  // 获取身份证正面
  cartTrue(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        cardTrueImg: res.data,
      });
    });
  }

  // 获取身份证反面
  cartFalse(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        cardFalseImg: res.data,
      });
    });
  }

  // 验证编辑密码方法
  pageEditValiPWD(params) {
    if (params.password && params.password.toString().trim()) {
      return true;
    }
    return false;
  }

  // 验证密码
  inputPWd(e) {
    const option = e.target.value;
    app.$v.verifyPassword(option);
    // console.log(app.$v.verifyPassword(option));
  }


  vali(params) {
    // 新建状态
    if (!this.state.pageEdit) {
      // if (params.password !== params.password2) {
      //   message.error('两次输入密码不一致');
      //   return false;
      // }

      if (!app.$v.verifyMobile(params.account)) {
        message.error('帐号请输入手机格式');
        return false;
      }
    } else {
      // 编辑状态
      // if (this.pageEditValiPWD(params)) {
      //   if (params.password !== params.password2) {
      //     message.error('两次输入密码不一致');
      //     return false;
      //   }
      // }
    }

    // 公用验证begin
    if (!params.realName) {
      message.error('请输入姓名');
      return false;
    }

    if (!params.realName.toString().trim()) {
      message.error('请输入姓名');
      return false;
    }

    if (!params.sex) {
      message.error('请输入性别');
      return false;
    }

    if (!params.addrDetail && params.addrDetail.toString().trim()) {
      message.error('请输入详细地址');
      return false;
    }

    if (params.phone) {
      if (!app.$v.verifyPhone(params.phone)) {
        message.error('请输入正确的固定电话');
        return false;
      }
    }


    if (params.email) {
      if (!app.$v.verifyEmail(params.email)) {
        message.error('邮箱格式不正确');
        return false;
      }
    }

    if (this.state.country === 'China') {
      if (!params.region) {
        message.error('请选择地址');
        return false;
      }
    }
    // 公用验证end

    if (!params.nickName) {
      message.error('请输入公司名称');
      return false;
    }

    return true;
  }

  backPage() {
    this.context.router.goBack();
  }

  handleSubmit(e) {
    e.preventDefault();

    const params = this.props.form.getFieldsValue();
    const otherParams = {
      region: params.region ? params.region.join(',') : '',
      imgOne: `${this.state.cardTrueImg},${this.state.cardFalseImg}`,
      produceType: params.produceType !== 4 ? params.produceType : params.produceTypeValue,
    };

    Object.assign(params, otherParams);

    if (!this.vali(params)) {
      return false;
    }
    this.setState({ createdLoading: true });

    if (!this.state.pageEdit) {
      app.$api.factoryAdd(params).then((res) => {
        this.setState({ createdLoading: false });
        message.success('平台创建成功');
        this.context.router.goBack();
      }).catch((err) => {
        this.setState({ createdLoading: false });
      });
    } else {
      Object.assign(params, { id: this.state.backData.id });
      this.setPassWord(params);
      app.$api.factoryEdit(params).then((res) => {
        this.setState({ createdLoading: false });
        message.success('平台修改成功');
        this.context.router.goBack();
      }).catch((err) => {
        this.setState({ createdLoading: false });
      });
    }
  }

  // 设置密码
  setPassWord(options) {
    if (!this.pageEditValiPWD(options)) {
      return;
    }
    const params = {
      phone: this.state.backAccount,
      pwd: options.password,
    };
    app.$api.userChangPwd2(params);
  }

  getEditStatu(e) {
    this.setState({
      editStatu: !e,
      editBtnStatu: e,
    });
  }

    // 取消编辑状态
  cancelEditStatu() {
    this.setState({
      editStatu: false,
      editBtnStatu: true,
    });
  }

  userExamine(e) {
    const { id } = this.state;
    const params = {
      id,
      statu: e,
    };
    app.$api.userExamine(params).then((res) => {
      // message.success('操作成功');
      if (e === 2) {
        message.success('审核通过');
      } else if (e === 3) {
        message.success('审核未通过');
      }
      this.backPage();
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { auditStatu, editStatu, pageEdit } = this.state;
    return (
      <div className={styles.createPlat} >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <CancelEdit cancelStatu editStatu={this.state.editBtnStatu} getEditStatu={this.getEditStatu.bind(this)} />

          {/* 店铺申请进度 */}
          <div className={styles.sAudit}>
            <div className={styles.top}>
              {this.state.pageEdit ? (<div className={styles.tit}>供应商帐号资料</div>) : (<div className={styles.tit}>创建供应商账号</div>)}
            </div>

            <div className={styles.inWrap} >
              <div className={`${styles.left} ${this.state.editStatu && styles.dot}`}>账户名: <span style={{ fontSize: '12px' }} >(手机号格式)</span> </div>
              <div className={styles.right}>
                {!this.state.pageEdit ? (<FormItem >{getFieldDecorator('account', {})(
                  <Input disabled={!this.state.editStatu} style={{ width: 234 }} placeholder="请输入账户名称" />)}
                </FormItem>) : this.state.backAccount}
              </div>
            </div>

            <div className={styles.inWrap}>
              <div className={`${styles.left} ${!this.state.pageEdit && styles.dot}`}>密码：</div>
              <div className={styles.right}>
                {this.state.editStatu ? (<FormItem >{getFieldDecorator('password', {})(
                  <Input type={this.state.pwdSlide ? 'text' : 'password'} style={{ width: 234 }} onInput={this.inputPWd.bind(this)} placeholder="请输入密碼" />,
                )}
                </FormItem>) : ('************')}
                {this.state.editStatu && (<div style={{ marginLeft: '30px' }}> <img
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
                </div>)}
              </div>
            </div>

            {/* <div className={styles.inWrap}>
              <div className={`${styles.left} ${!this.state.pageEdit && styles.dot}`}>请重复输入密码：</div>
              <div className={styles.right}>
                {this.state.editStatu ? (<FormItem >{getFieldDecorator('password2', {})(
                  <Input type="password" style={{ width: 234 }} placeholder="请再次输入密碼" />,
              )}
                </FormItem>) : ('************')}
              </div>
            </div> */}

          </div>

          <div style={{ height: 10, weight: 10, background: '#f8f8f8' }} />

          {/* 完善信息 */}
          <div className={`${styles.sAudit} ${styles.completeInfo}`} >
            <div className={styles.top}>
              <div className={`${styles.tit}`} style={{ fontSize: 14 }}>个人信息</div>
              {/* <div className={styles.right} style={{ fontSize: 14 }}>请尽快完善您的个人信息，“<span>*</span>”为必填项</div> */}
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>姓名：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('realName', { initialValue: this.state.backData.realName })(
                  <Input disabled={!this.state.editStatu} placeholder="请输入您的姓名" />,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>性别：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('sex', { initialValue: this.state.backData.sex || '男' })(
                  <RadioGroup disabled={!this.state.editStatu} >
                    <Radio value="男">男</Radio>
                    <Radio value="女">女</Radio>
                  </RadioGroup>,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>公司名称：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('nickName', { initialValue: this.state.backData.nickName })(
                  <Input disabled={!this.state.editStatu} placeholder="请输入公司名称" />,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>公司详细地址：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('addrDetail', { initialValue: this.state.backData.addrDetail })(
                  <Input disabled={!this.state.editStatu} style={{ width: 400 }} placeholder="请输入公司详细地址" />,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`}>您所在的国家及地区：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('country', { initialValue: this.state.backData.country || 'China' })(
                  <Select disabled={!this.state.editStatu} style={{ width: 120 }} onChange={this.changeCountry.bind(this)}>
                    {app.$tool.country.map((item) => {
                      return <Option value={item.cityEndName} key={item.cityEndName}>{item.cityName}</Option>;
                    })}
                  </Select>,
                )}
                </FormItem>

                {this.state.country === 'China' && <FormItem style={{ marginLeft: '20px' }}>{getFieldDecorator('region', { initialValue: this.state.backData.region || '' })(
                  <Cascader disabled={!this.state.editStatu} options={app.$tool.city} style={{ border: '1px solid #d9d9d9' }} onChange={this.changeCity} placeholder="请选择省市区" />,
                )}
                </FormItem>}
              </div>
            </div>


            <div className={styles.col}>
              <div className={`${styles.left} `}>固定电话：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('phone', { initialValue: this.state.backData.phone })(
                  <Input disabled={!this.state.editStatu} placeholder={(!pageEdit || editStatu) ? '请输入您的固定电话' : '暂未填写'} />,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={styles.left}>邮箱：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('email', { initialValue: this.state.backData.email })(
                  <Input disabled={!this.state.editStatu} placeholder={(!pageEdit || editStatu) ? '请输入您的常用邮箱' : '暂未填写'} />,
                )}
                </FormItem>
              </div>
            </div>

            <div className={styles.imgCol}>
              <div className={styles.imgTop}>身份证</div>
              <div className={styles.imgWrap}>

                <div className={styles.imgItem}>
                  <div className={styles.imgBox}> <label htmlFor="cardTrue"><img src={this.state.cardTrueImg ? `${app.$http.imgURL}${this.state.cardTrueImg}` : './images/img-normal.png'} alt="身份证正面照" /></label>
                    {this.state.cardTrueImg && this.state.editStatu && (<div className={styles.delImg} onClick={() => { this.setState({ cardTrueImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证正面照</p>
                </div>
                <input type="file" disabled={!this.state.editStatu} id="cardTrue" onChange={this.cartTrue.bind(this)} style={{ display: 'none' }} />

                <div className={styles.imgItem}>
                  <div className={styles.imgBox}> <label htmlFor="cardFalse"><img src={this.state.cardFalseImg ? `${app.$http.imgURL}${this.state.cardFalseImg}` : './images/img-normal.png'} alt="身份证反面照" /></label>
                    {this.state.cardFalseImg && this.state.editStatu && (<div className={styles.delImg} onClick={() => { this.setState({ cardFalseImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加身份证反面照</p>
                </div>
                <input type="file" disabled={!this.state.editStatu} id="cardFalse" onChange={this.cartFalse.bind(this)} style={{ display: 'none' }} />

              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}`}>供应商生产类型：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('produceType', { initialValue: this.state.produceType })(
                  <RadioGroup disabled={!this.state.editStatu} style={{ width: '200px', display: 'flex', alignItems: 'center' }} onChange={this.changeProType.bind(this)}>
                    <Radio value="K金">K金</Radio>
                    <Radio value="素金">素金</Radio>
                    <Radio value="镶嵌">镶嵌</Radio>
                    <Radio value={4}>其他</Radio>
                  </RadioGroup>)}
                </FormItem>
                {this.state.produceType !== 4 ? null : <FormItem >{getFieldDecorator('produceTypeValue', { initialValue: this.state.produceTypeValue })(
                  <Input disabled={!this.state.editStatu} style={{ border: '1px solid #eee' }} placeholder="请输入您的实体店铺名称" />,
                )}
                </FormItem>}

              </div>
            </div>
          </div>


          <div className={styles.bottom}>
            {/* pageEdit true 编辑页面 false 新建页面 */}
            {/* editStatu true 编辑状态 false 未编辑状态  */}
            {/* auditStatu true  未审核 false 已审核状态 */}
            <div className={styles.btn}>

              {/* 新建页面 */}
              {!pageEdit && <p onClick={this.cancelEditStatu.bind(this)}>取消</p>}
              {!pageEdit && (<Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading}>完成创建</Button>)}

              {/* 未审核状态 */}
              {pageEdit && auditStatu && !editStatu && (<Button type="primary" size="large" style={{ marginRight: 20 }} onClick={this.userExamine.bind(this, 3)} loading={this.state.createdLoading}>拒绝通过</Button>)}
              {pageEdit && auditStatu && !editStatu && (<Button type="primary" size="large" onClick={this.userExamine.bind(this, 2)} loading={this.state.createdLoading}>审核通过</Button>)}
              {/* 未审核状态编辑 */}
              {pageEdit && auditStatu && editStatu && <p onClick={this.cancelEditStatu.bind(this)}>取消编辑</p>}
              {pageEdit && auditStatu && editStatu && <Button type="primary" disabled={!this.state.editStatu} size="large" htmlType="submit" loading={this.state.createdLoading}>保存</Button>}

              {/* 已审核状态 */}
              {/* 已审核状态编辑 */}
              {pageEdit && !auditStatu && editStatu && <p onClick={this.cancelEditStatu.bind(this)}>取消编辑</p>}
              {pageEdit && !auditStatu && editStatu && (<Button type="primary" disabled={!this.state.editStatu} size="large" htmlType="submit" loading={this.state.createdLoading}>保存</Button>)}
            </div>
          </div>

        </Form>
      </div>
    );
  }
}

CreatePlat.propTypes = {

};

CreatePlat.contextTypes = {
  router: PropTypes.object.isRequired,
};


const CreatePlatx = Form.create()(CreatePlat);

export default CreatePlatx;
