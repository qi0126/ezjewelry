import React from 'react';
import { connect } from 'dva';
import { Input, Button, message } from 'antd';
import app from 'app';
import $ from 'jquery';


import styles from './Certificate.less';

function createGIA(html) {
  const gia = {};
  gia.pdf = html.find('.giapdf').attr('onclick').replace(/show_pdf|\(|\)|'/g, '');
  gia.dateAddress = gia.pdf.replace('http://certs.gia114.com/gia/', '').substring(0, 10);
  gia.fullName = html.find('.report_summary').text().trim();
  gia.shape = gia.fullName.substring(0, gia.fullName.indexOf(' ') - 1);
  gia.size = html.find('.report_details').eq(0).find('td.val').eq(0).text();
  gia.carat = html.find('.report_details').eq(0).find('td.val').eq(1).text();
  gia.color = html.find('.report_details').eq(0).find('td.val').eq(2).text();
  gia.clarity = html.find('.report_details').eq(0).find('td.val').eq(3).text();
  gia.cut = html.find('.report_details').eq(0).find('td.val').eq(4).text();

  gia.depth = html.find('.report_details').eq(1).find('td.val').eq(0).text();
  gia.tablePer = html.find('.report_details').eq(1).find('td.val').eq(1).text();
  gia.crownAngle = html.find('td:contains(Crown Angle)').siblings().text();
  gia.crownHeight = html.find('td:contains(Crown Height)').siblings().text();
  gia.pavilionAngle = html.find('td:contains(Pavilion Angle)').siblings().text();
  gia.pavilionDepth = html.find('td:contains(Pavilion Depth)').siblings().text();
  gia.starLength = html.find('td:contains(Star Length)').siblings().text();
  gia.lowerHalf = html.find('td:contains(Lower Half)').siblings().text();
  gia.girdle = html.find('td:contains(Girdle)').siblings().text();
  gia.bottomTip = html.find('td:contains(Culet)').siblings().text();

  gia.polish = html.find('.report_details').eq(2).find('td.val').eq(0).text();
  gia.symmetry = html.find('.report_details').eq(2).find('td.val').eq(1).text();
  gia.fluor = html.find('.report_details').eq(3).find('td.val').eq(0).text();
  gia.features = html.find('.report_details').eq(4).find('td.val').eq(0).text();
  gia.remark = html.find('p:contains(Comments)').parent().find('.val').text();
  gia.waistCode = html.find('p:contains(Inscription)').parent().find('.val').text();

  const typeAndCode = gia.waistCode.split(' ');
  gia.type = typeAndCode[0];
  gia.code = typeAndCode[1];

  createProp(gia);
  return gia;
}

// 生成形状中文名称和图片
function createProp(cert) {
  const i = cert.shape && shapeName[cert.shape.toUpperCase()];
  cert.shapeChName = shapeChName[i];
  // cert.shapeImg = shapeImg[i];
}
// 初始化参数
var shapeName = createShape();
var shapeChName = ['圆形', '公主方形', '祖母绿', '三角形', '枕形', '橄榄形', '雷帝恩形', '椭圆形', '梨形', '心形'];
// let shapeImg = ['zszel01.png', 'zszel05.png', 'zszel02.png', 'zszel04.png', 'zszel09.png', 'zszel07.png', 'zszel08.png', 'zszel10.png', 'zszel06.png', 'zszel03.png'];
function createShape() {
  if (shapeName) return shapeName;
  shapeName = [];
  shapeName.ROUND = 0;
  shapeName.PRINCESS = 1;
  shapeName.EMERALD = 2;
  shapeName.TRIANGLE = 3;
  shapeName.CUSHION = 4;
  shapeName.MARQUISE = 5;
  shapeName.RADIANT = 6;
  shapeName.OVAL = 7;
  shapeName.PEAR = 8;
  shapeName.HEART = 9;
  return shapeName;
}

// //生成IGI证书对象
// function createIGI(html){
// 	var igi = {};
// 	igi.pdf = html.find('a:contains(Download PDF)').attr('href');
// 	igi.dateAddress = html.find('.report_details').find('td.val').eq(1).text();
// 	igi.shape = html.find('.report_details').find('td.val').eq(2).text().split(' ')[0];
// 	igi.size = html.find('.report_details').find('td.val').eq(3).text();
// 	igi.carat = html.find('.report_details').find('td.val').eq(4).text();
// 	igi.color = html.find('.report_details').find('td.val').eq(5).text();
// 	igi.clarity = html.find('.report_details').find('td.val').eq(6).text();
// 	igi.cut = html.find('.report_details').find('td.val').eq(7).text();
// 	igi.depth = html.find('.report_details').find('td.val').eq(8).text();
// 	igi.tablePer = html.find('.report_details').find('td.val').eq(9).text();
// 	igi.crownHeight = html.find('td:contains(Crown Height)').siblings().text();
// 	igi.pavilionDepth = html.find('td:contains(Pavilion Depth)').siblings().text();
// 	igi.girdle = html.find('td:contains(Girdle)').siblings().text();
// 	igi.bottomTip = html.find('td:contains(Culet)').siblings().text();
// 	igi.polish = html.find('td:contains(Polish)').siblings().text();
// 	igi.symmetry = html.find('td:contains(Symmetry)').siblings().text();
// 	igi.fluor = html.find('td:contains(Fluorescence)').siblings().text();
// 	igi.remark = html.find('td:contains(Description)').siblings().text();

// 	igi.type = 'IGI';
// 	igi.code = $('[name="q"]').val();
// 	igi.waistCode = igi.type+' '+igi.code;

// 	createProp(igi);
// 	return igi;
// }

// GIA 6232150384

class Certificate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cerd: '',
      historyList: [],
      result: {},
    };
  }

  componentDidMount() {
    if (app.$storage.get('certQuery')) {
      this.setState({
        historyList: app.$storage.get('certQuery'),
      });
    }
  }

  getCert() {
    const params = {
      q: this.state.cerd,
      t: '1',
    };
    app.$api.getCert(params).then((res) => {
      this.setState({
        result: createGIA($(res.msg)),
      });
      this.state.historyList.unshift(this.state.cerd);
      this.state.historyList = [...new Set(this.state.historyList)];
      if (this.state.historyList.length > 20) {
        this.state.historyList.pop();
      }
      this.setState({
        historyList: this.state.historyList,
      });
      app.$storage.set('certQuery', this.state.historyList);
    }).catch((err) => {
      message.error('查询失败');
    });

  }

  changeCerd(e) {
    this.setState({
      cerd: e.target.value,
    });
  }

  resetCert() {
    this.setState({
      cerd: '',
      result: {},
    });
  }

  // 点击搜索地址
  clickHistory(e) {
    this.setState({
      cerd: e,
    }, (res) => {
      this.getCert();
    });
  }

  render() {
    return (
      <div>
        <div className={styles.certificate} >
          <div className={styles.sAudit}>
            <div className={styles.top}>
              <div className={styles.tit}>钻石证书查询</div>
            </div>

            <div className={styles.twoWrap}>
              {/* <div className={styles.twoTit} >选择证书类型</div>
              <div className={styles.tList}>
                <p className={styles.on}>GIA证书查询</p>
                <p>AGS证书查询</p>
                <p>AIGS证书查询</p>
                <p>CGL证书查询</p>
                <p>NGTC(国检)证书</p>
              </div> */}
            </div>

            <div className={styles.query}>
              <div className={`${styles.twoWrap} ${styles.queryLeft}`}>
                <div className={styles.twoTit} >
                选择证书类型
                <span>美国珠宝学院认证,业内最权威的证书所有权归官网所有</span>
                </div>

                <div className={styles.tInfo}>
                  <div> <Input placeholder="请输入证书号" value={this.state.cerd} onChange={this.changeCerd.bind(this)} /> </div>
                  <div><Button type="primary" onClick={this.getCert.bind(this)} >查询</Button></div>
                  <div><Button type="primary" onClick={this.resetCert.bind(this)}>重置</Button></div>
                </div>
              </div>
              <div className={styles.queryRight}>
                <div className={styles.rTit}>
                查询记录
              </div>
                <div className={styles.rInfo}>
                  {this.state.historyList.map((item) => {
                    return (<p key={item} onClick={this.clickHistory.bind(this, item)} >GIA {item}</p>);
                  })}

                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '20px', background: '#f8f8f8' }} />
        { JSON.stringify(this.state.result) !== '{}' ? (<div className={styles.certificate}>
          <div className={styles.result}>
            <div className={styles.row} style={{ marginBottom: '20px' }}>
              <p className={styles.rowTit}>搜索结果</p>
              <p className={styles.rowInfo}>
                <div className={styles.riInfo}>
                  <span className={styles.riLeft}>GIA证书编号</span>
                  <span className={styles.riRight}>{this.state.result.code}</span>
                </div>
                <div className={styles.riInfo}>
                  <span className={styles.riLeft}>颁发日期</span>
                  <span className={styles.riRight}>{this.state.result.dateAddress}</span>
                </div>
                <span><a href={this.state.result.pdf} target="_blank" style={{ color: '#EF5555' }}>下载PDF文件</a></span>
              </p>
            </div>
            <div className={styles.row}>
              <p className={styles.rowTit}>GIA钻石分级证书</p>
              <p className={styles.rowInfo}>
                <span>{this.state.result.fullName}</span>
              </p>
            </div>
          </div>
          <div className={styles.rowHr} />
          <div className={styles.specWrap}>
            <div className={styles.specTit}>{this.state.result.shapeChName}</div>
            <div className={styles.stInfo}>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>尺寸</p>
                <p className={styles.stlRight}>{this.state.result.size}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>切工</p>
                <p className={styles.stlRight}>{this.state.result.cut}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>克重</p>
                <p className={styles.stlRight}>{this.state.result.carat}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>抛光</p>
                <p className={styles.stlRight}>{this.state.result.polish}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>颜色</p>
                <p className={styles.stlRight}>{this.state.result.color}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>对称</p>
                <p className={styles.stlRight}>{this.state.result.symmetry}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>净度</p>
                <p className={styles.stlRight}>{this.state.result.clarity}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>荧光</p>
                <p className={styles.stlRight}>{this.state.result.fluor}</p>
              </div>
            </div>
          </div>
          <div className={styles.rowHr} />
          <div className={styles.specWrap}>
            <div className={styles.specTit}>比例</div>
            <div className={styles.stInfo}>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>全深比</p>
                <p className={styles.stlRight}> {this.state.result.depth}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>亭角</p>
                <p className={styles.stlRight}>{this.state.result.pavilionAngle}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>台宽比</p>
                <p className={styles.stlRight}>{this.state.result.tablePer}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>亭深比</p>
                <p className={styles.stlRight}>{this.state.result.pavilionDepth}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>冠角</p>
                <p className={styles.stlRight}>{this.state.result.crownAngle}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>星小面比</p>
                <p className={styles.stlRight}>{this.state.result.starLength}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>冠高比</p>
                <p className={styles.stlRight}>{this.state.result.crownHeight}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>下腰小面比</p>
                <p className={styles.stlRight}>{this.state.result.lowerHalf}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>腰棱</p>
                <p className={styles.stlRight}>{this.state.result.girdle}</p>
              </div>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>底尖</p>
                <p className={styles.stlRight}>{this.state.result.bottomTip}</p>
              </div>

            </div>
          </div>
          <div className={styles.rowHr} />
          <div className={styles.specWrap}>
            <div className={styles.specTit}>腰码</div>
            <div className={styles.stInfo}>
              <div className={styles.stList}>
                <p className={styles.stlLeft}>{this.state.result.waistCode}</p>
              </div>

            </div>
          </div>
        </div>) : (<div className={styles.normal}>暂无数据</div>) }




      </div>
    );
  }
}

Certificate.propTypes = {

};

export default Certificate;
