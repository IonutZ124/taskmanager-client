import { createSlice } from '@reduxjs/toolkit'

export const userNotificationPanelSlice = createSlice({
  name: 'userNotificationPanel',
  initialState: {
    setPanelStatus: {
        isPanelActive: false,
    }
  },
  reducers: {
    setPanelStatus: (state, action) => {
        const recivedData = action.payload;
        state.setPanelStatus = recivedData;
    }
  },
})

export const { setBoardInvitePanelActive } = userNotificationPanelSlice.actions
export default userNotificationPanelSlice.reducer