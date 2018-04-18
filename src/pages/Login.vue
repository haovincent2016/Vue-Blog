<template>
<div class="wrapper">
    <!--login-->
    <div class="main" v-if="showLogin">
	    <div class="title">
            Login
        </div>
        <div class="form-container">
            <div class="admin-name">
                <i class="fa fa-user"></i>
                <input placeholder="admin email" type="email" v-model="email" name="email">
            </div>
            <div class="admin-password">
                <i class="fa fa-lock"></i>
                <input placeholder="admin password" type="password" v-model="password" name="password">
            </div>
            <div class="suggest">
                no account? <button class="btn btn-go" @click="showLogin=false">registration page</button>
            </div>
            <div class="btn-wrapper">
                <button class="btn btn-fine" @click="adminLogin()">login</button>
            </div>
        </div>	
    </div>
    <!--registration-->
    <div class="main" v-else>
	    <div class="title">
            Register
        </div>
        <div class="form-container">
            <div class="admin-name">
                <i class="fa fa-envelope-o"></i>
                <input placeholder="admin email" type="email" v-model="remail" name="remail">
            </div>
            <div class="admin-name">
                <i class="fa fa-user"></i>
                <input placeholder="admin username" type="text" v-model="rname" name="rname">
            </div>
            <div class="admin-password">
                <i class="fa fa-lock"></i>
                <input placeholder="admin password" type="password" v-model="rpassword" name="rpassword">
            </div>
            <div class="suggest">
                have account? <button class="btn btn-go" @click="showLogin=true">login page</button>
            </div>
            <div class="btn-wrapper">
                <button class="btn btn-fine" @click="adminRegister()">register</button>
            </div>
        </div>	
    </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import { loginUser, registerUser } from '@/helper/adminHelper'
export default {
	data () {
		return {
            email: '',
            password: '',
            rname: '',
            remail: '',
            rpassword: '',
            showLogin: true
		}
    },
    methods: {
        ...mapActions([
            'changeAdmin'
        ]),
        async adminLogin() {
            try {
                const res = await loginUser({ email: this.email, password: this.password })
                if(res.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: res.data.message,
                        position: 'top-left'
                    })
                    //always set the newer token
                    localStorage.setItem('admintoken', res.data.admintoken)
                    this.$router.push({ path: '/adminpanel' })
                    this.changeAdmin(true)
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: res.data.message,
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log('admin login failed')
            }
        },
        async adminRegister() {
            try {
                const res = await registerUser({ name: this.rname, email: this.remail, password: this.rpassword })
                if(res.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: res.data.message,
                        position: 'top-left'
                    })
                    localStorage.setItem('admintoken', res.data.admintoken)
                    this.adminLogin()
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: res.data.message,
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log('admin registration failed')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
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
    background-image: url("/static/grey-background.jpg");
    .main {
        position: relative;
        padding: 2rem;
        width: 26.5rem;
        max-width: 100%;
        font-size: 1.167rem;
        background-color: #fff;
        border-radius: 5px;
        box-sizing: border-box;
        box-shadow: 0 3px 3px rgba(0,0,0,.4);
        .title {
            margin: 0 auto;
            width: 8rem;
            font-size: 20px;
            text-align: center;
            padding: 10px;
            color: #007fff;
            font-weight: 700;
            border-bottom: 2px solid #007fff;
        }
        .form-container {
            padding-top: 20px;
            text-align: center;
            .admin-name {
                margin: 2px;
            }
            .suggest {
                margin-top: 15px;
            }
        }
    }
}
.fa {
    font-size: 16px;
    margin-right: 4px;
}
input {
    height: 30px;
    padding-left: 4px;
    border: 1px solid #c8c8c8;
    vertical-align: middle;
    margin: 6px;
}
.btn-fine {
    margin-top: 25px;
    width: 100px;
    height: 3.334rem;
    color: #fff;
    background-color: #007fff;
    border-radius: 4px;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
}
.btn-go {
    background-color: white;
    border: 1px solid grey;
    color: grey;
    cursor: pointer;
    &:hover {
      background-color: lightgrey;
      border: 1px solid lightgrey;
      color: #fff;  
    }
}
</style>