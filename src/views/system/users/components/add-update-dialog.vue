<script lang="ts" setup>
import { ref, watch, PropType, reactive, nextTick } from "vue"
import { ElForm, ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import * as Departments from "@/api/system/departments/types"
import { IdialogProps } from "../types"
import { getDepartmentDataApi, addDepartmentApi, updateDepartmentApi } from "@/api/system/departments"

import IconSelect from "@/components/IconSelect/index.vue"
// const props = defineProps({
//   visible: { type: Boolean, default: false },
//   title: { type: String, default: "新增用户" },
//   type: { type: string },
//   data: { type: Object as PropType<Departments.IDepartment>, default: () => {} }
// })
const props = defineProps<IdialogProps>()

const rules = reactive<FormRules<typeof formData>>({
  parent_id: [{ required: true, message: "请选择上级用户", trigger: "change" }],
  name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
  order: [{ required: true, message: "请输入用户排序", trigger: "blur" }],
})
const visible = defineModel("visible", {
  type: Boolean,
  default: false
})
const emits = defineEmits(["add", "edit"])

const form = ref<FormInstance>()
const formData = ref<Departments.IDepartment>({
  id: 0,
  name: "",
  order: 0,
  parent_id: 0,
  status: "0",
  leader: "",
  phone: "",
  email: "",
})
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()

  console.log("重置表单")
}
const menusList = ref<Departments.IDepartment[]>([])
const getMenusTree = async () => {
  const res = await getDepartmentDataApi({})
  menusList.value = res.data.list
}
getMenusTree()

watch(
  () => props.data,
  (newVal, oldVal) => {
    console.log(newVal, oldVal);

    if (newVal) {
      formData.value = { ...newVal }
    } else {
      // formData.value = { ...oldVal }
      // resetForm(form.value)
    }
  }
)

// 确定
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      switch (props.type) {
        case "add":
          await addDepartmentApi(formData.value)
          ElMessage.success("新增成功")
          emits("add")
          visible.value = false
          break
        case "edit":
          await updateDepartmentApi(formData.value)
          ElMessage.success("修改成功")
          emits("edit")
          visible.value = false
          break
        default:
          break
      }
    }
  })
}
const closeDialog = () => {
  resetForm(form.value)
}
</script>

<template>
  <el-dialog v-model="visible" :title="props.title" width="600px" destroy-on-close>
    <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级用户" prop="parent_id">
            <el-tree-select v-model="formData.parent_id" :data="menusList" :render-after-expand="false"
              style="width: 240px" :props="{ label: 'name', value: 'id' }" node-key="id" :check-strictly="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="order">
            <el-input v-model="formData.order" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="formData.leader"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="formData.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :value="'0'">正常</el-radio>
              <el-radio :value="'1'">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="() => visible = false">取消</el-button>
        <el-button type="primary" @click="confirm(form)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
