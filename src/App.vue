<template>
<div class="wrapper">
    <blog-header v-if="!getAdmin"></blog-header>
    <router-view></router-view>
    <transition name="modal-fade">
        <div v-if="getModal === true" class="overlay">
            <login-form></login-form>
        </div>
    </transition>
</div>
</template>

<script>
import blogHeader from '@/components/common/BlogHeader'
import loginForm from '@/components/user/Login'
import { mapGetters, mapActions } from 'vuex'
export default {
    mounted() {
        this.currentRoute = this.$route.path
    },
    data() {
        return {
            currentRoute: ''
        }
    },
    computed: {
        ...mapGetters([
            'getAdmin',
            'getModal'
        ])
    },
    watch: {
        '$route.path'(newVal, oldVal) {
            this.currentRoute = newVal
            if(newVal.indexOf('adminpanel') !== -1) {
                this.changeAdmin(true)
            } else {
                this.changeAdmin(false)
            }
        }
    },
    methods: {
        ...mapActions([
            'changeAdmin'
        ])
    },
    components: {
        blogHeader,
        loginForm
    }
}
</script>

<style lang="scss">
.dplayer-setting-box {
    width: 170px!important;
}
.dplayer-toggle > label {
    border: 1px solid #666!important;
}
.container {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
}
.overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100%; 
    height: 100%; 
    top: 0; 
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3); 
    z-index: 500; 
    cursor: pointer; 
}
.noti-style {
    border: none;
    .notification-content {
        font-size: 17px;
    }
    &.success {
        color: #333;
        border: 1px solid #68cd86;
        padding: 13px;
        text-align: center;
        width: 250px;
        box-shadow: 0 2px 4px rgba(0,0,0,.175);
        margin: 15px 15px 0 15px;
        background: #fff;
        opacity: 0.8;
    }
    &.warn {
        color: #333;
        border: 1px solid #ff9748;
        padding: 13px;
        text-align: center;
        width: 250px;
        box-shadow: 0 2px 4px rgba(0,0,0,.175);
        margin: 15px 15px 0 15px;
        background: #fff;
        opacity: 0.8;
    }
}

.modal-fade-enter-active, .modal-fade-leave-active {
	transition: opacity .5s;
}
.modal-fade-enter, .modal-fade-leave-active {
	opacity: 0;
}
</style>
