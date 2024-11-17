// import { createSlice } from "@reduxjs/toolkit";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: { jwtToken: "", isLogged: false, user: null },
//   reducers: {
//     login(state, actions) {
//       state.isLogged = true;
//       try {
//         state.user = actions.payload.user;
//         state.jwtToken = localStorage.getItem("token");
//       } catch (error) {
//         console.log("Error in login:", error);
//       }
//     },
//     logout(state, actions) {
//       state.isLogged = false;
//       localStorage.removeItem("token");
//     },
//   },
// });

// export { authSlice };
// export const authActions = authSlice.actions;
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { jwtToken: "", isLogged: false, user: null },
  reducers: {
    login(state, action) {
      state.isLogged = true;
      state.user = action.payload.user;
      state.jwtToken = localStorage.getItem("token");
    },
    logout(state, action) {
      state.isLogged = false;
      state.user = null;
      state.jwtToken = "";
      localStorage.removeItem("token");
    },
  },
});
export { authSlice };
export const authActions = authSlice.actions;