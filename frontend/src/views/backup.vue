<template>
  <div class="overall-container">
    <a-card>
      <a-table :columns="columns" :data-source="data" :rowKey="'id'" :pagination="{pageSize: 6}">
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
        <a-button 
          type="primary" 
          slot="operation" 
          slot-scope="text,record"
          @click="showModal(record)"
        >按该备份恢复数据库</a-button>
      </a-table>
      <a-modal
        title="按该备份恢复数据库"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <template slot="footer">
          <a-button key="back" @click="handleCancel">
            取消
          </a-button>
          <a-button key="submit" type="primary" :disabled="disabled" :loading="confirmLoading" @click="handleOk">
            确定
          </a-button>
        </template>
        <div>
          <div>文件名：{{record.name}}</div>
          <div>文件内容：{{record.text}}</div>
        </div>
      </a-modal>
    </a-card>
    <div>
      <a-button type="primary" icon="download" size="large" @click="backup()">备份当前数据库</a-button>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: "文件名",
    dataIndex: "name",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: 'customRender',
    },
    onFilter: (value, record) => {
      return record.name.includes(value);
    },
    sorter: (a, b) => a.name - b.name,
    sortDirections: ['descend', 'ascend'],
  },
  //{
  //  title: "文件内容",
  //  dataIndex: "text",
  //  scopedSlots: {
  //    filterDropdown: "filterDropdown",
  //    filterIcon: "filterIcon",
  //    customRender: 'customRender',
  //  },
  //  onFilter: (value, record) => {
  //    return record.text.includes(value);
  //  },
  //},
  //{
  //  title: "创建时间",
  //  dataIndex: "createTime",
  //  sorter: (a, b) => a.createTime - b.createTime,
  //  sortDirections: ['descend', 'ascend'],
  //},
  //{
  //  title: "更新时间",
  //  dataIndex: "updateTime",
  //  sorter: (a, b) => a.updateTime - b.updateTime,
  //  sortDirections: ['descend', 'ascend'],
  //},
  {
    title: "操作",
    scopedSlots: { customRender: 'operation' },
  },
]
export default {
  name: "backup",
  data() {
    return {
      data: [],
      columns,
      quantity: 1,
      visible: false,
      confirmLoading: false,
      record: {},
      disabled: false,
      searchText: '',
      searchedColumn: '',
    };
  },
  watch: {
    quantity(val, oldVal) {
      if(val == null) {
        this.disabled = true
        this.$message.info("请填写")
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
      this.$store.state.backupFilesDataGet().then((response) => {
        console.log(response)
        this.data = response.data.data;
      });
    },
    showModal(record) {
      this.record = record
      this.visible = true;
      this.quantity = 1
    },
    handleOk(e) {
      this.confirmLoading = true;
      this.$store.state.recoverDataPut(this.record.name).then((response) => {
        console.log(response)
        this.visible = false;
        this.confirmLoading = false;
        if(response.data.code == "A00000") {
          this.getBackendData()
          this.$notification.open({
            message: '备份还原成功！',
            description:'数据库已更新',
            icon: <a-icon type="smile" style="color: #108ee9" />,
          });
        } else {
          this.$message.error("系统异常，下单失败！")
        }
      });
    },
    handleCancel(e) {
      this.visible = false;
    },
    backup() {
      this.$store.state.backupDataGet().then((response) => {
        console.log(response)
        this.getBackendData()
          this.$notification.open({
            message: '备份成功',
            description:'可在当前页面查看到新的备份记录',
            icon: <a-icon type="smile" style="color: #108ee9" />,
          });
      });
    },
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