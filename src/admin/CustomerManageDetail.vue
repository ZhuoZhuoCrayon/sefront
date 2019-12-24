<template>
  <el-container style="padding: 2%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="4">
        <AdminNavBar/>
      </el-col>
      <el-col :span="20">
        <el-card v-loading="isLoading">
          <el-row style="height: 40px">
            <el-col :span="24" style="display: flex; align-items: center; height: 100%">
              <h3 style="display: flex; "> 客户明细 </h3>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <div style="min-height: 200px; text-align: left; ">
              <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="ID">
                  <el-input v-model="form.userName"
                  :disabled="this.$route.params.userName !== 'add'"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="form.password"
                  placeholder="留空则保持不变"></el-input>
                </el-form-item>
                <el-form-item label="客户等级">
                  <el-radio-group v-model="form.levelName"
                  :disabled="this.$route.params.userName === 'add'">
                    <el-radio label="Non"></el-radio>
                    <el-radio label="VIP"></el-radio>
                    <el-radio label="SVIP"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="客户状态">
                  <el-switch v-model="form.cusStatus"
                  :disabled="this.$route.params.userName === 'add'">
                  </el-switch>
                </el-form-item>
                <el-form-item>
                  <el-row>
                    <el-col :span="6">
                      <el-button type="danger"
                      @click="queryRemoveCustomer(form.userId)">删除客户</el-button>
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
import { API, CUSTOMER_MANAGE_DETAIL } from '../router/MUrl';

export default {
  name: 'CustomerManageDetail',
  data() {
    return {
      urlSelf: CUSTOMER_MANAGE_DETAIL,
      MAP_LEVEL_NAME: ['', 'Non', 'VIP', 'SVIP'],
      searchInput: '',
      isLoading: true,
      form: {
        userName: this.$route.params.userName,
        levelName: 'Non',
        cusStatus: true,
        password: '',
      },
    };
  },
  methods: {
    queryCustomer() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'get',
          url: `${API}/customer/listAllCustomer.do`,
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            [this.form] = response.data.filter(ele => ele.userName === this.form.userName)
              .map(ele => ({
                ...ele,
                levelName: this.MAP_LEVEL_NAME[ele.cusLevelId],
                cusStatus: ele.cusStatus !== '摸鱼',
                password: '',
              }));
            setTimeout(() => {
              this.isLoading = false;
            }, 200);
            resolve(1);
          }
        });
      });
    },
    queryAddCustomer() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/customer/addCustomer.do`,
          data: {
            address: '',
            birthday: '2019-12-23T07:23:09.363Z',
            email: '',
            password: this.form.password,
            phoneNumber: '',
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
              this.$router.push(`${this.urlSelf}/${this.form.userName}`);
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
    queryUpdateCustomer() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/customer/updateCustomer.do`,
          data: {
            cusLevelId: this.MAP_LEVEL_NAME.indexOf(this.form.levelName),
            cusStatus: this.form.cusStatus ? '活跃' : '摸鱼',
            orderNum: this.form.orderNum,
            totalSales: this.form.totalSales,
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
                message: '成功！',
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
    queryRemoveCustomer(userId) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/customer/deleteCustomer.do`,
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
              this.$router.go(-1);
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
    queryExecute: async function queryExecute() {
      if (this.$route.params.userName === 'add') {
        await this.queryAddCustomer();
      } else {
        await this.queryUpdateCustomer();
      }
      this.queryCustomer();
    },
  },
  mounted() {
    if (this.$route.params.userName !== 'add') {
      this.queryCustomer();
    } else {
      this.isLoading = false;
    }
  },
  components: {
    AdminNavBar,
  },
};
</script>
