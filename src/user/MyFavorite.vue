<template>
  <div class="myFavoriteWrapperDiv">
    <div>
      <el-page-header @back="gotoBack" content="我的收藏"/>
    </div>
    <div style="width: 100%;">
      <div style="display: flex; justify-content: start;" v-for="k of iteratorNums" :key="k">
        <el-card v-for="item in favorite.slice(3 * (k - 1), 3 * k)"
        :key="item.proId" class="myFavoriteCard">
          <div style="padding: 25px;" @click="gotoProduct(item)">
            <div>
              <img :src="item.proImgUrl" width="150px">
            </div>
            <div>
              <div class="myFavoriteWrapperPrice" style="margin: 20px 0 10px 0;">
                ￥{{ (item.proPrice).toFixed(2) }}
              </div>
            </div>
            <div>
              <div> {{ item.proName }} </div>
            </div>
          </div>
        </el-card>
      </div>
      <div style="margin: 20px 0 0 0; display: flex; justify-content: space-between">
        <div>
          <el-button @click="gotoPrePage" :disabled="currentPage == 1"> 上一页 </el-button>
        </div>
        <div>
          <el-button @click="gotoNextPage" :disabled="currentPage == totalPage"> 下一页 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import img from '../assets/wine.png';
import { PRODUCT, API } from '../router/MUrl';

export default {
  name: 'MyFavorite',
  data() {
    return {
      urlProduct: PRODUCT,
      imgTmp: img,
      currentPage: 1,
      totalPage: 1,
      allProduct: [],
      favorite: [],
    };
  },
  computed: {
    iteratorNums() {
      const k = 2 * (this.currentPage - 1);
      return [k + 1, k + 2];
    },
  },
  methods: {
    changeIsMultiSelection() {
      this.isMultiSelection = !this.isMultiSelection;
    },
    gotoAdd() {
      this.$router.push(this.urlEdit);
    },
    gotoPrePage() {
      this.currentPage -= 1;
    },
    gotoNextPage() {
      this.currentPage += 1;
    },
    gotoBack() {
      this.$router.go(-1);
    },
    gotoOrderDetail(item) {
      this.$router.push(`${this.urlOrderDetail}/${item.ordId}`);
    },
    gotoProduct(item) {
      this.$router.push(`${this.urlProduct}/${item.proId}`);
    },
    queryFavorite: async function queryFavorite() {
      await this.queryAllProduct();
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
          this.favorite = this.allProduct.filter(ele => !!response.data.find(t2 => `${t2}` === `${ele.proId}`));
          this.totalPage = Math.ceil(this.favorite.length / 6);
        }
      });
    },
    queryAllProduct() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/product/listProductSimplesByPage.do`,
          data: Qs.stringify({
            currentPage: 1,
            pageSize: 100000,
          }),
          withCredentials: true,
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.allProduct = response.data.itemList.map(ele => (
              {
                proId: ele.proId,
                proName: ele.proName,
                proPrice: ele.proPrice,
                proImgUrl: `${API}/${ele.proImgUrl}`,
              }
            ));
            resolve(1);
          }
        });
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
    this.queryFavorite();
  },
};
</script>

<style scope>
.myFavoriteWrapperDiv {
  padding: 25px 100px 25px 100px;
}
.myFavoriteWrapperPrice {
  color: #f64747;
  font-weight: bold;
}
.myFavoriteCard {
  margin: 15px;
  width: 400px;
}
.myFavoriteCard:hover {
  cursor: pointer;
  transform: translateY(-2%);
  transition: transform 0.3s;
}
</style>
