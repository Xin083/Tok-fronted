<template>
  <div
    class="input-number"
    :class="{
      'input-phone': type === 'phone',
      'input-password': type === 'password',
      'input-code': type === 'code'
    }"
  >
    <!-- 手机号输入框 -->
    <template v-if="type === 'phone'">
      <div class="left">
        <span>+86</span>
      </div>
      <div class="right flex1" style="position: relative">
        <input
          v-model="value"
          type="text"
          :placeholder="placeholder"
          @input="onInput"
          @focus="isTyping = true"
          @blur="delaySetTypingFalse"
          :autofocus="autofocus"
        />
        <img
          v-if="value && isTyping"
          src="../../../assets/img/icon/login/close-full-gray.png"
          alt=""
          class="clear-icon"
          @mousedown.prevent="value = ''"
        />
      </div>
    </template>

    <!-- 密码输入框 -->
    <template v-else-if="type === 'password'">
      <div class="left">
        <span @click="showPwd = !showPwd">
          <img
            v-if="showPwd"
            src="../../../assets/img/icon/login/密码显示.svg"
            alt="隐藏密码"
            class="eye-icon"
          />
          <img
            v-else
            src="../../../assets/img/icon/login/密码隐藏.svg"
            alt="显示密码"
            class="eye-icon"
          />
        </span>
      </div>
      <div class="right flex1" style="position: relative">
        <input
          v-model="value"
          :type="showPwd ? 'text' : 'password'"
          :placeholder="placeholder"
          @focus="isTyping = true"
          @blur="delaySetTypingFalse"
          :autofocus="autofocus"
        />
        <img
          v-if="value && isTyping"
          src="../../../assets/img/icon/login/close-full-gray.png"
          alt=""
          class="clear-icon"
          @mousedown.prevent="value = ''"
        />
      </div>
    </template>

    <!-- 验证码输入框 -->
    <template v-else-if="type === 'code'">
      <div class="right flex1" style="position: relative">
        <input
          v-model="value"
          type="text"
          :placeholder="placeholder"
          @focus="isTyping = true"
          @blur="delaySetTypingFalse"
          :autofocus="autofocus"
        />
        <img
          v-if="value && isTyping"
          src="../../../assets/img/icon/login/close-full-gray.png"
          alt=""
          class="clear-icon"
          @mousedown.prevent="value = ''"
        />
        <span class="countdown" :class="isSendVerificationCode && 'disabled'" @click="send">{{
          verificationCodeBtnText
        }}</span>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'LoginInput',
  props: {
    modelValue: {
      type: String,
      default() {
        return ''
      }
    },
    placeholder: {
      type: String,
      default() {
        return ''
      }
    },
    type: {
      type: String,
      default: 'phone'
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    isSendVerificationCode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isTyping: false,
      verificationCodeBtnText: 60,
      showPwd: false,
      showTooltip: false
    }
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(e) {
        this.$emit('update:modelValue', e)
      }
    }
  },
  watch: {
    isSendVerificationCode: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.verificationCodeBtnText = 60
          let ticker = setInterval(() => {
            if (this.verificationCodeBtnText > 0) {
              this.verificationCodeBtnText--
            } else {
              this.verificationCodeBtnText = '重新发送'
              this.$emit('update:isSendVerificationCode', false)
              clearInterval(ticker)
            }
          }, 1000)
        }
      }
    }
  },
  methods: {
    delaySetTypingFalse() {
      setTimeout(() => {
        this.isTyping = false
      })
    },
    send() {
      if (!this.isSendVerificationCode) {
        this.$emit('send')
      }
    },
    onInput() {
      // Implementation of onInput method
    }
  }
}
</script>
<style scoped lang="less">
@import '../../../assets/less/index';

.input-number {
  display: flex;
  align-items: center;
  background: #f6f6f6;
  border-radius: 12px;
  padding: 16rem 15rem;
  font-size: 14rem;
  margin-bottom: 15rem;

  .left {
    display: flex;
    align-items: center;
    margin-right: 10rem;
    padding-right: 10rem;
  }

  .right {
    flex: 1;
    display: flex;
    align-items: center;
  }

  input {
    width: 100%;
    border: none;
    background: transparent;
    font-size: 15rem;
    outline: none;
  }
}

.code-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  height: 100%;
}

.countdown {
  margin-left: 10px;
  color: #ff4d6a;
  cursor: pointer;
  min-width: 60px;
  text-align: right;
}

.countdown.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.input-number:focus-within {
  border: 1px solid #ff4d6a;
  box-shadow: 0 0 0 3px #ff4d6a22;
  background: whitesmoke;
}

.clear-icon {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  cursor: pointer;
  object-fit: contain;
  z-index: 2;
}

.eye-icon {
  width: 24px;
  height: 24px;
  display: block;
  cursor: pointer;
  object-fit: contain;
}

.input-code .clear-icon {
  right: 20px; /* 你可以根据实际效果调整这个值 */
}
</style>
