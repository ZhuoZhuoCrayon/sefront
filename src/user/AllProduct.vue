/* eslint-disable */
<template>
  <div class="AllProductWrapperDiv">
    <el-card class="AllProductWrapperCard" v-loading="isLoading">
      <el-row class="AllProductWrapperRowUp">
        <el-col :span="4" style="display: flex;">
          <el-select v-model="currentSortType" @change="onChangeSortMode">
            <el-option v-for="item in sortTypeSelection" :key="item.value"
            :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" style="display: flex;">
          <el-input
            suffix-icon="el-icon-search"
            v-model="searchContent"
            @change="onChangeSearchContent">
          </el-input>
        </el-col>
        <el-col :offset="12" :span="4" style="display: flex; justify-content: flex-end;">
          <el-button
            :disabled="currentPage === 1"
            @click="gotoPrePage">
            上一页
          </el-button>
          <el-button
            :disabled="currentPage === totalPage"
            @click="gotoNextPage">
            下一页
          </el-button>
        </el-col>
      </el-row>
      <el-card class="AllProductWrapperProductCard"
      v-for="item in productData.slice(startNum, endNum)"
      :key="item.proId">
        <div @click="gotoProduct(item)">
          <el-row class="AllProductWrapperRow">
            <el-col :span="3">
              <img :src="item.proImgUrl" width="120px"/>
            </el-col>
            <el-col :span="16" class="AllProductWrapperCol">
              <div class="AllProductWrapperTitle">
                {{ item.proName }}
              </div>
              <div class="AllProductWrapperDescription">
                {{ item.proDescription}}
              </div>
            </el-col>
            <el-col :span="4" class="AllProductWrapperCol">
              <div class="AllProductWrapperPrice">
                ￥{{ (item.proPrice).toFixed(2) }}
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-row class="AllProductWrapperRowDown">
        <el-col :offset="20" :span="4" style="display: flex; justify-content: flex-end;">
          <el-button
            :disabled="currentPage === 1"
            @click="gotoPrePage">
            上一页
          </el-button>
          <el-button
            :disabled="currentPage === totalPage"
            @click="gotoNextPage">
            下一页
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import Qs from 'qs';
import { PRODUCT, API } from '../router/MUrl';

export default {
  name: 'AllProduct',
  data() {
    return {
      currentSortType: 0,
      sortTypeSelection: [
        {
          label: '默认排序',
          value: 0,
        },
        {
          label: '价格降序',
          value: 1,
        },
        {
          label: '价格升序',
          value: 2,
        },
      ],
      sortMode: [
        (a, b) => (a.proId - b.proId),
        (a, b) => (b.proPrice - a.proPrice),
        (a, b) => (a.proPrice - b.proPrice),
      ],
      searchContent: '',
      currentPage: 1,
      totalPage: 1,
      perPageSize: 6,
      urlProduct: PRODUCT,
      productData: [],
      bakProductData: [],
      isLoading: true,
    };
  },
  computed: {
    startNum() {
      return this.perPageSize * (this.currentPage - 1);
    },
    endNum() {
      return this.perPageSize * this.currentPage;
    },
  },
  methods: {
    gotoProduct(item) {
      this.$router.push(`${this.urlProduct}/${item.proId}`);
    },
    queryCurrentPageContent() {
      this.isLoading = true;
      this.$axios({
        method: 'post',
        url: `${API}/product/listProductSimplesByPage.do`,
        data: Qs.stringify({
          currentPage: 1,
          pageSize: 10000,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.productData = [];
          response.data.itemList.forEach((ele) => {
            this.productData.push({
              proId: ele.proId,
              proName: ele.proName,
              proDescription: ele.previewDescribe,
              proPrice: ele.proPrice,
              proImgUrl: `${API}/${ele.proImgUrl}`,
            });
          });
          this.bakProductData = this.productData;
          this.totalPage = Math.ceil(response.data.itemList.length / this.perPageSize);
          setTimeout(() => { this.isLoading = false; }, 500);
        }
      });
    },
    gotoNextPage() {
      this.currentPage += 1;
    },
    gotoPrePage() {
      this.currentPage -= 1;
    },
    onChangeSortMode() {
      this.productData.sort(this.sortMode[this.currentSortType]);
      this.bakProductData = this.productData;
    },
    onChangeSearchContent() {
      this.productData = this.bakProductData.filter((ele) => {
        const myRe = new RegExp(`${this.searchContent}`);
        return myRe.test(ele.proName);
      });
    },
  },
  mounted() {
    this.queryCurrentPageContent();
  },
};
</script>

<style scope>
.AllProductWrapperDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.AllProductWrapperCard {
  margin-top: 40px;
  width: 90%;
  background-color: #f2f2f2;
}
.AllProductWrapperRowUp {
  margin: 10px 0 20px 0;
  width: 100%;
}
.AllProductWrapperRowDown {
  margin: 20px 0 10px 0;
  width: 100%;
}
.AllProductWrapperProductCard {
  padding: 20px 0 20px 0;
  margin: 20px 0 20px 0;
}
.AllProductWrapperProductCard:hover {
  cursor: pointer;
  transform: translateY(-2%);
  transition: transform 0.3s;
}
.AllProductWrapperCol {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.AllProductWrapperRow {
  display: flex;
  justify-content: center;
}
.AllProductWrapperTitle {
  font-size: larger;
  color: #303133;
  margin: 10px 0 10px 0;
}
.AllProductWrapperDescription {
  color: #606266;
  white-space: pre-line;
  text-align: left;
}
.AllProductWrapperPrice {
  font-size: larger;
  color: #f64747;
  font-weight: bold;
}
</style>
