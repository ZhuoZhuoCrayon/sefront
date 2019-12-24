<template>
  <div class="productDetailWrapperDiv">
    <div>
      <el-page-header @back="gotoBack" content="产品描述"/>
    </div>
    <div>
      <img v-for="url in imgUrlSet" :key="url" :src="url" width="790">
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import { API } from '../router/MUrl';

export default {
  name: 'ProductDetail',
  data() {
    return {
      proId: this.$route.params.proId,
      imgUrlSet: [],
    };
  },
  methods: {
    queryImgUrlSet() {
      this.$axios({
        method: 'post',
        url: `${API}/description/listProductDescribeImgsByProId.do`,
        data: Qs.stringify({
          proId: this.proId,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.imgUrlSet = response.data.map(ele => `${API}/${ele}`);
        }
      });
    },
    gotoBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.queryImgUrlSet();
  },
};
</script>

<style scope>
.productDetailWrapperDiv {
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
