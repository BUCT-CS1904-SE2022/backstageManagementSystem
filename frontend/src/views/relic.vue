<template>
  <div class="overall-container">
    <a-card>
      <a-table :columns="columns" :data-source="data" :rowKey="'id'" :pagination="pagination" @change="handleTableChange">
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
        <div 
          slot="operation" 
          slot-scope="text,record"
        >
            <a-button type="primary" @click="showModal(record)">修改</a-button>
            <a-popconfirm
              title="你确定要删除这件文物吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteRelic(record)"
            >
              <a-button type="danger">删除</a-button>
            </a-popconfirm>
        </div>
      </a-table>
      <a-modal
        title="修改"
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
          <div>名称：<a-input v-model=name @change="judge()" /></div>
          <div>发现时间：<a-input v-model=discoverTime @change="judge()" /></div>
          <div>尺寸：<a-input v-model=dimension @change="judge()" /></div>
          <div>分类：<a-input v-model=classification @change="judge()" /></div>
          <!--<div>库存：<a-input-number :min="0" v-model=stock @change="judge()" /></div>
          <div>分类：<a-input-number :precision="2" :min="0.01" v-model=price @change="judge()" />元</div>-->
        </div>
      </a-modal>
    </a-card>
    <a-form
      :form="form"
      layout="inline"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      @submit="handleSubmit"
    >
      <a-form-item label="名称">
        <a-input v-decorator="['name']" />
      </a-form-item>
      <a-form-item label="发现时间">
        <a-input v-decorator="['discoverTime']" />
      </a-form-item>
      <a-form-item label="尺寸">
        <a-input v-decorator="['dimension']" />
      </a-form-item>
      <a-form-item label="分类">
        <a-input v-decorator="['classification']" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 6, offset: 2 }">
        <a-button type="primary" html-type="submit">新增文物</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: 'customRender',
    },
    onFilter: (value, record) => {
      return record.name.includes(value);
    },
    width: '20%',
  },
  {
    title: "发现时间",
    dataIndex: "discoverTime",
  },
  {
    title: "尺寸",
    dataIndex: "dimension",
    width: '20%',
  },
  {
    title: "分类",
    dataIndex: "classification",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: 'customRender',
    },
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "点赞",
    dataIndex: "likeNum",
  },
  {
    title: "",
    scopedSlots: { customRender: 'operation' },
  },
]
export default {
  name: "relic",
  data() {
    return {
      data: [],
      columns,
      visible: false,
      confirmLoading: false,
      record: {},
      name: "",
      discoverTime: "",
      dimension: "",
      classification: "",
      disabled: false,
      searchText: '',
      searchedColumn: '',
      level: 0,
      form: this.$form.createForm(this, { name: "coordinated" }),
      pagination: {pageSize: 4, total: 0},
    };
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
    getBackendData(page = 1, size = this.pagination.pageSize) {
      this.$store.state.relicPageDataGet(page, size).then((response) => {
        console.log(response)
        this.pagination.total = response.data.data.total
        console.log(this.pagination)
        this.data = response.data.data.records;
      });
    },
    showModal(record) {
      this.record = record
      this.name = record.name;
      this.discoverTime = record.discoverTime;
      this.dimension = record.dimension;
      this.classification = record.classification;
      this.visible = true;
    },
    handleOk(e) {
      this.confirmLoading = true;
      let obj = {
        id: this.record.id,
        name: this.name,
        discoverTime: this.discoverTime,
        dimension: this.dimension,
        classification: this.classification,
      }
      this.$store.state.relicDataPatch(obj).then((response) => {
        console.log(response)
        this.visible = false;
        this.confirmLoading = false;
        if(response.data.code == "A00000") {
          this.getBackendData(this.pagination.current)
          this.$notification.open({
            message: '修改文物信息成功！',
            description:'',
            icon: <a-icon type="smile" style="color: #108ee9" />,
          });
        } else {
          this.$message.error("系统异常，修改文物信息失败！")
        }
      });
    },
    handleCancel(e) {
      this.visible = false;
    },
    deleteRelic(record) {
      this.$store.state.relicDataDelete(record.id).then((response) => {
        console.log(response)
        if(response.data.code == "A00000") {
          this.$message.success("删除成功！")
          this.getBackendData(this.pagination.current)
        } else {
          this.$message.error("服务端异常")
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let obj = {  
            name: values['name'],
            discoverTime: values['discoverTime'],
            dimension: values['dimension'],
            classification: values['classification'],
          };
          //console.log(obj)
          this.$store.state
            .relicDataPost(obj)
            .then((response) => {
              console.log(response);
              if(response.data.code == "A00000"){
                this.$message.success("新增文物成功！")
                this.getBackendData(this.pagination.current)
              } else {
                this.$message.error("服务器出错")
              }
            });
        } else {
          this.$message.error("新增失败！请联系开发者")
        }
      });
    },
    judge() {
      //if(this.name == "" || this.feature == "" || this.stock == null || this.price == null) {
      //  this.disabled = true
      //  this.$message.info("不能有空字段")
      //} else {
      //  this.disabled = false
      //}
    },
    handleTableChange(pagination) {
      console.log(pagination);
      console.log(this.pagination);
      //console.log(filters);
      //console.log(sorter)
      const pager = { ...this.pagination }; // 借助const常量来为对象添加键值对是一个好的习惯
      pager.current = pagination.current;
      this.pagination = pager;
      this.getBackendData(pagination.current);
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