<template>
    <!--auth form-->
    <div class="auth-form" >
        <div @click="closeModal" class="close">&times;</div>
        <!-- register part-->
        <div v-if="getLogin === 'register'">
            <h1 class="title">Signup</h1>
            <div class="input-group">
                <div class="form-group" v-bind:class="{ formerror: $v.name.$error }">
                    <input 
                        class="form-input" 
                        name="name" 
                        v-model.trim="name" 
                        @input="$v.name.$touch()" 
                        placeholder="please enter your account name">
                </div>
                <span class="form-message" v-if="!$v.name.required && $v.name.$dirty">please enter your name</span>
                <div class="form-group" v-bind:class="{ formerror: $v.email.$error }">
                    <input 
                        class="form-input" 
                        name="email" 
                        v-model.trim="email" 
                        @input="$v.email.$touch()"  
                        placeholder="please enter your email address">
                </div>
                <div v-if="$v.email.$error">
                    <span class="form-message" v-if="!$v.email.required">email is required</span>
                    <span class="form-message" v-if="!$v.email.email">email is required</span>
                </div>
                <div class="form-group" v-bind:class="{ formerror: $v.password.$error }">
                    <input 
                        class="form-input" 
                        name="password" 
                        v-model.trim="password" 
                        @input="$v.password.$touch()" 
                        type="password"
                        maxlength="64"  
                        placeholder="please enter your password">
                </div>
                <div v-if="$v.password.$error">
                    <span class="form-message" v-if="!$v.password.required">password is required</span>
                    <span class="form-message" v-if="!$v.password.minLength">password at least 6 characters.</span>
                </div>
                <div class="form-group" v-bind:class="{ formerror: $v.repeatpass.$error }">
                    <input 
                        class="form-input" 
                        name="repeatpass" 
                        v-model.trim="repeatpass" 
                        @input="$v.repeatpass.$touch()" 
                        type="password" 
                        maxlength="64" 
                        placeholder="please re-enter your password">
                </div>
                <div v-if="$v.repeatpass.$error">
                    <span class="form-message" v-if="!$v.repeatpass.required">please re-enter your password</span>
                    <span class="form-message" v-if="!$v.repeatpass.sameAsPassword">passwords must be identical.</span>
                </div>
            </div>
            <button class="btn btn-disabled" v-if="$v.name.$error || $v.email.$error ||  $v.password.$error || $v.repeatpass.$error || !name || !email || !password || !repeatpass">sign up now</button>
            <button class="btn btn-fine" v-else @click="processRegister()">sign up now</button>
            <div class="prompt-box">already have account? <span class="link-right" @click="changeLogin('login')">login page</span>
            </div>
        </div>
        <!--login part-->
        <div v-if="getLogin === 'login'">
            <h1 class="title">Login</h1>
            <div class="input-group">
                <div class="form-group">
                    <input 
                        class="form-input" 
                        name="loginemail" 
                        v-model.trim="loginemail"
                        @input="$v.loginemail.$touch()"   
                        placeholder="please enter your email address">
                </div>
                <div v-if="$v.loginemail.$error">
                    <span class="form-message" v-if="!$v.loginemail.required">email is required</span>
                    <span class="form-message" v-if="!$v.loginemail.email">please enter valid email</span>
                </div>
                <div class="form-group">
                    <input 
                        class="form-input" 
                        name="loginpassword" 
                        v-model.trim="loginpassword"
                        @input="$v.loginpassword.$touch()"
                        placeholder="please enter your password"
                        type="password">
                </div>
                <div v-if="$v.loginpassword.$error">
                    <span class="form-message" v-if="!$v.loginpassword.required">password is required</span>
                    <span class="form-message" v-if="!$v.loginpassword.minLength">password is at least 6</span>
                </div> 
            </div>
            <button class="btn btn-disabled" v-if="$v.loginemail.$error || $v.loginpassword.$error || !loginemail || !loginpassword">login</button>
            <button class="btn btn-fine" v-else @click="processLogin()">login</button>
            <div class="prompt-box" v-if="getLogin === 'login'">don't have account?<span  class="link-right" @click="changeLogin('register')">sign up page</span>
                <div class="divider"></div>
                <input type="checkbox" id="checkbox" v-model="remember"><label for="checkbox">remember me </label>
                <!--<span class="link-right">forget password?</span>-->
            </div>
        </div>
        <!--oauth login-->
        <div class="oauth-box">Other login ways： 
            <img title="微博" alt="微博" src="/static/weibo.svg" class="oauth-btn">
            <img title="GitHub" alt="GitHub" src="/static/github.svg" class="oauth-btn">
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'
import { registerUser, loginUser } from '@/helper/userHelper'

export default {
    data() {
        return {
            /*registration fields*/
            name: '',
            email: '',
            password: '',
            repeatpass: '',
            /*login fields*/
            loginemail: '',
            loginpassword: '',
            /*login remember me*/
            remember: false
        }
    },
    validations: {
        name: {
            required
        },
        email: {
            required,
            email
        },
        password: {
            required,
            minLength: minLength(6)
        },
        repeatpass: {
            required,
            sameAsPassword: sameAs('password')
        },
        loginemail: {
            required,
            email
        },
        loginpassword: {
            required,
            minLength: minLength(6)
        }
    },
    computed: {
        ...mapGetters([
            'getLogin'
        ])
    },
    methods: {
        ...mapActions([
            'changeState',
            'displayModal',
            'switchLogin',
            'changeUser'
        ]),
        /*login or registration*/
        changeLogin(login) {
            this.switchLogin(login)
        },
        /*login modal*/
        closeModal() {
            this.displayModal(false)
        },
        async processRegister() {
            const that = this
            const request = {
                name: this.name,
                email: this.email,
                password: this.password,
                remember: this.remember
            }
            try {
                const res = await registerUser(request)
                if(res.data.success) {
                    that.displayModal(false)
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'registration successfully',
                        position: 'top-left'
                    })
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: res.data.message,
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        async processLogin() {
            const that = this
            const request = {
                name: this.name,
                email: this.loginemail,
                password: this.loginpassword,
                remember: this.remember
            }
            try {
                const res = await loginUser(request)
                if(res.data.success) {
                    const info = { id: res.data.id, name: res.data.name, email: res.data.email, avatar: res.data.avatar }
                    that.displayModal(false)
                    that.changeState(true)
                    that.changeUser(info)
                    socket.emit('login', res.data.id)
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'login successfully',
                        position: 'top-left'
                    })
                    if(that.$route.query.redirect) {
                        const path = decodeURIComponent(that.$route.query.redirect)
                        that.$router.replace({ path: path })
                    }
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: res.data.message,
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log(err.message)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .hidebutton {
        display: none;
    }
    
    /* The Close Button */
    .close {
        color: #aaa;
        float: right;
        font-size: 30px;
        font-weight: bold;
        line-height: 23px;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }

    .closeicon {
        float: right;
        margin-top: 0.4rem;
        font-size: 17px;
    }
    .formerror {
        animation-name: shakeError;
        animation-duration: .6s;
        animation-timing-function: ease-in-out;
        border-color: #f79483;
    }
    .form-group {
        margin-bottom: 2rem;
    }
    .form-input {
        margin-bottom: 0.5rem;
        font-family: sans-serif;
        font-size: 1rem;
        font-weight: 400;
        color: #374853;
        line-height: 2.375rem;
        min-height: 2.375rem;
        position: relative;
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        background: #fff;
        padding: 0 .8125rem;
        width: 100%;
        transition: border .1s ease;
        box-sizing: border-box;
    }
    .form-message {
        font-size: .75rem;
        line-height: 1;
        margin-left: 14px;
        margin-top: -1.6875rem;
        margin-bottom: .9375rem;
        display: block;
        color: #f57f6c;
    }
    .auth-form {
        position: relative;
        padding: 2rem;
        width: 26.5rem;
        max-width: 100%;
        font-size: 1.167rem;
        background-color: #fff;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .close-btn {
        float: right;
        cursor: pointer;
        opacity: .4;
    }
    .ion-close-round:before {
        content: "\f129";
    }
    .title {
        font-size: 1.5rem;
        margin: 0 0 2rem;
        text-align: center;
    }
    .input-group {
        margin-bottom: .5rem;
        overflow: hidden;
    }
    .btn-fine {
        width: 100%;
        height: 3.334rem;
        color: #fff;
        background-color: #007fff;
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
        cursor: pointer;
    }
    .btn-disabled {
        width: 100%;
        height: 3.334rem;
        color: #fff;
        background-color: lightgrey;
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
        cursor: not-allowed;
    }
    .prompt-box {
        margin: 1rem 0 0;
        color: #8b9196;
        .divider {
            margin: 15px 0;
            border-top: 1px solid #f1f1f1;
        }
        label {
            float: left;
            color: #42b3f4;
            margin-right: 5px;
        }
        #checkbox {
            margin-top: 3px;
        }
        .link-right {
            float: right;
            color: #42b3f4;
            cursor: pointer;
            &:hover {
                color: #007fff;
            }
        }
        .right {
            float: right;
        }
    }
    .oauth-box {
        margin-top: 2.3rem;
        font-size: 1rem;
        line-height: 1.9rem;
        color: #8b9196;
        .oauth-btn {
            margin-left: 1.2rem;
            height: 1.9rem;
            vertical-align: bottom;
            cursor: pointer;
        }
    }

</style>