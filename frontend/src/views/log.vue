<template>
  <div class="overall-container">
    <a-card>
      <a-table :columns="columns" :data-source="data" :rowKey="'id'" :pagination="{pageSize: 5}">
        <div
          slot="filterDropdown"
          slot-scope="{
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            column,
          }"
          style="padding: 8px"
        >
          <a-input
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="
              () => handleSearch(selectedKeys, confirm, column.dataIndex)
            "
          />
          <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="
              () => handleSearch(selectedKeys, confirm, column.dataIndex)
            "
            >Search</a-button
          >
          <a-button
            size="small"
            style="width: 90px"
            @click="() => handleReset(clearFilters)"
            >Reset</a-button
          >
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <template slot="customRender" slot-scope="text, record, index, column">
          <span v-if="searchText && searchedColumn === column.dataIndex">
            <template
              v-for="(fragment, i) in text
                .toString()
                .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
            >
              <mark
                v-if="fragment === searchText"
                :key="i"
                class="highlight"
                >{{ fragment }}</mark
              >
              <template v-else>{{ fragment }}</template>
            </template>
          </span>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </a-table>
    </a-card>
    <!--<div>
      <a-button type="primary" icon="download" size="large" @click="exportTradeRecord()">导出交易记录</a-button>
    </div>-->
  </div>
</template>

<script>
const columns = [
  {
    title: "类型",
    dataIndex: "type",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: 'customRender',
    },
    onFilter: (value, record) => {
      return record.type.includes(value);
    },
  },
  {
    title: "内容",
    dataIndex: "content",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: 'customRender',
    },
    onFilter: (value, record) => {
      return record.content.includes(value);
    },
  },
  {
    title: "时间",
    dataIndex: "updateTime",
    sorter: (a, b) => a.updateTime < b.updateTime,
    sortDirections: ['descend', 'ascend'],
  },
]
export default {
  name: "log",
  data() {
    return {
      data: [],
      columns,
      searchText: '',
      searchedColumn: '',
    };
  },
  watch: {
    quantity(val, oldVal) {
      if(val == null) {
        this.disabled = true
        this.$message.info("请填写下单数量")
      }
      else this.disabled = false
    },
  },
  methods: {
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    getBackendData() {
      this.$store.state.operationLogDataGet().then((response) => {
        console.log(response)
        this.data = response.data.data;
      });
    },
    exportTradeRecord() {
      var title = '生成于' + new Date().toLocaleString()
      var str=''
      this.data.forEach(item => {
        str += '名称:'+item.name+'   '+'数量:'+item.quantity+'   '+'总价(元):'+item.cost+ '   ' + '时间:' + item.time + '\r\n'
      })
      var allStr = title+'\r\n'+'\r\n'+str
      var export_blob = new Blob([allStr]);
      var save_link = document.createElement("a");
      save_link.href = window.URL.createObjectURL(export_blob);
      save_link.download = '用户交易记录.txt';
      this.fakeClick(save_link);

    },
    fakeClick(obj) {
      var ev = document.createEvent("MouseEvents");
      ev.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      obj.dispatchEvent(ev);
    }
  },
  beforeMount() {
    this.getBackendData()
  }
};
</script>

<style scoped>
.overall-container {
  background-color: #FFFFFF; 
  padding: 30px;
  margin: 20px;
}
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>