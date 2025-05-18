<template>
  <div class="PasswordLogin">
    <BaseHeader mode="light" backMode="dark" backImg="back">
      <template v-slot:right>
        <span class="f14" @click="$router.push('/login/help')">帮助与设置</span>
      </template>
    </BaseHeader>
    <div class="content">
      <div class="desc">
        <h6>登陆后，体验完整功能</h6>
        <div class="sub-title">未注册的手机号验证通过后将自动注册</div>
      </div>

      <LoginInput autofocus type="phone" v-model="phone" placeholder="请输入手机号" />
      <LoginInput autofocus type="password" v-model="password" placeholder="请输入密码" />

      <div class="protocol" :class="showAnim ? 'anim-bounce' : ''">
        <Tooltip style="top: -185%; left: -10rem" v-model="showTooltip" />
        <div class="left">
          <Check v-model="isAgree" />
        </div>
        <div class="right">
          已阅读并同意
          <span class="link" @click="$router.push('/service-protocol', { type: '用户服务协议' })"
            >用户协议</span
          >
          和
          <span class="link" @click="$router.push('/service-protocol', { type: '隐私政策' })"
            >隐私政策</span
          >
        </div>
      </div>

      <div class="notice" v-if="notice">
        {{ notice }}
      </div>

      <dy-button
        type="primary"
        :loading="loading"
        :active="false"
        :disabled="disabled"
        @click="login"
      >
        {{ loading ? '登录中' : '登录' }}
      </dy-button>

      <div class="options">
        <span>
          忘记了？<span class="link" @click="$router.push('/login/retrieve-password')"
            >找回密码</span
          >
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import Check from '../../components/Check'
import LoginInput from './components/LoginInput'
import Tooltip from './components/Tooltip'
import Base from './Base'
import { login } from '@/api/base'
import { useBaseStore, useChatStore } from '@/store/pinia'

const baseStore = useBaseStore()
const chatStore = useChatStore()

export default {
  name: 'PasswordLogin',
  extends: Base,
  components: {
    Check,
    Tooltip,
    LoginInput
  },
  data() {
    return {
      phone: '',
      password: '',
      code: '',
      notice: '',
      passwordVisible: false
    }
  },
  computed: {
    disabled() {
      return !(this.phone && this.password)
    }
  },
  created() {},
  methods: {
    async login() {
      let isCheckPassed = await this.check() // 验证协议是否已勾选
      if (!isCheckPassed) return

      this.loading = true
      try {
        const res = await login(
          {},
          {
            phone: this.phone,
            password: this.password
            // 还可以补充其他字段
          }
        )
        console.log('resss:', res.data)
        if (res.data.isExist) {
          // 登录成功后的处理逻辑，如存储 Token、跳转页面等
          console.log('登录成功')
          // 调用初始化方法
          // await baseStore.init();
          baseStore.setToken(res.data.token)
          console.log('baseStore:', window.localStorage.getItem('token'))
          baseStore.login_id = res.data.uid
          // console.log("用户信息:", baseStore);
          await baseStore.init()
          await chatStore.init()
          this.$router.push('/home') // 跳转到主页面
        } else {
          this.notice = res.data.message || '登录失败'
        }
      } catch (error) {
        this.notice = '网络错误，请稍后再试'
      } finally {
        this.loading = false
      }
    },
    formatPhone() {
      let val = this.phone.replace(/\D/g, '').slice(0, 11)
      // 分段显示 198 7918 7083
      if (val.length > 3 && val.length <= 7) {
        val = val.replace(/(\d{3})(\d+)/, '$1 $2')
      } else if (val.length > 7) {
        val = val.replace(/(\d{3})(\d{4})(\d+)/, '$1 $2 $3')
      }
      this.phone = val
    }
  }
}
</script>

<style scoped lang="less">
@import '../../assets/less/index';
@import 'Base.less';

.PasswordLogin {
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
    padding: 85rem 35rem;

    .desc {
      text-align: right; // 居右
      font-size: 35rem; // 放大字体
      margin-top: 40rem; // 往下移动
      margin-bottom: 0rem; //  文本与数据框距离
      font-weight: bold; // 可选：加粗

      .title {
        margin-bottom: 20rem;
        font-size: 20rem;
      }

      .phone-number {
        letter-spacing: 3rem;
        font-size: 30rem;
        margin-bottom: 10rem;
      }

      .sub-title {
        font-size: 12rem;
        margin-top: -20rem;
        margin-bottom: 0rem;
        color: var(--second-text-color);
        font-weight: normal;
        position: relative;
        top: -20rem;
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

    dy-button,
    .button {
      width: 100%;
      margin-bottom: 5rem;
      margin-top: 30rem;
    }
  }
}
</style>
