import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./../state/user/user";
import TaskPanelReducer from "./Reducers/displayTaskPanel/displayTaskPanel";
import BoardMemberInvitePanel from "./Reducers/displayInviteUserPanel/displayInviteUserPanel";
import TaskCommentsReducer from "./Reducers/displayTaskComments/displayTaskComments";
import TaskHistoryPanel from "./Reducers/displayTaskHistoryPanel/displayTaskHistoryPanel";
import UserNotifications from "./Reducers/userNotifications/hasUserNotifications";
import { api } from "./emptySplitApi";
import { setupListeners } from "./setupListeners";

const store = configureStore({
  reducer: {
    user: userReducer,
    taskPanel: TaskPanelReducer,
    inviteBoardMembers: BoardMemberInvitePanel,
    taskComments: TaskCommentsReducer,
    taskHistory: TaskHistoryPanel,
    userNotifications: UserNotifications,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch, api.internalActions);

export default store;
