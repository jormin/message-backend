<template>
  <div class="app-container">
    <p class="warn-content">
      留言：{{message.title}}
    </p>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="评论者">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="评论内容">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="评论时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
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
import { fetchList } from '@/api/comment'
import { deleteMessage } from '@/api/comment'
import { fetchMessage } from '@/api/message'

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
      message: {},
      list: null,
      total: 0,
      totalPage: 0,
      currentPage: 1,
      listLoading: true,
      listQuery: {
        page: 0,
        limit: 15,
        id: this.$route.params.id,
        name: '',
        gender: '',
        phone: '',
        email: ''
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
      this.$confirm('确定删除该条评论?', '删除确认', {
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
    },
    fetchMessage() {
      fetchMessage(this.$route.params.id).then(response => {
        this.message = response.data.message
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted: function () {
    this.fetchMessage()
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
