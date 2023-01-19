import { createSlice } from '@reduxjs/toolkit'

export const taskPanelSlice = createSlice({
  name: 'taskPanel',
  initialState: {
    taskPanel: {
        isPanelActive: false,
        payload: {}
    }
  },
  reducers: {
    setPanelActive: (state, action) => {
        const recivedData = action.payload;
        state.taskPanel = recivedData
    }
  },
})

export const { setPanelActive } = taskPanelSlice.actions
export default taskPanelSlice.reducer