<template>
    <div class="content">
        <div class="row">
            <div class="col-12">
                <table class="table table-striped table-hover" style="width:100%">
                    <thead>
                        <tr>
                            <th v-for="(item, index) in tableColumns" :key="index">{{ item }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableData" :key="index">
                            <td>{{ item.id }}</td>
                            <td>{{ item.user_name }}</td>
                            <td>{{ item.product_name }}</td>
                            <td>{{ item.price_product }}</td>
                            <td>{{ item.user_request }}</td>
                            <td>{{ item.delivery_date }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ item.incurred }}</td>
                            <td class="operation">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
                                        <title>pen</title>
                                        <g stroke-width="1" fill="#212121" stroke="#212121">
                                            <path fill="none" stroke-linecap="round" stroke-linejoin="round"
                                                d="M10 2.5l2.5 2.5"></path>
                                            <path d="M5 12.5l8.85-8.81a1.79 1.79 0 1 0-2.54-2.54l-8.81 8.85-1.87 4.38z"
                                                fill="none" stroke="#212121" stroke-linecap="round" stroke-linejoin="round">
                                            </path>
                                        </g>
                                    </svg>
                                </span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <title>trash-can</title>
                                        <rect data-element="frame" x="0" y="0" width="24" height="24" rx="5" ry="5"
                                            stroke="none" fill="white"></rect>
                                        <g transform="translate(4.800000000000001 4.800000000000001) scale(0.6)"
                                            stroke-width="2" fill="#212121" stroke="#212121">
                                            <path d="M20,9l-.867,12.142A2,2,0,0,1,17.138,23H6.862a2,2,0,0,1-1.995-1.858L4,9"
                                                fill="none" stroke="#212121" stroke-linecap="square" stroke-miterlimit="10">
                                            </path>
                                            <line x1="1" y1="5" x2="23" y2="5" fill="none" stroke-linecap="square"
                                                stroke-miterlimit="10"></line>
                                            <path d="M8,5V1h8V5" fill="none" stroke-miterlimit="10"></path>
                                        </g>
                                    </svg>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Card
} from "@/components/index";

import BaseTable from "@/components/BaseTable";

const tableColumns = ["Id", "User Name", "Product Name", "Price Product", "User Request", "Delivery Date", "Quantity", "Incurred", "Operation"];
const tableData = [{
    id: 1,
    user_name: "Dakota Rice",
    product_name: "DIEN THOAI THONG MINH IP12 PROMAX",
    price_product: "$36.738",
    user_request: "Yêu cầu quán làm thêm ngày tháng năm sinh",
    delivery_date: "23-08-2005",
    quantity: "10",
    incurred: "No",
},
{
    id: 2,
    user_name: "Dakota Rice",
    product_name: "DIEN THOAI THONG MINH IP12 PROMAX",
    price_product: "$36.738",
    user_request: "Yêu cầu quán làm thêm ngày tháng năm sinh",
    delivery_date: "23-08-2005",
    quantity: "10",
    incurred: "No",
},
{
    id: 3,
    user_name: "Dakota Rice",
    product_name: "DIEN THOAI THONG MINH IP12 PROMAX",
    price_product: "$36.738",
    user_request: "Yêu cầu quán làm thêm ngày tháng năm sinh",
    delivery_date: "23-08-2005",
    quantity: "10",
    incurred: "No",
    },
{
    id: 4,
    user_name: "Dakota Rice",
    product_name: "DIEN THOAI THONG MINH IP12 PROMAX",
    price_product: "$36.738",
    user_request: "Yêu cầu quán làm thêm ngày tháng năm sinh",
    delivery_date: "23-08-2005",
    quantity: "10",
    incurred: "No",
    },
{
    id: 5,
    user_name: "Dakota Rice",
    product_name: "DIEN THOAI THONG MINH IP12 PROMAX",
    price_product: "$36.738",
    user_request: "Yêu cầu quán làm thêm ngày tháng năm sinh",
    delivery_date: "23-08-2005",
    quantity: "10",
    incurred: "No",
    },
{
    id: 6,
    user_name: "Dakota Rice",
    product_name: "DIEN THOAI THONG MINH IP12 PROMAX",
    price_product: "$36.738",
    user_request: "Yêu cầu quán làm thêm ngày tháng năm sinh",
    delivery_date: "23-08-2005",
    quantity: "10",
    incurred: "No",
},
];

export default {
    components: {
        Card,
        BaseTable,
    },
    data() {
        return {
            tableColumns: tableColumns,
            tableData: tableData,
        };
    },
};
</script>

<style>
.operation {
    padding: 0px;
}
.operation span {
    cursor: pointer;
    margin: 0 10px;
}
</style>
