<template>
<div class="main-top">
    <a class="avatar" href="">
        <img :src="user.avatar" alt="240">
    </a>

    <div class="title">
        <a class="name" href="">{{ user.name }}</a>
        <span class="desc">{{ user.description }}</span>
    </div>
    <div class="info">
        <ul>
            <li>
                <div class="meta-block">
                    <a href="">
                        <p>{{ followers }}</p>
                        Followers <!--<i class="fa fa-angle-right"></i>-->
                    </a>        
                </div>
            </li>
            <li>
                <div class="meta-block">
                    <a href="">
                        <p>{{ subscribed }}</p>
                        Subscribers <!--<i class="fa fa-angle-right"></i>-->
                    </a>        
                </div>
            </li>
            <li>
                <div class="meta-block">
                    <a href="">
                        <p>{{ tags }}</p>
                        Tags <!--<i class="fa fa-angle-right"></i>-->
                    </a>            
                </div>
            </li>
        </ul>
    </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getUser } from '@/helper/userHelper'
export default {
    mounted() {
        this.getUser()
    },
    data() {
        return {
            /*user*/
            user: {},
            followers: 0,
            subscribed: 0,
            tags: 0
        }
    },
    props: [
        'userid'
    ],
    computed: {
        ...mapGetters({
            userpic: 'getAvatar'
        })
    },
    methods: {
        async getUser() {
            try {
                const res = await getUser(this.userid)
                if(res.data.success) {
                    this.user = res.data.user
                    this.followers = res.data.fols
                    this.subscribed = res.data.subs
                    this.tags = res.data.tags
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: 'failed to retrieve user info',
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log('error occurs when getting user info')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.main-top {
    width: 435px;
    margin: 20px 0 0 0;
    padding: 15px;
    .avatar {
        position: relative;
        width: 80px;
        height: 80px;
        float: left;
        display: block;
        cursor: pointer;
        img {
            width: 80px;
            height: 80px;
            border: 1px solid #ddd;
            border-radius: 50%;
        }
    }
    .title {
        padding: 5px 0 0 100px;
        .name {
            display: inline-block;
            font-size: 21px;
            font-weight: 500;
        }
        .desc {
            display: inline-block;
            margin-left: 10px;
            font-size: 13px;
        }
    }
    .info {
        margin-top: 16px;
        padding-left: 100px;
        font-size: 14px;
    }
}
li {
    display: inline-block;
    text-align: center;
    .meta-block {
        color: #969696;
        font-size: 12px;
        margin: 0 7px 6px 0;
        padding: 0 12px 0 0;
        border-right: 1px solid #f0f0f0;
    }
    .btn-edit {
        background: #fff;
        border: 1px solid lightgrey;
        &:hover {
            background: #007fff;
            border-color: #007fff;
            color: #fff;
        }
    }
    .right-side {
        float: right;
        margin-left: 60px;
    }
}
p {
    padding-bottom: 3px;
    font-size: 15px;
    color: #333;
}

</style>