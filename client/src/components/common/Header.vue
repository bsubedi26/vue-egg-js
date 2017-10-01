<template>
 <div class="header">
  <el-row type="flex" >
    <el-col :span="0" class="logo"><h1>{{appName}}</h1></el-col>
    <el-col :span="24">
      <el-menu theme="dark"
          :default-active="activeIndex"
          class="el-menu-demo grid-content"
          mode="horizontal"
          :router="true"
          >
       <el-menu-item index="List" :route="{name: 'AllList'}">All List</el-menu-item>
       <el-menu-item index="Create" :route="{name: 'Create'}">Create</el-menu-item>
       <el-menu-item index="Document" :route="{name: 'Document'}">Document</el-menu-item>
       <el-menu-item index="Stat" :route="{name: 'Stat'}">Data Statistics</el-menu-item>
       <!-- document is outside the chain, do not trigger the system itself routing -->
       <li class="el-menu-item" @click="showDocs">Tutorial/Docs</li>
      </el-menu>
    </el-col>
    <el-col :span="0">
      <profile-menu></profile-menu>
    </el-col>
  </el-row>
 </div>
</template>

<script>
import ProfileMenu from '../profile/Menu'
import config from '../../../config'
export default {
  components: {
    ProfileMenu
  },
  data () {
    return {
      appName: 'Menu'
      // appName: config.appName
    }
  },
  methods: {
    showDocs (e) {
      e.stopPropagation()
      window.open(config.docsUrl)
    }
  },
  computed: {
    activeIndex () {
      return this.$route.matched[1] ? this.$route.matched[1].name : ''
    }
  }
}
</script>
<style scoped>
.header {
  padding: 0 40px;
  background-color: #324157;
  text-align: left;
  min-width: 870px;
}
.el-menu {
  border-radius: 0;
  /*float: right;*/
}
.el-menu-item.is-active {
  border-bottom: 5px solid #20a0ff;
}
.el-menu--horizontal .el-menu-item {
 margin-right: 20px;
}
.logo {
  width: 200px;
  min-width: 200px;
}
h1 {
  line-height: 60px;
  color: #fff;
}
</style>
