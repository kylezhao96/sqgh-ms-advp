<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span>
          </div>
          <div>值班员 | 石桥子风电场 </div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="项目数" :value="56" />
        </div>
        <div class="stat-item">
          <a-statistic title="团队内排名" :value="8" suffix="/ 24" />
        </div>
        <div class="stat-item">
          <a-statistic title="项目访问" :value="2223" />
        </div>
      </div>
    </template>

    <div>
      <!-- 行一 简易数据展示  -->
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="昨日发电量（万kWh）" :total="gpDay">
            <a-tooltip :title="tooltipTitle" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-area :dataSource="gpDataList" :scale="gpDataScale"/>
            </div>
            <template slot="footer"><trend :flag="gpDodFlag">
              <span slot="term">日同比</span>
              {{ gpDodPercent }}%
            </trend></template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="昨日风速（m/s）" :total="wsDay">
            <a-tooltip :title="tooltipTitle" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-area :dataSource="wsDataList" :scale="wsDataScale"/>
            </div>
            <template slot="footer"><trend :flag="wsDodFlag">
              <span slot="term">日同比</span>
              {{ wsDodPercent }}%
            </trend></template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="日停机时间统计" :total="10 | NumberFormat">
            <a-tooltip :title="tooltipTitle" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-bar />
            </div>
            <template slot="footer">本月机组可利用率 <span>60%</span></template>
          </chart-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="年度计划完成情况" :total="yearRate+'%'">
            <a-tooltip :title="tooltipTitle" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-progress color="rgb(19, 194, 194)" :target="planRate" :percentage="yearRate" height="8px" />
            </div>
            <template slot="footer">
              月计划完成率 <span>{{ monthRate }}%</span>
            </template>
          </chart-card>
        </a-col>
      </a-row>
      <!-- 行二 值班工具 -->
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="wtm-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="工作票列表"
            :body-style="{ padding: 0 }"
          >
            <a slot="extra">添加</a>
            <div>
              <a-table :columns="gzpColumns" :data-source="gzpsList">
                <!--                <a slot="action" slot-scope="text" href="javascript:;">Delete</a>-->
                <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
                  {{ record.description }}
                </p>
              </a-table>
            </div>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="快速开始 / 便捷导航" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="item-group">
              <a>操作一</a>
              <a>操作二</a>
              <a>操作三</a>
              <a>操作四</a>
              <a>操作五</a>
              <a>操作六</a>
              <a-button size="small" type="primary" ghost icon="plus">添加</a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapActions, mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import {
  Radar,
  MiniArea,
  MiniBar,
  MiniProgress,
  ChartCard
} from '@/components'

import { getRoleList, getServiceList } from '@/api/manage'
import store from '@/store'
import { baseMixin } from '@/store/app-mixin'

const DataSet = require('@antv/data-set')
const gzpColumns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: '工作票号'
  },
  {
    title: '工作负责人',
    dataIndex: 'manager',
    key: 'manager'
  },
  {
    title: '工作班成员',
    dataIndex: 'members',
    key: 'members'
  },
  {
    title: '计划开始时间',
    key: 'pstart_time',
    dataIndex: 'pstart_time'
  },
  {
    title: '计划结束时间',
    key: 'pstop_time',
    dataIndex: 'pstop_time'
  }
]
// 发电量
const gpDataScale = [
  {
    dataKey: 'x',
    alias: '日期'
  },
  {
    dataKey: 'y',
    alias: '发电量',
    min: 0
  }]
// 风速
const wsDataScale = [
  {
    dataKey: 'x',
    alias: '日期'
  },
  {
    dataKey: 'y',
    alias: '风速',
    min: 0
  }]
const barData = []
const barData2 = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

export default {
  name: 'Workplace',
  mixins: [baseMixin],
  components: {
    PageHeaderWrapper,
    Radar,
    MiniArea,
    MiniBar,
    MiniProgress,
    ChartCard
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      tooltipTitle: '',
      // 工作票表格
      gzpColumns,
      // 发电量
      gpDay: '',
      gpDodPercent: '',
      gpDodFlag: 'up',
      gpDataList: [],
      gpDataScale,
      // 风速
      wsDay: '',
      wsDodPercent: '',
      wsDodFlag: 'up',
      wsDataList: [],
      wsDataScale,
      // 完成率
      yearRate: 0,
      monthRate: 0,
      planRate: 0,
      //
      barData,
      barData2,
      // 工作票
      gzpsList: [],
      projects: [],
      loading: true,
      radarLoading: true,
      activities: [],
      teams: [],

      // data
      axis1Opts: {
        dataKey: 'item',
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }
      },
      axis2Opts: {
        dataKey: 'score',
        line: null,
        tickLine: null,
        grid: {
          type: 'polygon',
          lineStyle: {
            lineDash: null
          }
        }
      },
      scale: [{
        dataKey: 'score',
        min: 0,
        max: 80
      }],
      axisData: [
        { item: '引用', a: 70, b: 30, c: 40 },
        { item: '口碑', a: 60, b: 70, c: 40 },
        { item: '产量', a: 50, b: 60, c: 40 },
        { item: '贡献', a: 40, b: 50, c: 40 },
        { item: '热度', a: 60, b: 70, c: 40 },
        { item: '引用', a: 70, b: 50, c: 40 }
      ],
      radarData: []
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    currentUser () {
      return {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar

    getRoleList().then(res => {
      // console.log('workplace -> call getRoleList()', res)
    })

    getServiceList().then(res => {
      // console.log('workplace -> call getServiceList()', res)
    })
  },
  mounted () {
    // 获取发电量数据
    this.getAnalysisData()
    // 获取工作票文件
    this.getGzpsList()
    // this.getProjects()
    // this.getActivity()
    // this.getTeams()
    // this.initRadar()
  },
  methods: {
    ...mapActions(['GetMiniChartData', 'GetBarData']),
    getAnalysisData () {
      store.dispatch('GetMiniChartData')
        .then(res => {
          this.getAnalysisDataSuccess(res)
        })
        // .catch(err => {pass})
        .finally(() => {
        })
    },
    getAnalysisDataSuccess (res) {
      // 风速
      // const wsDataList = list.map(x => {
      //   return { x: x.date, y: x.davgs }
      // })
      this.tooltipTitle = '数据更新于 ' + res.dataList[0].date
      this.gpDataList = res.dataList.map(x => {
        return { x: x.date, y: x.dgp / 10000 }
      })
      this.wsDataList = res.dataList.map(x => {
        return { x: x.date, y: x.davgs }
      })
      this.yearRate = res.yearRate
      this.monthRate = res.monthRate
      this.planRate = res.planRate
      // 发电量
      this.gpDay = res.dataList[0].dgp / 10000
      this.gpDodFlag = res.dataList[0].dgp < res.dataList[1].dgp ? 'down' : 'up'
      this.gpDodPercent = Math.abs(((res.dataList[0].dgp - res.dataList[1].dgp) / res.dataList[1].dgp * 100).toFixed(2))
      // 风速
      this.wsDay = res.dataList[0].davgs
      this.wsDodFlag = res.dataList[0].davgs < res.dataList[1].davgs ? 'down' : 'up'
      this.wsDodPercent = Math.abs(((res.dataList[0].davgs - res.dataList[1].davgs) / res.dataList[1].davgs * 100).toFixed(2))
      // 修改状态
      // this.row1Loading = false
      this.loading = false
    },
    getProjects () {
      this.$http.get('/list/search/projects')
        .then(res => {
          this.projects = res.result && res.result.data
          this.loading = false
        })
    },
    getGzpsList () {
      store.dispatch('GetGzpsList')
        .then(res => {
          this.gzpsList = res.gzpsList
        })
        // .catch(err => {pass})
        .finally(() => {
        })
    },
    getTeams () {
      this.$http.get('/workplace/teams')
        .then(res => {
          this.teams = res.result
        })
    },
    initRadar () {
      this.radarLoading = true

      this.$http.get('/workplace/radar')
        .then(res => {
          const dv = new DataSet.View().source(res.result)
          dv.transform({
            type: 'fold',
            fields: ['个人', '团队', '部门'],
            key: 'user',
            value: 'score'
          })

          this.radarData = dv.rows
          this.radarLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "./Workplace.less";

  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }

    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }

      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }

    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
