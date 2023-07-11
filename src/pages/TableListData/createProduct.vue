<template>
<div class="content">
    <div class="row mt-3">
        <div class="content">
            <label for="" class="control-label">Name</label>
            <input type="text" class="form-control" v-model="dataShowDetail.name" />
        </div>
        <div class="content">
            <label for="" class="control-label">Title</label>
            <input type="text" class="form-control" v-model="dataShowDetail.title" />
        </div>
        <div class="content">
            <label for="" class="control-label">Price</label>
            <input type="text" class="form-control" v-model="dataShowDetail.price" />
        </div>
        <div class="content">
            <label for="" class="control-label">Ingredient</label>
            <input type="text" class="form-control" v-model="dataShowDetail.ingredient" />
        </div>
        <div class="content">
            <label for="" class="control-label">Color</label>
            <input type="text" class="form-control" v-model="dataShowDetail.color" />
        </div>
        <div class="content">
            <label for="" class="control-label">Decorate</label>
            <input type="text" class="form-control" v-model="dataShowDetail.decorate" />
        </div>
        <div class="content">
            <label for="" class="control-label">Reason</label>
            <input type="text" class="form-control" v-model="dataShowDetail.reason" />
        </div>
        <div class="content">
            <label for="" class="control-label">Size</label>
            <input type="text" class="form-control" v-model="dataShowDetail.size" />
        </div>
        <div class="content">
            <label for="" class="control-label">Category</label>
            <select v-model="dataShowDetail.listCategoryId" class="form-control">
                <option v-for="(item, index) in list_categorys" :value="item.id" :key="index">{{ item.name }}
                </option>
            </select>
        </div>
        <div class="content">
            <label for="" class="control-label">image</label>
            <input type="file" @change="onFileChange">
        </div>
        <div class="content" style="display: inline-block;align-self: flex-end;">
            <button type="button" class="form-control" style="background: #28a745;color: white;" @click="createdItem()">Save</button>
        </div>
    </div>
</div>
</template>

<script>
import {
    Card
} from "@/components/index";

import BaseTable from "@/components/BaseTable";
import Modal from "@/components/Modal.vue";
import Paginate from "./paginate.vue";

const tableColumns = ["Id", "Name", "Image", "Title", "Price", "Ingredient", "Desription", "operation"];

export default {
    components: {
        Card,
        BaseTable,
        Modal,
        Paginate,
    },
    data() {
        return {
            searchData: {
                name: null,
                priceTo: 1000000000000000000,
                priceFrom: 0,
                size: 8,
                page: 1,
            },
            searchModalVisible: false,
            tableColumns: tableColumns,
            list_data: [],
            list_categorys: [],
            dataShowDetail: {
                id: null,
                name: null,
                price: null,
                ingredient: null,
                listCategoryId: null,
                image: null,
                title: null,
                decorate: null,
                note: null,
                size: null,
                color: null,
                reason: null,
            },
            pagination: {
                path: "",
                total: 0,
                current_page: 1,
                per_page: 8,
                total_page: 0,
            },
            config: {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
                },
            },
        };
    },
    created() {
        this.getAll();
    },
    mounted() {
        if (!this.$store.state.auth.status.loggedIn) {
            this.$router.push('/login');
        }
    },
    methods: {
        getAll() {
            this.axios.post('/api/cake/getAll', this.searchData)
                .then(response => {
                    if (response.data.data != null) {
                        this.pagination.total = response.data.data.totalItems;
                        this.pagination.current_page = response.data.data.pageNumber;
                        this.pagination.per_page = response.data.data.pageSize;
                        this.pagination.total_page = response.data.data.totalPages;
                        this.searchData.size = response.data.data.pageSize;
                        this.list_data = response.data.data.result;
                    } else {
                        this.pagination.total = 0;
                        this.pagination.current_page = 0;
                        this.pagination.per_page = this.searchData.size;
                        this.pagination.total_page = 0;
                        this.searchData.size = this.searchData.size;
                        this.list_data = [];
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getDataDetail(id) {
            this.axios.get(`/api/cake/findById/${id}`)
                .then(response => {
                    this.dataShowDetail = response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        showModalDataDetail(index = null) {
            this.searchModalVisible = true;

            this.axios.post('/api/category/getAll', this.searchData)
                .then(response => {
                    this.list_categorys = response.data.data.result;
                    console.log(this.list_categorys);
                })
                .catch(function (error) {
                    console.log(error);
                });

            if (index != null) {
                this.dataShowDetail = {
                    id: this.list_data[index].id,
                    name: this.list_data[index].name,
                    price: this.list_data[index].price,
                    ingredient: this.list_data[index].ingredient,
                    listCategoryId: this.list_data[index].listCategoryId,
                    image: this.list_data[index].image,
                    title: this.list_data[index].title,
                    decorate: this.list_data[index].decorate,
                    note: this.list_data[index].note,
                    size: this.list_data[index].size,
                    color: this.list_data[index].color,
                    reason: this.list_data[index].reason,
                }
            } else {
                this.dataShowDetail = {
                    id: 0,
                    name: null,
                    price: null,
                    ingredient: null,
                    listCategoryId: null,
                    image: null,
                    title: null,
                    decorate: null,
                    note: null,
                    size: null,
                    color: null,
                    reason: null,
                }
            }
        },
        createdItem() {
            const formData = new FormData();
            formData.append("file", this.dataShowDetail.image);

            const configUpload = {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
                    'Content-Type': 'multipart/form-data'
                },
            };

            if (this.dataShowDetail.id == 0) {
                this.axios.post('/api/files/upload', formData, configUpload)
                    .then(response => {
                        this.dataShowDetail.image = response.data;

                        this.axios.post('/api/cake/create', this.dataShowDetail, this.config)
                            .then(res => {
                                alert('Thêm thành công');
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                this.axios.post('/api/files/upload', formData, configUpload)
                    .then(response => {
                        this.dataShowDetail.image = response.data;

                        this.axios.post(`/api/cake/update/${this.dataShowDetail.id}`, this.dataShowDetail, this.config)
                            .then(res => {
                                alert('Chỉnh sửa thành công');
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        deleteItem(id) {
            this.axios.get(`/api/cake/delete/${id}`, this.config)
                .then(res => {
                    alert('Xóa thành công');
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.dataShowDetail.image = files[0];
        },
        onPageChange(page) {
            this.searchData.page = page;
            this.getAll();
            this.pagination.current_page = page;
        }
    },
};
</script>

<style>
button:focus {
    outline: none;
}

.operation span {
    cursor: pointer;
    margin: 0 10px;
}

.filter {
    display: flex;
    background: #dde3e0;
    padding: 14px;
    border-radius: 5px;
}

.filter .detail {
    margin: 5px;
}

.form-control:focus {
    border-color: rgba(29, 37, 59, 0.5);
}

.form-control {
    border-color: rgb(104 115 143 / 50%);
}

.detail button {
    white-space: nowrap;
    background: linear-gradient(0deg, #3358f4 0%, #1d8cf8 100%);
    color: white;
    border: none;
}

table thead th {
    border: 0.0625rem solid #e3e3e3 !important;
}

table tbody td {
    border: 0.0625rem solid #e3e3e3 !important;
}

.control-label {
    margin: 0px;
}

.show-data-detail {
    display: flex;
    flex-wrap: wrap;
}

.show-data-detail>.content {
    width: 23%;
    margin: 1%;
    text-align: left;
}

.show-data-detail>.content>input {
    width: 100%;
}

.file-input__input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.file-input__label {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    border-radius: 4px;
    font-weight: 600;
    color: #fff;
    width: 100%;
    padding: 4.9px 12px;
    background-color: #4245a8;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25);
}

.file-input__label svg {
    height: 16px;
    margin-right: 4px;
}
</style>
