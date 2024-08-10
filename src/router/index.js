import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

import { api } from "src/boot/axios";
import { Notify, Loading, LocalStorage, Dialog, colors } from "quasar";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const requiredAuth = to.matched.some((record) => record.meta.requiredAuth);
    const access = to.meta.access;

    var newToken = LocalStorage.getItem("jwt");
    const slugBookingPattern = /^\/[^\/]+\/booking$/;

    if (LocalStorage.getItem("jwt")) {
      if (requiredAuth) {
        api
          .get("api/check-token", {
            headers: {
              Authorization: "Bearer " + newToken,
            },
          })
          .then((response) => {
            console.log(response);
            if (response.data.status === 200) {
              const checkRole = access.some(
                (permis) => response.data.roles.indexOf(permis) !== -1
              );
              // next();
              if (checkRole == false && requiredAuth == true) {
                // Notify.create({
                //   type: "negative",
                //   color: "negative",
                //   timeout: 3000,
                //   position: "top",
                //   message: "Access Denied! Please wait...",
                // });

                // localStorage.removeItem("jwt");

                setTimeout(() => {
                  // window.location = "login";
                }, 2000);
              } else {
                next();
              }
            } else {
              localStorage.removeItem("jwt");
              return next("login");
            }
          })
          .catch((error) => {
            console.log(error);
            Notify.create({
              type: "warning",
              position: "top",
              timeout: 3000,
              message: "Session Expired! Please re-login again... ",
            });
            localStorage.removeItem("jwt");
            setTimeout(() => {
              // window.location.reload();
              next("login");
            }, 3000);
          });
      } else {
        localStorage.removeItem("jwt");
        next("login");
      }
    } else if (
      to.path == "/login" ||
      to.path == "/register" ||
      to.path == "/register-professional" ||
      to.path == "/forgot-password" ||
      to.path == "/reset-password" ||
      slugBookingPattern.test(to.path)
    ) {
      next();
    } else if (to.path == "/dashboard") {
      next("login");
    } else if (to.path == "/v1/forgot-password") {
      // next();
      window.location = api.getUri() + "/v1/forgot-password";
      // console.log(api.getUri() + "/v1/forgot-password");
    } else if (to.path == "/v1/auth/google/callback") {
      // next();
      window.location = api.getUri() + "/auth/google/callback";
    } else {
      // next();
      next("login");
    }
  });

  return Router;
});
