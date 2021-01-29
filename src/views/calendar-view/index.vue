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
// import '@fullcalendar/dist/fullcalendar.css'

let calendarApi // 日历视图API
let slotMoment = 0 // 处理双击事件
// const myTipsDom = null

export default {
  name: 'CalendarView',

  components: {
    FullCalendar
  },

  data() {
    return {
      title: '视图标题',
      viewTitle: '',
      // 日历视图配置对象
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin], // 绑定的控件 月、日 网格插件
        headerToolbar: { // 头部导航栏
          left: '',
          center: '',
          right: ''
        },
        initialView: 'dayGridMonth', // 初始化视图
        events: [ // 视图填充数据
          { title: 'event 1eventeventeventeventevent', date: '2021-01-23', color: 'red', id: 222 },
          { title: 'event 2', date: '2021-01-29 07:00' },
          { title: 'event 2', date: '2021-01-29', textColor: 'red', borderColor: 'blue' },
          { title: 'event 2', date: '2021-01-29', color: 'blue' },
          { title: 'event 2', date: '2021-01-29', backgroundColor: 'green' },
          { title: 'event 2', date: '2021-01-30', display: 'background' },
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
          }
        ],
        locale: 'zh-cn', // 中文格式
        // views: {
        //   dayGrid: {
        //     // titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
        //     // options apply to dayGridMonth, dayGridWeek, and dayGridDay views
        //   },
        //   timeGrid: {

        //     // options apply to timeGridWeek and timeGridDay views
        //   },
        //   week: {
        //     // titleFormat: { year: 'numeric', month: 'short', day: '2-digit' }
        //     // options apply to dayGridWeek and timeGridWeek views
        //   },
        //   day: {
        //     // titleFormat: { year: 'numeric', month: 'short', day: '2-digit' }
        //     // options apply to dayGridDay and timeGridDay views
        //   }
        // },
        // titleFormat: '',
        // dayHeaderFormat: { weekday: 'short', month: 'short', day: 'numeric', omitCommas: false }, // 表格头部日期格式
        firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1
        allDayText: '全天',
        // slotMinTime: '6:00', // 最小时间
        // slotMaxTime: '23:00', // 最大时间
        // slotDuration: '00:30:00', // 时间网格中时间间隔，1小时
        // slotMinutes: 40,
        defaultTimedEventDuration: '00:30', // 日程事件在时间网格中占用的高度，30分钟的高度
        slotLabelFormat: { // 左侧时间网格格式
          hour: 'numeric',
          minute: '2-digit',
          // omitZeroMinute: true,
          meridiem: 'short',
          hour12: false
        },
        // formatDate: 'yyyy-MM-dd HH:mm:ss',
        eventTimeFormat: { // 在每个事件上显示的时间的格式
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        // eventsSet: this.handleEvents, 获取事件日程集合
        // weekends: false, // 是否显示周末
        // hiddenDays: [1, 5], // 隐藏周一、周三、周五
        // aspectRatio: 1, // 设置日历单元格宽度与高度的比例
        // eventColor: '#9df2b5', // 全部日历日程背景色
        // allDaySlot: false, // 是否显示全天
        editable: false, // 控制拖动和缩放操作
        selectable: true, // 可以选中单元格空白处，触发 select
        eventClick: this.handleEventClick, // 点击日程事件
        select: this.dbclickRender, // 点击非日程事件
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
      console.log('dbclickRender')
      const currentMoment = new Date().getTime()
      if (currentMoment - slotMoment < 300) {
        alert('双击事件')
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
    .fc-daygrid-day-number {
      background: #2196f3;
      border-radius: 11px;
      color: #fff;
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
