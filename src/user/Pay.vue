<template>
  <div class="payWrapperDiv">
    <div style="display: flex; width: 100%;">
      <el-page-header @back="gotoBack" content="支付订单"/>
    </div>
    <el-row class="payWrapperRow" style="margin-top: 60px;">
      <el-col :span="3" style="text-align: left; font-weight: bold;">
        支付金额
      </el-col>
      <el-col :span="21" style="text-align: left">
        <div class="payWrapperPrice">
          ￥{{ (order.ordTotPrice).toFixed(2) }}
        </div>
      </el-col>
    </el-row>
    <el-row class="payWrapperRow" style="margin-top: 20px;">
      <el-col :span="3" style="text-align: left; font-weight: bold;">
        支付方式
      </el-col>
      <el-col :span="21" style="text-align: left">
        <el-radio-group v-model="order.payMethod">
          <el-radio-button label="myPay">老朱支付</el-radio-button>
          <el-radio-button label="wechat" disabled>微信支付</el-radio-button>
          <el-radio-button label="alipay" disabled>支付宝</el-radio-button>
          <el-radio-button label="paypal" disabled>Paypal</el-radio-button>
          <el-radio-button label="wangyin" disabled>网银支付</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="payWrapperRow" style="margin-top: 20px;">
      <el-col :span="3" style="text-align: left; font-weight: bold;">
        邮寄方式
      </el-col>
      <el-col :span="21" style="text-align: left">
        <el-radio-group v-model="trans.transMethod">
          <el-radio-button v-for="item in transType" :label="item.label" :key="item.label">
            {{item.label}} - ￥{{item.price}}
          </el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <div style="margin-top: 150px;">
      <el-button type="primary" @click="queryPayOrder"> 点击付款 </el-button>
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import { API, MY_ORDER } from '../router/MUrl';

export default {
  name: 'Shopcart',
  data() {
    return {
      urlMyOrder: MY_ORDER,
      transType: [],
      order: {
        orderId: this.$route.params.orderId,
        ordTotPrice: 0,
        payMethod: 'myPay',
      },
      trans: {
        transMethod: '老朱特快',
      },
      user: {},
    };
  },
  methods: {
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
    queryTransType() {
      this.$axios({
        method: 'get',
        url: `${API}/order/listTransMethods.do`,
        withCredentials: true,
        data: Qs.stringify({
          orderId: this.order.orderId,
        }),
      }).then((response) => {
        this.transType = [];
        Object.keys(response.data).forEach((key) => {
          this.transType.push({
            label: key,
            price: response.data[key],
          });
        });
      });
    },
    queryOrder() {
      this.$axios({
        method: 'post',
        url: `${API}/order/getOrderByOrderId.do`,
        withCredentials: true,
        data: Qs.stringify({
          orderId: this.order.orderId,
        }),
      }).then((response) => {
        this.order = {
          ...this.order,
          ...response.data,
        };
      });
    },
    queryPayOrder() {
      this.$axios({
        method: 'post',
        url: `${API}/order/payOrder.do`,
        withCredentials: true,
        data: {
          destination: this.user.address,
          orderId: this.order.orderId,
          transMethod: this.trans.transMethod,
        },
      }).then((response) => {
        if (!response.data.success) {
          this.$message({
            message: response.data.message,
            type: 'error',
          });
        } else {
          this.$message({
            message: '支付成功！',
            type: 'success',
          });
          this.$router.push(this.urlMyOrder);
        }
      });
    },
  },
  mounted() {
    this.queryTransType();
    this.queryUserInfo();
    this.queryOrder();
  },
};
</script>

<style scope>
.payWrapperDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 100px 25px 100px;
}
.payWrapperRow {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.payWrapperPayDiv {
  margin-top: 100px;
  margin-bottom: 20px;
  width: 300px;
  height: 300px;
  border-style: solid;
  border-width: 2px;
}
.payWrapperPrice {
  font-size: larger;
  color: #f64747;
  font-weight: bold;
}
</style>
