<template>
    <div>
      home.vue
      <el-button type="" @click="exit">退出</el-button>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {

        };
    },
    methods: {
      exit(){
        window.sessionStorage.clear();
        this.$router.push('/login')
        this.$message.warning("已退出")
      }
    },
    components: {

    },
};
</script>

<style scoped lang="less">

</style>
