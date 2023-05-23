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
                      <td>{{ item.name }}</td>
                      <td>{{ item.salary }}</td>
                      <td>{{ item.country }}</td>
                      <td>{{ item.city }}</td>
                      <td class="operation">
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><title>pen</title><g stroke-width="1" fill="#212121" stroke="#212121"><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M10 2.5l2.5 2.5"></path><path d="M5 12.5l8.85-8.81a1.79 1.79 0 1 0-2.54-2.54l-8.81 8.85-1.87 4.38z" fill="none" stroke="#212121" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
                        </span>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>trash-can</title><rect data-element="frame" x="0" y="0" width="24" height="24" rx="5" ry="5" stroke="none" fill="white"></rect><g transform="translate(4.800000000000001 4.800000000000001) scale(0.6)" stroke-width="2" fill="#212121" stroke="#212121"><path d="M20,9l-.867,12.142A2,2,0,0,1,17.138,23H6.862a2,2,0,0,1-1.995-1.858L4,9" fill="none" stroke="#212121" stroke-linecap="square" stroke-miterlimit="10"></path><line x1="1" y1="5" x2="23" y2="5" fill="none" stroke-linecap="square" stroke-miterlimit="10"></line><path d="M8,5V1h8V5" fill="none" stroke-miterlimit="10"></path></g></svg>
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

const tableColumns = ["Id", "Name", "Price", "Amount", "Desription", "operation"];
const tableData = [{
        id: 1,
        name: "Dakota Rice",
        salary: "$36.738",
        country: "10",
        city: "Oud-Turnhout",
    },
    {
        id: 2,
        name: "Minerva Hooper",
        salary: "$23,789",
        country: "20",
        city: "Sinaai-Waas",
    },
    {
        id: 3,
        name: "Sage Rodriguez",
        salary: "$56,142",
        country: "6",
        city: "Baileux",
    },
    {
        id: 4,
        name: "Philip Chaney",
        salary: "$38,735",
        country: "8",
        city: "Overland Park",
    },
    {
        id: 5,
        name: "Doris Greene",
        salary: "$63,542",
        country: "9",
        city: "Feldkirchen in Kärnten",
    },
    {
        id: 6,
        name: "Mason Porter",
        salary: "$98,615",
        country: "10",
        city: "Gloucester",
    },
    {
        id: 7,
        name: "Jon Porter",
        salary: "$78,615",
        country: "3",
        city: "Gloucester",
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
  .operation span {
    cursor: pointer;
    margin: 0 10px;
  }
</style>
