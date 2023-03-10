<template>
  <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
    <el-form-item label="price" prop="price">
      <el-input-number :min="0" :max="100000" v-model="form.price" />
    </el-form-item>
    <div class="d-flex justify-content-end">
      <el-button @click="resetForm(ruleFormRef)">Cancel</el-button>
      <el-button type="primary" @click="onSubmit(ruleFormRef)"
        >Create</el-button
      >
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { supabase } from "@/core/services/SupabaseClientService";
import { useBookStore } from "@/store/useBookModule";
import { useRoute, useRouter } from "vue-router";
import type { ElForm } from "element-plus";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
const props = defineProps({
  isEdit: { type: Boolean, default: false },
});

const { book, error } = storeToRefs(useBookStore());
const { getBookById, createBook, editBook } = useBookStore();
const route = useRoute();
const router = useRouter();
const initialState = { price: 0 };
const form = reactive({ ...initialState });
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const rules = reactive({
  price: [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
});

const handleSubmitForm = async () => {
  if (props.isEdit) {
    const id = route?.params?.id as string;
    return await editBook({ data: form, id });
  } else await createBook(form);
};

const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      await handleSubmitForm();
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else router.push({ name: "list-book" });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  Object.assign(form, initialState);
  formEl.resetFields();
};
const getCurrentBook = async (id: string) => {
  if (props.isEdit) {
    await getBookById(id);
  }
};

onMounted(async () => {
  const id = route.params.id as string;

  await getCurrentBook(id);
  if (!!book.value && props.isEdit) {
    ["price"].forEach((item) => {
      form[item] = book.value[item];
    });
  }
});
</script>
