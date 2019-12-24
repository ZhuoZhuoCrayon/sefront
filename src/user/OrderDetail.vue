<template>
  <div class="orderDetailWrapperDiv">
    <div>
      <el-page-header @back="gotoBack" content="订单详情"/>
    </div>
    <div class="orderDetailWrapperTitle">
      订单概要
    </div>
    <div style="width: 100%;">
      <el-row class="orderDetailRow" :gutter="20">
        <el-col :span="3" style="text-align: right;"> 订单编号 </el-col>
        <el-col :span="21" style="text-align: left;"> {{ order.orderId }} </el-col>
      </el-row>
      <el-row class="orderDetailRow" :gutter="20">
        <el-col :span="3" style="text-align: right;"> 支付金额 </el-col>
        <el-col :span="21" style="text-align: left;"> {{ (order.ordTotPrice).toFixed(2) }} </el-col>
      </el-row>
      <el-row class="orderDetailRow" :gutter="20">
        <el-col :span="3" style="text-align: right;"> 订单状态 </el-col>
        <el-col :span="21" style="text-align: left;">
          {{ ordStatusSelection[order.ordStatus] }}
        </el-col>
      </el-row>
      <el-row class="orderDetailRow" :gutter="20">
        <el-col :span="3" style="text-align: right;"> 收件人 </el-col>
        <el-col :span="21" style="text-align: left;"> {{ order.userId }} </el-col>
      </el-row>
      <el-row class="orderDetailRow" :gutter="20">
        <el-col :span="3" style="text-align: right;"> 收件地址 </el-col>
        <el-col :span="21" style="text-align: left;"> {{ trans.destination }} </el-col>
      </el-row>
      <el-row class="orderDetailRow" :gutter="20">
        <el-col :span="3" style="text-align: right;"> 邮寄方式 </el-col>
        <el-col :span="21" style="text-align: left;"> {{ trans.transMethod }} </el-col>
      </el-row>
    </div>
    <div class="orderDetailWrapperTitle">
      订单概要
    </div>
    <el-divider/>
    <div v-for="item in product" :key="item.proName" style="width: 100%">
      <el-row style="width: 100%; margin: 10px 0 10px 0;
      display: flex; align-items: center;">
        <el-col :span="3">
          <img :src="item.proImgUrl" width="60px"/>
        </el-col>
        <el-col :span="16">
          <div class="orderDetailProductTitle" style="text-align: left;">
            {{ item.proName }}
          </div>
          <div style="text-align: left;">
            购买数量：{{ item.purQuantity }}
          </div>
        </el-col>
        <el-col :span="4">
          <div class="orderDetailWrapperPrice" style="text-align: left;">
            ￥{{ (item.proTotPrice).toFixed(2) }}
          </div>
        </el-col>
      </el-row>
      <el-divider/>
    </div>
    <div class="orderDetailWrapperTitle">
      物流信息
    </div>
    <div style="margin: 20px 0px 0px 20px;">
      暂无
    </div>
    <div style="margin-top: 80px; width: 100%; display: flex;
    justify-content: flex-end;">
      <el-button v-if="order.ordStatus <= 1"
      @click="queryCancelOrder(order.orderId)"> 取消订单 </el-button>
      <el-button v-if="order.ordStatus <= 1"
      @click="gotoPay(order.orderId)"> 去支付 </el-button>
      <el-button v-else-if="order.ordStatus == 5"
      @click="queryReceive(order.orderId)"> 确认收货 </el-button>
      <el-button v-else-if="order.ordStatus == 6"
      @click="gotoOrderEvaluation"> 评价订单 </el-button>
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import { ORDER_EVALUATION, API } from '../router/MUrl';

export default {
  name: 'OrderDetail',
  data() {
    return {
      allProduct: [],
      urlOrderEvaluation: ORDER_EVALUATION,
      ordStatusSelection: ['已预约', '待付款', '待出库',
        '正在出库', '正在送货', '已送达', '已确认', '已取消'],
      order: {
        orderId: this.$route.params.orderId,
        ordTotPrice: 1230.0,
        ordStatus: 1,
        userId: this.$store.getters.getUserId,
      },
      product: [],
      trans: {
        destination: '',
        transMethod: '',
      },
    };
  },
  methods: {
    gotoBack() {
      this.$router.go(-1);
    },
    gotoOrderEvaluation() {
      this.$router.push(`${this.urlOrderEvaluation}/${this.order.orderId}`);
    },
    gotoPay(orderId) {
      this.$router.push(`${this.urlPay}/${orderId}`);
    },
    queryAllProduct() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/product/listProductSimplesByPage.do`,
          withCredentials: true,
          data: Qs.stringify({
            currentPage: 1,
            pageSize: 100000,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.allProduct = [];
            response.data.itemList.forEach((ele) => {
              this.allProduct[ele.proId] = {
                proName: ele.proName,
                proImgUrl: `${API}/${ele.proImgUrl}`,
              };
            });
            resolve(1);
          }
        });
      });
    },
    queryTrans() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/getTransportationByTransId.do`,
          withCredentials: true,
          data: Qs.stringify({
            transId: this.order.transId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.trans = response.data;
            resolve(1);
          }
        });
      });
    },
    queryProduct() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/listProductListByOrderId.do`,
          withCredentials: true,
          data: Qs.stringify({
            orderId: this.order.orderId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.product = [];
            response.data.forEach((ele) => {
              this.product.push({
                ...ele,
                ...this.allProduct[ele.proId],
              });
            });
            resolve(1);
          }
        });
      });
    },
    queryReceive(orderId) {
      this.$axios({
        method: 'post',
        url: `${API}/order/finish.do`,
        withCredentials: true,
        data: Qs.stringify({
          orderId: orderId,
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
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          }
        }
      });
    },
    queryCancelOrder(orderId) {
      this.$axios({
        method: 'post',
        url: `${API}/order/cancel.do`,
        withCredentials: true,
        data: Qs.stringify({
          orderId: orderId,
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
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          }
        }
      });
    },
    queryOrder: async function queryOrder() {
      await this.queryAllProduct();
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/getOrderByOrderId.do`,
          withCredentials: true,
          data: Qs.stringify({
            orderId: this.order.orderId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.order = {
              ...response.data,
              userId: this.$store.getters.getUserId,
            };
            this.queryTrans();
            this.queryProduct();
            resolve(1);
          }
        });
      });
    },
  },
  mounted() {
    this.queryOrder();
  },
};
</script>

<style scope>
.orderDetailWrapperDiv {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 25px 100px 25px 100px;
}
.orderDetailWrapperTitle {
  margin-top: 40px;
  font-weight: bold;
}
.orderDetailWrapperPrice {
  color: #f64747;
  font-weight: bold;
}
.orderDetailProductTitle {
  font-size: larger;
  color: #303133;
  margin: 0 0 10px 0;
}
.orderDetailRow {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0 20px 0;
}
</style>
