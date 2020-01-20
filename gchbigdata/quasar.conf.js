// Configuration for your app

module.exports = function(ctx) {
    return {

        // app plugins (/src/plugins)
        plugins: [
            'axios',
            'v-video',
            'swiper',
            'vuelidate'
        ],
        css: [
            'app.styl'
        ],
        extras: [
            ctx.theme.mat ? 'roboto-font' : null,
            'material-icons', // optional, you are not bound to it
            // 'ionicons',
            // 'mdi',
            //'fontawesome'
        ],
        supportIE: false,
        build: {
            env: {
                //BASE_API: JSON.stringify('https://www.easy-mock.com/mock/5bb03022c4bd4a6086d875f9')
                //BASE_API:JSON.stringify('http://61.172.254.174:8001/api'),
                //BASE_API: JSON.stringify('http://bigdata.ipguide.com.cn/gch_api'),
                //BASE_API:JSON.stringify('http://192.168.3.148:8011'),
                BASE_API: JSON.stringify('http://bigdata.ipguide.com.cn/gch_api'),
            },
            scopeHoisting: true,
            publicPath: '/gch',
            //vueRouterMode: 'history',
            // vueCompiler: true,
            // gzip: true,
            // analyze: true,
            // extractCSS: false,
            extendWebpack(cfg) {
                // cfg.resolve.alias['vue'] = 'vue/dist/vue.js'
                cfg['externals'] = {
                    'AMap': 'window.AMap',
                    'AMapUI': 'AMapUI',
                    // 'WebVideoCtrl':'WebVideoCtrl'
                }
            },
        },
        devServer: {
           // https: true,
            port: 80,
            open: true, // opens browser window automatically
            proxy: {
                // '/tq/':{
                //     target: 'https://tianqiapi.com',
                //     changeOrigin: true,
                //     pathRewrite: {
                //         '^/tq/': '/'
                //     }
                // },
                '/tq/':{
                    target: 'http://i.tianqi.com',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/tq/': '/'
                    }
                },
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
        //framework: {all:true,
        framework: {
            components: [
                'QLayout',
                'QLayoutHeader',
                'QLayoutDrawer',
                'QPageContainer',
                'QPage',
                'QToolbar',
                'QToolbarTitle',
                'QBtn',
                'QIcon',
                'QList',
                'QListHeader',
                'QItem',
                'QItemMain',
                'QItemSide',
                'QInput',
                'QTabs',
                'QTab',
                'QTabPane',
                'QRouteTab',
                'QResizeObservable',
                'QScrollArea',
                'QLayoutFooter',
                'QTable',
                'QSearch',
                'QTh',
                'QTr',
                'QTd',
                'QTableColumns',
                'QSelect',
                'QPopupEdit',
                'QField',
                'QCheckbox',
                'QChipsInput',
                'QModalLayout',
                'QModal',
                'QTooltip',
                'QInnerLoading',
                'QSpinnerHourglass',
                'QCollapsible',
                'QItemTile',
                'QCarousel',
                'QCarouselSlide',
                'QCarouselControl',
                'QToggle',
                'QProgress',
                'QDatetime',
                'QTree',
                'QSlider',
                'QKnob',
                'QSpinnerAudio',
                'QSpinnerMat',
                'QPopover'
            ],
            directives: [
                'Ripple',
                'CloseOverlay'
            ],
            // Quasar plugins
            plugins: [
                'Notify',
                'Dialog',
                'LocalStorage',
                'SessionStorage',
                'Cookies'
            ],
            iconSet: 'material-icons',
            // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
            i18n: 'zh-hans' // Quasar language
        },
        // animations: 'all' --- includes all animations
        animations: 'all',
        ssr: {
            pwa: false
        },
        pwa: {
            // workboxPluginMode: 'InjectManifest',
            // workboxOptions: {},
            manifest: {
                // name: 'Quasar App',
                // short_name: 'Quasar-PWA',
                // description: 'Best PWA App in town!',
                display: 'standalone',
                orientation: 'portrait',
                background_color: '#ffffff',
                theme_color: '#027be3',
                icons: [{
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
            // id: 'org.cordova.quasar.app'
        },
        electron: {
            // bundler: 'builder', // or 'packager'
            extendWebpack(cfg) {
                // do something with Electron process Webpack cfg
            },
            packager: {
                // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

                // OS X / Mac App Store
                // appBundleId: '',
                // appCategoryType: '',
                // osxSign: '',
                // protocol: 'myapp://path',

                // Window only
                // win32metadata: { ... }
            },
            builder: {
                // https://www.electron.build/configuration/configuration

                // appId: 'quasar-app'
            }
        }
    }
}