<template>
  <div class="userSettingWrapperDiv">
    <div>
      <el-page-header @back="gotoBack" content="用户设置"/>
    </div>
    <div>
      <div class="userSettingWrapperTitleDiv">
        概要信息
      </div>
      <div style="padding: 10px 20px 10px 20px">
        <el-row class="userSettingWrapperRow" :gutter="20">
          <el-col :span="3" style="text-align: right">
            ID
          </el-col>
          <el-col :span="10">
            <el-input v-model="user.userId" disabled></el-input>
          </el-col>
        </el-row>
        <el-row class="userSettingWrapperRow" :gutter="20">
          <el-col :span="3" style="text-align: right">
            会员等级
          </el-col>
          <el-col :span="10" style="display: flex; justify-content: space-between;">
            <el-tag :type="user.levelName === 'SVIP' ? 'warning' :
            user.levelName === 'VIP' ? 'danger' : 'Non'">
              {{ user.levelName }}
            </el-tag>
            <el-button size="mini" disabled> 升级会员 </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="userSettingWrapperTitleDiv">
        密码修改
      </div>
      <div style="padding: 10px 20px 10px 20px">
        <el-row class="userSettingWrapperRow" :gutter="20">
          <el-col :span="3" style="text-align: right">
            旧密码
          </el-col>
          <el-col :span="10">
            <el-input show-password v-model="oldPassword"
            placeholder="留空不修改"></el-input>
          </el-col>
        </el-row>
        <el-row class="userSettingWrapperRow" :gutter="20">
          <el-col :span="3" style="text-align: right">
            新密码
          </el-col>
          <el-col :span="10">
            <el-input show-password v-model="newPassword"
            placeholder="留空不修改"></el-input>
          </el-col>
        </el-row>
        <el-row class="userSettingWrapperRow" :gutter="20">
          <el-col :span="3" style="text-align: right">
            重复新密码
          </el-col>
          <el-col :span="10">
            <el-input show-password v-model="newPasswordAgain"
            placeholder="留空不修改"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="userSettingWrapperTitleDiv">
        收件信息
      </div>
      <div style="padding: 10px 20px 10px 20px">
        <el-row class="userSettingWrapperRow" :gutter="20">
          <el-col :span="3" style="text-align: right">
            姓名
          </el-col>
          <el-col :span="10">
            <el-input v-model="user.userId" disabled></el-input>
          </el-col>
        </el-row>
        <el-row class="userSettingWrapperRow" :gutter="20">
          <el-col :span="3" style="text-align: right">
            收件地址
          </el-col>
          <el-col :span="10">
            <el-input v-model="user.address"></el-input>
          </el-col>
        </el-row>
        <el-row class="userSettingWrapperRow" :gutter="20">
          <el-col :span="3" style="text-align: right">
            手机
          </el-col>
          <el-col :span="10">
            <el-input v-model="user.phoneNumber"></el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="display: flex; justify-content: flex-end;">
      <el-button> 取消设置 </el-button>
      <el-button type="primary" @click="queryDoneSetting"> 完成设置 </el-button>
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import { API } from '../router/MUrl';

export default {
  name: 'Shopcart',
  data() {
    return {
      user: {
        userId: this.$store.getters.getUserId,
        userName: '',
        levelName: this.$store.getters.getCusLevel,
        email: '',
        address: '',
        phoneNumber: '',
      },
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    };
  },
  methods: {
    changeIsMultiSelection() {
      this.isMultiSelection = !this.isMultiSelection;
    },
    gotoAdd() {
      this.$router.push(this.urlEdit);
    },
    gotoBack() {
      this.$router.go(-1);
    },
    queryUserInfo() {
      this.$axios({
        method: 'get',
        url: `${API}/system/getUserAddress.do`,
        withCredentials: true,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.user = {
            ...this.user,
            ...response.data,
          };
        }
      });
    },
    queryDoneSetting: async function queryDoneSetting() {
      await this.queryChangeInfo();
      if (this.newPassword !== '') {
        this.queryUpdatePassword();
      }
    },
    queryChangeInfo() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/system/changeUserInfo.do`,
          data: {
            ...this.user,
            birthday: '2019-12-22T17:33:44.757Z',
            password: '',
            userId: undefined,
            levelName: undefined,
          },
          withCredentials: true,
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            if (!response.data.success) {
              this.$message({
                message: response.data.message,
                type: 'error',
              });
            } else {
              this.$message({
                message: '修改成功！',
                type: 'success',
              });
              resolve(1);
            }
          }
        });
      });
    },
    queryUpdatePassword() {
      if (this.newPassword === '') {
        this.$message({
          message: '密码不能为空！',
          type: 'error',
        });
        return;
      }
      if (this.newPassword !== this.newPasswordAgain) {
        this.$message({
          message: '密码不一致！',
          type: 'error',
        });
        return;
      }
      this.$axios({
        method: 'post',
        url: `${API}/system/changePasswordSys.do`,
        data: Qs.stringify({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        }),
        withCredentials: true,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          if (!response.data.success) {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          } else {
            this.$message({
              message: '修改成功！请重新登录',
              type: 'success',
            });
            this.$router.push('/');
            this.$store.commit('setUserId', null);
          }
        }
      });
    },
  },
  mounted() {
    if (!this.$store.getters.getUserId) {
      this.$message({
        message: '请先登录！',
        type: 'error',
      });
      this.$router.push('/');
      return;
    }
    if (this.$store.getters.getUserIsAdmin === 'true') {
      this.$message({
        message: '管理员不可进入此页面',
        type: 'error',
      });
      this.$router.push('/');
      return;
    }
    this.queryUserInfo();
  },
};
</script>

<style scope>
.userSettingWrapperDiv {
  padding: 25px 100px 25px 100px;
}
.userSettingWrapperTitleDiv {
  display: flex;
  margin-top: 30px;
  color: #303133;
  font-weight: bold;
}
.userSettingWrapperRow {
  display: flex;
  align-items: center;
  margin: 10px 0 20px 0;
}
</style>
