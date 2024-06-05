<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
const AppStore = useAppStore()
const changeSize = (command: string) => {
    console.log(command, 'command');
    if (command === 'default') {
        AppStore.toggleComponentSize(command)
    } else if (command === 'small') {
        AppStore.toggleComponentSize(command)
    } else if (command === 'large') {
        AppStore.toggleComponentSize(command)
    }
}

</script>

<template>
    <div class="toggleSize">
        <el-dropdown trigger="click" @command="changeSize">
            <div style="height: 20px">
                <el-tooltip effect="dark" content="切换大小">
                    <SvgIcon name="characters" />
                </el-tooltip>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="default"
                        :disabled="AppStore.componentSize === 'default'">default</el-dropdown-item>
                    <el-dropdown-item command="large"
                        :disabled="AppStore.componentSize === 'large'">large</el-dropdown-item>
                    <el-dropdown-item command="small"
                        :disabled="AppStore.componentSize === 'small'">small</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>

</template>

<style lang="scss" scoped>
.svg-icon {
    font-size: 20px;

    &:focus {
        outline: none;
    }
}
</style>
