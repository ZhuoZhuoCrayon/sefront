<template>
  <div class="myOrderWrapperDiv">
    <div>
      <el-page-header @back="gotoBack" content="我的订单"/>
    </div>
    <div class="myOrderTitle">
      未收到订单
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;">
      <div style="width: 50%" v-for="item in unfinishedOrder" :key="item.orderId">
        <div style="padding: 25px 25px 25px 25px">
          <el-card>
            <div style="display: flex; align-items: center;">
              <div class="myOrderOrderTitle" @click="gotoOrderDetail(item)">
                订单：{{ item.orderId }}
              </div>
              <el-tag type="info"> {{ ordStatusSelection[item.ordStatus] }} </el-tag>
            </div>
            <el-divider/>
            <div style="height: 100px; overflow-y: auto;">
            <div style="display: flex; align-items: center;
            padding-left: 20px; margin-bottom: 10px;
            color: #909399;"
            v-for="pro in item.product"
            :key="pro.proName">
              <div style="margin-right: 20px;"> {{ pro.proName }} </div>
              <div> x{{ pro.purQuantity }} </div>
            </div>
            </div>
            <el-divider/>
            <div style="display: flex; align-items: center;">
              <div style="display: flex;  align-items: center; flex-grow: 1">
                <div style="margin-right: 10px;">
                  总金额
                </div>
                <div class="myOrderWrapperPrice">
                  ￥{{ (item.ordTotPrice).toFixed(2) }}
                </div>
              </div>
              <el-button v-if="item.ordStatus <= 1" @click="queryCancelOrder(item.orderId)">
                取消订单
              </el-button>
              <el-button v-if="item.ordStatus <= 1" @click="gotoPay(item.orderId)">
                支付订单
              </el-button>
              <el-button
              v-else-if="item.ordStatus === 5" @click="queryReceive(item.orderId)">
                确认收货
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <div class="myOrderTitle">
      已收到订单
    </div>
    <div style="width: 100%; display: flex; flex-wrap: wrap;">
      <div style="width: 50%" v-for="item in finishedOrder" :key="item.orderId">
        <div style="padding: 25px 25px 25px 25px">
          <el-card>
            <div style="display: flex; align-items: center;">
              <div class="myOrderOrderTitle" @click="gotoOrderDetail(item)">
                订单：{{ item.orderId }}
              </div>
              <el-tag type="info"> {{ ordStatusSelection[item.ordStatus] }} </el-tag>
            </div>
            <el-divider/>
            <div style="height: 100px; overflow-y: auto;">
            <div style="display: flex; align-items: center;
            padding-left: 20px; margin-bottom: 10px;
            color: #909399"
            v-for="pro in item.product"
            :key="pro.proId">
              <div style="margin-right: 20px;"> {{ pro.proName }} </div>
              <div> x{{ pro.purQuantity }} </div>
            </div>
            </div>
            <el-divider/>
            <div style="display: flex; align-items: center;">
              <div style="display: flex;  align-items: center; flex-grow: 1">
                <div style="margin-right: 10px;">
                  总金额
                </div>
                <div class="myOrderWrapperPrice">
                  ￥{{ (item.ordTotPrice).toFixed(2) }}
                </div>
              </div>
              <el-button v-if="item.ordStatus === 6"
                @click="gotoOrderEvaluation(item.orderId)">
                评价产品
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import {
  API, ORDER_DETAIL, ORDER_EVALUATION, PAY,
} from '../router/MUrl';

export default {
  name: 'MyOrder',
  data() {
    return {
      urlPay: PAY,
      allProduct: [],
      allOrder: [],
      urlOrderDetail: ORDER_DETAIL,
      urlOrderEvaluation: ORDER_EVALUATION,
      ordStatusSelection: ['已预约', '待付款', '待出库',
        '正在出库', '正在送货', '已送达', '已确认', '已取消'],
    };
  },
  computed: {
    unfinishedOrder() {
      return this.allOrder.filter(ele => ele.ordStatus !== 6);
    },
    finishedOrder() {
      return this.allOrder.filter(ele => ele.ordStatus === 6);
    },
  },
  methods: {
    gotoBack() {
      this.$router.go(-1);
    },
    gotoPay(orderId) {
      this.$router.push(`${this.urlPay}/${orderId}`);
    },
    gotoOrderDetail(item) {
      this.$router.push(`${this.urlOrderDetail}/${item.orderId}`);
    },
    gotoOrderEvaluation(orderId) {
      this.$router.push(`${this.urlOrderEvaluation}/${orderId}`);
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
              this.allProduct[ele.proId] = ele.proName;
            });
            resolve(1);
          }
        });
      });
    },
    queryOrderProduct: async function queryOrderProduct(morderId, item) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/listProductListByOrderId.do`,
          withCredentials: true,
          data: Qs.stringify({
            orderId: morderId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            const tmp = response.data.map(ele => ({
              ...ele,
              proName: this.allProduct[ele.proId],
            }));
            this.allOrder.push({
              ...item,
              product: {
                ...tmp,
              },
            });
            resolve(1);
          }
        });
      });
    },
    queryMyOrder: async function queryMyOrder() {
      await this.queryAllProduct();
      this.$axios({
        method: 'get',
        url: `${API}/order/listOrdersByUser.do`,
        withCredentials: true,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.allOrder = [];
          response.data.forEach((ele) => {
            this.queryOrderProduct(ele.orderId, ele);
          });
        }
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
            this.queryMyOrder();
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
            this.queryMyOrder();
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
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
    this.queryMyOrder();
  },
};
</script>

<style scope>
.myOrderWrapperDiv {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 25px 100px 25px 100px;
}
.myOrderTitle {
  margin-top: 40px;
  font-weight: bold;
}
.myOrderWrapperPrice {
  color: #f64747;
  font-weight: bold;
}
.myOrderOrderTitle {
  font-weight: bold;
  margin-right: 20px;
  transition: color 0.2s;
}
.myOrderOrderTitle:hover {
  color: #409EFF;
  cursor: pointer;
  transition: color 0.2s;
}
</style>
