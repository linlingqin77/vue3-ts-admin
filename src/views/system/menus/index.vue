<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import { getMenusTreeApi, deleteMenuApi, createMenuApi } from "@/api/system/menus"
import { CreateOrUpdateMenuRequestData } from "@/api/system/menus/types"
import AddUpdateDialog from "./components/add-update-dialog.vue"
import * as Menus from "@/api/system/menus/types"
import { ElMessage } from "element-plus"
const formData = reactive({
  name: "",
  status: ""
})
const dialogTitle = ref("")
const dialogData = ref<Menus.IMenus>()
const showAddUpdateDialog = ref(false)
const statusOptions = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
]

const tableData = ref<CreateOrUpdateMenuRequestData[]>([])

const getMenusTree = async () => {
  const res = await getMenusTreeApi()
  tableData.value = res.data
}

// 修改start
const editBtn = (val: Menus.IMenus) => {
  dialogTitle.value = "编辑菜单"
  dialogData.value = val
  showAddUpdateDialog.value = true
}
// 修改end

// 新增start
const addBtn = (val?: Menus.IMenus) => {
  dialogTitle.value = "新增菜单"
  dialogData.value = val
  showAddUpdateDialog.value = true
}
// 新增end

// 删除start
const deleteBtn = async (id: number) => {
  await deleteMenuApi(id)
  ElMessage({ message: "删除成功", type: "success" })
  await getMenusTree()
}
// 删除end
getMenusTree()
</script>

<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status" placeholder="Select" style="width: 240px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb-2">
        <el-col :span="1.5">
          <el-button type="primary" icon="Plus" @click="addBtn()">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" icon="Plus">展开/折叠</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" style="width: 100%" row-key="id" border :tree-props="{ children: 'children' }">
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="scope">
            <SvgIcon name="fullscreen-exit" />
          </template>
        </el-table-column>
        <el-table-column prop="order_num" label="排序" width="80" />
        <el-table-column prop="permission" label="权限标识" />
        <el-table-column prop="component" label="组件路径" />
        <el-table-column prop="status" label="状态" width="80" />
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="text" icon="edit" size="small" @click="editBtn(scope.row)">修改</el-button>
            <el-button type="text" icon="Plus" size="small" @click="addBtn(scope.row)">新增</el-button>
            <el-button type="text" icon="delete" size="small" @click="deleteBtn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <AddUpdateDialog v-model:visible="showAddUpdateDialog" :title="dialogTitle" :data="dialogData" />
  </div>
</template>

<style scoped>
.svg-icon {
  font-size: 20px;
  &:focus {
    outline: none;
  }
}
</style>
