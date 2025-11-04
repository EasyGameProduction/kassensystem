export default {
  namespaced: true,
  state: () => ({
    anzahlSize: 18,
    titleSize: 18,
    priceSize: 16,
    pfandSize: 12.5,
  }),
  mutations: {
    SET_TITLE_SIZE(state, px) {state.titleSize = px; },
    SET_PRICE_SIZE(state, px) {state.priceSize = px; },
    SET_ANZAHL_SIZE(state, px) {state.anzahlSize = px; },
    SET_PFAND_SIZE(state, px) {state.pfandSize = px; }
  }
};
