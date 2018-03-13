<template>
<div>
    <el-row>
        <el-col :span="8" :offset="8">
            <div class="grid-content bg-purple">
                Users List
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
                prop="name"
                label="name"
                width="220">
            </el-table-column>
            <el-table-column
                prop="email"
                label="email"
                width="250">
            </el-table-column>
            <el-table-column
                prop="registration"
                label="registration date"
                width="250"
                sortable>
            </el-table-column>
            <el-table-column
                prop="type"
                label="user type"
                width="200">
            </el-table-column>
            <el-table-column
                prop="status"
                label="user status"
                width="200">
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
                layout="total, prev, pager, next, jumper"
                :total="count">
            </el-pagination>
        </div>
        <el-dialog title="Edit User" :visible.sync="showDialog">
            <el-form label-width="80px">
                <el-form-item label="name">
                    <el-input v-model="formdata.name"></el-input>
                </el-form-item>
                <el-form-item label="description">
                    <el-input v-model="formdata.description"></el-input>
                </el-form-item>
                <el-form-item label="user type">
                    <el-select v-model="typeIndex" placeholder="Select Type">
                        <el-option
                            v-for="item in types"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="user state">
                    <el-select v-model="stateIndex" placeholder="Select State">
                        <el-option
                            v-for="item in states"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">Cancel</el-button>
                <el-button type="primary" @click="updateUser()">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</div>
</template>
<script>
import topbar from '../admin/common/Topbar'
import { getUsersNumber, getUsers, editUser, deleteUser } from '../helper/adminHelper'
export default {
    created() {
        this.getNumber(),
        this.getUsers()
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
            userid: null,
            /*form input*/
            formdata: {},
            typeIndex: '',
            stateIndex: '',
            /*user type*/
            types: [{
                value: 'user',
                label: 'normal user'
            }, {
                value: 'author',
                label: 'signed author'
            }, {
                value: 'admin',
                label: 'administrator'
            }],
            /*user status*/
            states: [{
                value: 'pending',
                label: 'unverified'
            }, {
                value: 'verified',
                label: 'verified'
            }, {
                value: 'banned',
                label: 'blacklisted'
            }]
        }
    },
    methods: {
        //get number of users
        async getNumber() {
            try {
                const res = await getUsersNumber()
                if(res.data.success) {
                    this.count = res.data.count
                } 
            } catch(err) {
                cpnsole.log(err.message)
            }
        },
        //get all users data
        async getUsers(){
            try {
                const res = await getUsers({offset: this.offset, limit: this.limit})
                this.$notify({
                    title: 'Success',
                    type: 'success',
                    message: 'retrieve users successfully',
                    position: 'top-left'
                })
                this.tableData = []
                res.data.users.forEach(item => {
                    const tableData = {}
                    tableData.user = item._id
                    tableData.name = item.name
                    tableData.email = item.email
                    tableData.registration = item.created_at
                    tableData.type = item.type
                    tableData.status = item.status
                    this.tableData.push(tableData)
                })
            } catch(err) {
                console.log(err)
            }
        },
        //edit a row
        editRow(row) {
            this.formdata = row
            this.typeIndex = row.type
            this.stateIndex = row.status
            this.showDialog = true
            this.userid = row.user
        },
        //update a row
        async updateUser() {
            try {
                const data = {
                    name: this.formdata.name,
                    description: this.formdata.description,
                    type: this.typeIndex,
                    state: this.stateIndex
                }
                const res = await editUser(this.userid, data)
                if(res.data.success) {
                    //console.log('update success')
                    this.getUsers()
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'user info updated',
                        position: 'top-left'
                    })
                }
            } catch(err) {
                console.log('failed to edit')
            }
            this.showDialog = false
        },
        //delete row
        async deleteRow(index, row) {
            try {
                const res = await deleteUser(row.user)
                if(res.data.success) {
                    this.tableData.splice(index, 1)
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        message: 'user deleted',
                        position: 'top-left'
                    })
                } 
            } catch(err) {
                console.log('failed to delete this user')
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

        /*handleTypeSelect(value) {
            this.typeIndex = value
        },
        handleStateSelect(value) {
            this.stateIndex = value
        }*/
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