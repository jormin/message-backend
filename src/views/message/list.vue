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
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="listQuery.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="listQuery.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="title">
        <el-input v-model="listQuery.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="标题">
        <template slot-scope="scope">
          <router-link :to="'/message/detail/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="留言者">
        <template slot-scope="scope">
          <span>{{ scope.row.sender }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="接收者">
        <template slot-scope="scope">
          <span>{{ scope.row.receiver }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="附件">
        <template slot-scope="scope">
          <span>{{ scope.row.attachment ? '有' : '无' }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="留言时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <router-link :to="'/message/detail/'+scope.row.id">
            <el-button type="primary" size="mini">查看</el-button>
          </router-link>
          <router-link :to="'/message/comments/'+scope.row.id">
            <el-button type="primary" size="mini">评论</el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="deleteMessage(scope.row.id)">删除</el-button>
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
import { fetchList } from '@/api/message'
import { deleteMessage } from '@/api/message'

export default {
  name: 'messageList',
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
    deleteMessage(id) {
      this.$confirm('确定删除该条留言?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMessage(id).then(response => {
          this.$message({
            message: '删除成功',
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
