<template>
  <div class="wrapperDiv" v-loading="isLoading">
    <el-row :gutter="20" style="width: 100%; margin-top: 80px; padding: 0px 100px 0px 50px;">
      <el-col :span="8">
        <el-carousel height="300px">
          <el-carousel-item>
            <img :src="product.proImgUrl" width="250px"/>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="16" class="wrapperCol">
        <el-row style="width: 100%">
          <el-col :span="12">
            <div class="wrapperTitle">
              {{ product.proName }}
            </div>
            <div class="wrapperDescription">
              {{ product.proCoverDescription }}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="wrapperPriceInDetailProduct">
              ￥{{ (product.proPrice).toFixed(2) }}
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row
        style="width: 100%; display: flex; align-items: center; margin: 5px 0 5px 0"
        v-for="item in product.proActivities"
        :key="item">
          <el-tag type="primary">活动</el-tag>
          <div style="margin-left: 10px;"> {{ item }} </div>
        </el-row>
        <el-divider></el-divider>
        <el-card style="width: 100%; min-height: 200px;">
          <el-tabs v-model="tabActive">
            <el-tab-pane label="产品明细" name="tabProDetail">
              <el-row v-for="item in product.proDescription" :key="item.desHead" :gutter="40"
              style="margin: 10px 0 10px 0;">
                <el-col :span="4" style="text-align: right;">
                  {{ item.desHead }}:
                </el-col>
                <el-col :span="20" style="text-align: left;">
                  {{ item.desBody }}
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="产品评价" name="tabProEvaluation">
              <div style="overflow: auto; max-height: 400px;">
              <div v-for="item in product.proEvaluation" :key="item.userName"
              style="margin: 5px 0 40px 0">
                <el-row style="width: 100%; display: flex; align-items: center" :gutter="20">
                  <el-col :span="2">
                    <el-tag :type="(item.levelName === 'SVIP' ? 'danger' :
                    (item.levelName === 'VIP') ? 'warning' : 'default')"
                    style="width: 100%;">
                      {{ item.levelName }}
                    </el-tag>
                  </el-col>
                  <el-col :span="3" style="text-align: left; font-weight: bold;">
                    {{ item.userName }}
                  </el-col>
                  <el-col :span="8" style="display: flex;">
                    <div v-for="idx in 5" :key="idx">
                      <div v-if="idx <= item.ordEvaluation" class="redDot"/>
                      <div v-else class="greyDot"/>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20" :offset="2" style="text-align: left; color: #606266">
                    {{ item.ordDescription }}
                  </el-col>
                </el-row>
              </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <el-row style="display: flex; justify-content: flex-end; width: 100%;
        margin: 20px 0 20px 0">
          <el-button v-if="!isFavorite" @click="onChangeFavorite"> 收藏 </el-button>
          <el-button v-else type="info" @click="onChangeFavorite"> 已收藏 </el-button>
          <el-button @click="gotoDetail"> 查看详情 </el-button>
        </el-row>
        <el-row style="display: flex; justify-content: flex-end; width: 100%;
        margin: 20px 0 20px 0">
          <el-input-number v-model="buyNums" :min="1" style="margin-right: 20px;"/>
          <el-button type="primary" @click="queryAddInShopcart"> 加入购物车 </el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Qs from 'qs';
import { API, PRODUCT_DETAIL, ORDER_EVALUATION } from '../router/MUrl';

export default {
  name: 'Product',
  data() {
    return {
      urlProductDetail: PRODUCT_DETAIL,
      urlOrderEvaluation: ORDER_EVALUATION,
      tabActive: 'tabProDetail',
      buyNums: 1,
      isFavorite: false,
      isLoading: true,
      product: {
        proId: this.$route.params.proId,
        proCoverDescription: '',
        proActivities: [],
        proPrice: 0,
        proDescription: [],
        proEvaluation: [],
      },
    };
  },
  methods: {
    gotoDetail() {
      this.$router.push(`${this.urlProductDetail}/${this.product.proId}`);
    },
    queryProductDescription() {
      this.$axios({
        method: 'post',
        url: `${API}/description/listProductDescribes.do`,
        data: Qs.stringify({
          proId: this.product.proId,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.product.proDescription = response.data;
        }
      });
    },
    queryProductInfo() {
      this.$axios({
        method: 'post',
        url: `${API}/product/getProductDetailById.do`,
        data: Qs.stringify({
          proId: this.product.proId,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.product.proName = response.data.proName;
          this.product.proPrice = response.data.proPrice;
          this.product.proImgUrl = `${API}/${response.data.proImgUrl}`;
          this.product.proActivities = [
            response.data.preferentialMethod.preCDescribe,
          ];
          this.product.proCoverDescription = response.data.previewDescribe;
        }
      });
    },
    queryProductEvaluation() {
      this.$axios({
        method: 'post',
        url: `${API}/description/listProductEvaluationsByProId.do`,
        data: Qs.stringify({
          proId: this.product.proId,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.product.proEvaluation = [];
          response.data.forEach((ele) => {
            this.product.proEvaluation.push({
              userName: ele.userName,
              levelName: ele.levelName,
              ordEvaluation: ele.level,
              ordDescription: ele.desBody,
            });
          });
        }
      });
    },
    queryAddInShopcart() {
      this.$axios({
        method: 'post',
        url: `${API}/shoppingCart/insertShoppingCart.do`,
        data: Qs.stringify({
          proId: this.product.proId,
          purQuantity: this.buyNums,
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
              message: '已加入购物车',
              type: 'success',
            });
          }
        }
      });
    },
    queryProInFavorite() {
      this.$axios({
        method: 'get',
        url: `${API}/favorite/listFavoriteProducts.do`,
        withCredentials: true,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.isFavorite = !!response.data.find(element => `${element}` === this.product.proId);
        }
      });
    },
    onChangeFavorite() {
      const cUrl = [
        `${API}/favorite/insertFavoriteProduct.do`,
        `${API}/favorite/deleteFavoriteProduct.do`,
      ];
      this.$axios({
        method: 'post',
        url: cUrl[this.isFavorite ? 1 : 0],
        withCredentials: true,
        data: Qs.stringify({
          proId: this.product.proId,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.queryProInFavorite();
        }
      });
    },
  },
  mounted() {
    if (this.$store.getters.getUserIsAdmin === 'true') {
      this.$message({
        message: '管理员不可进入此页面',
        type: 'error',
      });
      this.$router.go(-1);
      return;
    }
    this.queryProductInfo();
    this.queryProductDescription();
    this.queryProductEvaluation();
    this.queryProInFavorite();
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  },
};
</script>

<style scope>
.wrapperDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wrapperCard {
  margin-top: 40px;
  width: 90%;
  background-color: #f2f2f2;
}
.wrapperCol {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.el-carousel__button {
  background-color: #383838;
}
.wrapperDescription {
  color: #606266;
  white-space: pre-line;
  text-align: left;
}
.wrapperTitle {
  font-size: x-large;
  font-weight: bold;
  letter-spacing: 2px;
  color: #303133;
  margin: 10px 0 10px 0;
  text-align: left;
}
.wrapperPriceInDetailProduct {
  color: #f64747;
  text-align: right;
  font-size: xx-large;
  font-weight: bold;
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
</style>
