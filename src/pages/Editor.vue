<template>
<div class="editor-wrapper">
	<div class="topbar">
		<div class="title">Write Article</div>
		<div class="subtitle">Draft will be autosaved locally</div>
		<!--publish comfirmation-->
		<el-popover
			ref="publishpop"
			placement="bottom"
			width="180"
			height="140"
			v-model="showpop">
		<p style="text-align: left; margin-left: 25px;">Are you sure to pulish article?</p>
		<!--save markdown article-->
		<div v-if="editorSelected == 'markdown'" style="text-align: center; margin-top: 5px;">
			<el-button size="mini" type="text" @click="showpop = false">cancel</el-button>
			<el-button type="primary" size="mini" @click="addArticle('mk')">confirm</el-button>
		</div>
		<!--save quill article-->
		<div v-else style="text-align: center; margin-top: 5px;">
			<el-button size="mini" type="text" @click="showpop = false">cancel</el-button>
			<el-button type="primary" size="mini" @click="addArticle('rt')">confirm</el-button>
		</div>
		</el-popover>
		<!--discard comfirmation-->
		<el-popover
			ref="discardpop"
			placement="bottom"
			width="180"
			height="140"
			v-model="showdiscard">
		<p style="text-align: left; margin-left: 25px;">Are you sure to delete article?</p>
		<!--delete markdown article-->
		<div v-if="editorSelected == 'markdown'" style="text-align: center; margin-top: 5px;">
			<el-button type="text" size="mini" @click="showdiscard = false">cancel</el-button>
			<el-button type="danger" size="mini" @click="deleteLocal()">confirm</el-button>
		</div>
		<!--delete quill article-->
		<div v-else style="text-align: center; margin-top: 5px;">
			<el-button type="text" size="mini" @click="showdiscard = false">cancel</el-button>
			<el-button type="danger" size="mini" @click="deleteRichtext()">confirm</el-button>
		</div>
		</el-popover>

		<el-button v-popover:discardpop type="danger" :plain="true" icon="delete" class="action">Discard</el-button>
		<el-button v-popover:publishpop type="info" :plain="true" icon="upload" class="action">Publish</el-button>
	</div>
	<div class="steps">step 1: upload cover image</div>
	<!--cover image uploader-->
	<div class="article-cover">
		<i v-if="!imgPath" class="fa fa-camera"></i>
		<h3 v-if="!imgPath">Click to upload cover image 600px * 400px (max 10 MB).</h3>
		<avatar-upload
			@crop-upload-success="cropUploadSuccess"
			@crop-upload-fail="cropUploadFail" 
			field="cover"
			:width="600"
			:height="400"
			url="/v/upload"
			v-model="show"
			img-format="png"
			langType="en"
			:no-rotate="false"
			:no-circle="true"
			:set-shorter="true">
		</avatar-upload>
		<img @click="toggleShow" :class="{ display: !imgPath }" class="uploader" :src="imgPath">
	</div>
	<div class="steps">step 2: write article title</div>
	<!--article title input-->
	<div class="article-title">
		<input class="title-input" type="text" v-model="title" placeholder="Article title">
	</div>
	<div class="steps">step 3: pick one article tag</div>
	<div class="tag-group">
		<el-radio-group v-model="tagSelected" v-for="tag in tags" :key="tag.id" size="small">
			<el-radio-button :label="tag.title"></el-radio-button>
		</el-radio-group>
	</div>
	<!--search or create new tag-->
	<div class="steps">step 4: pick editor and write article</div>
	<!--article editor selector-->
	<el-select v-model="editorSelected" placeholder="Select">
		<el-option
			label="markdown"
			value="markdown">
		</el-option>
		<el-option
			label="richtext"
			value="richtext">
		</el-option>
	</el-select>
	<!--article editor-->
	<div v-show="editorSelected == 'markdown'" class="article-editor">
		<textarea id="editor"></textarea>
	</div>
	<div v-show="editorSelected == 'richtext'" class="richtext-editor">
		<quill-editor v-model="richtext"
			ref="myQuillEditor"
			:options="editorOption"
			@blur="onEditorBlur($event)"
			@focus="onEditorFocus($event)"
			@ready="onEditorReady($event)">
        </quill-editor>
	</div>
</div>
</template>

<script>
import SimpleMDE from 'simplemde'
import Quill from 'quill'
import { mapGetters } from 'vuex'
import debounce from '@/helper/debounce.js'
import marked from '@/helper/marked.js'
import { getTags, writeArticle }from '@/helper/articleHelper.js'
import avatarUpload from 'vue-image-crop-upload'
import { findWhere } from 'underscore'
import css from 'simplemde/dist/simplemde.min.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

let simplemde
export default {
	mounted() {
		simplemde = new SimpleMDE({
			autoDownloadFontAwesome: false,
			element: document.getElementById("editor"),
			spellChecker: false,
			previewRender: function(plainText) {
				return marked(plainText); // Returns HTML from a custom parser
			},
		})
		this.getTags()
	},
	data () {
		return {
			tags: [],
			showpop: false,
			showdiscard: false,
			show: false,
			tagSelected: '',
			editorSelected: 'markdown',
			editorOption: {
				// some quill options
				placeholder: 'please insert some content'
			},
			richtext: '',
			imgPath: '',
			title: '',
			content: '',
			type: ''
		}
	},
	computed: {
        ...mapGetters({
            userid: 'getID'
		}),
		editor() {
			return this.$refs.myQuillEditor.quill
		}
	},
	methods: {
		toggleShow() {
            this.show = !this.show
		},
		async getTags() {
			try {
				const res = await getTags()
				if(res.data.success) {
					this.tags = res.data.tags
				}
            } catch(err) {
                console.log('failed to get tags')
            }
		},
		async addArticle(type) {
			this.showpop = false
			const picked = findWhere(this.tags, { title: this.tagSelected })
			if(type == "mk") {
				this.content = simplemde.value()
				this.type="markdown"
			} else {
				this.content = this.richtext
				this.type="richtext"
			}
			if(this.imgPath == '' || this.title == '' || this.tagSelected == '' || this.content == '') {
				//notification
				this.$notify({
					title: 'Warning',
					type: 'warning',
					message: 'Please finish all steps before uploading',
					position: 'top-left'
				})
				return
			}
            try {
                const res = await writeArticle({
                    title: this.title,
                    content: this.content,
                    cover: this.imgPath,
					userid: this.userid,
					type: this.type,
					tagid: picked._id
				})
				if(res.data.success) {
					//notification
					this.$notify({
						title: 'Success',
						type: 'success',
						message: 'article uploaded successfully',
						position: 'top-left'
					})
					//reload current page
					this.$router.go()
				} else {
					//notification
					this.$notify({
						title: 'Warning',
						type: 'warning',
						message: 'failed to upload article, only stored locally',
						position: 'top-left'
					})
				}
            } catch(err) {
                console.log('failed to upload article')
            }
		},
		deleteLocal() {
			showdiscard: false,
			this.title = ''
			this.content = ''
			this.imgPath = ''
			//notification
			this.$notify.info({
				title: 'Notice',
				message: 'You have deleted article',
				position: 'top-left'
			})
		},

		onEditorBlur(editor) {
			//console.log('editor blur!', editor)
		},
		onEditorFocus(editor) {
			//console.log('editor focus!', editor)
			this.richtext = this.$refs.myQuillEditor.quill.container.firstChild.innerHTML
		},
		onEditorReady(editor) {
			//console.log('editor ready!', editor)
		},
        /*upload success*/
        cropUploadSuccess(jsonData, field){
			//console.log(jsonData)
			if(jsonData.success) {
				this.imgPath = (jsonData.filepath + jsonData.filename).slice(1)
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
            //console.log(status);
            //console.log('field: ' + field);
			this.$notify({
				title: 'Warning',
				type: 'warning',
				message: 'failed to upload image',
				position: 'top-left'
			})
        }
	},
	components: {
		avatarUpload
	}
}
</script>

<style lang="scss" scoped>
.steps {
	font-size: 14px;
	font-weight: 400;
	color: #b1b1b1;
	margin-top: 18px;
	line-height: 34px;
}
.el-radio-button {
	margin: 0 2px;
}
.editor-wrapper {
	width: 600px;
	margin: 0 auto;
	.topbar {
		border-bottom: 1px solid #b1b1b1;
		padding: 15px 0;
		.title {
			font-size: 16px;
			font-weight: 500;
			color: #333;
			margin-right: 20px;
			display: inline-block;
			line-height: 34px;
		}
		.subtitle {
			font-size: 14px;
			font-weight: 400;
			color: #b1b1b1;
			display: inline-block;
			line-height: 34px;
		}
		.action {
			float: right;
			padding: 8px 10px;
			margin: 0 3px;
			//display: inline-block;
		}
	}
	.article-cover {
		margin: 10px auto;
		background: #fff;
		height: 400px;
		width: 600px;
		border-radius: 20px;
		text-align: center;
		position: relative;
		.fa {
			margin-top: 180px;
			font-size: 30px;
			color: #808080; 
		}
		.uploader {
			position: absolute;
			display: block;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			cursor: pointer;
			box-shadow: 0px 0px 2px #ccc;
		}
		.display {
			opacity: 0;
		}
	}
	.article-title {
		margin-bottom: 20px;
		.title-input {
			background: inherit;
			padding: 5px 0;
			height: 44px;
			display: block;
			width: 100%;
			border: 0;
			font-size: 25px;
			font-weight: 500;
			padding-left: 8px;
			outline: none;
			&:focus {
				box-shadow: 0px 0px 2px #ccc;
				border-radius: 8px;
				background: #fff;
			}
		}
	}
	.article-editor {
		margin-top: 15px;
		margin-bottom: 50px;
	}
	.richtext-editor {
		box-shadow: 0px 0px 2px #ccc;
		margin-top: 15px;
		margin-bottom: 50px;
		opacity: 0.9;
	}
}
</style>