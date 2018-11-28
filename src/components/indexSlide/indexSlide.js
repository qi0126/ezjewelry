import React from 'react';
import PropTypes from 'prop-types';
import styles from './indexSlide.less';

class indexSlide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgWidth: 0,
      offset: 0,
    };
  }

  componentDidMount() {
    const self = this;
    this.setState({
      imgWidth: this.refs.img.naturalWidth,
    });

    const x = 0;
    this.fun = () => {
      self.refs.box1.style.left = `${self.state.offset}px`;
      self.refs.box2.style.left = `${self.state.offset + self.state.imgWidth}px`;
      self.setState({
        offset: self.state.offset - 1,
      });
      if ((self.state.offset + self.state.imgWidth) === 0) {
        self.setState({
          offset: 0,
        });
      }
    };
    this.timer = setInterval(this.fun, this.props.speed);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  stopImg() {
    clearInterval(this.timer);
  }

  reStartImg() {
    this.timer = setInterval(this.fun, this.props.speed);
  }

  render() {
    return (
      <div className={styles.wrapContent} >
        <div className={styles.wcont} onMouseOver={this.stopImg.bind(this)} onMouseOut={this.reStartImg.bind(this)} style={{ width: `${this.props.widthWrap}px`, height: `${this.props.heightWrap}px` }}>
          <div className={styles.slideCont} ref="box1">
            <img src={this.props.imgUrl} alt="ezjSlide" ref="img" />;
          </div>
          <div className={styles.slideCont} ref="box2" style={{ left: this.state.imgWidth }}>
            <img src={this.props.imgUrl} alt="ezjSlide" />;
          </div>
          <div className={styles.indexEZJ}>
            <img className={styles.slideImg} ref="imgWrap" src={this.props.imgWrap} alt="欢迎来到ezj" />
          </div>
        </div>
      </div>
    );
  }
}

indexSlide.propTypes = {
  imgUrl: PropTypes.string,
  imgWrap: PropTypes.string,
  speed: PropTypes.number,
  widthWrap: PropTypes.number,
  heightWrap: PropTypes.number,
};


indexSlide.defaultProps = {
  imgUrl: './images/img-slidecont.png',
  imgWrap: './images/img-ezjcont.png',
  speed: 20,
  widthWrap: 645,
  heightWrap: 284,
};

export default indexSlide;
