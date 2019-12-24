<template>
  <div class="shopcartWrapperDiv">
    <el-row style="width: 100%; display: flex; align-items: center; justify-content: center;">
      <div class="shopcartWrapperTransDiv">
        <el-row style="width: 100%; display: flex; align-items: center;">
          <el-col :span="4">
            <img src="../assets/location.png" width="50px"/>
          </el-col>
          <el-col :span="18" style="text-align: left;">
            <div class="shopcartWrapperUserName"> {{ userName }} </div>
            <div class="shopcartWrapperTransLoc"> {{ address }} </div>
          </el-col>
          <el-col :span="2" style="text-align: left;">
            <el-button type="text"
            @click="gotoUpdateUserInfo">修改</el-button>
          </el-col>
        </el-row>
      </div>
    </el-row>
    <div style="width: 100%" v-loading="isLoading">
    <el-divider></el-divider>
    <div class="shopcartWrapperProductDiv" v-for="item in shopcart.product" :key="item.proId">
      <div style="margin: 30px 0 30px 0;">
        <el-row class="shopcartWrapperRow">
          <el-col :span="1">
            <el-checkbox v-model="item.isSelected"/>
          </el-col>
          <el-col :span="3">
            <img :src="item.src" width="120px"/>
          </el-col>
          <el-col :span="12" class="shopcartWrapperCol">
            <div class="shopcartWrapperTitle">
              {{ item.proName }}
            </div>
            <div style="display: flex; align-items: center;">
              <div>购买数量：</div>
              <el-input-number v-model="item.purQuantity" :min="1"
              @change="onChangeItemNum(item)">
              </el-input-number>
            </div>
          </el-col>
          <el-col :span="6" class="shopcartWrapperCol">
            <div class="shopcartWrapperPrice">
              ￥{{ (item.favorableTotPrice).toFixed(2) }}
            </div>
            <div style="color: #909399">
              已优惠：￥{{ (item.proReduce + item.userReduce).toFixed(2) }}
            </div>
          </el-col>
          <el-col :span="2" class="shopcartWrapperCol">
            <el-button type="text" @click="removeItem(item)">删除</el-button>
          </el-col>
        </el-row>
      </div>
      <el-divider/>
    </div>
    <el-row class="shopcartWrapperRowRight" style="color: #909399">
      <el-col :offset="18" :span="2" style="text-align: right">
        已优惠:
      </el-col>
      <el-col :span="4" style="text-align: right">
        ￥{{ (discnt).toFixed(2) }}
      </el-col>
    </el-row>
    <el-row class="shopcartWrapperRowRight">
      <el-col :offset="18" :span="2" style="text-align: right">
        共需支付:
      </el-col>
      <el-col :span="4" style="text-align: right" class="shopcartWrapperPrice">
        ￥{{ (price).toFixed(2) }}
      </el-col>
    </el-row>
    <el-row class="shopcartWrapperRowRight" style="margin-top: 60px;">
      <el-button @click="removeAllItem"
      :disabled="shopcart.product.length === 0 || isPaying"> 清空购物车 </el-button>
      <el-button type="primary" @click="gotoPay"
      :disabled="shopcart.product.length === 0 || isPaying"> 去支付 </el-button>
    </el-row>
  </div>
  </div>
</template>

<script>
import Qs from 'qs';
import { PAY, API, USER_SETTING } from '../router/MUrl';

export default {
  name: 'Shopcart',
  data() {
    return {
      urlPay: PAY,
      urlUserSetting: USER_SETTING,
      userName: '',
      address: '',
      isLoading: true,
      isPaying: false,
      shopcart: {
        product: [],
      },
      orderId: -1,
    };
  },
  computed: {
    price() {
      let sum = 0;
      this.shopcart.product.forEach((ele) => {
        if (ele.isSelected) {
          sum += ele.favorableTotPrice;
        }
      });
      return sum;
    },
    discnt() {
      let sum = 0;
      this.shopcart.product.forEach((ele) => {
        if (ele.isSelected) {
          sum += (ele.proReduce + ele.userReduce);
        }
      });
      return sum;
    },
  },
  methods: {
    queryCreateOrder() {
      const reqData = this.shopcart.product.filter(ele => (ele.isSelected)).map(
        ele => ele.proListId,
      );
      this.isPaying = true;
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/createOrder.do`,
          data: reqData,
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
              this.orderId = response.data.plusParams.orderId;
            }
            this.isPaying = false;
            resolve(1);
          }
        });
      });
    },
    gotoUpdateUserInfo() {
      this.$router.push(this.urlUserSetting);
    },
    gotoPay: async function gotoPay() {
      if (!this.address || this.address === '') {
        this.$message({
          message: '您还没有填写您的邮寄地址，点击修改填写！',
          type: 'error',
        });
        return;
      }
      await this.queryCreateOrder();
      this.$message({
        message: '订单已创建！',
        type: 'success',
      });
      this.$router.push(`${this.urlPay}/${this.orderId}`);
    },
    recoverLoading() {
      setTimeout(() => { this.isLoading = false; }, 300);
    },
    queryMyInfo() {
      return new Promise((resolve) => {
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
            this.userName = response.data.userName;
            this.address = response.data.address;
            resolve(1);
          }
        });
      });
    },
    queryNameImgProduct: async function queryNameImgProduct(proId) {
      let obj = {};
      await new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/product/getProductDetailById.do`,
          data: Qs.stringify({
            proId: proId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            obj = {
              src: `${API}/${response.data.proImgUrl}`,
              proName: response.data.proName,
            };
            resolve(1);
          }
        });
      });
      return obj;
    },
    queryShopcart() {
      this.$axios({
        method: 'get',
        url: `${API}/shoppingCart/listUserShoppingCart.do`,
        withCredentials: true,
      }).then(async (response) => {
        const tmpBucket = [];
        const promiseBucket = [];
        for (let i = 0; i < response.data.length; i += 1) {
          const ele = response.data[i];
          promiseBucket.push(new Promise(async (resolve) => {
            let baseObj = {
              isSelected: true,
              ...ele,
              proReduce: parseFloat(ele.proReduce),
              userReduce: parseFloat(ele.userReduce),
            };
            const obj = await this.queryNameImgProduct(ele.proId);
            baseObj = {
              ...baseObj,
              ...obj,
            };
            tmpBucket.push(baseObj);
            resolve(1);
          }));
        }
        await Promise.all(promiseBucket);
        tmpBucket.sort((a, b) => a.proId - b.proId);
        this.shopcart.product = tmpBucket;
        this.recoverLoading();
      });
    },
    onChangeItemNum(item) {
      this.$axios({
        method: 'post',
        url: `${API}/shoppingCart/updateShoppingCart.do`,
        withCredentials: true,
        data: Qs.stringify({
          proId: item.proId,
          purQuantity: item.purQuantity,
        }),
      }).then(() => {
        this.isLoading = true;
        this.queryShopcart();
        this.recoverLoading();
      });
    },
    removeItem(item) {
      this.$axios({
        method: 'post',
        url: `${API}/shoppingCart/deleteShoppingCartByProListId.do`,
        withCredentials: true,
        data: Qs.stringify({
          proListId: item.proListId,
        }),
      }).then(() => {
        this.isLoading = true;
        this.queryShopcart();
        this.recoverLoading();
      });
    },
    removeAllItem() {
      this.$axios({
        method: 'get',
        url: `${API}/shoppingCart/clearShoppingCart.do`,
        withCredentials: true,
      }).then(() => {
        this.isLoading = true;
        this.queryShopcart();
        this.recoverLoading();
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
    if (this.$store.getters.getUserIsAdmin !== 'false') {
      this.$message({
        message: '管理员不可进入此页面',
        type: 'error',
      });
      this.$router.push('/');
      return;
    }
    this.queryMyInfo();
    this.queryShopcart();
  },
};
</script>

<style scope>
.shopcartWrapperDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 100px 25px 100px;
}
.wrapperCard {
  margin-top: 40px;
  width: 90%;
  background-color: #f2f2f2;
}
.shopcartWrapperCol {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.shopcartWrapperTransDiv {
  border-style: solid;
  border-width: 1.5px;
  border-color: #3f3f3f;
  background-color: #f0f0f0;
  padding: 20px;
  margin: 20px 0 40px 0;
  height: 60px;
  display: flex;
  align-items: center;
  width: 100%;
}
.shopcartWrapperUserName {
  font-size: large;
  letter-spacing: 2px;
  font-weight: bold;
  margin: 5px 0 5px 0;
}
.shopcartWrapperTransLoc {
  color: #606266;
}
.shopcartWrapperRow {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.shopcartWrapperTitle {
  font-size: larger;
  color: #303133;
  margin: 10px 0 20px 0;
}
.shopcartWrapperProductDiv {
  width: 100%;
}
.shopcartWrapperPrice {
  font-size: larger;
  color: #f64747;
  font-weight: bold;
}
.shopcartWrapperRowRight {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 5px 0 5px 0;
}
</style>
