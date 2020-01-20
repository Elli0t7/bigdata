<template>
  <div class="login-page">
    <div id="slider" class="nivoSlider">
      <img src="../statics/images/4.jpg" alt />
      <img src="../statics/images/6.jpg" alt />
      <img src="../statics/images/7.jpg" alt />
      <img src="../statics/images/9.jpg" alt />
    </div>
    <canvas id="loginCanvas"></canvas>
    <div class="login-box fixed-center">
      <h4 class="text-center text-cyan-12">高淳全域智慧旅游大数据平台</h4>
      <div class="relative-position login-content">
        <q-field :error="$v.userName.$error" error-label="请输入正确的用户名!">
          <q-input
            color="cyan-12"
            dark
            :before="[{icon:'account_box'}]"
            v-model="userName"
            float-label="用户名"
          />
        </q-field>
        <q-field :error="$v.passWord.$error" dark error-label="请输入正确的密码!">
          <q-input
            color="cyan-12"
            dark
            type="password"
            :before="[{icon:'vpn_key'}]"
            v-model="passWord"
            float-label="密码"
          />
        </q-field>
        <div class="row">
          <div class="col-6">
            <q-field>
              <q-checkbox color="white" label="记住密码" v-model="rememberAccount" />
            </q-field>
          </div>
          <div class="col-6">
            <q-field>
              <q-checkbox color="white" label="登录到管理后台" v-model="goAdmin" />
            </q-field>
          </div>
        </div>
        <q-btn class="full-width login-btn" size="large" @click="login" color="info">登录</q-btn>
      </div>
      <q-inner-loading :visible="loading">
        <q-spinner-hourglass size=".8rem" color="cyan-12"></q-spinner-hourglass>
        <div class="loadingtext">{{loadingtext}}</div>
      </q-inner-loading>
    </div>
  </div>
</template>

<script>
import jQuery from "jquery";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      rememberAccount: true,
      animate: "",
      goAdmin: false,
      loading: false,
      userName: "",
      passWord: "",
      loadingtext: "正在登录…"
    };
  },
  validations: {
    userName: {
      required
    },
    passWord: {
      required
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.$q.cookies.has("accountInfo")) {
        let accountInfo = this.$q.cookies.get("accountInfo");
        this.userName = accountInfo.userName;
        this.passWord = accountInfo.passWord;
      }
      document.body.addEventListener("keyup", this.enter);
      import("../statics/lib/jquery.nivo.slider.pack.js")
        .then(a => {
          jQuery("#slider").nivoSlider({
            effect: "random",
            slices: 15,
            animSpeed: 800,
            pauseTime: 4000,
            directionNav: false,
            controlNav: false,
            keyboardNav: true
          });
        })
        .catch(e => {
          console.log(e);
        });
      import("../statics/lib/loginEffect.js").then(a => {
        a.animate();
      });
    }, 200);
  },
  beforeDestroy() {
    document.body.removeEventListener("keyup", this.enter);
  },
  methods: {
    enter(e) {
      if (e.keyCode == "13") {
        this.login();
      }
    },
    login() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;
        this.loadingtext = "正在登录…";
        if (!this.goAdmin) {
          this.$axios({
            url: "/navigate/loadNavigate",
            method: "POST",
            data: {
              userName: this.userName,
              password: this.passWord
            }
          })
            .then(response => {
              this.loadingtext = "登录成功！";
              if (this.rememberAccount) {
                this.$q.cookies.set(
                  "accountInfo",
                  JSON.stringify({
                    userName: this.userName,
                    passWord: this.passWord
                  }),
                  {
                    expires: 10
                  }
                );
              } else {
                if (this.$q.cookies.has("accountInfo")) {
                  this.$q.cookies.remove("accountInfo");
                }
              }
              setTimeout(() => {
                this.loading = false;
                this.$store.commit("setToken", 200);
                let guangdian = {
                  gchColumns: [
                    {
                      default: true,
                      subLabel: "guangdian",
                      routerName: "guangdian",
                      scenicId: "10005",
                      isEnabled: 0,
                      icon: "map",
                      id: "ADF7EFD551FF4B9483B85DBFCCA3BC0F",
                      label: "景区概览",
                      ind: "99"
                    }
                  ],
                  default: false,
                  scenicName: "guangdian",
                  routerName: "guangdian",
                  broadcastConfigs: [],
                  icon: null,
                  hkConfigs: [
                    {
                      code: "001002",
                      id: "123",
                      ind: "0",
                      indexCode:
                        "001642,001138,001446,001356,001628,001629,001367,001437,001681",
                      ip: "222.190.138.228",
                      password: "Hik12345+",
                      port: "8099",
                      prefix: "/smc",
                      scenicId: "10001",
                      scenicName: "水慢城",
                      userName: "admin"
                    },
                    {
                      code: "001007",
                      id: "126",
                      ind: "0",
                      indexCode:
                        "001158,001109,001128,001161,001116,001114,001108,001129,001107",
                      ip: "120.195.64.106",
                      password: "Hik12345",
                      port: "8099",
                      prefix: "/yaxi",
                      scenicId: "10002",
                      scenicName: "慢客中心",
                      userName: "admin"
                    },
                    {
                      code: "001007",
                      id: "128",
                      ind: "1",
                      indexCode: "001112,001115,001128,001118",
                      ip: "120.195.115.3",
                      password: "hik12345+",
                      port: "8099",
                      prefix: "/dsyaxi",
                      scenicId: "10002",
                      scenicName: "大山",
                      userName: "admin"
                    },
                    {
                      code: "001007",
                      id: "129",
                      ind: "2",
                      indexCode:
                        "001145,001137,001141,001140,001144,001138,001143,001136,001119",
                      ip: "36.152.18.66",
                      password: "Hik12345",
                      port: "8099",
                      prefix: "/xjyaxi",
                      scenicId: "10002",
                      scenicName: "新建停车场",
                      userName: "admin"
                    },
                    {
                      code: "001007",
                      id: "127",
                      ind: "0",
                      indexCode: "001107,001103,001109,001102",
                      ip: "221.226.142.210",
                      password: "Hik12345",
                      port: "8099",
                      prefix: "/yzs",
                      scenicId: "10003",
                      scenicName: "游子山",
                      userName: "admin"
                    }
                  ],
                  id: "10005",
                  label: "公安安防监控",
                  state: true,
                  mapGaode: {
                    mapImageLayer: null,
                    center: "118.869265,31.31952",
                    zoom: "18",
                    id: "f5c2d7b0-11e3-ff39-bb64-e85ddf7c0f4d"
                  },
                  sublabel: null
                };

                let navData = response.desc.map(item => {
                  if (item.id == "10005") {
                    item.gchColumns = guangdian.gchColumns;
                    item.scenicName = guangdian.scenicName;
                    item.routerName = guangdian.routerName;
                    item.hkConfigs = guangdian.hkConfigs;
                    item.mapGaode = guangdian.mapGaode;
                  }
                  return item;
                });
                console.log("res", response.desc, navData);
                this.$store.commit("setPlatforms", navData);
                this.$router.push({
                  path: "/index"
                });
              }, 1000);
            })
            .catch(err => {
              this.loadingtext = `登录失败! ${err.msg}`;
              setTimeout(() => {
                this.loading = false;
              }, 1500);
            });
        } else {
          this.$axios({
            url: "/navigate/loadNavigate",
            method: "POST",
            data: {
              userName: this.userName,
              password: this.passWord
            }
          })
            .then(response => {
              this.loadingtext = "登录成功！";
              if (this.rememberAccount) {
                this.$q.cookies.set(
                  "accountInfo",
                  JSON.stringify({
                    userName: this.userName,
                    passWord: this.passWord
                  }),
                  {
                    expires: 10
                  }
                );
              } else {
                if (this.$q.cookies.has("accountInfo")) {
                  this.$q.cookies.remove("accountInfo");
                }
              }
              setTimeout(() => {
                this.loading = false;
                this.$store.commit("setToken", 200);
                this.$store.commit("setPlatforms", response.desc);
                this.$router.push({
                  path: "/Admin"
                });
              }, 1000);
            })
            .catch(err => {
              this.loadingtext = `登录失败! ${err.msg}`;
              setTimeout(() => {
                this.loading = false;
              }, 1500);
            });
        }
      }
    }
  }
};
</script>
<style lang='stylus'>
@import '~variables';

.login-page {
  // background-image: url('../statics/images/login_bg.jpg');
  // background: #84fab0;
  // background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100vh;
  color: white;
  position: relative;

  position relative .login-content {
    padding: 0 1rem 0.55rem;
    width: 6rem;
  }

  .login-box {
    padding: 0.5rem 1rem;
    font-size: 0.16rem;
    background-color: rgba(0, 0, 0, 0.41);
    border: 1px solid rgba(255, 255, 255, 0.3);
    z-index: 12;

    .q-if-label {
      color: white;
      font-size: 0.18rem;
    }

    .q-if-control {
      color: white;
      font-size: 0.26rem;
    }

    .q-inner-loading {
      z-index: 130;
      background: rgba(0, 0, 0, 0.64);
    }

    input {
      font-size: 0.2rem;
      height: 0.28rem;
    }
  }

  .loadingtext {
    color: $cyan-12;
  }

  #loginCanvas {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .login-btn {
    margin: 0.5rem 0 0;
    letter-spacing: 20px;
  }

  #slider {
    width: 100%;
    height: 100%;
    background-size: cover;
  }

  .nivoSlider {
    // background: url("../images/loading.gif") no-repeat 50% 50% rgb(255, 255, 255);
    // width:100%;
    // height:100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    overflow: hidden;
  }

  .nivoSlider img {
    left: 0px;
    top: 0px;
    display: none;
    position: absolute;
    height: 100px;
  }

  .nivoSlider a {
    border: 0px currentColor;
    display: block;
  }

  .nivo-controlNav {
    left: 384px;
    width: 193px;
    height: 38px;
    bottom: -14px;
    padding-top: 14px;
    padding-left: 50px;
    position: absolute;
    z-index: 9;
    // background-image: url("../images/bullets-bg.png");
    background-repeat: no-repeat;
  }

  .nivo-controlNav a {
    // background: url("../images/bullets.png") no-repeat;
    border: 0px currentColor;
    width: 23px;
    height: 17px;
    text-indent: -9999px;
    margin-right: 3px;
    float: left;
    display: block;
  }

  .nivo-controlNav a.active {
    background-position: 0px -17px;
  }

  .nivo-directionNav a {
    // background: url("../images/arrows.png") no-repeat;
    border: 0px currentColor;
    width: 65px;
    height: 65px;
    text-indent: -9999px;
    display: block;
  }

  a.nivo-nextNav {
    background-position: -65px 0px;
    top: 151px;
    right: 30px;
  }

  a.nivo-prevNav {
    left: 30px;
    top: 151px;
  }

  a.nivo-nextNav:hover {
    background-position: -65px -65px;
    top: 151px;
    right: 30px;
  }

  a.nivo-prevNav:hover {
    background-position: 0px -65px;
    left: 30px;
    top: 151px;
  }

  .nivo-caption {
    font-family: Helvetica, Arial, sans-serif;
  }

  .nivo-caption a {
    color: rgb(255, 255, 255);
    border-bottom-color: rgb(255, 255, 255);
    border-bottom-width: 1px;
    border-bottom-style: dotted;
  }

  .nivo-caption a:hover {
    color: rgb(255, 255, 255);
  }

  /* nivoSlider */
  .nivoSlider {
    position: relative;
  }

  .nivoSlider img {
    left: 0px;
    top: 0px;
    position: absolute;
  }

  .nivoSlider a.nivo-imageLink {
    margin: 0px;
    padding: 0px;
    border: 0px currentColor;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    display: none;
    position: absolute;
    z-index: 6;
  }

  .nivoSlider {
    position: relative;
  }

  .nivoSlider img {
    left: 0px;
    top: 0px;
    position: absolute;
  }

  .nivoSlider a.nivo-imageLink {
    margin: 0px;
    padding: 0px;
    border: 0px currentColor;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    display: none;
    position: absolute;
    z-index: 6;
  }

  .nivo-slice {
    height: 100%;
    display: block;
    position: absolute;
    z-index: 5;
  }

  .nivo-box {
    display: block;
    position: absolute;
    z-index: 5;
  }

  .nivo-caption {
    background: rgb(0, 0, 0);
    left: 0px;
    width: 30%;
    bottom: 0px;
    color: rgb(255, 255, 255);
    display: none;
    position: absolute;
    z-index: 8;
    opacity: 0.8;
  }

  .nivo-caption p {
    margin: 0px;
    display: none;
  }

  .nivo-caption a {
    display: inline !important;
  }

  .nivo-html-caption {
    display: none;
  }

  .nivo-directionNav a {
    top: 45%;
    position: absolute;
    z-index: 9;
    cursor: pointer;
  }

  .nivo-prevNav {
    left: 0px;
  }

  .nivo-nextNav {
    right: 0px;
  }

  .nivo-controlNav a {
    position: relative;
    z-index: 9;
    cursor: pointer;
  }

  .nivo-controlNav a.active {
    font-weight: bold;
  }
}
</style>
