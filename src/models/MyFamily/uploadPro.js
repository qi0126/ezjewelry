export default {
  namespace: 'myfamUploadPro',
  state: {
    loading: false,
    visible: false,
    seriesRadio: '',
    seriesSelect:'',
  },
  reducers: {
    showModal(state, { payload: status }) {
      return Object.assign({}, state, { visible: status });
    },

    handleOk(state, { payload: status }) {
      return Object.assign({}, state, { loading: status });
    },

    handleCancel(state, { payload: status }) {
      return Object.assign({}, state, { visible: status });
    },

    changeSeries(state, { payload: status }) {
      return Object.assign({}, state, { seriesRadio: status });
    },
    handleChange(state, { payload: status }) {
      console.log(`selected ${value}`);
      return Object.assign({}, state, { seriesRadio: status });
    },
  },
};
