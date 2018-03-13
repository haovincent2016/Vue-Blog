<template>
<div class="profile">
    <user-info :userid="routeid"></user-info>
    <div v-if="!isPublic">
        <user-menu></user-menu>
    </div>
    <div v-else>
        <list class="list" :source="sourcePage"></list>
    </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import userInfo from '@/components/common/UserInfo'
import userMenu from '@/components/common/UserMenu'
import list from '@/components/blog/Articles'
export default {
    created() {
        this.routeid = this.$route.params.id
        if(this.$route.params.id != this.getID) {
            this.isPublic = true
        } else {
            this.isPublic = false
        }
    },
    data() {
        return {
            isPublic: null,
            routeid: '',
            sourcePage: 'userpage'
        }
    },
    watch: {
        '$route.params.id'(newVal, oldVal) {
            this.routeid = newVal
            if(newVal != this.getID) {
                this.isPublic = true
            } else {
                this.isPublic = false
            }
        }
    },
    computed: {
        ...mapGetters([
            'getID'
        ])
    },
    components: {
        userInfo,
        userMenu,
        list
    }
}
</script>
<style scoped>
.profile {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
}
.list {
    margin-top: 8px;
	padding: 20px 25px 48px;
}
</style>