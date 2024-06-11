<script lang="ts" setup>
import { ref, watch, reactive } from "vue"
import { ElForm, ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import * as Positions from "@/api/system/positions/types"
import { IdialogProps } from "../types"
import { getPositionListApi, addPositionApi, updatePositionApi } from "@/api/system/positions"
const props = defineProps<IdialogProps>()

const rules = reactive<FormRules<typeof props.data>>({
  name: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入岗位编码", trigger: "blur" }],
  order: [{ required: true, message: "请输入岗位排序", trigger: "blur" }],
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
const menusList = ref<Positions.IPosition[]>([])
const getMenusTree = async () => {
  const res = await getPositionListApi({})
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
          await addPositionApi(props.data)
          ElMessage.success("新增成功")
          emits("add")
          visible.value = false
          break
        case "edit":
          await updatePositionApi(props.data)
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
  <el-dialog v-model="visible" :title="props.title" width="600px" destroy-on-close>
    <el-form ref="form" :model="props.data" label-width="80px" :rules="rules">
      <el-row>

        <el-col :span="12">
          <el-form-item label="岗位名称" prop="name">
            <el-input v-model="props.data.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位编码" prop="code">
            <el-input v-model="props.data.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位排序" prop="order">
            <el-input v-model="props.data.order" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位状态" prop="status">
            <el-radio-group v-model="props.data.status">
              <el-radio :value="'0'">正常</el-radio>
              <el-radio :value="'1'">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="props.data.remark"></el-input>
          </el-form-item>
        </el-col>


      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="() => visible = false">取消</el-button>
        <el-button type="primary" @click="confirm(form)">确定</el-button>
        <el-button type="primary" @click="resetForm(form)">重置</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
