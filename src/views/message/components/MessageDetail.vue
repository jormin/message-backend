<template>
  <div class="createPost-container">
    <el-form ref="message" :model="message" class="form-container">

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" label="标题:" prop="title">
              <MDinput v-model="message.title" :maxlength="80" name="name" required readonly/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="留言者:">
              <el-input :rows="1" v-model="message.sender" readonly/>
            </el-form-item>
          </el-col>

          <el-col :span="6" :offset="2">
            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="接收者:">
              <el-input :rows="1" v-model="message.receiver" readonly/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="IP:">
              <el-input :rows="1" v-model="message.ip" readonly/>
            </el-form-item>
          </el-col>

          <el-col :span="6" :offset="2">
            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="IP区域:">
              <el-input :rows="1" v-model="message.ip_address" readonly/>
            </el-form-item>
          </el-col>

          <el-col :span="6" :offset="2">
            <el-form-item style="margin-bottom: 40px;" label-width="80px" label="留言时间:">
              <el-input :rows="1" v-model="message.created_at" readonly/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="message.attachment">
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" label="图片:" prop="title">
              <img :src="message.attachment" class="image" style="max-width: 300px">
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" label="留言内容:" prop="title">
              <el-input :rows="5" v-model="message.content" type="textarea" readonly/>
            </el-form-item>
          </el-col>
        </el-row>

      </div>
    </el-form>

  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import { fetchMessage } from '@/api/message'
import { PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  status: 'draft',
  id: undefined,
  title: '',
  sender: '',
  receiver: '',
  attachment: '',
  content: '',
  ip: '',
  ip_address: '',
  created_at: '',
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  labelPosition: 'left',
  name: 'messageDetail',
  components: { MDinput, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      message: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
    }
  },
  computed: {
    contentShortLength() {
      return this.message.content_short.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.message = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      fetchMessage(id).then(response => {
        this.message = response.data.message

        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '查看留言'
      const route = Object.assign({}, this.$route, { title: `${title}-${this.message.id}` })
      this.$store.dispatch('updateVisitedView', route)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
