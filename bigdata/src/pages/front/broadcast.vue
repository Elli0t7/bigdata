<template>
  <q-page class="fh-page">
    <div class="map-box" id='map'></div>
    <div class="data-box">
      <div class="data-wrapper">
        <div class=" fit" style="padding-top:100px">
          <div class="pop-box fit">
            <div class="left-head">
              <div class="search-box ">
                <q-input v-model="keyword" outlined rounded clearable dark dense placeholder='搜索'>
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
            <q-scroll-area style="height: 92%" :thumb-style="{
                                                            right: '4px',
                                                            borderRadius: '5px',
                                                            background: '#18ffff',
                                                            width: '10px',
                                                            opacity: .5
                                                          }" :delay="500">
              <q-tree :filter='keyword' color="secondary" class='monitor-tree' :ticked.sync="ticked" tick-strategy='leaf' default-expand-all dark :selected.sync="selected" :nodes="tree" @lazy-load="onLazyLoad" :expanded.sync="propsExpanded" node-key="custId">
                <div slot="header-generic" slot-scope="prop" class="row items-center">
                  <q-icon :name="prop.node.Status==0?'rss_feed':'rss_feed'" :color="prop.node.Status==0?'green':'red'" size='24px' class="q-mr-sm" />
                  <div :class="['text-weight-bold',prop.node.Status==0?'text-green':'text-red']">{{ prop.node.label }}
                  </div>
                </div>
                <div slot="header-first" slot-scope="prop" class="row items-center">
                  <q-icon name='home' color="green" size='24px' class="q-mr-sm" />
                  <div class="text-green">{{ prop.node.label }}
                  </div> &nbsp;( {{prop.node.children.length}} )
                </div>
              </q-tree>
            </q-scroll-area>
          </div>
        </div>
      </div>
    </div>
    <object width="0" height="0" id="wkipobj" name="wkip" classid="clsid:106DC585-E8EB-4DEB-82CD-1A3FD61B11D2">
    </object>
    <q-dialog v-model="opened" @show='onModalShow' @hide='onModalHide' :no-backdrop-dismiss='true'>
      <q-layout class="by pop-box">
        <q-toolbar>
          <q-icon name='rss_feed' size='24px' color='green' />
          <q-toolbar-title class='byhead'>
            广播发布
          </q-toolbar-title>
          <q-btn flat round dense @click="opened = false" class='text-tt' icon="close" />
        </q-toolbar>
        <q-separator color='spc' />
        <div class="row fit broad-ctrl-box ">
          <div class="col-5 ">
            <div class="fit q-pr-xs">
              <fieldset>
                <div class="ftt">播放设置</div>
                <q-separator color='spc' />
                <div class="server-box row items-center">
                  <div class="col-9">
                    <div class="server-info">
                      <div v-if="serverState==0" class="text-green">
                        <i aria-hidden="true" class="q-icon  material-icons " style="font-size: 22px; margin-right:10px">cloud</i>已连接广播服务器！</div>
                      <div v-if="serverState==-1" class="text-deep-orange-13">
                        <i aria-hidden="true" class="q-icon  material-icons " style="font-size: 22px; margin-right:10px">cloud_off</i>未连接广播服务器！</div>
                    </div>
                  </div>
                  <div class="col-3">
                    <q-btn icon="refresh" v-if="serverState!=0" label='重连' @click="connectServer" color='white' dense flat />
                  </div>
                </div>
                <q-input label="终端数量" readonly dark v-model="broadCount">
                  <template v-slot:prepend>
                    <q-icon name="device_hub" color='green' />
                  </template>
                </q-input>
              
                <q-select :error='$v.selectSpeak.$error' error-label='请选择播放区域' label="播放区域" multiple filter dark color="green" v-model="selectSpeak" clearable :options="broad" @blur="$v.selectSpeak.$touch">
                  <template v-slot:prepend>
                    <q-icon name="edit_location" color="green" @click.stop />
                  </template>
                </q-select>
             
              
                  <q-input type='text'  label="播放通道" readonly dark color="green" v-model="play_ch" align='center' >
                    <template v-slot:prepend>
                    <q-icon name="timeline" color="green" @click.stop />
                  </template>
                  </q-input>
                  <q-item>
                  <q-item-section avatar>
          <q-icon color="teal" name="volume_up" />
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="spkVolume"
            :min="0"
            :max="100"
            label
            color="teal"
          />
        </q-item-section>
      </q-item>                 
                
                <q-input :max-height='30' class="spk-msg" dark readonly v-model="spkMessage" inverted rows="2" label="服务日志" type="textarea" />

              </fieldset>
            </div>
          </div>
          <div class="col-7 q-pl-xs">
            <div class="column fit">
              <div class="col-6 q-pb-xs">
                <fieldset>
                  <div class="ftt">声卡实时讲话</div>
                  <q-separator color='spc' />
                  <div class="column fit">
                    <div class="col-6">
                      
                    <q-input label="选择声卡" dark  hint='点击刷新按钮读取声卡' :error='$v.spkSoundCardName.$error' error-label='未检测到声卡，请重试!' v-model="spkSoundCardName" type='text'  color="light-green"  >
                    <template v-slot:prepend>
                      <q-icon name='speaker' color='green'/>
                    </template>
                    <template v-slot:append>
                      <q-icon name='refresh' @click='readSoundCard' color='green'/>
                    </template>
                    </q-input>
                     
                    </div>
                    <div class="col-6">
                      <div class="row">
                        <div class="col-6 text-center">
                          <q-btn glossy rounded :loading="realSpeakingSuccess" color="green" @click="startRealPlay">
                            <q-icon name='mic' />开始实时讲话
                            <span slot="loading">
                              <q-spinner-mat class="on-left" /> {{realSpeakingSuccess?'正在接收':'启动实时讲话失败'}}
                            </span>
                          </q-btn>
                        </div>
                        <div class="col-6 text-center">
                          <q-btn glossy rounded label='停止实时讲话' @click="stopRealPlay" icon='stop' color='red' />
                        </div>

                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div class="col-6 q-pt-xs">
                <fieldset>
                  <div class='ftt'>音频文件播放</div>
                  <q-separator color='spc' />
                  <div class="column fit">
                    <div class="col-6">                     
                        <q-input  label="选择文件" :error='$v.playFile.$error' error-label='请选择要播放的音频文件!' v-model="playFile" type='text' clearable dark color="light-green" @focus="selectPlayFile" >
                          <template v-slot:prepend>
                            <q-icon name="cloud_upload" color="green" @click.stop />
                          </template>
                        </q-input>                     
                    </div>
                    <div class="col-6">
                      <div class="row ">
                        <div class="col-4 text-center">
                          <q-btn glossy rounded :loading="playFileSuccess" color="green" @click="startPlayFile">
                            <q-icon name='play_arrow' />播放
                            <span slot="loading">
                              <q-spinner-mat class="on-left" /> 播放
                            </span>
                          </q-btn>
                        </div>
                        <div class="col-4 text-center">
                          <q-btn glossy rounded :label='playFileSuccess?"暂停":"继续"' @click="pausePlayFile" icon='pause' color='red' />
                        </div>
                        <div class="col-4 text-center">
                          <q-btn glossy rounded label='停止' @click="stopPlayFile" icon='stop' color='red' />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </q-layout>
    </q-dialog>
    <input type="file" hidden ref='fileInput' />
  </q-page>
</template>

<script>
import { uid } from "quasar";
import AMap from "AMap";
import AMapUI from "AMapUI";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  // name: 'PageName',
  data() {
    return {
      ticked: [],
      tree: [],
      propsExpanded: [],
      infoWindow: {},
      map: "",
      mapOptions: {},
      // heatmap:{},
      state: "all",
      keyword: "",
      opened: false,
      speak: {},
      broad: [],
      selected: {},
      playFile: "",
      realSpeakingSuccess: false,
      playFileSuccess: false,
      spkSoundCardName: "",
      spkMessage: "",
      currentValue: 25,
      play_ch: -1,
      spkVolume: 25,
      spkChannel: 0,
      selectSpeak: [],
      serverState: -1, //广播服务器状态：0 已连接； -1 未连接；
      broadCount: 0,
      serverId: 0,
      serverConfig: {}
    };
  },
  validations: {
    selectSpeak: {
      required,
      minLength: minLength(1)
    },
    spkSoundCardName: {
      required
    },
    playFile: {
      required
    }
  },
  filters: {
    stateFilter(value) {
      return value == 0 ? "空闲中" : "播放中";
    }
  },
  computed: {
    fileInput() {
      return this.$refs.fileInput;
    },
    platform: function() {
      return this.$store.state.platform;
    }
  },
  watch: {
    ticked: function() {
      this.selectSpeak = [];
      if (this.ticked.length > 0) {
        let parentId = parseInt(
          this.ticked[this.ticked.length - 1].split("-")[0]
        );
        this.serverId = parentId;
        this.broad = this.tree.sort((a, b) => {
          return a.custId - b.custId;
        })[parentId].children;
        this.serverConfig = this.tree[parentId].server;
        for (let i = 0; i < this.ticked.length; i++) {
          if (this.ticked[i].split("-")[0] != parentId) {
            this.ticked.splice(i, 1);
          }
        }
        this.tree.forEach(f => {
          this.checkedItem(f);
        });
      } else {
        this.tree.forEach(f => {
          f.children.forEach(s => {
            if (s.marker != null) {
              s.marker.hide();
            }
          });
        });
        this.infoWindow.close();
      }
      console.log(this.selectSpeak.join());
    }
  },
  methods: {
    checkedItem(row) {
      if (row.children && row.children.length > 0) {
        let _children = row.children;
        _children.forEach(f => {
          this.checkedItem(f);
        });
      } else {
        if (row.marker != null) {
          if (this.ticked.indexOf(row.custId) != -1) {
            row.marker.show();
            this.selectSpeak.push(row.label);
            this.spkVolume = row.volume;
            this.currentValue = row.volume;
            this.infoWindow.setInfoTitle(row.opt.title);
            this.infoWindow.setInfoBody(row.opt.body);
            this.infoWindow.open(this.map, row.marker.getPosition());
          } else {
            row.marker.hide();
          }
        }
      }
    },
    connectServer() {
      try {
        this.serverState = wkipobj.InitIPAS(
          0,
          `${this.serverConfig.ip}:${this.serverConfig.port}`
        ); //使用组播 '222.190.138.228:65003'
      } catch (e) {
        this.serverState = -1;
        this.$q.notify({
          message: e.message,
          type: "negative"
        });
        return;
      }
      if (this.serverState != 0) {
        this.$q.notify({
          message: "连接广播服务器失败！",
          type: "negative"
        });
        return;
      }
    },
    getLonLat(_custId, _broadcastId) {
      this.$axios({
        method: "GET",
        url: "/broadcast/loadBroadcastList",
        params: {
          broadcastId: _broadcastId
        }
      })
        .then(r => {
          console.log(r.desc);
          this.tree[_custId].children.map(m => {
            let b = r.desc.filter(t => {
              return parseInt(t.code) == m.id;
            });

            if (b.length > 0 && (b[0].lon != null) & (b[0].lat != null)) {
              m.lon = b[0].lon;
              m.lat = b[0].lat;
              m.visible = true;
              m.opt = {
                title: `<div class='info-title-green' style='font-size:16px'><strong>${
                  m.label
                }</strong></div>`,
                body: ` <div class='info-body '><ul>                
                   <li>状态：${
                     m.Status == 0 ? "空闲" : "正在播放"
                   }</li>                                                     
                    <li>位置：${m.lon}，${m.lat} </li>
                     <li>音量：${m.volume}</li>
                    <li>播放文件：${m.fileName}</li> </ul>
                   <div class='text-center q-pa-sm'><button  tabindex="0" type="button"  class="q-btn inline relative-position q-btn-item non-selectable q-btn-rectangle q-focusable q-hoverable q-btn--rounded glossy bg-green text-white q-btn-dense" style="font-size: 14px;"><div class="q-focus-helper"></div><div class="q-btn-inner row col items-center justify-center"><i aria-hidden="true" class="q-icon material-icons on-left">music_video</i><div>播放语音</div></div></button></div></div>`
              };

              let _marker = new AMap.Marker({
                title: m.areaName,
                visible: m.checked,
                position: [m.lon, m.lat],
                content:
                  '<i aria-hidden="true" class="q-icon marker_shark material-icons text-purple-13" style="font-size: 28px;">rss_feed</i>',
                map: this.map,
                animation: "AMAP_ANIMATION_DROP"
              });

              _marker.on("click", e => {
                this.infoWindow.setInfoTitle(m.opt.title);
                this.infoWindow.setInfoBody(m.opt.body);
                this.infoWindow.open(this.map, _marker.getPosition());
                // this.speak = f;
              });
              m.marker = _marker;
              m.disabled = false;
            } else {
              m.disabled = true;
            }
          });
        })
        .catch(e => {});
    },
    onLazyLoad({ node, key, done, fail }) {
      if (node.children.length <= 0) {
        //  this.serverConfig=node.server;
        this.serverState = -1;
        if (
          !(!!window.ActiveXObject || "ActiveXObject" in window) ||
          document.all.wkipobj.object == null
        ) {
          this.$q.notify({
            message: "加载ocx失败,请使用IE11浏览器。",
            type: "negative"
          });
          fail();
          return;
        }
        try {
          this.serverState = wkipobj.InitIPAS(
            0,
            `${node.server.ip}:${node.server.port}`
          ); //使用组播 '222.190.138.228:65003'
        } catch (e) {
          this.serverState = -1;
          this.$q.notify({
            message: e.message,
            type: "negative"
          });
          fail();
          return;
        }
        if (this.serverState != 0) {
          this.$q.notify({
            message: "连接广播服务器失败！",
            type: "negative"
          });
          fail();
          return;
        } else if (this.serverState == 0) {
          //成功连接->读取区域信息
          var area_info = wkipobj.GetAreaInfo();

          if (area_info == null) {
            this.$q.notify({
              message: "读取广播信息失败！",
              type: "negative"
            });
            fail();
            return;
          } else {
            var arrayBSTR = area_info.toArray();
            var area_cnt = arrayBSTR.length;

            if (area_cnt > 0) {
              let _this = this;
              let boardArray = [];
              arrayBSTR.forEach(spk => {
                let spk_info_array = spk.toArray();
                //ID-Name-Volume-Status-Playing file name
                //Status：0空闲，否则正在播放
                // [121, "黄金沙滩站", 25, 0, ""]
                //console.log(spk_info_array)
                let _lon = "",
                  _lat = "";

                let _checked = false;
                let spkObj = {
                  custId: node.custId + "-" + spk_info_array[0],
                  label: spk_info_array[1],
                  value: spk_info_array[1],
                  icon: "rss_feed",
                  header: "generic",
                  id: spk_info_array[0],
                  areaName: spk_info_array[1],
                  volume: spk_info_array[2],
                  Status: spk_info_array[3],
                  fileName: spk_info_array[4],
                  lon: _lon,
                  lat: _lat,
                  checked: _checked,
                  marker: null
                };
                boardArray.push(spkObj);
              });
              done(boardArray);
              this.broadCount = boardArray.length;
              this.getLonLat(node.custId, node.broadcastId);
              console.log(this.tree);
              this.$q.notify({
                message: "广播信息已更新！",
                type: "positive"
              });
            } else {
              fail();
            }
          }
        }
      }
    },
    onModalShow() {
      this.connectServer();
    },
    onModalHide() {
      this.spkMessage = "";
      wkipobj.FreeIPAS();
    },
    volumeChange(val) {
      this.spkVolume = val;
      //wkipobj.SetVolume(val,-1)
    },

    //开始播放文件
    startPlayFile() {
      this.$v.selectSpeak.$touch();
      this.$v.playFile.$touch();
      if (this.$v.selectSpeak.$error || this.$v.playFile.$error) {
        this.playFileSuccess = false;
        return;
      }

      //"\u0017大山慢客1号杆"
      //let area=this.selectSpeak.join().replace(/\u0017/g,'');
      debugger;
      this.play_ch = wkipobj.PlayFile(
        this.playFile,
        this.selectSpeak.join(",").replace(/\u0017|\u0018|\u0019/g, ""),
        1,
        this.spkVolume
      );
      if (this.play_ch < 0) {
        this.play_ch = "";
        this.playFileSuccess = false;
        this.$q.notify({
          message: "文件播放失败！",
          type: "negative"
        });
      } else {
        //播放成功
        this.playFileSuccess = true;
      }
    },
    //暂停播放文件
    pausePlayFile() {
      if (this.play_ch != "" && this.play_ch >= 0) {
        var p_ret;

        if (this.playFileSuccess) {
          p_ret = wkipobj.playctl(this.play_ch, 1);

          if (p_ret == 0) {
            //暂停
            this.playFileSuccess = false;
          } else {
            this.$q.notify({
              message: "暂停播放失败！",
              type: "negative"
            });
          }
        } else {
          p_ret = wkipobj.playctl(this.play_ch, 2);
          if (p_ret == 0) {
            //续播
            this.playFileSuccess = true;
          } else {
            this.$q.notify({
              message: "继续播放失败！",
              type: "negative"
            });
          }
        }
      }
    },
    //停止播放文件
    stopPlayFile() {
      if (this.play_ch != "" && this.play_ch >= 0) {
        if (wkipobj.playctl(this.play_ch, 3) == 0) {
          //停止播放
          this.play_ch = -1;
          this.playFileSuccess = false;
        } else {
          this.$q.notify({
            message: "停止播放失败！",
            type: "negative"
          });
        }
      } else {
        this.playFileSuccess = false;
      }
    },
    //选择文件
    selectPlayFile() {
      this.fileInput.click();
    },
    //停止实时讲话
    stopRealPlay() {
      let s = wkipobj.RealPlayStop();
      this.realSpeakingSuccess = false;
    },
    //开始实时讲话
    startRealPlay() {
      this.$v.selectSpeak.$touch();
      if (this.$v.selectSpeak.$error) {
        return;
      }

      this.play_ch = wkipobj.RealPlayStart(
        this.selectSpeak.join(",").replace(/\u0017|\u0018|\u0019/g, ""),
        1
      );
      if (this.play_ch == 0xff) {
        this.play_ch = "";
        this.realSpeakingSuccess = false;
        this.$q.notify({
          message: "启动实时讲话失败!",
          type: "negative"
        });
        //alert("启动实时讲话失败");
      } else {
        this.realSpeakingSuccess = true;
      }
    },
    //读取声卡名称
    readSoundCard() {
      this.spkSoundCardName = wkipobj.object.GetSndInfo();
    },

    initMap() {
      let _this = this;
      this.mapOptions = {
        center: this.platform.mapGaode.center.split(","), //[116.397428, 39.90923]
        resizeEnable: true,
        zoom: parseInt(this.platform.mapGaode.zoom, 10),
        mapStyle: "amap://styles/f55bb51e74d7ef23c4e711a3fce0d7c4"
      };
      let mapImageLayer = this.platform.mapGaode.mapImageLayer;
      if (mapImageLayer != null) {
        let imageLayer = new AMap.ImageLayer({
          url: _this.$store.state.custMap,
          bounds: new AMap.Bounds(
            JSON.parse(mapImageLayer.bounds)[0],
            JSON.parse(mapImageLayer.bounds)[1]
          ),
          zooms: JSON.parse(mapImageLayer.zooms)
        });
        this.mapOptions.layers = [new AMap.TileLayer(), imageLayer];
      }
      this.map = new AMap.Map("map", this.mapOptions);
      // this.getBroad()
      AMapUI.loadUI(
        ["control/BasicControl", "overlay/SimpleInfoWindow"],
        function(BasicControl, SimpleInfoWindow) {
          var zoomCtrl1 = new BasicControl.Zoom({
            theme: "dark",
            showZoomNum: true,
            position: {
              top: "120px",
              right: "10px"
            }
          });
          _this.infoWindow = new SimpleInfoWindow({
            offset: new AMap.Pixel(0, -31)
          });
          _this.infoWindow.get$InfoBody().on("click", ".q-btn", event => {
            //阻止冒泡
            event.stopPropagation();
            _this.opened = true;
          });
          _this.map.addControl(zoomCtrl1);
        }
      );

      this.map.on("click", function(e) {
        console.log(e.lnglat.getLng() + "," + e.lnglat.getLat());
      });
    },
    //读取广播状态信息
    // readAreaInfo() {
    //   var area_info = wkipobj.GetAreaInfo();

    //   if (area_info == null) {
    //     this.$q.notify({
    //       message: "读取广播信息失败！",
    //       type: 'negative'
    //     });
    //   } else {
    //     var arrayBSTR = area_info.toArray();
    //     var area_cnt = arrayBSTR.length;

    //     if (area_cnt > 0) {
    //       this.broadCount = area_cnt;
    //       arrayBSTR.forEach(spk => {

    //         let spk_info_array = spk.toArray()

    //         let spks = this.broad.filter(f => {
    //           return parseInt(f.code) == spk_info_array[0]
    //         })
    //         if (spks.length > 0) {
    //           spks[0].areaName = spk_info_array[1]
    //           spks[0].volume = spk_info_array[2]
    //           spks[0].Status = spk_info_array[3]
    //           spks[0].fileName = spk_info_array[4]
    //           spks[0].opt.body =
    //             ` <div class='info-body text-grey'>
    //              <div class='row'><div class='col-5 text-right'>状态：</div><div class='col-7'>${spks[0].Status==0?'空闲':'正在播放'}</div></div>
    //              <div class='row'><div class='col-5 text-right'>位置：</div><div class='col-7'>${spks[0].lon}，${spks[0].lat}</div></div>
    //              <div class='row'><div class='col-5 text-right'>音量：</div><div class='col-7'>${spks[0].volume}</div></div>
    //              <div class='row'><div class='col-5 text-right'>播放文件：</div><div class='col-7'>${spks[0].fileName}</div></div>
    //              <div class='text-center q-pa-sm'><button  tabindex="0" type="button"  class="q-btn inline relative-position q-btn-item non-selectable q-btn-rectangle q-focusable q-hoverable bg-green text-white q-btn-dense" style="font-size: 14px;"><div class="q-focus-helper"></div><div class="q-btn-inner row col items-center justify-center"><i aria-hidden="true" class="q-icon material-icons on-left">music_video</i><div>播放语音</div></div></button></div>
    //           </div>`
    //         }
    //       });
    //       this.$q.notify({
    //         message: '广播信息已更新！',
    //         type: 'positive'
    //       })

    //     }
    //   }
    // },

    //初始化广播根节点服务器
    InitBroadServerRoot() {
      let broadcastConfigs = this.platform.broadcastConfigs;
      if (broadcastConfigs.length > 0) {
        for (let index = 0; index < broadcastConfigs.length; index++) {
          let node = {
            custId: index,
            broadcastId: broadcastConfigs[index].id,
            label: broadcastConfigs[index].broadcastName,
            lazy: true,
            header: "first",
            server: {
              ip: broadcastConfigs[index].ip,
              port: broadcastConfigs[index].port
            },
            children: []
          };
          this.tree.push(node);
          this.tree.sort((a, b) => {
            return a.custId - b.custId;
          });
        }
      }
    }
  },

  created() {
    //监听广播插件回调消息
    window.addEventListener("broadcast", event => {
      var arrayBSTR = event.detail.e.toArray();
      var ev_type_id = arrayBSTR[0];
      var ev_dev_id = arrayBSTR[1];
      var ev_dev_param = arrayBSTR[2];
      var ev_dev_param_array = ev_dev_param.toArray();
      var ev_description = arrayBSTR[3];
      var edt_ev_description =
        ev_type_id +
        ":" +
        ev_dev_id +
        ":" +
        ev_dev_param_array[0] +
        ":" +
        ev_description;
      this.serverState = ev_type_id;
      let now = new Date();
      switch (ev_type_id) {
        case 1: //EV_AS_CONNECTED = 1; //和音频服务程序建立TCP连接
          this.serverState = 0;
          this.spkMessage = `${now.toTimeString()}:连接音频服务器成功！\r\n`;
          break;

        case 2: //EV_AS_DISCONNECT = 2; //和音频服务程序断开连接
          this.serverState = -1;
          this.spkMessage = `${now.toTimeString()}:服务器连接已断开！\r\n`;
          this.playFileSuccess = false;
          this.realSpeakingSuccess = false;
          break;

        case 50: //EV_DEC_TIME = 50;   //播放时间进度
          if (this.play_ch == ev_dev_id) {
            this.spkMessage = `${now.toTimeString()}:播放进度 ${ev_dev_param_array.join(
              "-"
            )}\r\n`;
          }
          break;

        case 40: //  EV_PLAY_END = 40; 播放结束
          this.spkMessage = `${now.toTimeString()}:文件播放结束。\r\n`;
          this.playFileSuccess = false;
          this.realSpeakingSuccess = false;
          break;
      }
      console.log(this.spkMessage);
    });
  },

  mounted() {
    setTimeout(() => {
      this.InitBroadServerRoot();
      this.initMap();
    }, 1000);

    this.fileInput.addEventListener(
      "change",
      e => {
        this.playFile = e.currentTarget.value;
      },
      false
    );
  },
  beforeDestroy() {
    this.map.destroy()
    wkipobj.FreeIPAS();
  }
};
</script>
<style lang='stylus'>
.bg-spc{
  background-color:rgb(40,96,156)}
.ftt {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-align: left;
  color: rgb(121, 255, 255);
}

.by {
  min-height: auto !important;
  max-width: auto !important;
  max-width: initial !important;
  width: 80vh !important;
  overflow: visible !important;
  padding: 0.5rem 2rem 1rem;
  box-sizing: border-box;
}

.byhead {
  color: rgb(121, 255, 255);
  text-align: left;
}

.monitor-tree {
  font-size: 0.875rem;
}

.monitor-tree .q-tree-arrow {
  font-size: 0.18rem;
  width: 0.18rem;
  height: 0.18rem;
}

.active {
  color: $bl;
}

.moni-item {
  margin: 0.1rem 0;
  padding: 0.15rem;
  background: rgba(255, 255, 255, 0.05);

  .q-item-label {
    font-size: 0.16rem;
    bold();
  }

  .q-item-sublabel {
    font-size: 0.12rem;
    margin-top: 0.1rem;
    medium();
  }
}

.server-info {
  line-height: 0.28rem;
  font-size: 0.16rem;
}

.broad-info {
  line-height: 0.18rem;
  font-size: 0.14rem;
}

.info-body {
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgb(121, 255, 255);
  bold();

  ul {
    padding-left: 1rem;
  }
}

.info-title-green {
  color: rgb(121, 255, 255);
  font-size: 1.25rem;
}

.broad-ctrl-box {
  margin-top: 1rem;

  fieldset {
    border-radius: 5px;
    background: rgba(12, 54, 104, 0.9);
    border: none;
    width: 100%;
    height: 100%;
    padding: 10px;
    font-size: 0.14rem;

    .q-field {
      margin-bottom: 0.12rem;
    }

    // border-width 1px
    legend {
      font-size: 0.16rem;
      color: #18ffff;
      letter-spacing: 3px;
    }

    .spk-msg {
      background: transparent !important;
      border: 1px solid white;
    }
  }
}

.search-box {
  padding: 1vh 2vh;
}
</style>
