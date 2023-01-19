import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Archive from "../pages/Archive";
import Board from "../pages/Board/Board";
import ChangePassword from "../pages/ChangePassword";
import CreateBoards from "../pages/CreateBoard/CreateBoards";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home/Home";
import JoinBoard from "../pages/JoinBoard/JoinBoard";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Register from "../pages/Register/Register";
import ResendVerifyEmail from "../pages/ResendVerifyEmail";
import UserNotification from "../pages/userNotifications";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/change-password" element={<ChangePassword />}></Route>
        <Route path="/verify-email" element={<VerifyEmail />}></Route>
        <Route path="/resend-verify-email" element={<ResendVerifyEmail />} />
        <Route path="/create-board" element={<CreateBoards />} />
        <Route
          path="/resend-verify-email"
          element={<ResendVerifyEmail />}
        ></Route>

        <Route path="/join-board" element={<JoinBoard />}></Route>
        <Route path="/board/:slug" element={<Board />} />
        <Route path="/archive" element={<Archive />}></Route>
        <Route
          path="/user-notifications"
          element={<UserNotification />}
        ></Route>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
