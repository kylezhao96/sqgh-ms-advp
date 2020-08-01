<template>
  <page-header-wrapper content="本页面用于自动开具工作票及已存在工作票导入数据库">
    <a-upload-dragger
      name="file"
      :multiple="true"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">
        点击或将文件拖拽至框内上传
      </p>
      <p class="ant-upload-hint">
        支持单文件及多文件上传. 推荐单文件上传，上传前请核对上传文件是否为工作票表格
      </p>
    </a-upload-dragger>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="单位"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            v-decorator="[
              'firm',
              {rules: [{ required: true, message: '请输入标题' }]}
            ]"
            name="name"
            show-search
            placeholder="输入单位名"
            label-in-value
            :show-arrow="false"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="firmFetching ? undefined : null"
            @search="handleFirmInputSearch"
          >
            <a-spin v-if="firmFetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="firmItem in firmList" :key="firmItem">
              {{ firmItem }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="工作票号"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'gzpId',
              {rules: [{ required: true, message: '请输入票号' }]}
            ]"
            :max-length="9"
            addon-before="FJGZ-SD-SQ-" />
        </a-form-item>
        <a-form-item
          label="工作负责人"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            v-decorator="[
              'manager',
              {rules: [{ required: true, message: '请输入工作负责人' }]}
            ]"
            name="manager"
            show-search
            placeholder="输入工作负责人"
            label-in-value
            :show-arrow="false"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="managerFetching ? undefined : null"
            x
            @search="handleManagerInputSearch"
          >
            <a-spin v-if="managerFetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="managerItem in managerList" :key="managerItem">
              {{ managerItem }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="工作班成员"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            v-decorator="[
              'members',
              {rules: [{ required: true, message: '工作班成员不可为空' }]}
            ]"
            mode="multiple"
            name="members"
            show-search
            placeholder="输入工作班成员"
            label-in-value
            :show-arrow="false"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="managerFetching ? undefined : null"
            @search="handleManagerInputSearch"
          >
            <a-spin v-if="managerFetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="managerItem in managerList" :key="managerItem">
              {{ managerItem }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="计划工作时间"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-range-picker
            name="planTime"
            style="width: 100%"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            v-decorator="[
              'buildTime',
              {rules: [{ required: true, message: '请选择起止日期' }]}
            ]" />
        </a-form-item>
        <a-form-item
          label="风机号"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            mode="tags"
            style="width: 100%"
            :token-separators="[',']"
            v-decorator="[
              'wt',
              {rules: [{ required: true, message: '请输入目标描述' }]}
            ]" >
            <a-select-option
              v-for="i in 40"
              :key="String(i)">
              {{'A' + String(i).padStart(2,'0') }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="工作任务"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-textarea
            rows="4"
            placeholder="请输入本次工作任务"
            v-decorator="[
              'task',
              {rules: [{ required: true, message: '请输入目标描述' }]}
            ]" />
        </a-form-item>
        <a-form-item
          label="是否停机"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-radio-group
              name="radioGroup"
              v-decorator="['terminalWt', { initialValue:   1 }]" >
              <a-radio :value="1">
                停机
              </a-radio>
              <a-radio :value="2">
                不停机
              </a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item
          label="是否停电"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-radio-group
            name="radioGroup"
            v-decorator="['terminalPower', { initialValue: 2 }]">
            <a-radio :value="1">
              停电
            </a-radio>
            <a-radio :value="2">
              不停电
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="目标公开"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
          help="客户、邀评人默认被分享"
        >
          <a-radio-group v-decorator="['target', { initialValue: 1 }]">
            <a-radio :value="1">公开</a-radio>
            <a-radio :value="2">部分公开</a-radio>
            <a-radio :value="3">不公开</a-radio>
          </a-radio-group>
          <a-form-item v-show="form.getFieldValue('target') === 2">
            <a-select mode="multiple">
              <a-select-option value="4">同事一</a-select-option>
              <a-select-option value="5">同事二</a-select-option>
              <a-select-option value="6">同事三</a-select-option>
            </a-select>
          </a-form-item>
        </a-form-item>
        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">提交</a-button>
          <a-button style="margin-left: 8px">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getFirmList, getNewGzpId } from '@/api/gzp'
import { getUsersList } from '@/api/user'

let currentValue

function fetchFirmList (value, callback) {
  currentValue = value
  if (currentValue === value) {
    const params = {
      value: value
    }
    getFirmList(params).then(response => {
      callback(response.result)
    })
  }
}

function fetchNewGzpId (callback) {
  getNewGzpId().then(response => {
    callback(response.result.gzp_id_num)
  })
}

function fetchUserList (value, callback) {
  const params = {
    value: value
  }
  getUsersList(params).then(response => {
    callback(response.result)
  })
}

export default {
  name: 'BaseForm',
  data () {
    return {
      form: this.$form.createForm(this),
      // 单位
      firmList: [],
      firmFetching: false,
      // 工作负责人
      managerList: [],
      managerFetching: false
    }
  },
  mounted () {
    fetchFirmList('', data => (this.firmList = data))
    fetchNewGzpId(data => (this.form.setFieldsValue({ gzpId: data })))
    fetchUserList('', data => (this.managerList = data))
  },
  methods: {
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleFirmInputSearch (value) {
      this.firmFetching = true
      fetchFirmList(value, data => ([this.firmList, this.firmFetching] = [data, false]))
    },
    handleManagerInputSearch (value) {
      this.managerFetching = true
      fetchUserList(value, data => {
        this.managerFetching = false
        if (data === []) {
          this.form.setFieldsValue({ manager: value })
        }
        this.managerList = data
        }
      )
    }
  }
}
</script>
