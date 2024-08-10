<template>
  <q-page class="">
    <div class="shadow-0 q-pa-md rounded-borders text-black bg-white q-pa-lg">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6 invisible">Clients</q-toolbar-title>

        <q-input bottom-slots label="Search User" outlined class="q-mr-sm">
          <template v-slot:append>
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
        <q-btn
          icon="add_circle"
          color="blue"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -20px"
          :label="$q.screen.gt.xs ? 'Create User' : ''"
          @click="CreateDialogFunc"
        />
      </q-toolbar>
      <userList />

      <q-dialog v-model="showCreateDialog">
        <CreateUser
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import userList from "components/users/UserList.vue";
import { ref, reactive, onMounted } from "vue";
import { useUserData } from "src/stores/users/userStore";
import CreateUser from "components/users/CreateUser.vue";

// User State Management
const userStore = useUserData();

// show Dialog variable(bolean)
const showCreateDialog = ref(false);
// Create Dialog Functions
const CreateDialogFunc = () => {
  showCreateDialog.value = true;
};

// load data
onMounted(() => {
  userStore.getAllUsers();
});
</script>
