import "./App.css";
import { useState } from "react";
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
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
  // headers: {
  //   authorization: localStorage.getItem("token") || "",
  // },
});

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
  };

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
