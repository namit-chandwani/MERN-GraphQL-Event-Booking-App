import "./App.css";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Login from "./components/Login";
import Register from "./components/Register";
import Events from "./components/Events";
import Bookings from "./components/Bookings";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Switch>
            {/* <Route path="/" component={}></Route> */}
            <Redirect exact from="/" to="/login" />
            <Route path="/login" component={Login}></Route>
            <Route path="/register" component={Register}></Route>
            <Route path="/events" component={Events}></Route>
            <Route path="/bookings" component={Bookings}></Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}

export default App;
