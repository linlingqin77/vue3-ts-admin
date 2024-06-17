<script lang="ts" setup>
import { ref, watch, reactive, PropType, onMounted } from "vue"
import { ElForm, ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import * as Role from "@/api/system/roles/types"
import { IdialogTitle, IdialogType, IdialogData } from "../types"
import { addRoleApi, updateRoleApi } from "@/api/system/roles"
import { getMenusTreeApi } from "@/api/system/menus"


const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String as PropType<IdialogTitle>, default: "新增角色" },
  type: { type: String as PropType<IdialogType> },
  data: { type: Object as PropType<IdialogData>, default: () => { } }
})
const rules = reactive<FormRules<typeof formData>>({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
  order: [{ required: true, message: "请输入角色排序", trigger: "blur" }],
})
const visible = defineModel("visible", {
  type: Boolean,
  default: false
})
const treeStatus = ref<string[]>([]) // 菜单列表状态
const treeCheckStrictly = ref<boolean>(false) //父子联动
const treeExpand = ref<boolean>(false) //全选全不选
const emits = defineEmits(["add", "edit"])

const form = ref<FormInstance>()
const formData = ref(props.data)
const menusList = ref()
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const getmenusList = async () => {
  const res = await getMenusTreeApi({ all: 1 })
  menusList.value = res.data.list
}
// 菜单列表状态变化
const handleCheckedChange = () => {
  treeStatus.value.map(item => {
    if (item == '1') {
      treeExpand.value = !treeExpand.value
    } else if (item == '2') {
      treeCheckStrictly.value = !treeCheckStrictly.value
    } else if (item == '3') {
      treeExpand.value = false
    }
  })
  // console.log(val, '菜单列表状态变化');
}

// 选择树形节点
const treeHandleNodeClick = (val: string[]) => {

  console.log(val, '选择树形节点');
}

watch(() => props.data, (newVal) => {
  if (newVal) formData.value = { ...newVal }
})


onMounted(() => {
  getmenusList()
})

// 确定
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  let res = null
  formEl.validate(async (valid) => {
    if (valid) {
      switch (props.type) {
        case "add":
          res = await addRoleApi(formData.value)
          ElMessage.success(res.msg)
          emits("add")
          visible.value = false
          break
        case "edit":
          res = await updateRoleApi(formData.value)
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
    <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
      <el-row>

        <el-col :span="24">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限字符" prop="code">
            <el-input v-model="formData.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色排序" prop="order">
            <el-input v-model="formData.order" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :value="'0'">正常</el-radio>
              <el-radio :value="'1'">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单权限" prop="menus_ids">
            <div>
              <el-checkbox-group @change="handleCheckedChange" v-model="treeStatus">
                <el-checkbox label="展开/折叠" value="1" />
                <el-checkbox label="全选/全不选" value="2" />
                <el-checkbox label="父子联动" value="3" />
              </el-checkbox-group>
              <el-tree :data="menusList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="tree"
                show-checkbox @node-click="treeHandleNodeClick" :default-expand-all="treeExpand"
                :check-strictly="treeCheckStrictly" class="menu-tree-wrapper" />
            </div>
            <div>

            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="notes">
            <el-input v-model="formData.notes"></el-input>
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

<style lang="scss" scoped>
.menu-tree-wrapper {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #fff none;
  border-radius: 4px;
}
</style>
