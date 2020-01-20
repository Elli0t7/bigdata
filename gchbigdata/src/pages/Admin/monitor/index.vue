<template>
  <q-page class="page">
    <!-- content -->
    <!-- monitor -->
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding cust-col">
        <div class="title text">监控管理</div>

        <div class="fit section-bg round-border" style="padding:0 .3rem;">
          <div class="left-head"></div>
          <div id="jingdian">
            <!-- {{model}}{{options}} -->
            <q-select
              hide-underline
              inverted-light
              v-model="model"
              text-white
              color="secondary"
              :options="options"
              @input="changeSelect"
            ></q-select>
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
              tick-strategy="none"
              default-expand-all
              dark
              accordion
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
                <q-btn
                  class="toAlter"
                  text-color="light"
                  size="xs"
                  glossy
                  dense
                  @click.stop="setDefault(prop)"
                >设为默认监控</q-btn>
              </div>
            </q-tree>
          </q-scroll-area>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 section-padding cust-col">
        <div class="title text"></div>

        <div class="fit section-bg column">
          <div class="col-auto">
            <q-btn label="监控展示" size="1.8vh" flat icon="settings" text-color="cyan-12"></q-btn>
            <!-- <q-btn label="修改默认监控" size="1.8vh" flat text-color="cyan-12" @click="alter"></q-btn> -->
          </div>
          <div class="col-8">
            <div id="ocxContainer" class="fit overflow-hidden">
              <object
                classid="clsid:BE020CC9-521F-4641-85E1-3B631B7ADDD9"
                id="preview"
                width="100%"
                height="100%"
                name="preview"
              >
                <PARAM name="Ip" value="10.33.27.144" />
                <PARAM name="UserName " value="admin" />
                <PARAM name="PrivilegeCode" value="0401,0402," />
              </object>
            </div>
          </div>
          <div class="col">
            <div class="title text">修改默认监控</div>
            <voerro-tags-input
              ref="tagsInput"
              style="text-align:center;"
              v-model="selectedTags"
              element-id="tags"
              placeholder="添加默认监控名称"
              :limit="0"
              :typeahead="true"
              :allow-duplicates="false"
              typeahead-style="badges"
              :delete-on-backspace="true"
              :add-tags-on-blur="true"
              :typeahead-max-results="20"
              :typeahead-activation-threshold="1"
              :before-adding-tag="beforeAdd"
              @initialized="onInitialized"
              @tag-added="onTagAdded"
              @tag-removed="onTagRemoved"
              @tags-updated="onTagsUpdated"
            ></voerro-tags-input>
            <q-btn
              style="margin-left:0.3rem;margin-top: .2rem;"
              color="secondary"
              label="保存"
              @click="save"
            />
          </div>
        </div>
        <!-- <div class="fit section-bg round-border" id="map"></div> -->
      </div>
    </div>
  </q-page>
</template>

<script>
import X2JS from "x2js";
import { SOAPClientParameters, SOAPClient } from "../../../utils/soapclient";
import MultiPreviewCtrl from "../../../components/MultiPreviewCtrl";
import { animate, uid, easing } from "quasar";
import VoerroTagsInput from "@voerro/vue-tagsinput";
import "@voerro/vue-tagsinput/dist/style.css";
import VueDraggableResizable from "vue-draggable-resizable";
import AMap from "AMap";
import AMapUI from "AMapUI";
let x2js = new X2JS();
export default {
  data() {
    return {
      selectedTags: [],
      config: {},
      worker: {},
      leafs: [],
      tags: [],
      mapOptions: {},
      mapImageLayer: {},
      showtitle: false,
      indexCode: "",
      opened: false,
      selected: {},
      ticked: [],
      tree: [],
      propsExpanded: [],
      map: "",
      keyword: "",
      showModal: false,
      hkConfigs: [], //视频参数
      options: [
        // { label: "水慢城", value: "123" },
        // { label: "慢客中心", value: "126" },
        // { label: "大山", value: "128" },
        // { label: "新建停车场", value: "129" },
        // { label: "游子山", value: "127" },
        // { label: "高淳老街", value: "124" }
      ],
      currentIndex: 0, //选择框当前索引
      model: "123", //选择框默认值
      change: "123",
      mapIndex: 0,
      selectServer: {},
      isNode: [],
      toData: []
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
      return this.$store.state.platforms;
    },
    tagsinput() {
      return this.$refs.tagsinput;
    }
  },
  watch: {
    state: function() {
      console.log(this.state);
    },
    selected: function() {
      console.log("selected", this.selected);
      this.tree.forEach(f => {
        this.checkedItem(f);
      });
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
    MultiPreviewCtrl,
    VoerroTagsInput
  },
  methods: {
    save() {
      console.log("保存数据");
    },
    setDefault(e) {
      // console.log(e);
      let newTag = {};
      let exit1 = this.selectedTags.find(
        item => item.key == e.node._c_index_code
      );
      let exit2 = this.selectedTags.find(item => item.vaule == e.node.label);
      // console.log(exit1,exit2)
      if (exit1 || exit2) {
        this.$q.notify({
          message: "此监控已是默认监控",
          type: "negative",
          timeout: 200,
          position: "bottom"
        });
      } else {
        if (e.node._i_is_online == 1) {
          newTag.key = e.node._c_index_code;
          newTag.value = e.node.label;
          this.selectedTags.push(newTag);
          // console.log("selectedTags", this.selectedTags);
        } else {
          this.$q.notify({
            message: "此监控视频数据有误",
            type: "negative",
            timeout: 200,
            position: "bottom"
          });
        }
      }
    },
    beforeAdd(tag) {
      // console.log(tag);
      if (tag.key !== "") {
        let label = tag.value;
      } else {
        // console.log(this.isNode);
        let idx = this.isNode.find(item => item.label === tag.value);
        // console.log('33333333',idx)
        if (!idx) {
          this.$q.notify({
            message: "不存在此监控视频名称",
            type: "negative",
            timeout: 200,
            position: "bottom"
          });
        } else {
          // console.log("idx code", idx);
          if (idx._i_is_online == 1) {
            tag.key = idx._c_index_code;
          } else {
            this.$q.notify({
              message: "此监控视频数据有误",
              type: "negative",
              timeout: 200,
              position: "bottom"
            });
            return;
          }
        }
      }
      return !!tag.key;
    },

    onInitialized() {
      console.log("Initialized");
    },

    onTagAdded(slug) {
      console.log("Tag added:", slug);
    },

    onTagRemoved(slug) {
      console.log("Tag removed:", slug);
    },

    onTagsUpdated() {
      console.log("Tags updated");
    },
    changeSelect(e) {
      // console.log("e", e, this.change);
      let _this = this;
      if (_this.change !== e) {
        _this.selectedTags = [];
        _this.currentIndex = _this.options.findIndex((item, index) => {
          return item.value === e;
        });
      } else {
        return;
      }
      // console.log("currentIndex", _this.currentIndex);
      let videoCode = this.hkConfigs[this.currentIndex].indexCode.split(",");
      videoCode.forEach((item, index) => {
        this.selectedTags[index] = {};
        this.selectedTags[index].value = item;
        this.selectedTags[index].key = item;
      });
      this.toData[0] = {};
      this.toData[0].code = this.hkConfigs[this.currentIndex].code;
      this.toData[0].indexCode = this.hkConfigs[
        this.currentIndex
      ].indexCode.split(",");
      // console.log("toData", this.toData);

      _this.change = e;
      _this.getAllResourceDetail(_this.hkConfigs[_this.currentIndex]);
      // console.log(
      //   "_this.hkConfigs",
      //   _this.hkConfigs[_this.currentIndex],
      //   _this.selectServer
      // );

      var s = preview.StopPreview(-1);
      if (s == 0) {
        // alert("退出登录，视频正在更新");
        _this.selectServer = {
          layoutType: 3,
          ip: _this.hkConfigs[_this.currentIndex].ip,
          port: _this.hkConfigs[_this.currentIndex].port,
          userName: _this.hkConfigs[_this.currentIndex].userName,
          password: _this.hkConfigs[_this.currentIndex].password,
          indexCode: _this.hkConfigs[_this.currentIndex].indexCode
        };
        setTimeout(() => {
          var result = _this.LoginPlat();
          if (!result) {
            setTimeout(() => {
              _this.StartPreview();
            }, 3000);
          }
        }, 3000);
      }
    },
    checkedItem(row) {
      if (row.children && row.children.length > 0) {
        let _children = row.children;
        // console.log("haizi---", _children);
        var currentRow = _children.find(child => child.custId == this.selected);
        // console.log("index ---", currentRow);
        if (currentRow) {
          // debugger;
          if (currentRow._i_is_online == 1) {
            this.indexCode = currentRow._c_index_code;
            // console.log("indexCode ---", this.indexCode);
            this.selectServer = {
              layoutType: 1,
              ip: currentRow.custConfig.ip,
              port: currentRow.custConfig.port,
              userName: currentRow.custConfig.userName,
              password: currentRow.custConfig.password,
              indexCode: this.indexCode
            };
            this.StartPreview();
            this.isTicked = this.isTicked + 1;
          } else {
            this.$q.notify({
              message: "该视频数据有误",
              type: "negative",
              timeout: 200,
              position: "bottom"
            });
            return;
          }
        }
        _children.forEach((f, index) => {
          this.checkedItem(f, index);
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
            if (m._c_classname == "Organization") {
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
                // console.log(`${m.custConfig.currentIndexCode} `);
                let playabled =
                  m._i_is_online == 1
                    ? `<button data-cust-config='${JSON.stringify(
                        m.custConfig
                      )}' tabindex="0" type="button"  class="q-btn view inline relative-position q-btn-item non-selectable q-btn-rectangle q-focusable q-hoverable bg-green text-white q-btn-dense" style="font-size: 14px;"><div class="q-focus-helper"></div><div class="q-btn-inner row col items-center justify-center"><i aria-hidden="true" class="q-icon material-icons on-left">tv</i><div>预览监控</div></div></button><button data-alter-config='${JSON.stringify(
                        m.custConfig
                      )}' tabindex="0" type="button"  class="q-btn alter inline relative-position q-btn-item non-selectable q-btn-rectangle q-focusable q-hoverable bg-green text-white q-btn-dense" style="font-size: 14px;"><div class="q-focus-helper"></div><div class="q-btn-inner row col items-center justify-center"><i aria-hidden="true" class="q-icon material-icons on-left">tv</i><div>修改默认监控</div></div></button>`
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
            // console.log(datarows);
            if (datarows.length > 0) {
              this.leafs = this.leafs.concat(datarows);
              done(datarows);
              this.isNode = datarows;
            } else {
              fail();
            }
          } catch (error) {
            fail();
          }
        }
      );
    },
    //视频控件平台登录
    LoginPlat() {
      //Demo默认使用密码登录方式
      var params = this.selectServer;
      var v1 =
        '<?xml version="1.0" encoding="utf-8"?><LoginInfo><LoginType>2</LoginType><SynLogin>1</SynLogin><IP>' +
        params.ip +
        "</IP><Port>" +
        params.port +
        "</Port><UserName>" +
        params.userName +
        "</UserName><Password>" +
        params.password +
        "</Password></LoginInfo>";
      var v = preview.LoginPlat(v1);
      console.log("v1 multihtml", v1, v);
      if (v != 0) {
        alert("登录失败，请查看日志preview.log");
      }
      return v;
    },
    //视频预览功能
    //新的预览接口，需先登录平台，登录需要耗点时间，稍等（控件自身取Token）
    StartPreview() {
      var params = this.selectServer;
      // console.log("params html", params, params.indexCode);
      if (params.indexCode.indexOf(",") != -1) {
        console.log("if");
        preview.SetLayoutType(3);

        let arr = params.indexCode.split(",");
        for (let i = 0; i < arr.length; i++) {
          var _param =
            '<?xml version="1.0" encoding="UTF-8"?><Preview><CamIndexCode>' +
            arr[i] +
            "</CamIndexCode></Preview>";
          // console.log("遍历视频数组 multihtml", _param);
          let s = preview.StartPreview(_param);
          console.log("开始预览视频 multihtml", s, _param);
        }
      } else {
        console.log("else");
        preview.SetLayoutType(3);
        var _param =
          '<?xml version="1.0" encoding="UTF-8"?><Preview><CamIndexCode>' +
          params.indexCode +
          "</CamIndexCode></Preview>";
        let s = preview.StartPreview(_param);
        console.log("预览当前节点的视频");
      }
    },
    StopAll() {
      // debugger;
      preview.StopPreview(-1);
    }
  },
  created() {
    // console.log("platform****", this.platform);
    this.platform.forEach(item => {
      if (item.hkConfigs.length !== 0) {
        item.hkConfigs.forEach(data => {
          this.hkConfigs.push(data);
        });
      }
    });
    // console.log("hkConfigs", this.hkConfigs);
    this.hkConfigs.forEach((f, index) => {
      this.options[index] = {};
      this.options[index].label = f.scenicName;
      this.options[index].value = f.id;
    });
    // console.log("options", this.options);
    this.getAllResourceDetail(this.hkConfigs[this.currentIndex]);
    let videoCode = this.hkConfigs[this.currentIndex].indexCode.split(",");
    videoCode.forEach((item, index) => {
      this.selectedTags[index] = {};
      this.selectedTags[index].value = item;
      this.selectedTags[index].key = item;
    });
    this.toData[0] = {};
    this.toData[0].code = this.hkConfigs[this.currentIndex].code;
    this.toData[0].indexCode = this.hkConfigs[
      this.currentIndex
    ].indexCode.split(",");
    // console.log("toData", this.toData);
  },
  mounted() {
    console.log("tree", this.tree);
    this.selectServer = {
      layoutType: 3,
      ip: this.hkConfigs[this.currentIndex].ip,
      port: this.hkConfigs[this.currentIndex].port,
      userName: this.hkConfigs[this.currentIndex].userName,
      password: this.hkConfigs[this.currentIndex].password,
      indexCode: this.hkConfigs[this.currentIndex].indexCode
    };
    this.LoginPlat();
    this.StartPreview();
  },
  beforeDestroy() {
    //   if (typeof this.preview.StopPreview == "function") {
    //  let v= this.preview.StopPreview(-1);
    //   }
  }
};
</script>

<style lang="stylus">
@import '~variables';

.page {
  background-color: #102b43;
  padding: 0;
}

.toAlter {
  position: absolute;
  right: 0;
  top: 0.04rem;
  z-index: 999;
}

.text {
  color: #18ffff;
}

.title {
  height: 7.2vh;
  line-height: 7.2vh;
  font-size: 1.8vh;
  letter-spacing: 0.005em;
  padding-left: 0.3rem;
  box-sizing: border-box;
}

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

.view {
  margin-right: 0.2rem;
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

.jingdian {
  font-size: 2rem;
  color: white;
  height: 3rem;
  justify-content: center;
  line-height: 3rem;
  margin-top: 30px;
}

.tags-input-root {
  color: #4a4a4a;
  font-size: 0.15rem;
  font-weight: 400;
  line-height: 1.5;
}

.tags-input-wrapper-default {
  padding: 0.05rem 0.25rem;
  background: #fff;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  border-color: #dbdbdb;
}

.tags-input-remove {
  width: 0.1rem;
  height: 0.1rem;
}

.tags-input-badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 0.15rem;
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
}
</style>
