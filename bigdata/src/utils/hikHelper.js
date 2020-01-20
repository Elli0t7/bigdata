import X2JS from 'x2js'
import {
    SOAPClientParameters,
    SOAPClient
  } from './soapclient'
let _prefix='';
let tree=[];
let ddd=[]
let _nodeIndexCode='';
let x2js=new X2JS();      
function getleaf(r,soapResponse){
    let jsonObj=x2js.xml2js((new XMLSerializer()).serializeToString(soapResponse))       
    let result=jsonObj.Envelope.Body.getAllResourceDetailByOrgResponse.return.__text
    let resultObj=x2js.xml2js(result)
    let datarows= resultObj.table.rows.row
     
    let online=datarows.length,total=datarows.length;
    
     datarows.map(m=>{
       
         let videoType=['枪机','半球','快球']
         m.camera_type=videoType[m._i_camera_type]
         m.label=m._c_name;
         m.icon='videocam'
         m.header='generic'
        // m.disabled=m._i_is_online!=1
         if(m._i_is_online!=1){
             m.icon='videocam_off'
             online--
         }
     })
    
     datarows.forEach(f=>{
         ddd.push({ip:f._c_device_ip,port:f._i_device_port,indexcode:f._c_device_index_code})
         //debugger
         let parent=tree[0].children.filter((s)=>{
             return f._c_org_index_code==s._c_index_code
         })         
         if(parent&&parent.length>0){
             parent[0].children.push(f) 
             parent[0].label=parent[0]._c_org_name+` [ ${online}/${total} ] `            
         }
     })   
   
}
function getResult(r,soapResponse){    
    
   let jsonObj=x2js.xml2js((new XMLSerializer()).serializeToString(soapResponse))       
   let result=jsonObj.Envelope.Body.getAllResourceDetailResponse.return.__text
   let resultObj=x2js.xml2js(result)
   let datarows= resultObj.table.rows.row
    datarows.map(f=>{
        f._c_device_index_code=f._c_index_code
        f.children=[]
        f.label=f._c_org_name
    })
   let root= datarows.filter(f=>{
       return f._c_classname=="Domain"
   })[0]
   
   datarows.forEach((m)=>{    
      if(m._c_classname=='Organization'){
        getAllResourceDetailByOrg(_nodeIndexCode,m._c_index_code,_prefix);
        root['children'].push(m)        
     }
   })
   tree.push(root)
}
//获取组织下的资源
function getAllResourceDetailByOrg(nodeIndexCode,orgCode,prefix){
    var param = new SOAPClientParameters();
    param.add('ws:nodeIndexCode', nodeIndexCode); //001002
    param.add('ws:orgCode', orgCode);  
    param.add('ws:resType', '10000');             //1000
    SOAPClient.invoke(prefix+'/cms/services/ICommonService', "getAllResourceDetailByOrg", param, true,getleaf);
}

//获取组织
function getAllResourceDetail(nodeIndexCode,prefix) {   
    tree=[]    
    _prefix=prefix
    _nodeIndexCode=nodeIndexCode   
    var param = new SOAPClientParameters();
    param.add('ws:nodeIndexCode', nodeIndexCode); //001002
    param.add('ws:resType', '1000');             //1000
    
    SOAPClient.invoke(_prefix+'/cms/services/ICommonService', "getAllResourceDetail", param, true,getResult);
   
    
  }

  export {getAllResourceDetail,tree,ddd}