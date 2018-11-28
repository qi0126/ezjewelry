import React from 'react';
import { Button, Input, Form, message } from 'antd';
import app from 'app';
import PropTypes from 'prop-types';
import styles from './shopData.less';

const FormItem = Form.Item;

class ShopData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      createdLoading: false,
      logo: '',
      country: 'China',
      introLength: 0,

      // 编辑方法begin
      backData: {}, // 编辑回填数据
      pageEdit: false, // 是否处于编辑页面
      // 编辑方法end

      count: 0,

      // 第一次拿到数据
      dataFlag: true,
    };
  }


  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { dataFlag } = this.state;

    if (!dataFlag) {
      return;
    }
    if (nextProps.result.propsStatus) {
      console.log(nextProps.result);
      this.backDataEvent(nextProps.result);
      this.setState({
        dataFlag: false,
      });
    }
  }

  /**
   *  编辑方法begin
   */

  // 数据回填
  backDataEvent(options) {
    const refObj = JSON.stringify(options);
    const obj = JSON.parse(refObj);
    for (const i in obj) {
      this.setState({
        [i]: obj[i],
      });
    }
  }

  /**
   *  编辑方法end
   */

  vali(params) {
    if (!params.cname) {
      message.error('请输入店铺名称');
      return false;
    }
    return true;
  }

  backPage() {
    this.props.backPage();
  }

  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    const otherParams = {
      logo: this.state.logoImg,
    };
    Object.assign(params, otherParams);
    if (!this.vali(params)) {
      return false;
    }
    this.setState({ createdLoading: true });
    app.$api.shopStep2(params).then((res) => {
      this.setState({ createdLoading: false });
      this.props.dataTrue(params);
    }).catch((err) => {
       this.setState({ createdLoading: false });
     });
  }


  // 获取logo
  changeLogo(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        logoImg: res.data,
      });
    });
  }

  // 计算文字长度
  computeWord(e) {
    const val = e.target.value;
    this.setState({
      introLength: val && val.length,
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.createShop} >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          {/* 店铺申请进度 */}

          <div className={`${styles.sAudit} ${styles.shopData}`} >
            <div className={styles.top}>
              <div className={styles.tit}>店铺资料</div>
              {(<div className={styles.right}>您所命名的店铺名称及logo只做临时申请，待平台审核后方可生效</div>) }
            </div>
            <div className={styles.col}>
              <div className={`${styles.left} ${styles.dot}`} >店铺名称：</div>
              <div className={styles.right}>
                <FormItem >{getFieldDecorator('cname', { initialValue: this.state.backData.nickName })(
                  <Input placeholder="请输入您的店铺名称" />,
              )}
                </FormItem>
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left}  ${styles.alignSelf}`} style={{ paddingTop: 20 }}>店铺logo：</div>
              <div className={`${styles.right} ${styles.logo} ${styles.imgItem}`} >

                <div className={styles.imgBox}> <label htmlFor="logo"><img className={styles.logoImg} src={this.state.logoImg ? `${app.$http.imgURL}${this.state.logoImg}` : './images/img-normal2.png'} alt="logo" /></label>
                  {this.state.logoImg && (<div className={styles.delImg} onClick={() => { this.setState({ logoImg: '' }); }}><span>-</span></div>)}</div>

                <input type="file" id="logo" onChange={this.changeLogo.bind(this)} style={{ display: 'none' }} />
                { (<p>请上传格式为JPG或png格式的图片，大小3Mb以内</p>)}
              </div>
            </div>

            <div className={styles.col}>
              <div className={`${styles.left} ${styles.alignSelf}`} style={{ paddingTop: 30 }} >店铺介绍：</div>
              <div className={`${styles.right} ${styles.textArea}`}>
                <div className={styles.text}>
                  <FormItem >{getFieldDecorator('desc', { initialValue: this.state.backData.introduce })(
                    <textarea onInput={this.computeWord.bind(this)} maxLength="300" placeholder="请输入店铺介绍信息......" cols="30" rows="10" />,
              )}
                  </FormItem>
                </div>
                <p>({this.state.introLength}/300字节）</p>
              </div>
            </div>

          </div>

          <div className={styles.bottom}>
            <div className={styles.btn}>
              <p onClick={this.backPage.bind(this)}>上一步</p>
              <FormItem>
                <Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading}>提交审核</Button>
              </FormItem>
            </div>
          </div>

        </Form>
      </div>
    );
  }
}

ShopData.propTypes = {

};

ShopData.contextTypes = {
  router: PropTypes.object.isRequired,
};

const ShopDataFrom = Form.create()(ShopData);


export default ShopDataFrom;
