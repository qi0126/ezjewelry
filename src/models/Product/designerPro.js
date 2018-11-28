import { combineReducers } from "../../../node_modules/redux";

export default {
  namespace: 'proDesignerPro',
  state: {
    loading: false, 
    visible: false,
    slides: ["Slide 1", "Slide 2", "Slide 3", "Slide 4", "Slide 5",],
    virtualData: {
      slides: [`slide0`,`slide1`,`slide2`,`slide3`],
    },
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

    componentDidMount(state,  { payload: status }) {
      return Object.assign({}, state, { virtualData: status });
    }
  
  },
};
