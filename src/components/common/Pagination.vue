<template>
<div class="pagination">
  <span @click.prevent="pageChanged(1)" class="page">
       <i class="fa fa-arrow-left"></i>
  </span>
  <span @click.prevent="pageChanged(n)" v-for="n in paginationRange" :key="n.id" class="page" :class="{active: activePage(n)}">
    <a href="#" >{{ n }}</a>
  </span>
  <span  @click.prevent="pageChanged(lastPage)"  class="page">
    <i class="fa fa-arrow-right"></i>
  </span>
  <span class="position">
      Current page: <input v-model.number="current" class="jump">
      Total page: {{ totalPages }}
  </span>
</div>
</template>
<script>
export default {
    props: {
        // Current Page
        currentPage: {
            type: Number,
            required: true
        },
        // Total number of pages
        totalPages: Number,
        // Items per page
        itemsPerPage: Number,
        // Total items
        totalItems: Number,
        // Visible Pages
        visiblePages: {
            type: Number,
            default: 5
        }
    },
    data() {
        return {
            current : this.currentPage
        }
    },
    watch: {
        current: function(val, oldVal) {
            this.pageChanged(val)
        }
    },
    computed: {
        lastPage () {
            if (this.totalPages) {
                return this.totalPages
            } else {
                return this.totalItems % this.itemsPerPage === 0
                ? this.totalItems / this.itemsPerPage
                : Math.floor(this.totalItems / this.itemsPerPage) + 1
            }
        },
        paginationRange () {
            var start = this.currentPage - this.visiblePages / 2 <= 0
                ? 1 : this.currentPage + this.visiblePages / 2 > this.lastPage
                ? Math.max(this.lastPage - this.visiblePages + 1, 1)
                : Math.ceil(this.currentPage - this.visiblePages / 2)

            var range = []

            for (var i = 0; i < this.visiblePages && i < this.lastPage; i++) {
                range.push(start + i)
            }

            return range
        }
    },
    methods: {
        activePage (pageNumber) {
            return this.currentPage === pageNumber ? 'active' : ''
        },
        pageChanged (pageNum) {
            this.$emit('page-changed', pageNum)
        }
    }
}
</script>
<style lang="scss" scoped>
.pagination {
    width: 100%;
    margin-bottom: 18px;
    @media screen and (max-width: 420px) {
        margin-bottom: 0px;
        height: 50px;
    }
}
.page {
    float: left;
    margin: 0 2px 5px 0;
    padding: 0 4px;
    min-width: 32px;
    height: 32px;
    border: none;
    border-radius: 1px;
    background-color: lightgrey;
    box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    color: #fff;
    text-align: center;
    text-shadow: 0 1px 1px rgba(0,0,0,0.1);
    font-weight: bold;
    font-size: 14px;
    line-height: 32px;
    cursor: pointer;
    @media screen and (max-width: 420px) {
        padding: 0px;
    }
    &:hover {
        background-color: #00a1d6;
    }
}
.active {
    background-color: #00a1d6;
    color: #fff;
    cursor: default;
}
.position {
    float: left;
    margin-left: 8px;
    height: 32px;
    color: #999;
    text-align: left;
    font-size: 14px;
    line-height: 32px;
    @media screen and (max-width: 420px) {
        margin: 0px;
    }
    .jump {
        margin: 0 4px;
        width: 38px;
        text-align: right;
        text-align: center;
    }
    .btn-jump {
        height: 22px;
        padding: 0 5px;
        background-color: #fff;
        border: 1px solid lightgrey;
        margin: 0 4px;
        &:hover {
            background-color: #3a9bd9;
            border: 1px solid #3a9bd9;
            color: #fff;
        }
    }
}
</style>