<template>
  <el-container style="padding: 2%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="4">
        <AdminNavBar/>
      </el-col>
      <el-col :span="20">
        <el-card v-loading="isLoading">
          <el-row style="height: 40px">
            <el-col :span="24" style="display: flex; align-items: center; height: 100%">
              <h3 style="display: flex; "> 订单概述 </h3>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px; text-align: left; ">
            <el-row :gutter="80">
              <el-col :span="12">
                <el-form ref="form" :model="form" label-width="80px">
                  <el-form-item label="ID">
                    <el-input v-model="form.orderId" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="客户ID">
                    <el-select v-model="form.userName" :disabled="isUpdateMode">
                      <el-option
                      v-for="item in allCustomer"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="处理人">
                    <el-select v-model="form.resEId" :disabled="isUpdateMode">
                      <el-option
                        v-for="item in allEmployee"
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="送货员">
                    <el-select v-model="form.resEId" disabled>
                      <el-option
                        v-for="item in allEmployee"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="总金额">
                    <el-input v-model="form.ordPreTotPrice" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="优惠金额">
                    <el-input v-model="form.ordDiscntPrice"
                    @change="updateAll" :disabled="isUpdateMode
                      && this.form.preOrdStatus !== 0"></el-input>
                  </el-form-item>
                  <el-form-item label="邮寄方式">
                      <el-select v-model="form.transMethod"
                      @change="changetransMethod"
                      :disabled="isUpdateMode">
                        <el-option
                        v-for="item in transType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="实际金额">
                    <el-input v-model="form.ordTotPrice" disabled></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form :model="form" label-width="80px">
                  <el-form-item label="收件人">
                    <el-input v-model="form.userName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="创建日期">
                    <el-input v-model="form.ordCreationTime" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="支付日期">
                    <el-input v-model="form.ordPayTime"
                    :disabled="getPayTimeDisabled"></el-input>
                  </el-form-item>
                  <el-form-item label="送达日期">
                    <el-input v-model="form.ordFinishTime"
                    :disabled="getOrdFinishTimeDisabled"></el-input>
                  </el-form-item>
                  <el-form-item label="订单状态">
                    <el-radio-group v-model="form.ordStatus"
                    style="display: flex; flex-direction: column;">
                      <el-radio
                      v-for="(item, index) in ordStatusSelection"
                      :key="item"
                      :label="index"
                      style="line-height: 40px;"
                      :disabled="getOrderStatusDisabled(index)"
                      >
                      {{ item }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-row>
          <el-row style="height: 40px">
            <el-col :span="16" style="display: flex; align-items: center; height: 100%">
              <h3> 购买明细 </h3>
            </el-col>
            <el-col :span="8" style="display: flex; align-items: center; height: 100%;
            justify-content: flex-end;">
              <el-button type="info" size="small" plain @click="addProduct"
              :disabled="isUpdateMode"> + 新增项 </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table :data="tableData">
                <el-table-column label="产品ID与名称" width="250">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.proId" :disabled="isUpdateMode"
                    @change="updateAll">
                      <el-option
                      v-for="item in productSelection"
                      :key="item.proId"
                      :label="item.label"
                      :value="item.proId">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="购买数量" width="220">
                  <template slot-scope="scope">
                    <el-input-number :disabled="isUpdateMode"
                      v-model="scope.row.purQuantity"
                      controls-position="right"
                      :min="1"
                      @change="updateAll"
                    >
                    </el-input-number>
                  </template>
                </el-table-column>
                <el-table-column label="单价" width="220">
                  <template slot-scope="scope">
                    <el-input disabled
                      v-model="scope.row.proPrice"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="总优惠" width="220">
                  <template slot-scope="scope">
                    <el-input disabled
                      v-model="scope.row.preTotal"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small"
                    :disabled="isUpdateMode"
                    @click="removeRow(scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row style="margin-top: 40px;">
            <el-form>
              <el-form-item>
                <el-row>
                  <el-col :span="6" style="display: flex;">
                    <el-button type="danger" disabled>删除订单</el-button>
                  </el-col>
                  <el-col :span="18" style="display: flex; justify-content: flex-end;">
                    <el-button type="primary" @click="queryExecute">确认</el-button>
                    <el-button>取消</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
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
  name: 'OrderManageDetail',
  data() {
    return {
      ordStatusSelection: ['已预约', '待付款', '待出库',
        '正在出库', '正在送货', '已送达', '已确认', '已取消'],
      isMultiSelection: false,
      allProduct: [],
      transType: [],
      transTypeMapPrice: [],
      allCustomer: [],
      customerIdMapName: [],
      customerNameMapId: [],
      allEmployee: [],
      employeeIdMapName: [],
      employeeNameMapId: [],
      isLoading: true,
      form: {
        orderId: this.$route.params.orderId,
        userId: '',
        userName: '',
        resEId: '',
        resEName: '',
        ordPreTotPrice: 0.00,
        ordDiscntPrice: 0.00,
        ordTotPrice: 0.00,
        postage: 0.00,
        transMethod: null,
        ordCreationTime: this.timestampsToTime(new Date()),
        ordPayTime: '',
        ordFinishTime: '',
        ordStatus: 0,
        preOrdStatus: 0,
      },
      tableData: [],
      productSelection: [],
    };
  },
  computed: {
    isUpdateMode() {
      return this.form.orderId !== 'add';
    },
    getPayTimeDisabled() {
      return this.form.ordStatus !== 2;
    },
    getOrdFinishTimeDisabled() {
      return true;
    },
  },
  methods: {
    getOrderStatusDisabled(index) {
      if (!this.isUpdateMode && index >= 2) {
        return true;
      }
      if (index === 7) {
        return false;
      }
      if (this.isUpdateMode && (index < this.form.preOrdStatus
        || index > this.form.preOrdStatus + 1)) {
        return true;
      }
      return false;
    },
    removeRow(index) {
      this.tableData.splice(index, 1);
    },
    changetransMethod() {
      this.form.postage = this.transTypeMapPrice[this.form.transMethod];
      this.updateAll();
    },
    timestampsToTime(timestamps) {
      const date = new Date(timestamps);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}Z`;
    },
    calcPreTotal(item) {
      let res = 0;
      const totalPrice = item.proPrice * item.purQuantity;
      if (item.preCondition === 1 && totalPrice >= item.preCLimit) {
        res = item.preCReduceAmount;
      } else if (item.preCondition === 2) {
        res = totalPrice * (1 - item.preDiscount);
      } else if (item.preCondition === 3 && totalPrice >= item.preCLimit) {
        res = totalPrice * item.preDiscount;
      }
      return res.toFixed(2);
    },
    addProduct() {
      const item = this.getProductItem(1, 1);
      this.tableData.push(item);
      this.updateAll();
    },
    getProductItem(proId, purQuanity) {
      const item = {
        proId: proId,
        purQuantity: purQuanity,
        proPrice: this.allProduct[proId].proPrice,
        preCondition: this.allProduct[proId].preferentialMethod.preCondition,
        preCLimit: this.allProduct[proId].preferentialMethod.preferentialParams.preCLimit,
        preCReduceAmount: this.allProduct[proId]
          .preferentialMethod.preferentialParams.preCReduceAmount,
        preDiscount: this.allProduct[proId].preferentialMethod.preferentialParams.preDiscount,
        preTotal: 0,
      };
      item.preTotal = this.calcPreTotal(item);
      return item;
    },
    updateAll() {
      this.tableData = this.tableData.map(ele => this.getProductItem(ele.proId, ele.purQuantity));
      this.form.ordPreTotPrice = 0;
      this.tableData.forEach((ele) => {
        this.form.ordPreTotPrice += (ele.proPrice * ele.purQuantity - ele.preTotal);
      });
      this.form.postage = this.transTypeMapPrice[this.form.transMethod];
      this.form.postage = this.form.postage ? this.form.postage : 0;
      this.form.ordPreTotPrice += this.form.postage;
      this.form.ordTotPrice = this.form.ordPreTotPrice - this.form.ordDiscntPrice;
    },
    queryAllCustomers() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'get',
          url: `${API}/customer/listAllCustomer.do`,
          withCredentials: true,
        }).then((response) => {
          this.allCustomer = [];
          this.customerIdMapName = [];
          this.customerNameMapId = [];
          response.data.forEach((ele) => {
            this.allCustomer.push({
              ...ele,
            });
            this.customerIdMapName[ele.userId] = ele.userName;
            this.customerNameMapId[ele.userName] = ele.userId;
          });
          resolve(1);
        });
      });
    },
    queryAllEmployees() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'get',
          url: `${API}/employee/listAllEmployee.do`,
          withCredentials: true,
        }).then((response) => {
          this.allEmployee = [];
          this.employeeIdMapName = [];
          this.employeeNameMapId = [];
          response.data.forEach((ele) => {
            this.allEmployee.push({
              ...ele,
            });
            this.employeeIdMapName[ele.userId] = ele.userName;
            this.employeeNameMapId[ele.userName] = ele.userId;
          });
          resolve(1);
        });
      });
    },
    queryTransType() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'get',
          url: `${API}/order/listTransMethods.do`,
          withCredentials: true,
        }).then((response) => {
          this.transType = [];
          Object.keys(response.data).forEach((key) => {
            this.transType.push({
              label: `${key} - ￥${response.data[key]}`,
              value: key,
              price: response.data[key],
            });
            this.transTypeMapPrice = response.data;
            resolve(1);
          });
        });
      });
    },
    queryOrder: async function queryOrder() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/getOrderByOrderId.do`,
          withCredentials: true,
          data: Qs.stringify({
            orderId: this.form.orderId,
          }),
        }).then(async (response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.form.ordCreationTime = this.timestampsToTime(response.data.ordCreationTime);
            this.form.ordPayTime = this.timestampsToTime(response.data.ordPayTime);
            this.form.userName = this.customerIdMapName[response.data.userId];
            this.form.userId = response.data.userId;
            this.form.resEId = this.employeeIdMapName[response.data.resEId];
            this.form.transId = response.data.transId;
            this.form.ordStatus = response.data.ordStatus;
            this.form.ordTotPrice = response.data.ordTotPrice;
            this.form.preOrdStatus = response.data.ordStatus;
            await this.queryTrans();
            await this.queryProduct();
            resolve(1);
          }
        });
      });
    },
    queryAllProduct() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/product/listProductSimplesByPage.do`,
          withCredentials: true,
          data: Qs.stringify({
            currentPage: 1,
            pageSize: 100000,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.allProduct = [];
            this.productSelection = [];
            response.data.itemList.forEach((ele) => {
              this.allProduct[ele.proId] = {
                ...ele,
              };
              this.productSelection.push({
                proName: ele.proName,
                proId: ele.proId,
                label: `${ele.proId} - ${ele.proName}`,
              });
            });
            resolve(1);
          }
        });
      });
    },
    queryTrans() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/getTransportationByTransId.do`,
          withCredentials: true,
          data: Qs.stringify({
            transId: this.form.transId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.form.postage = response.data.postage;
            this.form.transMethod = response.data.transMethod;
            this.form.ordPreTotPrice = this.form.ordTotPrice - this.form.postage;
            resolve(1);
          }
        });
      });
    },
    queryProduct() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/listProductListByOrderId.do`,
          withCredentials: true,
          data: Qs.stringify({
            orderId: this.form.orderId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.tableData = [];
            response.data.forEach((ele) => {
              const item = this.getProductItem(ele.proId, ele.purQuantity);
              this.tableData.push(item);
            });
            resolve(1);
          }
        });
      });
    },
    queryUpdateStatusUniversal() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/updateOrder.do`,
          withCredentials: true,
          data: {
            ordCreationTime: this.form.ordCreationTime,
            ordPayTime: this.form.ordPayTime,
            ordStatus: this.form.ordStatus,
            ordTotPrice: this.form.ordTotPrice,
            orderId: this.form.orderId,
            resEId: this.employeeNameMapId[this.form.resEId],
            transId: this.form.transId,
            userId: this.customerNameMapId[this.form.userName],
          },
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
    queryOutOfStock() {
      this.$axios({
        method: 'post',
        url: `${API}/order/outOfStock.do`,
        withCredentials: true,
        data: Qs.stringify({
          orderId: this.form.orderId,
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
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          }
        }
      });
    },
    queryTransporting() {
      this.$axios({
        method: 'post',
        url: `${API}/order/transporting.do`,
        withCredentials: true,
        data: Qs.stringify({
          orderId: this.form.orderId,
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
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          }
        }
      });
    },
    queryFinishTransporting() {
      this.$axios({
        method: 'post',
        url: `${API}/order/delivered.do`,
        withCredentials: true,
        data: Qs.stringify({
          orderId: this.form.orderId,
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
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          }
        }
      });
    },
    queryReceive() {
      this.$axios({
        method: 'post',
        url: `${API}/order/finish.do`,
        withCredentials: true,
        data: Qs.stringify({
          orderId: this.form.orderId,
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
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          }
        }
      });
    },
    queryCancelOrder() {
      this.$axios({
        method: 'post',
        url: `${API}/order/cancel.do`,
        withCredentials: true,
        data: Qs.stringify({
          orderId: this.form.orderId,
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
          } else {
            this.$message({
              message: response.data.message,
              type: 'error',
            });
          }
        }
      });
    },
    queryInsertOrder() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/order/createOrderByEmp.do`,
          withCredentials: true,
          data: {
            ordStatus: this.form.ordStatus,
            ordTotPrice: this.form.ordTotPrice,
            resEId: this.employeeNameMapId[this.form.resEId],
            userId: this.customerNameMapId[this.form.userName],
            productAmountList: this.tableData.map(ele => ({
              proId: ele.proId,
              purQuantity: ele.purQuantity,
            })),
          },
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
              this.form.orderId = response.data.plusParams.orderId;
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
    queryExecute() {
      if (this.form.userName === '') {
        this.$message({
          message: '失败！客户ID为空',
          type: 'error',
        });
        return;
      }
      if (this.form.resEId === '') {
        this.$message({
          message: '失败！员工ID为空',
          type: 'error',
        });
        return;
      }
      if (this.tableData.length === 0) {
        this.$message({
          message: '失败！产品列表为空！',
          type: 'error',
        });
        return;
      }
      if (this.isUpdateMode) {
        if (this.form.ordStatus <= 2) {
          this.queryUpdateStatusUniversal();
        } else if (this.form.ordStatus === 3) {
          this.queryOutOfStock();
        } else if (this.form.ordStatus === 4) {
          this.queryTransporting();
        } else if (this.form.ordStatus === 5) {
          this.queryFinishTransporting();
        } else if (this.form.ordStatus === 6) {
          this.queryReceive();
        } else if (this.form.ordStatus === 7) {
          this.queryCancelOrder();
        }
      } else {
        this.queryInsertOrder();
      }
      this.queryInit();
    },
    queryInit: async function queryInit() {
      await this.queryAllCustomers();
      await this.queryAllProduct();
      await this.queryTransType();
      await this.queryAllEmployees();
      if (this.isUpdateMode) {
        await this.queryOrder();
      } else {
        this.updateAll();
      }
      this.isLoading = false;
    },
  },
  mounted: async function mounted() {
    this.queryInit();
  },
  components: {
    AdminNavBar,
  },
};
</script>
