<template>
<div class="container">
    <img src="/static/404.png" />
    <div class="hint">
        <p>Sorry, page not found</p>
        <button class="btn btn-back" @click="goHome">Home</button>
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        goHome() {
            this.$router.replace({ name: 'home' })
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    margin-top: 20px;
    background: #fff;
    &:hover {
        box-shadow: 1px 1px 2px #eee;
    }
    img {
        width: 100%;
    }
    .hint {
        text-align: center;
        p {
            padding: 3rem;
            font-size: 2rem;
            font-weight: 400;
            color: #c1c1c1;
        }
        .btn-back {
            margin-bottom: 2rem;
            border-radius: 40px;
            border: 1px solid #00a1d6;
            color: #00a1d6;
            background: #fff;
            &:hover {
                color: #fff;
                background-color: #00a1d6;
            }
        }
    }
}
</style>