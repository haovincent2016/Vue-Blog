<template>
<div class="topbar">
    <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/adminpanel' }">Home</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
            Menu<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" menu-align='start'>
            <el-dropdown-item command="admin">Admin Home</el-dropdown-item>
            <el-dropdown-item command="logout">logout</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import { logoutUser } from '../../helper/adminHelper'
export default {
    methods: {
        ...mapActions([
            'changeAdmin'
        ]),
        handleCommand(command) {
            if(command === 'logout') {
                this.$notify({
                    title: 'Success',
                    type: 'success',
                    message: 'admin logout successfully',
                    position: 'top-left'
                })
                localStorage.removeItem('admintoken')
                this.changeAdmin(false)
                this.$router.push({ name: 'login' })
            } else {
                this.$router.push({ path: '/zadminpanel' })
            } 
        }
    }
}
</script>

<style lang="scss" scoped>
.topbar {
    background-color: #EFF2F7;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
.el-dropdown-link {
    cursor: pointer;
}
.el-breadcrumb__inner {
    cursor: pointer;
}
</style>