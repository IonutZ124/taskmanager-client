import { createSlice } from '@reduxjs/toolkit'

export const taskCommentPanel = createSlice({
  name: 'taskCommentPanel',
  initialState: {
    taskComments: {
        isPanelActive: false,
        payload: {}
    }
  },
  reducers: {
    setPanelStatus: (state, action) => {
        const recivedData = action.payload;
        state.taskComments = recivedData;
    }
  },
})

export const { setPanelStatus } = taskCommentPanel.actions
export default taskCommentPanel.reducer