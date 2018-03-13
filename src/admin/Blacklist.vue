<template>
<div>
    <el-row>
        <el-col :span="8" :offset="8">
            <div class="grid-content bg-purple">
                Banned Users List
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
                prop="reason"
                label="reason"
                width="220">
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
                width="150">
                <template slot-scope="scope">
                    <el-button
                        type="danger"
                        size="small"
                        :plain="true"
                        icon="el-icon-arrow-left" class="action"
                        @click="unbanRow(scope.$index, scope.row)"
                        >
                        Unban
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
    </div>
</div>
</template>
<script>
import topbar from '../admin/common/Topbar'
import { getBlacklist, getBannedNumber, unbanUser } from '../helper/adminHelper'
export default {
    created() {
        this.getNumber()
        this.getBlacklist()
    },
    data() {
        return {
            tableData: [],
            currentRow: null,
            offset: 0,
            limit: 20,
            count: 0,
            currentPage: 1,
        }
    },
    methods: {
        //get number of users
        async getNumber() {
            try {
                const res = await getBannedNumber()
                if(res.data.success) {
                    this.count = res.data.count
                } 
            } catch(err) {
                console.log(err.message)
            }
        },
        async getBlacklist() {
            try {
                const res = await getBlacklist({ offset: this.offset, limit: this.limit })
                if(res.data.success) {
                    this.tableData = []
                    res.data.blacklist.forEach(item => {
                        const tableItem = {}
                        tableItem.user = item._id
                        tableItem.reason = item.ban_reason
                        tableItem.name = item.name
                        tableItem.email = item.email
                        tableItem.registration = item.created_at
                        tableItem.type = item.type
                        tableItem.status = item.status
                        this.tableData.push(tableItem)
                    })
                } else {
                    console.log('failed to get blacklist')
                }
            } catch(err) {
                console.log('failed to retrieve data')
            }
        },
        async unbanRow(index, row) {
            try {
                const res = await unbanUser(row.user)
                if(res.data.success) {
                    //console.log(res.data.message)
                    this.tableData.splice(index, 1)
                } else {
                    console.log(res.data.message)
                }
            } catch(err) {
                console.log('failed to unban this user')
            }
        },
        handleSizeChange(val) {
            console.log(`every page ${val} items`)
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.offset = (val - 1) * this.limit
            this.getUsers()
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
    padding: 0 20px;
}
</style>