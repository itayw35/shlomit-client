import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./Home";
function Main() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<Home />} />
      </Route>
    )
  );
  return (
    <div>
      {" "}
      <RouterProvider router={router} />
    </div>
  );
}

export default Main;
