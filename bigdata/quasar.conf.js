// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios',
      'swiper',
      'v-video',
      'vuelidate'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QDialog',
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',        
        'QItem',       
        'QInput',
        'QTabs',
        'QTab',
        'QItemSection',
        'QItemLabel',
        'QRouteTab',
        'QMenu',
        'QScrollArea',
        'QFooter',
        'QTable',
        'QExpansionItem',
        'QTh',
        'QTr',
        'QTd',        
        'QSelect',
        'QPopupEdit',
        'QField',
        'QCheckbox',    
        'QTooltip',
        'QInnerLoading',
        'QSpinnerHourglass',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QToggle',
        'QTree',
        'QSlider',
        'QKnob',
        'QSpinnerAudio',
        'QSeparator',
        'QSlider',
        'QDate',
        'QPopupProxy'
      ],

      directives: [
        'Ripple',
        'ClosePopup'
      ],

      // Quasar plugins
      plugins: [
        'Notify','Dialog',
        'LocalStorage',
        'SessionStorage',
        'Cookies'
      ]
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      //publicPath:'/bigdata',
      env: {
        //BASE_API: JSON.stringify('https://www.easy-mock.com/mock/5bb03022c4bd4a6086d875f9')
        //BASE_API:JSON.stringify('http://61.172.254.174:8001/api'),
        //BASE_API: JSON.stringify('http://bigdata.ipguide.com.cn/gch_api'),
        //BASE_API:JSON.stringify('http://192.168.3.148:8011'),
         BASE_API:JSON.stringify('http://bigdata.ipguide.com.cn/gch_api'), 
      },
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg['externals'] = {
          'AMap': 'window.AMap',
          'AMapUI': 'AMapUI',
          // 'WebVideoCtrl':'WebVideoCtrl'
        }
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
      port: 8080,
      open: true, // opens browser window automatically
      proxy: {
        '/yzs': {
          target: 'http://221.226.142.210:8099',
          changeOrigin: true,
          pathRewrite: {
            '^/yzs': ''
          }
        },
        '/smc': {
          target: 'http://222.190.138.228:8099',
          changeOrigin: true,
          pathRewrite: {
            '^/smc': ''
          }
        },
        '/yaxi': {
          target: 'http://120.195.64.106:8099',
          changeOrigin: true,
          pathRewrite: {
            '^/yaxi': ''
          }
        },
        '/xjyaxi': {
          target: 'http://36.152.18.66:8099',
          changeOrigin: true,
          pathRewrite: {
            '^/xjyaxi': ''
          }
        },
        '/dsyaxi': {
          target: 'http://120.195.115.2:8099',
          changeOrigin: true,
          pathRewrite: {
            '^/dsyaxi': ''
          }
        }
        // '/index':{
        //   target:'http://i.tianqi.com',
        //   changeOrigin: true,
        // } ,  

      }
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'bigdata',
        // short_name: 'bigdata',
        // description: 'bigdata',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'bigdata'
      }
    }
  }
}
