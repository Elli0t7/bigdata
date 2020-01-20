<template>
  <q-page class="page">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 section-padding cust-col">
        <div class="fit section-bg round-border" style="padding:0 .3rem .5rem;">
          <div class="left-head">
            <div class="search-box round-border">
              <q-search v-model="keyword" clearable dark hide-underline />
              <!-- <q-icon name='linked_camera' color="pink-6" size="20px"/> -->
            </div>
          </div>
          <div id="jingdian">
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
              :selected.sync="selected"
              dark
              accordion
              no-nodes-label
              :nodes="tree"
              :expanded.sync="propsExpanded"
              node-key="custId"
            >
              <!-- :selected.sync="selected" -->

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
        <!-- <div class="fit section-bg round-border" id='map'></div>-->
        <div class="fit section-bg column">
          <div class="col-auto">
            <q-btn label="视频监控" size="1.8vh" flat icon="settings" text-color="cyan-12"></q-btn>
          </div>
          <div class="col">
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
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import X2JS from "x2js";
import MultiPreviewCtrl from "../../components/MultiPreviewCtrl";
import { SOAPClientParameters, SOAPClient } from "../../utils/soapclient";
import { animate, uid, easing } from "quasar";
let x2js = new X2JS();
export default {
  data() {
    return {
      options: [],
      model: null,
      config: {},
      worker: {},
      leafs: [],
      // infoWindow: {},
      // mapOptions: {},
      // showtitle: false,
      indexCode: "",
      opened: false,
      selected: {},
      ticked: [],
      tree: [],
      propsExpanded: [],
      // map: '',
      keyword: "",
      showModal: false,
      selectServer: {},
      currentIndex: 0,
      p: [],
      isTicked: 0,
      change: ""
    };
  },
  filters: {},
  computed: {
    platform: function() {
      return this.$store.state.platform;
    }
  },
  watch: {
    selected: function() {
      console.log("selected", this.selected);
      this.tree.forEach(f => {
        this.checkedItem(f);
      });
    }
    // ticked: function() {
    //   //
    //   console.log(
    //     "ticked打钩的个数，isTicked上次检测有效视频打钩个数",
    //     this.ticked,
    //     this.ticked.length,
    //     this.isTicked
    //   );
    //   if (this.ticked.length > this.isTicked) {
    //     if (this.ticked.length > 0) {
    //       this.tree.forEach(f => {
    //         this.checkedItem(f);
    //       });
    //     } else {
    //       this.leafs.forEach(f => {
    //         if (f.marker != null) {
    //           f.marker.hide();
    //           this.infoWindow.close();
    //         }
    //       });
    //     }
    //   }
    // }
  },
  components: {
    MultiPreviewCtrl
  },
  methods: {
    //切换景点
    changeSelect(e) {
      console.log("e", e);
      if (this.change !== e) {
        this.options.forEach((item, index) => {
          if (item.value == e) {
            this.currentIndex = index;
          } else {
            return;
          }
        });
        this.selectServer = {
          layoutType: 3,
          ip: this.p[this.currentIndex].ip,
          port: this.p[this.currentIndex].port,
          userName: this.p[this.currentIndex].userName,
          password: this.p[this.currentIndex].password,
          indexCode: this.p[this.currentIndex].indexCode
        };
        var s = preview.StopPreview(-1);
        if (s == 0) {
          // alert("退出登录，视频正在更新");
          setTimeout(() => {
            this.LoginPlat();
            this.StartPreview();
            this.change = e;
          }, 3000);
        }
        setTimeout(() => {
          console.log("this.p", this.p[this.currentIndex], this.selectServer);
          this.getAllResourceDetail(this.p[this.currentIndex]);
        }, 200);
      }
    },
    checkedItem(row) {
      console.log("row", row);
      if (row.children && row.children.length > 0) {
        let _children = row.children;
        // console.log("haizi---", _children);
        var currentRow = _children.find(
          // child => child.custId == this.ticked[this.ticked.length - 1]
          child => child.custId == this.selected
        );
        // console.log("index ---", currentRow);
        if (currentRow) {
          // debugger;
          if (currentRow._i_is_online == 1) {
            this.indexCode = currentRow._c_index_code;
            // console.log("indexCode ---", this.indexCode);
            this.selectServer = {
              layoutType: 3,
              ip: currentRow.custConfig.ip,
              port: currentRow.custConfig.port,
              userName: currentRow.custConfig.userName,
              password: currentRow.custConfig.password,
              indexCode: this.indexCode
            };
            this.StartPreview();
            this.isTicked = this.isTicked + 1;
          } else {
            // this.$q.notify({
            //   message: "该视频数据信息有误",
            //   type: "negative",
            //   timeout: 200,
            //   position: "left"
            // });
          }
        }
        _children.forEach((f, index) => {
          this.checkedItem(f, index);
        });
      } else {
        // if (row.marker != null) {
        //   if (this.ticked.indexOf(row.custId) != -1) {
        //     row.marker.show();
        //     this.infoWindow.setInfoTitle(row.opt.title);
        //     this.infoWindow.setInfoBody(row.opt.content);
        //     this.infoWindow.open(this.map, row.opt.position);
        //   } else {
        //     row.marker.hide();
        //   }
        // }
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
    //树结构有多个子节点
    treeCode(id) {},
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
          let root = {};
          datarows.map(f => {
            if (f._c_classname == "Domain") {
              root = f;
            }
            f.custId = uid();
            f._c_device_index_code = f._c_index_code;
            f.children = [];
            f.label = f._c_org_name;
            f.custConfig = config;
            let children = datarows.filter(m => {
              return m._i_parent_id == f._i_id;
            });
            f.children = children;
            f.lazy = f.children.length == 0;
          });
          this.tree.push(root);
        }
      );
    },
    //树结构懒加载
    onLazyLoad({ node, key, done, fail }) {
      let datarows = [];
      // alert("加载");
      console.log("node", node, key);
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
            // console.log(resultObj);
            datarows = resultObj.table.rows.row;
            // console.log(datarows);
            if (datarows && datarows.length) {
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
              });
            } else {
              this.$q.notify({
                message: "该视频节点下无数据",
                type: "negative",
                timeout: 200,
                position: "left"
              });
            }
            // console.log("datarows", datarows);
            if (datarows && datarows.length > 0) {
              this.leafs = this.leafs.concat(datarows);
              done(datarows);
            } else {
              fail();
            }
          } catch (error) {
            console.log(error);
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
    // console.log(this.$store.state.platform);
    let p = this.platform.hkConfigs;
    this.p = p;
    p.forEach((item, index) => {
      this.options[index] = {};
      this.options[index].label = item.scenicName;
      this.options[index].value = item.id;
    });
    // console.log("options", this.options);
    this.model = this.options[0].value;
    this.change = this.options[0].value;
    this.getAllResourceDetail(p[this.currentIndex]);
  },
  mounted() {
    this.selectServer = {
      layoutType: 3,
      ip: this.p[this.currentIndex].ip,
      port: this.p[this.currentIndex].port,
      userName: this.p[this.currentIndex].userName,
      password: this.p[this.currentIndex].password,
      indexCode: this.p[this.currentIndex].indexCode
    };
    this.LoginPlat();
    this.StartPreview();
  },
  beforeDestroy() {
    this.StopAll();
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

.jingdian {
  font-size: 2rem;
  color: white;
  height: 3rem;
  justify-content: center;
  line-height: 3rem;
}
</style>
