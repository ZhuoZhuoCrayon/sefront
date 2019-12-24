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
              <h3 style="display: flex; "> 员工管理 </h3>
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
                :default-sort = "{prop: 'userId', order: 'ascending'}"
                @selection-change="handleSelectionChange">
                <el-table-column v-if="isMultiSelection"
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="userId"
                  label="ID"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.userId }}</template>
                </el-table-column>
                <el-table-column
                  label="员工名称"
                  prop="userName"
                  sortable
                  width="180">
                  <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column
                  label="职务"
                  prop="roleDes"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.roleDes }}</template>
                </el-table-column>
                <el-table-column
                  label="贡献度"
                  prop="empWorkload"
                  sortable>
                  <template slot-scope="scope">{{ scope.row.empWorkload }}</template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button @click="gotoUpdate(scope.row.userId)" type="text"
                    size="small">修改</el-button>
                    <el-button type="text" size="small"
                    @click="queryRemoveEmployee(scope.row.userId)">删除</el-button>
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
import { EMPLOYEE_MANAGE_DETAIL, API } from '../router/MUrl';

export default {
  name: 'EmployeeManage',
  data() {
    return {
      searchInput: '',
      isMultiSelection: false,
      urlEdit: EMPLOYEE_MANAGE_DETAIL,
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
      this.tableData = this.bakTableData.filter(ele => myRe.test(ele.userName));
      this.totalPage = Math.ceil(this.tableData.length / this.perPageSize);
    },
    changeIsMultiSelection() {
      this.isMultiSelection = !this.isMultiSelection;
    },
    gotoAdd() {
      this.$router.push(`${this.urlEdit}/add`);
    },
    gotoUpdate(userId) {
      this.$router.push(`${this.urlEdit}/${userId}`);
    },
    queryEmployee() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'get',
          url: `${API}/employee/listAllEmployee.do`,
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.bakTableData = response.data;
            this.totalPage = Math.ceil(this.bakTableData.length / this.perPageSize);
            this.tableData = this.bakTableData;
            resolve(1);
          }
        });
      });
    },
    queryRemoveEmployee(userId) {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/employee/deleteEmployee.do`,
          withCredentials: true,
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
      this.queryEmployee();
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
