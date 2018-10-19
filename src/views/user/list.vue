<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" :rules="rules" ref="listQuery" label-width="100px" class="demo-ruleForm">
      <el-form-item prop="name">
        <el-input v-model="listQuery.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="gender">
        <el-select v-model="listQuery.gender" placeholder="请选择性别">
          <el-option label="全部" value=""></el-option>
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
        <el-form-item prop="gender">
          <el-select v-model="listQuery.gender" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="listQuery.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="listQuery.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column width="260px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email_verify === '1' ? '已认证' : '未认证'}} - {{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status === '1' ? '启用' : '禁用'}}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="注册IP">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }} - {{scope.row.ip_ddress}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120px">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="changeStatus(scope.row.id, -1)" v-show="scope.row.status === '1'">禁用</el-button>
          <el-button type="success" size="mini" @click="changeStatus(scope.row.id, 1)" v-show="scope.row.status === '-1'">启用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[15, 30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        :page-count="totalPage"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

  </div>
</template>

<script>
import { fetchList } from '@/api/user'
import { changeStatus } from '@/api/user'

export default {
  name: 'userList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      var reg = /^1[3456789]\d{9}$/;
      if (value !== '' && !reg.test(value)){
        callback(new Error('请输入正确格式的手机号码'));
      }else{
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (value !== '' && !reg.test(value)){
        callback(new Error('请输入正确格式的邮箱'));
      }else{
        callback();
      }
    };
    return {
      list: null,
      total: 0,
      totalPage: 0,
      currentPage: 1,
      listLoading: true,
      listQuery: {
        page: 0,
        limit: 15,
        name: '',
        gender: '',
        phone: '',
        title: '',
        email: '',
      },
      rules: {
        phone: [
          { validator: validatePhone }
        ],
        email: [
          { validator: validateEmail }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = parseInt(response.data.total)
        this.totalPage = parseInt(response.data.totalPage)
        this.currentPage = parseInt(response.data.currentPage+1)
        this.listLoading = false
      })
    },
    changeStatus(id, userStatus) {
      let statusLabel = userStatus === 1 ? '启用' : '禁用';
      this.$confirm('确定'+statusLabel+'该用户?', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeStatus(id, userStatus).then(response => {
          this.$message({
            message: statusLabel+'成功',
            type: 'success'
          })
          this.getList()
        })
      }).catch(() => {
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val-1
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
