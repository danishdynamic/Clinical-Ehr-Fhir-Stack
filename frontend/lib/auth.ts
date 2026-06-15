export const getAccessToken = () => {
  return localStorage.getItem("access");
};

export const setAccessToken = ( token: string ) => {
  localStorage.setItem(
    "access",
    token
  );
};