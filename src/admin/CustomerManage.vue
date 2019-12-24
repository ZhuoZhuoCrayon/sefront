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
              <h3 style="display: flex; "> 客户管理 </h3>
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
                  prop="userName"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column
                  label="用户等级"
                  prop="levelName"
                  sortable
                  width="100">
                  <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.levelName === 'SVIP'"
                    style="width: 60px; display: flex; justify-content: center;">
                        {{ scope.row.levelName }}
                    </el-tag>
                    <el-tag type="danger" v-else-if="scope.row.levelName === 'VIP'"
                    style="width: 60px; display: flex; justify-content: center;">
                        {{ scope.row.levelName }}
                    </el-tag>
                    <el-tag type="info" v-else
                    style="width: 60px; display: flex; justify-content: center;">
                        {{ scope.row.levelName }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="用户状态"
                  prop="cusStatus"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.cusStatus }}</template>
                </el-table-column>
                <el-table-column
                  label="购买总额"
                  prop="totalSales"
                  sortable
                  width="180">
                  <template slot-scope="scope">{{ scope.row.totalSales }}</template>
                </el-table-column>
                <el-table-column
                  label="订单数量"
                  prop="orderNum"
                  sortable>
                  <template slot-scope="scope">{{ scope.row.orderNum }}</template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button @click="onClickModify(scope.row)" type="text"
                    size="small">修改</el-button>
                    <el-button type="text" size="small"
                    @click="queryRemoveCustomer(scope.row.userId)">删除</el-button>
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
import { CUSTOMER_MANAGE_DETAIL, API } from '../router/MUrl';

export default {
  name: 'CustomerManage',
  data() {
    return {
      MAP_LEVEL_NAME: ['', 'Non', 'VIP', 'SVIP'],
      searchInput: '',
      currentPage: 1,
      perPageSize: 10,
      totalPage: 1,
      isMultiSelection: false,
      urlEdit: CUSTOMER_MANAGE_DETAIL,
      tableData: [
        {
          userName: 'wqdl',
          levelName: 'VIP',
          cusStatus: '已启用',
          totalSales: '998244353',
          orderNum: '9901',
        },
        {
          userName: 'phcj',
          levelName: 'Non',
          cusStatus: '已禁用',
          totalSales: '0.1',
          orderNum: '1',
        },
      ],
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
  methods: {
    onChangeSearch() {
      const myRe = new RegExp(this.searchInput);
      this.tableData = this.bakTableData.filter(ele => myRe.test(ele.userName));
      this.totalPage = Math.ceil(this.tableData.length / this.perPageSize);
    },
    onClickModify(row) {
      this.$router.push(`${this.urlEdit}/${row.userName}`);
    },
    changeIsMultiSelection() {
      this.isMultiSelection = !this.isMultiSelection;
    },
    gotoAdd() {
      this.$router.push(`${this.urlEdit}/add`);
    },
    queryCustomer() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'get',
          url: `${API}/customer/listAllCustomer.do`,
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
                levelName: this.MAP_LEVEL_NAME[ele.cusLevelId],
                cusStatus: ele.cusStatus !== '摸鱼' ? '已启用' : '已禁用',
              });
            });
            this.totalPage = Math.ceil(this.bakTableData.length / this.perPageSize);
            this.tableData = this.bakTableData;
            resolve(1);
          }
        });
      });
    },
    queryRemoveCustomer(userId) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/customer/deleteCustomer.do`,
          data: Qs.stringify({
            userId: userId,
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
            resolve(1);
          }
        });
      });
    },
    queryInit() {
      this.queryCustomer();
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
