<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色列表区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 列表区 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <!-- 通过for 循环 嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :class="[i2 === 0 ? '' : 'bdtop']"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      @close="removeRightById(scope.row, item3.id)"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>{{ scope.row }}</pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label=""></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              :visible.sync="editDialogVisible"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
            >
              删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="ruleForm"
        label-width="70px"
        ref="addFormRef"
        :rules="addFormRules"
      >
        <el-form-item label="角色名称" prop="roleName" label-width="80px">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
          <el-input v-model="ruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 对话框底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改角色信息"
      @close="editDialogClosed"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取所有角色的列表数据
      rolelist: [],
      //添加对话框的隐藏与显示
      addDialogVisible: false,

      //添加角色的表单数据
      ruleForm: {
        roleName: "",
        roleDesc: "",
      },

      //添加表单的验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      //用户查询到的信息对象
      editForm: {},
      //控制修改对话框的显示与隐藏
      editDialogVisible: false,

      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],

      //树形控件的绑定队香
      treeProps: {
        label: "authName",
        children: "children",
      },

      //默认选中的节点Id值
      defKeys: [],
      //当前即将分配权限的id
      roleId:''
    };
  },

  created() {
    this.getRolesList();
  },

  methods: {
    //获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        return this.$messag.error("获取用户列表失败!");
      }

      this.rolelist = res.data;

      // console.log(this.rolelist);
    },

    //监听添加角色的对话框的关闭事件  关闭清空填写内容
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {},
    //点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(validate);
        if (!valid) return;
        //发起网路请求
        const { data: res } = await this.$http.post("roles", this.ruleForm);
        // console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error("添加角色失败！");
        }
        this.$message.success("添加角色成功！");

        //隐藏添加的对话框
        this.addDialogVisible = false;
        // console.log(this);
        //重新调用  刷新用户列表数据
        this.getRolesList();
      });
    },

    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      //把获取到的用户信息，保存到编辑表单数据对象中
      this.editForm = res.data;
      // console.log(res.data.roleId);
      this.editDialogVisible = true;
    },

    //修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        //发起修改用户信息的请求
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          },
          console.log(this.editForm.roleId)
        );
        console.log(res.meta);
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败！");
        }

        //关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getRolesList();
        // 提示修改成功
        this.$message.success("更新用户信息成功！");
      });
    },

    // <!-- 根据Id删除对应的用户信息 -->
    async removeRoleById(id) {
      // console.log(id);
      //弹窗询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      //如果用户确认删除,则返回值为字符串 confirm
      //如果用户取消删除，则返回字符串 cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      // console.log("确认了删除");删除操作
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败！");
      }
      this.$message.success("删除用户成功！");
      this.getRolesList();
    },

    //根据ID删除对应的权限
    async removeRightById(role, rightId) {
      //弹框提示是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      // console.log("确认了删除");
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      this.$message.success("删除权限成功！");
      // this.getRolesList()
      role.children = res.data;
    },

    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的列表
      const { data: res } = await this.$http.get("rights/tree");

      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      //把获取到的权限数据保存在data中
      this.rightsList = res.data;
      console.log(this.rightsList);

      //递归获取三级节点的Id
      this.getLeafKeys(role,this.defKeys)

      this.setRightDialogVisible = true;
    },

    // 通过递归的形式，获取角色下所有三级权限的Id 并保存到fefkey数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，这是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => this.getLeafKeys(item,arr))
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed(){
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  },
};
</script>

<style>
label {
  width: 80px;
}
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>