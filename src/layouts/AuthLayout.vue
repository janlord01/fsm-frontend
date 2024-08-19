<template>
  <q-layout view="hHh lpR fFf" class="bg-white">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        />

        <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs">
          <!-- <q-icon :name="fabYoutube" color="red" size="28px" />
          <q-toolbar-title shrink class="text-weight-bold">
            YouTube
          </q-toolbar-title> -->
          <img
            alt="Quasar logo"
            src="~assets/images/logo.png"
            style="width: 160px"
          />
        </q-btn>

        <q-space />

        <div class="YL__toolbar-input-container row no-wrap">
          <q-input
            dense
            outlined
            square
            v-model="search"
            placeholder="Doctors, Q&A"
            class="bg-white col"
          />
          <q-btn
            class="YL__toolbar-input-btn"
            color="grey-3"
            text-color="grey-8"
            icon="search"
            unelevated
          />
        </div>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn
            round
            dense
            flat
            color="grey-8"
            icon="video_call"
            v-if="$q.screen.gt.sm"
          >
            <q-tooltip>Create a video or post</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="grey-8"
            icon="apps"
            v-if="$q.screen.gt.sm"
          >
            <q-tooltip>Apps</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="grey-8"
            icon="message"
            v-if="$q.screen.gt.sm"
          >
            <q-tooltip>Messages</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating> 2 </q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn> -->
          <span
            :style="$q.screen.gt.xs ? 'font-size: 12px;' : 'font-size:10px;'"
            v-if="$q.screen.gt.sm"
          >
            Welcome,
            {{
              userStore.userDetails.user ? userStore.userDetails.user.name : ""
            }}
          </span>

          <span class="text-body2 text-capitalize">
            <q-btn class="no-hover" unelevated dense ripple>
              <q-avatar v-if="userStore.userDetails.user" size="32px">
                <img
                  v-if="
                    userStore.userDetails.user &&
                    userStore.userDetails.user.profile_pic
                  "
                  :src="userStore.userDetails.user.profile_pic"
                />
              </q-avatar>
              <q-icon v-else left name="account_circle" />
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="q-mb-md" style="font-size: 18px">
                      Profile Settings
                    </div>

                    <q-list>
                      <!-- <q-item
                        clickable
                        v-if="$q.dark.isActive"
                        v-ripple
                        @click="changeTheme"
                      >
                        <q-item-section avatar>
                          <q-icon
                            dense
                            size="20px"
                            flat
                            name="eva-sun-outline"
                          />
                        </q-item-section>

                        <q-item-section>
                          <span
                            style="
                              font-size: 10px;
                              font-weight: bold;
                              margin-left: -20px;
                            "
                            >LIGHT THEME</span
                          >
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-if="!$q.dark.isActive"
                        v-ripple
                        @click="changeTheme"
                      >
                        <q-item-section avatar>
                          <q-icon
                            dense
                            size="20px"
                            flat
                            name="eva-moon-outline"
                          />
                        </q-item-section>

                        <q-item-section>
                          <span
                            style="
                              font-size: 10px;
                              font-weight: bold;
                              margin-left: -20px;
                            "
                            >DARK THEME</span
                          >
                        </q-item-section>
                      </q-item> -->

                      <q-item clickable v-ripple :to="`/profile`">
                        <q-item-section avatar>
                          <q-icon
                            dense
                            size="20px"
                            flat
                            name="eva-person-outline"
                          />
                        </q-item-section>

                        <q-item-section
                          ><span
                            style="
                              font-size: 10px;
                              font-weight: bold;
                              margin-left: -20px;
                            "
                            >Profile</span
                          ></q-item-section
                        >
                      </q-item>
                      <q-item
                        clickable
                        v-ripple
                        :to="`/profile/change-password`"
                      >
                        <q-item-section avatar>
                          <q-icon dense size="20px" flat name="password" />
                        </q-item-section>

                        <q-item-section
                          ><span
                            style="
                              font-size: 10px;
                              font-weight: bold;
                              margin-left: -20px;
                            "
                            >Chanage Password</span
                          ></q-item-section
                        >
                      </q-item>
                    </q-list>
                  </div>

                  <q-separator vertical inset class="q-mx-lg" />

                  <div class="column items-center">
                    <q-avatar size="72px">
                      <img
                        v-if="
                          userStore.userDetails.user &&
                          userStore.userDetails.user.profile_pic
                        "
                        :src="userStore.userDetails.user.profile_pic"
                      />
                    </q-avatar>
                    <!-- <q-btn dense label="Change" size="10px" flat color="blue" /> -->
                    <span
                      :style="
                        $q.screen.gt.xs
                          ? 'font-size: 10px; text-align:center;'
                          : 'font-size:10px;'
                      "
                    >
                      {{
                        userStore.userDetails.user
                          ? userStore.userDetails.user.name
                          : ""
                      }}
                    </span>
                    <q-chip
                      :label="userStore.userDetails.roles.toString()"
                      size="sm"
                      icon="badge"
                    />

                    <q-btn
                      color="negative"
                      label="Logout"
                      class="q-mt-sm"
                      @click="userStore.logoutUser"
                      size="sm"
                      v-close-popup
                    />
                  </div>
                </div>
              </q-menu>
            </q-btn>
            <!-- <q-btn
              v-if="$q.screen.gt.xs"
              flat
              dense
              round
              icon="menu"
              aria-label="Menu"
              @click="toggleLeftDrawer"
            /> -->
          </span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <div
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['super-admin'].indexOf(permis) !== -1
              )
            "
          >
            <q-item
              v-for="link in links1"
              :key="link.text"
              v-ripple
              :to="link.to"
              clickable
            >
              <q-item-section avatar>
                <q-icon color="grey" :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="q-my-md" />
            <q-item-label header class="text-weight-bold text-uppercase">
              Client's View
            </q-item-label>
          </div>
          <div
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['super-admin', 'client'].indexOf(permis) !== -1
              )
            "
          >
            <q-item
              v-for="link in links2"
              :key="link.text"
              :to="link.to"
              v-ripple
              clickable
            >
              <q-item-section avatar>
                <q-icon color="grey" :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div
            v-if="
              userStore.userDetails.roles.some(
                (permis) =>
                  ['super-admin', 'professional'].indexOf(permis) !== -1
              )
            "
          >
            <!-- <q-separator class="q-mt-md q-mb-xs" />

            <q-item-label header class="text-weight-bold text-uppercase">
              Doctor's View
            </q-item-label> -->

            <q-item v-for="link in links3" :key="link.text" v-ripple clickable>
              <q-item-section avatar>
                <q-icon color="grey" :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['super-admin'].indexOf(permis) !== -1
              )
            "
            class="q-mt-auto"
          >
            <q-separator class="q-my-md" />

            <q-item v-for="link in links4" :key="link.text" v-ripple clickable>
              <q-item-section avatar>
                <q-icon color="grey" :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <q-separator class="q-mt-md q-mb-lg" />

          <div id="credit" class="q-mt-auto absolute-bottom">
            <div class="q-px-md text-grey-9">
              <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
                <!-- <a
                v-for="button in buttons1"
                :key="button.text"
                class="YL__drawer-footer-link"
                href="javascript:void(0)"
              >
                {{ button.text }}
              </a> -->
                <p>
                  All Right Reserved &copy; 2024. Created By:
                  <a href="https://janlordluga.com/">Janlord Luga</a>
                </p>
              </div>
            </div>
            <div class="q-px-md q-pb-md text-grey-9">
              <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
                <a
                  v-for="button in buttons2"
                  :key="button.text"
                  class="YL__drawer-footer-link"
                  href="javascript:void(0)"
                >
                  {{ button.text }}
                </a>
              </div>
            </div>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { useUserData } from "src/stores/users/userStore";
import {
  defineComponent,
  reactive,
  onMounted,
  onBeforeMount,
  watch,
  computed,
  ref,
} from "vue";
const userStore = useUserData();

const leftDrawerOpen = ref(false);
const search = ref("");

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const links1 = reactive([
  { icon: "eva-home", text: "Dashboard", to: "/dashboard" },
  { icon: "groups", text: "Users", to: "/users" },
  { icon: "contact_support", text: "Questions" },
  { icon: "reviews", text: "Score Cards" },
  // { icon: "sponsors", text: "Sponsors" },
]);

const links2 = reactive([
  { icon: "home", text: "Home" },
  {
    icon: "eva-question-mark-circle",
    text: "Ask Question",
    to: "/question/create",
  },
  // { icon: "search", text: "Search Topic" },
  { icon: "fa-solid fa-user-md", text: "Ask Doctor" },
  // { icon: "search", text: "Search Doctor" },
  { icon: "library_add", text: "New Scorecard" },
]);
const links3 = reactive([
  { icon: "home", text: "Home" },
  {
    icon: "eva-question-mark-circle",
    text: "Questions",
  },
  { icon: "reviews", text: "Reviews" },
  { icon: "photo", text: "Photos" },
]);

const links4 = reactive([
  { icon: "settings", text: "Settings" },
  { icon: "flag", text: "Report history" },
  { icon: "help", text: "Help" },
  { icon: "feedback", text: "Send feedback" },
]);
// buttons1: [
//   { text: "About" },
//   { text: "Press" },
//   { text: "Copyright" },
//   { text: "Contact us" },
//   { text: "Creators" },
//   { text: "Advertise" },
//   { text: "Developers" },
// ],
const buttons2 = reactive([
  { text: "Terms" },
  { text: "Privacy" },
  { text: "Policy & Safety" },
]);

onMounted(() => {
  userStore.getUserDetails();
});
</script>

<style lang="sass">

.YL

  &__toolbar-input-container
    min-width: 100px
    width: 55%

  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>
