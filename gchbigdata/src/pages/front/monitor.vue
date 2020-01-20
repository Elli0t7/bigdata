<template>
  <q-page class="page">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding cust-col">
        <div class="fit section-bg round-border" style="padding:0 .3rem">
          <div class="left-head">
            <div class="search-box round-border">
              <q-search v-model="keyword" clearable dark hide-underline />
              <!-- <q-icon name='linked_camera' color="pink-6" size="20px"/> -->
            </div>
          </div>
          <q-scroll-area
            style="height: 88%"
            :thumb-style="{
                                                            right: '4px',
                                                            borderRadius: '5px',
                                                            background: '#18ffff',
                                                            width: '10px',
                                                            opacity: .5
                                                          }"
            :delay="500"
          >
            <q-tree
              :filter="keyword"
              control-color="white"
              color="secondary"
              class="monitor-tree"
              :ticked.sync="ticked"
              @lazy-load="onLazyLoad"
              tick-strategy="leaf"
              default-expand-all
              dark
              :selected.sync="selected"
              :nodes="tree"
              :expanded.sync="propsExpanded"
              node-key="custId"
            >
              <!-- node-key="_c_device_index_code" -->
              <div slot="header-generic" slot-scope="prop" class="row items-center">
                <q-icon
                  :name="prop.node._i_is_online==1?'videocam':'videocam_off'"
                  :color="prop.node._i_is_online==1?'green':'red'"
                  size="24px"
                  class="q-mr-sm"
                />
                <div
                  :class="['text-weight-bold',prop.node._i_is_online==1?'text-green':'text-red']"
                >
                  {{ prop.node.label
                  }}
                </div>
              </div>
            </q-tree>
          </q-scroll-area>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 section-padding cust-col">
        <div class="fit section-bg round-border" id="map"></div>
      </div>
    </div>
    <vue-draggable-resizable
      ref="resizeobj"
      style="border:8px solid rgba(0,0,0,.3)"
      :parent="true"
      :x="0"
      :y="-1000"
      :z="150"
      :w="700"
      :h="500"
      :minw="600"
      :minh="450"
    >
      <div class="mo-box fit">
        <div class="drag row">
          <div class="col-11">实时监控</div>
          <div class="col-1 text-right">
            <q-btn color="grey" icon="close" @click="closeMonitor" flat dense></q-btn>
          </div>
        </div>
        <div class="bg-black" style="height:calc(100% - 40px)">
          <multi-preview-ctrl key="monitorpage" v-if="showModal" :config="config" />
        </div>
      </div>
    </vue-draggable-resizable>
  </q-page>
</template>

<script>
import X2JS from "x2js";
import MultiPreviewCtrl from "../../components/MultiPreviewCtrl";
import { SOAPClientParameters, SOAPClient } from "../../utils/soapclient";
import { animate, uid, easing } from "quasar";
import VueDraggableResizable from "vue-draggable-resizable";
import AMap from "AMap";
import AMapUI from "AMapUI";
let x2js = new X2JS();
export default {
  data() {
    return {
      config: {},
      worker: {},
      leafs: [],
      infoWindow: {},
      mapOptions: {},
      showtitle: false,
      indexCode: "",
      opened: false,
      selected: {},
      ticked: [],
      tree: [],
      propsExpanded: [],
      map: "",
      keyword: "",
      showModal: false
    };
  },
  filters: {},
  computed: {
    resizeobj() {
      return this.$refs.resizeobj;
    },
    preview() {
      return this.$refs.preview;
    },
    platform: function() {
      return this.$store.state.platform;
    }
  },
  watch: {
    state: function() {
      console.log(this.state);
    },
    selected: function() {
      console.log(this.selected);
    },
    ticked: function() {
      if (this.ticked.length > 0) {
        this.tree.forEach(f => {
          this.checkedItem(f);
        });
      } else {
        this.leafs.forEach(f => {
          if (f.marker != null) {
            f.marker.hide();
            this.infoWindow.close();
          }
        });
      }
    }
  },
  components: {
    VueDraggableResizable,
    MultiPreviewCtrl
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
            this.infoWindow.setInfoTitle(row.opt.title);
            this.infoWindow.setInfoBody(row.opt.content);
            this.infoWindow.open(this.map, row.opt.position);
          } else {
            row.marker.hide();
          }
        }
      }
    },
    //获取组织下的资源
    getAllResourceDetailByOrg(config, orgCode, callback) {
      var param = new SOAPClientParameters();
      param.add("ws:nodeIndexCode", config.code); //001002
      param.add("ws:orgCode", orgCode);
      param.add("ws:resType", "10000"); //1000
      SOAPClient.invoke(
        config.prefix + "/cms/services/ICommonService",
        "getAllResourceDetailByOrg",
        param,
        true,
        callback
      );
    },
    //获取组织
    getAllResourceDetail(config) {
      this.tree = [];
      var param = new SOAPClientParameters();
      param.add("ws:nodeIndexCode", config.code); //001002
      param.add("ws:resType", "1000"); //1000
      SOAPClient.invoke(
        config.prefix + "/cms/services/ICommonService",
        "getAllResourceDetail",
        param,
        true,
        (r, soapResponse) => {
          let jsonObj = x2js.xml2js(
            new XMLSerializer().serializeToString(soapResponse)
          );
          let result =
            jsonObj.Envelope.Body.getAllResourceDetailResponse.return.__text;
          let resultObj = x2js.xml2js(result);
          let datarows = !Array.isArray(resultObj.table.rows.row)
            ? [resultObj.table.rows.row]
            : resultObj.table.rows.row;
          let root={}  
          datarows.map(f => {
            f.custId = uid();
            if(f._c_classname == "Domain"){
              root=f
            }
            f._c_device_index_code = f._c_index_code;
            f.children = [];
            f.label = f._c_org_name;
            f.custConfig = config;
            f.children=datarows.filter(m=>{
              return m._i_parent_id==f._i_id&&m._c_classname=="Organization" 
            })
            f.lazy = f.children.length == 0;
          });          
          this.tree.push(root);
        }
      );
    },
    onLazyLoad({ node, key, done, fail }) {
      let datarows = [];

      this.getAllResourceDetailByOrg(
        node.custConfig,
        node._c_index_code,
        (r, soapResponse) => {
          try {
            let jsonObj = x2js.xml2js(
              new XMLSerializer().serializeToString(soapResponse)
            );
            let result =
              jsonObj.Envelope.Body.getAllResourceDetailByOrgResponse.return
                .__text;
            let resultObj = x2js.xml2js(result);
            datarows = resultObj.table.rows.row;

            let online = datarows.length,
              total = datarows.length;

            datarows.map(m => {
              let videoType = ["枪机", "半球", "快球"];
              m.custId = uid();
              m.disabled =
                m._c_longitude == "null" || m._c_latitude == "null"
                  ? true
                  : false;
              m.camera_type = videoType[m._i_camera_type];
              m.label = m._c_name;
              m.icon = "videocam";
              m.header = "generic";
              m.custConfig = node.custConfig;
              // m.disabled=m._i_is_online!=1
              if (m._i_is_online != 1) {
                m.icon = "videocam_off";
                online--;
              }
              m.marker = null;
              if (!m.disabled) {
                m.custConfig.currentIndexCode = m._c_index_code;
                // console.log(`${m.custConfig.currentIndexCode} `);
                // console.log(m.custConfig);
                let playabled =
                  m._i_is_online == 1
                    ? `<button data-cust-config='${JSON.stringify(
                        m.custConfig
                      )}' tabindex="0" type="button"  class="q-btn inline relative-position q-btn-item non-selectable q-btn-rectangle q-focusable q-hoverable bg-green text-white q-btn-dense" style="font-size: 14px;"><div class="q-focus-helper"></div><div class="q-btn-inner row col items-center justify-center"><i aria-hidden="true" class="q-icon material-icons on-left">tv</i><div>查看监控</div></div></button>`
                    : "";
                let opt = {
                  position: [m._c_longitude, m._c_latitude],
                  title: `<div class='info-title-green'><strong>${m._c_name}</strong><div>`,
                  content: `<div class='info-body'>
                   <div class='row'><div class='col-3 text-right'>状态：</div><div class='col-9'>${
                     m._i_is_online == 1 ? "在线" : "离线"
                   }</div></div>
                   <div class='row'><div class='col-3 text-right'>类型：</div><div class='col-9'>${
                     m.camera_type
                   }</div></div>
                   <div class='row'><div class='col-3 text-right'>IP：</div><div class='col-9'>${
                     m._c_device_ip
                   }:${m._i_device_port}</div></div>
                   <div class='row'><div class='col-3 text-right'>位置：</div><div class='col-9'>${
                     m._c_longitude
                   }，${m._c_latitude}</div></div>
                   <div class='text-center q-pa-sm'>${playabled}</div>
                   </div>`
                };

                let marker = new AMap.Marker({
                  position: [m._c_longitude, m._c_latitude],
                  content:
                    '<i aria-hidden="true" class="q-icon marker_shark material-icons text-purple-13" style="font-size: 24px;">linked_camera</i>',
                  visible: false,
                  title: m._c_name,
                  map: this.map
                });
                let _this = this;
                let markerClick = function() {
                  _this.infoWindow.setInfoTitle(opt.title);
                  _this.infoWindow.setInfoBody(opt.content);
                  _this.infoWindow.open(_this.map, opt.position);
                };
                marker.on("click", markerClick);
                m.marker = marker;
                m.opt = opt;
              }
            });
            if (datarows.length > 0) {
              this.leafs = this.leafs.concat(datarows);
              done(datarows);
            } else {
              fail();
            }
          } catch (error) {
            fail();
          }

          //  datarows.forEach(f=>{
          //      ddd.push({ip:f._c_device_ip,port:f._i_device_port,indexcode:f._c_device_index_code})
          //      //debugger
          //      let parent=tree[0].children.filter((s)=>{
          //          return f._c_org_index_code==s._c_index_code
          //      })
          //      if(parent&&parent.length>0){
          //          parent[0].children.push(f)
          //          parent[0].label=parent[0]._c_org_name+` [ ${online}/${total} ] `
          //      }
          //  })
        }
      );
    },

    closeMonitor() {
      this.resizeobj.top = -1000;
      this.showModal = false;
    },
    initMap() {
      let _this = this;
      this.mapOptions = {
        center: this.platform.mapGaode.center.split(","), //[116.397428, 39.90923]
        resizeEnable: true,
        zoom: parseInt(this.platform.mapGaode.zoom, 10)
      };
      let mapImageLayer = this.platform.mapGaode.mapImageLayer;
      if (mapImageLayer != null) {
        let imageLayer = new AMap.ImageLayer({
          url: mapImageLayer.url,
          bounds: new AMap.Bounds(
            JSON.parse(mapImageLayer.bounds)[0],
            JSON.parse(mapImageLayer.bounds)[1]
          ),
          zooms: JSON.parse(mapImageLayer.zooms)
        });
        this.mapOptions.layers = [new AMap.TileLayer(), imageLayer];
      }

      //初始化高德地图

      this.map = new AMap.Map("map", this.mapOptions);
      AMapUI.loadUI(
        ["control/BasicControl", "overlay/SimpleInfoWindow"],
        function(BasicControl, SimpleInfoWindow) {
          var zoomCtrl1 = new BasicControl.Zoom({
            theme: "dark",
            showZoomNum: true
          });

          //初始化信息窗口
          _this.infoWindow = new SimpleInfoWindow({
            offset: new AMap.Pixel(0, -31)
          });
          _this.infoWindow.get$InfoBody().on("click", ".q-btn", event => {
            //阻止冒泡
            // event.stopPropagation();
            _this.opened = true;
            let config = JSON.parse(event.currentTarget.dataset.custConfig);
            _this.resizeobj.top = 0;
            console.log(config);
            _this.showModal = true;
            _this.config = {
              layoutType: 1,
              ip: config.ip,
              port: config.port,
              userName: config.userName,
              password: config.password,
              indexCode: config.currentIndexCode
            };
            // _this.url=`/statics/multiPreview.html?ip=${config.ip}&port=${config.port}&code=${config.currentIndexCode}&userName=${config.userName}&passWord=${config.password}&layoutType=1`
            // _this.LoginPlat(config)
          });

          _this.map.addControl(zoomCtrl1);
        }
      );

      _this.map.on("click", function(e) {
        console.log(e);
        console.log(e.lnglat.getLng() + "," + e.lnglat.getLat());
      });
    }
  },
  mounted() {
    this.initMap();
    this.platform.hkConfigs.forEach(f => {
      this.getAllResourceDetail(f);
    });

    //this.getAllResourceDetail(this.platform.hkConfigs[0])
    // this.getAllResourceDetail(this.platform.hkConfigs[1])

    // setTimeout(() => {
    //   this.LoginPlat()
    // }, 2000)
  },
  beforeDestroy() {
    //   if (typeof this.preview.StopPreview == "function") {
    //  let v= this.preview.StopPreview(-1);
    //   }
  }
};
</script>
<style lang='stylus' >
@import '~variables';

.page-box {
  height: 88.8vh;
}

.left-head {
  padding: 0.2rem 0;
}

.monitor-tree {
  font-size: 0.16rem;

  .q-tree-arrow {
    font-size: 0.18rem;
    width: 0.18rem;
    height: 0.18rem;
  }
}

.info-title-green {
  color: green;
  font-size: 0.16rem;
}

.info-body {
  font-size: 0.14rem;
  bold();
}

.monitor-box {
  position: relative;
  padding-top: 40px;
}

.drag {
  padding: 0 0.1rem;
  height: 40px;
  cursor: move;
  font-size: 0.16rem;
  color: green;
  bold();
  background: #eee;
  line-height: 40px;
}
</style>
