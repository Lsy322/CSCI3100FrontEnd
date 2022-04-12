import React, { useState } from "react";
import "./verification.css";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

async function verify(username, otp) {
  return fetch(`https://csci3100takeiteasy.herokuapp.com/customer/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, otp: otp }),
  }).then((data) => data.json());
}

async function reverify(username) {
  return fetch(`https://csci3100takeiteasy.herokuapp.com/customer/reverify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username }),
  }).then((data) => data.json());
}

function Verification(props) {
  const [verifyStatus, setVerifyStatus] = useState("");
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    setVerifyStatus("");
    let otpForm = new FormData(e.target);
    let otp = otpForm.get("otp");

    let res = await verify(props.userInfo.username, otp.toString());

    console.log(res);

    if (res.token != null) {
      navigate("/");
      props.setToken(res.token);
      sessionStorage.setItem("token", res.token);
      sessionStorage.setItem("usertype", "customer");
      sessionStorage.setItem("username", props.userInfo.username);
    } else {
      setVerifyStatus(res.name);
    }
  };

  const handleReverify = async (e) => {
    e.preventDefault();

    setVerifyStatus("");
    let res = await reverify(props.userInfo.username);
    console.log(res);

    setVerifyStatus(res.name);
  };

  const verificationBox = (
    <>
      <div className="verification-container">
        <h1>Verification</h1>
        <hr className="header"></hr>
        <p>
          The 6-digit verification code has been sent to your registered email,
          please enter the verification code to activate your account within 2
          minutes.
        </p>
        <form onSubmit={handleOtpSubmit}>
          <div className="container">
            <div className="row mb-2">
              <div className="col-12 col-md-8 d-block">
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  name="otp"
                  pattern="[0-9]{6}"
                  title="6-digit code"
                  required
                />
              </div>
              <div className="col-12 col-md-4 d-block">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
            {verifyStatus === "InvalidOtp" ? (
              <Alert severity="error">Wrong verification code!</Alert>
            ) : (
              <></>
            )}
            {verifyStatus === "AlreadyActivated" ? (
              <Alert severity="error">
                You have already activated your account, please directly login
                to your account!
              </Alert>
            ) : (
              <></>
            )}
            {verifyStatus === "OtpNotFound" ? (
              <Alert severity="error">User not found!</Alert>
            ) : (
              <></>
            )}
            {verifyStatus === "OtpExpired" ? (
              <Alert severity="error">
                The verification code has been expired, please request for
                another verification code.
              </Alert>
            ) : (
              <></>
            )}
            {verifyStatus === "TooMuchTrials" ? (
              <Alert severity="error">
                You have made too much wrong trials, please request for another
                verification code.
              </Alert>
            ) : (
              <></>
            )}
            {verifyStatus === "PendingOtp" ? (
              <Alert severity="error">
                There is an unexpired verification code in your mailbox, please
                enter that code.
              </Alert>
            ) : (
              <></>
            )}
            {verifyStatus === "VerificationEmailSent" ? (
              <Alert severity="success">
                New verification code sent, please check your mailbox.
              </Alert>
            ) : (
              <></>
            )}
            <a className="formattedLink" onClick={handleReverify}>
              I dont receive a verification code/please re-issue another code
              for me
            </a>
          </div>
        </form>
      </div>
    </>
  );

  const waitApprovalBox = (
    <>
      <div className="verification-container">
        <h1>Thank you</h1>
        <hr className="header"></hr>
        <p>
          Your restaurant signup request is sent, please wait for admin
          approval. You will receive an email about your signup progress after
          admin has reviewed your request.
        </p>
        <Link to="/" className="formattedLink" style={{ textAlign: "center" }}>
          Go back to login page
        </Link>
      </div>
    </>
  );

  if (props.userInfo.usertype === "customer") {
    return verificationBox;
  } else if (props.userInfo.usertype === "restaurant") {
    return waitApprovalBox;
  } else {
    return <>Content not found</>;
  }
}

export default Verification;
