import { isEmpty } from "lodash";

export const storeSession = (session) => {
  if (isEmpty(session)) {
    return null;
  }

  localStorage.setItem("x-xc-session", session);
};

export const getSession = () => {
  return localStorage.getItem("x-xc-session");
};
