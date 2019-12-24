<template>
  <el-container style="padding: 2%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="4">
        <AdminNavBar/>
      </el-col>
      <el-col :span="20">
        <el-card>
          <el-row style="height: 40px">
            <el-col :span="19" style="display: flex; align-items: center; height: 100%">
              <h3 style="display: flex; "> 送货管理 </h3>
            </el-col>
            <el-col :span="5">
              <el-input
                suffix-icon="el-icon-search"
                v-model="searchInput"
                @change="onChangeSearch">
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <div style="min-height: 400px">
              <el-table
                ref="multipleTable"
                :data="tableData.slice(startNum, endNum)"
                tooltip-effect="dark"
                style="width: 100%;"
                :default-sort = "{prop: 'orderId', order: 'ascending'}">
                <el-table-column v-if="isMultiSelection"
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="订单ID"
                  prop="orderId"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.orderId }}</template>
                </el-table-column>
                <el-table-column
                  label="收件人"
                  prop="userName"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column
                  label="日期"
                  prop="ordCreationTime"
                  sortable
                  width="150">
                  <template slot-scope="scope">{{ scope.row.ordCreationTime }}</template>
                </el-table-column>
                <el-table-column
                  label="地址"
                  prop="destination"
                  sortable
                  width="350">
                  <template slot-scope="scope">{{ scope.row.destination }}</template>
                </el-table-column>
                <el-table-column
                  label="状态"
                  prop="ordStatus"
                  sortable>
                  <template slot-scope="scope">{{ scope.row.ordStatus }}</template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="150">
                  <template slot-scope="scope">
                    <el-button @click="queryFinishTransporting(scope.row.orderId)" type="text"
                    size="small">完成送货</el-button>
                    <el-button type="text" size="small" disabled>删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              layout="prev, pager, next"
              :page-count="totalPage"
              :current-page.sync="currentPage">
            </el-pagination>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import Qs from 'qs';
import AdminNavBar from './AdminNavBar.vue';
import { API } from '../router/MUrl';

export default {
  name: 'TransportManage',
  data() {
    return {
      searchInput: '',
      isMultiSelection: false,
      ordStatusSelection: ['已预约', '待付款', '待出库',
        '正在出库', '正在送货', '已送达', '已确认', '已取消'],
      customers: [],
      tableData: [],
      bakTableData: [],
      currentPage: 1,
      perPageSize: 10,
      totalPage: 1,
    };
  },
  computed: {
    startNum() {
      return (this.currentPage - 1) * this.perPageSize;
    },
    endNum() {
      return this.currentPage * this.perPageSize;
    },
  },
  methods: {
    onChangeSearch() {
      const myRe = new RegExp(this.searchInput);
      this.tableData = this.bakTableData.filter(ele => myRe.test(ele.destination));
      this.totalPage = Math.ceil(this.tableData.length / this.perPageSize);
    },
    queryFinishTransporting(orderId) {
      this.$axios({
        method: 'post',
        url: `${API}/order/delivered.do`,
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
            this.queryInit();
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          }
        }
      });
    },
    queryCustomer() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'get',
          url: `${API}/customer/listAllCustomer.do`,
          withCredentials: true,
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.customers = [];
            response.data.forEach((ele) => {
              this.customers[ele.userId] = ele.userName;
            });
            resolve(1);
          }
        });
      });
    },
    queryTrans(item) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/getTransportationByTransId.do`,
          withCredentials: true,
          data: Qs.stringify({
            transId: item.transId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.bakTableData.push({
              ...item,
              ...response.data,
            });
            resolve(1);
          }
        });
      });
    },
    queryContent: async function queryContent() {
      await this.queryCustomer();
      this.$axios({
        method: 'get',
        url: `${API}/order/listAllOrders.do`,
        data: Qs.stringify({
          currentPage: 1,
          pageSize: 10000,
        }),
        withCredentials: true,
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.bakTableData = [];
          response.data.filter(ele => ele.ordStatus === 4).forEach((ele) => {
            const item = {
              ...ele,
              userName: this.customers[ele.userId],
            };
            this.queryTrans(item);
          });
          this.totalPage = Math.ceil(this.bakTableData.length / this.perPageSize);
          this.tableData = this.bakTableData;
        }
      });
    },
    queryInit() {
      this.queryContent();
    },
    changeIsMultiSelection() {
      this.isMultiSelection = !this.isMultiSelection;
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
