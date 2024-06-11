<script lang="ts" setup>
import { ref, reactive, unref } from "vue"
import { getUserListApi, deleteUserApi, updateUserApi } from "@/api/system/users"
import { getDepartmentDataApi } from "@/api/system/departments"
import AddUpdateDialog from "./components/add-update-dialog.vue"
import * as User from '@/api/system/users/types'
import * as Department from '@/api/system/departments/types'
import { IdialogProps, IdialogTitle, IdialogType, IdialogData } from "./types/index"
import { ElMessage, TableInstance, ClickOutside as vClickOutside } from "element-plus"

interface searchFormDataType extends Partial<User.IUser> {
  time: string[],
  page: number,
  pageSize: number,
  total: number
}
const searchFormData = reactive<searchFormDataType>({
  time: [],
  nickname: "",
  status: "",
  phone: "",
  page: 1,
  pageSize: 10,
  total: 0
})
const dialogTitle = ref<IdialogTitle>("新增用户")
const dialogData = ref<IdialogData>()
const dialogType = ref<IdialogType>("add")
const showAddUpdateDialog = ref(false)
const statusOptions = [
  { label: "正常", value: 0 },
  { label: "停用", value: 1 }
]

const tableData = ref<User.IUser[]>([])
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
  await getUserList()
  console.log(val, "val");

}
const handleCurrentChange = async (val: number) => {
  searchFormData.page = val
  await getUserList()
  console.log(val, "val");
}

// 查询表单显示隐藏
const isShowSearchForm = ref<boolean>(true)

// 获取数据
const tableLoad = ref<boolean>(false)
const getUserList = async () => {
  try {
    const data = {
      nickname: searchFormData.nickname,
      status: searchFormData.status,
      phone: searchFormData.phone,
      page: searchFormData.page,
      pageSize: searchFormData.pageSize,
      start_time: searchFormData.time[0] ?? '',
      end_time: searchFormData.time[0] ?? '',
    }

    tableLoad.value = true
    const res = await getUserListApi(data)
    tableLoad.value = false
    searchFormData.total = res.data.total
    console.log(res, 'res');
    tableData.value = res.data.list
  } catch (error) {
    tableLoad.value = false
  }

}


// 修改start
const editBtn = (val: User.IUser) => {
  dialogTitle.value = "编辑用户"
  dialogData.value = val
  dialogType.value = "edit"
  showAddUpdateDialog.value = true
}

// 新增用户
const addBtn = (val?: User.IUser) => {
  dialogTitle.value = "新增用户"
  dialogData.value = val
  dialogType.value = "add"
  showAddUpdateDialog.value = true
}
// 新增子用户
const addChildrenBtn = (val: User.IUser) => {
  dialogTitle.value = "新增用户"
  // dialogData.value = {
  //   // id: 0,
  // }
  dialogType.value = "add"
  showAddUpdateDialog.value = true
}

// 删除
const deleteBtn = async (id: number) => {
  await deleteUserApi(id)
  ElMessage({ message: "删除成功", type: "success" })
  await getUserList()
}
// 搜索按钮
const searchBtn = async () => {
  searchFormData.page = 1
  await getUserList()
  console.log("submit!")
}
// 重置按钮
const resetSearch = async () => {
  searchFormData.nickname = ""
  searchFormData.phone = ""
  await getUserList()
  console.log("reset!")
}
// 表格列筛选
const tableColumns = ref([
  { label: "用户编号", prop: "id", key: "id", visible: true, align: "center" },
  { label: "用户名称", prop: "username", key: "username", visible: true, align: "center" },
  { label: "部门", prop: "department_name", key: "department_name", visible: true, align: "center" },
  { label: "手机号", prop: "phone", key: 'phone', visible: true, align: "center" },
  { label: "状态", prop: "status", key: 'slot', visible: true, align: "center" },
  { label: "创建时间", prop: "create_time", key: 'create_time', visible: true, align: "center" }])
const tableColumnsRef = ref()
const tableColumnsPopoverRef = ref()
const tableColumnsValue = ref(['name', 'order', 'status', 'create_time'])
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
getUserList()

// 更新用戶狀態
const changeUserStatus = async (row: User.IUser, val: any) => {
  try {
    console.log(val, 'val;');
    const newrows = { ...row }
    newrows.status = val
    const res = await updateUserApi(newrows)
    ElMessage.success(res.msg)
  } catch (error: any) {
    ElMessage({ type: 'error', message: error })
  }
}


// 部门树形-----------------
const treeHandleNodeClick = (data: Department.GetDepartmentResponseData) => {
  console.log(data)
}

const treeData = ref<Department.DepartmentResponseData[]>()
// 获取树形数据
const getTreeData = async () => {
  const res = await getDepartmentDataApi({ all: 1 })
  treeData.value = res.data.list
}
const treeDefaultProps = {
  children: 'children',
  label: 'name',
}
getTreeData()

</script>

<template>
  <el-card>
    <el-row>
      <el-col :span="4">
        <el-tree :data="treeData" :props="treeDefaultProps" @node-click="treeHandleNodeClick"
          :default-expand-all="true" />
      </el-col>
      <el-col :span="20">
        <el-form :model="searchFormData" class="demo-form-inline" label-width="auto" v-show="isShowSearchForm">
          <el-row align="middle" :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4.8">
              <el-form-item label="用户名称" prop="nickname">
                <el-input v-model="searchFormData.nickname" placeholder="请输入用户名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4.8">
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="searchFormData.phone" placeholder="请输入手机号码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4.8">
              <el-form-item label="状态" prop="status">
                <el-select v-model="searchFormData.status" placeholder="用户状态" clearable>
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4.8">
              <el-form-item label="创建时间" prop="create_time">
                <el-date-picker v-model="searchFormData.time" type="daterange" start-placeholder="开始时间"
                  end-placeholder="结束时间" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4.8">
              <el-form-item>
                <el-button type="primary" @click="searchBtn">搜索</el-button>
                <el-button type="primary" @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row flex="justify-between" style="margin-bottom: 10px;">
          <div class="flex justify-between">
            <el-button type="primary" plain icon="Plus" @click="addBtn()">新增</el-button>
            <!-- <el-button type="info" plain icon="Plus" @click="expandBtn()">展开/折叠</el-button> -->
          </div>
          <div class="flex justify-between">
            <el-button icon="Search" circle @click="isShowSearchForm = !isShowSearchForm" />
            <el-button icon="Refresh" circle @click="getUserList" />
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
              :align="item.align">
            </el-table-column>


            <el-table-column :prop="item.prop" :label="item.label"
              v-if="item.key == 'slot' && item.prop == 'status' && item.visible" :align="item.align">
              <template #default="scope">
                <!-- <el-tag :type="scope.row.status == '0' ? 'success' : 'danger'">{{
                  scope.row.status == '0' ? "正常" : "停用"
                }}</el-tag> -->

                <el-switch v-model="scope.row.status" class="ml-2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                  @change="changeUserStatus(scope.row, $event)" active-value="0" inactive-value="1" />
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
            :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper"
            :total="searchFormData.total" :background="true" @size-change="handlePageSizeChange"
            @current-change="handleCurrentChange" />
        </el-row>

        <AddUpdateDialog v-model:visible="showAddUpdateDialog" :title="dialogTitle" :data="dialogData"
          :type="dialogType" @add="getUserList" @edit="getUserList" />
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.svg-icon {
  font-size: 20px;

  &:focus {
    outline: none;
  }
}
</style>
