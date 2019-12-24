<template>
  <el-container style="padding: 2%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="4">
        <AdminNavBar/>
      </el-col>
      <el-col :span="20">
        <el-card>
          <el-row style="height: 40px">
            <el-col :span="16" style="display: flex; align-items: center; height: 100%">
              <h3 style="display: flex; "> 订单管理 </h3>
            </el-col>
            <el-col :span="5">
              <el-input
                suffix-icon="el-icon-search"
                v-model="searchInput"
                @change="onChangeSearch">
              </el-input>
            </el-col>
            <el-col :span="3">
              <el-button icon="el-icon-plus" @click="gotoAdd"></el-button>
              <el-button icon="el-icon-s-operation" @click="changeIsMultiSelection"></el-button>
            </el-col>
          </el-row>
          <el-row>
            <div style="min-height: 400px">
              <el-table
                ref="multipleTable"
                :data="tableData.slice(startNum, endNum)"
                tooltip-effect="dark"
                style="width: 100%;"
                :default-sort = "{prop: 'orderId', order: 'ascending'}"
                @selection-change="handleSelectionChange">
                <el-table-column v-if="isMultiSelection"
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="ID"
                  prop="orderId"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.orderId }}</template>
                </el-table-column>
                <el-table-column
                  label="购买客户"
                  prop="userName"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column
                  label="订单金额"
                  prop="ordTotPrice"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.ordTotPrice }}</template>
                </el-table-column>
                <el-table-column
                  label="日期"
                  prop="ordCreationTime"
                  sortable
                  width="180">
                  <template slot-scope="scope">{{ timestampsToTime(scope.row.ordCreationTime) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态"
                  prop="ordStatus"
                  sortable>
                  <template slot-scope="scope">{{ ordStatusSelection[scope.row.ordStatus] }}
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button @click="gotoUpdate(scope.row.orderId)" type="text"
                    size="small">修改</el-button>
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
import { ORDER_MANAGE_DETAIL, API } from '../router/MUrl';

export default {
  name: 'OrderManage',
  data() {
    return {
      searchInput: '',
      isMultiSelection: false,
      currentPage: 1,
      perPageSize: 10,
      totalPage: 1,
      urlEdit: ORDER_MANAGE_DETAIL,
      ordStatusSelection: ['已预约', '待付款', '待出库',
        '正在出库', '正在送货', '已送达', '已确认', '已取消'],
      customers: [],
      tableData: [],
      bakTableData: [],
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
  mounted() {
    this.queryContent();
  },
  methods: {
    onChangeSearch() {
      const myRe = new RegExp(this.searchInput);
      this.tableData = this.bakTableData.filter(ele => myRe.test(ele.userName));
      this.totalPage = Math.ceil(this.tableData.length / this.perPageSize);
    },
    timestampsToTime(timestamps) {
      const date = new Date(timestamps);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} 
      ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
    changeIsMultiSelection() {
      this.isMultiSelection = !this.isMultiSelection;
    },
    gotoAdd() {
      this.$router.push(`${this.urlEdit}/add`);
    },
    gotoUpdate(orderId) {
      this.$router.push(`${this.urlEdit}/${orderId}`);
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
          response.data.forEach((ele) => {
            this.bakTableData.push({
              ...ele,
              userName: this.customers[ele.userId],
            });
          });
          this.totalPage = Math.ceil(this.bakTableData.length / this.perPageSize);
          this.tableData = this.bakTableData;
        }
      });
    },
  },
  components: {
    AdminNavBar,
  },
};
</script>
