<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue"
import { getMenusTreeApi, deleteMenuApi, createMenuApi } from "@/api/system/menus"
import { CreateOrUpdateMenuRequestData } from "@/api/system/menus/types"
import AddUpdateDialog from "./components/add-update-dialog.vue"
import * as Menus from "@/api/system/menus/types"
import { IdialogProps, IdialogTitle, IdialogType, IdialogData } from "./types/index"
import { ElMessage, TableInstance } from "element-plus"
const formData = reactive({
  name: "",
  status: ""
})
const dialogTitle = ref<IdialogTitle>("新增菜单")
const dialogData = ref<IdialogData>()
const dialogType = ref<IdialogType>("add")
const showAddUpdateDialog = ref(false)
const statusOptions = [
  { label: "启用", value: 1 },
  { label: "禁用", value: 0 }
]

const tableData = ref<CreateOrUpdateMenuRequestData[]>([])
const tableRef = ref<TableInstance>()
const isTableExpand = ref<boolean>(true) //是否展开

// 展开 收缩
const expandBtn = () => {
  isTableExpand.value = !isTableExpand.value
  tableRef.value?.store.states.expandRows.value.forEach((row: any) => {
    tableRef.value?.toggleRowExpansion(row)
  })
  console.log(isTableExpand.value, "isTableExpand")
}
const getMenusTree = async () => {
  const res = await getMenusTreeApi()
  tableData.value = res.data
}

// 修改start
const editBtn = (val: Menus.IMenus) => {
  dialogTitle.value = "编辑菜单"
  dialogData.value = val
  dialogType.value = "edit"
  showAddUpdateDialog.value = true
}

// 新增start
const addBtn = (val?: Menus.IMenus) => {
  dialogTitle.value = "新增菜单"
  dialogData.value = val
  dialogType.value = "add"
  showAddUpdateDialog.value = true
}

const addChildrenBtn = (val: Menus.CreateOrUpdateMenuRequestData) => {
  dialogTitle.value = "新增菜单"
  dialogData.value = {
    name: "",
    order: 0,
    parent_id: val.id as number,
    type: 1,
    icon: "",
    component: "",
    router_path: "",
    router_params: "",
    create_by: "",
    permission: "",
    is_frame: 0,
    is_cache: 0,
    visible: 0,
    status: 0
  }
  dialogType.value = "add"
  showAddUpdateDialog.value = true
}

// 删除start
const deleteBtn = async (id: number) => {
  await deleteMenuApi(id)
  ElMessage({ message: "删除成功", type: "success" })
  await getMenusTree()
}

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
          <el-button type="primary" icon="Plus" @click="expandBtn()">展开/折叠</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
        border
        :tree-props="{ children: 'children' }"
        :default-expand-all="isTableExpand"
        ref="tableRef"
      >
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column prop="icon" label="图标" width="100" align="center">
          <template #default="scope">
            <SvgIcon name="fullscreen-exit" />
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" width="80" align="center" />
        <el-table-column prop="type" label="类型" width="80" align="center">
          <template #default="scope">
            <el-tag type="primary">{{ scope.row.type === 1 ? "目录" : scope.row.type === 2 ? "菜单" : "按钮" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="权限标识" align="center" />
        <el-table-column prop="component" label="组件路径" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">{{
              scope.row.status === 0 ? "启用" : "禁用"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="300px">
          <template #default="scope">
            <el-button type="text" icon="edit" size="small" @click="editBtn(scope.row)">修改</el-button>
            <el-button type="text" icon="Plus" size="small" @click="addChildrenBtn(scope.row)">新增</el-button>
            <el-button type="text" icon="delete" size="small" @click="deleteBtn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <AddUpdateDialog
      v-model:visible="showAddUpdateDialog"
      :title="dialogTitle"
      :data="dialogData"
      :type="dialogType"
      @add="getMenusTree"
      @edit="getMenusTree"
    />
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
