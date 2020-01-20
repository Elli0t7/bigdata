
const routes = [
  { name:'login',
    path:'/',
    component:()=>import('pages/login'),
    meta:{auth:false}
   
  },{
    name:'touristview',
    path:'/overview/:scenicName',
    component:()=>import('pages/tourist/overview'),
    meta:{auth:false}
  },
      
  {  
    path: '/index',
    component: () => import('layouts/MyLayout.vue'), 
    meta:{auth:true},
    children: [
      {name:'systemOption',path:'settings',component:()=>import('pages/front/settings'),meta:{auth:true}}, 
      {name:'SourceCityExcel',path:'sourceCityExcel',component:()=>import('pages/front/parkingExcel'),meta:{auth:true}},    
      {name:'shuimancheng', path: 'shuimancheng', component: () => import('pages/front/shuimancheng'),meta:{auth:true}},  
      {name:'yaxi', path: 'yaxi', component: () => import('pages/front/yaxi'),meta:{auth:true}}, 
      {name:'yzs', path: 'yzs', component: () => import('pages/front/yzs'),meta:{auth:true}}, 
      {name:'laojie', path: 'laojie', component: () => import('pages/front/laojie'),meta:{auth:true}},     
      {name:'overview', path: '', component: () => import('pages/front/index'),meta:{auth:true}},      
      {name:'tourists',  path: 'tourists', component: () => import('pages/front/tourists'),meta:{auth:true} }, 
      {name:'ticketing',  path: 'ticketing', component: () => import('pages/front/ticketing'),meta:{auth:true} }, 
      {name:'parking',  path: 'parking', component: () => import('pages/front/parking'),meta:{auth:true} }, 
      {name:'resources',  path: 'resources', component: () => import('pages/front/resources'),meta:{auth:true} }, 
      {name:'website',  path: 'website', component: () => import('pages/front/website'),meta:{auth:true} }, 
      {name:'publicSentiment',  path: 'publicSentiment', component: () => import('pages/front/publicSentiment'),meta:{auth:true} }, 
      {name:'guide',  path: 'guide', component: () => import('pages/front/guide'),meta:{auth:true} }, 
      {name:'comfortDegree',  path: 'comfortDegree', component: () => import('pages/front/comfortDegree'),meta:{auth:true} }, 
      {name:'gps',  path: 'gps', component: () => import('pages/front/gps'),meta:{auth:true} }, 
      {name:'broadcast',  path: 'broadcast', component: () => import('pages/front/broadcast'),meta:{auth:true} }, 
      {name:'monitor',  path: 'monitor', component: () => import('pages/front/monitor'),meta:{auth:true} }, 
      {name:'wifi',  path: 'wifi', component: () => import('pages/front/wifi'),meta:{auth:true} },   
      {name:'ck',  path: 'ck', component: () => import('pages/front/ck'),meta:{auth:true} },
      {name:'guangdian',path:'guangdian',component:()=>import('pages/front/guangdian'),meta:{isHideMonitor:true}}      
    ]
},
  {
    path: '/Admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Admin/Index.vue'),meta:{auth:true} },      
      {path:'userManager',name:'userManager',component:()=>import('pages/Admin/user/index'),meta:{auth:true}},
      {path:'monitorManager',name:'monitorManager',component:()=>import('pages/Admin/monitor/index'),meta:{auth:true}},
      {path:'parkingManager',name:'parkingManager',component:()=>import('pages/Admin/parking/index'),meta:{auth:true}},
      {path:'broadcastManager',name:'broadcastManager',component:()=>import('pages/Admin/broadcast/index'),meta:{auth:true}}
    
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
