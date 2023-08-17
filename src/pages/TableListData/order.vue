<template>
    <div class="content">
        <Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></Loading>
        <div class="filter">
            <div class="detail">
                <input type="text" class="form-control" placeholder="Search email..." />
            </div>
            <div class="detail">
                <input type="datetime-local" class="form-control" v-model="searchData.fromDate" />
            </div>
            <div class="detail">
                <input type="datetime-local" class="form-control" v-model="searchData.toDate" />
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
            <div class="detail">
                <select name="" id="" class="form-control" v-model="searchData.status">
                    <option :value="null">Tất cả đơn</option>
                    <option :value="1">Đơn mới</option>
                    <option :value="2">Đơn đã xác nhận</option>
                    <option :value="3">Đơn đang giao</option>
                    <option :value="4">Đơn hoàn thành</option>
                    <option :value="5">Đơn đã hủy</option>
                </select>
            </div>
            <div class="detail">
                <button type="button" class="form-control" @click="getAll()">Lọc dữ liệu</button>
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
                            <td>{{ item.email }}</td>
                            <td>{{ item.deliveryAddress }}</td>
                            <td>{{ item.phone }}</td>
                            <td>{{ momentFormatDate(item.deliveryDate) }}</td>
                            <td class="operation">
                                <span @click="showModalDataDetail(item.id)">
                                    <i class="tim-icons icon-zoom-split"></i>
                                </span>
                            </td>
                            <td v-html="checkStatusItem(item.status)"></td>
                            <td v-if="item.status == 1">
                                <span class="badge badge-primary" style="cursor: pointer; white-space: unset;" @click="updateStatusOrder(item.id, 'xác nhận')">Nhận đơn</span> <span class="badge badge-danger" style="cursor: pointer; white-space: unset;" @click="updateStatusOrder(item.id, 'từ chối')">Hủy đơn</span>
                            </td>
                            <td v-if="item.status == 2">
                                <span class='badge badge-info' style="cursor: pointer; white-space: unset;" @click="updateStatusOrder(item.id, 'vận chuyển')">Xác nhận giao hàng</span>
                            </td>
                            <td v-if="item.status == 3">
                                <span class='badge badge-success' style="cursor: pointer; white-space: unset;">Chờ xác nhận Hoàn thành</span>
                            </td>
                            <td v-if="item.status == 4">
                                <span class='badge badge-success' style="cursor: pointer; white-space: unset;">Đơn đã hoàn thành</span>
                            </td>
                            <td v-if="item.status == 5">
                                <span class='badge badge-secondary' style="cursor: pointer; white-space: unset;" disabled>Đã hủy</span>
                            </td>
                        </tr>
                        <tr v-if="list_data.length < 1">
                            <td colspan="10">Không có dữ liệu</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Paginate :total-pages="pagination.total_page" :total="pagination.total" :per-page="pagination.per_page"
            :current-page="pagination.current_page" @pagechanged="onPageChange"></Paginate>

        <modal :show.sync="searchModalVisible" class="model-detail" id="editItem" :centered="false" :show-close="true">
            <div class="show-data-detail">
                <table class="table table-striped table-bordered table-hover" style="width:100%">
                    <thead>
                        <tr>
                            <th v-for="(item, index) in tableColumns_dataDetail" :key="index">{{ item }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dataShowDetail" :key="index">
                            <td style="width: 10%;"><img :src="urlImage + item.image" alt=""></td>
                            <td>{{ item.nameCake }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ formatMoney(item.price) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </modal>

        <modal :show.sync="reasonCancelOrder" class="model-detail" id="reasonCancelOrder" :centered="false" :show-close="true">
                <div class="show-data-detail">
                    <label id="">Nhập lý do hủy đơn</label>
                    <textarea class="form-control" rows="3" placeholder="Nhập ở đây..." v-model="data_reason_cancel_order.reason"></textarea>
                    <button type="button" class="btn mt-2" @click="cancelOrder()">Submit</button>
                </div>
            </modal>
    </div>
</template>

<script>
import {
    Card
} from "@/components/index";

import BaseTable from "@/components/BaseTable";
import Modal from "@/components/Modal.vue";
import Paginate from "./paginate.vue";
import moment from 'moment';
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import NotificationTemplate from "../Notifications/NotificationTemplate";
import store from '../../store/index.js';

const tableColumns = ["STT", "User Name", "Email", "Delivery Address", "phone", "deliveryDate", "Detail", "status", "operation"];
const tableColumns_dataDetail = ["Image","Product Name", "Quantity", "Price"];

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
            urlImage: "http://103.187.5.254:8090/api/files/files/",
            searchModalVisible: false,
            reasonCancelOrder: false,
            data_reason_cancel_order: {
                id: 0,
                status: null,
                reason: null,
            },
            tableColumns: tableColumns,
            tableColumns_dataDetail: tableColumns_dataDetail,
            list_data: [],
            dataShowDetail: [],
            searchData: {
                size: 8,
                page: 1,
                userId: 0,
                status: null,
                fromDate: null,
                toDate: null
            },
            pagination: {
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
    mounted() {
        if (!this.$store.state.auth.status.loggedIn) {
            this.$router.push('/login');
        }
    },
    methods: {
        getAll(page = null) {
            this.isLoading = true;
            if (page == null) {
                this.searchData.page = 1;
            } else {
                this.searchData.page = page;
            }
            
            if (this.searchData.fromDate != null) {
                this.searchData.fromDate = this.momentFormatDate(this.searchData.fromDate);
            }
            if (this.searchData.toDate != null) {
                this.searchData.toDate = this.momentFormatDate(this.searchData.toDate);
            }

            this.axios.post('/api/order/getAll', this.searchData, this.config)
            .then(response  => {
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
                store.dispatch('auth/logout');
                location.reload();
            });
        },
        getDataDetail(id) {
            this.axios.get(`/api/order/findById/${id}`)
                .then(response => {
                this.dataShowDetail = response.data.data.detailDtoList;
            })
                .catch(function (error) {
                    console.log(error);
                store.dispatch('auth/logout');
                    location.reload();
            });
        },
        updateStatusOrder(id, status) {
            if (status == "từ chối") {
                this.reasonCancelOrder = true;
                this.data_reason_cancel_order.id = id;
                this.data_reason_cancel_order.status = status;
            } else {
                this.changeStatusOrder(id, status);
            }
            
        },
        cancelOrder() {
            this.changeStatusOrder(this.data_reason_cancel_order.id, this.data_reason_cancel_order.status);
        },
        changeStatusOrder(id, status) {
            this.isLoading = true;
            this.axios.post(`/api/order/procedure/${id}`, { procedure: `${status}`, reason: this.data_reason_cancel_order.reason }, this.config)
                .then(response => {
                    this.reasonCancelOrder = false;
                    this.notifyVue('success', 'Chuyển trạng thái thành công');
                    this.getAll();
                })
                .catch(function (error) {
                    this.isLoading = false;
                    store.dispatch('auth/logout');
                    location.reload();
                });
            this.getAll();
        },
        checkStatusItem(status) {
            switch (status) {
                case 1:
                    return `<span>Đơn mới</span>`;
                case 2:
                    return `<span>Đã xác nhận</span>`;
                case 3:
                    return `<span>Đang giao hàng</span>`;
                case 4:
                    return `<span>Hoàn thành</span>`;
                case 5:
                    return `<span>Đã hủy</span>`;
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
        momentFormatDate(date) {
            return moment(date).format('YYYY-MM-DD hh:mm');
        },
        formatMoney(amount) {
            return amount.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });
        },
        showModalDataDetail(id) {
            this.isLoading = true;
            this.searchModalVisible = true;
            this.getDataDetail(id);
            this.isLoading = false;
        },
        onPageChange(page) {
            this.searchData.page = page;
            this.getAll(page);
            this.pagination.current_page = page;
        }
    },
    created() {
        this.getAll();
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

.filter>.detail {
    margin: 5px;
}

.form-control:focus {
    border-color: rgba(29, 37, 59, 0.5);
}

.form-control {
    border-color: rgb(104 115 143 / 50%);
}

.detail button {
    white-space: pre-wrap;
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

</style>
