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
              <h3 style="display: flex; "> 产品管理 </h3>
            </el-col>
            <el-col :span="5">
              <el-input
                suffix-icon="el-icon-search"
                v-model="searchInput" @change="onChangeSearch">
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
                :default-sort = "{prop: 'proId', order: 'ascending'}"
                @selection-change="handleSelectionChange">
                <el-table-column v-if="isMultiSelection"
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="proId"
                  label="ID"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.proId }}</template>
                </el-table-column>
                <el-table-column
                  label="产品名称"
                  prop="proName"
                  sortable
                  width="240">
                  <template slot-scope="scope">{{ scope.row.proName }}</template>
                </el-table-column>
                <el-table-column
                  label="库存"
                  prop="proQuantity"
                  sortable
                  width="120">
                  <template slot-scope="scope">{{ scope.row.proQuantity }}</template>
                </el-table-column>
                <el-table-column
                  label="单价"
                  prop="proPrice"
                  width="120"
                  sortable>
                  <template slot-scope="scope">{{ scope.row.proPrice }}</template>
                </el-table-column>
                <el-table-column
                  label="购买数量"
                  prop="proBoughtQ"
                  sortable>
                  <template slot-scope="scope">{{ scope.row.proBoughtQ }}</template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button @click="onClickModify(scope.row)" type="text"
                    size="small">修改</el-button>
                    <el-button type="text" size="small"
                    @click="queryRemoveProduct(scope.row.proId)">删除</el-button>
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
import { PRODUCT_MANAGE_DETAIL, API } from '../router/MUrl';

export default {
  name: 'ProductManage',
  data() {
    return {
      searchInput: '',
      isMultiSelection: false,
      urlEdit: PRODUCT_MANAGE_DETAIL,
      currentPage: 1,
      perPageSize: 10,
      totalPage: 1,
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
  methods: {
    onClickModify(row) {
      this.$router.push(`${this.urlEdit}/${row.proId}`);
    },
    changeIsMultiSelection() {
      this.isMultiSelection = !this.isMultiSelection;
    },
    gotoAdd() {
      this.$router.push(`${this.urlEdit}/add`);
    },
    onChangeSearch() {
      const myRe = new RegExp(this.searchInput);
      this.tableData = this.bakTableData.filter(ele => myRe.test(ele.proName));
      this.totalPage = Math.ceil(this.tableData.length / this.perPageSize);
    },
    queryContent() {
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
          this.bakTableData = [];
          response.data.itemList.forEach((ele) => {
            this.bakTableData.push({
              proId: ele.proId,
              proName: ele.proName,
              proQuantity: ele.proQuantity,
              proPrice: ele.proPrice,
              proBoughtQ: ele.sales,
            });
          });
          this.totalPage = Math.ceil(this.bakTableData.length / this.perPageSize);
          this.tableData = this.bakTableData;
        }
      });
    },
    queryRemoveProduct(proId) {
      this.$axios({
        method: 'post',
        url: `${API}/product/deleteProductById.do`,
        data: Qs.stringify({
          proId: proId,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          if (response.data.success) {
            this.$message({
              message: '删除成功！',
              type: 'success',
            });
            this.queryCurrentPageContent();
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          }
        }
      });
    },
  },
  mounted() {
    this.queryContent();
  },
  components: {
    AdminNavBar,
  },
};
</script>
