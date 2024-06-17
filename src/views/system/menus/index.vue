<script lang="ts" setup>
import { ref, reactive, unref, nextTick } from "vue"
import { getMenusTreeApi, deleteMenuApi, createMenuApi } from "@/api/system/menus"
import { CreateOrUpdateMenuRequestData } from "@/api/system/menus/types"
import AddUpdateDialog from "./components/add-update-dialog.vue"
import * as Menus from "@/api/system/menus/types"
import { IdialogProps, IdialogTitle, IdialogType, IdialogData } from "./types/index"
import { ElMessage, TableInstance, ClickOutside as vClickOutside } from "element-plus"

const searchFormData = reactive({
  name: "",
  status: "",
  page: 1,
  pageSize: 10,
  total: 0
})
const dialogTitle = ref<IdialogTitle>("新增菜单")
const dialogData = ref<IdialogData>({
  name: "",
  order: 0,
  parent_id: 0,
  type: "1",
  icon: "",
  component: "",
  router_path: "",
  router_params: "",
  create_by: "",
  permission: "",
  is_frame: "0",
  is_cache: "0",
  visible: "0",
  status: "0"
})
const dialogType = ref<IdialogType>("add")
const showAddUpdateDialog = ref(false)
const statusOptions = [
  { label: "正常", value: 0 },
  { label: "体验", value: 1 }
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
// 分页
const handlePageSizeChange = async (val: number) => {
  searchFormData.pageSize = val
  await getMenusTree()
  console.log(val, "val");

}
const handleCurrentChange = async (val: number) => {
  searchFormData.page = val
  await getMenusTree()
  console.log(val, "val");
}

// 查询表单显示隐藏
const isShowSearchForm = ref<boolean>(true)

// 获取数据
const tableLoad = ref<boolean>(false)
const getMenusTree = async () => {
  try {
    tableLoad.value = true
    const res = await getMenusTreeApi(searchFormData)
    tableLoad.value = false
    searchFormData.total = res.data.total
    console.log(res, 'res');
    tableData.value = res.data.list
  } catch (error) {
    tableLoad.value = false
  }

}


// 修改start
const editBtn = (val: Menus.IMenus) => {
  dialogTitle.value = "编辑菜单"
  // dialogData.value = val
  dialogType.value = "edit"
  showAddUpdateDialog.value = true
  nextTick(() => {
    dialogData.value = Object.assign(dialogData.value, val)
  })
}

// 新增菜单
const addBtn = (val?: Menus.IMenus) => {
  dialogTitle.value = "新增菜单"
  // dialogData.value = val
  dialogType.value = "add"
  showAddUpdateDialog.value = true
  nextTick(() => {
    dialogData.value = Object.assign(dialogData.value, {
      name: "",
      order: 0,
      parent_id: 0,
      type: "1",
      icon: "",
      component: "/aaa.vue",
      router_path: "/a/b/c",
      router_params: "",
      create_by: "",
      permission: "perms-1",
      is_frame: "0",
      is_cache: "0",
      visible: "0",
      status: "0"
    })
  })
}
// 新增子菜单
const addChildrenBtn = (val: Menus.CreateOrUpdateMenuRequestData) => {
  dialogTitle.value = "新增菜单"
  dialogData.value = {
    name: "",
    order: 0,
    parent_id: val.id || 0,
    type: "1",
    icon: "",
    component: "",
    router_path: "",
    router_params: "",
    create_by: "",
    permission: "",
    is_frame: "0",
    is_cache: "0",
    visible: "0",
    status: "0"
  }
  dialogType.value = "add"
  showAddUpdateDialog.value = true
}

// 删除
const deleteBtn = async (id: number) => {
 const res= await deleteMenuApi(id)
  ElMessage({ message: res.msg, type: "success" })
  await getMenusTree()
}
// 搜索按钮
const searchBtn = async () => {
  searchFormData.page = 1
  await getMenusTree()
  console.log("submit!")
}
// 重置按钮
const resetSearch = async () => {
  searchFormData.name = ""
  searchFormData.status = ""
  await getMenusTree()
  console.log("reset!")
}
// 表格列筛选
const tableColumns = ref([
  { label: "菜单名称", prop: "name", key: "name", visible: true, align: "left" },
  { label: "图标", prop: "icon", key: 'slot', visible: true, align: "center" },
  { label: "排序", prop: "order", key: "order", visible: true, align: "center" },
  { label: "类型", prop: "type", key: 'slot', visible: true, align: "center" },
  { label: "权限标识", prop: "permission", key: 'permission', visible: true, align: "center" },
  { label: "组件路径", prop: "component", key: 'component', visible: true, align: "center" },
  { label: "状态", prop: "status", key: 'slot', visible: true, align: "center" },
  { label: "创建时间", prop: "create_time", key: 'create_time', visible: true, align: "center" }])
const tableColumnsRef = ref()
const tableColumnsPopoverRef = ref()
const tableColumnsValue = ref(['name', 'icon', 'order', 'type', 'permission', 'component', 'status', 'create_time'])
const tableColumnsDataChange = () => {
  tableColumns.value.forEach((val: any) => {
    if (tableColumnsValue.value.includes(val.prop)) {
      val.visible = true
    } else {
      val.visible = false
    }
  })
}
const showTableColumns = () => {
  unref(tableColumnsPopoverRef).popperRef?.delayHide?.()
}
getMenusTree()



</script>

<template>
  <div class="app-container">
    <el-card>
      <el-form :model="searchFormData" class="demo-form-inline" label-width="auto" v-show="isShowSearchForm">
        <el-row align="middle">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4.8">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="searchFormData.name" placeholder="请输入菜单名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4.8">
            <el-form-item label="状态">
              <el-select v-model="searchFormData.status" placeholder="菜单状态" clearable>
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4.8">
            <el-form-item style="margin-left: 30px">
              <el-button type="primary" @click="searchBtn">搜索</el-button>
              <el-button type="primary" @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row flex="justify-between" style="margin-bottom: 10px;">
        <div class="flex justify-between">
          <el-button type="primary" plain icon="Plus" @click="addBtn()">新增</el-button>
          <el-button type="info" plain icon="Plus" @click="expandBtn()">展开/折叠</el-button>
        </div>
        <div class="flex justify-between">
          <el-button icon="Search" circle @click="isShowSearchForm = !isShowSearchForm" />
          <el-button icon="Refresh" circle @click="getMenusTree" />
          <el-tooltip class="item" effect="dark" content="显隐列" placement="top">
            <el-button circle icon="Menu" ref="tableColumnsRef" v-click-outside="showTableColumns" />
          </el-tooltip>
          <el-popover ref="tableColumnsPopoverRef" :virtual-ref="tableColumnsRef" trigger="click" virtual-triggering
            placement="bottom" width="100px">
            <el-checkbox-group @change="tableColumnsDataChange" v-model="tableColumnsValue">
              <el-checkbox v-for="item in tableColumns" :label="item.label" :value="item.prop"></el-checkbox>
            </el-checkbox-group>
          </el-popover>
        </div>
      </el-row>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" row-key="id" border :tree-props="{ children: 'children' }"
        :default-expand-all="isTableExpand" ref="tableRef" v-loading="tableLoad">
        <template v-for="item in tableColumns">
          <el-table-column :prop="item.prop" :label="item.label" v-if="item.key !== 'slot' && item.visible"
            :align="item.align"></el-table-column>
          <el-table-column :prop="item.prop" :label="item.label"
            v-if="item.key == 'slot' && item.prop == 'icon' && item.visible" :align="item.align">
            <template #default="scope">
              <SvgIcon :name="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column :prop="item.prop" :label="item.label"
            v-if="item.key == 'slot' && item.prop == 'type' && item.visible" :align="item.align">
            <template #default="scope">
              <el-tag type="primary">{{ scope.row.type == 1 ? "目录" : scope.row.type == 2 ? "菜单" : "按钮" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :prop="item.prop" :label="item.label"
            v-if="item.key == 'slot' && item.prop == 'status' && item.visible" :align="item.align">
            <template #default="scope">
              <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{
                scope.row.status == 0 ? "正常" : "停用"
              }}</el-tag>
            </template>
          </el-table-column>

        </template>
        <el-table-column label="操作" align="center" width="300px">
          <template #default="scope">
            <el-button :text="true" icon="edit" type="primary" size="small" @click="editBtn(scope.row)">修改</el-button>
            <el-button :text="true" icon="Plus" type="primary" size="small"
              @click="addChildrenBtn(scope.row)">新增</el-button>
            <el-button :text="true" icon="delete" type="primary" size="small"
              @click="deleteBtn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row flex="justify-end" style="margin-top: 20px">
        <el-pagination v-model:current-page="searchFormData.page" v-model:page-size="searchFormData.pageSize"
          :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="searchFormData.total"
          :background="true" @size-change="handlePageSizeChange" @current-change="handleCurrentChange" />
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
