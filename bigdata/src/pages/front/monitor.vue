<template>
  <q-page class="fh-page" v-cloak>
    <div class="map-box" id='map'>
    </div>
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
              <q-tree :filter='keyword' color="secondary" class='monitor-tree' :ticked.sync="ticked" @lazy-load="onLazyLoad" tick-strategy='leaf' default-expand-all dark :selected.sync="selected" :nodes="tree" :expanded.sync="propsExpanded" node-key="custId">
                <div slot="header-generic" slot-scope="prop" class="row items-center">
                  <q-icon :name="prop.node._i_is_online==1?'videocam':'videocam_off'" :color="prop.node._i_is_online==1?'green':'red'" size='24px' class="q-mr-sm" />
                  <div :class="['text-weight-bold text-subtitle2',prop.node._i_is_online==1?'text-green':'text-red']">{{ prop.node.label }}
                  </div>
                </div>
              </q-tree>
            </q-scroll-area>
          </div>
        </div>
      </div>
    </div>    
  </q-page>
</template>

<script>
import X2JS from "x2js";
import { SOAPClientParameters, SOAPClient } from "../../utils/soapclient";
import { uid } from "quasar";
// import VueDraggableResizable from "vue-draggable-resizable";
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
  // components: {
  //   VueDraggableResizable,    
  // },
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
          datarows.map(f => {
            f.custId = uid();
            f.lazy = datarows.length == 1;
            f._c_device_index_code = f._c_index_code;
            f.children = [];
            f.label = f._c_org_name;
            f.custConfig = config;
          });
          let root = datarows.filter(f => {
            return f._c_classname == "Domain";
          })[0];

          datarows.forEach(m => {
            if (m._c_classname == "Organization"||m._c_classname=='CascadeOrganization') {
              m.lazy = true;
              root["children"].push(m);
            }
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
                console.log(`${m.custConfig.currentIndexCode} `);
                console.log(m.custConfig);
                let playabled =
                  m._i_is_online == 1
                    ? `<button  data-cust-config='${JSON.stringify(
                        m.custConfig
                      )}' tabindex="0" type="button"   class="q-btn inline relative-position q-btn-item non-selectable q-btn--rounded glossy q-focusable q-hoverable bg-green text-white q-btn-dense" style="font-size: 14px;"><div class="q-focus-helper"></div><div class="q-btn-inner row col items-center justify-center"><i aria-hidden="true" class="q-icon material-icons on-left">tv</i><div>查看监控</div></div></button>`
                    : "";
                let opt = {
                  position: [m._c_longitude, m._c_latitude],
                  title: `<div class='info-title-green'><strong>${
                    m._c_name
                  }</strong><div>`,
                  content: `<div class='info-body'><ul>
                   <li>状态：${m._i_is_online == 1 ? "在线" : "离线"}</li>
                   <li>类型：${m.camera_type}</li>
                  <li> IP：${m._c_device_ip}:${m._i_device_port}</li>
                   <li>位置：${m._c_longitude}，${m._c_latitude}</li>
                   </ul>
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
        zoom: parseInt(this.platform.mapGaode.zoom, 10),
        //mapStyle: "amap://styles/87dce7241837378331640a6afaa6591d"
        mapStyle: "amap://styles/f55bb51e74d7ef23c4e711a3fce0d7c4"
      };
      let mapImageLayer = this.platform.mapGaode.mapImageLayer;
      if (mapImageLayer != null) {
        let imageLayer = new AMap.ImageLayer({
          url:_this.$store.state.custMap,
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
            showZoomNum: true,
            position: {
              top: "120px",
              right: "10px"
            }
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
            // _this.resizeobj.top = 120;
            console.log(config);
            _this.showModal = true;
            _this.config = {
              prefix: config.prefix,
              layoutType: 1,
              ip: config.ip,
              port: config.port,
              userName: config.userName,
              password: config.password,
              indexCode: config.currentIndexCode
            };
            _this.$store.commit("setSelectServer", _this.config);
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
    this.map.destroy()
    //   if (typeof this.preview.StopPreview == "function") {
    //  let v= this.preview.StopPreview(-1);
    //   }
  }
};
</script>
<style lang='stylus' >
.monitor-tree {
  font-size: 0.875rem;

  .q-tree-arrow {
    font-size: 0.18rem;
    width: 0.18rem;
    height: 0.18rem;
  }
}

.info-title-green {
  color: rgb(121, 255, 255);
  font-size: 1.25rem;
}

.info-body {
  font-size: 1rem;
  color: rgb(121, 255, 255);
  bold();

  ul {
    padding-left: 1rem;
  }
}

.drag {
  padding: 0 0.1rem;
  height: 40px;
  cursor: move;
  font-size: 1rem;
  color: rgb(121, 255, 255);
  bold();
  background: $lin;
  line-height: 40px;
}

.search-box {
  padding: 1vh 2vh;
}

.vdr {
  border: 8px solid transparent;
  border-image: $lin 20 20;
}
</style>
