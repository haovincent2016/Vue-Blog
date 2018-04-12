<template>
<div class="main">
	    <table>
            <thead>
            </thead> 
            <tbody>
                <tr>
                    <td class="setting-title">Delete Account</td> 
                    <td>
                        <a class="btn btn-warn" @click="deleteAccount()">
                            Delete
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
	data () {
		return {
		}
    },
    methods:{
        deleteAccount() {
            this.$notify({
                title: 'Warning',
                type: 'warning',
                message: 'sorry, not available for normal users',
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
    background-color: #fff;
    padding-left: 45px;
    height: 85px;
    &:hover {
        box-shadow: 1px 1px 2px #ccc;
    }
}
table {
    width: 100%;
}
td {
    padding: 20px 0;
}
.setting-title {
    font-size: 15px;
    color: #969696;
}
.btn-warn {
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
    border: 1px solid #ef8270;
    color: #ef8270;
    margin: 10px auto;
    &:hover {
        color: #fff;
        background-color: #ef8270;
    }
}
.hide {
    position: absolute;
    display: block;
    width: 82px;
    opacity: 0;
}
</style>