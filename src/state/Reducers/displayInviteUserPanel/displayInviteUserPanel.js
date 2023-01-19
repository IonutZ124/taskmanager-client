import { createSlice } from '@reduxjs/toolkit'

export const boardInvitePanelSlice = createSlice({
  name: 'taskPanel',
  initialState: {
    inviteBoardMembers: {
        isPanelActive: false,
    }
  },
  reducers: {
    setBoardInvitePanelActive: (state, action) => {
        const recivedData = action.payload;
        state.inviteBoardMembers = recivedData;
    }
  },
})

export const { setBoardInvitePanelActive } = boardInvitePanelSlice.actions
export default boardInvitePanelSlice.reducer