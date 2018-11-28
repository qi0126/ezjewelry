// const Editor = require('react-umeditor');
import React from 'react';
import Editor from 'react-umeditor';
import app from 'app';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }


  handleChange(content) {
    console.log(content);
    this.setState({
      content,
    });
  }
  getPlugins() {
    return {
      image: {
        uploader: {
          name: 'files',
          url: `${app.$http.URL}/common/uploadImg`,
        },
      },
    };
  }

  getImg(e) {
    const files = e.target.files[0];
    const fromData = new FormData();
    fromData.append('uploadType', 1);
    fromData.append('file', files);
    app.$api.upImgs(fromData).then((res) => {
      console.log(res);
    });
  }

  componentDidMount() {
  }

  render() {
    const icons = this.getIcons();
    const plugins = this.getPlugins();
    return (
      <div>
        <input type="file" onChange={this.getImg.bind(this)} />
        <Editor
          ref="editor"
          icons={icons}
          value={this.state.content} defaultValue="<p>React Umeditor</p>"
          onChange={this.handleChange.bind(this)}
          plugins={plugins}
        />
      </div>
    );
  }
}

Edit.propTypes = {};


export default Edit;
