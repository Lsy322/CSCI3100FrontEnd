import "./HeaderBar.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MaterialIcon from "material-icons-react";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { Badge, IconButton, Snackbar, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";

const PREFIX = "https://csci3100takeiteasy.herokuapp.com";

// function Points(){
//     const [skipTriggerFetch, setskipTF] = useState(false);
//     const [customerInfo, setCustomerInfo] = useState([]);

//     const PREFIX='http://localhost:5000';

//     useEffect(() => {
//         const url_d = PREFIX+'/customer/data';
//         const fetchData = async () => {
//           try {
//             const response = await fetch(
//                 url_d, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': 'Bearer '+sessionStorage.getItem("token")
//                 }}
//             );
//             const customer_info = await response.json();
//             setCustomerInfo(customer_info);
//             console.log(customer_info);

//           } catch (error) {
//             console.log("error", error);
//           }
//         };
//         fetchData();
//     }, []);
//     return(
//         <>
//             {customerInfo.points}
//         </>
//     );

// }

function HeaderBar(props) {
  let navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [notificationList, setList] = useState();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMsg] = useState("");
  const horizontal = "left";
  const vertical = "bottom";

  const handleSnackOpen = () => {
    setSnackOpen(true);
    setSnackMsg("Helllo World");
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const handleDeleteNoti = useEffect(() => {
    fetchNotification();
    //window.addEventListener("beforeunload", closeHandler)
  }, []);

  const fetchNotification = async () => {
    if (props.usertype == "customer") {
      const data = await fetch(
        `https://csci3100takeiteasy.herokuapp.com/notification/fetchIndividual`,
        {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        }
      );
      const notis = await data.json(); //Converting data to jason
      setNotifications(notis); //Set State with fetched result
    }
  };
  useEffect(() => {
    //Listen to notificaition update
    props.socket?.on("notification", (doc) => {
      setNotifications((prev) => [doc, ...prev]);
      setSnackOpen(true);
      setSnackMsg(doc.message);
    });

    return () => {
      //Off listener when dismount component
      props.socket?.off("notification");
    };
  }, [props.socket]);

  useEffect(() => {
    if (notifications.length > 0) {
      let notificationList = notifications.map((notification) => (
        //Add React Element Here
        <div id={notification._id} key={notification._id} className="NotiItem">
          <Dropdown.Item id={notification._id + "Main"}>
            {notification.message}
            <div
              id={notification._id + "TimeStamp"}
              className="notiTime"
              align="right"
            >
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </Dropdown.Item>
          <IconButton
            id={notification._id + "DeleteButton"}
            aria-label="delete"
            style={{ borderRadius: 0 }}
            className="Noti-Delete"
            onClick={async () => {
              let newNoti = notifications.filter(
                (noti) => noti._id !== notification._id
              );
              setNotifications(newNoti);
              await fetch(
                "https://csci3100takeiteasy.herokuapp.com/notification/dismiss/" +
                  notification._id,
                { method: "POST" }
              );
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ));
      // console.log("1")
      setList(notificationList);
    } else {
      let notificationList = (
        <Dropdown.Item disabled={true}>
          There is no notification yet!
        </Dropdown.Item>
      );
      setList(notificationList);
    }
  }, [notifications]);

  // Broswer Closing Logout Handler
  const closeHandler = async (e) => {
    e.preventDefault();
    console.log(props.token);
    console.log(props.usertype);
    if (props.usertype === "restaurant") {
      await fetch(`https://csci3100takeiteasy.herokuapp.com/restaurant/logout`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.token,
        },
      });
    } else if (props.usertype === "customer") {
      await fetch(`https://csci3100takeiteasy.herokuapp.com/customer/logout`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.token,
        },
      });
    }
  };

  // {usertype, setToken}
  // const handleLogout = (logout) => {
  //     console.log("In handle logout");
  //     // logout(undefined);
  // }
  // function handleLink(){

  // }
  // console.log(props.setToken);
  const [customerInfo, setCustomerInfo] = useState({});
  // const PREFIX='http://localhost:5000';

  const [skip, setSkip] = useState(false);
  const fetchData = async () => {
    if (props.usertype == "customer") {
      try {
        const URL = PREFIX + "/customer/data";
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        const customer_info = await response.json();
        setCustomerInfo(customer_info);
        setSkip(true);
        // console.log(customer_info);
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  });

  if (props.usertype == "restaurant") {
    // setSkip(true);
    return (
      <>
        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={handleSnackClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackMessage}
          </Alert>
        </Snackbar>
        <div className="header stickyBar">
          <div className="container-fluid text-center">
            <div className="row">
              <div className="col-2"></div>
              <div className="col-8">
                <Link
                  to="/"
                  className="header-title "
                  style={{ textAlign: "center" }}
                >
                  <MaterialIcon icon="takeout_dining" color="#FFFFFF" />
                  <span>
                    <b>TAKE IT EASY</b>
                  </span>
                  <MaterialIcon icon="takeout_dining" color="#FFFFFF" />
                </Link>
              </div>

              <div className="col-1"></div>
              <div className="col-1 headerpadding bg-transparent btn-transparent">
                <Dropdown
                  className="mx-2 bg-transparent btn-transparent"
                  autoClose="outside"
                >
                  <Dropdown.Toggle
                    id="dropdown-autoclose-outside"
                    className="bg-transparent btn-transparent"
                    size="sm"
                  >
                    <MaterialIcon icon="account_circle" color="#FFFFFF" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {/* <Link to="/"></Link> */}
                    <Dropdown.Item href="/">Menu</Dropdown.Item>
                    {/* <Link to="/r/profile"></Link> */}
                    <Dropdown.Item href="/r/profile">Profile</Dropdown.Item>
                    <Dropdown.Item href="/r/history">
                      Order History
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={async (e) => {
                        navigate("/", { replace: true });
                        await closeHandler(e);
                        props.socket.disconnect();
                        props.setToken(undefined);
                        sessionStorage.clear();
                        navigate("/");
                      }}
                    >
                      Logout and offline
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (props.usertype == "customer") {
    // if (skipTriggerFetch == false){
    //     triggerFetch();
    //     console.log(skipTriggerFetch);
    // }
    return (
      <>
        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={handleSnackClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackMessage}
          </Alert>
        </Snackbar>
        <div className="header stickyBar">
          <div className="container-fluid text-center">
            <div className="row">
              <div className="col-1" style={{ padding: "3px 5px" }}>
                <Dropdown autoClose="outside" align={"end"}>
                  <DropdownToggle
                    id="noti"
                    className="bg-transparent btn-transparent"
                  >
                    <Badge
                      badgeContent={
                        !notificationList ? 0 : notificationList.length
                      }
                      color="secondary"
                    >
                      <MaterialIcon icon="notifications" color="#FFFFFF" />
                    </Badge>
                  </DropdownToggle>
                  <Dropdown.Menu id="NotiContainer">
                    <Dropdown.ItemText>
                      <div className="noti-Title">Notifications</div>
                    </Dropdown.ItemText>
                    {notificationList}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="col-1"></div>
              <div className="col-8">
                <Link
                  to="/"
                  className="header-title "
                  style={{ textAlign: "center" }}
                >
                  <MaterialIcon icon="takeout_dining" color="#FFFFFF" />
                  <span>
                    <b>TAKE IT EASY</b>
                  </span>
                  <MaterialIcon icon="takeout_dining" color="#FFFFFF" />
                </Link>
              </div>

              <div className="col-1 points">
                {/* Points */}
                <MaterialIcon icon="savings" color="#FFFFFF" />
                {/* <Points/> */}
                {customerInfo.points >= 0 ? customerInfo.points : -1}
              </div>
              <div className="col-1 headerpadding bg-transparent btn-transparent">
                <Dropdown
                  className="bg-transparent btn-transparent"
                  autoClose="outside"
                >
                  <Dropdown.Toggle
                    id="dropdown-autoclose-outside"
                    className="bg-transparent btn-transparent"
                    size="sm"
                  >
                    <MaterialIcon icon="account_circle" color="#FFFFFF" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {/* <Link to="/customer/profile">
                                        Profile */}
                    <Dropdown.Item
                      onClick={() => navigate("/", { replace: true })}
                    >
                      Restaurant
                    </Dropdown.Item>
                    {/* <Dropdown.Item onClick={() => navigate('/customer/fav', { replace: true })}>Fav</Dropdown.Item> */}
                    <Dropdown.Item
                      onClick={() =>
                        navigate("/customer/profile", { replace: true })
                      }
                    >
                      Profile
                    </Dropdown.Item>
                    {/* </Link> */}
                    <Dropdown.Item
                      onClick={() =>
                        navigate("/customer/history", { replace: true })
                      }
                    >
                      Order History
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={async (e) => {
                        navigate("/", { replace: true });
                        await closeHandler(e);
                        props.socket.disconnect();
                        props.setToken(undefined);
                        sessionStorage.clear();
                      }}
                    >
                      Logout
                    </Dropdown.Item>
                    {/* onClick={handleLogout(props.setToken)} */}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (props.usertype == "admin") {
    // setSkip(true);
    return (
      <>
        <div className="header stickyBar">
          <div className="container-fluid text-center">
            <div className="row">
              <div className="col-2"></div>
              <div className="col-8">
                <Link
                  to="/"
                  className="header-title "
                  style={{ textAlign: "center" }}
                >
                  <MaterialIcon icon="takeout_dining" color="#FFFFFF" />
                  <span>
                    <b>TAKE IT EASY</b>
                  </span>
                  <MaterialIcon icon="takeout_dining" color="#FFFFFF" />
                </Link>
              </div>

              <div className="col-1 headerpadding"></div>
              <div className="col-1 headerpadding bg-transparent btn-transparent rightpadding">
                <Dropdown
                  className="mx-2 bg-transparent btn-transparent"
                  autoClose="outside"
                >
                  <Dropdown.Toggle
                    id="dropdown-autoclose-outside"
                    className="bg-transparent "
                    size="sm"
                  >
                    <MaterialIcon icon="account_circle" color="#FFFFFF" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ zIndex: 10 }}>
                    <Dropdown.Item
                      onClick={() => navigate("/", { replace: true })}
                    >
                      Orders
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        navigate("/userlist/customers", { replace: true })
                      }
                    >
                      Customers' List
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        navigate("/userlist/restaurants", { replace: true })
                      }
                    >
                      Restaurants' List
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={async (e) => {
                        navigate("/", { replace: true });
                        await closeHandler(e);
                        props.socket.disconnect();
                        props.setToken(undefined);
                        sessionStorage.clear();
                      }}
                    >
                      Logout
                    </Dropdown.Item>
                    {/* onClick={handleLogout(props.setToken)} */}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default HeaderBar;
