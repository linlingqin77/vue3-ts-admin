<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { ElForm } from "element-plus"
import * as Menus from "@/api/system/menus/types"
import { getMenusTreeApi } from "@/api/system/menus"
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "新增菜单" },
  type: { type: String, default: "add" },
  data: { type: Object, default: () => {} }
})
const emits = defineEmits(["update:visible"])
const formData = ref<Menus.IMenus>({
  name: "菜单2-1-1",
  order: 0,
  parent_id: 0,
  type: null,
  icon: null,
  component: "/aaa.vue",
  path: "/a/b/c",
  create_by: null,
  permission: null,
  is_frame: "1",
  is_cache: "0",
  visible: "0",
  create_time: "2024-05-23T06:44:01.945Z",
  update_time: "2024-05-23T06:44:01.945Z"
})

const menusList = ref<Menus.IMenus[]>([])

const menusList1 = [
  {
    name: "一级菜单",
    id: 0,
    children: [
      {
        name: "二级菜单",
        id: 1
      }
    ]
  }
]

const getMenusTree = async () => {
  const res = await getMenusTreeApi()
  menusList.value = res.data
}
getMenusTree()

// 确定
const confirm = () => {
  console.log("确定")
  emits("update:visible", false)
}
</script>

<template>
  <el-dialog v-model="props.visible" :title="props.title" ref="form">
    <el-form ref="form" :model="formData" label-width="80px">
      <el-form-item label="上级菜单" prop="parent_id">
        <treeselect
          v-model="formData.parent_id"
          :options=""
          :normalizer=""
          :show-count="true"
          placeholder="选择上级菜单"
        />
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-input v-model="formData.type" />
      </el-form-item>
      <el-form-item label="菜单图标"> </el-form-item>
      <el-form-item label="菜单名称"> </el-form-item>
      <el-form-item label="显示排序"> </el-form-item>
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
