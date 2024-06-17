<script lang="ts" setup>
import { ref, watch, PropType, reactive, nextTick, onMounted } from "vue"
import { ElForm, ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import * as Departments from "@/api/system/departments/types"
import * as Roles from "@/api/system/roles/types"
import * as Positions from "@/api/system/positions/types"
import { IdialogTitle, IdialogType, IdialogData } from "../types"
import { getDepartmentDataApi } from "@/api/system/departments"
import { getRoleListApi } from "@/api/system/roles"
import { getPositionListApi } from "@/api/system/positions"
import { createUserApi, updateUserApi } from "@/api/system/users"
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String as PropType<IdialogTitle>, default: "新增用户" },
  type: { type: String as PropType<IdialogType> },
  data: { type: Object as PropType<IdialogData>, default: () => { } }
})
const rules = reactive<FormRules<typeof formData>>({
  username: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
})
const visible = defineModel("visible", {
  type: Boolean,
  default: false
})
const emits = defineEmits(["add", "edit"])

const form = ref<FormInstance>()
const formData = ref(props.data)
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 获取部门列表
const departmentList = ref<Departments.IDepartment[]>([])
const getDepartment = async () => {
  const res = await getDepartmentDataApi({ all: 1 })
  departmentList.value = res.data.list
}

// 获取角色列表
const roleList = ref<Roles.IRole[]>([])
const getRoleList = async () => {
  const res = await getRoleListApi({ all: 1 })
  roleList.value = res.data.list
}

// 获取岗位列表
const positionList = ref<Positions.IPosition[]>([])
const getPositionList = async () => {
  const res = await getPositionListApi({ all: 1 })
  positionList.value = res.data.list
}


watch(() => props.data, (newVal) => {
  if (newVal) formData.value = { ...newVal }
})
onMounted(() => {
  getDepartment()
  getRoleList()
  getPositionList()
})

// 确定
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      switch (props.type) {
        case "add":
          await createUserApi(formData.value)
          ElMessage.success("新增成功")
          emits("add")
          visible.value = false
          break
        case "edit":
          await updateUserApi(formData.value)
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

</script>

<template>
  <el-dialog v-model="visible" :title="props.title" width="600px" @closed="resetForm(form)">
    <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="formData.nickname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属部门" prop="department_id">
            <el-tree-select v-model="formData.department_id" :data="departmentList" :render-after-expand="false"
              style="width: 240px" :props="{ label: 'name', value: 'id' }" node-key="id" :check-strictly="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="formData.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="props.type == 'add'">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="formData.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="props.type == 'add'">
          <el-form-item label="用户密码" prop="password">
            <el-input v-model="formData.password" type="password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户性别" prop="sex">
            <el-select v-model="formData.sex" clearable placeholder="请选择性别">
              <el-option label="女" :value="'0'" />
              <el-option label="男" :value="'1'" />
              <el-option label="未知" :value="'3'" />
            </el-select>
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
        <el-col :span="12">
          <el-form-item label="岗位" prop="position_ids">
            <el-select v-model="formData.position_ids" multiple clearable placeholder="请选择岗位">
              <el-option v-for="item in positionList" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="role_ids">
            <el-select v-model="formData.role_ids" multiple clearable placeholder="请选择角色">
              <el-option v-for="item in roleList" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="notes">
            <el-input v-model="formData.notes" type="textarea"></el-input>
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
