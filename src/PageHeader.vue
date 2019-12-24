<template>
  <div>
  <el-menu :default-active="1" mode="horizontal" id="navBar">
    <div id="navBarIcon" @click="gotoHomepage">
      <img src="./assets/wine.png" height="30px" width="30px">
      <div id="navBarIconText">SHOP</div>
    </div>
    <div id="navBarFuncPannel">
      <el-button v-if="this.$store.getters.getUserId"
      type="default" size="small" disabled> ? </el-button>
      <el-link id="navBarLink" :underline="false" @click="gotoAllProduct">全部产品</el-link>
      <div>
        <el-divider direction="vertical"/>
      </div>
      <el-link v-if="this.$store.getters.getUserId" id="navBarLink"
      :underline="false" @click="gotoShopcart">我的购物车</el-link>
      <div v-if="this.$store.getters.getUserId"
      style="margin-right: 20px;">
        <el-divider direction="vertical"/>
      </div>
      <div v-if="!this.$store.getters.getUserId">
        <el-button type="primary" size="small" style="margin-left: 20px;"
        @click="openLoginDialog"> 登录 </el-button>
        <el-button type="default" size="small" @click="openRegisterDialog"> 注册 </el-button>
      </div>
      <div v-else>
        <el-dropdown trigger="click">
          <span> {{ this.$store.getters.getUserId  }}
          <i class="el-icon-arrow-down el-icon--right pageHeaderDivHover"></i>
          </span>
          <el-dropdown-menu slot="dropdown"
          v-if="!this.$store.getters.getUserIsAdmin
            || this.$store.getters.getUserIsAdmin === 'false'">
            <el-dropdown-item>
              <div @click="gotoMyOrder" class="pageHeaderDivHover">
                我的订单
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="gotoMyFavorite" class="pageHeaderDivHover">
                我的收藏
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="gotoUserSetting" class="pageHeaderDivHover">
                修改信息
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="logout" class="pageHeaderDivHover">
                注销
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu slot="dropdown" v-if="this.$store.getters.getUserIsAdmin === 'true'">
            <el-dropdown-item>
              <div @click="gotoAdminOverview" class="pageHeaderDivHover">
                进入后台
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="logout" class="pageHeaderDivHover">
                注销
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-menu>
  <el-dialog title="" :visible.sync="dialogVisible" width="30%"
  v-if="dialogMode === 'login'" @close="clearDialog">
    <el-form :model="formLogin" id="dialogForm">
      <div id="dialogTitleDiv">
      登 录
      </div>
      <el-form-item style="width: 80%">
        <el-input v-model="formLogin.userId" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item style="width: 80%">
        <el-input v-model="formLogin.password" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item style="width: 80%; margin-bottom: 0px; margin-top: 20px;">
        <el-button style="width: 100%" type="primary"
        @click="login">登录</el-button>
      </el-form-item>
      <el-form-item style="width: 80%; display: flex; justify-content: flex-end;">
        <el-button style="width: 100%" type="text"
        @click="switchDialogMode">还没账号？立即注册</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog title="" :visible.sync="dialogVisible" width="30%"
  v-else-if="dialogMode === 'register'" @close="clearDialog">
    <el-form :model="formRegister" id="dialogForm">
      <div id="dialogTitleDiv">
      注 册
      </div>
      <el-form-item style="width: 80%">
        <el-input v-model="formRegister.userId" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item style="width: 80%">
        <el-input v-model="formRegister.password" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item style="width: 80%">
        <el-input v-model="formRegister.passwordAgain" placeholder="重复密码"
        show-password></el-input>
      </el-form-item>
      <el-form-item style="width: 80%;">
        <el-row :gutter="0" style="width: 100%;">
          <el-col :span="17">
            <el-input v-model="formRegister.email" placeholder="邮箱"></el-input>
          </el-col>
          <el-col :span="7" style="display: flex; justify-content: flex-end;">
            <el-button type="default" style="margin-right: 0px;" disabled>验证</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="width: 80%">
        <el-input v-model="formRegister.code" placeholder="验证码" disabled></el-input>
      </el-form-item>
      <el-form-item style="width: 80%; margin-bottom: 0px; margin-top: 20px;">
        <el-button style="width: 100%" type="primary"
        @click="register">注册</el-button>
      </el-form-item>
      <el-form-item style="width: 80%; display: flex; justify-content: flex-end;">
        <el-button style="width: 100%" type="text"
        @click="switchDialogMode">已有账号？立即登录</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import Qs from 'qs';
import {
  HOMEPAGE, ALL_PRODUCT, SHOPCART, MY_ORDER,
  MY_FAVORITE, USER_SETTING, API, ADMIN_OVERVIEW,
} from './router/MUrl';

export default {
  name: 'PageHeader',
  data() {
    return {
      urlAllProduct: ALL_PRODUCT,
      urlHomepage: HOMEPAGE,
      urlShopcart: SHOPCART,
      urlMyOrder: MY_ORDER,
      urlMyFavorite: MY_FAVORITE,
      urlUserSetting: USER_SETTING,
      urlAdminOverview: ADMIN_OVERVIEW,
      dialogVisible: false,
      dialogMode: 'register',
      INIT_FORM_LOGIN: {
        userId: '',
        password: '',
      },
      INIT_FORM_REGISTER: {
        userId: '',
        password: '',
        passwordAgain: '',
        email: '',
        code: '',
      },
      formLogin: {
        userId: '',
        password: '',
      },
      formRegister: {
        userId: '',
        password: '',
        passwordAgain: '',
        email: '',
        code: '',
      },
    };
  },
  methods: {
    switchDialogMode() {
      this.clearDialog();
      this.dialogMode = (this.dialogMode === 'register' ? 'login' : 'register');
    },
    openLoginDialog() {
      this.dialogMode = 'login';
      this.dialogVisible = true;
    },
    clearDialog() {
      this.formRegister = JSON.parse(JSON.stringify(this.INIT_FORM_REGISTER));
      this.formLogin = JSON.parse(JSON.stringify(this.INIT_FORM_LOGIN));
    },
    register() {
      const reqData = {
        birthday: '2019-01-01',
        email: this.formRegister.email,
        password: this.formRegister.password,
        phoneNumber: 'NULL',
        userName: this.formRegister.userId,
      };
      if (this.formRegister.userId === '') {
        this.$message({
          message: '用户名不能为空！',
          type: 'error',
        });
        return;
      }
      if (this.formRegister.password !== this.formRegister.passwordAgain) {
        this.$message({
          message: '密码不一致',
          type: 'error',
        });
        return;
      }
      const emailPattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/;
      if (!emailPattern.test(this.formRegister.email)) {
        this.$message({
          message: '邮箱格式错误！',
          type: 'error',
        });
        return;
      }
      this.$axios({
        method: 'post',
        url: `${API}/system/register.do`,
        data: reqData,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else if (response.data.success !== true) {
          this.$message({
            message: response.data.message,
            type: 'error',
          });
        } else {
          this.dialogMode = 'login';
          this.$message({
            message: '注册成功',
            type: 'success',
          });
          this.clearDialog();
        }
      });
    },
    queryUserInfo() {
      return new Promise(((resolve) => {
        this.$axios({
          method: 'get',
          url: `${API}/system/getUserSimple.do`,
          withCredentials: true,
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          }
          this.$store.commit('setUserIsAdmin', response.data.role !== '普通用户');
          if (response.data.role === '普通用户') {
            this.$store.commit('setCusLevel', response.data.userParams.cusLevel);
          }
          resolve(1);
        });
      }));
    },
    login() {
      const data = Qs.stringify({
        username: this.formLogin.userId,
        password: this.formLogin.password,
        remember: true,
      });
      axios.post(`${API}/system/login.do`, data).then(async (response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else if (response.data.success !== true) {
          this.$message({
            message: response.data.message,
            type: 'error',
          });
        } else {
          this.dialogVisible = false;
          this.$store.commit('setUserId', this.formLogin.userId);
          await this.queryUserInfo();
          this.$router.go(0);
        }
      });
    },
    logout() {
      this.$axios({
        method: 'post',
        url: `${API}/logout`,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        }
      });
      this.$store.commit('setUserId', null);
      this.$store.commit('setUserIsAdmin', false);
      this.$message({
        message: '已注销',
        type: 'success',
      });
      this.$router.go(0);
    },
    openRegisterDialog() {
      this.dialogMode = 'register';
      this.dialogVisible = true;
    },
    gotoAllProduct() {
      this.$router.push(this.urlAllProduct);
    },
    gotoHomepage() {
      this.$router.push(this.urlHomepage);
    },
    gotoShopcart() {
      this.$router.push(this.urlShopcart);
    },
    gotoMyOrder() {
      this.$router.push(this.urlMyOrder);
    },
    gotoMyFavorite() {
      this.$router.push(this.urlMyFavorite);
    },
    gotoUserSetting() {
      this.$router.push(this.urlUserSetting);
    },
    gotoAdminOverview() {
      this.$router.push(this.urlAdminOverview);
    },
  },
};
</script>

<style>
#navBar {
  height: 60px;
  padding-right: 20px;
  display: flex;
  align-items: center;
}
#navBarIcon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  margin-left: 20px;
}
#navBarIcon:hover {
  cursor: pointer;
}
#navBarIconText {
  font-family: 'Arial';
  font-size: large;
  font-weight: bold;
  letter-spacing: 1px;
  margin-left: 5px;
}
#navBarFuncPannel {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#navBarLink {
  margin-left: 20px;
  margin-right: 20px;
}
#dialogForm {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: large;
}
#dialogTitleDiv {
  margin-top: 10px;
  margin-bottom: 40px;
  text-align: center;
}
.pageHeaderDivHover:hover {
  cursor: pointer;
}
</style>
