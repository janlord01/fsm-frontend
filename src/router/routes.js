const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    redirect: "/login",
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "login",
        component: () => import("pages/auth/LoginPage.vue"),
        name: "login",
        meta: {
          requiredAuth: false,
        },
      },
      {
        path: "register",
        component: () => import("pages/auth/SignUpPage.vue"),
        name: "register",
        meta: {
          requiredAuth: false,
        },
      },
      {
        path: "/register-professional",
        component: () => import("pages/auth/SignUpPageProfessional.vue"),
        name: "register-professional",
        meta: {
          requiredAuth: false,
        },
      },
      {
        path: "forgot-password",
        component: () => import("pages/auth/ForgotPassword.vue"),
        name: "forgot-password",
        meta: {
          requiredAuth: false,
        },
      },
      {
        path: "reset-password",
        component: () => import("pages/auth/ResetPassword.vue"),
        name: "reset-password",
        meta: {
          requiredAuth: false,
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    meta: {
      requiredAuth: false,
    },
  },
  {
    path: "/dashboard",
    component: () => import("layouts/AuthLayout.vue"),
    meta: {
      requiredAuth: true,
      access: ["super-admin", "client", "professional"],
    },
  },
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    meta: {
      requiredAuth: true,
      access: ["super-admin", "client", "professional"],
    },
    children: [
      {
        path: "/profile",
        component: () => import("pages/profile/UpdateProfilePage.vue"),
        name: "profile",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "client", "professional"],
        },
      },
      {
        path: "/profile/change-password",
        component: () => import("pages/profile/ChangePasswordPage.vue"),
        name: "change-password",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "client", "professional"],
        },
      },
    ],
  },

  {
    path: "/users",
    component: () => import("layouts/AuthLayout.vue"),
    meta: {
      requiredAuth: true,
    },
    children: [
      {
        path: "/users",
        component: () => import("pages/users/UserIndex.vue"),
        name: "user-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin"],
        },
      },
    ],
  },
  {
    path: "/question",
    component: () => import("layouts/AuthLayout.vue"),
    meta: {
      requiredAuth: true,
    },
    children: [
      {
        path: "/question",
        component: () => import("pages/question/QuestionIndexPage.vue"),
        name: "question-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "client"],
        },
      },
      {
        path: "/question/create",
        component: () => import("pages/question/CreateQuestionPage.vue"),
        name: "question-create",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "client"],
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
