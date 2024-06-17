<script lang="ts" setup>
import { ref, watch, PropType, reactive, nextTick } from "vue"
import { ElForm, ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import * as Menus from "@/api/system/menus/types"
import { IdialogProps } from "../types/index"
import { getMenusTreeApi, createMenuApi, updateMenuApi } from "@/api/system/menus"
import IconSelect from "@/components/IconSelect/index.vue"
const props = defineProps<IdialogProps>()
const rules = reactive<FormRules<typeof props.data>>({
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  order: [{ required: true, message: "请输入菜单排序", trigger: "blur" }],
  router_path: [{ required: true, message: "请输入菜单路由", trigger: "blur" }]
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
const menusList = ref<Menus.IMenus[]>([])
const getMenusTree = async () => {
  const res = await getMenusTreeApi({})
  menusList.value = res.data.list
}
getMenusTree()
// 确定
const confirm = async (formEl: FormInstance | undefined) => {

  if (!formEl) return
  let res = null
  formEl.validate(async (valid) => {
    if (valid) {
      switch (props.type) {
        case "add":
          res = await createMenuApi(props.data)
          ElMessage.success(res.msg)
          emits("add")
          visible.value = false
          break
        case "edit":
          res = await updateMenuApi(props.data)
          ElMessage.success(res.msg)
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
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parent_id">
            <el-tree-select v-model="props.data.parent_id" :data="menusList" :render-after-expand="false"
              style="width: 240px" :props="{ label: 'name', value: 'id' }" node-key="id" :check-strictly="true" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="props.data.type">
              <el-radio :value="'1'">目录</el-radio>
              <el-radio :value="'2'">菜单</el-radio>
              <el-radio :value="'3'">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="props.data.type === '1' || props.data.type === '2'">
          <el-form-item label="菜单图标" prop="icon">
            <IconSelect v-model="props.data.icon" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="props.data.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="order">
            <el-input v-model="props.data.order" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="props.data.type === '1' || props.data.type === '2'">
          <el-form-item label="是否外链" prop="is_frame">
            <el-radio-group v-model="props.data.is_frame">
              <el-radio :value="'0'">是</el-radio>
              <el-radio :value="'1'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="props.data.type === '1' || props.data.type === '2'">
          <el-form-item label="路由地址" prop="router_path">
            <el-input v-model="props.data.router_path"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="props.data.type === '2'">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="props.data.component"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="props.data.type === '2' || props.data.type === '3'">
          <el-form-item label="权限字符" prop="permission">
            <el-input v-model="props.data.permission"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="props.data.type === '2'">
          <el-form-item label="路由参数" prop="router_params">
            <el-input v-model="props.data.router_params"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="props.data.type === '2'">
          <el-form-item label="是否缓存" prop="is_cache">
            <el-radio-group v-model="props.data.is_cache">
              <el-radio :value="'0'">是</el-radio>
              <el-radio :value="'1'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="props.data.type === '1' || props.data.type === '2'">
          <el-form-item label="显示状态" prop="visible">
            <el-radio-group v-model="props.data.visible">
              <el-radio :value="'0'">显示</el-radio>
              <el-radio :value="'1'">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单状态" prop="status">
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
