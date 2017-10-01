<template>
  <div class="api-info el-col" v-side-bar>
    <el-form>
      <el-form-item label="Name" class="required">
        <el-input auto-complete="off" v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="Groups" class="required">
        <i class="el-icon-plus title-icon create-group" @click="showCreateGroup = true"></i>
        <div class="group-select">
          <el-row type="flex">
            <el-col :span="24">
              <el-select placeholder="Select Group" filterable v-model="group">
                <el-option v-for="group in groups" :key="group._id" :label="group.name" :value="group._id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="Test Address">
        <el-input auto-complete="off" v-model="devUrl" placeholder="Please provide absolute path"></el-input>
      </el-form-item>
      <el-form-item label="Online Address">
        <el-input auto-complete="off" v-model="prodUrl" placeholder="Please provide absolute path"></el-input>
      </el-form-item>
      <el-form-item label="Proxy Forwarding">
        <el-tooltip placement="top" popper-class="api-proxy-tip">
          <span class="mocker-tip">?</span>
          <div slot="content">
            <p>
              After opening the request mock address will be forwarded to the specified address, in addition, in order to facilitate the front-end code control, you can also request the Mock URL, with query parameters to set:
            </p>
            <p>Forward line: { mockURL }?_mockProxyStatus=1</p>
            <p>Forward test: { mockURL }?_mockProxyStatus=2</p>

          </div>
        </el-tooltip>
        <el-radio-group v-model="proxyMode">
          <el-radio :label="0">Do not forward</el-radio>
          <el-radio :label="1">Forward line</el-radio>
          <el-radio :label="2">Forward test</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="History" class="history-item" v-if="history && history.records.length">
        <api-history :history="history"></api-history>
      </el-form-item>
    </el-form>
    <create-group :visited="showCreateGroup" @action="handleClickCreateGroup" @close="handleClickClose" />
  </div>
</template>

<script>
import CreateGroup from '@/components/common/CreateGroup'
import ApiHistory from './ApiHistory'
export default {
  components: {
    CreateGroup,
    ApiHistory
  },
  data () {
    return {
      showCreateGroup: false
    }
  },
  methods: {
    handleClickCreateGroup (groupName) {
      this.$store.dispatch('createGroup', { name: groupName }).then(() => {
        this.showCreateGroup = false
      }).catch(e => this.$message.error(e.msg))
    },
    handleClickClose () {
      this.showCreateGroup = false
    }
  },
  created () {
    this.originTitle = document.title
  },
  beforeDestroy () {
    document.title = this.originTitle
  },
  computed: {
    groups () {
      return this.$store.state.groups
    },
    history () {
      return this.$store.state.api.history
    },
    name: {
      get () {
        document.title = this.$store.state.api.name || '未命名接口'
        return this.$store.state.api.name
      },
      set (value) {
        this.$store.commit('UPDATE_API_PROPS', ['name', value])
      }
    },
    prodUrl: {
      get () {
        return this.$store.state.api.prodUrl
      },
      set (value) {
        this.$store.commit('UPDATE_API_PROPS', ['prodUrl', value])
      }
    },
    devUrl: {
      get () {
        return this.$store.state.api.devUrl
      },
      set (value) {
        this.$store.commit('UPDATE_API_PROPS', ['devUrl', value])
      }
    },
    proxyMode: {
      get () {
        return this.$store.state.api.options.proxy.mode
      },
      set (value) {
        this.$store.commit('UPDATE_API_PROPS', ['options.proxy.mode', value])
      }
    },
    group: {
      get () {
        return this.$store.state.api.group
      },
      set (value) {
        this.$store.commit('UPDATE_API_PROPS', ['group', value])
      }
    }
  }
}
</script>
<style lang="less">
.api-proxy-tip {
  width: 450px;
}

.api-info {
  padding: 20px;
  width: 288px;
  min-width: 288px;
  background-color: #eef1f6;

  .el-textarea__inner,
  .el-input__inner {
    background-color: #F9FAFC;
  } // 防止创建分组的输入框背景色被覆盖
  .create-group-dialog .el-input__inner {
    background-color: #fff;
  }
  .el-form {
    min-height: 100%;
    padding-bottom: 50px;
  }

  .create-group {
    color: #97a8be;
    cursor: pointer;
  }

  .history {
    display: inline-block;
    width: 100%;
  }

  .el-radio-group {
    display: block;
    margin-top: 5px;
    .el-radio {
      /*margin-left: 15px;*/
      display: block;
      margin: 5px 0;
      color: #475669;
      font-family: monospace;

      &__label {
        margin-left: 5px;
      }
    }
  }
}

.group-select {
  display: inline-block;
  width: 100%;
  .el-icon-plus {
    width: 50px;
    line-height: 36px;
  }

  .el-select .el-input__inner,
  .el-select {
    width: 100%;
  }
}

.issue {
  text-align: center;
  margin-top: -30px;
  a {
    color: #99A9BF;
    font-size: 12px;
    margin: 0 35px;
  }
}

.el-form-item.required .el-form-item__label:after {
  content: '*';
  color: #ff4949;
  margin-left: 2px;
}
</style>
