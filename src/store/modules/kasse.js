export default {
  namespaced: true,
  state: () => ({
    rightPanelWidth: 320,
    bottomRowHeight: 90,
    artikelItems: false,
    artikelItemsSichtbarkeit: false,
    pfandItems: false,
    pfandItemsSichtbarkeit: false,
    belegItems: false,
    desktopItems: false,
    kassenprojektItems: false
  }),
  mutations: {
    SET_RIGHT_PANEL_WIDTH(state, px) { state.rightPanelWidth = px; },
    SET_BOTTOM_ROW_HEIGHT(state, px) { state.bottomRowHeight = px; },
    SET_ARTIKEL_ITEMS(state, px) {state.artikelItems = px },
    SET_ARTIKEL_ITEMS_SICHTBARKEIT(state, px) {state.artikelItemsSichtbarkeit = px},
    SET_PFAND_ITEMS(state, px) {state.pfandItems = px; },
    SET_PFAND_ITEMS_SICHTBARKEIT(state, px) {state.pfandItemsSichtbarkeit = px},
    SET_BELEG_ITEMS(state, px) {state.belegItems = px; },
    SET_DESKTOP_ITEMS(state, px) {state.desktopItems = px; },
    SET_KASSENPROJEKT_ITEMS(state, px) {state.kassenprojektItems = px; }
  }
};
