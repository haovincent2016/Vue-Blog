<template>
<div class="profile">
    <user-info :userid="getID"></user-info>
    <user-menu></user-menu>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import userInfo from '@/components/common/UserInfo'
import userMenu from '@/components/common/UserMenu'
export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters([
            'getID'
        ])
    },
    components: {
        userInfo,
        userMenu
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
</style>