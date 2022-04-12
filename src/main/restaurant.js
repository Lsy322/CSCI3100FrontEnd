import "./restaurant.css";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import SlidingPane from "react-sliding-pane";
import { Buffer } from "buffer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MaterialIcon from "material-icons-react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const PREFIX = "https://csci3100takeiteasy.herokuapp.com";

function Restaurant() {
  const theme = createTheme({
    palette: {
      pur: {
        main: "rgb(138, 5, 94)",
        dark: `rgb(${138 * 0.7}, ${5 * 0.7}, ${94 * 0.7})`,
        contrastText: `rgb(${255}, ${255}, ${255})`,
      },
    },
  });
  const STYLES = [
    "All",
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
  let { rid } = useParams();
  const [foodFilter, setFoodFilter] = useState(STYLES[0]);
  const [restaurants, setRestaurants] = useState(null);

  const [state, setState] = useState({
    isPaneOpen: false,
  });

  const [pic, setPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qtys, setQtys] = useState([]);
  const [pay, setPay] = useState(0);
  const BA = "base64";

  document.body.style.backgroundColor = "rgb(250, 240, 229)";
  document.body.style.color = "rgb(138, 5, 94)";

  function findRestaurant(restaurant_list, rid) {
    let res;
    restaurant_list.forEach((item, index) => {
      if (item._id == rid) {
        res = item;
      }
    });
    return res;
  }

  const [customerInfo, setCustomerInfo] = useState({});
  useEffect(() => {
    const URL = PREFIX + "/restaurant/approved";

    const fetchData = async () => {
      try {
        const response = await fetch(URL, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.token,
          },
        });
        const json = await response.json();
        let target_restaurant = findRestaurant(json, rid);
        let img = Buffer.from(target_restaurant.profilePic.data).toString(
          "base64"
        );
        setPic(img);
        setRestaurants(target_restaurant);
        for (let i = 0; i < target_restaurant.menu.length; i++) {
          let j = qtys;
          j.push(0);
          setQtys(j);
        }

        const URL2 = PREFIX + "/customer/data";
        const response2 = await fetch(URL2, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        });
        const customer_info = await response2.json();
        setCustomerInfo(customer_info);

        setLoading(false);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, []);
  const navigate = useNavigate();

  return loading ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : (
    <>
      <SlidingPane
        className="slide-pane"
        isOpen={state.isPaneOpen}
        onRequestClose={() => {
          setState({ isPaneOpen: false });
        }}
        hideHeader
        width={window.innerWidth < 600 ? "100%" : "32%"}
      >
        <Box sx={{ mt: "15%" }}>
          <h2>Cart:</h2>
          {restaurants.menu.map((x, y) =>
            qtys[y] > 0 ? (
              <Typography variant="body" display="block">
                {qtys[y]}× {x.name} &#8212; HK${x.price * qtys[y]}
              </Typography>
            ) : (
              <></>
            )
          )}
          {parseInt(
              String(Math.min(parseInt(String(customerInfo.points)), pay))
            ) > 0 ? 
          <Typography variant="body" display="block">
            {parseInt(
              String(Math.min(parseInt(String(customerInfo.points)), pay))
            )}
            × Points &#8212; HK$ –
            {parseInt(
              String(Math.min(parseInt(String(customerInfo.points)), pay))
            )}
          </Typography> : <></>}
          {(() => {
            return (
              <Box sx={{ mt: "40%" }}>
                <h2>
                  Total: HK$
                  {Math.round(
                    (pay -
                      parseInt(
                        String(
                          Math.min(parseInt(String(customerInfo.points)), pay)
                        )
                      )) *
                      1000
                  ) / 1000}
                </h2>
              </Box>
            );
          })()}
          <ThemeProvider theme={theme}>
            <Box sx={{ mt: "5%" }}>
              <Button
                onClick={async () => {
                  const fetchData = async () => {
                    try {
                      setLoading(true);

                      let ids = [];
                      for (let j = 0; j < restaurants.menu.length; j++) {
                        for (let k = 0; k < qtys[j]; k++) {
                          ids.push(restaurants.menu[j]._id);
                        }
                      }
                      let body = {
                        //'customerID':sessionStorage.token,
                        restaurantID: rid,
                        items: ids,
                        total: pay,
                        couponUsed: parseInt(
                          String(
                            Math.min(parseInt(String(customerInfo.points)), pay)
                          )
                        ),
                        netTotal:
                          pay -
                          parseInt(
                            String(
                              Math.min(
                                parseInt(String(customerInfo.points)),
                                pay
                              )
                            )
                          ),
                      };
                      const URL = PREFIX + "/order/add";
                      const response = await fetch(URL, {
                        method: "POST",
                        headers: {
                          Authorization: "Bearer " + sessionStorage.token,
                          "Content-type": "application/json",
                        },
                        body: JSON.stringify(body),
                      });
                      const json = await response.json();

                      //while(1);

                      // window.location = PREFIX+'/customer/history';

                      navigate("/customer/history", { replace: true });
                      window.location.reload();
                    } catch (err) {
                      console.log("error", err);
                    }
                  };

                  fetchData();

                  //window.location.reload(false);
                }}
                variant="contained"
                color="pur"
              >
                Place Order!
              </Button>
            </Box>
          </ThemeProvider>
        </Box>
      </SlidingPane>

      <Box
        sx={{
          width: "100vw",
          height: "40vh",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundImage: `linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,1)), url("data:image/jpg; base64, ${pic}")`,
        }}
      >
        <Typography
          ml="3%"
          pt="22vh"
          variant="h3"
          color={document.body.style.backgroundColor}
        >
          {restaurants.restaurantName}
        </Typography>

        <Typography
          ml="3%"
          pt="5pt"
          variant="h5"
          color={document.body.style.backgroundColor}
        >
          <MaterialIcon
            icon="place"
            color={document.body.style.backgroundColor}
          />
          {restaurants.address}
          <span>&nbsp;&nbsp;</span>
          <MaterialIcon
            icon="phone"
            color={document.body.style.backgroundColor}
          />
          {restaurants.phoneNum}
        </Typography>
      </Box>

      <Box sx={{ mt: "1%", ml: "3%" }}>
        <ThemeProvider theme={theme}>
          <Fab
            color="pur"
            style={{ position: "fixed", bottom: "3%", left: "2%" }}
            onClick={() => {
              setState({ isPaneOpen: true });
            }}
          >
            <ShoppingCartIcon
              sx={{ color: document.body.style.backgroundColor }}
            />
          </Fab>
        </ThemeProvider>

        {STYLES.map((x, y) => (
          <>
            {y % 5 == 0 ? (
              <Box sx={{ display: "flex", mb: "1%" }}>
                {[0, 1, 2, 3, 4].map((z) => (
                  <>
                    {y + z < STYLES.length ? (
                      <Card sx={{ display: "flex", width: 1 / 6, mr: "1%" }}>
                        <CardActionArea
                          sx={{ display: "flex" }}
                          onClick={() => {
                            setFoodFilter(STYLES[y + z]);
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="100%"
                            image={"/" + STYLES[y + z] + ".jpg"}
                            alt={STYLES[y + z]}
                            sx={{ display: "flex", width: 1 / 2 }}
                          />
                          <CardContent sx={{ display: "flex", width: 1 / 2 }}>
                            <Typography
                              gutterBottom
                              variant="body"
                              component="div"
                            >
                              {STYLES[y + z]}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </Box>
            ) : (
              <></>
            )}
          </>
        ))}
        {/*<div>{"/restaurant/getAll: "+( restaurants ? restaurants : "restaurant "+rid+" not found" )}</div>*/}

        <h2>Menu:</h2>
        <Box sx={{ mb: "10%" }}>
          {restaurants.menu.map((x, y) =>
            foodFilter == "All" || x.style == foodFilter ? (
              <Box sx={{ mt: "1%" }}>
                <Card sx={{ display: "flex", width: "70%", height: "20vh" }}>
                  <CardContent sx={{ width: 3 / 10, p: "0 0 0 0" }}>
                    <img
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain",
                      }}
                      src={`data:image/jpg; base64, ${Buffer.from(
                        x.picture.data
                      ).toString(BA)}`}
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
                    <TextField
                      type="number"
                      label="Qty"
                      inputProps={{
                        min: 0,
                        style: { textAlign: "right" },
                      }}
                      sx={{ mt: "2vh" }}
                      onChange={(e) => {
                        let t = qtys;
                        qtys[y] = Number(e.target.value);
                        setQtys(t);

                        let tot = 0;
                        for (let i = 0; i < restaurants.menu.length; i++) {
                          tot += restaurants.menu[i].price * qtys[i];
                        }
                        setPay(tot);
                      }}
                    />
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
  );
}

export default Restaurant;
