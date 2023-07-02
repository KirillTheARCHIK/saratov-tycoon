import { createContext } from "react";
import { User } from "../classes/User";

export interface IAuthContext{
  user?: User,
  setUser?: React.Dispatch<any>,
}

export const IAuthContextDefaultValues = {

} as IAuthContext;

export const AuthContext = createContext<IAuthContext>(IAuthContextDefaultValues);