<template>
<div>
    <ul class="user-menu">
        <li v-for="menu in submenu" :key="menu.id">
            <router-link :to="{ path: menu.path }">
                <i class="fa" :class="menu.icon"></i> {{ menu.title }}
            </router-link>
        </li>
    </ul>
    <router-view></router-view>
</div>
</template>
<script>
export default {
    data() {
        return {
            submenu: [
                {
                    title: 'Articles',
                    path: '/dashboard/articles',
                    icon: 'fa-file-text'
                },
                /*{
                    title: 'Activities',
                    path: '/dashboard/activities',
                    icon: 'fa-bell'
                },*/
                {
                    title: 'Comments',
                    path: '/dashboard/comments',
                    icon: 'fa-comments'
                },
                {
                    title: 'Chat',
                    path: '/dashboard/chats',
                    icon: 'fa-whatsapp'
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
.router-link-active {
    border-bottom: 1px solid #646464;
}
.user-menu{
    font-size: 0;
    list-style: none;
    li {
        position: relative;
        display: inline-block;
        padding: 8px 0;
        &:hover {
            background: #f5f5f5;
        }
         a {
            padding: 13px 10px;
            font-size: 15px;
            font-weight: 700;
            color: #969696;
            line-height: 25px;
        }
    }
}

</style>