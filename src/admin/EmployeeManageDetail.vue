<template>
  <el-container style="padding: 2%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="4">
        <AdminNavBar/>
      </el-col>
      <el-col :span="20">
        <el-card>
          <el-row style="height: 40px">
            <el-col :span="24" style="display: flex; align-items: center; height: 100%">
              <h3 style="display: flex; "> 员工明细 </h3>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <div style="min-height: 400px; text-align: left; ">
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="ID">
                  <el-input v-model="form.userId" disabled></el-input>
                </el-form-item>
                <el-form-item label="员工名称">
                  <el-input v-model="form.userName"
                  :disabled="form.userId !== 'add'"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="form.password"
                  placeholder="留空则保持不变"></el-input>
                </el-form-item>
                <el-form-item label="贡献度">
                  <el-input v-model="form.empWorkload"
                  :disabled="form.userId === 'add'"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                  <el-radio-group v-model="form.roleDes">
                    <el-radio v-for="item in ROLE_DES"
                    :label="item" :key="item"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-row>
                    <el-col :span="6">
                      <el-button type="danger"
                      @click="queryRemoveEmployee(form.userId)">删除客户</el-button>
                    </el-col>
                    <el-col :span="18" style="display: flex; justify-content: flex-end;">
                      <el-button type="primary" @click="queryExecute">确认</el-button>
                      <el-button @click="() => {this.$router.go(-1);}">取消</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import Qs from 'qs';
import AdminNavBar from './AdminNavBar.vue';
import { API } from '../router/MUrl';

export default {
  name: 'EmployeeManageDetail',
  data() {
    return {
      ROLE_DES: ['超级管理员', '产品管理员', '员工管理员', '客户管理员', '物流管理员', '销售管理员'],
      ROLE: ['superAdmin', 'productAdmin', 'employeeAdmin', 'customerAdmin',
        'logisticsAdmin', 'SalesAdmin'],
      searchInput: '',
      isMultiSelection: false,
      form: {
        userId: this.$route.params.userId !== 'add'
          ? parseInt(this.$route.params.userId, 10) : this.$route.params.userId,
        userName: '',
        empOccupation: 0,
        empWorkload: 0,
        roleDes: 0,
        role: 0,
        password: '',
      },
    };
  },
  methods: {
    changeIsMultiSelection() {
      this.isMultiSelection = !this.isMultiSelection;
    },
    queryRemoveEmployee(userId) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/employee/deleteEmployee.do`,
          withCredentials: true,
          data: Qs.stringify({
            userId: userId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            if (response.data.success) {
              this.$message({
                message: '成功！',
                type: 'success',
              });
              this.queryInit();
            } else {
              this.$message({
                message: response.data.message,
                type: 'error',
              });
            }
            resolve(1);
          }
        });
      });
    },
    queryEmployee() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'get',
          url: `${API}/employee/listAllEmployee.do`,
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            const [item] = response.data.filter(ele => ele.userId === this.form.userId);
            this.form = {
              ...item,
              password: '',
            };
            resolve(1);
          }
        });
      });
    },
    queryUpdateEmployee() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/employee/updateEmployee.do`,
          data: {
            empWorkload: this.form.empWorkload,
            roleDes: this.form.roleDes,
            userId: this.form.userId,
            userName: this.form.userName,
          },
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            if (response.data.success) {
              this.$message({
                message: '更新信息成功！',
                type: 'success',
              });
            } else {
              this.$message({
                message: response.data.message,
                type: 'error',
              });
            }
            resolve(1);
          }
        });
      });
    },
    queryUpdateRole() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/employee/updateRole.do`,
          data: Qs.stringify({
            userId: this.form.userId,
            role: this.ROLE[this.ROLE_DES.indexOf(this.form.roleDes)],
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            if (response.data.success) {
              this.$message({
                message: '修改权限成功！',
                type: 'success',
              });
            } else {
              this.$message({
                message: response.data.message,
                type: 'error',
              });
            }
            resolve(1);
          }
        });
      });
    },
    queryAddEmployee() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/employee/addEmployee.do`,
          data: {
            address: '',
            birthday: '2019-12-23T07:23:09.463Z',
            email: 'icewine@icewine.com',
            password: this.form.password,
            phoneNumber: '11111111111',
            role: this.ROLE[this.ROLE_DES.indexOf(this.form.roleDes)],
            userName: this.form.userName,
          },
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            if (response.data.success) {
              this.$message({
                message: '成功！',
                type: 'success',
              });
            } else {
              this.$message({
                message: response.data.message,
                type: 'error',
              });
            }
            this.$router.go(-1);
            resolve(1);
          }
        });
      });
    },
    queryExecute: async function queryExecute() {
      if (this.form.userId === 'add') {
        await this.queryAddEmployee();
      } else {
        await this.queryUpdateEmployee();
        await this.queryUpdateRole();
      }
      this.queryInit();
    },
    queryInit() {
      if (this.form.userId !== 'add') {
        this.queryEmployee();
      }
    },
  },
  mounted() {
    this.queryInit();
  },
  components: {
    AdminNavBar,
  },
};
</script>
