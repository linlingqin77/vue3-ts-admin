<script lang="ts" setup>
import { ref, reactive, unref } from "vue"
import { getDepartmentDataApi, deleteDepartmentApi } from "@/api/system/departments"
import AddUpdateDialog from "./components/add-update-dialog.vue"
import * as Department from '@/api/system/departments/types'
import { IdialogProps, IdialogTitle, IdialogType, IdialogData } from "./types/index"
import { ElMessage, TableInstance, ClickOutside as vClickOutside } from "element-plus"

const searchFormData = reactive({
  name: "",
  status: "",
  page: 1,
  pageSize: 10,
  total: 0
})
const dialogTitle = ref<IdialogTitle>("新增部门")
const dialogData = ref<IdialogData>()
const dialogType = ref<IdialogType>("add")
const showAddUpdateDialog = ref(false)
const statusOptions = [
  { label: "正常", value: 0 },
  { label: "停用", value: 1 }
]

const tableData = ref<Department.DepartmentResponseData[]>([])
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
  await getDepartmentsTree()
  console.log(val, "val");

}
const handleCurrentChange = async (val: number) => {
  searchFormData.page = val
  await getDepartmentsTree()
  console.log(val, "val");
}

// 查询表单显示隐藏
const isShowSearchForm = ref<boolean>(true)

// 获取数据
const tableLoad = ref<boolean>(false)
const getDepartmentsTree = async () => {
  try {
    tableLoad.value = true
    const res = await getDepartmentDataApi(searchFormData)
    tableLoad.value = false
    searchFormData.total = res.data.total
    console.log(res, 'res');
    tableData.value = res.data.list
  } catch (error) {
    tableLoad.value = false
  }

}


// 修改start
const editBtn = (val: Department.IDepartment) => {
  dialogTitle.value = "编辑部门"
  dialogData.value = val
  dialogType.value = "edit"
  showAddUpdateDialog.value = true
}

// 新增部门
const addBtn = (val?: Department.IDepartment) => {
  dialogTitle.value = "新增部门"
  dialogData.value = val
  dialogType.value = "add"
  showAddUpdateDialog.value = true
}
// 新增子部门
const addChildrenBtn = (val: Department.UpdateDepartmentRequestData) => {
  dialogTitle.value = "新增部门"
  dialogData.value = {
    id: 0,
    phone: "",
    name: "",
    order: 0,
    leader: "",
    parent_id: val.id || 0,
    status: "0",
    email: ""
  }
  dialogType.value = "add"
  showAddUpdateDialog.value = true
}

// 删除
const deleteBtn = async (id: number) => {
  await deleteDepartmentApi(id)
  ElMessage({ message: "删除成功", type: "success" })
  await getDepartmentsTree()
}
// 搜索按钮
const searchBtn = async () => {
  searchFormData.page = 1
  await getDepartmentsTree()
  console.log("submit!")
}
// 重置按钮
const resetSearch = async () => {
  searchFormData.name = ""
  searchFormData.status = ""
  await getDepartmentsTree()
  console.log("reset!")
}
// 表格列筛选
const tableColumns = ref([
  { label: "部门名称", prop: "name", key: "name", visible: true, align: "left" },
  { label: "排序", prop: "order", key: "order", visible: true, align: "center" },
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
getDepartmentsTree()



interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

const defaultProps = {
  children: 'children',
  label: 'label',
}

</script>

<template>
  <el-card>
    <el-row>
      <el-col :span="4">
        <el-tree style="max-width: 600px" :data="data" :props="defaultProps" @node-click="handleNodeClick" />
      </el-col>
      <el-col :span="20">
        <el-form :model="searchFormData" class="demo-form-inline" label-width="auto" v-show="isShowSearchForm">
          <el-row align="middle">
            <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <el-form-item label="部门名称" prop="name">
                <el-input v-model="searchFormData.name" placeholder="请输入部门名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
              <el-form-item label="状态">
                <el-select v-model="searchFormData.status" placeholder="部门状态" clearable>
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
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
            <el-button icon="Refresh" circle @click="getDepartmentsTree" />
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
            :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper"
            :total="searchFormData.total" :background="true" @size-change="handlePageSizeChange"
            @current-change="handleCurrentChange" />
        </el-row>


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
