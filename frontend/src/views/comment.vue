<template>
  <div class="overall-container">
    <a-card>
      <a-table :columns="columns" :data-source="data" :rowKey="'id'" :pagination="{pageSize: 4}" @change="checkboxs.push('w')">
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
            <!--<a-button type="primary" @click="showModal(record)">修改</a-button>-->
            <a-popconfirm
              title="你确定要删除这件商品吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteComment(record)"
            >
              <a-button type="danger">删除</a-button>
            </a-popconfirm>
        </div>
        <a-checkbox
            slot="checkbox"
            slot-scope="text, record"
            :check="record.checked"
            @change="checkboxChange($event, record)"
          ></a-checkbox>
      </a-table>
      <!--<a-modal
        title="修改商品信息"
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
          <div>颜色：<a-input v-model=feature @change="judge()" /></div>
          <div>库存：<a-input-number :min="0" v-model=stock @change="judge()" /></div>
          <div>单价：<a-input-number :precision="2" :min="0.01" v-model=price @change="judge()" />元</div>
        </div>
      </a-modal>-->
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
    title: "发表者",
    dataIndex: "publishUserName",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon",
      customRender: 'customRender',
    },
    onFilter: (value, record) => {
      return record.publishUserName.includes(value);
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
    sorter: (a, b) => a.updateTime - b.updateTime,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: "点赞数",
    dataIndex: "likeNum",
    sorter: (a, b) => a.likeNum - b.likeNum,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: "操作",
    scopedSlots: { customRender: 'operation' },
  },
  //{
  //  title: "#",
  //  scopedSlots: { customRender: 'checkbox' },
  //},
]
export default {
  name: "comment",
  data() {
    return {
      data: [],
      columns,
      visible: false,
      confirmLoading: false,
      record: {},
      name: "",
      feature: "",
      stock: 0,
      price: 0,
      disabled: false,
      searchText: '',
      searchedColumn: '',
      level: 0,
      form: this.$form.createForm(this, { name: "coordinated" }),
      checkboxs: [],
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
      this.$store.state.commentDataGet().then((response) => {
        console.log(response)
        this.data = response.data.data;
        for (let record of this.data) {
            this.$set(record, 'checked', false)
        }
      });
    },
    showModal(record) {
      this.record = record
      this.name = record.name;
      this.feature = record.feature;
      this.stock = record.stock;
      this.price = record.price;
      this.visible = true;
    },
    handleOk(e) {
      this.confirmLoading = true;
      let obj = {
        id: this.record.id,
        name: this.name,
        feature: this.feature,
        stock: this.stock,
        price: this.price,
      }
      this.$store.state.oneCommodityDataPatch(obj).then((response) => {
        console.log(response)
        this.visible = false;
        this.confirmLoading = false;
        if(response.data.code == 200) {
          this.getBackendData()
          this.$notification.open({
            message: '修改商品信息成功！',
            description:'',
            icon: <a-icon type="smile" style="color: #108ee9" />,
          });
        } else {
          this.$message.error("系统异常，修改商品信息失败！")
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
                this.$message.success("新增商品成功！")
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
      if(this.name == "" || this.feature == "" || this.stock == null || this.price == null) {
        this.disabled = true
        this.$message.info("不能有空字段")
      } else {
        this.disabled = false
      }
    },
    checkboxChange(e, record) {
      //console.log(e);
      if (e.target.checked) {
        //this.checkboxs.push(id);
        record.checked = true;
      } else {
        //this.checkboxs.splice(this.checkboxs.indexOf(id), 1);
        record.checked = false;
      }
      console.log(this.checkboxs);
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