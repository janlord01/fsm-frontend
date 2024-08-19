<template>
  <q-page>
    <div class="shadow-0 q-pa-md rounded-borders text-black bg-white q-pa-lg">
      <q-card class="full-width">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>Ask Question</q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <q-form
            class="column q-pa-md shadow full-width block"
            ref="formName"
            @submit="onSubmit"
          >
            <div class="row q-col-gutter-none relative-position">
              <div class="row col q-col-gutter-none relative-position q-mr-md">
                <!-- <p class="text-h4">Ask a <span>QUESTION</span></p> -->
                <p>
                  If you have any questions about Dental Implants, ask them
                  here! Your question will be shared with The Smile Mentor
                  community and board certified professionals. Learn from others
                  like us and interact!
                </p>
                <p>
                  Looking for the dental board?
                  <a
                    href="https://www.thesmilementor.com/tools-for-a-successful-smile/"
                  >
                    FIND THEM HERE (Leads to dental board)</a
                  >
                </p>

                <q-select
                  filled
                  class="full-width q-mb-md"
                  :options="[
                    'General Implant Questions',
                    'Pre Surgery, Surgery, Post Surgery',
                    'Diets',
                    'Hygiene',
                    'Other Concerns',
                  ]"
                  label="Select a Topic"
                  v-model="formData.topic"
                >
                  <template v-slot:prepend>
                    <q-icon name="wc" />
                  </template>
                </q-select>
                <p class="text-h5 full-width">Type your question here</p>
                <p>Be clear and concise</p>
                <q-input
                  filled
                  label="Type your question here"
                  type="textarea"
                  class="full-width q-mb-md"
                  v-model="formData.question"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_phone" />
                  </template>
                </q-input>

                <p class="text-h5 full-width">Can you tell us more</p>
                <p>
                  Provide specific details, such as the treatment you're
                  considering and any other relevant information about yourself
                  here.
                </p>
                <q-editor
                  v-model="formData.tell_more"
                  min-height="6rem"
                  class="full-width q-mb-md"
                />
                <div
                  class="file-drop-area full-width q-mb-md"
                  @dragover.prevent
                  @drop.prevent="handleDrop"
                >
                  <q-icon name="cloud_upload" size="64px" color="primary" />
                  <p>Drag & Drop your images here or click to select</p>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    @change="handleFiles"
                    class="file-input"
                  />
                </div>

                <!-- Preview Selected Files -->
                <div class="file-preview">
                  <div
                    v-for="(file, index) in files"
                    :key="index"
                    class="file-preview-item"
                  >
                    <img
                      :src="file.preview"
                      alt="Image preview"
                      class="file-preview-image"
                    />
                    <q-icon
                      name="cancel"
                      class="remove-icon"
                      @click="removeFile(index)"
                    />
                    <p>{{ file.name }}</p>
                  </div>
                </div>

                <q-btn
                  unelevated
                  label="Submit"
                  class="text-center full-width"
                  color="primary"
                  size="md"
                  type="submit"
                />
              </div>
            </div>
            <p class="q-mt-lg">
              <span class="text-bold">Important:</span> All questions are public
              and cannot be removed. Be sure to omit personal information that
              you don’t want to be shared (like your name, identifiable marks,
              tattoos, etc). If you're experiencing a medical issue, please
              contact a healthcare professional or dial 911 immediately.
            </p>
          </q-form>
        </q-card-section>

        <q-inner-loading :showing="visible" />
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";

const files = reactive([]);

// Handle file drop
const handleDrop = (event) => {
  event.preventDefault();
  const droppedFiles = event.dataTransfer.files;
  handleFiles({ target: { files: droppedFiles } });
};

// Handle file input change
const handleFiles = (event) => {
  const selectedFiles = event.target.files;

  Array.from(selectedFiles).forEach((file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        files.push({
          name: file.name,
          preview: e.target.result,
          file: file, // Add the actual file object for upload
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.error(`Unsupported file type: ${file.type}`);
    }
  });
};

// Remove selected file
const removeFile = (index) => {
  files.splice(index, 1);
};

// Prepare files for upload
const uploadFiles = () => {
  const form = new FormData();

  files.forEach((file, index) => {
    form.append(`files[${index}]`, file.file); // Append the actual file object
  });

  return form;
};

const visible = ref(true);
const $q = useQuasar();
const formData = reactive({
  topic: "",
  question: "",
  tell_more: "",
});

// Handle form submission
const onSubmit = () => {
  const newToken = LocalStorage.getItem("jwt");
  const form = uploadFiles(); // Use the function to create FormData

  form.append("topic", formData.topic);
  form.append("question", formData.question);
  form.append("tell_more", formData.tell_more);
  $q.loading.show();

  api
    .post("/api/question", form, {
      headers: {
        Authorization: "Bearer " + newToken,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response);
      if (response.data.status === 200) {
        setTimeout(() => {
          $q.notify({
            type: "positive",
            icon: "save",
            timeout: 3000,
            position: "top",
            message: response.data.message,
          });
          $q.loading.hide();
        }, 500);
      } else {
        setTimeout(() => {
          $q.notify({
            type: "negative",
            icon: "error",
            timeout: 3000,
            position: "top",
            message: response.data.message,
          });
          $q.loading.hide();
        }, 3000);
      }
    })
    .catch((error) => {
      console.error(error);
      $q.notify({
        type: "negative",
        icon: "error",
        timeout: 3000,
        position: "top",
        message: "Error! Please report to software engineer",
      });
      $q.loading.hide();
    });
};

// Hide loading indicator on mount
onMounted(() => {
  setTimeout(() => {
    visible.value = false;
  }, 300);
});
</script>
<style scoped>
.file-drop-area {
  border: 2px dashed #42a5f5;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.file-drop-area p {
  margin-top: 16px;
  font-size: 16px;
  color: #42a5f5;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
}

.file-preview-item {
  width: 120px;
  text-align: center;
  position: relative;
}

.file-preview-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: red;
  font-size: 20px;
}
</style>
