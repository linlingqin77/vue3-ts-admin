<script lang="ts" setup>
import { ref, onMounted, watch, PropType, reactive } from "vue"
import { ElForm, ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import * as Menus from "@/api/system/menus/types"
import { getMenusTreeApi, createMenuApi } from "@/api/system/menus"
import IconSelect from "@/components/IconSelect/index.vue"
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "新增菜单" },
  type: { type: String, default: "add" },
  data: { type: Object as PropType<Menus.IMenus>, default: () => {} }
})
const form = ref<FormInstance>()
const rules = reactive<FormRules<typeof formData>>({
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  order: [{ required: true, message: "请输入菜单排序", trigger: "blur" }],
  router_path: [{ required: true, message: "请输入菜单路由", trigger: "blur" }]
})
const visible = defineModel("visible", {
  type: Boolean,
  default: false
})
const formData = ref({
  name: "",
  order: 0,
  parent_id: 0,
  type: 1,
  icon: "",
  component: "/aaa.vue",
  router_path: "/a/b/c",
  router_params: "",
  create_by: "",
  permission: "perms-1",
  is_frame: 1,
  is_cache: 0,
  visible: 0,
  status: 1
})

const menusList = ref<Menus.IMenus[]>([])
const getMenusTree = async () => {
  const res = await getMenusTreeApi()
  menusList.value = res.data
}
getMenusTree()

watch(
  () => props.data,
  (newVal, oldVal) => {
    if (newVal) {
      formData.value = { ...newVal }
    }
  }
)

// 确定
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log("确定")
      // emits("update:visible", false)
      await createMenuApi(formData.value)
      ElMessage.success("新增成功")
      visible.value = false
    } else {
    }
  })
}
</script>

<template>
  <el-dialog v-model="visible" :title="props.title" ref="form" width="600px">
    <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parent_id">
            <el-tree-select
              v-model="formData.parent_id"
              :data="menusList"
              :render-after-expand="false"
              style="width: 240px"
              :props="{ label: 'name', value: 'id' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="formData.type">
              <el-radio :value="1">目录</el-radio>
              <el-radio :value="2">菜单</el-radio>
              <el-radio :value="3">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="formData.type === 1 || formData.type === 2">
          <el-form-item label="菜单图标" prop="icon">
            <IconSelect v-model="formData.icon" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="order">
            <el-input v-model="formData.order"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type === 1 || formData.type === 2">
          <el-form-item label="是否外链" prop="is_frame">
            <el-radio-group v-model="formData.is_frame">
              <el-radio :value="0">否</el-radio>
              <el-radio :value="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type === 1 || formData.type === 2">
          <el-form-item label="路由地址" prop="router_path">
            <el-input v-model="formData.router_path"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type === 2">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="formData.component"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type === 2 || formData.type === 3">
          <el-form-item label="权限字符" prop="permission">
            <el-input v-model="formData.permission"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type === 2">
          <el-form-item label="路由参数" prop="router_params">
            <el-input v-model="formData.router_params"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type === 2">
          <el-form-item label="是否缓存" prop="is_cache">
            <el-radio-group v-model="formData.is_cache">
              <el-radio :value="0">否</el-radio>
              <el-radio :value="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.type === 1 || formData.type === 2">
          <el-form-item label="显示状态" prop="visible">
            <el-radio-group v-model="formData.visible">
              <el-radio :value="0">显示</el-radio>
              <el-radio :value="1">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :value="0">正常</el-radio>
              <el-radio :value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="confirm">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
