<template>
  <div class="login">
    <BaseHeader mode="light" backMode="dark" backImg="close" @click="nav('/home')">
      <template v-slot:right>
        <span class="f14" @click="nav('/login/help')">帮助与设置</span>
      </template>
    </BaseHeader>

    <Loading v-if="data.loading.getPhone" />

    <div v-else class="content">
      <div class="desc">
        <h2>登陆后，体验完整功能</h2>
        <!--        <div class="sub-title">未注册的手机号验证通过后将自动注册</div>-->
        <div class="sub-title">未注册的邮箱验证通过后将自动注册</div>
        <div class="sub-title">仅支持邮箱验证码登陆注册</div>
      </div>

      <dy-button
        type="primary"
        :loading="data.loading.login"
        :active="false"
        :loadingWithText="true"
        @click="login"
      >
        {{ data.loading.login ? '登录中' : '一键登录' }}
      </dy-button>

      <!--      <dy-button :active="false" type="white" @click="nav('/register')">手机号码注册</dy-button>-->

      <dy-button :active="false" type="white" @click="handleEmailLoginClick">
        邮箱验证码登录
        <!--        其他手机号码登录-->
      </dy-button>

      <div class="protocol" :class="data.showAnim ? 'anim-bounce' : ''">
        <Tooltip style="top: -100%; left: -10rem" v-model="data.showTooltip" />
        <div class="left">
          <Check v-model="data.isAgree" />
        </div>
        <div class="right">
          我已阅读并同意
          <span class="link" @click="nav('/service-protocol', { type: '“抖音”用户服务协议' })"
            >用户协议</span
          >
          和
          <span class="link" @click="nav('/service-protocol', { type: '“抖音”隐私政策' })"
            >隐私政策</span
          >
          <div>
            以及
            <span class="link" @click="nav('/service-protocol', { type: '认证服务协议' })"
              >《认证服务条款》</span
            >
          </div>
        </div>
      </div>

      <div class="other-login">
        <transition name="fade">
          <div v-if="data.isOtherLogin && data.isAgree" class="icons">
            <img @click="_no" src="../../assets/img/icon/login/toutiao-round.png" alt="" />
            <img @click="_no" src="../../assets/img/icon/login/qq-round.webp" alt="" />
            <img @click="_no" src="../../assets/img/icon/login/wechat-round.png" alt="" />
            <img @click="_no" src="../../assets/img/icon/login/weibo-round.webp" alt="" />
          </div>
        </transition>
      </div>

      <transition name="fade">
        <span v-if="!data.isOtherLogin" class="other-login-text link" @click="showEmailLogin"
          >其他方式登录</span
        >
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import Check from '../../components/Check.vue'
import Tooltip from './components/Tooltip.vue'
import Loading from '../../components/Loading.vue'
import { onMounted, reactive } from 'vue'
import { useNav } from '@/utils/hooks/useNav'
import { _no, _sleep } from '@/utils'

defineOptions({
  name: 'login'
})

const nav = useNav()
const data = reactive({
  isAgree: false,
  isOtherLogin: false,
  showAnim: false,
  showTooltip: false,
  loading: {
    login: false,
    getPhone: false
  }
})

onMounted(() => {
  getPhone()
})

async function getPhone() {
  data.loading.getPhone = true
  await _sleep(1000)
  data.loading.getPhone = false
}

function showProtocolTip() {
  if (!data.showAnim && !data.showTooltip) {
    data.showAnim = true
    setTimeout(() => {
      data.showAnim = false
      data.showTooltip = true
    }, 500)
    setTimeout(() => {
      data.showTooltip = false
    }, 1000)
  }
}

function login() {
  if (data.isAgree) {
    data.loading.login = true
  } else {
    showProtocolTip()
  }
}

function showEmailLogin() {
  if (data.isAgree) {
    data.isOtherLogin = true
  } else {
    showProtocolTip()
  }
}

function handleEmailLoginClick() {
  if (data.isAgree) {
    nav('/login/email')
  } else {
    showProtocolTip()
  }
}
</script>

<style scoped lang="less">
@import '../../assets/less/index';

.login {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: auto;
  color: black;
  font-size: 14rem;
  background: white;

  .content {
    padding: 60rem 30rem;

    .desc {
      margin-bottom: 60rem;
      margin-top: 120rem;
      display: flex;
      align-items: center;
      flex-direction: column;

      .title {
        margin-bottom: 20rem;
      }

      .phone-number {
        letter-spacing: 3rem;
        font-size: 30rem;
        margin-bottom: 10rem;
      }

      .sub-title {
        font-size: 12rem;
        color: var(--second-text-color);
      }
    }

    .button {
      width: 100%;
      margin-bottom: 5rem;
    }

    .protocol {
      position: relative;
      color: gray;
      margin-top: 20rem;
      font-size: 12rem;
      display: flex;

      .left {
        padding-top: 1rem;
        margin-right: 5rem;
      }
    }

    .other-login {
      position: absolute;
      bottom: 40rem;
      font-size: 12rem;
      display: flex;
      justify-content: center;
      width: calc(100vw - 60rem);
      transform: translateX(-50%);
      left: 50%;

      .icons {
        img {
          width: 40rem;
          margin-right: 15rem;

          &:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }
    }

    .other-login-text {
      position: absolute;
      bottom: 55rem;
      font-size: 12rem;
      transform: translateX(-50%);
      left: 50%;
    }
  }
}
</style>
