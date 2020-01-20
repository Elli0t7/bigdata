<template>
  <div id="clock">    
    <div class="time">{{ clock.time }}</div> 
    <div class="date">{{ clock.date }}</div> 
    <div class="week">{{ clock.week}}</div> 
  </div>
</template>

<script>
  export default {
    // name: 'ComponentName',
    data() {
      return {
        timerID:'',
        week:['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        clock:{
          data: '',
          time: '',
          week: ''
        }
        
      }
    },
    methods: {
      updateTime() {
        var cd = new Date();
        this.clock.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(),
          2);
        this.clock.date = this.zeroPadding(cd.getFullYear(), 4) + '年 ' + this.zeroPadding(cd.getMonth() + 1, 2) + '月' + this.zeroPadding(cd.getDate(),2)+'日',
           + ' ';          
          this.clock.week=this.week[cd.getDay()]
      },
      zeroPadding(num, digit) {
        var zero = '';
        for (var i = 0; i < digit; i++) {
          zero += '0';
        }
        return (zero + num).slice(-digit);
      }
    },
    mounted(){
      this.timerID=setInterval(() => {
        this.updateTime()
      }, 1000);      
    }
  }

</script>

<style>
  #clock {
    width: 100%;
    height: 100%;
    /* background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%);
    background-size: 100%; */
    font-family: 'Microsoft YaHei', 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'STHeiti', 'WenQuanYi Micro Hei', 'SimSun', sans-serif;
    color: #ffffff;
    text-align: center;   
    color: #daf6ff;
    text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
  }

  #clock .time {
    text-align: left;
    letter-spacing: 0.12em;
    font-size: 3vh;
    padding-top: 1vh;
  }

  #clock .date {
    text-align: left;
    letter-spacing: 0.1em;
    font-size: 1.8vh;
  }

  #clock .week {
    text-align: left;
    letter-spacing: 0.1em;
    font-size: 1.4vh;
   
  }

</style>
