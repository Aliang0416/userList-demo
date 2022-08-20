<template>
  <div class="userlist-container">
    <el-button @click="dialogVisible = true" type="warning" plain>添加用户</el-button>
    <el-dialog
    @close="onDialogClosed"
    title="添加新用户"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form :inline="true" ref="form" :model="ruleForm" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="name">
      <el-input v-model.trim="ruleForm.name"></el-input>
      </el-form-item><el-form-item label="年龄" prop="age">
      <el-input v-model.number="ruleForm.age"></el-input>
      </el-form-item><el-form-item label="职业" prop="position">
      <el-input v-model.trim="ruleForm.position"></el-input>
  </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </span>
</el-dialog>
    <el-table
      stripe
      border
      :data="userlist"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="#"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        width="180">
      </el-table-column>
      <el-table-column
        prop="position"
        label="别名"
        width="180">
      </el-table-column>
      <el-table-column label="发布时间" width="180">
        <template #default="scope">
          {{scope.row.addtime | formatTime}}
        </template>
      </el-table-column>
      <el-table-column
      label="操作">
      <template #default="scope">
        <div>
          <router-link :to="'/users/' + scope.row.id">详情</router-link>&nbsp;
        <a href="" @click.prevent="del(scope.row.id)">删除</a>
        </div>
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const dayjs = require('dayjs')
export default {
  data () {
    const checkAge = (rule, value, cb) => {
      if (!Number.isInteger(value)) {
        return cb(new Error('请填写整数'))
      }
      if (value > 100 || value < 1) {
        return cb(new Error('年龄必须在1-100之间'))
      }
      cb()
    }
    return {
      userlist: [],
      ruleForm: {
        name: '',
        age: '',
        position: ''
      },
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入职业', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async initUserList () {
      const { data: res } = await this.$http.get('/api/users')
      if (res.status !== 0) {
        this.$message.error('用户列表获取失败')
      } else {
        this.userlist = res.data
        console.log(res.data)
      }
    },
    async del (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/api/users/' + id)
      if (res.status === 0) {
        this.initUserList()
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败')
      }
    },
    add () {
      this.dialogVisible = false
      this.$refs.form.validate(async val => {
        if (val) {
          const { data: res } = await this.$http.post('/api/users', this.ruleForm)
          if (res.status === 0) {
            this.$message.success('添加成功')
            this.initUserList()
          } else {
            this.$message.error('添加失败')
          }
        } else {
          this.$message.error('验证失败')
        }
      })
    },
    onDialogClosed () {
      this.$refs.form.resetFields()
    }
  },
  filters: {
    formatTime (strTime) {
      const dateStr = new Date(strTime)
      return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created () {
    this.initUserList()
  }
}
</script>

<style scoped>
  a{
    text-decoration: none;
    color: gray;
  }
  .el-table {
    margin-top: 15px;
  }
</style>
