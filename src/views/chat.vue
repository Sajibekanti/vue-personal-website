<template>
    <div class="_full_inner _scroll _effect component-chat" :class="{'_effect--30':decline}">
        <!-- <search-bar></search-bar> -->
        <mt-search
          cancel-text="取消"
          placeholder="搜索"
          @keyup="baiduSearch(value)" class="searchText">
        </mt-search>
        <div class="searchContent">
            
        </div>
        <div class="dataInfo">2017-01-10</div>
        <ul class="wechat-list">
            <li class="item _line-fine" v-for="item in wechat_list" transition="chat-item">
                <div class="info" :class="{
                    'current':currentIndex==$index
                    }" @touchstart="info_touchstart($index)" v-touch:tap="info_tap($index)" v-touch:swipeleft="info_swipeleft($index)" v-touch-options:swipe="{ direction: 'horizontal' }">
                    <div class="ico-box">
                       <!--  <i :class="item.chatConfigModel | f_news 'nclass'" v-text="item.chatBaseModel | f_news 'ntext'" v-show="item.chatBaseModel | f_news 'nshow'"></i> -->
                        <div class="ico">
                            <img :src="item.base.iconSrc" alt="pic">
                        </div>
                    </div>
                    <div class="desc">
                        <div class="desc-time" v-text="item.chatBaseModel.endTimeStr | fmtDate 'hh:ss'"></div>
                        <div class="desc-title" v-text="item.base.name"></div>
                        <div class="desc-message">
                            <!-- <div class="desc-mute iconfont icon-mute" :title="item.chatConfigModel.newsMute | json" v-show="item.chatConfigModel.newsMute"></div> -->
                            <span :title="item.base.type" v-show="item.base.type==='friends'" v-text="item.chatBaseModel.endChatAuth+':'"></span>
                            <span v-text="item.chatBaseModel.endChatTxt"></span>
                        </div>
                    </div>
                </div>
                <div class="handle">
                    <div class="handle-unread" v-touch:tap='increase_newsState($index,1)' v-show="item.chatBaseModel.newsUnreadCount==0">标为未读</div>
                    <div class="handle-unread" v-touch:tap='increase_newsState($index,0)' v-show="item.chatBaseModel.newsUnreadCount>0">标为已读</div>
                    <div class="handle-del" v-touch:tap="delete_item($index)">删除</div>
                </div>
            </li>
        </ul>

        <mt-swipe :show-indicators="false">
          <mt-swipe-item><img src="../assets/images/qrcode.png" alt=""></mt-swipe-item>
          <mt-swipe-item><img src="../assets/images/qrcode.png" alt=""></mt-swipe-item>
          <mt-swipe-item><img src="../assets/images/qrcode.png" alt=""></mt-swipe-item>
        </mt-swipe>

         <!-- <mt-swipe :auto="4000">
              <mt-swipe-item>1</mt-swipe-item>
              <mt-swipe-item>2</mt-swipe-item>
              <mt-swipe-item>3</mt-swipe-item>
            </mt-swipe> -->
        <!-- <ul class="wechat-list">
            <li class="item _line-fine" >1</li>
            <li class="item _line-fine" >2</li>
            <li class="item _line-fine" >3</li>
            <li class="item _line-fine" >4</li>
        </ul> -->
    </div>


    <!-- router -->
    <router-view transition="cover" keep-alive></router-view>
</template>
<script>
import {
    wechat_list
} from 'getters'
import {
    get_menu_wechat_list,
    set_menu_active,
    set_chat,
    set_chat_count,
    set_news_state,
    delete_news
} from '../vuex/actions'

import searchBar from 'components/search-bar.vue'

import { Search } from 'mint-ui';

export default {
    vuex: {
        getters: {
            wechat_list
        },
        actions: {
            get_menu_wechat_list,
            set_menu_active,
            set_chat,
            set_chat_count,
            set_news_state,
            delete_news
        }
    },
    route: {
        activate({
            from,
            to,
            next
        }) {

            this.set_menu_active(0)
            next()
        }
    },
    data() {
        return {
            decline: false,
            currentIndex: -1, //列表item处在左划状态
            isTouchSwipe: false, //验证是否处于左划状态,
            value: "",
            searchShow: false,
        }
    },
    events: {
        'route-pipe' (_decline) {
            this.decline = _decline
            this.$parent.$emit('route-pipe', _decline)
        }
    },
    methods: {
        baiduSearch(value) {
            var search = $('.searchText input').val();
            var _url = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd='+search+'&json=1&p=3&sid=20144_1467_19033_20515_18240_17949_20388_20456_18133_17001_15202_11615&req=2&csor=2&pwd=s&cb=jQuery110207612423721154653_1467355506619&_=1467355506623';
            this.$http({
                method: "GET",
                dataType:'jsonp',
                async:true,
                jsonp: "callbackparam",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback:'jQuery110207612423721154653_1467355506619',
                url:_url,
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            }).then((response) => {
                debugger
            }).catch(function(response){
                debugger
            });
        },
        info_touchstart(_index) {
            this.currentIndex = -1
        },
        info_tap(_index) {
            var index = _index;
            if (index >= 0 && !this.isTouchSwipe) {
                this.set_chat(this.wechat_list[index])
                this.$router.go({
                    path: "/chat/dialogue"
                })
            }
            this.isTouchSwipe = false
        },
        info_swipeleft(_index) {
            event.stopPropagation()
            if (!this.isTouchSwipe) {
                this.isTouchSwipe = true
                this.currentIndex = _index
            } else {
                this.isTouchSwipe = false
            }
        },
        computed_unRead_count() {
            //计算未读数量
            let sum = 0;
            console.log(this.wechat_list)
            this.wechat_list.forEach(({
                chatBaseModel,
                chatConfigModel
            }, index) => {
                if (!chatConfigModel.newsMute) {
                    let count = chatBaseModel.newsUnreadCount
                    sum += count
                }
            })
            this.set_chat_count(sum)
        },
        increase_newsState(index, val) {
            this.isTouchSwipe = false;
            //改变已读未读状态并回调计算未读总和
            this.set_news_state(index, val, () => {
                this.currentIndex = -1
                this.computed_unRead_count()
            })
        },
        delete_item(index) {
            this.delete_news(index, () => {
                this.currentIndex = -1;
                this.computed_unRead_count()
            })

        }
    },
    filters: {
        f_news(obj, attr) {
            var obj = obj || {}
            let newsClass = obj.newsMute ? '_news-dot' : '_news-count'
            let newsText = !obj.newsMute ? obj.newsUnreadCount : ''
            let newsShow = (obj.newsUnreadCount > 0)
            let o = {
                nclass: newsClass,
                ntext: newsText,
                nshow: newsShow
            }
            return o[attr]
        }
    },
    components: {
        searchBar,
        Search
    },
    created() {
        this.get_menu_wechat_list(() => {
            this.computed_unRead_count()
        });
        
    }
}
</script>
<style scoped>
.dataInfo {
    background: #eee;
    line-height: 2rem;
    height: 2rem;
    padding-left: 0.5rem;
    color: #999;
}
.swipe {
    height: 10rem !important;
    margin: 30px;
}
.swipe img{
   width: 100%;
}
.mint-search {
    height: 2.75rem !important;
}
.searchContent {
    display: none;
}
</style>
