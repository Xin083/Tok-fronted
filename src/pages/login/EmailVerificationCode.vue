<template>
  <div class="VerificationCode">
    <BaseHeader mode="light" backMode="dark" backImg="back">
      <template v-slot:right>
        <span class="f14" @click="$router.push('/login/help')">帮助与设置</span>
      </template>
    </BaseHeader>
    <div class="content">
      <div class="desc">
        <div class="title">请输入验证码</div>
        <!--        <div class="sub-title">验证码已通过短信发送到+86 xxxxxxxxxx</div>-->
        <div class="sub-title">验证码已发送至：{{ maskedEmail }}</div>
      </div>

      <LoginInput
        autofocus
        type="code"
        v-model="data.code"
        placeholder="请输入验证码"
        :is-send-verification-code="data.isSendVerificationCode"
        @send="sendCode"
      />
      <div class="options">
        <span class="countdown-text">{{ data.countdownText }}</span>
      </div>

      <dy-button
        type="primary"
        :loading="data.loading"
        :active="false"
        :disabled="data.code.length !== 6"
        @click="login"
      >
        {{ data.loading ? '登录中' : '登录' }}
      </dy-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginInput from './components/LoginInput.vue'
import { onMounted, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineOptions({
  name: 'EmailVerificationCode'
})

const router = useRouter()
const route = useRoute()

// 从路由参数获取邮箱
const email = computed(() => (route.query.email as string) || '')
const maskedEmail = computed(() => {
  if (!email.value) return ''
  const [name, domain] = email.value.split('@')
  return `${name.slice(0, 3)}***@${domain}`
})

const data = reactive({
  loading: false,
  code: '',
  isSendVerificationCode: true,
  countdownText: '重新发送'
})

async function sendCode() {
  try {
    data.loading = true
    // 发起发送验证码请求
    const response = await fetch('http://localhost:22001/base/email-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '发送验证码失败')
    }

    const result = await response.json()
    if (result.code === 200) {
      data.isSendVerificationCode = false
      startCountdown()
    } else {
      throw new Error(result.message || '发送验证码失败')
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    alert(error.message || '发送验证码失败，请重试')
  } finally {
    data.loading = false
  }
}

async function login() {
  if (data.code.length !== 6) {
    alert('请输入6位验证码')
    return
  }

  try {
    data.loading = true
    // 发起邮箱验证码登录请求
    const response = await fetch('http://localhost:22001/base/email-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        code: data.code // 注意：后端接口参数名是 code 而不是 verification_code
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '验证码错误或已过期')
    }

    const result = await response.json()
    if (result.code === 200) {
      // 登录成功，存储token
      localStorage.setItem('token', result.data.token)
      // 存储用户信息
      localStorage.setItem('userInfo', JSON.stringify(result.data.user_info))
      // 跳转到首页
      router.push('/home')
    } else {
      throw new Error(result.message || '登录失败')
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert(error.message || '登录失败，请重试')
  } finally {
    data.loading = false
  }
}

function startCountdown() {
  let countdown = 60
  const timer = setInterval(() => {
    if (countdown > 0) {
      data.countdownText = `${countdown}秒后重新发送`
      countdown--
    } else {
      clearInterval(timer)
      data.isSendVerificationCode = true
      data.countdownText = '重新发送'
    }
  }, 1000)
}

onMounted(() => {
  if (!email.value) {
    router.push('/login/email')
  }
})
</script>

<style scoped lang="less">
@import '../../assets/less/index';
@import 'Base.less';

.VerificationCode {
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
      margin-top: 20rem;
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
      margin-top: 10rem;
      text-align: center;
      color: var(--second-text-color);

      .countdown-text {
        font-size: 12rem;
      }
    }
  }
}
</style>
