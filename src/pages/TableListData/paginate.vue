<template>
    <div class="pagination">
        <div class="pagination-operation">
            <button @click="onClickFirstPage" :disabled="isInFirstPage">Trang đầu</button>
            <button @click="onClickPreviousPage" :disabled="isInFirstPage">Trang trước</button>
            <button @click="onClickNextPage" :disabled="isInLastPage">Trang sau</button>
        </div>
        <div class="list-pagination">
            <ul v-for="(page, index) in pages" :key="index">
                <li :disabled="page.isDisabled" @click="onClickPage(page.name)" v-if="page.name > 0" :class="[{ active: isPageActive(page.name) }, 'paginate-button']">{{ page.name }}</li>
            </ul>
        </div>
        <div class="pagination-operation">
            <button @click="onClickLastPage" :disabled="isInLastPage">Trang cuối</button>
            <button>Trang {{ currentPage + "/" + totalPages }}</button>
            <button>{{ total }} kết quả</button>
        </div>
    </div>
</template>
<script>
    export default {
    name: "paginate",
    template: "#paginate",
    props: {
        maxVisibleButtons: {
            type: Number,
            required: false,
            default: 3,
        },
        totalPages: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        perPage: {
            type: Number,
            required: true,
        },
        currentPage: {
            type: Number,
            required: true,
        },
    },
    computed: {
        startPage() {
            if (this.currentPage === 1) {
                return 1;
            }

            if (this.currentPage === this.totalPages) {
                return this.totalPages - this.maxVisibleButtons + 1;
            }

            return this.currentPage - 1;
        },
        endPage() {
            return Math.min(
                this.startPage + this.maxVisibleButtons - 1,
                this.totalPages
            );
        },
        pages() {
            const range = [];

            for (let i = this.startPage; i <= this.endPage; i += 1) {
                range.push({
                    name: i,
                    isDisabled: i === this.currentPage,
                });
            }
            console.log(range);
            return range;
        },
        isInFirstPage() {
            return this.currentPage === 1;
        },
        isInLastPage() {
            return this.currentPage === this.totalPages;
        },
    },
    methods: {
        onClickFirstPage() {
            this.$emit("pagechanged", 1);
        },
        onClickPreviousPage() {
            this.$emit("pagechanged", this.currentPage - 1);
        },
        onClickPage(page) {
            this.$emit("pagechanged", page);
        },
        onClickNextPage() {
            this.$emit("pagechanged", this.currentPage + 1);
        },
        onClickLastPage() {
            this.$emit("pagechanged", this.totalPages);
        },
        isPageActive(page) {
            return this.currentPage === page;
        },
    },
};
</script >

<style>
    .pagination {
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.list-pagination {
    display: flex;
}
.list-pagination > ul > .active {
    background: linear-gradient(0deg, #3358f4 0%, #1d8cf8 100%);
    color: #fff;
    border: 1px solid transparent;
}

.list-pagination>ul {
    padding: 0px;
    margin: 0px;
}
.list-pagination > ul > li {
    margin-bottom: 5px;
    color: gray;
    text-align: center;
    display: inline-block;
    width: 35px;
    height: 35px;
    line-height: 35px;
    border-radius: 10px;
    border: 1px solid rgb(104 115 143 / 50%);
    cursor: pointer;
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 3px;
}
.pagination-operation button {
    border: none;
    padding: 6px 20px;
    margin: 5px;
    color: black;
    border-radius: 5px;
    border: 1px solid rgb(104 115 143 / 50%);
    cursor: pointer;
}

</style>