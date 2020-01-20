/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

(function (root, factory) {
    /* eslint-disable */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
    /* eslint-enable */
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    var contrastColor = 'white';
    var axisCommon = function () {
        return {
           
            axisLine: {
                lineStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(70,45,132,.1)' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(247,247,250,.1)' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }
                }
            },
            axisTick: {
                show:false,
                lineStyle: {
                    
                    color: contrastColor
                }
            },
            axisLabel: {
                textStyle: {
                    color: contrastColor
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'solid',
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(70,45,132,.1)' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(247,247,250,.1)' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }
                }
            },
            splitArea: {
                areaStyle: {
                    color: contrastColor
                }
            }
        };
    };

    var colorPalette = [
        {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: '#f7335e' // 0% 处的颜色
            }, {
                offset: 1, color: '#e87568' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        }, 
        {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: -1,
            colorStops: [{
                offset: 0, color: '#8b34fd' // 0% 处的颜色
            }, {
                offset: 1, color: '#4842fb' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        }, 
        {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: -1,
            colorStops: [{
                offset: 0, color: '#29d5fd' // 0% 处的颜色
            }, {
                offset: 1, color: '#457dfe' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        }, {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: -1,
            colorStops: [{
                offset: 0, color: '#de3334' // 0% 处的颜色
            }, {
                offset: 1, color: '#fe7b44' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        }, {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: -1,
            colorStops: [{
                offset: 0, color: '#457dfe' // 0% 处的颜色
            }, {
                offset: 1, color: '#29d5fd' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        },{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: -1,
            colorStops: [{
                offset: 0, color: '#5fffd0' // 0% 处的颜色
            }, {
                offset: 1, color: '#30ccc1' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        },
        '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'
    ];
    var theme = {
        grid:{
            top:'45',
            bottom:'45',
            left:'45',
            right:'45'
        },
        color: colorPalette,
        backgroundColor: '',
        tooltip: {
            axisPointer: {
                lineStyle: {
                    color: contrastColor
                },
                crossStyle: {
                    color: contrastColor
                }
            }
        },
        legend: {
            textStyle: {
                color: contrastColor
            }
        },
        textStyle: {
            color: contrastColor
        },
        title: {
            textStyle: {
                color: '#18ffff'
            }
        },
        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: contrastColor
                }
            }
        },
        dataZoom: {
            textStyle: {
                color: contrastColor
            }
        },
        visualMap: {
            textStyle: {
                color: contrastColor
            }
        },
        timeline: {
            lineStyle: {
                color: contrastColor
            },
            itemStyle: {
                normal: {
                    color: colorPalette[1]
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: contrastColor
                    }
                }
            },
            controlStyle: {
                normal: {
                    color: contrastColor,
                    borderColor: contrastColor
                }
            }
        },
        timeAxis: axisCommon(),
        logAxis: axisCommon(),
        valueAxis: axisCommon(),
        categoryAxis: axisCommon(),

        line: {
            symbol: 'circle'
        },
        graph: {
            color: colorPalette
        },
        gauge: {
            title: {
                textStyle: {
                    color: contrastColor
                }
            }
        },
        candlestick: {
            itemStyle: {
                normal: {
                    color: '#FD1050',
                    color0: '#0CF49B',
                    borderColor: '#FD1050',
                    borderColor0: '#0CF49B'
                }
            }
        }
    };
    theme.categoryAxis.splitLine.show = false;
    echarts.registerTheme('dark', theme);
}));