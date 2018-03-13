<template>
    <div class="container main-container with-view-nav tight">
        <div class="view submit-entry-view">
            <nav role="navigation" class="view-nav">
                <ul class="nav-list">
                    <li class="nav-item">
                        <a href="/" target="_blank">guidelines</a>
                    </li>
                    <li class="separator">
                        |
                    </li>
                    <li class="nav-item">
                        <a href="/" target="_blank">terms and conditions</a>
                    </li>
                </ul>
            </nav>
            <div class="head">
                <h2 class="title">Write Article</h2>
                <p class="desc">Your submitted article will show after approval</p>
            </div>
            <div class="entry-form entry-form">
                <div class="entry-form-input">
                    <input type="text" placeholder="Article title" v-model="title" class="input">
                    <textarea placeholder="Article content" rows="6" v-model="content" class="input"></textarea>
                    <div class="category-list-box">
                        <div class="title">Category</div>
                        <ul class="category-list category-list">
                            <li class="item">Android</li>
                            <li class="item active">Web</li>
                            <li class="item">iOS</li>
                            <li class="item">Product</li>
                            <li class="item">Design</li>
                        </ul>
                    </div>
                    <div class="tag-list-box">
                        <div class="title">Tag</div>
                        <ul class="tag-list tag-list">
                            <li class="add">
                                <input type="text" placeholder="Search tags" class="tag-title-input">
                            </li>
                        </ul>
                    </div>
                    <button @click="addArticle" class="submit-btn">Submit</button>
                </div>
                <div class="uploader">
                    <avatar-upload
                            @crop-success="cropSuccess"
                            @crop-upload-success="cropUploadSuccess"
                            @crop-upload-fail="cropUploadFail" 
                            field="cover"
                            :width="400"
                            :height="400"
                            url="/v/upload"
                            v-model="show"
                            img-format="png"
                            langType="en"
                            :no-circle="true"
                            :set-shorter="true">
                    </avatar-upload>
                    <img @click="toggleShow" class="preview" :src="imgUrl">
                </div>    
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import avatarUpload from 'vue-image-crop-upload'
import { writeArticle } from '@/helper/articleHelper'

export default {
    data() {
        return {
            title: '',
            content: '',
            show: false,
            imgUrl: '/static/default_preview.gif',
            imgPath: '',
        }
    },
    computed: {
        ...mapGetters({
            userid: 'getID'
        }),
    },
    methods: {
        toggleShow() {
            this.show = !this.show
        },
        async addArticle() {
            try {
                const res = await writeArticle({
                    title: this.title,
                    content: this.content,
                    cover: this.imagePath,
                    userid: this.userid
                })
                this.title = ''
                this.content = ''
                this.imgUrl = '/static/default_preview.gif'
            } catch(err) {
                console.log(err)
            }
        },
        /**
         * crop success
         *
         * [param] imgDataUrl
         * [param] field
         */
        cropSuccess(imgDataUrl, field){
            /*console.log('-------- crop success --------');*/
            this.imgUrl = imgDataUrl;
        },
        /**
         * upload success
         *
         * [param] jsonData   服务器返回数据，已进行json转码
         * [param] field
         */
        cropUploadSuccess(jsonData, field){
            /*console.log('-------- upload success --------')
            console.log(jsonData)
            console.log('field: ' + field)*/
            this.imgPath = (jsonData.filepath + jsonData.filename).slice(1)
            this.$notify({
                title: 'Success',
                type: 'success',
                message: 'image uploaded',
                position: 'top-left'
            })
        },
        /**
         * upload fail
         *
         * [param] status    server api return error status, like 500
         * [param] field
         */
        cropUploadFail(status, field){
            /*console.log('-------- upload fail --------');
            console.log(status);
            console.log('field: ' + field);*/
            this.$notify({
                title: 'Warning',
                type: 'warning',
                message: 'failed to image upload',
                position: 'top-left'
            })
        }
    },
    components: {
        avatarUpload
    }
}
</script>
<style scoped lang="scss">
.view {
    margin-top: 3.833rem;

    .view-nav {
        left: 0;
        background-color: #fff;
        position: fixed;
        top: 5rem;
        width: 100%;
        height: 3.833rem;
        z-index: 100;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
        transition: all .2s;
        transform: translateZ(0);
        .nav-list {
            height: 100%;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            max-width: 980px;
            margin: auto;
            line-height: 1;
            .nav-item {
                flex-shrink: 0;
                font-size: 1.16rem;
                color: #71777c;
                position: relative;
                cursor: pointer;
            }
            .separator {
                margin: 0 18px;
            }
        }
    } 
    .head {
        margin-top: 3rem;
        padding: 2rem 0;
        .title {
            margin: 0;
            font-size: 2rem;
            line-height: 1;
        }
        .desc {
            margin: .5rem 0;
            color: #838383;
            font-size: 1.167rem;
        }
    }
    .entry-form {
        display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;
        position: relative;
        .entry-form-input {
            width: 62%;
            .category-list-box {
                margin: 1.3rem auto;
                display: flex;
                -webkit-box-align: center;
                align-items: center;
                .title {
                    font-size: 1.3rem;
                    margin-right: 1.3rem;
                } 
            }
            .tag-list-box {
                margin: 1.3rem auto;
                display: flex;
                .title {
                    font-size: 1.3rem;
                    margin-top: 0.5rem;
                    margin-right: 1.3rem;
                } 
            }
        }
        .uploader {
            width: 35%;
            .preview {
                width: 100%;
                height: 100%;
                opacity: 0.8;
            }
            .image {
                width: 100%;
                height: 100%;
                opacity: 0.6;
            }
            input {
                display: none;
                cursor: pointer;
            }
            .prompt {
                position: absolute;
                top: 87%;
                text-align: center;
                padding: 13.6px;
                background-color: white;
                color: grey;
                border: 1px solid grey;
                width: 30%;
                cursor: pointer;
            }
        }
        
        .meta-tag-list-box {
            display: flex;
            margin: 1.3rem auto;
        }
    }
}


.item {
    border: 1px solid #f1f1f1;
    color: #909090;
    font-size: 1rem;
    line-height: 1;
    display: inline-block;
    margin-right: .6rem;
    padding: .4rem .9rem;
    cursor: pointer;
    background-color: #fff;
    border-radius: 2px;
    transition: all .3s;
}
input, textarea {
    margin-bottom: 1.3rem;
    padding: 1rem;
    font-size: 1.3rem;
    font-family: inherit;
    line-height: 1.4;
    resize: none;
    outline: none;
    width: 100%;
    display: block;
    box-shadow: none;
    border: 1px solid #ddd;
    border-radius: 2px;
    transition: border .3s;
    background-color: #fff;
    box-sizing: border-box;
}
button {
    background-color: #00a1d6;
    color: #fff;
    border-radius: 2px;
    border: none;
    padding: .5rem 1.3rem;
    outline: none;
    transition: background-color .3s,color .3s;
    cursor: pointer;
}
.tag-title-input {
    padding: .5rem;
    font-size: 1rem;
}
.submit-btn {
    width: 100%;
    font-size: 1.3rem;
}
</style>