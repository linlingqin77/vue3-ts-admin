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
  status: "",
  page:1,
  pageSize:10,
  total:400
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

// 表格展开收缩
const expandBtn = () => {
  isTableExpand.value = !isTableExpand.value
  tableRef.value?.store.states.expandRows.value.forEach((row: any) => {
    tableRef.value?.toggleRowExpansion(row)
  })
  console.log(isTableExpand.value, "isTableExpand")
}
// 分页
const handlePageSizeChange=async(val:number)=>{
  formData.pageSize=val
 await getMenusTree()
}
const handleCurrentChange=async(val:number)=>{
  formData.page=val
  await getMenusTree()
}



// 查询表单显示隐藏
const isShowSearchForm = ref<boolean>(true)

// 获取数据
const tableLoad = ref<boolean>(false)
const getMenusTree = async () => {
  try {
    tableLoad.value = true
    const res = await getMenusTreeApi({ ...formData })
    tableData.value = res.data.list
    formData.total=res.data.total
    tableLoad.value = false
  } catch (error) {
    tableLoad.value = false
  }
}
getMenusTree()

// 修改start
const editBtn = (val: Menus.IMenus) => {
  dialogTitle.value = "编辑菜单"
  dialogData.value = val
  dialogType.value = "edit"
  showAddUpdateDialog.value = true
}

// 新增菜单
const addBtn = (val?: Menus.IMenus) => {
  dialogTitle.value = "新增菜单"
  dialogData.value = val
  dialogType.value = "add"
  showAddUpdateDialog.value = true
}
// 新增子菜单
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

// 删除
const deleteBtn = async (id: number) => {
  await deleteMenuApi(id)
  ElMessage({ message: "删除成功", type: "success" })
  await getMenusTree()
}
// 搜索按钮
const searchBtn = async () => {
  formData.page=1
  await getMenusTree()
  console.log("submit!")
}
// 重置按钮
const resetSearch = async () => {
  formData.name = ""
  formData.status = ""
  await getMenusTree()
}
</script>

<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="formData" class="demo-form-inline" v-show="isShowSearchForm">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status" placeholder="Select" style="width: 240px" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb-2" flex="justify-between">
        <div class="flex justify-between">
          <el-button type="primary" icon="Plus" @click="addBtn()">新增</el-button>
          <el-button type="primary" icon="Plus" @click="expandBtn()">展开/折叠</el-button>
        </div>
        <div class="flex justify-between">
          <el-button icon="Search" circle @click="isShowSearchForm = !isShowSearchForm" />
          <el-button icon="Refresh" circle @click="getMenusTree" />
        </div>
      </el-row>
<!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" row-key="id" border :tree-props="{ children: 'children' }"
        :default-expand-all="isTableExpand" ref="tableRef" v-loading="tableLoad">
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column prop="icon" label="图标" width="100" align="center">
          <template #default="scope">
            <SvgIcon name="fullscreen-exit" />
          </template>
        </el-table-column>
        <el-table-column prop="order" label="排序" width="80" align="center" />
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
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="text" icon="edit" size="small" @click="editBtn(scope.row)">修改</el-button>
            <el-button type="text" icon="Plus" size="small" @click="addChildrenBtn(scope.row)">新增</el-button>
            <el-button type="text" icon="delete" size="small" @click="deleteBtn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
<!-- 分页 -->
<el-row flex="justify-end" style="margin-top: 20px">
  <el-pagination
      v-model:current-page="formData.page"
      v-model:page-size="formData.pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="formData.total"
      :background="true"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentChange"
    />
</el-row>
   
    </el-card>

    <AddUpdateDialog v-model:visible="showAddUpdateDialog" :title="dialogTitle" :data="dialogData" :type="dialogType"
      @add="getMenusTree" @edit="getMenusTree" />
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
