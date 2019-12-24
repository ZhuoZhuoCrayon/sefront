/* eslint-disable */
<template>
  <el-container style="padding: 2%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="4">
        <AdminNavBar/>
      </el-col>
      <el-col :span="20">
        <el-card>
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
                    <el-input v-model="form.proId" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="库存">
                    <el-input v-model="form.proQuantity"></el-input>
                  </el-form-item>
                  <el-form-item label="税率">
                    <el-input v-model="form.proPortionalTaxRate"></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form ref="form" :model="form" label-width="80px">
                  <el-form-item label="产品名称">
                    <el-input v-model="form.proName"></el-input>
                  </el-form-item>
                  <el-form-item label="单价">
                    <el-input v-model="form.proPrice"></el-input>
                  </el-form-item>
                  <el-form-item label="税前价格">
                    <el-input v-model="proShowPrice" disabled></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </el-row>
          <el-row style="height: 40px; margin-top: 40px;">
            <el-col :span="16" style="display: flex; align-items: center; height: 100%">
              <h3> 优惠条件 </h3>
            </el-col>
            <el-col :span="8" style="display: flex; align-items: center; height: 100%;
            justify-content: flex-end;">
              <el-button type="info" size="small" plain disabled> + 新增项 </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table :data="tableDiscountData">
                <el-table-column label="产品ID与名称" width="250">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.condition">
                      <el-option :value="1" label="金额大于等于减免"></el-option>
                      <el-option :value="2" label="无条件打折"></el-option>
                      <el-option :value="3" label="金额大于等于打折"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="阈值" width="220">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.preCLimit"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="可叠加" width="100">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isMixed"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="优惠额" width="220">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.preDiscount"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作">
                  <template>
                    <el-button type="text" size="small" disabled>删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row style="height: 40px; margin-top: 40px;">
            <el-col :span="16" style="display: flex; align-items: center; height: 100%">
              <h3> 产品明细 </h3>
            </el-col>
            <el-col :span="8" style="display: flex; align-items: center; height: 100%;
            justify-content: flex-end;">
              <el-button type="info" size="small" plain @click="addDescriptionRow">
              + 新增项 </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table :data="tableDetailData">
                <el-table-column label="描述头" width="220">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.head" :disabled="scope.row.head === '概要'">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="描述内容" width="320">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.content"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small"
                    @click="removeDescriptionRow(scope.$index)"
                    :disabled="scope.row.head === '概要'">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row style="height: 40px; margin-top: 40px;">
            <el-col :span="24" style="display: flex; align-items: center; height: 100%">
              <h3> 产品封面图片描述 </h3>
            </el-col>
          </el-row>
          <el-row style="height: 40px; margin-top: 10px;">
            <el-col :span="20">
              <el-input
                readonly
                v-model="imgCoverFileName">
              </el-input>
            </el-col>
            <el-col :span="4">
              <input
                accept="image/*"
                style="display: none;"
                id="imgCoverFileInput"
                type="file"
                @change="onChangeImgCoverFileInput"
              />
              <el-button role="button" @click="openImgCoverFileInputDialog">浏览</el-button>
              <el-button role="button" @click="imgCoverFileName = ''">清空</el-button>
            </el-col>
          </el-row>
          <el-row style="height: 40px; margin-top: 40px;">
            <el-col :span="24" style="display: flex; align-items: center; height: 100%">
              <h3> 产品详细图片描述 </h3>
            </el-col>
          </el-row>
          <el-row style="height: 40px; margin-top: 10px;">
            <el-col :span="20">
              <el-input
                readonly
                v-model="imgDetailFileName">
              </el-input>
            </el-col>
            <el-col :span="4">
              <input
                accept="image/*"
                style="display: none;"
                id="imgDetailFileInput"
                type="file"
                @change="onChangeImgDetailFileInput"
              />
              <el-button role="button" @click="openImgDetailFileInputDialog">浏览</el-button>
              <el-button role="button" @click="imgDetailFileName = ''">清空</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 40px;">
            <el-form>
              <el-form-item>
                <el-row>
                  <el-col :span="6" style="display: flex;">
                    <el-button type="danger" @click="queryRemoveProduct"
                    :disabled="form.proId === 'add'">删除产品</el-button>
                  </el-col>
                  <el-col :span="18" style="display: flex; justify-content: flex-end;">
                    <el-button type="primary" @click="queryUpdateProduct">确认</el-button>
                    <el-button @click="() => this.$router.go(-1)">取消</el-button>
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
import { API } from '../router/MUrl';
import AdminNavBar from './AdminNavBar.vue';

export default {
  name: 'ProductManageDetail',
  data() {
    return {
      searchInput: '',
      isMultiSelection: false,
      imgCoverFileName: '',
      imgCoverFile: null,
      imgDetailFileName: '',
      imgDetailFile: null,
      form: {
        proId: 'add',
        proName: '',
        proQuantity: 0,
        proPortionalTaxRate: '0',
        proPrice: 0,
        preConId: -1,
        previewDescribe: '',
      },
      tableDiscountData: [
        {
          condition: 1,
          preCLimit: 0,
          isMixed: true,
          preDiscount: 0,
        },
      ],
      tableDetailData: [
        {
          head: '概要',
          content: '',
        },
      ],
    };
  },
  computed: {
    proShowPrice() {
      return this.form.proPrice * (1 - parseFloat(this.form.proPortionalTaxRate));
    },
  },
  methods: {
    changeIsMultiSelection() {
      this.isMultiSelection = !this.isMultiSelection;
    },
    removeDescriptionRow(index) {
      this.tableDetailData.splice(index, 1);
    },
    addDescriptionRow() {
      this.tableDetailData.push({
        head: '',
        content: '',
      });
    },
    openImgCoverFileInputDialog() {
      const obj = document.getElementById('imgCoverFileInput');
      obj.click();
    },
    onChangeImgCoverFileInput() {
      const obj = document.getElementById('imgCoverFileInput');
      const file = obj.files[0];
      this.imgCoverFileName = file.name;
      this.imgCoverFile = file;
    },
    openImgDetailFileInputDialog() {
      const obj = document.getElementById('imgDetailFileInput');
      obj.click();
    },
    onChangeImgDetailFileInput() {
      const obj = document.getElementById('imgDetailFileInput');
      const file = obj.files[0];
      this.imgDetailFileName = file.name;
      this.imgDetailFile = file;
    },
    queryProductDescription() {
      this.$axios({
        method: 'post',
        url: `${API}/description/listProductDescribes.do`,
        data: Qs.stringify({
          proId: this.form.proId,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          const arr = response.data.map(ele => (
            {
              head: ele.desHead,
              content: ele.desBody,
            }
          ));
          this.tableDetailData = this.tableDetailData.slice(0, 1).concat(arr);
        }
      });
    },
    queryProduct() {
      this.queryProductDescription();
      this.$axios({
        method: 'post',
        url: `${API}/product/getProductDetailById.do`,
        data: Qs.stringify({
          proId: this.form.proId,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        } else {
          this.form = {
            proId: response.data.proId,
            proName: response.data.proName,
            proPrice: response.data.proPrice,
            proPortionalTaxRate: response.data.proPortionalTaxRate,
            proQuantity: response.data.proQuantity,
            previewDescribe: response.data.previewDescribe,
          };
          this.tableDetailData[0].content = response.data.previewDescribe;
          this.tableDiscountData = [{
            condition: response.data.preferentialMethod.preCondition,
            preCLimit: response.data.preferentialMethod.preferentialParams.preCLimit
              ? response.data.preferentialMethod.preferentialParams.preCLimit : 0,
            isMixed: true,
            preDiscount: response.data.preferentialMethod.preferentialParams.preCReduceAmount
              ? response.data.preferentialMethod.preferentialParams.preCReduceAmount
              : response.data.preDiscount,
          }];
        }
      });
    },
    queryUpdateImgDetail(proId) {
      const fdat = new FormData();
      fdat.append('proId', proId);
      fdat.append('describeImg', this.imgDetailFile, this.imgDetailFileName);
      this.$axios({
        method: 'post',
        url: `${API}/description/insertProductDescribeImg.do`,
        data: fdat,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        }
      }).catch(() => {
        this.$message({
          message: '未知错误',
        });
      });
    },
    queryUpdateImgCover(proId) {
      const fdat = new FormData();
      fdat.append('proId', proId);
      fdat.append('productPreviewImg', this.imgCoverFile, this.imgCoverFileName);
      this.$axios({
        method: 'post',
        url: `${API}/description/insertProductPreview.do`,
        data: fdat,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        }
      }).catch(() => {
        this.$message({
          message: '未知错误',
        });
      });
    },
    queryUpdateProduct: async function queryUpdateProduct() {
      const urlSet = [
        `${API}/product/insertProduct.do`,
        `${API}/product/updateProduct.do`,
      ];
      await this.queryInsertPref();
      await new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: urlSet[this.form.proId !== 'add' ? 1 : 0],
          data: {
            preservePeriod: '2019-12-20T03:02:59.336Z',
            proCreationTime: '2019-12-20T03:02:59.336Z',
            proId: (this.form.proId === 'add' ? undefined : this.form.proId),
            proName: this.form.proName,
            proPortionalTaxRate: this.form.proPortionalTaxRate,
            proPrice: this.form.proPrice,
            proQuantity: this.form.proQuantity,
            proStatus: 'string',
            productionBatch: 'string',
            productionTime: '2019-12-20T03:02:59.336Z',
            preferentialConditionId: this.form.preConId,
          },
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '更新产品信息发生未知错误',
            });
          } else {
            if (response.data.plusParams) {
              this.form.proId = response.data.plusParams.proId;
            }
            const { proId } = this.form;
            if (this.imgCoverFileName !== '') {
              this.queryUpdateImgCover(proId);
            }
            if (this.imgDetailFileName !== '') {
              this.queryUpdateImgDetail(proId);
            }
            this.$message({
              message: '成功！',
              type: 'success',
            });
            resolve(1);
          }
        });
      });
      this.queryClearDescription().then(() => {
        this.queryInsertDescription();
      });
      this.queryInsertPreviewDescription();
      this.$router.go(-1);
    },
    queryInsertPref() {
      return new Promise((resolve) => {
        const objPref = this.tableDiscountData[0];
        const reqData = {
          preCLimit: objPref.preCLimit,
          preCReduceAmount: objPref.preDiscount,
          preDiscount: objPref.preDiscount,
          preCDescribe: '',
          preCondition: objPref.condition,
          preConId: 0,
          preferentialConditionId: this.tableDiscountData[0].preConId,
        };
        switch (reqData.preCondition) {
          case 1:
            reqData.preCDescribe = `满${reqData.preCLimit}减${reqData.preDiscount}`;
            break;
          case 2:
            reqData.preCDescribe = `打${(reqData.preDiscount * 10).toFixed(1)}折`;
            break;
          default:
            reqData.preCDescribe = `满${reqData.preCLimit}打${(reqData.preDiscount * 10).toFixed(1)}折`;
            break;
        }
        this.$axios({
          method: 'post',
          url: `${API}/preferential/insertPreferential.do`,
          data: reqData,
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          } else {
            this.form.preConId = response.data.plusParams.preConId;
            resolve(1);
          }
        });
      });
    },
    queryClearDescription() {
      return new Promise((resolve) => {
        this.$axios({
          method: 'post',
          url: `${API}/description/clearProductDescribesByProId.do`,
          data: Qs.stringify({
            proId: this.form.proId,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          }
          resolve(1);
        });
      });
    },
    queryInsertDescription() {
      const reqData = this.tableDetailData.slice(1);
      reqData.forEach((ele) => {
        this.$axios({
          method: 'post',
          url: `${API}/description/insertProductDescribe.do`,
          data: Qs.stringify({
            proId: this.form.proId,
            desHead: ele.head,
            desBody: ele.content,
          }),
        }).then((response) => {
          if (response.status !== 200) {
            this.$message({
              message: '未知错误',
            });
          }
        });
      });
    },
    queryInsertPreviewDescription() {
      this.$axios({
        method: 'post',
        url: `${API}/description/insertProductPreviewDescribe.do`,
        data: Qs.stringify({
          proId: this.form.proId,
          desHead: '',
          desBody: this.tableDetailData[0].content,
        }),
      }).then((response) => {
        if (response.status !== 200) {
          this.$message({
            message: '未知错误',
          });
        }
      });
    },
    queryRemoveProduct() {
      this.$axios({
        method: 'post',
        url: `${API}/product/deleteProductById.do`,
        data: Qs.stringify({
          proId: this.form.proId,
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
            this.$router.go(-1);
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
    if (this.$route.params.proId !== 'add') {
      this.form.proId = this.$route.params.proId;
      this.queryProduct();
    }
  },
  components: {
    AdminNavBar,
  },
};
</script>
