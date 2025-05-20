<template>
  <div class="other-login" id="other-login">
    <BaseHeader mode="light" backMode="dark" backImg="back">
      <template v-slot:right>
        <span class="f14" @click="$router.push('/login/help')">帮助与设置</span>
      </template>
    </BaseHeader>
    <div class="content">
      <div class="desc">
        <div class="title">登陆后，体验完整功能</div>
        <div class="sub-title">未注册的邮箱验证通过后将自动注册</div>
      </div>

      <LoginInput autofocus type="email" v-model="email" placeholder="请输入邮箱号" />
      <div class="notice" v-if="notice">
        {{ notice }}
      </div>

      <div class="protocol" :class="showAnim ? 'anim-bounce' : ''">
        <Tooltip style="top: -185%; left: -10rem" v-model="showTooltip" />
        <div class="left">
          <Check v-model="isAgree" />
        </div>
        <div class="right">
          已阅读并同意
          <span
            class="link"
            @click="$router.push('/service-protocol', { type: '“抖音”用户服务协议' })"
            >用户协议</span
          >
          和
          <span class="link" @click="$router.push('/service-protocol', { type: '“抖音”隐私政策' })">
            隐私政策
          </span>
        </div>
      </div>

      <dy-button
        type="primary"
        :loading="loading"
        :active="false"
        :disabled="email.length < 2"
        @click="getCode"
      >
        <!--        获取短信验证码-->
        获取邮箱验证码
      </dy-button>

      <div class="options">
        <span class="link" @click="$router.push('/login/password')">密码登录</span>
        <span class="link" @click="emailLogin">其他方式登录</span>
      </div>

      <from-bottom-dialog
        page-id="other-login"
        v-model="isOtherLogin"
        :show-heng-gang="false"
        height="270rem"
        mode="white"
      >
        <div class="block-dialog">
          <div class="item" @click="_no">
            <img src="../../assets/img/icon/login/toutiao-round.png" alt="" />
            <span>今日头条登录</span>
          </div>
          <div class="item" @click="_no">
            <img src="../../assets/img/icon/login/qq.webp" alt="" />
            <span>QQ登录</span>
          </div>
          <div class="item" @click="_no">
            <img src="../../assets/img/icon/login/wechat.webp" alt="" />
            <span>微信登录</span>
          </div>
          <div class="item" @click="_no">
            <img src="../../assets/img/icon/login/weibo.webp" alt="" />
            <span>微博登录</span>
          </div>
          <div class="space"></div>
          <div class="item" @click="isOtherLogin = false">取消</div>
        </div>
      </from-bottom-dialog>
    </div>
  </div>
</template>
<script>
import Check from '../../components/Check'
import Tooltip from './components/Tooltip'
import LoginInput from './components/LoginInput'
import Base from './Base.js'
import FromBottomDialog from '../../components/dialog/FromBottomDialog'
import { _no } from '@/utils'

export default {
  name: 'EmailLogin',
  extends: Base,
  components: {
    Check,
    Tooltip,
    LoginInput,
    FromBottomDialog
  },
  data() {
    return {
      email: '',
      notice: ''
    }
  },
  computed: {},
  created() {},
  methods: {
    _no,
    async getCode() {
      if (!this.validateEmail(this.email)) {
        this.notice = '请输入正确的邮箱格式'
        return
      }
      if (!this.isAgree) {
        this.notice = '请先同意用户协议和隐私政策'
        return
      }

      try {
        this.loading = true
        // 先发送验证码请求
        const response = await fetch('http://localhost:22001/base/send-email-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '发送验证码失败')
        }

        const result = await response.json()
        if (result.code === 200) {
          // 发送成功后再跳转
          this.$router.push({
            path: '/login/email-verification-code',
            query: { email: this.email }
          })
        } else {
          throw new Error(result.message || '发送验证码失败')
        }
      } catch (error) {
        console.error('发送验证码失败:', error)
        this.notice = error.message || '发送验证码失败，请重试'
      } finally {
        this.loading = false
      }
    },
    async emailLogin() {
      let res = await this.check()
      if (res) {
        this.isOtherLogin = true
      }
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
  }
}
</script>

<style scoped lang="less">
@import '../../assets/less/index';
@import 'Base.less';

.other-login {
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
        font-size: 20rem;
      }

      .email-number {
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

    .options {
      position: relative;
      font-size: 14rem;
      display: flex;
    }

    .block-dialog {
      color: black;

      .item {
        height: 50rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid gainsboro;

        img {
          height: 25rem;
          margin-right: 10rem;
        }

        &:nth-last-child(1) {
          border-top: none;
        }
      }

      .space {
        height: 10rem;
        background: whitesmoke;
      }
    }
  }
}
</style>
