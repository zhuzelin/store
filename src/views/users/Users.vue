<template>
<!-- 面包屑 -->
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框 -->
    <el-row class="search">
    <el-col :span="24">
        <el-input v-model="searchValue" clearable placeholder="请输入内容" class="longth">
        <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="addUserDialogVisible = true" type="success" plain>添加用户</el-button>
    </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
        border
        v-loading="loading"
        stripe
        :data="list"
        style="width: 100%">
        <el-table-column
        type="index"
        width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建日期">
          <template slot-scope="scope">
            {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
            <!-- {{scope.row}}当前行绑定的数据对象 -->
            <!-- {{scope.$index}}当前行的索引 -->
            <!-- {{scope.column}}当前列的配置内容 -->
          </template>
        </el-table-column>
        <el-table-column
          label="用户状态">
          <template slot-scope="scope">
            <!-- scope.row就是当前行绑定的数据对象 user对象 -->
            <el-switch
              @change="handleSwitchChange(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
          <el-button @click="handleShowEditDialog(scope.row)" type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button @click="handleDelete(scope.row.id)" type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          <el-button @click="handleShowSetRoleDialog(scope.row)" type="success" icon="el-icon-check" plain size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- layout是配置的功能 -->
      <!-- size-change每页数据发生改变 -->
      <!-- current-change当前页码发生改变 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 3, 4, 5]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    <!-- 添加用户的弹出框 -->
    <!-- visible是否显示 sync Vue提供的修饰符 同步 组件内部也可以向外传值 -->
      <el-dialog  @closed="handleClosed" title="添加用户" :visible.sync="addUserDialogVisible">
        <el-form
          ref="myform"
          :rules="formRules"
          label-width="100px"
          :model="formData">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="formData.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
      </el-dialog>
    <!-- 编辑用户的弹出框 -->
      <el-dialog @closed="handleClosed" title="编辑用户" :visible.sync="editUserDialogVisible">
        <el-form
          ref="myform"
          :rules="formRules"
          label-width="100px"
          :model="formData">
          <el-form-item  label="用户名" prop="username">
            <el-input disabled v-model="formData.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="formData.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">取 消</el-button>
          <el-button @click="handleEdit" type="primary">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配用户角色的弹出框 -->
      <el-dialog @closed="handleClosed" title="分配角色" :visible.sync="setRoleDialogVisible">
        <el-form
          ref="myform"
          :rules="formRules"
          label-width="100px"
          :model="formData">
          <el-form-item  label="用户名" prop="username">
            {{ currentUserName }}
          </el-form-item>
          <el-form-item label="角色">
             <el-select  v-model="currentRoleId">
              <el-option disabled label="请选择" :value="-1">
              </el-option>
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button  @click="handleSetRole" type="primary">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>

</template>

<script>
export default {
  data() {
    return {
    // 用户列表数据
      list: [],
      // true显示正在加载 false的时候不显示
      loading: true,
      // 分页相关数据
      pagenum: 1, // 页码
      pagesize: 5, // 每页条数
      total: 0, // 总共的数据条数 从服务器获取
      // 绑定搜索文本框
      searchValue: '',
      // 控制添加用户框显示隐藏
      addUserDialogVisible: false,
      // 控制编辑用户的对话框显示或者隐藏
      editUserDialogVisible: false,
      // 控制分配角色的对话框显示或隐藏
      setRoleDialogVisible: false,
      // 绑定表单数据
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 分配角色需要的数据
      currentUserName: '',
      // 当前角色id
      ccurrentUserId: -1,
      currentRoleId: -1,
      roles: [],
      // 表单的验证规则
      formRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // 发送请求获取数据
    this.loadData();
  },
  methods: {
    // 分页方法
    handleSizeChange(val) {
      // 每条页数改变的时候
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 搜索功能
    handleSearch() {
      this.loadData();
    },
    // 添加用户的确定按钮
    async handleAdd() {
      // 表单的验证
      // valid 验证是否通过
      this.$refs.myform.validate(async(valid) => {
        if (!valid) {
          return this.$message.error('请输入完整内容');
        }
        // 表单验证成功的操作
        const res = await this.$http.post('users', this.formData);
        const data = res.data;
        const { meta: { status, msg } } = data;
        if (status === 201) {
          // 添加成功
          this.$message.success(msg);
          this.addUserDialogVisible = false;
          this.loadData();
          // 清空文本框的值
          for (let key in this.formData) {
            this.formData[key] = '';
          }
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 删除操作 点击确定发送请求
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 包裹await的函数都需要加上async
        const res = await this.$http.delete(`users/${id}`);
        const data = res.data;
        const { meta: { msg, status } } = data;
        if (status === 200) {
          // 删除成功后回到第一页
          this.pagenum = 1;
          this.loadData();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          this.$message.err(msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 点击编辑按钮弹出编辑用户框
    handleShowEditDialog(user) {
      // 显示对话框
      this.editUserDialogVisible = true;
      // 文本框显示用户信息
      // formData和user指向的是同一个对象 输入的时候formdata变化 user也会跟着变化
      // this.formData = user;
      this.formData.username = user.username;
      this.formData.email = user.email;
      this.formData.mobile = user.mobile;
      this.formData.id = user.id;
    },
    // 点击编辑框确定按钮 提交信息
    async handleEdit() {
      const res = await this.$http.put(`users/${this.formData.id}`, {
        mobile: this.formData.mobile,
        email: this.formData.email
      });
      const data = res.data;
      const { meta: { status, msg } } = data;
      if (status === 200) {
        // 修改成功关闭对话框 提示信息 清空文本框
        this.$message.success(msg);
        this.editUserDialogVisible = false;
        this.loadData();
      } else {
        this.$message.error(msg);
      }
    },
    // 添加和修改的对话框关闭以后执行
    handleClosed() {
      // 清空文本框
      for (let key in this.formData) {
        this.formData[key] = '';
      }
    },
    // 点击分配角色按钮 打开分配角色的对话框
    async handleShowSetRoleDialog(user) {
      // 记录当前角色的id
      this.currentUserId = user.id;
      console.log(user);
      this.currentUserName = user.username;
      // 显示对话框
      this.setRoleDialogVisible = true;
      const res = await this.$http.get('roles');
      this.roles = res.data.data;
      // 根据用户id查询用户对象 角色id
      const res1 = await this.$http.get(`users/${user.id}`);
      this.currentRoleId = res1.data.data.rid;
    },
    // 点击确定按钮分配角色
    async handleSetRole() {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      });
      const data = res.data;
      const { meta: { status, msg } } = data;
      if (status === 200) {
        // 成功
        // 关闭对话框
        this.setRoleDialogVisible = false;
        // 提示
        this.$message.success(msg);
        // 重置数据
        this.currentUserName = '';
        this.currentUserId = -1;
        this.currentRoleId = -1;
      } else {
        // 失败
        this.$message.error(msg);
      }
    },
    // 当开关的状态发生改变
    async handleSwitchChange(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.msg_state}`);
      // console.log(res.data);
      const data = res.data;
      const {meta: { msg, status }} = data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.err(msg);
      }
    },
    // 发送异步请求，获取数据
    async loadData() {
      // 发送异步请求之前
      this.loading = true;
      // 发送请求之前 获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);
      // 异步请求结束
      this.loading = false;
      // 获取响应数据
      const data = res.data;
      // meta中的msg 和 status
      const { meta: { msg, status } } = data;
      if (status === 200) {
        const { data: { users, total } } = data;
        this.list = users;
        // 获取总条数
        this.total = total;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.search {
  margin: 10px 0 10px 0;
}

.longth {
  width: 300px;
}
</style>
