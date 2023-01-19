import { createSlice } from '@reduxjs/toolkit'

export const taskHistoryPanel = createSlice({
  name: 'taskHistoryPanel',
  initialState: {
    taskHistory: {
        isPanelActive: false,
        payload: {}
    }
  },
  reducers: {
    setHistoryPanel: (state, action) => {
        const recivedData = action.payload;
        state.taskHistory = recivedData;
    }
  },
})

export const { setHistoryPanel } = taskHistoryPanel.actions
export default taskHistoryPanel.reducer