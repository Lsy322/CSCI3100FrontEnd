import React from "react";
import { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Buffer } from "buffer";
import {
  Alert,
  Avatar,
  Backdrop,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";

const PREFIX = "https://csci3100takeiteasy.herokuapp.com";

function ChangePassword() {
  const [CPstatus, setCPstatus] = useState({});
  const [mask, setMask] = useState(false); 
  let oldPassowrd = null;
  let newPassword = null;

  function handleSubmit(e) {
    e.preventDefault();
    let loginForm = e.target;
    let formData = new FormData(loginForm);
    let oldpwd = formData.get("oldpwd");
    let newpwd = formData.get("newpwd");
    let REnewpwd = formData.get("REnewpwd");
    if (oldpwd == "" || newpwd == "" || REnewpwd == "") {
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
      oldPassowrd = oldpwd;
      newPassword = newpwd;
      const URL = PREFIX + "/customer/changePw";
      const attempt = async () => {
        try {
          const response = await fetch(URL, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              passwordOld: oldPassowrd,
              passwordNew: newPassword,
            }),
          });
          const attempt_result = await response.json();
          setCPstatus(attempt_result);
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
      <h4>
        <i className="material-icons">password</i>Change password:
      </h4>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label htmlFor="password" className="form-label">
          <h6>Old password:</h6>
        </label>
        <div className="input-group mb-2" style={{ width: "250px" }}>
          <input
            type={mask ? "text" : "password"}
            className="form-control"
            name="oldpwd"
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
      ) : CPstatus.name === "SuccessfullyChangedPassword" ? (
        <Alert severity="success">{CPstatus.message}</Alert>
      ) : (
        <Alert severity="error">{CPstatus.message}</Alert>
      )}
    </>
  );
}

function AccountInfo() {
  const [customerInfo, setCustomerInfo] = useState({});

  useEffect(() => {
    const URL = PREFIX + "/customer/data";
    const fetchData = async () => {
      try {
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        const customer_info = await response.json();
        setCustomerInfo(customer_info);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, []);

  //load profile pic
  const [ImgUrl, setImgUrl] = useState();
  const [skip, setSkip] = useState(false);
  if (customerInfo.profilePic != undefined) {
    if (!skip) {
      let profilePic = customerInfo.profilePic;
      let img = Buffer.from(profilePic.data).toString("base64");
      setSkip(true);
      setImgUrl(img);
    }
  }

  const rows = [
    { name: "User ID", data: customerInfo.userID },
    { name: "Username", data: customerInfo.username },
    { name: "Phone number", data: customerInfo.phoneNum },
    { name: "Email", data: customerInfo.email },
    { name: "Points", data: customerInfo.points ? customerInfo.points : 0 },
  ];

  return (
    <div style={{minHeight:"100vh"}}>
      <div className="row">
        <div className="col-1"></div>
        <div className="col-10">
          <h2>Glad to meet you, {customerInfo.username}!</h2>
          <h4>
            <i className="material-icons">badge</i>Your information:
          </h4>
          <div className="row">
            {/* profilePic */}
            <div className="col-12 col-md-3 mb-3">
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                height="100%"
              >
                <Avatar
                  alt="picture"
                  src={`data:image/jpeg; base64, ${ImgUrl}`}
                  sx={{ width: 200, height: "auto", maxWidth: "100%" }}
                />
              </Stack>
            </div>
            <div className="col-12 col-md-9 mb-3">
              <TableContainer
                sx={{ width: 500, maxWidth: "100%" }}
                component={Paper}
              >
                <Table aria-label="simple table">
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <h6>{row.name}</h6>
                        </TableCell>
                        <TableCell align="right">{row.data}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <hr></hr>
          <ChangePassword />
        </div>
        <div className="col-1"></div>
      </div>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: "15px 0",
  },
});

function FoodItem(props) {
  let foodItem = props.food;
  return (
    <>
      <span style={{ fontSize: "18px" }}>• {foodItem.name}</span>
      <br />
    </>
  );
}

function Order(props) {
  const classes = useStyles();
  var createDate = props.order.createdAt;
  var updateDate = props.order.updatedAt;
  var restaurantName = props.order.restaurantID.restaurantName;
  var restaurantID = props.order.restaurantID._id;
  var orderNo = props.order.orderNo;
  var hyperLink = `/order/${props.order._id}`;
  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Box sx={{ px: 1 }}>
            <Typography variant="h4" component="h4">
              <a href={hyperLink}>
                <span style={{ color: "#8a055e" }}>Order #{orderNo}</span>
              </a>
            </Typography>
            <Typography variant="h5" component="h5">
              Restaurant Name: {restaurantName}
              <br />
              <span style={{ color: "#999999", fontSize: "15px" }}>
                (ID: {restaurantID})
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
                {props.order.status ? "Completed" : "Not completed"}
                <br />
              </span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {/* {props.i} */}
      {/* {props.order} */}
    </>
  );
}

// /order/fetchByCustomer
function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const URL = PREFIX + "/order/fetchByCustomer";
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        const order_history = await response.json();
        if (order_history.length >= 0) {
          order_history.sort(function (a, b) {
            return b.orderNo - a.orderNo;
          });
        }
        setOrderHistory(order_history);
        setLoading(false);
      } catch (err) {
        console.log("error", err);
        setLoading(false);
      }
    };
    fetchOrder();
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
      <div className="row" style={{minHeight:"100vh"}}>
        <div className="col-1"></div>
        <div className="col-10">
          <h2>
            <i className="material-icons">receipt_long</i>
            Your order history:
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.location.reload();
              }}
            >
              <i className="material-icons">sync</i>
            </span>
          </h2>
          {/* <h6>(refresh on every 30s)</h6> */}
          <hr />
          {orderHistory.length == 0 ? (
            <h3>You haven't made any orders yet.</h3>
          ) : (
            orderHistory.map((order, i) => (
              <Order order={order} i={i} key={i} />
            ))
          )}
        </div>
        <div className="col-1"></div>
      </div>
      )}
    </>
  );
}

class Customer extends React.Component {
  // constructor(props) {
  //     super(props);
  // }
  render() {
    if (this.props.action == "profile") {
      return (
        <>
          <div className="page-styling">
            <AccountInfo />
          </div>
        </>
      );
    } else if (this.props.action == "history") {
      return (
        <>
          <div className="page-styling" style={{ minHeight: "100vh" }}>
            <OrderHistory />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="page-styling">
            <AccountInfo />
          </div>
        </>
      );
    }
  }
}
export default Customer;
