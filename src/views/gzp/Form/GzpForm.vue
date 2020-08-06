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
      <a-form-model
        layout="horizontal"
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-form-model-item
          label="单位"
          prop="firm">
          <a-select
            v-model="form.firm"
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
        </a-form-model-item>
        <a-form-model-item
          label="工作票号"
          prop="gzpId"
        >
          <a-input
            v-model="form.gzpId"
            addon-before="FJGZ-SD-SQ-" />
        </a-form-model-item>
        <a-form-model-item
          label="班组"
          prop="group"
        >
          <a-radio-group
            v-model="form.group">
            <a-radio value="检修班组">
              检修班组
            </a-radio>
            <a-radio value="运行班组">
              运行班组
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="工作负责人"
          prop="manager"
        >
          <a-select
            v-model="form.manager"
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
        </a-form-model-item>
        <a-form-model-item
          label="工作班成员"
          prop="members"
        >
          <a-select
            v-model="form.members"
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
        </a-form-model-item>
        <a-form-model-item
          label="计划工作时间"
          prop="planTimeRange"
        >
          <a-range-picker
            name="planTime"
            style="width: 100%"
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            v-model="form.planTimeRange"/>
        </a-form-model-item>
        <a-form-model-item
          label="工作类型"
          prop="type"
        >
          <a-radio-group
            name="radioGroup"
            v-model="form.type">
            <a-radio value="维护">
              维护
            </a-radio>
            <a-radio value="故障">
              故障
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="故障信息"
          prop="error"
        >
          <a-input-group compact v-model="form.error" >
            <a-input style="width: 40%" placeholder="故障代码" :disabled="form.type == '维护'" />
            <a-input style="width: 60%" placeholder="故障名称" :disabled="form.type == '维护'" />
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item
          label="风机号"
          prop="wtId"
        >
          <a-select
            v-model="form.wtId"
            mode="tags"
            style="width: 100%"
            :token-separators="[',','、','，']"
            @change="handleWtIdChange"
          >
            <a-select-option
              v-for="i in 40"
              :key="'A' + String(i).padStart(2,'0')">
              {{ 'A' + String(i).padStart(2,'0') }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="工作位置"
          prop="position"
        >
          <a-radio-group
            name="radioGroup"
            v-model="form.position">
            <a-radio value="整机">
              整机
            </a-radio>
            <a-radio value="塔基">
              塔基
            </a-radio>
            <a-radio value="机舱">
              机舱
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="工作任务"
          prop="task"
        >
          <a-textarea
            v-model="form.task"
            rows="4"
            placeholder="请输入本次工作任务"
          />
        </a-form-model-item>
        <a-form-model-item
          label="是否停机"
          prop="terminalWt"
        >
          <a-radio-group
            name="radioGroup"
            v-model="form.terminalWt">
            <a-radio value="停机">
              停机
            </a-radio>
            <a-radio value="不停机">
              不停机
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="是否停电"
          prop="terminalPower"
        >
          <a-radio-group
            name="radioGroup"
            v-model="form.terminalPower">
            <a-radio value="停电">
              停电
            </a-radio>
            <a-radio value="不停电">
              不停电
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="天气信息"
          prop="weather"
        >
          <a-input-group>
            <a-row type="flex" justify="space-between">
              <a-col :span="8">
                <a-input v-model="form.weather" />
              </a-col>
              <a-col :span="7">
                <a-input v-model="form.windSpeed" suffix="m/s"/>
              </a-col>
              <a-col :span="7">
                <a-input v-model="form.tmp" suffix="℃"/>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item
          style="text-align: center"
          :wrapper-col="{ span: 14, offset: 4 }"
        >
          <a-button @click="handleSubmit('form')" type="primary" :disabled="submitDisabled">提交</a-button>
          <a-button style="margin-left: 8px">保存</a-button>
        </a-form-model-item>

      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getFirmList, getNewGzpId, getWeather } from '@/api/gzp'
import { getUsersList } from '@/api/user'
import { mapActions } from 'vuex'
// import store from '@/store'

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
function fetchWeather (callback) {
  getWeather().then(response => {
    callback(response.result)
  })
}

export default {
  name: 'GzpForm',
  data () {
    const validateManager = (rule, value, callback) => {
      console.log(value)
      if (value === undefined) {
        callback(new Error('工作班负责人不可为空'))
      } else {
        for (const item of this.form.members) {
          if (item.label.trim() === value.label.trim()) {
            callback(new Error('工作负责人不可与工作班成员重复'))
          }
        }
        callback()
      }
    }
    const validateMembers = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('工作班成员不可为空'))
      } else {
        for (const item of value) {
          if (item.label.trim() === this.form.manager.label.trim()) {
            callback(new Error('工作负责人不可与工作班成员重复'))
          }
        }
        callback()
      }
    }
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      submitDisabled: false,
      form: {},
      rules: {
        firm: [
          { required: true, message: '工作单位不可为空', trigger: 'blur' }
        ],
        gzpId: [
          { required: true, min: 9, max: 9, message: '请输入正确的工作票号', trigger: 'blur' }
        ],
        manager: [{ validator: validateManager, trigger: ['change', 'blur'] }],
        members: [{ validator: validateMembers, trigger: ['change', 'blur'] }],
        wtId: [
          { required: true, message: '请选择风机', trigger: 'blur' }
        ],
        task: [
          { required: true, message: '请输入工作任务', trigger: 'blur' }
        ],
        planTimeRange: [
          { required: true, message: '请选择工作时间', trigger: 'blur' }
        ],
        weather: [{ required: true, message: '请输入天气', trigger: 'blur' }],
        windSpeed: [{ required: true, message: '请输入风速', trigger: 'blur' }],
        tmp: [{ required: true, message: '请输入温度', trigger: 'blur' }]
      },
      // 单位
      firmList: [],
      firmFetching: false,
      // 工作负责人
      managerList: [],
      managerFetching: false
    }
  },
  mounted () {
    this.form = this.savedForm
    fetchFirmList('', data => (this.firmList = data))
    fetchUserList('', data => (this.managerList = data))
    fetchNewGzpId(data => (this.$set(this.form, 'gzpId', data)))
    fetchWeather(data => {
      this.$set(this.form, 'weather', data.cond_txt)
      this.$set(this.form, 'windSpeed', data.wind_spd)
      this.$set(this.form, 'tmp', data.tmp)
    })
  },
  computed: {
    savedForm () {
      return this.$store.getters.gzpForm
    }
  },
  methods: {
    ...mapActions(['SaveGzpForm', 'SubmitGzpForm', 'GetGzpForm']),
    // handler
    handleSubmit (form) {
      this.submitDisabled = true
      this.$refs[form].validate(valid => {
        if (valid) {
          this.SubmitGzpForm(this.form)
            .then(res => alert(res))
            .catch(error => alert(error))
            .finally(() => {
              this.submitDisabled = false
            })
        } else {
          return false
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
        // if (data === []) {
        //   this.form.manager = value
        // }
        this.managerList = data
        }
      )
    },
    handleWtIdChange (value) {
      console.log(value)
      const regex = /^A[0-4][0-9]?$/
      let res = value.filter(i => regex.test(i)).filter(i => Number(i.slice(1)) <= 40).filter(i => Number(i.slice(1)) <= 40)
      res = res.map(i => {
        return 'A' + i.slice(1).padStart(2, '0')
      })
      this.$set(this.form, 'wtId', Array.from(new Set(res)))
    }
  }
}
</script>
