import { createContext } from "react";

const authContextProvider = createContext({
  token: "",
  userId: "",
  login: () => {},
  logout: () => {},
});

export default authContextProvider;
