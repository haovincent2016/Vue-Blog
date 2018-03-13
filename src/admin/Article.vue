<template>
<div>
    <el-row>
        <el-col :span="8" :offset="8">
            <div class="grid-content bg-purple">
                Articles List
            </div>
        </el-col>
    </el-row>
    <div class="content">
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                type="index"
                width="100">
            </el-table-column>
            <el-table-column
                prop="approved"
                label="published"
                width="220">
            </el-table-column>
            <el-table-column
                prop="title"
                label="title"
                width="220">
            </el-table-column>
            <el-table-column
                prop="cover"
                label="cover"
                width="220">
            </el-table-column>
            <el-table-column
                prop="author"
                label="author"
                width="250">
            </el-table-column>
            <el-table-column
                prop="type"
                label="type"
                width="200">
            </el-table-column>
            <el-table-column
                prop="update_at"
                label="update date"
                width="200">
            </el-table-column>
            <el-table-column
                prop="created_at"
                label="created date"
                width="200">
            </el-table-column>
            <el-table-column
                prop="close_comments"
                label="close comments"
                width="200">
            </el-table-column>
            <!--fixed position operation-->
            <el-table-column
                fixed="right"
                label="Operations"
                width="210">
                <template slot-scope="scope">
                    <el-button type="info" size="small" :plain="true" icon="el-icon-edit" class="action" @click="editRow(scope.row)">
                        Edit
                    </el-button>
                    <el-button type="danger" size="small" :plain="true" icon="el-icon-delete" class="action" @click="showdelete = true">
                        Delete
                    </el-button>
                    <el-dialog
                        title="Comfirmation"
                        width="30%"
                        :visible.sync="showdelete"
                        :modal="false">
                        <span>Are you sure to delete this article</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="showdelete = false">Cancel</el-button>
                            <el-button type="primary" @click="deleteRow(scope.$index, scope.row)">Confirm</el-button>
                        </span>
                    </el-dialog>
                </template>
            </el-table-column>
        </el-table>
        <div class="Pagination" style="text-align: left;margin-top: 10px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="20"
                layout="total, prev, pager, next"
                :total="count">
            </el-pagination>
        </div>
        <el-dialog 
            title="Edit Article" 
            :visible.sync="showDialog" 
            @close="resetArticle()"
            center>
            <el-form :model="formdata" label-width="80px">
                <el-form-item label="Title">
                    <el-input v-model="formdata.title"></el-input>
                </el-form-item>
                <el-form-item label="Status">
                    <el-select v-model="stateIndex">
                        <el-option
                            v-for="item in states"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Type">
                    {{ typeIndex }}
                </el-form-item>
                
            </el-form>
            <textarea v-if="typeIndex === 'markdown'" id="admineditor"></textarea>
            <div v-if="typeIndex === 'richtext'" class="richtext-editor">
                <quill-editor v-model="richtext"
                    ref="adminQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)">
                </quill-editor>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetArticle()">Cancel</el-button>
                <el-button type="primary" @click="updateArticle()">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</div>
</template>
<script>
import SimpleMDE from 'simplemde'
import Quill from 'quill'
import marked from '../helper/marked.js'
import topbar from '../admin/common/Topbar'
import css from 'simplemde/dist/simplemde.min.css'
import { getArticles, getArticlesNumber, editArticle, deleteArticle } from '../helper/adminHelper'

let simplemde
export default {
    created() {
        this.getNumber()
        this.getArticles()
    },
    data() {
        return {
            tableData: [],
            currentRow: null,
            offset: 0,
            limit: 20,
            count: 0,
            currentPage: 1,
            showDialog: false,
            articleid: '',
            richtext: '',
            showdelete: false,
            /*form input*/
            formdata: {
            },
            editdata: {},
            /*selected editor*/
            typeIndex: '',
            /*publish state*/
            stateIndex: '',
            /*article publish state*/
            states: [{
                value: 'published',
                label: 'published'
            }, {
                value: 'review',
                label: 'review'
            }],
            /*article type*/
            types: [{
                value: 'markdown',
                label: 'markdown editor'
            }, {
                value: 'richtext',
                label: 'quill editor'
            }],
            editorOption: {
				// some quill options
				placeholder: 'please insert some content'
			}
        }
    },
    methods: {
        //get article number
        async getNumber() {
            try {
                const res = await getArticlesNumber()
                if(res.data.success) {
                    this.count = res.data.count
                } 
            } catch(err) {
                console.log(err.message)
            }
        },
        //get all articles data
        async getArticles() {
            try {
                const res = await getArticles({offset: this.offset, limit: this.limit})
                if(res.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'retrieve articles successfully',
                        position: 'top-left'
                    })
                    this.tableData = []
                    res.data.articles.forEach(item => {
                        const tableData = {}
                        tableData.article = item._id
                        item.apprroved ? tableData.approved = 'published' : tableData.approved = 'review'
                        tableData.title = item.title
                        tableData.author = item.author
                        tableData.cover = item.cover
                        tableData.content = item.content
                        tableData.type = item.type
                        tableData.close_comments = item.close_comments.toString()
                        tableData.created_at = item.created_at
                        tableData.update_at = item.update_at
                        this.tableData.push(tableData)
                    })
                } else {
                    this.$notify({
                        title: 'Warning',
                        type: 'warning',
                        message: 'failed to retrieve articles',
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log(err.message)
            }
        },
        //edit a row
        editRow(row) {
            this.formdata = row
            this.typeIndex = row.type
            this.stateIndex = row.approved
            this.articleid = row.article
            this.showDialog = true
            if(this.typeIndex === 'richtext') {
                this.richtext = row.content
            }
            this.$nextTick(() => {
                if(!simplemde && this.typeIndex === 'markdown') {
                    simplemde = new SimpleMDE({
                        autoDownloadFontAwesome: false,
                        element: document.getElementById("admineditor"),
                        spellChecker: false,
                        previewRender: function(plainText) {
                            return marked(plainText); // Returns HTML from a custom parser
                        },
                    })
                    simplemde.value(this.formdata.content)
                }
            })
        },
        //reset a row when cancel
        resetArticle() {
            this.showDialog = false
            if(this.typeIndex === 'markdown') {
                simplemde.toTextArea()
                simplemde = null
            }
            if(this.typeIndex === 'richtext') {
                this.richtext = ''
            }
            this.typeIndex = ''
        },
        //update a row
        async updateArticle() {
            this.showDialog = false
            if(this.typeIndex === 'markdown') {
                this.editdata = {
                    title: this.formdata.title,
                    content: simplemde.value(),
                    approved: this.stateIndex
                }
            } else {
                this.editdata = {
                    title: this.formdata.title,
                    content: this.$refs.adminQuillEditor.quill.container.firstChild.innerHTML,
                    approved: this.stateIndex
                }
            }
            try {
                const res = await editArticle(this.articleid, this.editdata)
                if(res.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'Article updated successfully',
                        position: 'top-left'
                    })
                    this.getArticles()
                }
            } catch(err) {
                console.log('failed to edit')
            }
        },
        //delete row
        async deleteRow(index, row) {
            this.showdelete = false
            try {
                const res = await deleteArticle(row.article)
                if(res.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: res.data.message,
                        position: 'top-left'
                    })
                    this.tableData.splice(index, 1)
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

        handleSizeChange(val) {
            //console.log(`every page ${val} items`)
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.offset = (val - 1) * this.limit
            this.getUsers()
        },

        onEditorBlur(editor) {
			//console.log('editor blur!', editor)
		},
		onEditorFocus(editor) {
			//console.log('editor focus!', editor)
			this.richtext = this.$refs.adminQuillEditor.quill.container.firstChild.innerHTML
		},
		onEditorReady(editor) {
			//console.log('editor ready!', editor)
		}
    },
    components: {
        topbar
    }
}
</script>
<style lang="scss" scoped>
.el-row {
    margin: 20px 0;
    .bg-purple {
        background: #d3dce6;
        color: #fff;
        text-align: center;
        padding: 10px;
        font-size: 20px;
    }
}
.content {
    padding: 20px;
}
</style>