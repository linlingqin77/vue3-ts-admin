<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
import { ElNotification } from "element-plus"
// 将 Element Plus 的语言设置为中文
import zhCn from "element-plus/es/locale/lang/zh-cn"
import { useAppStore } from "./store/modules/app";
const appStore = useAppStore()
const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()

/** 作者小心思 */
// ElNotification({
//   title: "Hello",
//   type: "success",
//   dangerouslyUseHTMLString: true,
//   message:
//     "<a style='color: teal' target='_blank' href='https://github.com/un-pany/v3-admin-vite'>小项目获取 star 不易，如果你喜欢这个项目的话，欢迎点击这里支持一个 star ！这是作者持续维护的唯一动力（小声：毕竟是免费的）</a>",
//   duration: 0,
//   position: "bottom-right"
// })
</script>

<template>
  <el-config-provider :locale="zhCn" :size="appStore.componentSize">
    <router-view />
  </el-config-provider>
</template>

<style lang="scss">
.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.h-40-middle {
  height: 40px;
  line-height: 40px;
  margin-left: 15px;
}

/*表单样式*/
.el-form.query,
.el-form.edit {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
    display: flex;
    flex-wrap: wrap;
    //overflow: hidden;
  }

  .el-form-item {
    display: flex;
    align-items: center;

    //margin-right: 15px !important;
    .el-form-item__label {
      overflow: hidden;
      //height: 36px;
      font-size: 13px;
      //text-align: center;
      //text-overflow: ellipsis;
      //white-space: nowrap;
      line-height: 1.3;
    }

    .el-form-item__content {
      flex: 1;
      margin-left: 0 !important;
      line-height: 40px !important;

      //height: 40px;
      .el-select {
        width: 100% !important;
      }

      .el-cascader {
        width: 100% !important;
      }

      .el-input-number {
        width: 100% !important;
      }

      .el-date-editor {
        width: 100% !important;
      }
    }

  }
}

.el-form.query {
  margin-bottom: 10px;
  overflow: auto;
  padding: 5px 5px 0;

  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
