import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { route } from "quasar/wrappers";
import { useQuasar } from "quasar";
import { Cookies } from "quasar";
import { Notify, Loading, LocalStorage, Dialog } from "quasar";
import { useRoute, useRouter } from "vue-router";

export const useUserData = defineStore("userStore", {
  state: () => ({
    userDetails: {
      permissions: [],
      roles: [],
      branch: 0,
      slug: "",
    },
    rowDatas: [],
    tempRowDatas: [],
    branch: 0,
    branchName: "",
    rowStaffDatas: [],
    temprowStaffDatas: [],

    rowStaffBranchDatas: [],
    tempRowStaffBranchDatas: [],

    orderCount: 0,
    loading: false,
    // branches: [],
    // router: useRouter(),
  }),
  getters: {},
  actions: {
    onSearch(payload) {
      // console.log(payload);
      if (payload == null || payload == "" || payload.length == 0) {
        this.getAllMembers();
      } else {
        this.tempRowDatas = this.rowDatas;
        this.rowDatas = [];
        this.rowDatas = this.tempRowDatas.filter((subject) => {
          return Object.values(subject).some((word) =>
            String(word).toLowerCase().includes(payload)
          );
        });
      }
    },

    onSearchStaff(payload) {
      // console.log(payload);
      if (payload == null || payload == "" || payload.length == 0) {
        this.getAllStaff();
      } else {
        this.temprowStaffDatas = this.rowStaffDatas;
        this.rowStaffDatas = [];
        this.rowStaffDatas = this.temprowStaffDatas.filter((subject) => {
          return Object.values(subject).some((word) =>
            String(word).toLowerCase().includes(payload)
          );
        });
      }
    },
    async registerUser(payload) {
      // const router = useRouter();

      Loading.show();
      const $q = useQuasar();
      // console.log(payload);
      await api
        .post("/api/register", {
          name: payload[0],
          email: payload[1],
          password: payload[2],
          password_confirmation: payload[3],
          role: payload[4],
        })
        .then((res) => {
          // console.log(res);

          if (res.data.status == 200) {
            // hiding in 2s
            setTimeout(() => {
              Loading.hide();
              Notify.create({
                type: "positive",
                color: "positive",
                timeout: 1000,
                position: "bottom",
                message: res.data.message,
              });

              this.router.push({ name: "login" });
            }, 2000);
          } else {
            setTimeout(() => {
              Loading.hide();

              Notify.create({
                type: "negative",
                color: "negative",
                timeout: 1000,
                position: "bottom",
                message: res.data.message,
              });
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async loginUser(payload) {
      localStorage.removeItem("jwt");

      Loading.show();
      await api
        .post("/api/login", {
          email: payload[0],
          password: payload[1],
        })
        .then((response) => {
          console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              Loading.hide();

              LocalStorage.set("jwt", response.data.token);

              window.location = "/dashboard";
            }, 1000);
          } else {
            setTimeout(() => {
              Loading.hide();

              Notify.create({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "bottom",
                message: response.data.message,
              });
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            Loading.hide();

            Notify.create({
              type: "negative",
              color: "negative",
              timeout: 3000,
              position: "bottom",
              message: "Error! Invalid Credentials ",
            });
          }, 3000);
        });
    },
    async getUserDetails() {
      var newToken = LocalStorage.getItem("jwt");
      try {
        if (newToken !== null) {
          await api
            .get("/api/user/details", {
              headers: {
                Authorization: "Bearer " + newToken,
              },
            })
            .then((response) => {
              // console.log(response);

              if (response.data.user) {
                this.userDetails = {
                  user: response.data.user,
                  roles: response.data.roles,
                };
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async logoutUser() {
      const router = useRouter();

      const newToken = LocalStorage.getItem("jwt")
        ? LocalStorage.getItem("jwt")
        : null;
      await api
        .post("/api/logout", {
          headers: {
            Authorization: "Bearer " + newToken,
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
          },
        })
        .then((response) => {
          // console.log(response);
          // this.userDetails = {};
          localStorage.removeItem("jwt");
          window.location.reload();

          // router.push({ name: "login" });
          window.location = "/login";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllUsers() {
      this.rowDatas = [];
      // rowDatas.splice(0, rowDatas.length);
      this.loading = true;
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/users", {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);

          if (response.data.status == 200) {
            setTimeout(() => {
              // this.rowDatas = response.data.data;
              Object.entries(response.data.data).map(([key, val]) => {
                this.rowDatas.push({
                  name: val.name,
                  email: val.email,
                  dob: val.dob,
                  gender: val.gender,
                  phone: val.phone,
                  country: val.country,
                  role: val.role,
                  state: val.state,
                  city: val.city,
                  zipcode: val.zipcode,
                  street: val.street,
                  id: val.id,
                  value: val.id,
                  label: val.name,
                  profile_pic: val.profile_pic,
                });
              });
              this.loading = false;
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addNewMember(payload) {
      // this.loading = true;
      setTimeout(() => {
        Object.entries(payload).map(([key, val]) => {
          this.rowDatas.push({
            name: val.name,
            email: val.email,
            dob: val.dob,
            gender: val.gender,
            phone: val.phone,
            country: val.country,
            role: val.role,
            state: val.state,
            city: val.city,
            zipcode: val.zipcode,
            street: val.street,
            id: val.id,
            value: val.id,
            label: val.name,
            profile_pic: val.profile_pic,
          });
        });
        // this.loading = false;
      }, 100);
    },

    async getbranchStaff(payload) {
      this.tempRowStaffBranchDatas = [];
      this.rowStaffBranchDatas = [];
      var newToken = LocalStorage.getItem("jwt");

      await api
        .get(`/api/${[payload[0]]}/staff/${payload[1]}`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            this.tempRowStaffBranchDatas = response.data.data;
            this.rowStaffBranchDatas = this.tempRowStaffBranchDatas;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getAllStaff(payload) {
      this.rowStaffDatas = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`/api/${payload[0]}/staff`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            this.temprowStaffDatas = response.data.data;
            this.rowStaffDatas = this.temprowStaffDatas;
          }

          // if (response.data.data) {
          //   this.rowStaffDatas = response.data.data;
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    checkRole(payload) {
      // console.log(this.userDetails.roles);
      if (payload == null) {
        payload = ["none"];
      }
      if (payload != "logout") {
        var a = 0;
        const roles = payload.some((permis) => {
          this.userDetails.roles.map((f) => {
            if (permis == f) {
              a++;
              return true;
            }
          });
        });
        if (a > 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    checkPermission(payload) {
      var a = 0;
      const permission = payload.some((permis) => {
        this.userDetails.permissions.map((f) => {
          // console.log("permis = " + permis + "/ f = " + f);

          // console.log(permission);
          // return permission;
          if (permis == f) {
            a++;
            return true;
          }
          // console.log("match");
        });
        // console.log(permis);

        // return permis == "view-profile";
      });
      if (a > 0) {
        return true;
      } else {
        return false;
      }
      // console.log(permission);

      return permission;
    },
  },
});
