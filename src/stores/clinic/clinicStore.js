import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { route } from "quasar/wrappers";
import { useQuasar } from "quasar";
import { Cookies } from "quasar";
import { Notify, Loading, LocalStorage, Dialog } from "quasar";
import { useRoute, useRouter } from "vue-router";

export const useClinicData = defineStore("clinicStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],

    doctorRowDatas: [],
    tempDoctorRowDatas: [],
    loading: false,
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
    /**
     *
     * Get all saved clinics
     *
     */
    async getAllClinics() {
      this.rowDatas = [];
      this.tempRowDatas = [];
      // rowDatas.splice(0, rowDatas.length);
      this.loading = true;
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/clinic", {
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
                this.tempRowDatas.push({
                  name: val.name,
                  address: val.address,
                  phone: val.phone,
                  rating: val.rating,
                  website: val.website,
                  label: val.name,
                  value: val.id,
                });
              });
              this.rowDatas = this.tempRowDatas;
              this.loading = false;
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /**
     *
     * Get Doctor's Clinic Location
     *
     */
    async getDoctorClinics() {
      this.doctorRowDatas = [];
      this.tempDoctorRowDatas = [];
      // rowDatas.splice(0, rowDatas.length);
      this.loading = true;
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/clinic/all/location", {
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
                this.tempDoctorRowDatas.push({
                  name: val.name,
                  address: val.address,
                  phone: val.phone,
                  rating: val.rating,
                  website: val.website,
                  label: val.name,
                  value: val.id,
                });
              });
              this.doctorRowDatas = this.tempDoctorRowDatas;
              this.loading = false;
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
