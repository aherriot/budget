import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const accounts = createSlice({
  name: "accountsRoute",
  initialState: {
    openTabs: [],
    activeTabId: null,
    dateRange: [new Date().toISOString(), new Date().toISOString()]
  },
  reducers: {
    selectAccount: (state, action) => {
      const tab = state.openTabs.find(tab => tab.id === action.payload.id);

      if (!tab) {
        state.openTabs.push({ id: action.payload.id });
      }

      state.activeTabId = action.payload.id;
    },
    selectDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    removeTab: (state, action) => {
      const tabIndex = state.openTabs.findIndex(tab => {
        console.log(tab.id, action.payload.id);
        return tab.id === action.payload.id;
      });

      if (tabIndex >= 0) {
        state.openTabs.splice(tabIndex, 1);
      }

      if (state.activeTabId === action.payload.id) {
        state.activeTabId = null;
      }
    }
  }
});

export default accounts;
