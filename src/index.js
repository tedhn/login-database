import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import gsap from "gsap";

import firebase from "./firebase.js~";
import "./style.scss";

import { TextField } from "@material-ui/core";

function App() {
  const [email, setEmail] = useState("asdf@gmail.com");
  const [password, setPassword] = useState("123455");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [text, setText] = useState("Sign In");
  const [c, setC] = useState(true);
  const [d, setD] = useState(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");

  const [tl, setTL] = useState(
    gsap.timeline().to({}, 1, { paused: true, reversed: true })
  );
  const [tl2, setTL2] = useState(
    gsap.timeline().to({}, 1, { paused: true, reversed: true })
  );

  useEffect(() => {
    setTL(
      gsap
        .timeline({ pause: true, reversed: true })
        .fromTo(
          ".weba",
          { x: 0, opacity: 1, duration: 1 },
          { x: -25, opacity: 0 }
        )
        .fromTo(
          ".button2",
          { x: 0, opacity: 1, duration: 1 },
          { x: -25, opacity: 0 },
          0
        )
        .fromTo(
          ".edit",
          { x: 25, opacity: 0, duration: 1 },
          { x: 0, opacity: 1 },
          0
        )
      // .fromTo(".panel", { height: "30%", duration: 1 }, { height: "60%" }, 0)
    );

    setTL2(
      gsap
        .timeline({ paused: true, reversed: true })
        .fromTo(".login", { width: "40%", duration: 1 }, { width: 0 })
        .fromTo(".title", { opacity: 1 }, { opacity: 0, duration: 1 }, "-=1")
        .fromTo(".password", { opacity: 1 }, { opacity: 0, duration: 1 }, "-=1")
        .fromTo(".email", { opacity: 1 }, { opacity: 0, duration: 1 }, "-=1")
        .fromTo(
          ".button",
          { opacity: 1 },
          {
            opacity: 0,
            duration: 1,
          },
          "-=1"
        )
        .fromTo(
          ".error",
          { opacity: 1 },
          {
            opacity: 0,
            duration: 1,
          },
          "-=1"
        )
        .fromTo(
          ".panel",
          { opacity: 0, x: 100, duration: 1 },
          {
            opacity: 1,
            x: 0,
            onComplete: () => {
              setText("Sign In");
            },
          }
        )
    );
  }, []);

  const getData = () => {
    firebase.db
      .collection("users")
      .doc(email)
      .get()
      .then((users) => {
        let { Age, Name, Username } = users.data();

        setName(Name);
        setAge(Age);
        setUsername(Username);
      });
  };

  const logIn = () => {
    setText("Signing In");
    setLoading(true);

    firebase.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setText("Signed In");
        getData();
        setC(false);
        setD(false);
        setTimeout(() => {
          tl2.play();
        }, 1000);
      })
      .catch((e) => {
        setTimeout(() => {
          setText("Sign In");
          setLoading(false);
          setError(e.message);
        }, 3500);
      });
  };

  const changeToEdit = () => {
    setD(true);
    tl.play();
  };

  const logOut = () => {
    setLoading(false);
    setD(true);
    setC(true);
    tl2.reverse();
  };

  return (
    <div className="container">
      <div className="login">
        <div className={c ? "title" : "title no"}>Login</div>

        <div className={c ? "error" : "error no"}>{error}</div>
        <TextField
          id="outlined-basic"
          className={c ? "email" : "email no"}
          label="Email"
          variant="outlined"
          size="small"
          disabled={loading ? true : false}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          className={c ? "password" : "password no"}
          id="outlined-basic"
          label="Password"
          variant="outlined"
          size="small"
          disabled={loading ? true : false}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className={c ? "button" : "button no"} onClick={logIn}>
          <div className={"text"}>{text}</div>
        </div>
      </div>

      <div className={d ? "panel editing" : "panel"}>
        <div className={d ? "weba" : "weba focused"}>
          <div className="text">
            <div className="title2">Welcome Back {username}</div>
            <div className="subtitle">Name : {name}</div>
            <div className="subtitle">Age : {age}</div>
          </div>
          <div className="options">
            <div
              className={d ? "button2" : "button2 focused"}
              onClick={changeToEdit}
            >
              Edit User Account
            </div>
            <div className={d ? "button2" : "button2 focused"} onClick={logOut}>
              Log Out
            </div>
          </div>
        </div>

        <div className={d ? "board focused" : "board"}>
          <div className={d ? "edit focused" : "edit"}>
            <div className="text">
              <div className="title2">Edit</div>
              <div className="name">
                <TextField
                  id="outlined-basic"
                  className="input"
                  label="Name"
                  variant="outlined"
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="age">
                <TextField
                  id="outlined-basic"
                  className="input"
                  label="Age"
                  variant="outlined"
                  size="small"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="username">
                <TextField
                  id="outlined-basic"
                  className="input"
                  label="Username"
                  variant="outlined"
                  size="small"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="options2">
              <div
                className={d ? "button3 focused" : "button3"}
                onClick={() => {
                  setD(false);
                  tl.reverse();
                }}
              >
                Back
              </div>
              <div
                className={d ? "button3 focused" : "button3"}
                onClick={() => {
                  firebase.db
                    .collection("users")
                    .doc(email)
                    .set({ Name: name, Age: age, Username: username })
                    .then(() => {
                      setD(false);
                      tl.reverse();
                    });
                }}
              >
                Save
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
