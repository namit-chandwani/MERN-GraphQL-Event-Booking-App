import "./App.css";
import { useState, useEffect } from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Login from "./components/Login";
import Register from "./components/Register";
import Events from "./components/Events";
import Bookings from "./components/Bookings";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthContextProvider from "./context/authContext";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
  // headers: {
  //   authorization: localStorage.getItem("token") || "",
  // },
});

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
      ? localStorage.getItem("token") === "null"
        ? null
        : localStorage.getItem("token")
      : null
  );
  const [userId, setUserId] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
    setLoggedOut(true);
  };

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <BrowserRouter>
          <AuthContextProvider.Provider
            value={{ token, userId, login, logout }}
          >
            <Navbar />
            <Switch>
              {!token && <Redirect exact from="/" to="/login" />}
              {token && <Redirect exact from="/" to="/events" />}
              {token && <Redirect exact from="/login" to="/events" />}
              {token && <Redirect exact from="/register" to="/events" />}
              {!token && loggedOut && (
                <Redirect exact from="/events" to="/login" />
              )}
              {!token && <Redirect exact from="/bookings" to="/login" />}
              {!token && <Route path="/login" component={Login}></Route>}
              {!token && <Route path="/register" component={Register}></Route>}
              <Route path="/events" component={Events}></Route>
              {token && <Route path="/bookings" component={Bookings}></Route>}
            </Switch>
            <Footer />
          </AuthContextProvider.Provider>
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}

export default App;
