import React, { Fragment, useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Avatar, MenuItem, Stack, TextField } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import MaterialIconsReact from "material-icons-react";

async function signup(form, usertype) {
  return fetch(`https://csci3100takeiteasy.herokuapp.com/${usertype}/signup`, {
    method: "POST",
    body: form,
  }).then((data) => data.json());
}

function Signup(props) {
  const [imgUrl, setImgUrl] = useState("");
  const [formUsertype, setFormUsertype] = useState("");
  const [signupStatus, setSignupStatus] = useState("");
  const [pwVisibility, setPwVisibility] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSignupStatus("");

    // extract fields from form
    let signupForm = e.target;
    let formData = new FormData(signupForm);
    let usertype = formData.get("usertype");
    props.setUserInfo({
      username: formData.get("username"),
      usertype: formData.get("usertype"),
    });
    let res = await signup(formData, usertype);

    setSignupStatus(res.name);

    if (
      usertype === "customer" &&
      res.name === "SignupSuccessAndVerificationEmailSent"
    ) {
      navigate("/verification");
    } else if (
      usertype === "restaurant" &&
      res.name === "RegistrationReceived"
    ) {
      navigate("/verification");
    }
  };

  const handleUsertypeChange = async (e) => {
    let signupForm = document.getElementById("signup-form");
    setFormUsertype(e.target.value);

    // reset form with warning and img preview
    setSignupStatus("");
    setImgUrl("");
    signupForm.reset();

    // reset choice after reset form
    signupForm.usertype.value = e.target.value;
  };

  // preview after choosing profile picture
  const showPreview = async (e) => {
    e.preventDefault();

    let files = e.target.files;

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
  ];

  const restaurantSignupContent = (
    <>
      <div className="mb-2">
        <label htmlFor="restaurantName" className="form-label">
          <i className="material-icons">store</i>Restaurant name
        </label>
        <input
          type="text"
          className="form-control"
          id="restaurantName"
          name="restaurantName"
          pattern="^[a-zA-Z0-9\u4e00-\u9fa5_ \\.]+$"
          title="Combinations of alphanumeric characters, 中文字, space, full stop('.') and underscore('_') only"
          required
        />
      </div>
      <div className="mb-2">
        <label htmlFor="address" className="form-label">
          <i className="material-icons">place</i>Address
        </label>
        <input
          type="text"
          className="form-control"
          id="address"
          name="address"
          pattern="^[a-zA-Z0-9\u4e00-\u9fa5, \\.]+$"
          title="Combinations of alphanumeric characters, 中文字, space, full stop('.') and comma(',') only"
          required
        />
      </div>
      <div className="mb-2">
        <label htmlFor="licenseNum" className="form-label">
          <i className="material-icons">tag</i>License number
        </label>
        <input
          type="text"
          className="form-control"
          id="licenseNum"
          name="licenseNum"
          pattern="^[a-zA-Z0-9]+$"
          title="Combinations of alphanumeric characters only"
          required
        />
      </div>
    </>
  );

  const signupBox = (
    <>
      <div className="signup-container">
        <h1>Signup</h1>
        <hr className="header"></hr>
        <form id="signup-form" onSubmit={handleSubmit}>
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
          <div className="row mb-2">
            <div className="col-12 col-md-6 d-inline-block">
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
              {signupStatus === "UserAlreadyExisted" ? (
                <Alert severity="error">
                  User name aleady in used, please choose another username!
                </Alert>
              ) : (
                <></>
              )}
            </div>
            <div className="col-12 col-md-6 d-inline-block">
              <label htmlFor="password" className="form-label">
                <i className="material-icons">password</i>Password
              </label>
              <div className="input-group">
                <input
                  type={pwVisibility ? "text" : "password"}
                  className="form-control"
                  id="password"
                  name="password"
                  pattern="^.{8,}$"
                  title="length should be longer than 8 characters"
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
          <div className="row mb-2">
            <div className="col-12 col-md-6 d-inline-block">
              <label htmlFor="email" className="form-label">
                <i className="material-icons">email</i>Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                required
              />
            </div>
            <div className="col-12 col-md-6 d-inline-block">
              <label htmlFor="phoneNum" className="form-label">
                <i className="material-icons">smartphone</i>Phone no.
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneNum"
                name="phoneNum"
                pattern="[0-9]{8}"
                title="8-digit phone number"
                required
              />
            </div>
          </div>
          {formUsertype == "restaurant" ? restaurantSignupContent : ""}
          <div className="row mb-2">
            <section className="col-8">
              <label htmlFor="profile" className="form-label">
                <i className="material-icons">add_photo_alternate</i>Profile
              </label>
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
                spacing={2}
                height="100%"
              >
                <Avatar
                  alt="picture"
                  src={imgUrl}
                  sx={{ width: 85, height: 85 }}
                />
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

          <button type="submit" className="btn">
            Submit
          </button>
        </form>
        <div className="login">
          <hr className="header"></hr>
          <Link
            to="/"
            className="formattedLink"
            style={{ textAlign: "center" }}
          >
            Already have an account, click here to login
          </Link>
        </div>
      </div>
    </>
  );

  return signupBox;
}

export default Signup;
