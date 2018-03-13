<template>
<div class="profile">
    <user-info :userid="getID"></user-info>
    <collections></collections>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import userInfo from '@/components/common/UserInfo'
import collections from '@/components/blog/Collections'

export default {
    computed: {
        ...mapGetters([
            'getID'
        ])
    },
    components: {
        userInfo,
        collections
    }
}
</script>
<style>
.profile {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 980px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
}
</style>