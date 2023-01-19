import {createSlice} from '@reduxjs/toolkit'

export const hasUserNotifications = createSlice({
    name: 'userNotifications',
    initialState: {
        userNotifications: {value: false}
    },
    reducers: {
        setHasUserNewNotifications: (state, action) => {
            const recivedData = action.payload;
            state.userNotifications = recivedData
        }
    },
})

export const {setHasUserNewNotifications} = hasUserNotifications.actions
export default hasUserNotifications.reducer