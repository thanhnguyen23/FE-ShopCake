<template>
    <div class="content">
        <Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></Loading>
        <div class="filter d-flex justify-content-between">
            <div class="d-flex">
                <div class="detail">
                    <input type="text" class="form-control" placeholder="Search product name..." v-model="searchData.name" />
                </div>
                <div class="detail">
                    <input type="number" class="form-control" placeholder="From price" v-model="searchData.priceFrom" />
                </div>
                <div class="detail">
                    <input type="number" class="form-control" placeholder="To Price" v-model="searchData.priceTo" />
                </div>
                <div class="detail">
                    <select name="" class="form-control" id="" v-model="searchData.size">
                        <option value="" disabled selected>Select paginate</option>
                        <option value="8">8</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                    </select>
                </div>
            </div>
            <div class="d-flex">
                <div class="detail">
                    <button type="button" class="form-control" style="background: #28a745;"
                        @click="showModalDataDetail()">Tạo sản phẩm</button>
                </div>
                <div class="detail">
                    <button type="button" class="form-control" @click="getAll()">Lọc dữ liệu</button>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                <table class="table table-striped table-bordered table-hover" style="width:100%">
                    <thead>
                        <tr>
                            <th v-for="(item, index) in tableColumns" :key="index">{{ item }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in list_data" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.name }}</td>
                            <td style="width: 7%;"><img :src="urlImage + item.image" alt=""></td>
                            <td>{{ item.title }}</td>
                            <td>{{ formatMoney(item.price) }}</td>
                            <td>{{ item.ingredient }}</td>
                            <td>{{ item.size }}</td>
                            <td>
                                <span v-for="(cate, index) in item.categoryList" :key="index">{{ cate.name }}, </span>
                            </td>
                            <td class="operation">
                                <span @click="showModalDataDetail(index)">
                                    <i class="tim-icons icon-pencil"></i>
                                </span>
                                <span @click="deleteItem(item.id)">
                                    <i class="tim-icons icon-trash-simple"></i>
                                </span>
                            </td>
                        </tr>
                        <tr v-if="list_data.length < 1">
                            <td colspan="8">Không có dữ liệu</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <modal :show.sync="searchModalVisible" class="model-detail" id="editItem" :centered="false" :show-close="true">
            <div class="show-data-detail">
                <div class="content">
                    <label for="" class="control-label">Name <span style="color: red">*</span></label>
                    <input type="text" class="form-control" v-model="dataShowDetail.name" />
                </div>
                <div class="content">
                    <label for="" class="control-label">Title <span style="color: red">*</span></label>
                    <input type="text" class="form-control" v-model="dataShowDetail.title" />
                </div>
                <div class="content">
                    <label for="" class="control-label">Price <span style="color: red">*</span></label>
                    <input type="number" class="form-control" v-model="dataShowDetail.price" />
                </div>
                <div class="content">
                    <label for="" class="control-label">Ingredient <span style="color: red">*</span></label>
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
                    <label for="" class="control-label">Size</label>
                    <input type="text" class="form-control" v-model="dataShowDetail.size" />
                </div>
                <div class="content">
                    <label for="" class="control-label">Category <span style="color: red">*</span></label>
                    <Multiselect v-model="dataShowDetail.listCategoryId" :options="list_categorys"
                        placeholder="Chọn thể loại" label="name" track-by="id" :multiple="true" :close-on-select="false"
                        :clear-on-select="false" :preserve-search="true" :preselect-first="false">
                    </Multiselect>
                </div>
                <div class="content">
                    <label for="" class="control-label">Type product</label>
                    <select class="form-control">
                        <option value="1">Sản phẩm đặc biệt</option>
                        <option value="0">Sản phẩm thường</option>
                    </select>
                </div>
                <div class="content">
                    <label for="" class="control-label">image <span style="color: red">*</span></label>
                    <input type="file" @change="onFileChange" id="uploadFile">
                </div>
                <div class="content">
                    <p>Ảnh hiện tại</p>
                    <img :src="urlImage + dataShowDetail.current_image" id="preview-image-create">
                </div>
                <div class="content" v-if="dataShowDetail.id != 0">
                    <p>Ảnh chỉnh sửa</p>
                    <img src="" alt="" id="preview-image-edit">
                </div>
                <div class="content" style="display: inline-block;align-self: flex-end;width: 100%;">
                    <button type="button" class="form-control" style="background: #28a745;color: white;"
                        @click="createdItem()">Save</button>
                </div>
            </div>
        </modal>

        <Paginate :total-pages="pagination.total_page" :total="pagination.total" :per-page="pagination.per_page"
            :current-page="pagination.current_page" @pagechanged="onPageChange"></Paginate>
    </div>
</template>

<script>
import {
    Card
} from "@/components/index";

import BaseTable from "@/components/BaseTable";
import Modal from "@/components/Modal.vue";
import Paginate from "./paginate.vue";
import Multiselect from 'vue-multiselect';
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import NotificationTemplate from "../Notifications/NotificationTemplate";
import store from '../../store/index.js';

const tableColumns = ["STT", "Name", "Image", "Title", "Price", "Ingredient", "Size", "Category", "operation"];

export default {
    components: {
        Card,
        BaseTable,
        Modal,
        Paginate,
        Multiselect,
        Loading,
    },
    data() {
        return {
            urlImage: "http://103.187.5.254:8090/api/files/files/",
            isLoading: false,
            searchData: {
                name: null,
                priceTo: null,
                priceFrom: null,
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
                listCategoryId: [],
                image: null,
                title: null,
                decorate: null,
                size: null,
                color: null,
                special: 0,
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
        async getAll(page = null) {
            this.isLoading = true;
            if (page == null) {
                this.searchData.page = 1;
            } else {
                this.searchData.page = page;
            }
            await this.axios.post('/api/cake/getAll', this.searchData)
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
                    this.isLoading = false;
                })
                .catch(function (error) {
                    this.isLoading = false;
                    store.dispatch('auth/logout');
                    location.reload();
                });
        },
        showModalDataDetail(index = null) {
            this.isLoading = true;
            this.searchModalVisible = true;
            var uploadFile = document.getElementById("uploadFile");
            uploadFile.value = "";

            this.axios.post('/api/category/getAll', this.searchData)
                .then(response => {
                    this.list_categorys = response.data.data.result;
                })
                .catch(function (error) {
                    store.dispatch('auth/logout');
                    location.reload();
                });

            if (index != null) {
                this.axios.get(`/api/cake/findById/${this.list_data[index].id}`)
                    .then(response => {
                        var categoryList = this.list_data[index].categoryList;
                        this.dataShowDetail = {
                            id: response.data.data.id,
                            name: response.data.data.name,
                            price: response.data.data.price,
                            ingredient: response.data.data.ingredient,
                            listCategoryId: categoryList,
                            current_image: response.data.data.image,
                            image: response.data.data.image,
                            title: response.data.data.title,
                            decorate: response.data.data.decorate,
                            size: response.data.data.size,
                            color: response.data.data.color,
                            special: response.data.data.special,
                        }
                        const image = document.getElementById("preview-image-edit");
                        image.src = "";
                    })
                    .catch(function (error) {
                        // store.dispatch('auth/logout');
                        // location.reload();
                    });
            } else {
                this.dataShowDetail = {
                    id: 0,
                    name: null,
                    price: null,
                    ingredient: null,
                    listCategoryId: [],
                    current_image: null,
                    image: null,
                    title: null,
                    decorate: null,
                    size: null,
                    color: null,
                    special: 0,
                }
            }
            this.isLoading = false;
        },
        async createdItem() {
            if (this.isFormEmpty()) {
                this.notifyVue('danger', 'Vui lòng nhập đầy đủ các trường trên để thực hiện bước tiếp theo!');
                return;
            } 
            this.isLoading = true;
            const formData = new FormData();
            formData.append("file", this.dataShowDetail.image);

            var list_categoryId = "";
            this.dataShowDetail.listCategoryId.map((item) => {
                list_categoryId += `${item.id},`;
            });
            this.dataShowDetail.listCategoryId = list_categoryId;

            if (this.dataShowDetail.id == 0) {
                var updateImage = await this.updateImage(formData);
                if (updateImage == 1) {
                    this.axios.post('/api/cake/create', this.dataShowDetail, this.config)
                        .then(res => {
                            this.searchModalVisible = false;
                            this.getAll();
                            this.notifyVue('success', 'Thêm sản phầm thành công');
                        })
                        .catch(function (error) {
                            this.isLoading = false;
                            store.dispatch('auth/logout');
                            location.reload();
                        });
                }
            } else {
                var checkImageExist = await this.checkImageExist();
                if (checkImageExist == 1) {
                    this.axios.post(`/api/cake/update/${this.dataShowDetail.id}`, this.dataShowDetail, this.config)
                        .then(res => {
                            this.searchModalVisible = false;
                            this.getAll();
                            this.notifyVue('success', 'Chỉnh sửa thành công');
                        })
                        .catch(function (error) {
                            this.isLoading = false;
                            store.dispatch('auth/logout');
                            location.reload();
                        });
                } else {
                    var updateImage = await this.updateImage(formData);
                    if (updateImage == 1) {
                        this.axios.post(`/api/cake/update/${this.dataShowDetail.id}`, this.dataShowDetail, this.config)
                            .then(res => {
                                this.searchModalVisible = false;
                                this.getAll();
                                this.notifyVue('success', 'Chỉnh sửa thành công');
                            })
                            .catch(function (error) {
                                this.isLoading = false;
                                store.dispatch('auth/logout');
                                location.reload();
                            });
                    }
                }
            }
            this.getAll();
        },
        async updateImage(formData) {
            try {
                const configUpload = {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
                        'Content-Type': 'multipart/form-data'
                    },
                };

                var data = await this.axios.post('/api/files/upload', formData, configUpload);
                this.dataShowDetail.image = data.data;


                if (data) {
                    return 1;
                }
                return 2;
            } catch (e) {
                console.log(e);
            }
        },
        async deleteItem(id) {
            if (confirm("Bạn có chắn chắn muốn xóa bản ghi này không?")) {
                this.isLoading = true;
                await this.axios.get(`/api/cake/delete/${id}`, this.config)
                    .then(res => {
                        this.getAll();
                        this.notifyVue('success', 'Xóa thành công');
                        this.isLoading = false;
                    })
                    .catch(function (error) {
                        this.isLoading = false;
                        store.dispatch('auth/logout');
                        location.reload();
                    });
            }
        },
        async checkImageExist() {
            try {
                if (this.dataShowDetail.current_image == this.dataShowDetail.image) {
                    return 1;
                }
                return 2;
            } catch (e) {
                console.log(e);
            }
        },
        isFormEmpty() {
            const { name, price, ingredient, listCategoryId, current_image, image, title, decorate, size, color, } = this.dataShowDetail;
            return !name || !price || !ingredient || !title || !image || !listCategoryId;
        },
        notifyVue(color, message) {
            this.$notify({
                component: NotificationTemplate,
                icon: "tim-icons icon-bell-55",
                horizontalAlign: 'top',
                verticalAlign: 'right',
                type: color,
                timeout: 3000,
                message: message,
            });
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;

            if (files && this.dataShowDetail.id != 0) {
                const image = document.getElementById("preview-image-edit");
                image.src = URL.createObjectURL(files[0]);
            }
            if (this.dataShowDetail.id == 0) {
                const image = document.getElementById("preview-image-create");
                image.src = URL.createObjectURL(files[0]);
            }
            this.dataShowDetail.image = files[0];
        },
        formatMoney(amount) {
            return amount.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });
        },
        onPageChange(page) {
            this.searchData.page = page;
            this.getAll(page);
            this.pagination.current_page = page;
        }
    },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
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
    font-weight: 600;
}

.show-data-detail {
    display: flex;
    flex-wrap: wrap;
}

.show-data-detail>.content {
    width: 48%;
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
