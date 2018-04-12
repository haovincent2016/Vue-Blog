<template>
    <div class="main">
	    <table> 
            <tbody>
                <tr>
                    <td>
                        <div class="avatar">
                            <img :src="avatar">
                        </div>
                    </td> 
                    <td>
                        <a class="btn btn-hollow" @click="toggleShow">
                            Avatar Setting
                        </a>
                        <avatar-upload
                            @crop-success="cropSuccess"
                            @crop-upload-success="cropUploadSuccess"
                            @crop-upload-fail="cropUploadFail" 
                            field="avatar"
                            :width="300"
                            :height="300"
                            :no-rotate="false"
                            langType="en"
                            url="/auth/uploadAvatar"
                            v-model="show"
                            img-format="png">
                        </avatar-upload>
                    </td>
                </tr> 
                <tr>
                    <td class="setting-title">Name</td> 
                    <td>
                        <input v-if="user.name" type="text" :placeholder="user.name" v-model="username">
                        <input v-else type="text" placeholder="edit name" v-model="useremail">
                    </td>
                </tr> 
                <tr>
                    <td class="setting-title">Email</td> 
                    <td> 
                        <input v-if="user.email" type="email" :placeholder="user.email" v-model="useremail">
                        <input v-else type="email" placeholder="edit email" v-model="useremail">
                    </td>
                </tr> 
                <!--<tr>
                    <td class="setting-title setting-editor">Prefered Editor</td> 
                    <td>
                        <div class="left-radio">
                            <input type="radio" value="plain"> 
                            <span>Richtext</span>
                        </div> 
                        <div class="right-radio">
                            <input type="radio" value="markdown"> 
                            <span>Markdown</span>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td class="setting-title setting-verticle">语言设置</td> 
                    <td>
                        <div class="left-radio">
                            <input type="radio" value="zh-CN"> 
                            <span>中文简体</span>
                        </div> 
                        <div class="right-radio">
                            <input type="radio" value="zh-TW"> 
                            <span>中文繁体</span>
                        </div>
                    </td>
                </tr>
                --> 
            </tbody>
        </table>
        <input type="submit" @click="updateUser()" class="btn btn-hollow" value="save">	
    </div>
</template>

<script>
import avatarUpload from 'vue-image-crop-upload'
import { mapGetters } from 'vuex'
import { editUser } from '@/helper/userHelper'
import { isEqual } from 'underscore'
export default {
    mounted() {
        this.oldPath = this.avatar
    },
	data () {
		return {
            show: false,
            oldPath: '',
            imgPath: '',
            username: '',
            useremail: ''
		}
    },
    components: {
        avatarUpload
    },
    computed: {
        ...mapGetters({
            user: 'getUser',
            avatar: 'getAvatar'
        })
    },
    methods:{
        toggleShow() {
            this.show = !this.show
        },
        async updateUser() {
            if(!this.username) {
                this.username = this.user.name
            }
            if(!this.useremail) {
                this.useremail = this.user.email
            }
            const request = { id: this.user.id, name: this.username, email: this.useremail, avatar: this.imgPath }
            try {
                const res = await editUser(request)
                if(res.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'profile edited successfully',
                        position: 'top-left'
                    })
                    if(!isEqual(res.data.pofile, this.user)) {
                        //change cached path
                        this.$store.dispatch('changeCover', this.imgPath)
                        this.$store.dispatch('changeUser', res.data.profile)
                    }
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: res.data.message,
                        position: 'top-left'
                    })
                    this.$store.dispatch('changeCover', this.oldPath)
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        /*crop success*/
        cropSuccess(imgDataUrl, field){
            /*console.log('-------- crop success --------');*/
        },
        /*upload success*/
        cropUploadSuccess(jsonData, field){
            /*console.log('-------- upload success --------')
            console.log(jsonData)
            console.log('field: ' + field)*/
            if(jsonData.success) {
                this.imgPath = (jsonData.filepath + jsonData.filename).slice(1)
                this.$store.dispatch('changeCover', this.imgPath)
                this.$notify({
                    title: 'Success',
                    type: 'success',
                    message: jsonData.message,
                    position: 'top-left'
                })
            } else {
                this.$notify({
                    title: 'Warning',
                    type: 'warning',
                    message: jsonData.message,
                    position: 'top-left'
                })
            }
        },
        /*upload fail*/
        cropUploadFail(status, field){
            /*console.log('-------- upload fail --------');
            console.log(status);
            console.log('field: ' + field);*/
            this.$notify({
                title: 'Warning',
                type: 'warning',
                message: 'server error',
                position: 'top-left'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    flex: 68%;
    margin: 8px;
    padding-left: 10px; 
    background-color: #fff;
    &:hover {
        box-shadow: 1px 1px 2px #ccc;
    }
}
table {
    width: 100%;
}
td {
    padding: 20px 0;
    .avatar {
        position: relative;
        width: 100px;
        height: 100px;
        margin: 8px;
        img {
            width: 100px;
            height: 100px;
            border: 1px solid #ddd;
            border-radius: 50%;
        }
    }
}
.setting-title {
    font-size: 15px;
    color: #969696;
}
input[type=text], input[type=email] {
    padding: 5px 10px;
    font-size: 15px;
    border: 1px solid #c8c8c8;
    border-radius: 4px;
    background-color: hsla(0,0%,71%,.1);
}
input[type=radio] {
    vertical-align: middle;
    line-height: normal;
}
.left-radio {
    width: 33.3%;
    display: inline-block;
    span {
        margin: 0 20px 0 6px;
        font-size: 15px;
        vertical-align: middle;
    }
}
.right-radio {
    display: inline-block;
    span {
        margin: 0 20px 0 6px;
        font-size: 15px;
        vertical-align: middle;
    }
}
.btn-hollow {
    cursor: pointer;
    display: inherit;
    margin-bottom: 0;
    text-align: center;
    vertical-align: middle;
    padding: 7px 18px 9px;
    font-size: 15px;
    font-weight: 400;
    line-height: normal;
    border-radius: 40px;
    background: none;
    border: 1px solid rgba(59,194,29,.7);
    color: #42c02e;
    margin: 10px auto;
    &:hover {
        color: #fff;
        background-color: #42c02e;
    }
}
.hide {
    position: absolute;
    display: block;
    width: 82px;
    opacity: 0;
}
</style>