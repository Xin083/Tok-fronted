<template>
  <from-bottom-dialog
    :page-id="pageId"
    :modelValue="modelValue"
    @update:modelValue="(e) => $emit('update:modelValue', e)"
    @cancel="cancel"
    :show-heng-gang="false"
    maskMode="light"
    :height="height"
    tag="comment"
    mode="white"
  >
    <template v-slot:header>
      <div class="title">
        <dy-back mode="dark" img="close" direction="right" style="opacity: 0" />
        <div class="num">{{ _formatNumber(comments.length) }}条评论</div>
        <div class="right">
          <Icon icon="prime:arrow-up-right-and-arrow-down-left-from-center" @click.stop="_no" />
          <Icon icon="ic:round-close" v-click="cancel" />
        </div>
      </div>
    </template>
    <div class="comment">
      <div class="wrapper" v-if="comments.length">
        <div class="items">
          <div class="item" :key="i" v-for="(item, i) in comments">
            <!--            v-longpress="(e) => showOptions(item)"-->
            <div class="main">
              <div class="content">
                <img :src="_checkImgUrl(item.avatar)" alt="" class="head-image" />
                <div class="comment-container">
                  <div class="name">{{ item.nickname }}</div>
                  <div class="detail" :class="item.user_buried && 'gray'">
                    {{ item.user_buried ? '该评论已折叠' : item.content }}
                  </div>
                  <div class="time-wrapper">
                    <div class="left">
                      <div class="time">
                        {{ _time(item.create_time)
                        }}{{ item.ip_location && ` · ${item.ip_location}` }}
                      </div>
                      <div class="reply-text">回复</div>
                    </div>
                    <div class="right d-flex" style="gap: 10rem">
                      <div class="love" :class="item.user_digged && 'loved'" @click="loved(item)">
                        <Icon
                          icon="icon-park-solid:like"
                          v-show="item.user_digged"
                          class="love-image"
                        />
                        <Icon
                          icon="icon-park-outline:like"
                          v-show="!item.user_digged"
                          class="love-image"
                        />
                        <span v-if="item.digg_count">{{ _formatNumber(item.digg_count) }}</span>
                      </div>
                      <div class="love" @click="item.user_buried = !item.user_buried">
                        <Icon
                          v-if="item.user_buried"
                          icon="icon-park-solid:dislike-two"
                          class="love-image"
                        />
                        <Icon v-else icon="icon-park-outline:dislike" class="love-image" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="replies" v-if="Number(item.sub_comment_count)">
              <template v-if="item.showChildren">
                <div class="reply" :key="i" v-for="(child, i) in item.children">
                  <!--                 v-longpress="e => showOptions(child)"-->
                  <div class="content">
                    <img :src="_checkImgUrl(child.avatar)" alt="" class="head-image" />
                    <div class="comment-container">
                      <div class="name">
                        {{ child.nickname }}
                        <div class="reply-user" v-if="child.replay"></div>
                        {{ child.replay }}
                      </div>
                      <div class="detail">{{ child.content }}</div>
                      <div class="time-wrapper">
                        <div class="left">
                          <div class="time">
                            {{ _time(child.create_time)
                            }}{{ child.ip_location && ` · ${item.ip_location}` }}
                          </div>
                          <div class="reply-text">回复</div>
                        </div>
                        <div
                          class="love"
                          :class="child.user_digged && 'loved'"
                          @click="loved(item)"
                        >
                          <Icon
                            icon="icon-park-solid:like"
                            v-show="child.user_digged"
                            class="love-image"
                          />
                          <Icon
                            icon="icon-park-outline:like"
                            v-show="!child.user_digged"
                            class="love-image"
                          />
                          <span>{{ _formatNumber(child.digg_count) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <Loading
                v-if="loadChildren && loadChildrenItemCId === item.comment_id"
                :type="'small'"
                :is-full-screen="false"
              />
              <div class="more" v-else @click="handShowChildren(item)">
                <div class="gang"></div>
                <span
                  >展开{{ item.showChildren ? '更多' : `${item.sub_comment_count}条` }}回复</span
                >
                <Icon icon="ep:arrow-down-bold" />
              </div>
            </div>
          </div>
        </div>
        <no-more />
      </div>
      <Loading v-else style="position: absolute" />
      <transition name="fade">
        <BaseMask v-if="isCall" mode="lightgray" @click="isCall = false" />
      </transition>
      <div class="input-toolbar">
        <transition name="fade">
          <div class="call-friend" v-if="isCall">
            <div class="friend" :key="i" v-for="(item, i) in friends.all" @click="toggleCall(item)">
              <img
                :style="item.select ? 'opacity: .5;' : ''"
                class="avatar"
                :src="_checkImgUrl(item.avatar_small['url_list'][0])"
                alt=""
              />
              <span>{{ item.nickname }}</span>
              <img
                v-if="item.select"
                class="checked"
                src="../assets/img/icon/components/check/check-red-share.png"
              />
            </div>
          </div>
        </transition>

        <div class="toolbar">
          <div class="input-wrapper">
            <AutoInput v-model="comment" placeholder="善语结善缘，恶言伤人心"></AutoInput>
            <div class="right">
              <img src="../assets/img/icon/message/call.png" @click="isCall = !isCall" />
              <img src="../assets/img/icon/message/emoji-black.png" @click="_no" />
            </div>
          </div>
          <img v-if="comment" src="../assets/img/icon/message/up.png" @click="send(item)" />
        </div>
      </div>
      <ConfirmDialog title="私信给" ok-text="发送" v-model:visible="showPrivateChat">
        <Search mode="light" v-model="test" :isShowSearchIcon="false" />
      </ConfirmDialog>
    </div>
  </from-bottom-dialog>
</template>

<script lang="ts">
import AutoInput from './AutoInput.vue'
import ConfirmDialog from './dialog/ConfirmDialog.vue'
import { mapState } from 'pinia'
import FromBottomDialog from './dialog/FromBottomDialog.vue'
import Loading from './Loading.vue'
import Search from './Search.vue'
import {
  _checkImgUrl,
  _formatNumber,
  _no,
  _showSelectDialog,
  _sleep,
  _time,
  sampleSize
} from '@/utils'
import { useBaseStore } from '@/store/pinia'
import { videoComment, videoComments } from '@/api/videos'

export default {
  name: 'Comment',
  components: {
    AutoInput,
    ConfirmDialog,
    FromBottomDialog,
    Loading,
    Search
  },
  props: {
    modelValue: {
      type: Boolean,
      default() {
        return false
      }
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    videoId: {
      type: String,
      default: null
    },
    pageId: {
      type: String,
      default: 'home-index'
    },
    height: {
      type: String,
      default: 'calc(var(--vh, 1vh) * 70)'
    }
  },
  computed: {
    ...mapState(useBaseStore, ['friends'])
  },
  watch: {
    modelValue(newVale) {
      if (newVale) {
        this.getData()
      } else {
        this.comments = []
      }
    }
  },
  data() {
    return {
      comment: '',
      test: '',
      comments: [],
      options: [
        { id: 1, name: '私信回复' },
        { id: 2, name: '复制' },
        { id: 3, name: '搜一搜' },
        { id: 4, name: '举报' }
      ],
      selectRow: {},
      showPrivateChat: false,
      isInput: false,
      isCall: false,
      loadChildren: false,
      loadChildrenItemCId: -1
    }
  },
  mounted() {},
  methods: {
    _no,
    _time,
    _formatNumber,
    _checkImgUrl,
    // 评论发送成功后调用此方法
    resetSelectStatus() {
      this.friends.all.forEach((item) => {
        item.select = false // 重置选中状态
      })
    },
    async handShowChildren(item) {
      this.loadChildrenItemCId = item.comment_id
      this.loadChildren = true
      await _sleep(500)
      this.loadChildren = false
      if (item.showChildren) {
        item.children = item.children.concat(sampleSize(this.comments, 10))
      } else {
        item.children = sampleSize(this.comments, 3)
        item.showChildren = true
      }
    },
    async send(item) {
      if (!this.comment.trim()) {
        return // 如果评论内容为空，直接返回
      }
      const baseStore = useBaseStore()
      const commentData = {
        ip_location: baseStore.userinfo.ip_location,
        aweme_id: this.videoId,
        content: this.comment,
        uid: String(baseStore.userinfo.uid),
        short_id: String(baseStore.userinfo.short_id),
        unique_id: baseStore.userinfo.unique_id,
        signature: baseStore.userinfo.signature,
        nickname: baseStore.userinfo.nickname,
        avatar: baseStore.userinfo.avatar_small['url_list'][0]
        // 其他必要的字段可以根据你的需求添加
      }

      try {
        const response = await videoComment({}, commentData)
        if (response.success) {
          console.log(this.$props)
          this.comments.unshift({
            id: response.data.id || '2', // Use the ID from the response if available
            avatar: baseStore.userinfo.avatar_small['url_list'][0],
            nickname: baseStore.userinfo.nickname,
            content: this.comment,
            ip_location: baseStore.userinfo.ip_location,
            loveNum: 27,
            isLoved: false,
            create_time: Date.now().toString(), // Use the current time
            children: []
          })
          setTimeout(() => {
            item.statistics.comment_count++
          }, 100)
          this.comment = '' // Clear the input after sending
          this.isCall = false
          this.resetSelectStatus()
        }
      } catch (error) {
        console.error('Error sending comment:', error)
      }
    },
    async getData() {
      let res: any = await videoComments({ aweme_id: this.videoId })
      console.log('comments:', res.data)
      if (res.success) {
        if (res.data.length > 0) {
          res.data.map((v) => {
            v.showChildren = false
            v.digg_count = Number(v.digg_count)
          })
        }
        this.comments = res.data
      }
    },
    cancel() {
      this.$emit('update:modelValue', false)
      this.$emit('close')
    },
    toggleCall(item) {
      item.select = !item.select
      let nickname = item.nickname
      if (this.comment.includes('@' + nickname)) {
        this.comment = this.comment.replace(`@${nickname} `, '')
      } else {
        this.comment += `@${nickname} `
      }
    },
    loved(row) {
      if (row.isLoved) {
        row.digg_count--
      } else {
        row.digg_count++
      }
      row.user_digged = !row.user_digged
    },
    showOptions(row) {
      _showSelectDialog(this.options, (e) => {
        if (e.id === 1) {
          this.selectRow = row
          this.showPrivateChat = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/less/index';

.title {
  box-sizing: border-box;
  width: 100%;
  height: 40rem;
  padding: 0 15rem;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10rem 10rem 0 0;

  .num {
    width: 100%;
    position: absolute;
    font-size: 12rem;
    font-weight: bold;
    text-align: center;
  }

  .right {
    display: flex;
    gap: 12rem;
    position: relative;
    z-index: 9;

    svg {
      color: #000;
      background: rgb(242, 242, 242);
      padding: 4rem;
      font-size: 16rem;
      border-radius: 50%;
    }
  }
}

.gray {
  color: var(--second-text-color);
}

.comment {
  color: #000;
  width: 100%;
  background: #fff;
  z-index: 5;

  .wrapper {
    width: 100%;
    position: relative;
    padding-bottom: 60rem;
  }

  .items {
    width: 100%;

    .item {
      width: 100%;
      margin-bottom: 15rem;

      .main {
        width: 100%;
        padding: 5rem 0;
        display: flex;

        &:active {
          background: #53535321;
        }

        .head-image {
          margin-left: 15rem;
          margin-right: 10rem;
          width: 37rem;
          height: 37rem;
          border-radius: 50%;
        }
      }

      .replies {
        padding-left: 55rem;

        .reply {
          padding: 5rem 0 5rem 5rem;
          display: flex;

          &:active {
            background: #53535321;
          }

          .head-image {
            margin-right: 10rem;
            width: 20rem;
            height: 20rem;
            border-radius: 50%;
          }
        }

        .more {
          font-size: 13rem;
          margin: 5rem;
          display: flex;
          align-items: center;
          color: gray;

          .gang {
            background: #d5d5d5;
            width: 20rem;
            margin-right: 10rem;
            height: 1px;
          }

          span {
            margin-right: 5rem;
          }

          svg {
            font-size: 10rem;
          }
        }
      }

      .content {
        width: 100%;
        display: flex;
        font-size: 14rem;

        .comment-container {
          flex: 1;
          margin-right: 20rem;

          .name {
            color: var(--second-text-color);
            margin-bottom: 5rem;
            display: flex;
            align-items: center;

            .reply-user {
              margin-left: 5rem;
              width: 0;
              height: 0;
              border: 5rem solid transparent;
              border-left: 6rem solid gray;
            }
          }

          .detail {
            margin-bottom: 5rem;
          }

          .time-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13rem;

            .left {
              display: flex;

              .time {
                color: #c4c3c3;
                margin-right: 10rem;
              }

              .reply-text {
                color: var(--second-text-color);
              }
            }

            .love {
              color: gray;
              display: flex;
              align-items: center;

              &.loved {
                color: rgb(231, 58, 87);
              }

              .love-image {
                font-size: 17rem;
                margin-right: 4rem;
              }

              span {
                word-break: keep-all;
              }
            }
          }
        }
      }
    }
  }

  @normal-bg-color: rgb(35, 38, 47);
  @chat-bg-color: rgb(105, 143, 244);

  .input-toolbar {
    border-radius: 10rem 10rem 0 0;
    background: white;
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 3;

    @space-width: 18rem;
    @icon-width: 48rem;

    .call-friend {
      padding-top: 30rem;
      overflow-x: scroll;
      display: flex;
      padding-right: @space-width;

      .friend {
        width: @icon-width;
        position: relative;
        margin-left: @space-width;
        margin-bottom: @space-width;
        font-size: 10rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatar {
          width: @icon-width;
          height: @icon-width;
          border-radius: 50%;
        }

        span {
          margin-top: 5rem;
          text-align: center;
          width: @icon-width;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .checked {
          position: absolute;
          top: @icon-width - 1.5;
          right: -2px;
          width: 20rem;
          height: 20rem;
          border-radius: 50%;
        }
      }
    }

    .toolbar {
      @icon-width: 25rem;
      display: flex;
      align-items: center;
      padding: 10rem 15rem;
      border-top: 1px solid #e2e1e1;

      .input-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 5rem 10rem;
        background: #eee;
        border-radius: 20rem;

        .right {
          display: flex;
          align-items: center;
        }

        .auto-input {
          width: calc(100% - 160rem);
        }
      }

      img {
        width: @icon-width;
        height: @icon-width;
        border-radius: 50%;
        margin-left: 15rem;
      }
    }
  }
}

.comment-enter-active,
.comment-leave-active {
  transition: all 0.15s ease;
}

.comment-enter-from,
.comment-leave-to {
  transform: translateY(60vh);
}
</style>
