<template>
    <div class="auth-container">
        <div class="auth-form">
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
            <div class="prompt-box">don't have account?<router-link :to="{ name: 'signup' }"><span class="link-right">sign up page</span></router-link>
                <div class="divider"></div>
                <input type="checkbox" id="checkbox" v-model="remember"><label for="checkbox">remember me </label>
                <span class="link-right">forget password?</span>
            </div>
            <!--oauth login-->
            <div class="oauth-box">Other login ways： 
                <img title="Weibo" alt="Weibo" src="/static/weibo.svg" class="oauth-btn">
                <img title="GitHub" alt="GitHub" src="/static/github.svg" class="oauth-btn">
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { email, required, sameAs, minLength } from 'vuelidate/lib/validators'
import { loginUser } from '@/helper/userHelper'

export default {
    data() {
        return {
            /*login fields*/
            loginemail: '',
            loginpassword: '',
            /*login remember me*/
            remember: false
        }
    },
    validations: {
        loginemail: {
            required,
            email
        },
        loginpassword: {
            required,
            minLength: minLength(6)
        }
    },
    methods: {
        ...mapActions([
            'changeUser',
            'changeState',
            'displayModal',
            'switchLogin'
        ]),
        async processLogin() {
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
                    this.displayModal(false)
                    this.changeState(true)
                    this.changeUser(info)
                    socket.emit('login', res.data.id)
                    //notification
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'login successfully',
                        position: 'top-left'
                    })
                    if(this.$route.query.redirect) {
                        const path = decodeURIComponent(this.$route.query.redirect)
                        this.$router.replace({ path: path })
                    }
                } else {
                    //notification
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: res.data.message,
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log('login failed')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.auth-container {
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
    //background-image: url("/static/beach-background.jpg");
    cursor: pointer;
    .auth-form {
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
            font-size: 1.5rem;
            margin: 0 0 2rem;
            text-align: center;
        }
        .input-group {
            margin-bottom: .5rem;
            overflow: hidden;
            .form-group {
                margin-bottom: 2rem;
                .form-input {
                    margin-bottom: 0.5rem;
                    font-family: Lato,sans-serif;
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
            }
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
    }
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
</style>