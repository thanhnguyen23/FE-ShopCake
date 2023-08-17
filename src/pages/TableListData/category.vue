<template>
    <div class="content">
        <Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></Loading>
        <div class="filter d-flex justify-content-between">
            <div class="d-flex">
                <div class="detail">
                    <input type="text" class="form-control" placeholder="Search name category..." v-model="searchData.name" />
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
                        @click="showModalDataDetail()">Tạo thể loại</button>
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
                            <td>{{ index+1 }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.description }}</td>
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
                            <td colspan="6">Không có dữ liệu</td>
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
                        <label for="" class="control-label">Desription <span style="color: red">*</span></label>
                        <input type="text" class="form-control" v-model="dataShowDetail.description" />
                    </div>
                <div class="content" style="display: inline-block;align-self: flex-end;">
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
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import NotificationTemplate from "../Notifications/NotificationTemplate";
import store from '../../store/index.js';

const tableColumns = ["STT", "Name", "Desription", "operation"];

export default {
    components: {
        Card,
        BaseTable,
        Modal,
        Paginate,
        Loading,
    },
    data() {
        return {
            isLoading: false,
            searchData: {
                name: null,
                size: 8,
                page: 1,
            },
            searchModalVisible: false,
            tableColumns: tableColumns,
            list_data: [],
            dataShowDetail: {
                id: null,
                name: null,
                description: null,
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
            this.isLoading = true;
            this.axios.post('/api/category/getAll', this.searchData)
                .then(response => {
                    if (response.data.data != null) {
                        this.pagination.total = response.data.data.totalItems;
                        this.pagination.current_page = response.data.data.pageNumber;
                        this.pagination.per_page = response.data.data.pageSize;
                        this.pagination.total_page = response.data.data.totalPages;
                        this.list_data = response.data.data.result;
                    } else {
                        this.pagination.total = 0;
                        this.pagination.current_page = 0;
                        this.pagination.per_page = this.searchData.size;
                        this.pagination.total_page = 0;
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
        getDataDetail(id) {
            this.axios.get(`/api/cake/findById/${id}`)
                .then(response => {
                    this.dataShowDetail = response.data.data;
                })
                .catch(function (error) {
                    store.dispatch('auth/logout');
                    location.reload();
                });
        },
        showModalDataDetail(index = null) {
            this.isLoading = true;
            this.searchModalVisible = true;

            if (index != null) {
                this.dataShowDetail = {
                    id: this.list_data[index].id,
                    name: this.list_data[index].name,
                    description: this.list_data[index].description,
                }
            } else {
                this.dataShowDetail = {
                    id: 0,
                    name: null,
                    description: null,
                }
            }
            this.isLoading = false;
        },
        createdItem() {
            if (this.isFormEmpty) {
                this.notifyVue('danger', 'Vui lòng nhập đầy đủ các trường trên để thực hiện bước tiếp theo!');
                return;
            }
            this.isLoading = true;
            if (this.dataShowDetail.id == 0) {
                this.axios.post('/api/category/create', this.dataShowDetail, this.config)
                    .then(res => {
                        this.isLoading = false;
                        this.notifyVue('success', 'Thêm thành công');
                        this.getAll();
                        this.searchModalVisible = false;
                    })
                    .catch(function (error) {
                        this.isLoading = false;
                        store.dispatch('auth/logout');
                        location.reload();
                    });
            } else {
                this.axios.post(`/api/category/update/${this.dataShowDetail.id}`, this.dataShowDetail, this.config)
                    .then(res => {
                        this.isLoading = false;
                        this.notifyVue('success', 'Cập nhật thành công');
                        this.getAll();
                        this.searchModalVisible = false;
                    })
                    .catch(function (error) {
                        this.isLoading = false;
                        store.dispatch('auth/logout');
                        location.reload();
                    });
            }
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
        deleteItem(id) {
            if (confirm("Bạn có chắn chắn muốn xóa bản ghi này không?")) {
                this.axios.get(`/api/category/delete/${id}`, this.config)
                .then(res => {
                    this.notifyVue('success', 'Xóa thành công');
                    this.getAll();
                })
                .catch(function (error) {
                    store.dispatch('auth/logout');
                    location.reload();
                });
            }
        },
        isFormEmpty() {
            const { name, description } = this.dataShowDetail;
            return !name || !description;
        },
        onPageChange(page) {
            this.searchData.page = page;
            this.getAll();
            this.pagination.current_page = page;
        }
    },
};
</script>

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
}

.show-data-detail {
    display: flex;
    flex-wrap: wrap;
}

.show-data-detail>.content {
    width: 31%;
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
}</style>
