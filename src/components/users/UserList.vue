<template>
  <q-table
    flat
    :pagination="pagination"
    class="q-pa-sm"
    :rows="userStore.rowDatas"
    :loading="userStore.loading"
    :columns="columns"
    row-key="id"
    separator="none"
    :visible-columns="['name', 'email', 'action']"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="name" :props="props">
          <q-btn round>
            <q-avatar size="42px">
              <img
                :src="props.row.profile_pic"
                v-if="props.row.profile_pic != null"
              />
              <q-btn v-else-if="props.row.gender == 'Male'" icon="face"></q-btn>
              <q-btn v-else icon="face_3"></q-btn>
            </q-avatar>
          </q-btn>
          {{ props.row.name }}
        </q-td>
        <q-td key="email" :props="props">
          {{ props.row.email }}
        </q-td>
        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            @click="editDialogFunc(props.row.id)"
            icon="edit"
            size="sm"
            label="edit"
          />
          <q-btn
            color="orange"
            icon="camera_alt"
            label="profile image"
            size="sm"
            @click="changeImageDialog(props.row.id)"
          />
          <q-btn
            color="grey"
            icon="password"
            label="change password"
            size="sm"
            @click="passwordDialogFunc(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <q-dialog v-model="showEditDialog" persistent>
    <EditUser
      @hide-edit-dialog="showEditDialog = !showEditDialog"
      :user-id="userId"
    />
  </q-dialog>

  <q-dialog v-model="showPasswordDialog" persistent>
    <ChangePassword
      @hide-password-dialog="showPasswordDialog = !showPasswordDialog"
      :user-id="userId"
    />
  </q-dialog>

  <q-dialog v-model="showCaptureImg" persistent>
    <ChangeImage
      :user-id="userId"
      @hide-image-dialog="showCaptureImg = !showCaptureImg"
    />
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserData } from "src/stores/users/userStore";
import EditUser from "./EditUser.vue";
import ChangePassword from "./ChangePassword.vue";
import ChangeImage from "./ChangeImage.vue";
const userStore = useUserData();

const showEditDialog = ref(false);
const showPasswordDialog = ref(false);
const showCaptureImg = ref(false);
const userId = ref("");

const changeImageDialog = (id) => {
  showCaptureImg.value = true;
  userId.value = id;
};

const editDialogFunc = (id) => {
  userId.value = id;
  showEditDialog.value = true;
};

const passwordDialogFunc = (id) => {
  userId.value = id;
  showPasswordDialog.value = true;
};
const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 10,
});
const columns = reactive([
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "email",
    label: "Email",
    field: "email",
    align: "left",
    sortable: true,
  },
  {
    name: "number",
    label: "Number",
    field: "number",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);
onMounted(() => {});
</script>

<style></style>
