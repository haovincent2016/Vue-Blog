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

        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    margin-left: 29%;
    margin-top: 26px;
    width: 63%;
    background-color: #fff;
    padding-left: 30px;
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