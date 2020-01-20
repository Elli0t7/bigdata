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
          <q-scroll-area style="height: 88%" :thumb-style="{
                                                            right: '4px',
                                                            borderRadius: '5px',
                                                            background: '#18ffff',
                                                            width: '10px',
                                                            opacity: .5
                                                          }"
            :delay="500">
            <q-tree :filter='keyword' control-color="white" color="secondary" class='monitor-tree' :ticked.sync="ticked"
              @lazy-load="onLazyLoad" tick-strategy='leaf' default-expand-all dark :selected.sync="selected" :nodes="tree"
              :expanded.sync="propsExpanded" node-key="custId">
              <!-- node-key="_c_device_index_code" -->
              <div slot="header-generic" slot-scope="prop" class="row items-center">
                <q-icon :name="prop.node._i_is_online==1?'videocam':'videocam_off'" :color="prop.node._i_is_online==1?'green':'red'"
                  size='24px' class="q-mr-sm" />
                <div :class="['text-weight-bold',prop.node._i_is_online==1?'text-green':'text-red']">{{ prop.node.label
                  }}</div>
              </div>
            </q-tree>
          </q-scroll-area>
        </div>

      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 section-padding cust-col">
        <div class="fit section-bg round-border" id='map'>

        </div>
      </div>
    </div>
    
  </q-page>
</template>

<script>
  import X2JS from 'x2js'
  import MultiPreviewCtrl from "../../components/MultiPreviewCtrl";
  import {
    SOAPClientParameters,
    SOAPClient
  } from '../../utils/soapclient'
  import {    
    uid,
    
  } from 'quasar'
  let x2js = new X2JS();
  export default {

    data() {
      return {
        config:{},
        worker: {},
        leafs: [],
        infoWindow: {},
        mapOptions: {},
        showtitle: false,
        indexCode: '',
        opened: false,
        selected: {},
        ticked: [],
        tree: [],
        propsExpanded: [],
        map: '',
        keyword: '',       
        showModal:false,
      }
    },
    filters: {},
    computed: { 
      platform: function () {
        return this.$store.state.platform;
      },
    },
    watch: {  
      ticked: function () {
        if (this.ticked.length > 0) {   
         this.tree.forEach(f=>{
           this.checkedItem(f)
         }) 
        } else {
          this.leafs.forEach(f => {
            if (f.marker != null) {
              f.marker.hide()
              this.infoWindow.close()
            }

          })
        }

      }


    },
    components: {      
      MultiPreviewCtrl
    },
    methods: {
      //获取组织下的资源
      getAllResourceDetailByOrg(config, orgCode, callback) {
        var param = new SOAPClientParameters();
        param.add('ws:nodeIndexCode', config.code); //001002
        param.add('ws:orgCode', orgCode);
        param.add('ws:resType', '10000'); //1000
        SOAPClient.invoke(config.prefix + '/cms/services/ICommonService', "getAllResourceDetailByOrg",
          param, true, callback);
      },
      //获取组织
      getAllResourceDetail(config) {
        this.tree = []
        var param = new SOAPClientParameters();
        param.add('ws:nodeIndexCode', config.code); //001002
        param.add('ws:resType', '1000'); //1000 
        SOAPClient.invoke(config.prefix + '/cms/services/ICommonService', "getAllResourceDetail", param,
          true, (r, soapResponse) => {    
                    
            let jsonObj = x2js.xml2js((new XMLSerializer()).serializeToString(soapResponse))
            let result = jsonObj.Envelope.Body.getAllResourceDetailResponse.return.__text
            let resultObj = x2js.xml2js(result)
            let datarows = !Array.isArray(resultObj.table.rows.row)?[resultObj.table.rows.row]:resultObj.table.rows.row            
            datarows.map(f => {
              f.custId = uid()
              f.lazy=datarows.length==1
              f._c_device_index_code = f._c_index_code
              f.children = []              
              f.label = f._c_org_name
              f.custConfig = config
            })
            let root = datarows.filter(f => {              
              return f._c_classname == "Domain"
            })[0]

            datarows.forEach((m) => {
              if (m._c_classname == 'Organization') {
                m.lazy = true
                root['children'].push(m)
              }
            })
            this.tree.push(root)
          });


      },
      onLazyLoad({
        node,
        key,
        done,
        fail
      }) {
         
         let datarows=[];
        
        this.getAllResourceDetailByOrg(node.custConfig, node._c_index_code, (r, soapResponse) => {

           try {
          let jsonObj = x2js.xml2js((new XMLSerializer()).serializeToString(soapResponse))
          let result = jsonObj.Envelope.Body.getAllResourceDetailByOrgResponse.return.__text
          let resultObj = x2js.xml2js(result)
          datarows = resultObj.table.rows.row

           let online = datarows.length,
            total = datarows.length;

           datarows.map(m => {
            let videoType = ['枪机', '半球', '快球']
            m.custId = uid()
            m.disabled = (m._c_longitude == 'null' || m._c_latitude == 'null') ? true : false
            m.camera_type = videoType[m._i_camera_type]
            m.label = m._c_name;
            m.icon = 'videocam'
            m.header = 'generic'
            m.custConfig = node.custConfig
            // m.disabled=m._i_is_online!=1
            if (m._i_is_online != 1) {
              m.icon = 'videocam_off'
              online--
            }
            m.marker = null
            if (!m.disabled) {
              m.custConfig.currentIndexCode = m._c_index_code
              console.log(`${m.custConfig.currentIndexCode} `)
              console.log(m.custConfig)
              let playabled = m._i_is_online == 1 ?
                `<button data-cust-config='${JSON.stringify(m.custConfig)}' tabindex="0" type="button"  class="q-btn inline relative-position q-btn-item non-selectable q-btn-rectangle q-focusable q-hoverable bg-green text-white q-btn-dense" style="font-size: 14px;"><div class="q-focus-helper"></div><div class="q-btn-inner row col items-center justify-center"><i aria-hidden="true" class="q-icon material-icons on-left">tv</i><div>查看监控</div></div></button>` :
                ''
              let opt = {
                position: [m._c_longitude, m._c_latitude],
                title: `<div class='info-title-green'><strong>${m._c_name}</strong><div>`,
                content: `<div class='info-body'>
                   <div class='row'><div class='col-3 text-right'>状态：</div><div class='col-9'>${m._i_is_online==1?'在线':'离线'}</div></div>
                   <div class='row'><div class='col-3 text-right'>类型：</div><div class='col-9'>${m.camera_type}</div></div>
                   <div class='row'><div class='col-3 text-right'>IP：</div><div class='col-9'>${m._c_device_ip}:${m._i_device_port}</div></div>
                   <div class='row'><div class='col-3 text-right'>位置：</div><div class='col-9'>${m._c_longitude}，${m._c_latitude}</div></div>
                   <div class='text-center q-pa-sm'>${playabled}</div>
                   </div>`,
              }

              let marker = new AMap.Marker({
                position: [m._c_longitude, m._c_latitude],
                content: '<i aria-hidden="true" class="q-icon marker_shark material-icons text-purple-13" style="font-size: 24px;">linked_camera</i>',
                visible: false,
                title: m._c_name,
                map: this.map
              });
              let _this = this;
              let markerClick = function () {
                _this.infoWindow.setInfoTitle(opt.title);
                _this.infoWindow.setInfoBody(opt.content);
                _this.infoWindow.open(_this.map, opt.position);
              }
              marker.on('click', markerClick);
              m.marker = marker
              m.opt = opt
            }
          })
          if(datarows.length>0){
             this.leafs = this.leafs.concat(datarows)
            done(datarows)
          }else{
            fail()
          }
         
         } catch (error) {
           fail()
         }
        })

      },
      
     
      

    },    
    mounted() {      
      this.platform.hkConfigs.forEach(f => {        
        this.getAllResourceDetail(f)
      })

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
  }

</script>
<style lang='stylus' >

  .page-box
   height 88.8vh
  .left-head  
   padding .2rem 0  
  
  .monitor-tree
   font-size .16rem 
   .q-tree-arrow
     font-size .18rem
     width .18rem
     height .18rem
  .info-title-green
   color green
   font-size .16rem
  .info-body
   font-size .14rem 
   bold()
  .monitor-box   
   position relative
   padding-top 40px
  .drag
   padding 0 .1rem
   height 40px
   cursor move
   font-size .16rem
   color green
   bold()  
   background #eee 
   line-height 40px
</style>
