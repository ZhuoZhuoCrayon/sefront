<template>
  <div class="homepageWrapperDiv">
    <el-row style="width: 100%;">
      <el-col :span="24" class="bgDiv">
        <div class="bgTitle">
          SHOP·冰酒商店
        </div>
        <div class="bgSubTitle">
          百年老店 优惠价格 极致体验
        </div>
      </el-col>
    </el-row>
    <el-row style="width: 100%; display: flex; align-items: center;">
      <el-col :offset="4" :span="16" style="display: flex; align-items: center;
      justify-content: center;">
        <div class="horLine"/>
        <div class="sectionTitle">
           热销产品
        </div>
        <div class="horLine"/>
      </el-col>
      <el-col :span="3" >
        <div class="sectionMore" @click="gotoAllProduct">
           更多 >
        </div>
      </el-col>
    </el-row>
    <el-row style="width: 80%; margin-bottom: 100px;">
      <el-col :span="8" v-for="item in tableUp" :key="item.proId">
        <div class="homePageProductDiv" @click="gotoProduct(item)">
          <img :src="item.src" width="150"/>
          <div class="wrapperPriceText"> ￥{{ (item.proPrice).toFixed(2) }} </div>
          <div> {{ item.proName }} </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="width: 80%">
      <el-col :span="8" v-for="item in tableDown" :key="item.proId">
        <div class="homePageProductDiv" @click="gotoProduct(item)">
          <img :src="item.src" width="150"/>
          <div class="wrapperPriceText"> ￥{{ (item.proPrice).toFixed(2) }} </div>
          <div> {{ item.proName }} </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="display: flex; align-items: center;">
        <div class="horLine"/>
        <div class="sectionTitle">
           关于我们
        </div>
        <div class="horLine"/>
      </el-col>
    </el-row>
    <el-row :gutter="40" style="width: 80%;">
      <el-col :span="6" v-for="item in aboutUsContent" :key="item.title">
        <div class="aboutUsBlockDiv">
          <div class="aboutUsBlockTitle">
            {{ item.title }}
          </div>
          <div class="aboutUsBlockContent">
            {{ item.content }}
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Qs from 'qs';
import { API, ALL_PRODUCT, PRODUCT } from '../router/MUrl';

export default {
  name: 'Homepage',
  data() {
    return {
      urlAllProduct: ALL_PRODUCT,
      urlProduct: PRODUCT,
      tableUp: [],
      tableDown: [],
      aboutUsContent: [
        {
          title: '优',
          content: '产地优选，材料优选',
        },
        {
          title: '严',
          content: '严格把关，安全保障',
        },
        {
          title: '快',
          content: '物流飞快，飞速直达',
        },
        {
          title: '心',
          content: '用心服务，自然体贴',
        },
      ],
    };
  },
  methods: {
    gotoAllProduct() {
      this.$router.push(this.urlAllProduct);
    },
    gotoProduct(item) {
      this.$router.push(`${this.urlProduct}/${item.proId}`);
    },
    queryProduct() {
      this.$axios({
        method: 'post',
        url: `${API}/product/listProductSimplesByPage.do`,
        data: Qs.stringify({
          currentPage: 1,
          pageSize: 1000000,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          const listItem = response.data.itemList;
          listItem.sort((a, b) => (parseInt(b.sales, 10) - parseInt(a.sales, 10)));
          this.tableUp = [];
          for (let i = 0; i < 3; i += 1) {
            this.tableUp.push({
              proId: listItem[i].proId,
              proName: listItem[i].proName,
              src: `${API}/${listItem[i].proImgUrl}`,
              proPrice: parseFloat(listItem[i].proPrice),
            });
          }
          for (let i = 3; i < 6; i += 1) {
            this.tableDown.push({
              proId: listItem[i].proId,
              proName: listItem[i].proName,
              src: `${API}/${listItem[i].proImgUrl}`,
              proPrice: parseFloat(listItem[i].proPrice),
            });
          }
        }
      });
    },
  },
  mounted() {
    this.queryProduct();
  },
};
</script>

<style scope>
.homepageWrapperDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.aboutUsBlockDiv {
  border: black;
  border-style: solid;
  padding: 25px;
  height: 100%;
}
.aboutUsBlockTitle {
  color: #303133;
  font-size: 42px;
  font-family: '宋体';
  margin: 5px;
}
.aboutUsBlockContent {
  color: #606266;
}
.sectionTitle {
  margin-top: 150px;
  margin-bottom: 50px;
  letter-spacing: 4px;
  color: #303133;
  font-size: larger;
  font-weight: bold;
}
.sectionMore {
  margin-top: 150px;
  margin-bottom: 50px;
  letter-spacing: 4px;
  color: #303133;
  font-size: larger;
  font-weight: bold;
  transition: color 0.2s;
}
.sectionMore:hover {
  color: #409EFF;
  cursor: pointer;
}
.horLine {
  margin-top: 150px;
  margin-bottom: 50px;
  height: 3px;
  width: 50px;
  background-color: black;
  margin-left: 20px;
  margin-right: 20px;
}
.wrapperPriceText {
  color: #F64747;
  font-size: larger;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
}
.bgDiv {
  height: 450px;
  background-image: url(../assets/ice-wine-bg.jpg);
  background-color: #00000059;
  background-blend-mode: multiply;
  background-size: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.bgTitle {
  font-size: 36px;
  letter-spacing: 15px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.bgSubTitle {
  font-size: 16px;
  letter-spacing: 25px;
  font-weight: 100;
}
.homePageProductDiv {
  padding-top: 40px;
  padding-bottom: 40px;
  border-radius: 5px;
  transition: box-shadow 0.3s;
}
.homePageProductDiv:hover {
  cursor: pointer;
  box-shadow: 0px 0px 10px #888;
  transition: box-shadow 0.15s;
}
</style>
