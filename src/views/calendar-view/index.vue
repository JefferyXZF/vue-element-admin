<template>
  <div class="calendar-view-container">
    <div class="calendar-header">
      <div class="view-title">{{ title }}</div>
      <div class="calendar-title">
        <el-button type="text" icon="el-icon-arrow-left" @click="prev" />
        {{ viewTitle }}
        <el-button type="text" icon="el-icon-arrow-right" @click="next" />
      </div>
      <el-radio-group v-model="calendarOptions.initialView" class="view-operate" @change="changeView">
        <el-radio-button label="dayGridMonth">月</el-radio-button>
        <el-radio-button :label="isDateType ? 'dayGridWeek' : 'timeGridWeek'">周</el-radio-button>
        <el-radio-button :label="isDateType ? 'dayGridDay' : 'timeGridDay'">日</el-radio-button>
        <!-- <el-radio-button label="listYear">listYear列表</el-radio-button>
        <el-radio-button label="listMonth">listMonth列表</el-radio-button>
        <el-radio-button label="listWeek">listWeek列表</el-radio-button>
        <el-radio-button label="listDay">listDay列表</el-radio-button> -->
      </el-radio-group>
    </div>

    <FullCalendar
      ref="FullCalendar"
      :options="calendarOptions"
    />
    <div ref="myTips" class="tips">
      双击创建记录
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionGridPlugin from '@fullcalendar/interaction'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import listGridPlugin from '@fullcalendar/list'
import moment from 'moment'
import { calendar } from './calendar.js' // 农历计算方法

let calendarApi // 日历视图API
let slotMoment = 0 // 处理双击事件
const todayDate = moment().format('YYYY-MM-DD')
let gridTableDom // 悬浮表格
let tipsDom // 提示dom

const dayMap = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六'
}
const monthMap = {
  1: '一月',
  2: '二月',
  3: '三月',
  4: '四月',
  5: '五月',
  6: '六月',
  7: '七月',
  8: '八月',
  9: '九月',
  10: '十月',
  11: '十一月',
  12: '十二月'
}

// 格式化月/周视图
function formatMonthAndWeek(lunarCalendar) {
  return {
    displayEventTime: false, // 是否显示时间
    // 农历显示
    dayCellContent: function(item) {
      let itemDate = moment(item.date).format('YYYY-MM-DD')
      const dayClass = `class="${itemDate === todayDate ? 'calendar-today' : ''} day-number"` // 添加今天样式
      itemDate = itemDate.split('-')
      const _dateF = calendar.solar2lunar(itemDate[0], itemDate[1], itemDate[2])
      // 标识今天样式
      return { html: `<p class="calendar-number-day"><span>${lunarCalendar ? _dateF.IDayCn : ''}</span><label ${dayClass}>${_dateF.cDay}号</label></p>` }
    },
    // 表格头部
    dayHeaderContent(item) {
      return { html: dayMap[item.dow] }
    }
  }
}

// 格式化日视图
function formatDayGrid(lunarCalendar) {
  return {
    displayEventTime: false, // 是否显示时间
    // 农历显示
    dayCellContent: function() {
      return { html: '' }
    },
    // 表格头部
    dayHeaderContent(item) {
      let itemDate = moment(item.date).format('YYYY-MM-DD')
      itemDate = itemDate.split('-')
      const _dateF = calendar.solar2lunar(itemDate[0], itemDate[1], itemDate[2])
      return lunarCalendar ? { html: `${_dateF.ncWeek}  农历${monthMap[_dateF.lMonth]}${_dateF.IDayCn}` } : { html: _dateF.ncWeek }
    }
  }
}

function hideTips() {
  tipsDom && (tipsDom.style.cssText = 'display:none;')
}

function addMouseEvent() {
  const ableDom = document.querySelector('.fc-scrollgrid-sync-table')

  if (ableDom && gridTableDom !== ableDom) {
    const fn = (ev) => {
      tipsDom && (tipsDom.style.cssText = `display:block;left:${ev.x + 20}px;top:${ev.y}px`)
    }

    gridTableDom && gridTableDom.removeEventListener('mousemove', fn)
    ableDom.addEventListener('mousemove', fn)
    ableDom.addEventListener('mouseout', () => {
      hideTips()
    }, false)
    gridTableDom = ableDom
  }
}

export default {
  name: 'CalendarView',

  components: {
    FullCalendar
  },

  props: {
    // 开始时间
    startDate: {
      type: Object,
      default: () => ({
        type: 'DateField',
        initialDate: ''
      })
    },
    // 数据标题
    title: {
      type: String,
      default: '视图标题'
    },
    // 默认视图
    initialView: {
      type: String,
      default: 'dayGridMonth'
    },
    // 默认日程事件颜色
    eventColor: {
      type: String,
      default: '#1890ff'
    },
    // 是否显示农历
    showLunarCalendar: {
      type: Boolean,
      default: false
    },
    // 隐藏天数
    hiddenDays: {
      type: Array,
      default: () => []
    },
    // 操作权限
    operate: {
      type: Object,
      default: () => ({
        addAble: true, // 新增
        detailAble: true, // 查看
        deleteable: false, // 删除
        dropAble: true // 拖拽
      })
    }
  },

  data() {
    return {
      viewTitle: '',
      // 日历视图配置对象
      calendarOptions: {
        plugins: [],
        headerToolbar: {
          left: '',
          center: '',
          right: ''
        },
        initialView: this.initialView,
        initialDate: this.startDate && this.startDate.initialDate && moment(new Date(this.startDate.initialDate)).format('YYYY-MM-DD') || undefined, // 开始日期时间
        events: [ // 视图填充数据
          { title: 'event 1eventeventeventeventevent', date: '2021-01-23', editable: true, color: 'red', id: 222 },
          {
            title: '标题',
            start: '2021-01-29',
            end: '2021-02-03', // 这里要注意，end为可选参数，无end参数时该事件仅在当天展示
            backgroundColor: '#FDEBC9', // 该事件的背景颜色
            borderColor: '#FDEBC9', // 该事件的边框颜色
            textColor: '#F9AE26' // 该事件的文字颜色
          },
          {
            title: '标题',
            start: '2021-01-29',
            end: '2021-02-03', // 这里要注意，end为可选参数，无end参数时该事件仅在当天展示
            backgroundColor: '#FDEBC9', // 该事件的背景颜色
            borderColor: '#FDEBC9', // 该事件的边框颜色
            textColor: '#F9AE26' // 该事件的文字颜色
          },
          {
            title: '标题',
            start: '2021-01-29',
            end: '2021-02-03', // 这里要注意，end为可选参数，无end参数时该事件仅在当天展示
            backgroundColor: '#FDEBC9', // 该事件的背景颜色
            borderColor: '#FDEBC9', // 该事件的边框颜色
            textColor: '#F9AE26' // 该事件的文字颜色
          },
          {
            title: '标题',
            start: '2021-01-29',
            end: '2021-02-03', // 这里要注意，end为可选参数，无end参数时该事件仅在当天展示
            backgroundColor: '#FDEBC9', // 该事件的背景颜色
            borderColor: '#FDEBC9', // 该事件的边框颜色
            textColor: '#F9AE26' // 该事件的文字颜色
          },
          {
            title: '标题',
            start: '2021-01-29',
            end: '2021-02-03', // 这里要注意，end为可选参数，无end参数时该事件仅在当天展示
            backgroundColor: '#FDEBC9', // 该事件的背景颜色
            borderColor: '#FDEBC9', // 该事件的边框颜色
            textColor: '#F9AE26' // 该事件的文字颜色
          },
          {
            title: '标题',
            start: '2021-01-29',
            end: '2021-02-03', // 这里要注意，end为可选参数，无end参数时该事件仅在当天展示
            backgroundColor: '#FDEBC9', // 该事件的背景颜色
            borderColor: '#FDEBC9', // 该事件的边框颜色
            textColor: '#F9AE26' // 该事件的文字颜色
          },
          {
            title: '标题',
            start: '2021-01-29',
            end: '2021-02-03', // 这里要注意，end为可选参数，无end参数时该事件仅在当天展示
            backgroundColor: '#FDEBC9', // 该事件的背景颜色
            borderColor: '#FDEBC9', // 该事件的边框颜色
            textColor: '#F9AE26' // 该事件的文字颜色
          }
        ],
        dayMaxEventRows: true, // 开启更多事件
        locale: 'zh-cn', // 中文格式
        // weekends: true, // 是否显示周末
        hiddenDays: this.hiddenDays,
        aspectRatio: 1.65, // 设置日历单元格宽度与高度的比例
        eventColor: this.eventColor, // 全部日历日程背景色
        firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1
        allDayText: '全天',
        // allDaySlot: false, // 是否显示全天
        defaultTimedEventDuration: '00:30', // 日程事件在时间网格中占用的高度，30分钟的高度
        slotLabelFormat: { // 左侧时间网格格式
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        eventTimeFormat: { // 在每个事件上显示的时间的格式
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        editable: this.operate.dropAble, // 控制拖动和缩放操作
        selectable: this.operate.addAble, // 可以选中单元格空白处，触发 select
        select: this.handleEventDblClick, // 新建日程事件
        eventClick: this.handleEventClick, // 查看日程事件
        moreLinkClick: this.eventLimitClick,
        eventDrop: this.eventDrop, // 拖拽成功回调
        eventMouseEnter: hideTips, // 鼠标滑入日程事件
        views: {
          // 月视图格式
          dayGridMonth: this.formatMonthorWeek(),
          // 周视图日格式
          dayGridWeek: this.formatMonthorWeek(),
          // 周视图时间格式
          timeGridWeek: this.formatMonthorWeek(),
          // 日视图日格式
          dayGridDay: this.formatDayGrid(),
          // 日视图时间格式
          timeGridDay: this.formatDayGrid()
        }
      }
    }
  },

  computed: {
    isDateType() {
      return this.startDate && (this.startDate.type === 'DateField')
    }
  },

  created() {
    this.loadPlugins()
  },

  mounted() {
    // 获取日历 API
    calendarApi = this.$refs.FullCalendar.getApi()
    tipsDom = this.$refs.myTips

    addMouseEvent() // 添加鼠标悬浮事件
    this.updateView()
  },

  methods: {
    // 加载插件
    loadPlugins() {
      try {
        // 冻结对象，优化性能，防止进行响应式处理
        // const dayGridPlugin = require('@fullcalendar/daygrid').default // 月视图
        // const timeGridPlugin = require('@fullcalendar/timegrid').default // 周/日视图
        // const listGridPlugin = require('@fullcalendar/list').default // 列表视图
        // const interactionGridPlugin = require('@fullcalendar/interaction').default // eventClick 事件
        const dayGridPlugin = Object.freeze(require('@fullcalendar/daygrid').default) // 月视图
        const timeGridPlugin = Object.freeze(require('@fullcalendar/timegrid').default) // 周/日视图
        const listGridPlugin = Object.freeze(require('@fullcalendar/list').default) // 列表视图
        const interactionGridPlugin = Object.freeze(require('@fullcalendar/interaction').default) // eventClick 事件

        this.calendarOptions.plugins.push(dayGridPlugin, interactionGridPlugin, timeGridPlugin, listGridPlugin)
      } catch (error) {
        console.log(error)
      }
    },
    updateView(api, value) {
      if (calendarApi) {
        try {
          // 调用更新视图的API方法
          if (typeof calendarApi[api] === 'function') {
            calendarApi[api](value)
          }
          const startDate = moment(calendarApi.view.activeStar).format('YYYY-MM-DD')
          const endDate = moment(calendarApi.view.activeEnd).format('YYYY-MM-DD')

          // 请求接口
          // ...
          console.log(startDate, endDate, calendarApi.view)

          this.viewTitle = calendarApi.view.title
        } catch (error) {
          console.log(error)
        }
      }
    },
    // 切换上月/周/日
    prev() {
      this.updateView('prev')
    },
    // 切换下月/周/日
    next() {
      this.updateView('next')
    },
    // 切换视图
    changeView(value) {
      this.updateView('changeView', value)
      this.$nextTick(() => {
        addMouseEvent()
      })
    },
    // 月/周视图表格标题处理
    formatMonthorWeek() {
      return formatMonthAndWeek(this.showLunarCalendar)
    },
    // 格式化日视图
    formatDayGrid() {
      return formatDayGrid(this.showLunarCalendar)
    },
    eventLimitClick(selectInfo) {
      console.log('eventLimitClick', selectInfo)
      const calendar = selectInfo.view.calendar
      if (calendar) {
        calendar.unselect() // clear date selection
        calendar.addEvent({ id: 2233, title: 'event 2', start: selectInfo.startStr,
          end: selectInfo.endStr })
      }
      return false
    },
    selectFn(selectInfo) {
      const title = prompt('请输入心间信息')
      const calendarApi = selectInfo.view.calendar
      calendarApi.unselect() // clear date selection
      console.log('eventAddFn')

      if (title) {
        calendarApi.addEvent({
          // id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr
          // allDay: selectInfo.allDay
        })
      }
    },
    handleEventClick(clickInfo) {
      console.log(clickInfo)
      if (!this.operate.detailAble) return
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    },
    eventDrop(data) {
      const { event, oldEvent } = data
      console.log(event, oldEvent)
    },
    // 模拟点击单元格双击事件
    handleEventDblClick(value) {
      console.log('value', value)
      const currentMoment = new Date().getTime()
      if (currentMoment - slotMoment < 300) {
        console.log('handleEventDblClick')
        // alert('双击事件')
        this.selectFn(value)
      }

      slotMoment = currentMoment
      const timer = setTimeout(() => {
        slotMoment = 0
        timer && clearTimeout(timer)
      }, 400)
    },
    eventMouseEnter(data, ev) {
      console.log(data, ev)
    }
  }
}
</script>

<style lang="scss">

.calendar-view-container {
  min-width: 1000px;
  padding: 20px;
  height: 100%;
  // 修改日历视图样式 start
  .fc-toolbar.fc-header-toolbar {
    margin-bottom: 1em;
  }
  .fc-scrollgrid-section-header {
    background: #f2f2f2;
    .fc-scrollgrid-sync-inner {
      padding: 4px 0;
    }
  }
  // 自定义月单元格样式
  .calendar-number-day {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin: 4px;
    .day-number {
      padding: 2px 8px;
    }
    .calendar-today {
      background: #2196f3;
      border-radius: 10px;
      color: #fff;
    }
  }
  .fc-timegrid-slot {
    background: #fff;
  }
  .fc-daygrid-event-harness {
    padding: 0 5px;
  }
  .fc .fc-highlight {
    background: rgba(255,136,77,.05);
  }
  .fc .fc-daygrid-day.fc-day-today {
    background: #fff;
    .fc-daygrid-day-top {
      padding: 2px 2px 0 0;
    }
  }
  .fc-daygrid-body-natural .fc-daygrid-day-events {
    margin-bottom: 10px;
  }
  .fc-daygrid-more-link {
    display: inline-block;
    padding-top: 4px;
  }
  .fc-more-popover .fc-popover-body {
    max-height: 600px;
    overflow: auto;
  }
  // 修改日历视图样式 end
  .calendar-header {
    position: relative;
    display: flex;
    justify-content: center;
    user-select: none;
    .view-title {
      position: absolute;
      left: 0;
      line-height: 36px;
      width: 300px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .view-operate {
      position: absolute;
      right: 0;
    }
  }
  .tips {
    position: fixed;
    display: none;
    color: #333;
    padding: 0 5px;
    z-index: 100000;
    background: #f7faff;
    border: 1px solid #ddd;
    height: 25px;
    line-height: 25px;
    border-radius: 5px;
    text-align: center;
  }

}
/*滚动条*/
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: #F4F6F8;
}

::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: #E5E5E5;
}

::-webkit-scrollbar-thumb:hover {
  background: #BFC1C7;
}
</style>
