<template>
  <div class="orderEvaluationWrapperDiv">
    <div>
      <el-page-header @back="gotoBack" content="产品评价"/>
    </div>
    <el-card class="orderEvaluationCard"
    v-for="(item, itemKey) in order.product" :key="item.proId">
      <div>
        <div class="orderEvaluationCardTitle" style="text-align: left">
          {{ item.proName }}
        </div>
        <div>
          <div style="padding: 25px 10px 0 10px; text-align: left;">
            <div style="display: flex; align-items: center;">
              <div style="margin: 0 25px 0 0;">
                给出您的评价：
              </div>
              <div v-for="idx in 5" :key="idx">
                <div v-if="idx <= item.proEvaluation" class="redDot"
                @click="changeEvaluationStar(itemKey, idx)"/>
                <div v-else class="greyDot"
                @click="changeEvaluationStar(itemKey, idx)"/>
              </div>
            </div>
            <div style="margin: 15px 0 0 0; width: 100%">
              <el-input
                style="width: 100%"
                type="textarea"
                :rows="4"
                v-model="item.proEvaluationDescription"
                :disabled="item.disabled">
              </el-input>
            </div>
            <div style="margin: 15px 0 0 0; display: flex; justify-content: flex-end;">
              <div v-if="item.disabled === false">
                <el-button size="mini" disabled> 不想评价 </el-button>
                <el-button type="primary" size="mini"
                @click="queryInsertEvaluation(item, itemKey)"> 提交评价 </el-button>
              </div>
              <div v-else>
                <el-button type="primary" size="mini" disabled> 已提交 </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Qs from 'qs';
import { API } from '../router/MUrl';

export default {
  name: 'OrderEvaluation',
  data() {
    return {
      order: {
        orderId: this.$route.params.orderId,
        allProduct: [],
        product: [
          {
            proId: 'p001',
            proName: '招牌冰酒',
            proEvaluation: 5,
            proEvaluationDescription: '酒非常好',
            disabled: true,
          },
          {
            proId: 'p002',
            proName: '冰酒02号',
            proEvaluation: 1,
            proEvaluationDescription: '',
            disabled: false,
          },
        ],
      },
    };
  },
  methods: {
    changeEvaluationStar(item, idx) {
      if (!this.order.product[item].disabled) {
        this.order.product[item].proEvaluation = idx;
      }
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
    queryOrderProduct: async function queryOrderProduct() {
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
            this.order.product = [];
            response.data.forEach((ele) => {
              this.order.product.push({
                proId: ele.proId,
                proName: this.allProduct[ele.proId],
                proEvaluation: 5,
                proEvaluationDescription: '',
                disabled: false,
              });
            });
            resolve(1);
          }
        });
      });
    },
    queryInsertEvaluation(item, index) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/description/insertEvaluation.do`,
          withCredentials: true,
          data: {
            desBody: item.proEvaluationDescription,
            desHead: '',
            level: item.proEvaluation,
            proId: item.proId,
          },
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
                message: '提交成功',
                type: 'success',
              });
              this.order.product[index].disabled = true;
            }
            resolve(1);
          }
        });
      });
    },
    queryInit: async function queryInit() {
      await this.queryAllProduct();
      this.queryOrderProduct();
    },
    gotoBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.queryInit();
  },
};
</script>

<style scope>
.orderEvaluationWrapperDiv {
  padding: 25px 100px 25px 100px;
}
.orderEvaluationCard {
  margin: 30px 0 30px 0;
  width: 100%;
}
.orderEvaluationCardTitle {
  color: #303133;
  font-weight: bold;
}

.orderDetailProductTitle {
  font-size: larger;
  margin: 0 0 10px 0;
}
.redDot {
  width: 7px;
  height: 7px;
  border-radius: 10px;
  margin: 2px;
  background-color: #f64747;
}
.greyDot {
  width: 7px;
  height: 7px;
  border-radius: 10px;
  margin: 2px;
  background-color: #c7c7c7;
}
.redDot:hover {
  cursor: pointer;
}
.greyDot {
  cursor: pointer;
}
</style>
