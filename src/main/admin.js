import "./admin.css";
import React from "react";
import { useState, useEffect } from "react";
import { Alert, Avatar, Backdrop, CircularProgress, Grid, Stack } from "@mui/material";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import { Buffer } from "buffer";

const NOIMG = "";
const PREFIX = "https://csci3100takeiteasy.herokuapp.com";
const REFRESH_RATE = 30 * 1000; // 30 sec

function ResetPassword(props) {
  var targetUsername = null,
    newPassword = null;
  const [CPstatus, setCPstatus] = useState({});
  const [mask, setMask] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    console.log(props);
    let loginForm = e.target;
    let formData = new FormData(loginForm);
    let username = formData.get("username");
    let newpwd = formData.get("newpwd");
    let REnewpwd = formData.get("REnewpwd");
    if (username == "" || newpwd == "" || REnewpwd == "") {
      setCPstatus({
        name: "EmptyPw",
        message: "Please fill in all the fields.",
      });
    } else if (newpwd != REnewpwd) {
      setCPstatus({
        name: "NewPwMismatched",
        message:
          "The new password you typed does not match the re-entered new password. Please try again.",
      });
    } else {
      targetUsername = username;
      newPassword = newpwd;
      console.log(targetUsername);
      console.log(newPassword);
      const URL = PREFIX + `/admin/${props.usertype}/resetPw`;
      const attempt = async () => {
        try {
          const response = await fetch(URL, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + props.token,
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              username: targetUsername,
              passwordNew: newPassword,
            }),
          });
          const attempt_result = await response.json();
          setCPstatus(attempt_result);
          console.log(attempt_result);
        } catch (err) {
          console.log("error", err);
        }
      };
      attempt();
    }
    loginForm.reset();
  }

  return (
    <>
      <h2>
        <i className="material-icons">password</i>Change password:
      </h2>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label htmlFor="password" className="form-label">
          <h6>Target {props.usertype} account username: </h6>
        </label>
        <div className="input-group mb-2" style={{ width: "250px" }}>
          <input
            type="text"
            className="form-control"
            name="username"
            required
          />
        </div>
        <label htmlFor="password" className="form-label">
          <h6>New password:</h6>
        </label>
        <div className="input-group mb-2" style={{ width: "250px" }}>
          <input
            type={mask ? "text" : "password"}
            className="form-control"
            name="newpwd"
            required
          />
          <button
            type="button"
            className="material-icons input-group-text"
            onClick={() => setMask(!mask)}
          >
            {mask ? "visibility_off" : "visibility"}
          </button>
        </div>
        <label htmlFor="password" className="form-label">
          <h6>Please re-enter your new password</h6>
        </label>
        <div className="input-group mb-2" style={{ width: "250px" }}>
          <input
            type={mask ? "text" : "password"}
            className="form-control"
            name="REnewpwd"
            required
          />
          <button
            type="button"
            className="material-icons input-group-text"
            onClick={() => setMask(!mask)}
          >
            {mask ? "visibility_off" : "visibility"}
          </button>
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      {!CPstatus.name ? (
        <></>
      ) : CPstatus.name === "SuccessfullyResetPassword" ? (
        <Alert severity="success">{CPstatus.message}</Alert>
      ) : (
        <Alert severity="error">{CPstatus.message}</Alert>
      )}
    </>
  );
}

function FoodItem(props) {
  let foodItem = props.food;
  console.log(foodItem);
  return (
    <>
      <span style={{ fontSize: "18px" }}>• {foodItem.name}</span>
      <br />
    </>
  );
}

function Order(props) {
  console.log(props);
  var createDate = props.order.createdAt;
  var updateDate = props.order.updatedAt;
  var restaurantID = props.order.restaurantID._id;
  var customerID = props.order.customerID._id;
  var orderNo = props.order.orderNo;
  var customerName = props.order.customerID.username;
  var restaurantName = props.order.restaurantID.username;
  return (
    <div style={{ marginTop: "10px" }}>
      <Card>
        <CardContent>
          <Box sx={{ px: 1 }}>
            <Typography variant="h4" component="h4">
              <span style={{ color: "#8a055e" }}>Order #{orderNo}</span>
            </Typography>
            <Typography variant="h5" component="h5">
              {/* <span style={{color: "#aaaaaa"}}>Restaurant Name: {restaurantName}</span> */}
              Customer: {customerName}
              <span style={{ color: "#aaaaaa", fontSize: "15px" }}>
                &nbsp;(ID: {customerID})
              </span>
              <br />
              Restaurant: {restaurantName}
              <span style={{ color: "#aaaaaa", fontSize: "15px" }}>
                &nbsp;(ID: {restaurantID})
              </span>
              <br />
              Ordered Items:
            </Typography>
            <div>
              {props.order.items.map((food, i) => (
                <FoodItem food={food} key={i} />
              ))}
            </div>

            <Typography variant="body2" color="textSecondary" component="p">
              Order created at: {new Date(createDate).toLocaleString()} <br />
              Order finished at:{" "}
              {props.order.status ? new Date(updateDate).toLocaleString() : "Not finished"}
              <br />
              Status:
              <span
                style={
                  props.order.status ? { color: "green" } : { color: "red" }
                }
              >
                {props.order.status ? " Completed" : " Not completed"}
                <br />
              </span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {/* {props.i} */}
      {/* {props.order} */}
    </div>
  );
}

function OrderHistory(props) {
  const [orderHistory, setOrderHistory] = useState([]);
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);

  setInterval(() => {
    window.location.reload();
  }, REFRESH_RATE);

  useEffect(() => {
    const URL = PREFIX + "/admin/order/all";
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + props.token,
          },
        });
        const order_history = await response.json();
        if (order_history.length >= 0) {
          order_history.sort(function (a, b) {
            return b.orderNo - a.orderNo;
          });
        }
        setOrderHistory(order_history);
        console.log(order_history);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    };
    if (reload) {
      fetchOrder();
    }
  }, []);

  function handleReload() {
    window.location.reload();
  }

  return (
    <div style={{minHeight:"100vh"}}>
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div className="row">
          <div className="col-10">
            <h2>
              <i className="material-icons">receipt_long</i>
              List of orders:
              <span style={{ cursor: "pointer" }} onClick={() => handleReload()}>
                <i className="material-icons">sync</i>
              </span>
            </h2>
            <h6>(refresh on every 30s)</h6>
            <hr />
            {orderHistory.length == 0 ? (
              <h3>You haven't made any orders yet.</h3>
            ) : (
              orderHistory.map((order, i) => (
                <Order order={order} i={i} key={i} />
              ))
            )}
          </div>
          <div className="col-2"></div>
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: "15px 0",
  },
});

function CustomerCard(props) {
  const [ImgUrl, setImgUrl] = useState();
  const [skip, setSkip] = useState(false);
  const classes = useStyles();

  let customer = props.customer;
  let profilePic = null;

  if (!skip) {
    if (customer.profilePic != undefined) {
      profilePic = customer.profilePic;
      console.log(profilePic);
      let img = Buffer.from(profilePic.data).toString("base64");
      setSkip(true);
      setImgUrl(img);
    } else {
      let img = Buffer.from(NOIMG);
      setSkip(true);
      setImgUrl(img);
    }
  }

  // skip = true;

  return (
    <div style={{ padding: "5px 0" }}>
      <Card sx={{ display: "flex" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Box sx={{ display: "flex", flexDirection: "row", px: 1, m: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <Typography variant="h5" component="div">
                  <b>{customer.username}</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <b
                  style={
                    customer.activated ? { color: "green" } : { color: "red" }
                  }
                >
                  {customer.activated ? "Activated" : "Not activated"}
                </b>
              </Grid>
              <Grid item xs={12}>
                <h6 style={{ color: "grey" }}>ID: {customer._id}</h6>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", px: 1, m: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", px: 1, m: 1 }}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                height="100%"
              >
                <div style={{ position: "relative" }}>
                  <Avatar
                    alt="picture"
                    src={`data:image/jpeg; base64, ${ImgUrl}`}
                    sx={{ width: 150, height: "auto", maxWidth: "100%" }}
                  />
                  <div
                    className="online-status"
                    style={{
                      backgroundColor: customer.online ? "green" : "red",
                    }}
                  ></div>
                </div>
              </Stack>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", px: 1, m: 1 }}>
              <Typography component="div" variant="body1">
                E-mail: {customer.email}
                <br />
                Phone Number: {customer.phoneNum}
                <br />
                Points: {customer.points}
                <br />
                Created at: {new Date(customer.createdAt).toLocaleString()}
                <br />
                Last login: {new Date(customer.lastLogin).toLocaleString()}
                <br />
                Updated at: {new Date(customer.updatedAt).toLocaleString()}
                <br />
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

function CustomerList(props) {
  const [reload, setReload] = useState(true);
  const [CustomerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);

  setInterval(() => {
    window.location.reload();
  }, REFRESH_RATE);

  useEffect(() => {
    const URL = PREFIX + "/admin/customer/all";
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + props.token,
          },
        });
        const customerDetails = await response.json();
        setCustomerList(customerDetails);
        setReload(false);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    }
    if (reload) {
      fetchData();
    }
  }, []);

  return (
    <>
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div>
          <h2>
            <i className="material-icons">list</i>
            List of customers:
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.location.reload();
              }}
            >
              <i className="material-icons">sync</i>
            </span>
          </h2>
          <h6>(refresh on every 30s)</h6>
          <h6>Number of customers: {CustomerList.length}</h6>
          <div>
            {CustomerList.map((customer, i) => (
              <CustomerCard customer={customer} i={i} key={i} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// Restaurant
function RestaurantCard(props) {
  const [update, setUpdate] = useState(true);

  function handleClick(action, username) {
    setUpdate(false);
    if (action == "Approve") {
      const URL = PREFIX + "/admin/restaurant/approve";
      async function approve() {
        try {
          const response = await fetch(URL, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + props.token,
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              username: username,
            }),
          });
          const approve_result = await response.json();
          console.log(approve_result);
          props.setReload(true);
        } catch (error) {
          console.log("error", error);
        }
      }
      approve();
    } else if (action == "Reject") {
      const URL = PREFIX + "/admin/restaurant/reject";
      async function reject() {
        try {
          const response = await fetch(URL, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + props.token,
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              reason: "violating our regulation(s).",
            }),
          });
          const approve_result = await response.json();
          console.log(approve_result);
          props.setReload(true);
        } catch (error) {
          console.log("error", error);
        }
      }
      reject();
    }
    window.location.reload();
    console.log("setting reload");
    setUpdate(true);
  }
  console.log(props);
  const [ImgUrl, setImgUrl] = useState();
  const [skip, setSkip] = useState(false);

  let restaurant = props.restaurant;
  if (!skip) {
    let profilePic = restaurant.profilePic;
    let img = Buffer.from(profilePic.data).toString("base64");

    setSkip(true);
    setImgUrl(img);
  }

  return (
    <>
      <div style={{ padding: "5px 0" }}>
        <Card sx={{ display: "flex" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Box sx={{ display: "flex", flexDirection: "row", px: 1, m: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <Typography variant="h5" component="div">
                    <b>{restaurant.username}</b>
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <b
                    style={
                      restaurant.approved ? { color: "green" } : { color: "red" }
                    }
                  >
                    {restaurant.approved ? "Approved" : "Not approved"}
                  </b>
                </Grid>
                <Grid item xs={12}>
                  <h6 style={{ color: "grey" }}>ID: {restaurant._id}</h6>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", px: 1, m: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", px: 1, m: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                  height="100%"
                >
                  <div style={{ position: "relative" }}>
                    <Avatar
                      alt="picture"
                      src={`data:image/jpeg; base64, ${ImgUrl}`}
                      sx={{ width: 150, height: "auto", maxWidth: "100%" }}
                    />
                    <div
                      className="online-status"
                      style={{
                        backgroundColor: restaurant.online ? "green" : "red",
                      }}
                    ></div>
                  </div>
                </Stack>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", px: 1, m: 1 }}>
                <Typography component="div" variant="body1">
                  Address: {restaurant.address}
                  <br />
                  Username: {restaurant.username}
                  <br />
                  E-mail: {restaurant.email}
                  <br />
                  Phone Number: {restaurant.phoneNum}
                  <br />
                  License Number: {restaurant.licenseNum}
                </Typography>
              </Box>
            </Box>
            {restaurant.approved ? (
              ""
            ) : (
              <CardActions>
                <Button
                  size="small"
                  style={{ backgroundColor: "green" }}
                  onClick={() => {
                    handleClick("Approve", restaurant.username);
                  }}
                >
                  <span style={{ color: "white", padding: "2px" }}>Approve</span>
                </Button>
                <Button
                  size="small"
                  style={{ backgroundColor: "red" }}
                  onClick={() => {
                    handleClick("Reject", restaurant.username);
                  }}
                >
                  <span style={{ color: "white", padding: "2px" }}>Reject</span>
                </Button>
              </CardActions>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function RestaurantList(props) {
  const [reload, setReload] = useState(true);
  const [RestaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(true);

  setInterval(() => {
    window.location.reload();
  }, REFRESH_RATE);

  useEffect(() => {
    const URL = PREFIX + "/admin/restaurant/all";
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + props.token,
          },
        });
        const restaurantDetails = await response.json();
        if (restaurantDetails.length >= 0) {
          restaurantDetails.sort(function (a, b) {
            return a.approved === b.approved ? 0 : a.approved ? 1 : -1;
          });
        }
        setRestaurantList(restaurantDetails);
        setReload(false);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    }
    if (reload) {
      fetchData();
    }
  }, []);

  return (
    <>
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div>
          <h2>
            <i className="material-icons">list</i>
            List of restaurants:
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.location.reload();
              }}
            >
              <i className="material-icons">sync</i>
            </span>
          </h2>
          <h6>(refresh on every 30s)</h6>
          <h6>Number of restaurants: {RestaurantList.length}</h6>
          <div>
            {RestaurantList.map((restaurant, i) => (
              <RestaurantCard
                restaurant={restaurant}
                i={i}
                key={i}
                setReload={setReload}
                token={props.token}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if (this.props.page == "orders") {
      return (
        <div className="page-styling">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10" style={{ margin: "1vh" }}>
              <OrderHistory token={this.props.token} />
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      );
    } else if (this.props.page == "ULCustomer") {
      return (
        <div className="page-styling">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
              <ResetPassword token={this.props.token} usertype="customer" />
              <hr />
              <CustomerList token={this.props.token} />
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      );
    } else if (this.props.page == "ULRestaurant") {
      return (
        <div className="page-styling">
          <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
              <ResetPassword token={this.props.token} usertype="restaurant" />
              <hr />
              <RestaurantList token={this.props.token} />
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      );
    }
  }
}
export default Admin;
