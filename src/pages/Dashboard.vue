<template>
<div class="content">
    <div class="row">
        <div class="col-12">
            <card type="chart">
                <template slot="header">
                    <div class="row">
                        <div class="col-sm-6" :class="isRTL ? 'text-right' : 'text-left'">
                            <template v-if="!isRTL">
                                <h5 class="card-category">Total Shipments</h5>
                            </template>
                            <template v-else>
                                <h5 class="card-category">مجموع الشحنات</h5>
                            </template>
                            <template v-if="!isRTL">
                                <h2 class="card-title">Performance</h2>
                            </template>
                            <template v-else>
                                <h2 class="card-title">أداء</h2>
                            </template>
                        </div>
                    </div>
                </template>
                <line-chart class="chart-area" ref="bigChart" chart-id="big-line-chart" :chart-data="bigLineChart.chartData" :gradient-colors="bigLineChart.gradientColors" :gradient-stops="bigLineChart.gradientStops" :extra-options="bigLineChart.extraOptions">
                </line-chart>
            </card>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12 col-md-12">
            <card class="card">
                <h4 slot="header" class="card-title">
                    <template v-if="!isRTL">Top user order</template>
                    <template v-else> جدول بسيط </template>
                </h4>
                <div class="table-responsive">
                    <table class="table tablesorter text-primary text-left">
                        <thead>
                            <tr>
                                <slot name="columns">
                                    <th v-for="column in columsTableTopUser" :key="column">{{ column }}</th>
                                </slot>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(item, index) in dataTableTopUser" :key="index">
                                <td>{{ item.name  }}</td>
                                <td>{{ item.email  }}</td>
                                <td>{{ item.address  }}</td>
                                <td>{{ formatMoney(item.totalMoney) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </card>
        </div>
    </div>
</div>
</template>

<script>
import {
    Card
} from "@/components/index";

import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";
import * as chartConfigs from "@/components/Charts/config";
import TaskList from "./Dashboard/TaskList";
import UserTable from "./Dashboard/UserTable";
import config from "@/config";

export default {
    components: {
        Card,
        LineChart,
        BarChart,
        TaskList,
        UserTable,
    },
    data() {
        return {
            config: {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
                },
            },
            columsTableTopUser: ['Name', 'Email', 'Address', 'Total Money'],
            dataTableTopUser: [],
            searchData: {
                size: 100000000,
                page: 1,
                userId: 0,
                status: 4,
                fromDate: new Date().getFullYear() + "-01-01 00:00",
                toDate: new Date().getFullYear() + "-12-31 00:00",
            },
            bigLineChartCategories: ["Accounts", "Purchases", "Sessions"],
            bigLineChartCategoriesAr: ["حسابات", "المشتريات", "جلسات"],
            bigLineChart: {
                allData: [
                    [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
                    [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
                    [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130],
                ],
                activeIndex: 0,
                chartData: {
                    datasets: [{}]
                },
                extraOptions: chartConfigs.purpleChartOptions,
                gradientColors: config.colors.primaryGradient,
                gradientStops: [1, 0.4, 0],
                categories: [],
            },
        };
    },
    computed: {
        enableRTL() {
            return this.$route.query.enableRTL;
        },
        isRTL() {
            return this.$rtl.isRTL;
        },
    },
    created() {
        this.monthlyCounts();
        this.getDataTableTopUser();
    },
    methods: {
        async monthlyCounts() {
            var data_order = [];
            var completedCount = [];
            var completedOrdersByMonth = [];

            await this.axios.post('/api/order/getAll', this.searchData, this.config)
                .then(response => {
                    this.isLoading = false;
                    data_order = response.data.data.result;
                })
                .catch(function (error) {
                    console.log(error);
                });

            data_order.forEach(order => {
                const date = new Date(order.createdAt);
                const month = date.getMonth();
                if (!completedOrdersByMonth[month]) {
                    completedOrdersByMonth[month] = 1;
                } else {
                    completedOrdersByMonth[month]++;
                }
            });

            // In ra kết quả thống kê
            for (let month = 1; month <= 12; month++) {
                completedCount.push(completedOrdersByMonth[month] || 0);
            }
            this.initBigChart(0, completedCount);
        },
        getDataTableTopUser() {
            var current_date = new Date();
            var current_month = current_date.getMonth();
            const data_search = {
                "fromDate": `01-0${current_month + 1}-2023`,
                "toDate": `29-0${current_month + 1}-2023`,
                "status": 3,
                "limit": 10
            };
            this.axios.post('/api/order/topUserOrder', data_search, this.config)
                .then(response => {
                    this.isLoading = false;
                    this.dataTableTopUser = response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        initBigChart(index, data) {
            let chartData = {
                datasets: [{
                    fill: true,
                    borderColor: config.colors.primary,
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    pointBackgroundColor: config.colors.primary,
                    pointBorderColor: "rgba(255,255,255,0)",
                    pointHoverBackgroundColor: config.colors.primary,
                    pointBorderWidth: 20,
                    pointHoverRadius: 4,
                    pointHoverBorderWidth: 15,
                    pointRadius: 4,
                    data: data,
                }, ],
                labels: [
                    "JAN",
                    "FEB",
                    "MAR",
                    "APR",
                    "MAY",
                    "JUN",
                    "JUL",
                    "AUG",
                    "SEP",
                    "OCT",
                    "NOV",
                    "DEC",
                ],
            };
            this.$refs.bigChart.updateGradients(chartData);
            this.bigLineChart.chartData = chartData;
            this.bigLineChart.activeIndex = index;
        },
        formatMoney(amount) {
            return amount.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });
        },
    },
    mounted() {
        this.i18n = this.$i18n;
        if (this.enableRTL) {
            this.i18n.locale = "ar";
            this.$rtl.enableRTL();
        }
        // this.initBigChart(0);
        if (!this.$store.state.auth.status.loggedIn) {
            window.location.href = "/#/login";
        }
    },
    beforeDestroy() {
        if (this.$rtl.isRTL) {
            this.i18n.locale = "en";
            this.$rtl.disableRTL();
        }
    },
};
</script>

<style></style>
