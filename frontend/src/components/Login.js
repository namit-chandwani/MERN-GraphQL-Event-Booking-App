import React, { useState, useContext } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import AuthContextProvider from "../context/authContext";
const LOGIN_USER_QUERY = gql`
  query loginQuery($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContextProvider);

  const onChangeHandler = (e) => {
    e.target.name === "email"
      ? setEmail(e.target.value)
      : setPassword(e.target.value);
  };

  const PerformLoginComponent = () => {
    const [performLogin, { loading, data }] = useLazyQuery(LOGIN_USER_QUERY, {
      variables: { email, password },
    });
    if (loading) {
      console.log("Loading...");
    }
    if (data) {
      // console.log("Data is: ", data);
      authContext.login(data.login.token, data.login.userId);
      props.history.push("/events");
    }
    return (
      <button
        onClick={performLogin}
        className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        Login
      </button>
    );
  };

  return (
    <div className="login">
      <section className="text-gray-500 bg-gray-900 body-font">
        <div
          className="container px-5 py-24 mx-auto flex flex-wrap items-center"
          style={{ minHeight: "86vh" }}
        >
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="title-font font-medium text-3xl text-white">
              Welcome to the Login Page!
            </h1>
            <p className="leading-relaxed mt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              earum suscipit qui? Quo quas aliquid praesentium porro accusamus
              ut, illum et harum quidem aspernatur deserunt qui dolore voluptate
              excepturi. Labore.
            </p>
          </div>
          <div className="lg:w-2/6 md:w-1/2 bg-gray-800 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <h2 className="text-white text-lg font-medium title-font mb-5">
              Login
            </h2>
            <div>
              <div className="relative mb-4">
                <label
                  htmlFor="email"
                  className="leading-7 text-sm text-gray-400"
                >
                  Email ID
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={onChangeHandler}
                  className="w-full bg-gray-700 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="password"
                  className="leading-7 text-sm text-gray-400"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={onChangeHandler}
                  className="w-full bg-gray-700 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <PerformLoginComponent />
              <p className="text-xs text-gray-600 mt-3">Random text</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
