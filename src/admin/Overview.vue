<template>
  <el-container style="padding: 2%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="4">
        <AdminNavBar/>
      </el-col>
      <el-col :span="20">
        <el-row :gutter="20" style="margin-bottom: 30px;">
          <el-col :span="8">
            <el-card>
              <div id="statNumWrapperDiv">
                <div id="statNumDiv" style="color: #409EFF;">
                    {{ todayTotalPrice }}￥
                </div>
                <div id="statNumIllDiv">
                    今日总销额
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <div id="statNumWrapperDiv">
                <div id="statNumDiv" style="color: #67C23A;">
                    {{ todayTotalNums }}
                </div>
                <div id="statNumIllDiv">
                    今日总销量
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <div id="statNumWrapperDiv">
                <div id="statNumDiv" style="color: #E6A23C;">
                    {{ todayNewCustomerNums }}
                </div>
                <div id="statNumIllDiv">
                    今日总新增用户
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 30px;">
          <el-col :span="24">
            <el-card>
              <div id="statNumWrapperDiv">
                <el-row v-for="item in topFiveProduct" :key="item.proName"
                style="margin: 15px 15px 25px 15px;">
                    <el-col :span="4">
                    {{ item.proName }}
                    </el-col>
                    <el-col :span="19">
                    <el-progress :text-inside="true" :stroke-width="24"
                    :percentage="item.percentage" status="success"></el-progress>
                    </el-col>
                </el-row>
                <div id="statNumIllDiv">
                    今日 Top5 产品
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card>
              <div id="statNumWrapperDiv">
                <el-row v-for="item in todayFiveEmployee" :key="item.name"
                style="margin: 15px 15px 25px 15px;">
                    <el-col :span="4">
                    {{ item.userName }}
                    </el-col>
                    <el-col :span="19">
                    <el-progress :text-inside="true" :stroke-width="24"
                    :percentage="item.percentage" status="default"></el-progress>
                    </el-col>
                </el-row>
                <div id="statNumIllDiv">
                    今日 Top5 员工
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import Qs from 'qs';
import AdminNavBar from './AdminNavBar.vue';
import { API } from '../router/MUrl';

export default {
  name: 'Overview',
  data() {
    return {
      todayTotalPrice: 0,
      todayTotalNums: 0,
      todayNewCustomerNums: 0,
      topFiveProduct: [],
      todayFiveEmployee: [],
    };
  },
  methods: {
    queryTodayTotalNums() {
      this.$axios({
        method: 'get',
        url: `${API}/order/getSalesDaily.do`,
        withCredentials: true,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.todayTotalNums = response.data;
        }
      });
    },
    queryCntUsers() {
      this.$axios({
        method: 'get',
        url: `${API}/customer/countRegisterCusDaily.do`,
        withCredentials: true,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.todayNewCustomerNums = response.data;
        }
      });
    },
    querySalesPriceDaily() {
      this.$axios({
        method: 'get',
        url: `${API}/order/getSalesPriceDaily.do`,
        withCredentials: true,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.todayTotalPrice = response.data;
        }
      });
    },
    queryTopSalesProduct() {
      this.$axios({
        method: 'post',
        url: `${API}/order/listTopSalesProductsDaily.do`,
        withCredentials: true,
        data: Qs.stringify({
          n: 5,
        }),
      }).then((response) => {
        let sum = 0;
        response.data.forEach((ele) => {
          sum += ele.sales;
        });
        this.topFiveProduct = response.data.map(ele => ({
          ...ele,
          percentage: ((sum ? ele.sales / sum : 0) * 100).toFixed(2),
        }));
      });
    },
    queryTopSalesEmployee() {
      this.$axios({
        method: 'get',
        url: `${API}/employee/listAllEmployee.do`,
        withCredentials: true,
      }).then((response) => {
        let tmpArr = response.data;
        tmpArr.sort((a, b) => (b.empWorkload - a.empWorkload));
        tmpArr = tmpArr.slice(0, 5);
        let sum = 0;
        tmpArr.forEach((ele) => {
          sum += ele.empWorkload;
        });
        this.todayFiveEmployee = tmpArr.map(ele => ({
          ...ele,
          percentage: ((sum ? ele.empWorkload / sum : 0) * 100).toFixed(2),
        }));
      });
    },
    queryInit() {
      this.querySalesPriceDaily();
      this.queryTodayTotalNums();
      this.queryTopSalesProduct();
      this.queryTopSalesEmployee();
      this.queryCntUsers();
    },
  },
  mounted() {
    this.queryInit();
  },
  components: {
    AdminNavBar,
  },
};
</script>

<style>
#statNumDiv {
  font-size: 42px;
  font-weight: bold;
}
#statNumIllDiv {
  margin-top: 10px;
  font-size: small;
  font-weight: bold;
}
#statNumWrapperDiv {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
