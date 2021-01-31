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
        <el-radio-button label="timeGridWeek">周</el-radio-button>
        <el-radio-button label="timeGridDay">日</el-radio-button>
        <el-radio-button label="listDay">列表</el-radio-button>
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
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import moment from 'moment'
import { calendar } from './calendar.js' // 农历计算方法

let calendarApi // 日历视图API
let slotMoment = 0 // 处理双击事件
const today = moment().format('YYYY-MM-DD')
const displayEventTime = true // 是否显示农历
// const myTipsDom = null
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

export default {
  name: 'CalendarView',

  components: {
    FullCalendar
  },

  data() {
    return {
      title: '视图标题',
      shownong: false,
      viewTitle: '',
      // 日历视图配置对象
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin], // 绑定的控件 月、日 网格插件
        headerToolbar: { // 头部导航栏
          left: '',
          center: '',
          right: ''
        },
        initialView: 'timeGridWeek', // 初始化视图
        events: [ // 视图填充数据
          { title: 'event 1eventeventeventeventevent', date: '2021-01-23', editable: true, color: 'red', id: 222 },
          { title: 'event 2', date: '2021-01-29 07:00' },
          { title: 'event 2', date: '2021-01-29', textColor: 'red', borderColor: 'blue' },
          { title: 'event 2', date: '2021-01-29', color: 'blue' },
          { title: 'event 2', date: '2021-01-29', backgroundColor: 'green' },
          // { title: 'event 2', date: '2021-01-30', display: 'background' },
          { title: 'event 2', date: '2021-01-29' },
          { title: 'event 2', date: '2021-01-29' },
          { title: 'event 2', date: '2021-01-29' },
          { title: 'event 2', date: '2021-01-29' },
          { title: 'event 2', date: '2021-01-29' },
          { title: 'event 2', date: '2021-01-29' },
          { title: 'event 2', date: '2021-01-29' },
          { title: 'event 2', date: '2021-01-29' },
          { title: 'event 2', date: '2021-01-25' },
          { title: 'event 2', date: '2021-01-25' },
          { title: 'event 2', date: '2021-01-25' },
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
        dayMaxEventRows: true,
        initialDate: moment().format('YYYY-MM-DD'), // 自定义设置背景颜色时一定要初始化日期时间
        // timeGridEventMinHeight: '60', // 设置事件的最小高度
        locale: 'zh-cn', // 中文格式
        views: {
          // 月视图格式
          dayGridMonth: {
            // 农历显示
            dayCellContent: this.dayCellContent
          },
          // 周视图格式
          timeGridWeek: {
            // 农历显示
            dayCellContent: this.dayCellContent,
            // 表格头部
            dayHeaderContent(item) {
              return { html: dayMap[item.dow] }
            }
          },
          // 日视图格式
          timeGridDay: {
            // 农历显示
            dayCellContent: function() {
              return { html: '' }
            },
            // 表格头部
            dayHeaderContent(item) {
              let itemDate = moment(item.date).format('YYYY-MM-DD')
              itemDate = itemDate.split('-')
              const _dateF = calendar.solar2lunar(itemDate[0], itemDate[1], itemDate[2])
              return { html: `${_dateF.ncWeek}  农历${monthMap[_dateF.lMonth]}${_dateF.IDayCn}` }
            }
          }
        },
        // titleFormat: '',
        // dayHeaderFormat: { weekday: 'short', month: 'short', day: 'numeric', omitCommas: false }, // 表格头部日期格式
        // eventsSet: this.handleEvents, 获取事件日程集合
        // weekends: false, // 是否显示周末
        // hiddenDays: [1, 5], // 隐藏周一、周三、周五
        aspectRatio: 1.65, // 设置日历单元格宽度与高度的比例
        // eventColor: '#9df2b5', // 全部日历日程背景色
        // columnHeader: false,
        // allDaySlot: false, // 是否显示全天
        firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1
        allDayText: '全天',
        slotMinTime: '00:00', // 最小时间
        // slotMaxTime: '00:01', // 最大时间
        // slotDuration: '00:15:00', // 时间网格中时间间隔，1小时
        // defaultTimedEventDuration: '00:30', // 日程事件在时间网格中占用的高度，30分钟的高度
        // dayMaxEvents: true,
        slotLabelFormat: { // 左侧时间网格格式
          hour: 'numeric',
          minute: '2-digit',
          // omitZeroMinute: true,
          meridiem: 'short',
          hour12: false
        },
        eventTimeFormat: { // 在每个事件上显示的时间的格式
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        // 重新渲染
        handleDatesRender: (item) => {
          console.log(item, 'qqqqqqqq111111')
        },
        // titleFormat: {
        //   // week: "dd", // Sep 7 - 13 2013
        // },
        editable: false, // 控制拖动和缩放操作
        selectable: true, // 可以选中单元格空白处，触发 select
        datesSet: this.datesSet,
        select: this.dbclickRender, // 新建事件
        eventClick: this.handleEventClick, // 点击日程事件, 已有事件删除
        eventDrop: this.eventDrop // 拖拽成功回调
        // eventMouseEnter: this.eventMouseEnter
      },
      currentEvents: []
    }
  },

  mounted() {
    // 获取日历 API
    calendarApi = this.$refs.FullCalendar.getApi()
    this.updateView()
    // let tableDom = document.querySelector('.fc-scrollgrid-sync-table')
    // if (tableDom) {
    //   console.log(tableDom)
    //   tableDom.addEventListener('mouseover', (event) => {
    //     console.log('event', event)
    //   })
    // }
  },

  methods: {
    updateView(api, value) {
      if (calendarApi) {
        try {
          // 调用更新视图的API方法
          if (typeof calendarApi[api] === 'function') {
            calendarApi[api](value)
          }

          this.viewTitle = calendarApi.currentData.viewTitle
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
    },
    // 日处理
    dayCellContent(item) {
      let itemDate = moment(item.date).format('YYYY-MM-DD')
      const dayClass = `class=${itemDate === today ? 'calendar-today' : ''} day-number` // 添加今天样式
      itemDate = itemDate.split('-')
      const _dateF = calendar.solar2lunar(itemDate[0], itemDate[1], itemDate[2])
      // 标识今天样式
      return { html: `<p class="calendar-month-day"><span>${displayEventTime ? _dateF.IDayCn : ''}</span><label ${dayClass}>${_dateF.cDay}号</label></p>` }
    },
    handleDateClick: function(arg) {
      alert('date click! ' + arg.dateStr)
    },
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    handleDateSelect(selectInfo) {
      const title = prompt('Please enter a new title for your event')
      const calendarApi = selectInfo.view.calendar
      calendarApi.unselect() // clear date selection
      if (title) {
        calendarApi.addEvent({
          id: 3333,
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
        // calendarApi.refetchEvents()
      }
    },
    datesSet(args) {
      console.log('datesSet', args)
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
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    },
    handleEvents(events) {
      this.currentEvents = events
      console.log(events)
    },
    eventDrop(data) {
      const { event, oldEvent } = data
      console.log(event, oldEvent)
    },
    // 模拟点击单元格双击事件
    dbclickRender() {
      const currentMoment = new Date().getTime()
      if (currentMoment - slotMoment < 300) {
        console.log('dbclickRender')
        // alert('双击事件')
        // this.selectFn()
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
// @import '~@fullcalendar/core/main.css';
// @import '~@fullcalendar/daygrid/main.css';
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
  .calendar-month-day {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 10px 4px;
    margin: 0;
    .calendar-today {
      background: #2196f3;
      border-radius: 11px;
      padding: 4px 8px;
      color: #fff;
      margin-top: -4px;
    }
  }
  .fc-timeGridWeek-view {

  }
  .fc-timegrid-slot {
    background: #fff;
  }
  .fc-daygrid-event-harness {
    padding: 0 5px;
  }
  .fc-daygrid-day.fc-day-today {
    background: #fff;
    .fc-daygrid-day-top {
      padding: 2px 2px 0 0;
    }
  }
  // 修改日历视图样式 end
  .calendar-header {
    position: relative;
    display: flex;
    justify-content: center;
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
    left: 5px;
    top: 5px;
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
