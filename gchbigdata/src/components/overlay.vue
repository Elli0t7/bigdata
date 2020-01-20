<template>
  <bm-overlay 
    ref="customOverlay" 
    class="sample"
    pane="labelPane"
    @draw="draw">
    <div id="map_label" v-if="marker!=null&&marker.type=='worker'">
        <p class="label_title">员工：{{marker.name}}</p>
      <div class="label_line"></div>
      <p>状态：{{marker.status}}</p>
      <p>{{marker.position.lng}}</p>
      <p>{{marker.position.lat}}</p>
     </div>
    <div id="map_label" v-if="marker!=null&&marker.type=='boat'">
        <p class="label_title">观光船：{{marker.name}}</p>
      <div class="label_line"></div>
      <p>状态：{{marker.status}}</p>
      <p>{{marker.position.lng}}</p>
      <p>{{marker.position.lat}}</p>
     </div>
     <div id="map_label" v-if="marker!=null&&marker.type=='bus'">
        <p class="label_title">游览车：{{marker.name}}</p>
      <div class="label_line"></div>
      <p>状态：{{marker.status}}</p>
      <p>{{marker.position.lng}}</p>
      <p>{{marker.position.lat}}</p>
     </div>
    <div id="map_label" v-if="marker!=null&&marker.type=='camera'">
      <p class="label_title">{{marker.name}}</p>
      <div class="label_line"></div>
      <p>{{marker.video.name}}</p>
      <p>{{marker.position.lng}}</p>
      <p>{{marker.position.lat}}</p>
      <p>状态：工作中</p>
      <p class="">投射到监控屏幕：</p>
      <div class="label_screen " >
        <span @click="$emit('ShowScreen',1)">1</span>
        <span @click="$emit('ShowScreen',2)">2</span>
        <span @click="$emit('ShowScreen',3)">3</span>
        <span @click="$emit('ShowScreen',4)">4</span>
        <span @click="$emit('ShowScreen',5)">5</span>
        <span @click="$emit('ShowScreen',6)">6</span>
        </div><p></p>
        </div>
  </bm-overlay>
</template>

<script>
export default {
  // props: ['text', 'position', 'active'],
  props: ["marker"],
  watch: {
    marker: {
      handler() {
          this.$refs.customOverlay.reload();
      },
      deep: true
    }
  },
  methods: {
    
    draw({ el, BMap, map }) {     
      if(this.marker==null)return false;
      const { lng, lat } = this.marker.position;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - 60 + "px";
      el.style.top = pixel.y - 20 + "px";
    }
  }
};
</script>

<style>
.sample {
  /* width: 120px;
  height: 40px;  */
  /* line-height: 40px; */
  background: rgba(0, 0, 0, 0.5);
  /* overflow: hidden; */
  box-shadow: 0 0 5px #000;
  color: #fff;
  text-align: left;
  /* padding: 10px; */
  position: absolute;
}
.sample1.active {
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
}

#map_label {
  color: #fff;
  background-color: rgba(41, 66, 95, 0.8);
  border: 0.14vw solid #fbb03b;
  width: 12vw;
  height: 12vw;
  font-size: 0.7vw;
  z-index: 99;
  position: relative;
  box-sizing: border-box;
}
#map_label > p {
  line-height: 1.3vw;
  padding: 0 0.5vw;
}
#map_label .label_line {
  width: 100%;
  height: 0;
  border-top: 2px solid #999;
}

#map_label .label_screen {
  justify-content: center;
  display: flex;
  align-items: center;
  /* height: 2vw; */
}

#map_label .label_screen > span {
  background-color: #fbb03b;
  display: inline-block;
  width: 1.2vw;
  height: 1.2vw;
  text-align: center;
  line-height: 1.1vw;
  font-weight: 700;
  cursor: pointer;
  margin-right: 2px;
}
#map_label > p {
  line-height: 1.3vw;
  padding: 0 0.5vw;
  margin: 0;
}
</style>