import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Login from "./login/login";
import Signup from "./login/signup";
import Verification from "./login/verification";
import Main from "./main/main";
import Restaurant from "./main/restaurant";
import HeaderBar from "./HeaderBar";
import Customer from "./main/customer";
import UserRestaurant from "./main/user_restaurant";
import Admin from "./main/admin";
import OrderInfo from "./main/orderInfo";
import { io } from "socket.io-client";

function NoMatch() {
  let location = useLocation();
  // navigate('/', { replace: true })
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [socket, setSocket] = useState(null);

  //Try Fetch from sessionStorage
  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
    let username = sessionStorage.getItem("username");
    let usertype = sessionStorage.getItem("usertype");
    setUserInfo({ username, usertype });
  }, []);

  useEffect(() => {
    if (token != null) {
      setSocket(
        io('',{
          query: { token },
        })
      );
    }
  }, [token]);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log(`Client Connect to the Server with ID ${socket.id}`);
    });
  }, [socket]);

  if (token == null) {
    if (!["customer", "restaurant", "admin"].includes(userInfo.usertype)) {
      return (
        <>
          <div className="row main">
            <div className="d-none d-md-block col-md-8 background slide-in-l">
              <img id="bgd" src={process.env.PUBLIC_URL + "food.jpeg"} />
            </div>
            <div className="col-md-4 box">
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Login setToken={setToken} setUserInfo={setUserInfo} />
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <Signup setToken={setToken} setUserInfo={setUserInfo} />
                    }
                  />
                  <Route path="*" element={<NoMatch />} />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="row main">
            <div className="d-none d-md-block col-md-8 background slide-in-l">
              <img id="bgd" src={process.env.PUBLIC_URL + "food.jpeg"} />
            </div>
            <div className="col-md-4">
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Login setToken={setToken} setUserInfo={setUserInfo} />
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <Signup setToken={setToken} setUserInfo={setUserInfo} />
                    }
                  />
                  <Route
                    path="/verification"
                    element={
                      <Verification setToken={setToken} userInfo={userInfo} />
                    }
                  />
                  <Route path="*" element={<NoMatch />} />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </>
      );
    }
  } else {
    let usertype = userInfo.usertype;
    // console.log("::::::"+userInfo.usertype);
    if (usertype == "restaurant") {
      return (
        <>
          <div>
            <BrowserRouter>
              {/* Header Bar */}
              <HeaderBar
                usertype={usertype}
                setToken={setToken}
                setUserInfo={setUserInfo}
                socket={socket}
                token={token}
              />
              <Routes>
                <Route
                  path="/"
                  element={<UserRestaurant page="menu" socket={socket} />}
                />
                <Route
                  path="/r/profile"
                  element={<UserRestaurant page="profile" socket={socket} />}
                />
                <Route
                  path="/r/history"
                  element={<UserRestaurant page="history" socket={socket} />}
                />
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </BrowserRouter>
          </div>
        </>
      );
    } else if (usertype == "customer") {
      return (
        <>
          <div>
            <BrowserRouter>
              {/* Header Bar */}
              <HeaderBar
                usertype={usertype}
                setToken={setToken}
                setUserInfo={setUserInfo}
                socket={socket}
                token={token}
              />
              <Routes>
                <Route path="/" element={<Main />} />
                {/* <Route path="/signup" element={<Main name="Take It Easy!"/>} />   */}
                <Route path="/restaurant/:rid" element={<Restaurant />} />
                <Route
                  path="/customer/profile"
                  element={<Customer action={"profile"} />}
                />
                <Route
                  path="/customer/history"
                  element={<Customer action={"history"} />}
                />
                <Route
                  path="/order/:id"
                  element={<OrderInfo token={token} />}
                />
                {/* <Route path="/customer/fav" element={<Main action={"fav"} />} /> */}
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </BrowserRouter>
          </div>
        </>
      );
    } else if (usertype == "admin") {
      return (
        <>
          <div>
            <BrowserRouter>
              {/* Header Bar */}
              <HeaderBar
                usertype={usertype}
                setToken={setToken}
                token={token}
                socket={socket}
              />
              <Routes>
                <Route
                  path="/"
                  element={<Admin page="orders" token={token} />}
                />
                <Route
                  path="/userlist/customers"
                  element={<Admin page="ULCustomer" token={token} />}
                />
                <Route
                  path="/userlist/restaurants"
                  element={<Admin page="ULRestaurant" token={token} />}
                />
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </BrowserRouter>
          </div>
        </>
      );
    }
  }
}

export default App;
