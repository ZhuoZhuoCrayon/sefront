<template>
  <el-card>
    <el-button id="adminNavBarButton" :type="isEqual(adminOverview)"
    @click="gotoPage(adminOverview)">
      今日概览
    </el-button>
    <el-button id="adminNavBarButton" :type="isEqual(orderManage)"
    @click="gotoPage(orderManage)">
      订单管理
    </el-button>
    <el-button id="adminNavBarButton" :type="isEqual(customerManage)"
    @click="gotoPage(customerManage)">
      客户管理
    </el-button>
    <el-button id="adminNavBarButton" :type="isEqual(productManage)"
    @click="gotoPage(productManage)">
      产品管理
    </el-button>
    <el-button id="adminNavBarButton" :type="isEqual(employeeManage)"
    @click="gotoPage(employeeManage)">
      员工管理
    </el-button>
    <el-button id="adminNavBarButton" :type="isEqual(transportManage)"
    @click="gotoPage(transportManage)">
      送货管理
    </el-button>
    <el-button id="adminNavBarButton" :type="isEqual(chatManage)"
    @click="gotoPage(chatManage)">
      交流管理
    </el-button>
  </el-card>
</template>

<script>
// import Qs from 'qs';
import {
  ADMIN_OVERVIEW, ORDER_MANAGE, CUSTOMER_MANAGE, PRODUCT_MANAGE,
  EMPLOYEE_MANAGE, TRANSPORT_MANAGE, CHAT_MANAGE,
} from '../router/MUrl';

export default {
  name: 'AdminNavBar',
  data: () => ({
    tabUrl: ['overview', 'productManage'],
    adminOverview: ADMIN_OVERVIEW,
    orderManage: ORDER_MANAGE,
    customerManage: CUSTOMER_MANAGE,
    productManage: PRODUCT_MANAGE,
    employeeManage: EMPLOYEE_MANAGE,
    transportManage: TRANSPORT_MANAGE,
    chatManage: CHAT_MANAGE,
  }),
  methods: {
    gotoPage(s) {
      this.$router.push(`${s}`);
    },
    isEqual(s) {
      return this.$route.path === s ? 'primary' : 'default';
    },
  },
  mounted: async function mounted() {
    if (!this.$store.getters.getUserId) {
      this.$message({
        message: '请先登录！',
        type: 'error',
      });
      this.$router.push('/');
      return;
    }
    if (this.$store.getters.getUserIsAdmin !== 'true') {
      this.$message({
        message: '您不可进入此页面',
        type: 'error',
      });
      this.$router.push('/');
    }
  },
};
</script>

<style>
#adminNavBarButton {
  width: 95%;
  margin-bottom: 15px;
  margin-left: 0;
}
</style>
