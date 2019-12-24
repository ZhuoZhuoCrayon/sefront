<template>
  <el-container style="padding: 2%">
    <el-row style="width: 100%" :gutter="20">
      <el-col :span="4">
        <AdminNavBar/>
      </el-col>
      <el-col :span="20">
        <el-card>
          <el-row style="height: 40px; margin-bottom: 20px;">
            <el-col :span="16" style="display: flex; align-items: center; height: 100%">
              <h3 style="display: flex; "> 交流管理 </h3>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="18">
              <div id="chatWrapperDiv">
                <div id="chatContentWrapperDiv">
                  <div v-for="item in chatContent" :key="item.content">
                    <div v-if="item.isCustomer === true" style="display: flex;">
                      <div id="chatContentLeftDiv">
                        {{ item.content }}
                      </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end;" v-else>
                      <div id="chatContentRightDiv">
                        {{ item.content }}
                      </div>
                    </div>
                  </div>
                </div>
                <div id="chatSendWrapperInputDiv">
                  <textarea id="chatSendWrapperInput"/>
                </div>
                <div style="width: 100%; margin-top: 10px; display: flex;
                justify-content: flex-end;">
                  <el-button type="default"> 清除内容 </el-button>
                  <el-button type="primary"> 发送 </el-button>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div v-for="item in userChatList" :key="item.userName"
              @click="setCurrentUser(item.userName)">
                <div id="chatListTitleActive" v-if="item.userName === currentUser">
                  {{ item.userName }}
                </div>
                <div id="chatListTitle" v-else>
                  {{ item.userName }}
                </div>
                <div id="chatListContent">
                  {{ item.lastContent }}
                </div>
                <el-divider></el-divider>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import AdminNavBar from './AdminNavBar.vue';

export default {
  name: 'ChatManage',
  data() {
    return {
      userChatList: [
        {
          userId: 'xldl',
          userName: 'xldl',
          lastContent: '我这边已经付款了！',
        },
        {
          userId: 'wqdl',
          userName: 'wqdl',
          lastContent: '既然要充到998244353元才有SVIP，那我就充把，一点小钱',
        },
        {
          userId: 'phcj',
          userName: 'phcj',
          lastContent: '0.99CNY可以再便宜些嘛 QAQ',
        },
      ],
      chatContent: [
        {
          content: '你好',
          isCustomer: true,
        },
        {
          content: '亲~你好~',
          isCustomer: false,
        },
        {
          content: '这边能为您服务些什么呢？',
          isCustomer: false,
        },
        {
          content: '打折后还是太贵了QwQ',
          isCustomer: true,
        },
        {
          content: '0.99CNY可以再便宜些嘛 QAQ',
          isCustomer: true,
        },
        {
          content: '亲~你好~',
          isCustomer: false,
        },
        {
          content: '这边能为您服务些什么呢？',
          isCustomer: false,
        },
        {
          content: '打折后还是太贵了QwQ',
          isCustomer: true,
        },
        {
          content: '0.99CNY可以再便宜些嘛 QAQ',
          isCustomer: true,
        },
      ],
      currentUser: 'xldl',
    };
  },
  methods: {
    setCurrentUser: function (s) {
      this.currentUser = s;
    },
  },
  components: {
    AdminNavBar,
  },
};
</script>
<style>
#chatWrapperDiv {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: #e5e5e5;
  background-color: #e5e5e5;
  border-style: solid;
  border-width: 2px;
  height: 690px;
  border-radius: 5px;
  padding: 10px;
}
#chatContentWrapperDiv {
  width: 100%;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  border: white;
  border-style: solid;
  background-color: white;
  border-radius: 5px;
  height: 450px;
  margin-bottom: 5px;
  overflow: auto;
}
#chatContentLeftDiv {
  margin-left: 15px;
  margin-Right: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #409EFF;
  border-radius: 5px;
  color: white;
}
#chatContentRightDiv {
  margin-left: 15px;
  margin-Right: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #67C23A;
  display: flex;
  justify-content: flex-end;
  border-radius: 5px;
  color: white;
}
#chatSendWrapperInputDiv {
  width: 100%;
  height: 150px;
  border: white;
  border-style: solid;
  background-color: white;
  border-radius: 5px;
}
#chatSendWrapperInput {
  width: 97%;
  height: 87%;
  margin: 1%;
  border: white;
  border-style: solid;
  background-color: white;
}
#chatListTitle {
  display: flex;
  font-size: larger;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB",
  "Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
#chatListContent {
  display: flex;
  justify-content: flex-start;
  color: #606266;
  word-break: break-all;
  text-align: left;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB",
  "Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
#chatListTitleActive {
  display: flex;
  font-size: larger;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB",
  "Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
</style>
