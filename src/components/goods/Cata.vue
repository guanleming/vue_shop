<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCataDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <!--  操作 -->
        <template slot="opt" >
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 10, 50]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" 
    :visible.sync="addCateDialogVisible" 
    width="50%"
    @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateFrom"
        :rules="addCateFromRules"
        ref="addCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" >
          <!-- options 用来指定数据源 -->
           <!-- props 用来指定配置对象 -->
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged" 
            clearable 
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    //查询条件
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品名分类的值 默认为控
      cateList: [],
      // 中数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: "商品名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //表示 将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          //表示 将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          //表示 将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "opt",
        },
      ],

      // 控制添加对话框的显示与隐藏
      addCateDialogVisible: false,

      //添加分类的表单数据对象
      addCateFrom: {
        //将要添加的分类的名称
        cat_name: "",
        // 腹肌分类的Id
        cat_pid: 0,
        // 分类的等级 默认添加的是1级分类
        cat_level: 0,
      },

      // 添加分类表单的验证规则
      addCateFromRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },

     // 父级分类的列表
      parentCateList: [],
      
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: []
    };
  },

  created() {
    this.getCateList();
  },

  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      // console.log(res.data);
      //把数据列表赋值给cataList
      this.cateList = res.data.result;
      // 为总数居条数赋值
      this.total = res.data.total;
    },

    //监听 pagesize 改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagesize = newPage;
      console.log(newPage);
      this.getCateList();
    },

    //点击添加 展示添加分类的对话框
    showAddCataDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList();
      // 在展示出对话框
      this.addCateDialogVisible = true;
    },

    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败");
      }
      // console.log(res.data);
      this.parentCateList = res.data;
    },

    // 选择项发生了改变立即触发这个函数
    parentCateChanged(){
      // console.log(this.selectedKeys);
      // 如果 selectedKeys 数组中的length 大于0 证明选中的父级分类
      // 反之 就说明没有选中任何父级分类
      if(this.selectedKeys.length > 0){
        // 父级分类的ID
        this.addCateFrom.cat_pid = this.selectedKeys[
          this.selectedKeys.length -1
        ]
        // w为当前分类的等级赋值
        this.addCateFrom.cat_level = this.selectedKeys.length
        return
      }else{
        // 父级分类的ID
        this.addCateFrom.cat_pid =0
        
        // w为当前分类的等级赋值
        this.addCateFrom.cat_level = 0
      }
       
    },
    //点击按钮 添加新的分类
    addCate(){
      // console.log(this.addCateFrom);
      this.$refs.addCateFromRef.validate(async valid => {
        if(!valid) return
        const {data : res} = await this.$http.post("categories",this.addCateFrom)

        if(res.meta.status !== 201){
          return this.$message.error("添加分类失败")
        }
        
        this.$message.success("添加分类成功！")
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },

    //监听对话框的关闭事件，重置表单数据
    addCateDialogClose(){
      this.$refs.addCateFromRef.resetFields()
      this.selectedKeys = []
      this.addCateFrom.cat_level = 0
      this.addCateFrom.cat_pid = 0
    }
  },

  components: {},
};
</script>

<style scoped lang="less">
.treeTable {
  margin-top: 10px;
}
.el-cascader-menu{
  height: 100px;
}
.el-cascader-panel{
  height: 100px;
}
</style>
