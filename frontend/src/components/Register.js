import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const REGISTER_USER_MUTATION = gql`
  mutation registerMutation($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      _id
      email
      password
    }
  }
`;

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeHandler = (e) => {
    e.target.name === "email"
      ? setEmail(e.target.value)
      : setPassword(e.target.value);
  };

  const PerformRegisterComponent = () => {
    const [performRegister, { loading, error, data }] = useMutation(
      REGISTER_USER_MUTATION,
      {
        variables: { email, password },
      }
    );
    if (loading) {
      console.log("Loading...");
    }
    if (error) {
      return console.log(error);
    }
    if (data) {
      console.log("Data is: ", data);
    }
    return (
      <button
        onClick={performRegister}
        className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        Register
      </button>
    );
  };

  return (
    <div className="register">
      <section className="text-gray-500 bg-gray-900 body-font">
        <div
          className="container px-5 py-24 mx-auto flex flex-wrap items-center"
          style={{ minHeight: "86vh" }}
        >
          <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <h1 className="title-font font-medium text-3xl text-white">
              Welcome to the Register Page!
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
              Register
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
              <PerformRegisterComponent />
              <p className="text-xs text-gray-600 mt-3">Random text</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
