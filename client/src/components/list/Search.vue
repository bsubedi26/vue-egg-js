<template>
    <el-input
        class="search"
        :placeholder="placeholder"
        icon="search"
        :size="size"
        @change="handleChange"
        @keydown.enter.native="handleQuery"
        v-model="inputValue">
    </el-input>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Please enter the conditions'
    },
    size: {
      type: String
    }
  },
  data () {
    return {
      inputValue: ''
    }
  },
  methods: {
    handleQuery () {
      this.$emit('query', this.inputValue)
    },
    handleChange (val) {
      if (val === '') {
        this.handleQuery()
      }
    }
  }
}
</script>
