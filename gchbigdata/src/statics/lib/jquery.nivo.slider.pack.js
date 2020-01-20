/*
 * jQuery Nivo Slider v2.7.1
 * http://www.jiepin.net/
 *
 * http://www.jiepin.net/
 * 
 * March 2010
 */
import jQuery from 'jquery'
(function (a) {
  var b = function (b, c) {
    var d = a.extend({}, a.fn.nivoSlider.defaults, c);
    var e = {
      currentSlide: 0,
      currentImage: "",
      totalSlides: 0,
      running: false,
      paused: false,
      stop: false
    };
    var f = a(b);
    f.data("nivo:vars", e);
    f.css("position", "relative");
    f.addClass("nivoSlider");
    var g = f.children();
    g.each(function () {
      var b = a(this);
      var c = "";
      if (!b.is("img")) {
        if (b.is("a")) {
          b.addClass("nivo-imageLink");
          c = b
        }
        b = b.find("img:first")
      }
      var d = b.width();
      if (d == 0) d = b.attr("width");
      var g = b.height();
      if (g == 0) g = b.attr("height");
      if (d > f.width()) {
        f.width(d)
      }
      if (g > f.height()) {
        f.height(g)
      }
      if (c != "") {
        c.css("display", "none")
      }
      b.css("display", "none");
      e.totalSlides++
    });
    if (d.randomStart) {
      d.startSlide = Math.floor(Math.random() * e.totalSlides)
    }
    if (d.startSlide > 0) {
      if (d.startSlide >= e.totalSlides) d.startSlide = e.totalSlides - 1;
      e.currentSlide = d.startSlide
    }
    if (a(g[e.currentSlide]).is("img")) {
      e.currentImage = a(g[e.currentSlide])
    } else {
      e.currentImage = a(g[e.currentSlide]).find("img:first")
    }
    if (a(g[e.currentSlide]).is("a")) {
      a(g[e.currentSlide]).css("display", "block")
    }
    f.css("background", 'url("' + e.currentImage.attr("src") + '") no-repeat');
    f.append(a('<div class="nivo-caption"><p></p></div>').css({
      display: "none",
      opacity: d.captionOpacity
    }));
    a(".nivo-caption", f).css("opacity", 0);
    var h = function (b) {
      var c = a(".nivo-caption", f);
      if (e.currentImage.attr("title") != "" && e.currentImage.attr("title") != undefined) {
        var d = e.currentImage.attr("title");
        if (d.substr(0, 1) == "#") d = a(d).html();
        if (c.css("opacity") != 0) {
          c.find("p").stop().fadeTo(b.animSpeed, 0, function () {
            a(this).html(d);
            a(this).stop().fadeTo(b.animSpeed, 1)
          })
        } else {
          c.find("p").html(d)
        }
        c.stop().fadeTo(b.animSpeed, b.captionOpacity)
      } else {
        c.stop().fadeTo(b.animSpeed, 0)
      }
    };
    h(d);
    var i = 0;
    if (!d.manualAdvance && g.length > 1) {
      i = setInterval(function () {
        o(f, g, d, false)
      }, d.pauseTime)
    }
    if (d.directionNav) {
      f.append('<div class="nivo-directionNav"><a class="nivo-prevNav">' + d.prevText + '</a><a class="nivo-nextNav">' + d.nextText + "</a></div>");
      if (d.directionNavHide) {
        a(".nivo-directionNav", f).hide();
        f.hover(function () {
          a(".nivo-directionNav", f).show()
        }, function () {
          a(".nivo-directionNav", f).hide()
        })
      }
      a("a.nivo-prevNav", f).live("click", function () {
        if (e.running) return false;
        clearInterval(i);
        i = "";
        e.currentSlide -= 2;
        o(f, g, d, "prev")
      });
      a("a.nivo-nextNav", f).live("click", function () {
        if (e.running) return false;
        clearInterval(i);
        i = "";
        o(f, g, d, "next")
      })
    }
    if (d.controlNav) {
      var j = a('<div class="nivo-controlNav"></div>');
      f.append(j);
      for (var k = 0; k < g.length; k++) {
        if (d.controlNavThumbs) {
          var l = g.eq(k);
          if (!l.is("img")) {
            l = l.find("img:first")
          }
          if (d.controlNavThumbsFromRel) {
            j.append('<a class="nivo-control" rel="' + k + '"><img src="' + l.attr("rel") + '" alt="" /></a>')
          } else {
            j.append('<a class="nivo-control" rel="' + k + '"><img src="' + l.attr("src").replace(d.controlNavThumbsSearch, d.controlNavThumbsReplace) + '" alt="" /></a>')
          }
        } else {
          j.append('<a class="nivo-control" rel="' + k + '">' + (k + 1) + "</a>")
        }
      }
      a(".nivo-controlNav a:eq(" + e.currentSlide + ")", f).addClass("active");
      a(".nivo-controlNav a", f).live("click", function () {
        if (e.running) return false;
        if (a(this).hasClass("active")) return false;
        clearInterval(i);
        i = "";
        f.css("background", 'url("' + e.currentImage.attr("src") + '") no-repeat');
        e.currentSlide = a(this).attr("rel") - 1;
        o(f, g, d, "control")
      })
    }
    if (d.keyboardNav) {
      a(window).keypress(function (a) {
        if (a.keyCode == "37") {
          if (e.running) return false;
          clearInterval(i);
          i = "";
          e.currentSlide -= 2;
          o(f, g, d, "prev")
        }
        if (a.keyCode == "39") {
          if (e.running) return false;
          clearInterval(i);
          i = "";
          o(f, g, d, "next")
        }
      })
    }
    if (d.pauseOnHover) {
      f.hover(function () {
        e.paused = true;
        clearInterval(i);
        i = ""
      }, function () {
        e.paused = false;
        if (i == "" && !d.manualAdvance) {
          i = setInterval(function () {
            o(f, g, d, false)
          }, d.pauseTime)
        }
      })
    }
    f.bind("nivo:animFinished", function () {
      e.running = false;
      a(g).each(function () {
        if (a(this).is("a")) {
          a(this).css("display", "none")
        }
      });
      if (a(g[e.currentSlide]).is("a")) {
        a(g[e.currentSlide]).css("display", "block")
      }
      if (i == "" && !e.paused && !d.manualAdvance) {
        i = setInterval(function () {
          o(f, g, d, false)
        }, d.pauseTime)
      }
      d.afterChange.call(this)
    });
    var m = function (b, c, d) {
      for (var e = 0; e < c.slices; e++) {
        var f = Math.round(b.width() / c.slices);
        if (e == c.slices - 1) {
          b.append(a('<div class="nivo-slice"></div>').css({
            left: f * e + "px",
            width: b.width() - f * e + "px",
            height: "0px",
            opacity: "0",
            background: 'url("' + d.currentImage.attr("src") + '") no-repeat -' + (f + e * f - f) + "px 0%"
          }))
        } else {
          b.append(a('<div class="nivo-slice"></div>').css({
            left: f * e + "px",
            width: f + "px",
            height: "0px",
            opacity: "0",
            background: 'url("' + d.currentImage.attr("src") + '") no-repeat -' + (f + e * f - f) + "px 0%"
          }))
        }
      }
    };
    var n = function (b, c, d) {
      var e = Math.round(b.width() / c.boxCols);
      var f = Math.round(b.height() / c.boxRows);
      for (var g = 0; g < c.boxRows; g++) {
        for (var h = 0; h < c.boxCols; h++) {
          if (h == c.boxCols - 1) {
            b.append(a('<div class="nivo-box"></div>').css({
              opacity: 0,
              left: e * h + "px",
              top: f * g + "px",
              width: b.width() - e * h + "px",
              height: f + "px",
              background: 'url("' + d.currentImage.attr("src") + '") no-repeat -' + (e + h * e - e) + "px -" + (f + g * f - f) + "px"
            }))
          } else {
            b.append(a('<div class="nivo-box"></div>').css({
              opacity: 0,
              left: e * h + "px",
              top: f * g + "px",
              width: e + "px",
              height: f + "px",
              background: 'url("' + d.currentImage.attr("src") + '") no-repeat -' + (e + h * e - e) + "px -" + (f + g * f - f) + "px"
            }))
          }
        }
      }
    };
    var o = function (b, c, d, e) {
      var f = b.data("nivo:vars");
      if (f && f.currentSlide == f.totalSlides - 1) {
        d.lastSlide.call(this)
      }
      if ((!f || f.stop) && !e) return false;
      d.beforeChange.call(this);
      if (!e) {
        b.css("background", 'url("' + f.currentImage.attr("src") + '") no-repeat')
      } else {
        if (e == "prev") {
          b.css("background", 'url("' + f.currentImage.attr("src") + '") no-repeat')
        }
        if (e == "next") {
          b.css("background", 'url("' + f.currentImage.attr("src") + '") no-repeat')
        }
      }
      f.currentSlide++;
      if (f.currentSlide == f.totalSlides) {
        f.currentSlide = 0;
        d.slideshowEnd.call(this)
      }
      if (f.currentSlide < 0) f.currentSlide = f.totalSlides - 1;
      if (a(c[f.currentSlide]).is("img")) {
        f.currentImage = a(c[f.currentSlide])
      } else {
        f.currentImage = a(c[f.currentSlide]).find("img:first")
      }
      if (d.controlNav) {
        a(".nivo-controlNav a", b).removeClass("active");
        a(".nivo-controlNav a:eq(" + f.currentSlide + ")", b).addClass("active")
      }
      h(d);
      a(".nivo-slice", b).remove();
      a(".nivo-box", b).remove();
      var g = d.effect;
      if (d.effect == "random") {
        var i = new Array("sliceDownRight", "sliceDownLeft", "sliceUpRight", "sliceUpLeft", "sliceUpDown", "sliceUpDownLeft", "fold", "fade", "boxRandom", "boxRain", "boxRainReverse", "boxRainGrow", "boxRainGrowReverse");
        g = i[Math.floor(Math.random() * (i.length + 1))];
        if (g == undefined) g = "fade"
      }
      if (d.effect.indexOf(",") != -1) {
        var i = d.effect.split(",");
        g = i[Math.floor(Math.random() * i.length)];
        if (g == undefined) g = "fade"
      }
      if (f.currentImage.attr("data-transition")) {
        g = f.currentImage.attr("data-transition")
      }
      f.running = true;
      if (g == "sliceDown" || g == "sliceDownRight" || g == "sliceDownLeft") {
        m(b, d, f);
        var j = 0;
        var k = 0;
        var l = a(".nivo-slice", b);
        if (g == "sliceDownLeft") l = a(".nivo-slice", b)._reverse();
        l.each(function () {
          var c = a(this);
          c.css({
            top: "0px"
          });
          if (k == d.slices - 1) {
            setTimeout(function () {
              c.animate({
                height: "100%",
                opacity: "1.0"
              }, d.animSpeed, "", function () {
                b.trigger("nivo:animFinished")
              })
            }, 100 + j)
          } else {
            setTimeout(function () {
              c.animate({
                height: "100%",
                opacity: "1.0"
              }, d.animSpeed)
            }, 100 + j)
          }
          j += 50;
          k++
        })
      } else if (g == "sliceUp" || g == "sliceUpRight" || g == "sliceUpLeft") {
        m(b, d, f);
        var j = 0;
        var k = 0;
        var l = a(".nivo-slice", b);
        if (g == "sliceUpLeft") l = a(".nivo-slice", b)._reverse();
        l.each(function () {
          var c = a(this);
          c.css({
            bottom: "0px"
          });
          if (k == d.slices - 1) {
            setTimeout(function () {
              c.animate({
                height: "100%",
                opacity: "1.0"
              }, d.animSpeed, "", function () {
                b.trigger("nivo:animFinished")
              })
            }, 100 + j)
          } else {
            setTimeout(function () {
              c.animate({
                height: "100%",
                opacity: "1.0"
              }, d.animSpeed)
            }, 100 + j)
          }
          j += 50;
          k++
        })
      } else if (g == "sliceUpDown" || g == "sliceUpDownRight" || g == "sliceUpDownLeft") {
        m(b, d, f);
        var j = 0;
        var k = 0;
        var o = 0;
        var l = a(".nivo-slice", b);
        if (g == "sliceUpDownLeft") l = a(".nivo-slice", b)._reverse();
        l.each(function () {
          var c = a(this);
          if (k == 0) {
            c.css("top", "0px");
            k++
          } else {
            c.css("bottom", "0px");
            k = 0
          }
          if (o == d.slices - 1) {
            setTimeout(function () {
              c.animate({
                height: "100%",
                opacity: "1.0"
              }, d.animSpeed, "", function () {
                b.trigger("nivo:animFinished")
              })
            }, 100 + j)
          } else {
            setTimeout(function () {
              c.animate({
                height: "100%",
                opacity: "1.0"
              }, d.animSpeed)
            }, 100 + j)
          }
          j += 50;
          o++
        })
      } else if (g == "fold") {
        m(b, d, f);
        var j = 0;
        var k = 0;
        a(".nivo-slice", b).each(function () {
          var c = a(this);
          var e = c.width();
          c.css({
            top: "0px",
            height: "100%",
            width: "0px"
          });
          if (k == d.slices - 1) {
            setTimeout(function () {
              c.animate({
                width: e,
                opacity: "1.0"
              }, d.animSpeed, "", function () {
                b.trigger("nivo:animFinished")
              })
            }, 100 + j)
          } else {
            setTimeout(function () {
              c.animate({
                width: e,
                opacity: "1.0"
              }, d.animSpeed)
            }, 100 + j)
          }
          j += 50;
          k++
        })
      } else if (g == "fade") {
        m(b, d, f);
        var q = a(".nivo-slice:first", b);
        q.css({
          height: "100%",
          width: b.width() + "px"
        });
        q.animate({
          opacity: "1.0"
        }, d.animSpeed * 2, "", function () {
          b.trigger("nivo:animFinished")
        })
      } else if (g == "slideInRight") {
        m(b, d, f);
        var q = a(".nivo-slice:first", b);
        q.css({
          height: "100%",
          width: "0px",
          opacity: "1"
        });
        q.animate({
          width: b.width() + "px"
        }, d.animSpeed * 2, "", function () {
          b.trigger("nivo:animFinished")
        })
      } else if (g == "slideInLeft") {
        m(b, d, f);
        var q = a(".nivo-slice:first", b);
        q.css({
          height: "100%",
          width: "0px",
          opacity: "1",
          left: "",
          right: "0px"
        });
        q.animate({
          width: b.width() + "px"
        }, d.animSpeed * 2, "", function () {
          q.css({
            left: "0px",
            right: ""
          });
          b.trigger("nivo:animFinished")
        })
      } else if (g == "boxRandom") {
        n(b, d, f);
        var r = d.boxCols * d.boxRows;
        var k = 0;
        var j = 0;
        var s = p(a(".nivo-box", b));
        s.each(function () {
          var c = a(this);
          if (k == r - 1) {
            setTimeout(function () {
              c.animate({
                opacity: "1"
              }, d.animSpeed, "", function () {
                b.trigger("nivo:animFinished")
              })
            }, 100 + j)
          } else {
            setTimeout(function () {
              c.animate({
                opacity: "1"
              }, d.animSpeed)
            }, 100 + j)
          }
          j += 20;
          k++
        })
      } else if (g == "boxRain" || g == "boxRainReverse" || g == "boxRainGrow" || g == "boxRainGrowReverse") {
        n(b, d, f);
        var r = d.boxCols * d.boxRows;
        var k = 0;
        var j = 0;
        var t = 0;
        var u = 0;
        var v = new Array;
        v[t] = new Array;
        var s = a(".nivo-box", b);
        if (g == "boxRainReverse" || g == "boxRainGrowReverse") {
          s = a(".nivo-box", b)._reverse()
        }
        s.each(function () {
          v[t][u] = a(this);
          u++;
          if (u == d.boxCols) {
            t++;
            u = 0;
            v[t] = new Array
          }
        });
        for (var w = 0; w < d.boxCols * 2; w++) {
          var x = w;
          for (var y = 0; y < d.boxRows; y++) {
            if (x >= 0 && x < d.boxCols) {
              (function (c, e, f, h, i) {
                var j = a(v[c][e]);
                var k = j.width();
                var l = j.height();
                if (g == "boxRainGrow" || g == "boxRainGrowReverse") {
                  j.width(0).height(0)
                }
                if (h == i - 1) {
                  setTimeout(function () {
                    j.animate({
                      opacity: "1",
                      width: k,
                      height: l
                    }, d.animSpeed / 1.3, "", function () {
                      b.trigger("nivo:animFinished")
                    })
                  }, 100 + f)
                } else {
                  setTimeout(function () {
                    j.animate({
                      opacity: "1",
                      width: k,
                      height: l
                    }, d.animSpeed / 1.3)
                  }, 100 + f)
                }
              })(y, x, j, k, r);
              k++
            }
            x--
          }
          j += 100
        }
      }
    };
    var p = function (a) {
      for (var b, c, d = a.length; d; b = parseInt(Math.random() * d), c = a[--d], a[d] = a[b], a[b] = c);
      return a
    };
    var q = function (a) {
      if (this.console && typeof console.log != "undefined") console.log(a)
    };
    this.stop = function () {
      if (!a(b).data("nivo:vars").stop) {
        a(b).data("nivo:vars").stop = true;
        q("Stop Slider")
      }
    };
    this.start = function () {
      if (a(b).data("nivo:vars").stop) {
        a(b).data("nivo:vars").stop = false;
        q("Start Slider")
      }
    };
    d.afterLoad.call(this);
    return this
  };
  a.fn.nivoSlider = function (c) {
    return this.each(function (d, e) {
      var f = a(this);
      if (f.data("nivoslider")) return f.data("nivoslider");
      var g = new b(this, c);
      f.data("nivoslider", g)
    })
  };
  a.fn.nivoSlider.defaults = {
    effect: "random",
    slices: 15,
    boxCols: 8,
    boxRows: 4,
    animSpeed: 500,
    pauseTime: 3e3,
    startSlide: 0,
    directionNav: true,
    directionNavHide: true,
    controlNav: true,
    controlNavThumbs: false,
    controlNavThumbsFromRel: false,
    controlNavThumbsSearch: ".jpg",
    controlNavThumbsReplace: "_thumb.jpg",
    keyboardNav: true,
    pauseOnHover: true,
    manualAdvance: false,
    captionOpacity: .8,
    prevText: "Prev",
    nextText: "Next",
    randomStart: false,
    beforeChange: function () {},
    afterChange: function () {},
    slideshowEnd: function () {},
    lastSlide: function () {},
    afterLoad: function () {}
  };
  a.fn._reverse = [].reverse
})(jQuery)
