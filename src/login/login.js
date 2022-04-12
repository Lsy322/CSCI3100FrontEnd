import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { Alert, MenuItem, TextField } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import MaterialIconsReact from "material-icons-react";

// send login request to get token
async function loginAttempt(input, usertype) {
  return fetch(`https://csci3100takeiteasy.herokuapp.com/${usertype}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  }).then((data) => data.json());
}

export default function Login(props) {
  // var invalid_message = false;
  const [loginStatus, setLoginStatus] = useState("");
  const [pwVisibility, setPwVisibility] = useState(false);
  const navigate = useNavigate();

  // let choiceUsertype = "customer";
  const handleSubmit = async (e) => {
    e.preventDefault();

    // extract fields from form
    let loginForm = e.target;
    let formData = new FormData(loginForm);
    let username = formData.get("username");
    let password = formData.get("password");
    let usertype = formData.get("usertype");

    props.setUserInfo({
      username: formData.get("username"),
      usertype: formData.get("usertype"),
    });
    let res = await loginAttempt(
      {
        username: username,
        password: password,
      },
      usertype
    );

    // check the variable really contains a token, else do handling
    if (res.token != null) {
      props.setToken(res.token);
      sessionStorage.setItem("token", res.token); //Storing Token in Session Storage
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("usertype", usertype);
    } else {
      setLoginStatus(res.name);
      if (
        usertype === "customer" &&
        [
          "AccountNotActivatedAndVerificationEmailSent",
          "AccountNotActivatedAndPendingOtp",
        ].includes(res.name)
      ) {
        navigate("/verification");
      } else if (
        usertype === "restaurant" &&
        res.name === "AccountNotApproved"
      ) {
        navigate("/verification");
      }
    }
  };

  const handleUsertypeChange = async (e) => {
    let loginForm = document.getElementById("login-form");

    setLoginStatus("");
    loginForm.reset();

    // reset choice after reset form
    loginForm.usertype.value = e.target.value;
  };

  const usertypes = [
    {
      value: "customer",
      label: "customer",
      icon: "person",
    },
    {
      value: "restaurant",
      label: "restaurant",
      icon: "restaurant",
    },
    {
      value: "admin",
      label: "admin",
      icon: "manage_accounts",
    },
  ];

  return (
    <>
      <div className="login-container">
        <h1>Login</h1>
        <hr className="header"></hr>
        <form id="login-form" onSubmit={handleSubmit}>
          <TextField
            select
            required
            id="usertype"
            name="usertype"
            defaultValue="customer"
            label={
              <Fragment>
                <AccountCircle /> User type
              </Fragment>
            }
            onChange={handleUsertypeChange}
            sx={{ width: 200, marginBottom: 3 }}
          >
            {usertypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <MaterialIconsReact icon={option.icon} /> {option.label}
              </MenuItem>
            ))}
          </TextField>
          <div className="row mb-3">
            <div className="col-12">
              <label htmlFor="username" className="form-label">
                <i className="material-icons">edit</i>Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                pattern="^[a-zA-Z0-9_\\.]+$"
                title="Combinations of alphanumeric characters, full stop('.') and underscore('_') only"
                required
              />
            </div>
            <div className="col-12">
              <label htmlFor="password" className="form-label">
                <i className="material-icons">password</i>Password
              </label>
              <div className="input-group">
                <input
                  type={pwVisibility ? "text" : "password"}
                  className="form-control"
                  id="password"
                  name="password"
                  required
                />
                <button
                  type="button"
                  className="material-icons input-group-text"
                  onClick={() => setPwVisibility(!pwVisibility)}
                >
                  {pwVisibility ? "visibility_off" : "visibility"}
                </button>
              </div>
            </div>
          </div>
          {["UserNotFound", "InvalidPassword"].includes(loginStatus) ? (
            <Alert severity="error">Invalid username and password pair!</Alert>
          ) : (
            <></>
          )}
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
        <div className="signup">
          <hr className="header"></hr>
          <Link
            to="/signup"
            className="formattedLink"
            style={{ textAlign: "center" }}
          >
            Click here to sign up
          </Link>
        </div>
      </div>
    </>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
