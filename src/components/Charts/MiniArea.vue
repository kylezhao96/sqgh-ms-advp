<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="dataSource" :scale="scale" :padding="[36, 0, 18, 0]">
        <v-tooltip />
        <v-smooth-area position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
// const beginDay = new Date().getTime()

// for (let i = 0; i < 10; i++) {
//   data.push({
//     x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
//     y: Math.round(Math.random() * 10)
//   })
// }

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]

export default {
  name: 'MiniArea',
  data () {
    return {
      tooltip,
      height: 100
    }
  },
  props: ['dataSource', 'scale'],
  created () {
    // console.log(this.cData)
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
