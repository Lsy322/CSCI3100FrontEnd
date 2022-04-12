import React from "react";
import { useState, useEffect } from "react";
import { Buffer } from "buffer";
import {
  Alert,
  Avatar,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { makeStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";

const PREFIX = "https://csci3100takeiteasy.herokuapp.com";
const REFRESH_RATE = 30 * 1000; // 30 sec

function ChangePassword() {
  // const PREFIX='http://localhost:5000';
  var oldPassowrd = null,
    newPassword = null;
  const [CPstatus, setCPstatus] = useState({});
  const [mask, setMask] = useState(false);
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
      const URL = PREFIX + "/restaurant/changePw";
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
      {/* <h3>Change password:</h3> */}
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
        {/* pattern="^.{8,}$" title="length should be longer than 8 characters"  */}
        {/* <label>
                    <h5>Old password: </h5>
                    
                    <input name="oldpwd" type="password" required/>
                    
                </label>
                <br/>
                <label>
                    <h5>New password: 
                        <span style={{fontSize:"15px"}}>
                            <button type="button" onClick={() => setMask(!mask)} 
                                style={{ backgroundColor: '#faf0e5', border: "none", textAlign: "center", color: "#333333"}} > */}
        {/* <MaterialIcon icon={mask ? "visibility_off" : "visibility"} color='#8a055e'/> */}
        {/* {mask ? "Show new password" : "Hide new password"} */}
        {/* </button>
                        </span>
                    </h5>
                    <input name="newpwd" type={mask ? "password" : "text"}  required/>
                </label>
                <br/>
                <label>
                    <h5>Please re-enter your new password: </h5>
                   
                    <input name="REnewpwd" type={mask ? "password" : "text"} required/>
                </label>
                <br/> */}
        <button type="submit" className="btn">
          Submit
        </button>
        {/* <input type="submit" value="Submit" style={{color: "#8a055e" }}/> */}
      </form>
      {!CPstatus.name ? (
        <></>
      ) : CPstatus.name === "SuccessfullyChangedPassword" ? (
        <Alert severity="success">{CPstatus.message}</Alert>
      ) : (
        <Alert severity="error">{CPstatus.message}</Alert>
      )}
      {/* <span style={{color: "red"}}>{CPstatus.message}</span> */}
    </>
  );
}

function AccountInfo() {
  const [restaurantInfo, setRestaurantInfo] = useState({});

  // const PREFIX='http://localhost:5000';

  useEffect(() => {
    const URL = PREFIX + "/restaurant/data";
    const fetchData = async () => {
      try {
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        const restaurant_info = await response.json();
        setRestaurantInfo(restaurant_info);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, []);

  //load profile pic
  const [ImgUrl, setImgUrl] = useState();
  const [skip, setSkip] = useState(false);
  if (restaurantInfo.profilePic != undefined) {
    if (!skip) {
      let profilePic = restaurantInfo.profilePic;
      let img = Buffer.from(profilePic.data).toString("base64");
      setSkip(true);
      setImgUrl(img);
    }
  }

  const rows = [
    { name: "User ID", data: restaurantInfo._id },
    { name: "Username", data: restaurantInfo.username },
    { name: "Restaurant name", data: restaurantInfo.restaurantName },
    { name: "Phone number", data: restaurantInfo.phoneNum },
    { name: "Email", data: restaurantInfo.email },
    { name: "Address", data: restaurantInfo.address },
    { name: "License Number", data: restaurantInfo.licenseNum },
    { name: "Address", data: restaurantInfo.address },
  ];

  return (
    <div style={{minHeight:"100vh"}}>
      <div className="row">
        <div className="col-1"></div>
        <div className="col-10">
          <h2>Glad to meet you, {restaurantInfo.username}!</h2>
          <h4>
            <i className="material-icons">badge</i>Your information:
          </h4>
          <div className="row">
            {/* profilePic */}
            <div
              className="col-12 col-md-3 mb-3"
              style={{ alignContent: "center" }}
            >
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
          <hr />
          <ChangePassword />
        </div>
        <div className="col-1"></div>
      </div>
    </div>
  );
}

function ChangeMenu() {
  const [loading, setLoading] = useState(true);
  // preview after choosing profile picture
  const [fff, setFFF] = React.useState(null);
  const showPreview = async (e) => {
    e.preventDefault();

    let files = e.target.files;
    setFFF(files[0]);

    if (files.length === 0) {
      // no file
      setImgUrl("");
    } else if (
      files[0].type !== "image/jpeg" &&
      files[0].type !== "image/png"
    ) {
      setImgUrl("");
      setSignupStatus("FileExtensionError");
    } else {
      // have file
      let objURL = URL.createObjectURL(e.target.files[0]);
      setImgUrl(objURL);
      setSignupStatus("");
    }
  };

  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [imgUrl, setImgUrl] = useState("");
  const [signupStatus, setSignupStatus] = useState("");

  const PREFIX = "http://localhost:5000";

  const handleClickOpen = () => {
    setImgUrl("");
    setOpen(true);
  };
  useEffect(() => {
    const URL = PREFIX + "/restaurant/data";
    const fetchData = async () => {
      try {
        let response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            //'Content-type':'application/json'
          },
        });
        let restaurant_info = await response.json();
        response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            //'Content-type':'application/json'
          },
        });
        restaurant_info = await response.json();
        setRestaurantInfo(restaurant_info);
        setLoading(false);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, []);

  document.body.style.backgroundColor = "rgb(250, 240, 229)";
  document.body.style.color = "rgb(138, 5, 94)";

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [style, setStyle] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const STYLES = [
    "Japanese",
    "Thai",
    "Chinese",
    "Italian",
    "Indian",
    "Mexican",
    "Halal",
    "Vegetarian",
    "Dessert",
    "Beverages",
  ];
  const theme = createTheme({
    palette: {
      pur: {
        main: "rgb(138, 5, 94)",
        dark: `rgb(${138 * 0.7}, ${5 * 0.7}, ${94 * 0.7})`,
        contrastText: `rgb(${255}, ${255}, ${255})`,
      },
    },
  });

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ mt: "1%", ml: "3%" }}>
          {loading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <>
              <h2>Change Menu:</h2>
              <Box sx={{ mb: "1%" }}>
                <Button
                  variant="contained"
                  color="pur"
                  onClick={handleClickOpen}
                >
                  Add a New Food Item
                </Button>

                <Box sx={{ mt: "3%", mb: "10%" }}>
                  {restaurantInfo.menu.map((x, y) =>
                    true ? (
                      <Box sx={{ mt: "1%" }}>
                        <Card
                          sx={{ display: "flex", width: "95%", height: "20vh" }}
                        >
                          <CardContent sx={{ width: 3 / 10, p: "0 0 0 0" }}>
                            <img
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                              }}
                              src={`data:image/jpg; base64, ${Buffer.from(
                                x.picture.data
                              ).toString("base64")}`}
                            />
                          </CardContent>
                          <CardContent sx={{ width: 5.5 / 10 }}>
                            <Typography variant="h6" component="div">
                              {x.name}
                            </Typography>
                            <Typography variant="body" component="div">
                              {x.style}
                            </Typography>
                          </CardContent>
                          <CardContent sx={{ width: 1.5 / 10 }}>
                            <Typography variant="h6" component="div">
                              HK${x.price}
                            </Typography>

                            <Button
                              variant="contained"
                              color="pur"
                              onClick={async () => {
                                const url = PREFIX + "/restaurant/food";
                                const fetchData = async () => {
                                  try {
                                    setLoading(true);
                                    const response = await fetch(url, {
                                      method: "DELETE",
                                      headers: {
                                        Authorization:
                                          "Bearer " +
                                          sessionStorage.getItem("token"),
                                        "Content-type": "application/json",
                                      },
                                      body: JSON.stringify({ foodId: x._id }),
                                    });
                                    const json = await response.json();
                                    window.location.reload(false);
                                  } catch (err) {
                                    console.log("error", err);
                                    window.location.reload(false);
                                  }
                                };

                                fetchData();
                              }}
                            >
                              remove
                            </Button>
                          </CardContent>
                        </Card>
                      </Box>
                    ) : (
                      <></>
                    )
                  )}
                </Box>
              </Box>
            </>
          )}

          <Dialog open={open} onClose={handleClose} maxWidth="999">
            {loading ? (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            ) : (
              <>
                <div
                  style={{
                    backgroundColor: "rgb(250, 240, 229)",
                    width: "70vw",
                  }}
                >
                  <Box sx={{ m: "4vw" }}>
                    <h2>Add a New Food Item:</h2>
                    <Box sx={{ mt: "1.5vw" }}>
                      <TextField
                        required
                        label="Name"
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        sx={{ width: "100%" }}
                      />
                    </Box>
                    <Box sx={{ mt: "1.5vw" }}>
                      <TextField
                        type="number"
                        label="Price"
                        onChange={(e) => {
                          let val = Number(e.target.value);
                          val = (val < 0 ? -1 : Math.round(val * 100.0) / 100.0);
                          setPrice(val);
                        }}
                        sx={{ width: "100%" }}
                        helperText="Please input positive value. Price will be automatically corrected to the nearest 2 decimal places"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              HK$
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box sx={{ mt: "1.5vw" }}>
                      <label htmlFor="profile" className="form-label">
                        <i className="material-icons">add_photo_alternate</i>
                        Picture *
                      </label>

                      <div className="row mb-2">
                        <section className="col-8">
                          <input
                            type="file"
                            className="form-control"
                            id="profile"
                            name="profile"
                            accept="image/jpeg, image/png"
                            onChange={showPreview}
                            placeholder="jpg/jepg/jfif/png"
                            required
                          />
                        </section>
                        <section className="col-4">
                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                            height="100%"
                          >
                            {imgUrl ? (
                              <img
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  objectFit: "contain",
                                }}
                                src={imgUrl}
                              />
                            ) : (
                              <></>
                            )}
                          </Stack>
                        </section>
                      </div>
                      {signupStatus === "FileExtensionError" ? (
                        <Alert severity="error">
                          Please upload again with jpg/jepg/jfif/png format
                        </Alert>
                      ) : (
                        <></>
                      )}
                    </Box>

                    <Box sx={{ mt: "1.5vw" }}>
                      <FormControl>
                        <FormLabel>Style</FormLabel>
                        <RadioGroup
                          defaultValue="none"
                          name="radio-buttons-group"
                          onChange={(e) => {
                            setStyle(e.target.value);
                          }}
                        >
                          <FormControlLabel
                            value="none"
                            control={<Radio />}
                            label="None"
                          />
                          {STYLES.map((x) => (
                            <FormControlLabel
                              value={x}
                              control={<Radio />}
                              label={x}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Box>

                    <Box sx={{ mt: "2.5vw" }}>
                      {name != "" &&
                      signupStatus != "FileExtensionError" &&
                      imgUrl &&
                      price >= 0 ? (
                        <Button
                          variant="contained"
                          color="pur"
                          onClick={async () => {
                            const toBase64 = (file) =>
                              new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = () => resolve(reader.result);
                                reader.onerror = (error) => reject(error);
                              });

                            let imgFile = await toBase64(fff);
                            let imgBuffer = Buffer.from(imgFile, "base64");

                            const url = PREFIX + "/restaurant/food";
                            let fd = new FormData();
                            fd.append("foodPic", fff);
                            fd.append("name", name);
                            fd.append("price", price);
                            fd.append("style", style);
                            const fetchData = async () => {
                              try {
                                setLoading(true);
                                const response = await fetch(url, {
                                  method: "POST",
                                  headers: {
                                    Authorization:
                                      "Bearer " +
                                      sessionStorage.getItem("token"),
                                  },
                                  body: fd,
                                });
                                const json = await response.json();
                                window.location.reload(false);
                              } catch (err) {
                                console.log("error", err);
                              }
                            };

                            fetchData();
                          }}
                        >
                          Add
                        </Button>
                      ) : (
                        <Button variant="contained" color="pur" disabled>
                          ADd
                        </Button>
                      )}
                    </Box>
                  </Box>
                </div>
              </>
            )}
          </Dialog>
        </Box>
      </ThemeProvider>{" "}
    </>
  );
}

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
  const useStyles = makeStyles({
    root: {
      width: "100%",
      margin: "15px 0",
    },
  });
  const classes = useStyles();
  var createDate = props.order.createdAt;
  var updateDate = props.order.updatedAt;
  var customerName = props.order.customerID.username;
  var customerID = props.order.customerID._id;
  var customerPhonenum = props.order.customerID.phoneNum;
  var orderNo = props.order.orderNo;

  function handleClick(orderID) {
    let s_orderID = orderID.toString();
    const URL = PREFIX + "/order/done";
    async function done() {
      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            orderNo: s_orderID,
          }),
        });
        const done_result = await response.json();
      } catch (error) {
        console.log("error", error);
      }
    }
    done();
    window.location.reload();
  }

  return (
    <>
      <Card className={classes.root}>
        <CardContent>
          <Box sx={{ px: 1 }}>
            <Typography variant="h4" component="h4">
              <span style={{ color: "#8a055e" }}>Order #{orderNo}</span>
            </Typography>
            <Typography variant="h5" component="h5">
              Customer Username: {customerName}
              <br />
              <span style={{ color: "#aaaaaa", fontSize: "15px" }}>
                (ID: {customerID})
              </span>
              <br />
              Ordered Items:
            </Typography>
            <div>
              {props.order.items.map((food, i) => (
                <FoodItem food={food} key={i} />
              ))}
            </div>
            <Typography gutterBottom variant="h5" component="h5">
              <span style={{ color: "#444444", fontSize: "20px" }}>
                Phone<i className="material-icons">phone</i>: {customerPhonenum}
              </span>
            </Typography>
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
              </span>
            </Typography>
          </Box>
        </CardContent>
        <Box sx={{ px: 1 }}>
          {props.order.status ? (
            ""
          ) : (
            <CardActions>
              <Button
                size="small"
                style={{
                  backgroundColor: "#8a055e",
                  marginLeft: "5px",
                  marginBottom: "5px",
                }}
                onClick={() => {
                  handleClick(orderNo);
                }}
              >
                <span style={{ color: "white", padding: "2px" }}>
                  Complete order
                </span>
              </Button>
            </CardActions>
          )}
        </Box>
      </Card>
    </>
  );
}

function OrderHistory(props) {
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderListDisplay, setOrderDisplay] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const URL = PREFIX + "/order/fetchByRestaurant";
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
      } catch (error) {
        setLoading(false);
        console.log("error", error);
      }
    };
    fetchOrder();
  }, []);

  useEffect(() => {
    let list =
      orderHistory.length == 0 ? (
        <h3>You haven't received any orders yet.</h3>
      ) : (
        orderHistory.map((order, i) => <Order order={order} i={i} key={i} />)
      );
    setOrderDisplay(list);
  }, [orderHistory]);

  useEffect(() => {
    //Listen to order update
    props.socket?.on("recieveOrder", (doc) => {
      setOrderHistory((prev) => [doc, ...prev]);
      //setSnackOpen(true)
      //setSnackMsg(doc.message)
    });

    return () => {
      //Off listener when dismount component
      props.socket?.off("recieveOrder");
    };
  }, [props.socket]);

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
              <h6>(Auto refresh)</h6>
              <hr />
              {orderListDisplay}
            </div>
            <div className="col-1"></div>
          </div>
      )}
    </>
  );
}

function UserRestaurant(props) {
  if (props.page == "menu") {
    return (
      <div className="userContent">
        <ChangeMenu />
      </div>
    );
  } else if (props.page == "history") {
    return (
      <div style={{ backgroundColor: "#faf0e5", height: "100%" }}>
        <OrderHistory socket={props.socket} />
      </div>
    );
  } else {
    return (
      <div style={{ backgroundColor: "#faf0e5" }}>
        <AccountInfo />
      </div>
    );
  }
}

export default UserRestaurant;
