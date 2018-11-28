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

      // 毕业证书
      diplomaTrueImg: '',
      diplomaFalseImg: '',

      // 获奖证书
      prizeList: [],
      productList: [],

      dataFlag: true,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);

    const { dataFlag } = this.state;

    if (!dataFlag) {
      return;
    }
    if (nextProps.result.propsStatus) {
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

  backPage() {
    this.props.backPage();
  }

  handleSubmit(e) {
    e.preventDefault();

    const params = this.props.form.getFieldsValue();
    const { diplomaTrueImg, diplomaFalseImg, prizeList, productList } = this.state;
    const gcert = `${diplomaTrueImg},${diplomaFalseImg}`;
    const acert = prizeList.join(',');
    const works = productList.join(',');

    const otherParams = {
      gcert,
      acert,
      works,
    };

    Object.assign(params, otherParams);

    this.setState({ createdLoading: true });

    app.$api.designStep2(params).then((res) => {
      this.setState({ createdLoading: false });
      this.props.dataTrue(res);
    }).catch((err) => {
      this.setState({ createdLoading: false });
    });
  }


  // 获取毕业证书正面
  diplomaTrue(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        diplomaTrueImg: res.data,
      });
    });
  }

  // 获取毕业证书反面
  diplomaFalse(e)　{
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.setState({
        diplomaFalseImg: res.data,
      });
    });
  }

  // 增加获奖证书
  addPrize(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.state.prizeList.push(res.data);
      this.setState({
        prizeList: this.state.prizeList,
      });
    });
  }

  // 删除获奖证书
  delPrize(e) {
    this.state.prizeList.splice(e, 1);
    this.setState({
      prizeList: this.state.prizeList,
    });
  }

  // 增加作品
  addProduct(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    app.$api.upImgs(formData).then((res) => {
      this.state.productList.push(res.data);
      this.setState({
        productList: this.state.productList,
      });
    });
  }

    // 删除作品
  delProduct(e) {
    this.state.productList.splice(e, 1);
    this.setState({
      productList: this.state.productList,
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
      <div className={styles.shopDataWrap} >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          {/* 店铺申请进度 */}

          <div className={`${styles.sAudit} ${styles.shopData}`} >
            <div className={styles.top}>
              <div className={styles.tit}>证书与作品</div>
            </div>

            <div className={styles.imgCol}>
              <div className={styles.imgTop}>毕业证书（可选）
                {(<span className={styles.intro}>可选择内存10M以内的png，jpg等格式文件上传</span>)}
              </div>
              <div className={styles.imgWrap}>

                <div className={styles.imgItem}>
                  <div className={styles.imgBox}> <label htmlFor="diplomaTrue"><img src={this.state.diplomaTrueImg ? `${app.$http.imgURL}${this.state.diplomaTrueImg}` : './images/img-normal.png'} alt="身份证正面照" /></label>
                    {this.state.diplomaTrueImg && (<div className={styles.delImg} onClick={() => { this.setState({ diplomaTrueImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加毕业证书正面</p>
                </div>

                <input type="file" id="diplomaTrue" onChange={this.diplomaTrue.bind(this)} style={{ display: 'none' }} />
                <div className={styles.imgItem}>
                  <div className={styles.imgBox}> <label htmlFor="diplomaFalse"><img src={this.state.diplomaFalseImg ? `${app.$http.imgURL}${this.state.diplomaFalseImg}` : './images/img-normal.png'} alt="身份证反面照" /></label>
                    {this.state.diplomaFalseImg && (<div className={styles.delImg} onClick={() => { this.setState({ diplomaFalseImg: '' }); }}><span>-</span></div>)}</div>
                  <p>添加毕业证书反面</p>
                </div>
                <input type="file" id="diplomaFalse" onChange={this.diplomaFalse.bind(this)} style={{ display: 'none' }} />
              </div>
            </div>

            <div className={styles.imgCol}>
              <div className={styles.imgTop}>获奖证书（可选）
                {(<span className={styles.intro}>最多可上传六张相关的获奖证书</span>)}
              </div>

              <div className={styles.imgWrap}>
                {this.state.prizeList.map((item, index) => {
                  return (<div className={styles.imgItem} key={index}>
                    <img src={`${app.$http.imgURL}${item}`} alt="" />
                    {(<div className={styles.delImg} onClick={this.delPrize.bind(this, index)}><span>-</span></div>) }
                  </div>);
                })}

                {/* 增加 */}
                {this.state.prizeList.length !== 6 ? <label htmlFor="prize"><div className={styles.imgItem}>
                  <img src="./images/img-normal.png" alt="add" />
                  <input type="file" id="prize" onChange={this.addPrize.bind(this)} style={{ display: 'none' }} />
                </div></label> : null }
              </div>
              <div style={{ marginBottom: 24 }} />
            </div>

            <div className={styles.imgCol}>
              <div className={styles.imgTop}>作品（可选）
                {(<span className={styles.intro}>可选择内存20M以内的PDF，png，jpg等格式文件上传</span>)}
              </div>
              <div className={styles.imgWrap}>
                {this.state.productList.map((item, index) => {
                  return (<div className={styles.imgItem} key={index}>
                    <img src={`${app.$http.imgURL}${item}`} alt="img" />
                    {(<div className={styles.delImg} onClick={this.delProduct.bind(this, index)}><span>-</span></div>) }
                  </div>);
                })}

                {/* 增加 */}
                {this.state.productList.length !== 6 ? <label htmlFor="product"><div className={styles.imgItem}>
                  <img src="./images/img-normal.png" alt="add" />
                  <input type="file" id="product" onChange={this.addProduct.bind(this)} style={{ display: 'none' }} />
                </div></label> : null }
              </div>
              <div style={{ marginBottom: 24 }} />
            </div>

          </div>

          <div className={styles.bottom}>
            <div className={styles.btn}>
              <p onClick={this.backPage.bind(this)}>上一步</p>
              <FormItem>
                <Button type="primary" size="large" htmlType="submit" loading={this.state.createdLoading}>下一步</Button>
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
