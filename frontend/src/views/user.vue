<template>
  <div class="overall-container">
    <a-card>
      <a-table :columns="columns" :data-source="data" :rowKey="'id'" :pagination="{pageSize: 4}">
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
            <!--<a-popconfirm
              title="你确定要删除这件商品吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteComment(record)"
            >
              <a-button type="danger">删除</a-button>
            </a-popconfirm>-->
        </div>
      </a-table>
      <a-modal
        title="修改用户信息"
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
          <div>类型：<a-input v-model=type @change="judge()" /></div>
          <div>是否可用：<a-input-number :min="0" v-model=status @change="judge()" /></div>
          <!--<div>颜色：<a-input v-model=feature @change="judge()" /></div>
          <div>单价：<a-input-number :precision="2" :min="0.01" v-model=price @change="judge()" />元</div>-->
        </div>
      </a-modal>
    </a-card>
    <!--<a-form
      :form="form"
      layout="inline"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      @submit="handleSubmit"
    >
      <a-form-item label="名称">
        <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入商品名称！' }] }]" />
      </a-form-item>
      <a-form-item label="颜色">
        <a-input v-decorator="['feature', { rules: [{ required: true, message: '请输入颜色！' }] }]" />
      </a-form-item>
      <a-form-item label="库存">
        <a-input-number v-decorator="['stock', { rules: [{ required: true, message: '请输入库存！' }]}]" :min="0" />
      </a-form-item>
      <a-form-item label="单价">
        <a-input-number :precision="2" v-decorator="['price', { rules: [{ required: true, message: '请输入单价！' }]}]" :min="0.01" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 6, offset: 2 }">
        <a-button type="primary" html-type="submit">新增商品</a-button>
      </a-form-item>
    </a-form>-->
  </div>
</template>

<script>
const columns = [
  {
    title: "用户名",
    dataIndex: "userName",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: 'customRender',
    },
    onFilter: (value, record) => {
      return record.userName.includes(value);
    },
  },
  {
    title: "类型",
    dataIndex: "type",
    filters: [
      { text: 'admin', value: 'admin' },
      { text: 'ordinary', value: 'ordinary' },
    ],
    onFilter: (value, record) => {
      return record.type.indexOf(value) === 0
    },
  },
  {
    title: "是否可用",
    dataIndex: "status",
    filters: [
      { text: '可用', value: '1' },
      { text: '不可用', value: '0' },
    ],
    onFilter: (value, record) => {
      return record.status.toString().indexOf(value) === 0
    },
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    sorter: (a, b) => a.createTime - b.createTime,
    sortDirections: ['descend', 'ascend'],
  },
  //{
  //  title: "更新时间",
  //  dataIndex: "updateTime",
  //  sorter: (a, b) => a.updateTime - b.updateTime,
  //  sortDirections: ['descend', 'ascend'],
  //},
  {
    title: "",
    scopedSlots: { customRender: 'operation' },
  },
]
export default {
  name: "user",
  data() {
    return {
      data: [],
      columns,
      visible: false,
      confirmLoading: false,
      record: {},
      type: "ordinary",
      feature: "",
      status: 1,
      price: 0,
      disabled: false,
      searchText: '',
      searchedColumn: '',
      level: 0,
      form: this.$form.createForm(this, { name: "coordinated" }),
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
    getBackendData() {
      this.$store.state.AllUserDataGet().then((response) => {
        console.log(response)
        this.data = response.data.data;
      });
    },
    showModal(record) {
      this.record = record
      this.type = record.type;
      this.status = record.status;
      this.visible = true;
    },
    handleOk(e) {
      this.confirmLoading = true;
      let obj = {
        id: this.record.id,
        type: this.type,
        status: this.status,
      }
      this.$store.state.adminUserDataPatch(obj).then((response) => {
        console.log(response)
        this.visible = false;
        this.confirmLoading = false;
        if(response.data.code == "A00000") {
          this.getBackendData()
          this.$notification.open({
            message: '修改用户信息成功！',
            description:'',
            icon: <a-icon type="smile" style="color: #108ee9" />,
          });
        } else {
          this.$message.error("系统异常，修改用户信息失败！")
        }
      });
    },
    handleCancel(e) {
      this.visible = false;
    },
    deleteComment(record) {
      this.$store.state.commentDataDelete(record.id).then((response) => {
        console.log(response)
        if(response.data.code == "A00000") {
          this.$message.success("删除成功！")
          this.getBackendData()
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
            feature: values['feature'],
            stock: values['stock'],
            price: values['price'],
          };
          //console.log(obj)
          this.$store.state
            .oneCommodityDataPost(obj)
            .then((response) => {
              console.log(response);
              if(response.data.code == 200){
                this.$message.success("新增用户成功！")
                this.getBackendData()
              } else {
                this.$message.error("服务器出错")
              }
            });
        } else {
          this.$message.error("新增失败！请检查是否有未填字段")
        }
      });
    },
    judge() {
      if(this.type == "" || this.status == null) {
        this.disabled = true
        this.$message.info("不能有空字段")
      } else {
        this.disabled = false
      }
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