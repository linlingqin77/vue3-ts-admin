<script lang="ts" setup>
import { ref, watch, PropType, reactive, nextTick } from "vue"
import { ElForm, ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import * as Departments from "@/api/system/departments/types"
import { IdialogProps } from "../types"
import { getDepartmentDataApi, addDepartmentApi, updateDepartmentApi } from "@/api/system/departments"
import IconSelect from "@/components/IconSelect/index.vue"
const props = defineProps<IdialogProps>()

const rules = reactive<FormRules<typeof props.data>>({
  parent_id: [{ required: true, message: "请选择上级部门", trigger: "change" }],
  name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
  order: [{ required: true, message: "请输入部门排序", trigger: "blur" }],
})
const visible = defineModel("visible", {
  type: Boolean,
  default: false
})
const emits = defineEmits(["add", "edit"])

const form = ref<FormInstance>()

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

// 确定
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      switch (props.type) {
        case "add":
          await addDepartmentApi(props.data)
          ElMessage.success("新增成功")
          emits("add")
          visible.value = false
          break
        case "edit":
          await updateDepartmentApi(props.data)
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
    <el-form ref="form" :model="props.data" label-width="80px" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级部门" prop="parent_id">
            <el-tree-select v-model="props.data.parent_id" :data="menusList" :render-after-expand="false"
              style="width: 240px" :props="{ label: 'name', value: 'id' }" node-key="id" :check-strictly="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="props.data.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="order">
            <el-input v-model="props.data.order" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="props.data.leader"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="props.data.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="props.data.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门状态" prop="status">
            <el-radio-group v-model="props.data.status">
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
