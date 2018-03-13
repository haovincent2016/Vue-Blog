<template>
<div>
    <el-row>
        <el-col :span="8" :offset="8">
            <div class="grid-content bg-purple">
                Tags Management
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="3" :offset="21">
            <el-button type="primary" icon="el-icon-plus" @click="dialogVisible=true">Add New</el-button>
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
                prop="title"
                label="title"
                width="250">
            </el-table-column>
            <el-table-column
                prop="description"
                label="description"
                width="350">
            </el-table-column>
            <el-table-column
                prop="popularity"
                label="popularity"
                width="250">
            </el-table-column>
            <el-table-column
                prop="follower"
                label="follower"
                width="250"
                sortable>
            </el-table-column>
            <!--fixed position operation-->
            <el-table-column
                fixed="right"
                label="Operations"
                width="210">
                <template slot-scope="scope">
                    <el-button
                        type="info"
                        size="small"
                        :plain="true"
                        icon="el-icon-edit" class="action"
                        @click="editRow(scope.row)">
                        Edit
                    </el-button>
                    <el-button
                        type="danger"
                        size="small"
                        :plain="true"
                        icon="el-icon-delete" class="action"
                        @click="deleteRow(scope.$index, scope.row)"
                        >
                        Delete
                    </el-button>
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
        <!--add new tag-->
        <el-dialog title="Add New Tag" :visible.sync="dialogVisible" :before-close="handleClose">
            <el-form label-width="140px">
                <el-form-item label="Tag title">
                    <el-input v-model="formdata.title"></el-input>
                </el-form-item>
                <el-form-item label="Tag description">
                    <el-input type="textarea" :rows="3" v-model="formdata.description"></el-input>
                </el-form-item>
                <el-form-item label="Tag photo">
                    <el-upload 
                        class="upload-wrapper"
                        drag
                        :action="'https://vincenthao.info/admin/upload'"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        :before-upload="beforeUpload"
                        :file-list="fileList"
                        name="thumbnail">
                        <img v-if="imgpath" :src="imgpath" class="thumbnail">
                        <div v-else>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                        </div>
                        <div class="el-upload__tip" slot="tip">must be jpg/png files with a size less than 2MB</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog()">Cancel</el-button>
                <el-button type="primary" @click="addTag()">Confirm</el-button>
            </span>
        </el-dialog>
        <!--edit tag-->
        <el-dialog title="Edit Tag" :visible.sync="editVisible" :before-close="handleClose">
            <el-form label-width="140px">
                <el-form-item label="Tag title">
                    <el-input v-model="editdata.title"></el-input>
                </el-form-item>
                <el-form-item label="Tag description">
                    <el-input type="textarea" :rows="3" v-model="editdata.description"></el-input>
                </el-form-item>
                <el-form-item label="Tag photo">
                    <el-upload 
                        class="upload-wrapper"
                        drag
                        :action="'https://vincenthao.info/admin/upload'"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        :before-upload="beforeUpload"
                        :file-list="fileList"
                        name="thumbnail">
                        <img v-if="editpath" :src="editpath" class="thumbnail">
                        <div v-else>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                        </div>
                        <div class="el-upload__tip" slot="tip">must be jpg/png files with a size less than 2MB</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog()">Cancel</el-button>
                <el-button type="primary" @click="updateTag()">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</div>
</template>
<script>
import topbar from '../admin/common/Topbar'
import { getTags, getTagsNumber, addTag, editTag, deleteTag } from '../helper/adminHelper'
//import { localurl } from '@/config/env'
export default {
    created() {
        this.getNumber()
        this.getTags()
    },
    data() {
        return {
            //localurl,
            tableData: [],
            currentRow: null,
            //for pagination
            offset: 0,
            limit: 20,
            count: 0,
            currentPage: 1,
            //data for adding new tag
            formdata: {},
            imgpath: '',
            //data for editing tag
            tagid: '',
            editdata: {},
            editpath: '',
            dialogVisible: false,
            editVisible: false,
            fileList: []
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm('Are you sure to close without saving?', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
            })
                .then(_ => {
                    done();
                })
                .catch(_ => {})
        },
        closeDialog() {
            this.$confirm('Are you sure to close without saving?', {
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                type: 'warning'
            })
                .then(_ => {
                    //for adding new tag
                    this.dialogVisible = false
                    //for editing old tag
                    this.editVisible = false
                    this.getTags()
                })
                .catch(_ => {})
        },
        handleSuccess(res, file) {
            if(file.response.success) {
                this.imgpath = (file.response.filepath + file.response.filename).slice(1)
                this.editpath = (file.response.filepath + file.response.filename).slice(1)
            } else {
                this.$message.error('failed to upload tag image')
            }
        },
        beforeUpload(file) {
            const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png')
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isRightType) {
                this.$message.error('The image has to be jpg or png format')
            }
            if (!isLt2M) {
                this.$message.error('The image size has to be less than 2MB')
            }
            return isRightType && isLt2M
        },
        //get total number of tags
        async getNumber() {
            try {
                const res = await getTagsNumber()
                if(res.data.success) {
                    this.count = res.data.count
                } 
            } catch(err) {
                console.log(err.message)
            }
        },
        async getTags() {
            try {
                const res = await getTags({ offset: this.offset, limit: this.limit })
                if(res.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'retrieve tags successfully',
                        position: 'top-left'
                    })
                    this.tableData = []
                    res.data.tags.forEach(item => {
                        const tableItem = {}
                        tableItem.tag = item._id
                        tableItem.title = item.title
                        tableItem.description = item.description
                        tableItem.thumbnail = item.thumbnail
                        tableItem.popularity = item.popularity
                        tableItem.follower = item.follower
                        this.tableData.push(tableItem)
                    })
                }
            } catch(err) {
                console.log('failed to retrieve tags')
            }
        },
        async addTag() {
            try {
                if(this.imgpath === '') {
                    this.$message.error('Please wait until image is uploaded')
                } else {
                    const res = await addTag({ title: this.formdata.title, description: this.formdata.description, thumbnail: this.imgpath })
                    if(res.data.success) {
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: 'add new tag successfully',
                            position: 'top-left'
                        })
                        this.dialogVisible = false
                        this.formdata.title = ''
                        this.formdata.description = ''
                        this.imgpath = ''
                        this.getTags()
                    } 
                }
            } catch(err) {
                console.log('failed to add new tag')
            }
        },
        //edit a row
        editRow(row) {
            this.editdata = row
            this.editVisible = true
            this.tagid = row.tag
            this.editpath = row.thumbnail
        },
        //update a row
        async updateTag() {
            try {
                if(this.editpath === '') {
                    this.$message.error('Please wait until image is uploaded')
                } else {
                    const data = {
                        title: this.editdata.title,
                        description: this.editdata.description,
                        thumbnail: this.editpath
                    }
                    const res = await editTag(this.tagid, data)
                    if(res.data.success) {
                        this.$notify({
                            title: 'Success',
                            type: 'success',
                            message: 'tag updated successfully',
                            position: 'top-left'
                        })
                        this.getTags()
                    }
                }
            } catch(err) {
                console.log('failed to update tag')
            }
            this.editVisible = false
        },
        //delete row, if any articles under this tag, prevent deletion
        async deleteRow(index, row) {
            try {
                const res = await deleteTag(row.tag)
                if(res.data.success) {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: res.data.message,
                        position: 'top-left'
                    })
                    this.tableData.splice(index, 1)
                } 
            } catch(err) {
                console.log('failed to delete this tag')
            }
        }, 
        handleSizeChange(val) {
            //console.log(`every page ${val} items`)
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.offset = (val - 1) * this.limit
            this.getTags()
        },
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
    padding: 0 20px;
}
.el-input {
    padding: 10px 0;
}
.upload-wrapper {
    padding: 10px 0;
}
.thumbnail {
    width: 180px;
    height: 180px;
}
</style>