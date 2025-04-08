import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "routes";
import Navbar from "components/navbar";
import { useAuth } from "../contexts/AuthContext";

export default function MainLayout(props: { [x: string]: any }) {
  const { ...rest } = props;
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
  const { isLogin,session } = useAuth();
  React.useEffect(() => {
      getActiveRoute(routes);
  }, [location.pathname,session]);

  const getActiveRoute = (routes: RoutesType[]): string | boolean => {
    let activeRoute = "forum";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1) {
        setCurrentRoute(routes[i].key);}
       }
    return activeRoute;
  };

  const getActiveNavbar = (routes: RoutesType[]): string | boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;}
      }
    return activeNavbar;
  };
  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((prop, key) => {
      if (prop.layout === "") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div className="flex flex-col h-screen p-4 pt-6 sm:p-6 max-w-[1440px] m-auto gap-4">
      <main
        className="transition-all grow overflow-hidden"
      >
        <div className="h-full">
          <Routes>
            {getRoutes(routes)}
          </Routes>
        </div>
      </main>
      <Navbar
        currentRoute={currentRoute}
        secondary={getActiveNavbar(routes)}
        {...rest}
      />
    </div>
  );
}
