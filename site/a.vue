<script setup>
import { ref } from 'vue';

const { Chart } = Util.G2;
const msg = ref('我是默认定制卡片模板');
const createId = () => {
    return Math.random().toString(36).substr(2);
};
const domId = ref();
// 给chart 使用
domId.value = createId();
setTimeout(() => {
    // 编写chart脚本

}, 1000);
</script>
<template>
    <h1 class='h2'>{{ msg }}</h1>
</template>
<style scoped lang="less">
.h2 {
    color: red
}
</style>

