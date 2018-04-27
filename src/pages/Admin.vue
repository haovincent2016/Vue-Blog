<template>
	<div class="admin-container">
		<topbar></topbar>
		<el-row>
			<el-col :span="5" class="leftmenu">
				<el-menu router>
					<el-menu-item index="/zadminpanel">
						<template slot="title">
							<i class="el-icon-menu"></i>
							<span slot="title">Home</span>
						</template>
					</el-menu-item>
					<el-submenu index="2">
						<template slot="title">
							<i class="el-icon-star-off"></i>
							<span slot="title">User Management</span>
						</template>
						<el-menu-item index="/zadminpanel/manageusers">Approved</el-menu-item>
						<el-menu-item index="/zadminpanel/blacklist">Blacklist</el-menu-item>
					</el-submenu>
					<el-submenu index="articles">
						<template slot="title">
							<i class="el-icon-document"></i>
							<span slot="title">Article Management</span>
						</template>
						<el-menu-item index="/zadminpanel/managearticles">Articles</el-menu-item>
						<!--<el-menu-item index="richtext">Editors</el-menu-item>-->
						<el-menu-item index="/zadminpanel/managetags">Tags</el-menu-item>
					</el-submenu>
					<el-submenu index="comments">
						<template slot="title">
							<i class="el-icon-edit-outline"></i>
							<span slot="title">Comment Management</span>
						</template>
						<el-menu-item index="/zadminpanel/managecomment">Users</el-menu-item>
						<el-menu-item index="/zadminpanel/comment">Authors</el-menu-item>
					</el-submenu>
					<el-submenu index="more">
						<template slot="title">
							<i class="el-icon-more-outline"></i>
							<span slot="title">More</span>
						</template>
						<el-menu-item index="/zadminpanel/group">Groups</el-menu-item>
						<el-menu-item index="/zadminpanel/setting">Settings</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="19" class="content">
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row> 
	</div>	
</template>

<script>
import topbar from '@/admin/common/Topbar'
export default {
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		}
	},
	components: {
		topbar
	}
}
</script>

<style lang="scss" scoped>
.left-menu {
    width: 250px;
    min-height: 100%;
}
</style>